import { TaskStatus } from '../../common/constant';
import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Task')
export class Task extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: string;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate: Date;
}
