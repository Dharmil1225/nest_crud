import { Exclude } from 'class-transformer';
import { Role } from '../../common/constant';

export class UserResDto {
  id: string;

  email: string;

  @Exclude()
  password: string;

  name: string;

  role: Role;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;

  deletedAt?: Date;

  deletedBy?: string;
}
