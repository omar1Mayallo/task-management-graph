// import { Controller, Post, Get, Delete, Param, Body, UseGuards } from '@nestjs/common';
// import { TagService } from './tag.service';
// import { CreateTagDto } from './dto/create-tag.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt.guard';
// import { User } from '../user/user.entity';
// import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

// @Controller('tags')
// @UseGuards(JwtAuthGuard)
// export class TagController {
//   constructor(private readonly tagService: TagService) {}

//   @Post()
//   async createTag(@CurrentUser() user: User, @Body() body: CreateTagDto) {
//     return this.tagService.createTag(user, body);
//   }

//   @Get()
//   async getTags(@CurrentUser() user: User) {
//     return this.tagService.getTags(user.id);
//   }

//   @Delete(':id')
//   async removeTag(@CurrentUser() user: User, @Param('id') tagId: number) {
//     return this.tagService.removeTag(user.id, tagId);
//   }
// }
