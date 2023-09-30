import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTaskInput {
  @Field()
  @Length(3, 100)
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  listId?: number;
}
