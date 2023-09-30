import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthorizedGuard } from 'src/auth/guards/authorized.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserRoles } from 'src/shared/constants/user-roles';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UpdateUserProfileInput } from './dto/updateUserProfile.dto';
import { StatusResponse } from './graphql/status-res.type';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  //---------------------------------//
  //------------PROTECTED------------//
  //---------------------------------//

  // GraphQL Query: Get logged-in user's profile
  @UseGuards(JwtAuthGuard)
  @Query(() => User)
  async getLoggedUser(@CurrentUser() user: User): Promise<User> {
    return this.userService.findOneById(user.id);
  }

  // GraphQL Mutation: Delete or deactivate user account
  @UseGuards(JwtAuthGuard)
  @Mutation(() => StatusResponse)
  async deleteLoggedUser(
    @CurrentUser() user: User,
    @Args('force', { type: () => Boolean, nullable: true }) force: boolean
  ): Promise<StatusResponse> {
    if (force) {
      await this.userService.deleteUser(user.id, 'FORCE');
    } else {
      await this.userService.deleteUser(user.id, 'SOFT');
    }
    return { status: 'success' };
  }

  // GraphQL Mutation: Update user profile
  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateLoggedUser(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserProfileInput
  ): Promise<User> {
    return this.userService.updateUser(user.id, input);
  }

  // GraphQL Mutation: Upload user image
  // @UseGuards(JwtAuthGuard)
  // @Mutation(() => User)
  // async uploadImage(
  //   @CurrentUser() user: User,
  //   @Args('avatar', { type: () => Upload }) avatar: File
  // ): Promise<User> {
  //   return this.userService.uploadUserImg(avatar, user.id);
  // }

  //--------------------------------//
  //---------PRIVATE(ADMIN)---------//
  //--------------------------------//

  // GraphQL Query: Get all users (admin-only)
  @UseGuards(JwtAuthGuard, AuthorizedGuard)
  @Roles(UserRoles.ADMIN)
  @Query(() => [User])
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
