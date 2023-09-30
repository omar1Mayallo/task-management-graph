import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './list.entity';
import { User } from 'src/user/user.entity';
import { CreateListInput } from './dto/create-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private readonly listsRepository: Repository<List>
  ) {}

  // CREATE_LIST
  async createOne(user: User, body: CreateListInput): Promise<List> {
    const { name } = body;

    // 1) CREATE List
    const newList = this.listsRepository.create({
      name,
      user
    });

    // 2) Save List
    return await this.listsRepository.save(newList);
  }

  // FIND_LISTS
  async findAll(userId: number): Promise<List[]> {
    return await this.listsRepository.find({
      where: { user: { id: userId } },
      relations: ['user']
    });
  }

  // GET_LIST
  async getList(userId: number, listId: number): Promise<List> {
    const list = await this.listsRepository.findOne({
      where: { id: listId, user: { id: userId } },
      relations: ['user']
    });
    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found`);
    }
    return list;
  }
}
