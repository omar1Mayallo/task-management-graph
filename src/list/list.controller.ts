// import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards } from '@nestjs/common';
// import { ListService } from './list.service';
// import { CreateListDto } from './dto/create-list.dto';
// import { List } from './list.entity';
// import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
// import { User } from 'src/user/user.entity';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

// @Controller('lists')
// @UseGuards(JwtAuthGuard)
// export class ListController {
//   constructor(private readonly listService: ListService) {}

//   @Post()
//   async createList(@CurrentUser() user: User, @Body() createListDto: CreateListDto): Promise<List> {
//     return await this.listService.createOne(user, createListDto);
//   }

//   @Get()
//   async findAllLists(@CurrentUser() user: User): Promise<List[]> {
//     return await this.listService.findAll(user.id);
//   }

//   @Get(':listId')
//   async findOne(@CurrentUser() user: User, @Param('listId') listId: number): Promise<List> {
//     return await this.listService.getList(user.id, +listId);
//   }
// }
