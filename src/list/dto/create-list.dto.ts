import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateListInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;
}
