import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from 'src/task/task.entity';

@Entity({
  name: 'lists'
})
@ObjectType()
export class List {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ nullable: false })
  @Field()
  name: string;

  // __________________ TIMESTAMPS __________________ //

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  // __________________ RELATIONS __________________ //

  // ENTITIES : List And Task
  // RELATION : One List has Many Tasks
  @OneToMany(() => Task, task => task.list)
  tasks: Task[];

  // ENTITIES : List And User
  // RELATION : Many Lists belong to one User
  @ManyToOne(() => User, user => user.lists)
  @Field(() => User)
  user?: User;
}
