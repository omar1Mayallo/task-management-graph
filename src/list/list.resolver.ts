import { Resolver, Mutation, Args, Query, ResolveField, Parent } from '@nestjs/graphql';
import { ListService } from './list.service';
import { List } from './list.entity';
import { User } from 'src/user/user.entity';
import { CreateListInput } from './dto/create-list.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListResolver {
  constructor(private readonly listService: ListService) {}

  // GraphQL Mutation: Create a new list
  @Mutation(() => List)
  async createList(
    @CurrentUser() user: User,
    @Args('input') createListInput: CreateListInput
  ): Promise<List> {
    return this.listService.createOne(user, createListInput);
  }

  // GraphQL Query: Get all lists for the logged-in user
  @Query(() => [List])
  async lists(@CurrentUser() user: User): Promise<List[]> {
    return this.listService.findAll(user.id);
  }

  // GraphQL Query: Get a specific list by ID
  @Query(() => List)
  async list(@CurrentUser() user: User, @Args('id') id: number): Promise<List> {
    return this.listService.getList(user.id, id);
  }
}
