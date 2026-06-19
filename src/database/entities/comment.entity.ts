import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  authorId: string;

  @Column({ type: 'varchar', length: 255 })
  taskId: string;
}
