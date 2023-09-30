// import { Body, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
// import { RemoveResponsePasswordInterceptor } from 'src/shared/interceptors/removeResponsePassword.interceptor';
// import { AuthService, IUserWithToken } from './auth.service';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';

// @Controller('auth')
// @UseInterceptors(RemoveResponsePasswordInterceptor)
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   //-------------------------------//
//   //------------PUBLIC-------------//
//   //-------------------------------//

//   // Func  : USER_REGISTER
//   // Route : "/auth/register"
//   @Post('register')
//   async register(@Body() registerDto: RegisterDto): Promise<IUserWithToken> {
//     return this.authService.register(registerDto);
//   }

//   // Func  : USER_LOGIN
//   // Route : "/auth/login"
//   @Post('login')
//   @HttpCode(200)
//   async login(@Body() loginDto: LoginDto): Promise<IUserWithToken> {
//     return this.authService.login(loginDto);
//   }
// }
