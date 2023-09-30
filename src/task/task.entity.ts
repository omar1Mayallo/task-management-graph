import { Field, ID, ObjectType } from '@nestjs/graphql';
import { List } from 'src/list/list.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({
  name: 'tasks'
})
@ObjectType()
export class Task {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ nullable: false, length: 100 })
  @Field()
  title: string;

  @Column({ nullable: true, default: null, length: 500 })
  @Field()
  notes?: string;

  @Column({ nullable: true, default: null })
  parentTaskId?: number; // If !null the Task is SubTask

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true, default: null })
  reminder?: Date;

  @Column({ default: false })
  @Field()
  isBelongToMyDay: boolean;

  // __________________ TIMESTAMPS __________________ //

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, default: null })
  @Field({ nullable: true })
  deletedAt: Date;

  // __________________ RELATIONS __________________ //

  // ENTITIES : Task And List
  // RELATION: Many Tasks belong to One List
  @ManyToOne(() => List, list => list.tasks)
  list?: List;

  // ENTITIES : Task And Tag
  // RELATION: Many Tasks have Many Tags
  @ManyToMany(() => Tag, tag => tag.tasks, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({ name: 'tagged-tasks' })
  tags?: Tag[];

  // ENTITIES : Task And User
  // RELATION : Many Tasks belong to one User
  @ManyToOne(() => User, user => user.tasks)
  user?: User;
}
