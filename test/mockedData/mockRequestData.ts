import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UserResponseDto } from '../../src/users/dto/user.res.dto';

export const createUserMockReq: CreateUserDto = {
  name: 'test',
  address: 'test',
  email: 'test@test.com',
  pinCode: 1,
};

export const createUserMockRes: UserResponseDto = {
  id: '1',
  name: 'test',
  email: 'test@test.com',
  address: 'test',
  pinCode: 1,
};

export const getUserMockRes: UserResponseDto = {
  ...createUserMockRes,
};

export const updateUserMockReq: CreateUserDto = { ...createUserMockReq };

export const updateUserMockRes: UserResponseDto = { ...createUserMockRes };
