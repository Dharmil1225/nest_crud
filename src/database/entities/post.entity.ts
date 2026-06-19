import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;
}
