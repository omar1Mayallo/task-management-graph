import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/shared/services/jwt/jwt.module';
import { List } from './list.entity';
import { ListResolver } from './list.resolver';
import { ListService } from './list.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([List]), JwtModule, UserModule],
  providers: [ListService, ListResolver],
  exports: [ListService]
})
export class ListModule {}
