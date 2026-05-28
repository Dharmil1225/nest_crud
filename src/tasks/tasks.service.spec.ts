import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../database/entities/task.entity';
import {
  createTaskMockReq,
  createTaskMockRes,
  getTaskMockRes,
  updateTaskMockReq,
  updateTaskMockRes,
} from '../../test/mockedData/mockRequestData';

describe('TasksService', () => {
  let service: TasksService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
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

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
  it('It should create a new task', async () => {
    try {
      service.taskRepo.save = jest.fn().mockResolvedValue(createTaskMockRes);
      const res = await service.createTask(createTaskMockReq);
      expect(res).toHaveProperty('data', createTaskMockRes);
    } catch (error) {
      console.log(error);
    }
  });
  it('It should get all tasks', async () => {
    try {
      service.taskRepo.find = jest.fn().mockResolvedValue([getTaskMockRes]);
      const res = await service.findAllTask();
      expect(res).toHaveProperty('data', [getTaskMockRes]);
    } catch (error) {
      console.log(error);
    }
  });
  it('It should find a single task', async () => {
    try {
      service.taskRepo.findOne = jest.fn().mockResolvedValue(getTaskMockRes);
      const res = await service.findSingleTask('1');
      expect(res).toHaveProperty('data', getTaskMockRes);
    } catch (error) {
      console.log(error);
    }
  });
  it('It should delete a single task', async () => {
    try {
      service.taskRepo.delete = jest
        .fn()
        .mockResolvedValue({ message: `Task deleted successfully` });
      const res = await service.deleteTask('1');
      expect(res).toHaveProperty('message', `Task deleted successfully`);
    } catch (error) {
      console.log(error);
    }
  });
  it('It should update a single task', async () => {
    try {
      service.taskRepo.update = jest.fn().mockResolvedValue(updateTaskMockRes);
      const res = await service.updateTask('1', updateTaskMockReq);
      expect(res).toHaveProperty('data', updateTaskMockRes);
    } catch (error) {
      console.log(error);
    }
  });
});
