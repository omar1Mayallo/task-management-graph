import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { StatusResponse } from 'src/user/graphql/status-res.type';

@UseGuards(JwtAuthGuard)
@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  //  GraphQL Mutation: for creating a tag
  @Mutation(() => Tag)
  async createTag(
    @CurrentUser() user: User,
    @Args('name') name: string,
    @Args('color') color: string
  ): Promise<Tag> {
    return await this.tagService.createTag(user, name, color);
  }

  //  GraphQL Query: for getting all tags
  @Query(() => [Tag])
  async getTags(@CurrentUser() user: User): Promise<Tag[]> {
    return this.tagService.getTags(user.id);
  }

  //  GraphQL Mutation: for removing a tag
  @Mutation(() => StatusResponse)
  async removeTag(
    @CurrentUser() user: User,
    @Args('tagId') tagId: number
  ): Promise<StatusResponse> {
    await this.tagService.removeTag(user.id, tagId);
    return { status: 'success' };
  }
}
