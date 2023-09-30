import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from 'src/task/task.entity';

@Entity({
  name: 'tags'
})
@ObjectType()
export class Tag {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ nullable: false })
  @Field()
  name: string;

  @Column({ nullable: true, default: null })
  @Field({ nullable: true })
  color?: string;
  // __________________ TIMESTAMPS __________________ //

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  // __________________ RELATIONS __________________ //

  // ENTITIES : Tag And Task
  // RELATION: Many Tags belong to Many Tasks
  @ManyToMany(() => Task, task => task.tags, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  tasks?: Task[];

  // ENTITIES : Tag And User
  // RELATION: Many Tags belong to one User
  @ManyToOne(() => User, user => user.tags)
  @Field(() => User)
  user?: User;
}
