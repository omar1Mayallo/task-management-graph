import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database/database.config';
import envConfig from './config/env/env.config';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ListModule } from './list/list.module';
import { TagModule } from './tag/tag.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),

    TypeOrmModule.forRootAsync(databaseConfig),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),

    ScheduleModule.forRoot(),

    UserModule,
    AuthModule,
    ListModule,
    TagModule,
    TaskModule
  ]
})
export class AppModule {}
