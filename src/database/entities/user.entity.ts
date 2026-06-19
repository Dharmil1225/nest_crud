import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from '../../common/constant';

@Entity('users')
@Index(['email'], { unique: true, where: '"deletedAt" IS NULL' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;
}
