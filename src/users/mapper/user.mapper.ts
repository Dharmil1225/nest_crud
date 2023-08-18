import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

/**
 * This mapper function can be used to map request data while creating user
 * @param data user's requested data
 * @returns it will returns mapped object with requested data.
 */
export const mapCreateUser = (data: User) => {
  return {
    name: data.name,
    address: data.address,
    email: data.email,
    pinCode: data.pinCode,
  };
};

/**
 * This mapper function can be used to map request data while updating user
 * @param data user's requested data
 * @returns it will returns mapped object with requested data.
 */
export const mapUpdateUser = (data: CreateUserDto) => {
  return {
    name: data.name,
    address: data.address,
    email: data.email,
    pinCode: data.pinCode,
  };
};
