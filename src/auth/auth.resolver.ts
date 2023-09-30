import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.dto';
import { RegisterInput } from './dto/register.dto';
import { UserTokenResponse } from './graphql/user-token-res.type';
import { UseInterceptors } from '@nestjs/common';
import { RemoveResponsePasswordInterceptor } from 'src/shared/interceptors/removeResponsePassword.interceptor';

@Resolver()
@UseInterceptors(RemoveResponsePasswordInterceptor)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // GraphQL Mutation: User registration
  @Mutation(() => UserTokenResponse) // Specify the return type here
  async register(@Args('input') registerInput: RegisterInput): Promise<UserTokenResponse> {
    return this.authService.register(registerInput);
  }

  // GraphQL Mutation: User login
  @Mutation(() => UserTokenResponse) // Specify the return type here
  async login(@Args('input') loginInput: LoginInput): Promise<UserTokenResponse> {
    return this.authService.login(loginInput);
  }
}
