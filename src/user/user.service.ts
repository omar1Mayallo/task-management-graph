import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { User } from './user.entity';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { RegisterInput } from 'src/auth/dto/register.dto';
import { UpdateUserProfileInput } from './dto/updateUserProfile.dto';
import { CloudinaryService, File } from 'src/shared/services/cloudinary/cloudinary.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private cloudinaryService: CloudinaryService
  ) {}

  //________________CRONS________________//
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleDeleteInActiveUsers() {
    // 1) Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 2) DELETE InActive Users
    await this.usersRepository.delete({ deletedAt: LessThan(thirtyDaysAgo) });
  }

  // ________________________________________________________ //
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ withDeleted: true });
  }

  // I need to select "password" field to use it in auth services so i need to select it because i make it in userEntity {select: false} https://github.com/typeorm/typeorm/issues/5816
  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // Include the 'password' field in the query
      .where('user.email = :email', { email })
      .getOne();
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByEmailWithDeleted(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email }, withDeleted: true });
  }

  async createUser(createUserDto: RegisterInput): Promise<User> {
    // 1) Check If Email already exists
    const emailExist = await this.findOneByEmail(createUserDto.email);
    if (emailExist) {
      throw new BadRequestException('Email already exist, Please use another one');
    }
    // 2) Hash the password before saving
    const hashedPassword = await this.bcryptService.hash(createUserDto.password);

    // 3) Create a new user with the hashed password
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    // 4) Save the user to the database
    return await this.usersRepository.save(newUser);
  }

  async deleteUser(userId: number, deleteType: 'SOFT' | 'FORCE'): Promise<void> {
    // 1) Find Logged User
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (deleteType === 'SOFT') {
      // 2) Deactivate User
      await this.usersRepository.softDelete(userId);
    } else {
      // 3) Permanently Delete User
      await this.usersRepository.remove(user);
    }
  }

  async updateUser(userId: number, body: UpdateUserProfileInput): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    // EMAIL
    if (body.email) user.email = body.email;

    // USERNAME
    if (body.username) user.username = body.username;

    // PASSWORD
    if (body.password) {
      user.password = await this.bcryptService.hash(body.password);
    }

    return this.usersRepository.save(user);
  }

  async uploadUserImg(file: File, userId: number): Promise<User> {
    // 1) Find The User To Check Has avatar or not
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2) If User already has avatarPublicId, thus user request to update his avatar, so we need to delete his old image that exist on cloudinary before upload a new one.
    if (user.avatar && user.avatarPublicId) {
      await this.cloudinaryService.deleteImage(user.avatarPublicId);
    }

    // 3) Upload Image To Cloudinary in "users" folder
    const result = await this.cloudinaryService.uploadImage(file, 'users');
    // console.log(result);

    // 4) Attach imgUrl, publicId to update User(avatar, avatarPublicId)
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;

    return this.usersRepository.save(user);
  }
}
