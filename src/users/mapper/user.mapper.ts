import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

export const mapCreateUser = (data: User) => {
  return {
    name: data.name,
    address: data.address,
    email: data.email,
    pinCode: data.pinCode,
  };
};

export const mapUpdateUser = (data: CreateUserDto) => {
  return {
    name: data.name,
    address: data.address,
    email: data.email,
    pinCode: data.pinCode,
  };
};
