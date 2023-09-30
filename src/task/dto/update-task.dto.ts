import { IsOptional, Length, IsString, IsDateString, IsInt } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @Length(3, 100)
  @IsString()
  @IsOptional()
  title: string;

  @Field({ nullable: true })
  @Length(3, 500)
  @IsString()
  @IsOptional()
  notes?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  reminder: Date;

  @Field({ nullable: true })
  @IsInt()
  @IsOptional()
  listId: number;
}
