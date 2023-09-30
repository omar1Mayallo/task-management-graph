import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BcryptService } from 'src/shared/services/bcrypt/bcrypt.service';
import { JwtService } from 'src/shared/services/jwt/jwt.service';
import { UserService } from '../user/user.service';
import { LoginInput } from './dto/login.dto';
import { RegisterInput } from './dto/register.dto';
import { UserTokenResponse } from './graphql/user-token-res.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  // PRIVATE_METHODS
  private async generateToken(id: string): Promise<string> {
    return this.jwtService.signToken(
      { id },
      this.configService.get('JWT_SECRET'),
      this.configService.get('JWT_EXPIRATION_DATE')
    );
  }

  // USER_REGISTER
  async register(registerDto: RegisterInput): Promise<UserTokenResponse> {
    // 1) Check If User Is InActive
    const inActiveUser = await this.userService.findOneByEmailWithDeleted(registerDto.email);
    if (inActiveUser && inActiveUser.deletedAt !== null)
      throw new BadRequestException('Your Account Is InActive, Login To Activate it');

    // 2) Create User
    const user = await this.userService.createUser(registerDto);

    // 3) Generate Token
    const token = await this.generateToken(`${user.id}`);

    return { token, user };
  }

  // USER_LOGIN
  async login(loginDto: LoginInput): Promise<UserTokenResponse> {
    // 1) Check If User InActive
    const inActiveUser = await this.userService.findOneByEmailWithDeleted(loginDto.email);
    console.log(inActiveUser);

    if (inActiveUser && inActiveUser.deletedAt !== null)
      throw new BadRequestException(
        'Your Account Is InActive, Do You Need To Activate Your Account?'
      );

    // 2) Check If User is Exist and Password Is Correct
    const user = await this.userService.findOneByEmail(loginDto.email);
    if (!user || !(await this.bcryptService.compare(loginDto.password, user.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    // 3) Generate Token
    const token = await this.generateToken(`${user.id}`);

    return { token, user };
  }
}
