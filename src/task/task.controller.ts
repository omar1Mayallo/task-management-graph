// import {
//   Controller,
//   Post,
//   Patch,
//   Get,
//   Param,
//   Query,
//   Body,
//   UseGuards,
//   Put,
//   Delete
// } from '@nestjs/common';
// import { TaskService } from './task.service';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
// import { User } from 'src/user/user.entity';
// import { UpdateTaskDto } from './dto/update-task.dto';
// import { Task } from './task.entity';
// import { GetAllTasksDto } from './dto/get-all-tasks.dto';
// import { AuthorizedGuard } from 'src/auth/guards/authorized.guard';
// import { Roles } from 'src/shared/decorators/roles.decorator';
// import { UserRoles } from 'src/shared/constants/user-roles';

// @Controller('tasks')
// @UseGuards(JwtAuthGuard)
// export class TaskController {
//   constructor(private readonly taskService: TaskService) {}

//   // Func  : CREATE_TASK
//   // Route : POST >> "/tasks"
//   @Post()
//   async createTask(@CurrentUser() user: User, @Body() createTaskDto: CreateTaskDto): Promise<Task> {
//     return await this.taskService.createTask(user, createTaskDto);
//   }

//   // Func  : GET_ALL_TASKS
//   // Route : GET >> "/tasks?search=6&limit=4&sort=title:asc,notes:desc&page=1"
//   @Get()
//   @UseGuards(AuthorizedGuard)
//   @Roles(UserRoles.ADMIN)
//   async getAllTasks(@Query() dto: GetAllTasksDto) {
//     return await this.taskService.getAllTasks(dto);
//   }

//   // Func  : GET_MY_DAY_TASKS
//   // Route : GET >> "/tasks/my-day"
//   @Get('my-day')
//   async getMyDayTasks(@CurrentUser() user: User): Promise<Task[]> {
//     return await this.taskService.getMyDayTasks(user.id);
//   }

//   // Func  : CREATE_TASK_INTO_MY_DAY
//   // Route : POST >> "/tasks/my-day"
//   @Post('my-day')
//   async createMyDayTask(@CurrentUser() user: User, @Body('title') title: string) {
//     return await this.taskService.createMyDayTask(user, title);
//   }

//   // Func  : GET_NEXT_7DAYS_TASKS
//   // Route : GET >> "/tasks/next-7-days"
//   @Get('next-7-days')
//   async getNext7DaysTasks(@CurrentUser() user: User) {
//     return await this.taskService.getNext7DaysTasks(user.id);
//   }

//   // Func  : GET_ARCHIVED_TASKS
//   // Route : GET >> "/tasks/archive"
//   @Get('archive')
//   async getArchivedTasks(
//     @CurrentUser() user: User,
//     @Query('search') searchQuery: string
//   ): Promise<Task[]> {
//     return await this.taskService.getArchivedTasks(user.id, searchQuery);
//   }

//   // Func  : TOGGLE_TASK_INTO_OR_FROM_MY_DAY
//   // Route : PATCH >> "/tasks/:taskId/my-day"
//   @Patch(':taskId/my-day')
//   async toggleToMyDay(@CurrentUser() user: User, @Param('taskId') taskId: number) {
//     return await this.taskService.toggleToMyDay(user.id, taskId);
//   }

//   // Func  : GET_TASK
//   // Route : GET >> "/tasks/:id"
//   @Get(':id')
//   async getTask(@CurrentUser() user: User, @Param('id') taskId: number): Promise<Task> {
//     return await this.taskService.getTask(user.id, taskId);
//   }

//   // Func  : UPDATE_TASK
//   // Route : PUT >> "/tasks/:id"
//   @Put(':id')
//   async updateTask(
//     @CurrentUser() user: User,
//     @Param('id') taskId: number,
//     @Body() body: UpdateTaskDto
//   ): Promise<Task> {
//     return await this.taskService.updateTask(user.id, taskId, body);
//   }

//   // Func  : TOGGLE_TASK_STATUS
//   // Route : PATCH >> "/tasks/:id/status"
//   @Patch(':id/status')
//   async toggleTaskStatus(@CurrentUser() user: User, @Param('id') taskId: number): Promise<Task> {
//     return await this.taskService.toggleTaskStatus(user.id, taskId);
//   }

//   // Func  : ADD_SUBTASKS_TO_TASK
//   // Route : POST >> "/tasks/:taskId/subtasks"
//   @Post(':taskId/subtasks')
//   async addSubtaskToTask(
//     @CurrentUser() user: User,
//     @Param('taskId') taskId: number,
//     @Body('title') title: string
//   ): Promise<Task> {
//     return await this.taskService.addSubtaskToTask(user.id, taskId, title);
//   }

//   // Func  : ARCHIVE_TASK
//   // Route : PATCH >> "/tasks/:taskId/archive"
//   @Patch(':taskId/archive')
//   async archiveTask(@CurrentUser() user: User, @Param('taskId') taskId: number) {
//     return this.taskService.deleteTask(user.id, taskId, 'SOFT');
//   }

//   // Func  : UNARCHIVE_TASK
//   // Route : PATCH >> "/tasks/:taskId/unarchive"
//   @Patch(':taskId/unarchive')
//   async unArchiveTask(@CurrentUser() user: User, @Param('taskId') taskId: number): Promise<Task> {
//     return await this.taskService.unArchivedTask(user.id, taskId);
//   }

//   // Func  : DELETE_TASK
//   // Route : DELETE >> "/tasks/:taskId"
//   @Delete(':taskId')
//   async deleteTask(@CurrentUser() user: User, @Param('taskId') taskId: number) {
//     return this.taskService.deleteTask(user.id, taskId, 'FORCE');
//   }

//   // Func  : ADD_TAGS_TO_TASK
//   // Route : POST >> "/tasks/:taskId/tags"
//   @Post(':taskId/tags')
//   async addTagsToTask(
//     @CurrentUser() user: User,
//     @Param('taskId') taskId: number,
//     @Body('tagsIds') tagsIds: number[]
//   ) {
//     return this.taskService.addTagsToTask(user.id, taskId, tagsIds);
//   }
// }
