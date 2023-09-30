import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { Module } from '@nestjs/common';
import { Task } from './task.entity';
import { ListModule } from 'src/list/list.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from 'src/shared/services/jwt/jwt.module';
import { TagModule } from 'src/tag/tag.module';
import { TasksResolver } from './task.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), JwtModule, UserModule, ListModule, TagModule],
  providers: [TaskService, TasksResolver],
  exports: [TaskService]
})
export class TaskModule {}
