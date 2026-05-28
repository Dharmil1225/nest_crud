import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UserResponseDto } from '../../src/users/dto/user.res.dto';
import { CreateTaskDto } from '../../src/tasks/dto/create-task.dto';
import { TaskResponseDto } from '../../src/tasks/dto/task.res.dto';
import { TaskStatus } from '../../src/common/constant';

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

export const createTaskMockReq: CreateTaskDto = {
  title: 'test task',
  description: 'test description',
  status: TaskStatus.PENDING,
  dueDate: '2026-12-31T00:00:00.000Z',
};

export const createTaskMockRes: TaskResponseDto = {
  id: '1',
  title: 'test task',
  description: 'test description',
  status: TaskStatus.PENDING,
  dueDate: new Date('2026-12-31T00:00:00.000Z'),
};

export const getTaskMockRes: TaskResponseDto = {
  ...createTaskMockRes,
};

export const updateTaskMockReq: CreateTaskDto = { ...createTaskMockReq };

export const updateTaskMockRes: TaskResponseDto = { ...createTaskMockRes };

