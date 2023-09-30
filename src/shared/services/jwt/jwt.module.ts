import { Module } from '@nestjs/common';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtService } from './jwt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    Jwt.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION_DATE')
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [JwtService],
  exports: [JwtService]
})
export class JwtModule {}
