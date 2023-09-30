import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/shared/services/jwt/jwt.module';
import { UserModule } from 'src/user/user.module';
import { Tag } from './tag.entity';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), JwtModule, UserModule],
  providers: [TagService, TagResolver],
  exports: [TagService]
})
export class TagModule {}
