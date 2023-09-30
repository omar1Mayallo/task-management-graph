// import {
//   Controller,
//   Get,
//   Param,
//   Delete,
//   Put,
//   Body,
//   Post,
//   UseGuards,
//   Query,
//   Request,
//   Patch,
//   UploadedFile,
//   UseInterceptors
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { UserService } from './user.service';
// import { User } from './user.entity';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { AuthorizedGuard } from 'src/auth/guards/authorized.guard';
// import { Roles } from 'src/shared/decorators/roles.decorator';
// import { UserRoles } from 'src/shared/constants/user-roles';
// import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
// import {  } from './dto/updateUserProfile.dto';

// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   //---------------------------------//
//   //------------PROTECTED------------//
//   //---------------------------------//

//   // Func  : GET_USER_PROFILE(Logged User)
//   // Route : GET _ "/users/me"
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   async getLoggedUser(@CurrentUser() user: User): Promise<User> {
//     return this.userService.findOneById(user.id);
//   }

//   // Func  : DELETE_OR_DEACTIVATE_USER_ACCOUNT
//   // Desc  : Deactivate Account (Soft delete) & Delete Account Permanently (Force delete)
//   // Route : DELETE _ "/users/me" or "/users/me?force=true"
//   @UseGuards(JwtAuthGuard)
//   @Delete('me')
//   async deleteLoggedUser(@CurrentUser() user: User, @Query('force') force: string): Promise<void> {
//     if (force === 'true') {
//       await this.userService.deleteUser(user.id, 'FORCE');
//     } else {
//       await this.userService.deleteUser(user.id, 'SOFT');
//     }
//   }

//   // Func  : UPDATE_USER_PROFILE(username, email, password)
//   // Route : PUT _ "/users/me"
//   @UseGuards(JwtAuthGuard)
//   @Put('me')
//   async updateLoggedUser(
//     @CurrentUser() user: User,
//     @Body() body: UpdateUserProfileDto
//   ): Promise<User> {
//     return this.userService.updateUser(user.id, body);
//   }

//   // Func  : UPLOAD_USER_IMG
//   // Route : PATCH _ "/users/me/avatar"
//   @UseGuards(JwtAuthGuard)
//   @Patch('me/avatar')
//   @UseInterceptors(FileInterceptor('avatar'))
//   uploadImage(@CurrentUser() user: User, @UploadedFile() avatar: any) {
//     return this.userService.uploadUserImg(avatar, user.id);
//   }

//   //--------------------------------//
//   //---------PRIVATE(ADMIN)---------//
//   //--------------------------------//

//   @Roles(UserRoles.ADMIN)
//   @UseGuards(AuthorizedGuard)
//   @UseGuards(JwtAuthGuard)
//   @Get()
//   async findAll(): Promise<User[]> {
//     return this.userService.findAll();
//   }
// }
