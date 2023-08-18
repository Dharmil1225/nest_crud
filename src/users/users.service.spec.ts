import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import {
  createUserMockReq,
  createUserMockRes,
  getUserMockRes,
  updateUserMockReq,
  updateUserMockRes,
} from '../../test/mockedData/mockRequestData';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
  it('It should create a new user', async () => {
    try {
      service.userRepo.save = jest.fn().mockResolvedValue(createUserMockRes);
      const res = await service.createUser(createUserMockReq);
      expect(res).toHaveProperty('data', createUserMockRes);
    } catch (error) {
      console.log(error);
    }
  });
  it('It should get all users', async () => {
    try {
      service.userRepo.find = jest.fn().mockResolvedValue([getUserMockRes]);
      const res = await service.findAllUser();
      expect(res).toHaveProperty('data', [getUserMockRes]);
    } catch (error) {
      console.log(error);
    }
  });
  it('It should find a single user', async () => {
    try {
      service.userRepo.findOne = jest.fn().mockResolvedValue(getUserMockRes);
      const res = await service.findSingleUser('1');
      expect(res).toHaveProperty('data', getUserMockRes);
    } catch (error) {
      console.log(error);
    }
  });
  it('It should delete a single user', async () => {
    try {
      service.userRepo.delete = jest
        .fn()
        .mockResolvedValue({ message: `User deleted successfully` });
      const res = await service.deleteUser('1');
      expect(res).toHaveProperty('message', `User deleted successfully`);
    } catch (error) {
      console.log(error);
    }
  });
  it('It should update a single user', async () => {
    try {
      service.userRepo.update = jest.fn().mockResolvedValue(updateUserMockRes);
      const res = await service.updateUser('1', updateUserMockReq);
      expect(res).toHaveProperty('data', updateUserMockRes);
    } catch (error) {
      console.log(error);
    }
  });
});
