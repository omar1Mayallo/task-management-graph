import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class UpdateUserProfileInput {
  @Field({ nullable: true })
  @Length(3, 20)
  @IsString()
  @IsOptional()
  username?: string;

  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field({ nullable: true })
  @Length(6, 20)
  @IsString()
  @IsOptional()
  password?: string;
}
