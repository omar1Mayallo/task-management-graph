import { UserRoles } from 'src/shared/constants/user-roles';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { List } from 'src/list/list.entity';
import { Tag } from 'src/tag/tag.entity';
import { Task } from 'src/task/task.entity';

@ObjectType()
@Entity({
  name: 'users'
})
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 20, nullable: false })
  username: string;

  @Field()
  @Column({ unique: true, nullable: false })
  email: string;

  @Field()
  @Column({ nullable: false, select: false })
  password: string;

  @Field()
  @Column({ enum: UserRoles, default: UserRoles.USER })
  role: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatarPublicId: string;

  // __________________ TIMESTAMPS __________________ //

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date;

  // __________________ RELATIONS __________________ //

  // ENTITIES : User And Tag
  // RELATION: One User have many Tags
  @OneToMany(() => Tag, tag => tag.user)
  tags?: Tag[];

  // ENTITIES : User And List
  // RELATION: One User have many Lists

  @OneToMany(() => List, list => list.user)
  lists?: List[];

  // ENTITIES : User And Task
  // RELATION: One User have many Tasks
  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}
