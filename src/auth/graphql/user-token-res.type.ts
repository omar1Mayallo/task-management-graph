import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';

@ObjectType()
export class UserTokenResponse {
  @Field()
  token: string;

  @Field()
  user: User;
}
