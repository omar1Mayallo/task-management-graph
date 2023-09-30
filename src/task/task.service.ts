import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListService } from 'src/list/list.service';
import { User } from 'src/user/user.entity';
import { Between, Repository } from 'typeorm';
import { CreateTaskInput } from './dto/create-task.dto';
import { GetAllTasksInput } from './dto/get-all-tasks.dto';
import { UpdateTaskInput } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TagService } from 'src/tag/tag.service';
import {
  Next7DaysTasksResponse,
  PaginationStatus,
  TaskPaginationResponse
} from './graphql/pagination-response.type';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private listsServices: ListService,
    private tagsService: TagService
  ) {}

  // _____________________CRUD_____________________ //
  // CREATE TASK
  async createTask(user: User, body: CreateTaskInput): Promise<Task> {
    const { title, listId } = body;

    // 1) CREATE Task Generally
    const newTask = this.tasksRepository.create({
      title,
      user
    });

    // 2) If ListId is provided, create task associated with specified list
    if (listId) {
      const list = await this.listsServices.getList(user.id, listId);

      newTask.list = list;
    }

    // 3) Save Task
    return await this.tasksRepository.save(newTask);
  }

  // GET TASK
  async getTask(userId: number, taskId: number, withDeleted?: boolean): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId, user: { id: userId } },
      relations: ['user', 'list', 'tags'],
      withDeleted
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  // UPDATE TASK
  async updateTask(userId: number, taskId: number, body: UpdateTaskInput): Promise<Task> {
    const { title, notes, reminder, listId } = body;

    // 1) GET The Task
    const task = await this.getTask(userId, taskId);

    // 2) Check Is This Task Belongs To This User
    if (task.user.id !== userId) {
      throw new UnauthorizedException(`You are not authorized to modify this task`);
    }

    // 3) Update Task
    if (title) {
      task.title = title;
    }
    if (notes) {
      task.notes = notes;
    }
    if (reminder) {
      task.reminder = reminder;
    }
    if (listId) {
      const list = await this.listsServices.getList(userId, listId);
      task.list = list;
    }

    // 4) Save the updated task
    return await this.tasksRepository.save(task);
  }

  // TOGGLE TASK STATUS
  async toggleTaskStatus(userId: number, taskId: number): Promise<Task> {
    // 1) GET The Task
    const task = await this.getTask(userId, taskId);

    // 3) Toggle the Task Status
    task.completed = !task.completed;

    // 4) Save the updated Task
    return await this.tasksRepository.save(task);
  }

  // ADD SUBTASKS To Task
  async addSubtaskToTask(userId: number, taskId: number, title: string) {
    const parentTask = await this.getTask(userId, taskId);

    if (!parentTask) {
      throw new NotFoundException('Parent task not found');
    }

    const subtask = this.tasksRepository.create({ title });
    subtask.parentTaskId = parentTask.id;

    return await this.tasksRepository.save(subtask);
  }

  // ADD TAGS To Task
  async addTagsToTask(userId: number, taskId: number, tagsIds: number[]): Promise<Task> {
    const task = await this.getTask(userId, taskId);

    const tags = await this.tagsService.findTagsByIds(tagsIds);

    task.tags = tags;
    return await this.tasksRepository.save(task);
  }

  // _____________________MY_DAY_____________________ //
  // TOGGLE TASK TO OR FROM MY DAY
  async toggleToMyDay(userId: number, taskId: number): Promise<Task> {
    // 1) GET Task
    const task = await this.getTask(userId, taskId);

    // 2) Add or Remove To or from My Day
    task.isBelongToMyDay = !task.isBelongToMyDay;

    // 3) Save Changes
    return await this.tasksRepository.save(task);
  }

  // GET MY_DAY_TASKS
  async getMyDayTasks(userId: number): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: {
        user: { id: userId },
        isBelongToMyDay: true
      },
      relations: ['tags', 'list']
    });
  }

  // CREATE MY_DAY_TASK
  async createMyDayTask(user: User, title: string): Promise<Task> {
    const newTask = this.tasksRepository.create({
      title,
      user,
      isBelongToMyDay: true
    });
    return await this.tasksRepository.save(newTask);
  }

  // _____________________NEXT_7DAYS_____________________ //
  // GET NEXT 7 DAYS TASKS
  async getNext7DaysTasks(userId: number): Promise<Next7DaysTasksResponse[]> {
    // We need to get tasks within next 7 days which next7DaysDate <= reminder <= nowDate
    // 1) Get The Time Between Now and Next 7Days Date
    const currentDate = new Date();
    const next7DaysDate = new Date();
    next7DaysDate.setDate(currentDate.getDate() + 7);

    // 2) Get All Next7DaysTasks and ordered by +reminder
    const tasks = await this.tasksRepository.find({
      where: {
        user: { id: userId },
        reminder: Between(currentDate, next7DaysDate)
      },
      order: { reminder: 'ASC' },
      relations: ['tags', 'list']
    });

    // 3) We Need To Make Workaround To Aggregate The TasksResult By Day [also we can make this in frontend]
    const tasksByDay = tasks.reduce((acc, task) => {
      // 3-1) Extract the day portion of the reminder timestamp
      const reminderDate = new Date(task.reminder);
      const day = reminderDate.toLocaleDateString('en-US', { weekday: 'long' });

      // 3-2) Push the current task into the array corresponding to its reminder day.
      if (!acc[day]) {
        acc[day] = []; // start with empty array for every day
      }
      acc[day].push(task);

      return acc;
    }, {});

    // 3-3) Convert the grouped tasks into the form {day: string, task: Task[]}
    const groupedTasks = Object.keys(tasksByDay).map(day => ({
      day,
      tasks: tasksByDay[day]
    }));

    return groupedTasks;
  }

  // _____________________ARCHIVE_____________________ //
  // DELETE OR ARCHIVE TASK
  async deleteTask(userId: number, taskId: number, deleteType: 'SOFT' | 'FORCE'): Promise<void> {
    // 1) Find Task(withDeleted)
    const task = await this.getTask(userId, taskId, true);

    if (deleteType === 'SOFT') {
      // 2) Soft DELETE(just send task to archive)
      await this.tasksRepository.softDelete(taskId);
    } else {
      // 3) Force DELETE(delete task which in or out archive)
      await this.tasksRepository.remove(task);
    }
  }

  // RETURN TASK FROM ARCHIVE (deleteAt: null)
  async unArchivedTask(userId: number, taskId: number): Promise<Task> {
    const task = await this.getTask(userId, taskId, true);
    // Check If Task Not In Archive
    if (task.deletedAt === null) {
      throw new BadRequestException('This Task Not Archived Yet');
    }
    task.deletedAt = null;
    return this.tasksRepository.save(task);
  }

  // GET ARCHIVE(implement search feature by title or notes, order by recently added)
  async getArchivedTasks(userId: number, searchQuery: string = ''): Promise<Task[]> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .withDeleted()
      .where('task.user = :userId', { userId })
      .andWhere('task.deletedAt IS NOT NULL');

    if (searchQuery) {
      query.andWhere('(task.title ILIKE :searchQuery OR task.notes ILIKE :searchQuery)', {
        searchQuery: `%${searchQuery}%`
      });
    }

    query.orderBy('task.deletedAt', 'DESC');

    const tasks = await query.getMany();
    return tasks;
  }

  // _____________________ALL_TASKS_____________________ //
  // GET ALL TASKS(implement Searching, Pagination, Sorting features)
  async getAllTasks(userId: number, dto: GetAllTasksInput): Promise<TaskPaginationResponse> {
    const { search = '', page = 1, limit = 10, sort } = dto;

    const query = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.user.id = :userId', { userId });

    // SEARCHING (by title and notes)
    if (search) {
      query.andWhere('(task.title ILIKE :searchQuery OR task.notes ILIKE :searchQuery)', {
        searchQuery: `%${search}%`
      });
    }

    // SORTING
    if (sort) {
      const sortFields = sort.split(',');
      for (const sortField of sortFields) {
        const [field, order] = sortField.split(':');
        query.addOrderBy(`task.${field}`, order.toLowerCase() === 'desc' ? 'DESC' : 'ASC');
      }
    } else {
      query.orderBy('task.createdAt', 'DESC');
    }

    // PAGINATION
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit).relation('tags', 'list');

    // Pagination status
    const count = await query.getCount();
    const paginationStatus: PaginationStatus = {};
    paginationStatus.currentPage = +page;
    paginationStatus.numOfItemsPerPage = +limit;
    paginationStatus.numOfPages = Math.ceil(count / +limit);

    const lastItemIdxInPage = +page * +limit;
    // Q: when previousPage is exist?
    if (lastItemIdxInPage < count) {
      paginationStatus.nextPage = +page + 1;
    }
    // Q: when previousPage is exist?
    if (skip > 0) {
      paginationStatus.previousPage = +page - 1;
    }

    const tasks = await query.getMany();

    console.log(tasks);

    return {
      paginationStatus,
      count,
      tasks
    };
  }
}
