import { Role } from '../../common/constant';
import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity('User')
export class User extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'int', default: 0 })
  pinCode: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true, default: null })
  emailVerificationToken: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  tokenExpiresAt: Date | null;
}
