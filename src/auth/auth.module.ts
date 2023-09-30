import { BcryptModule } from 'src/shared/services/bcrypt/bcrypt.module';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from 'src/shared/services/jwt/jwt.module';
import { RemoveResponsePasswordInterceptor } from 'src/shared/interceptors/removeResponsePassword.interceptor';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UserModule, JwtModule, BcryptModule],
  providers: [AuthService, AuthResolver, RemoveResponsePasswordInterceptor]
})
export class AuthModule {}
