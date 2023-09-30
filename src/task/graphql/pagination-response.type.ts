import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Task } from '../task.entity';

@ObjectType()
export class PaginationStatus {
  @Field({ nullable: true })
  currentPage?: number;
  @Field({ nullable: true })
  numOfItemsPerPage?: number;
  @Field({ nullable: true })
  numOfPages?: number;
  @Field({ nullable: true })
  nextPage?: number;
  @Field({ nullable: true })
  previousPage?: number;
}

@ObjectType()
export class TaskPaginationResponse {
  @Field(() => PaginationStatus)
  paginationStatus: PaginationStatus;

  @Field(() => [Task])
  tasks: Task[];

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class Next7DaysTasksResponse {
  @Field()
  day: string;

  @Field(() => [Task])
  tasks: Task[];
}
