import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskInput } from './dto/create-task.dto';
import { UpdateTaskInput } from './dto/update-task.dto';
import { Task } from './task.entity';
import { GetAllTasksInput } from './dto/get-all-tasks.dto';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Next7DaysTasksResponse, TaskPaginationResponse } from './graphql/pagination-response.type';
import { StatusResponse } from 'src/user/graphql/status-res.type';

@Resolver('Task')
@UseGuards(JwtAuthGuard)
export class TasksResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  async createTask(
    @CurrentUser() user: User,
    @Args('createTaskInput') createTaskInput: CreateTaskInput
  ): Promise<Task> {
    return await this.taskService.createTask(user, createTaskInput);
  }

  @Query(() => TaskPaginationResponse)
  async getAllTasks(
    @CurrentUser() user: User,
    @Args('getAllTasksInput') getAllTasksInput: GetAllTasksInput
  ): Promise<TaskPaginationResponse> {
    return await this.taskService.getAllTasks(user.id, getAllTasksInput);
  }

  @Query(() => [Task])
  async getMyDayTasks(@CurrentUser() user: User): Promise<Task[]> {
    return await this.taskService.getMyDayTasks(user.id);
  }

  @Mutation(() => Task)
  async createMyDayTask(@CurrentUser() user: User, @Args('title') title: string): Promise<Task> {
    return await this.taskService.createMyDayTask(user, title);
  }

  @Query(() => [Next7DaysTasksResponse])
  async getNext7DaysTasks(@CurrentUser() user: User): Promise<Next7DaysTasksResponse[]> {
    return await this.taskService.getNext7DaysTasks(user.id);
  }

  @Query(() => [Task])
  async getArchivedTasks(
    @CurrentUser() user: User,
    @Args('search') searchQuery: string
  ): Promise<Task[]> {
    return await this.taskService.getArchivedTasks(user.id, searchQuery);
  }

  @Mutation(() => Task)
  async toggleToMyDay(@CurrentUser() user: User, @Args('taskId') taskId: number): Promise<Task> {
    return await this.taskService.toggleToMyDay(user.id, taskId);
  }

  @Query(() => Task)
  async getTask(@CurrentUser() user: User, @Args('taskId') taskId: number): Promise<Task> {
    return await this.taskService.getTask(user.id, taskId);
  }

  @Mutation(() => Task)
  async updateTask(
    @CurrentUser() user: User,
    @Args('taskId') taskId: number,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput
  ): Promise<Task> {
    return await this.taskService.updateTask(user.id, taskId, updateTaskInput);
  }

  @Mutation(() => Task)
  async toggleTaskStatus(@CurrentUser() user: User, @Args('taskId') taskId: number): Promise<Task> {
    return await this.taskService.toggleTaskStatus(user.id, taskId);
  }

  @Mutation(() => Task)
  async addSubtaskToTask(
    @CurrentUser() user: User,
    @Args('taskId') taskId: number,
    @Args('title') title: string
  ): Promise<Task> {
    return await this.taskService.addSubtaskToTask(user.id, taskId, title);
  }

  @Mutation(() => StatusResponse)
  async archiveOrDeleteTask(
    @CurrentUser() user: User,
    @Args('taskId') taskId: number,
    @Args('force') force: boolean
  ): Promise<StatusResponse> {
    if (force) {
      await this.taskService.deleteTask(user.id, taskId, 'FORCE');
    } else {
      await this.taskService.deleteTask(user.id, taskId, 'SOFT');
    }
    return { status: 'success' };
  }

  @Mutation(() => Task)
  async unArchiveTask(@CurrentUser() user: User, @Args('taskId') taskId: number): Promise<Task> {
    return await this.taskService.unArchivedTask(user.id, taskId);
  }

  @Mutation(() => Task)
  async addTagsToTask(
    @CurrentUser() user: User,
    @Args('taskId') taskId: number,
    @Args('tagsIds', { type: () => [Number] }) tagsIds: number[]
  ): Promise<Task> {
    return this.taskService.addTagsToTask(user.id, taskId, tagsIds);
  }
}
