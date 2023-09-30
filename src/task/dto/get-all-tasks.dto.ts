import { IsInt, IsOptional, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GetAllTasksInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  page?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  limit?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  sort?: string;
}
