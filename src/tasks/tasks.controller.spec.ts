import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: TasksService,
          useFactory: () => ({
            createTask: jest.fn(),
            findAllTask: jest.fn(() => []),
            findSingleTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Create task should be called', async () => {
    const dto = new CreateTaskDto();
    expect(controller.createTask(dto)).not.toEqual(null);
  });
  it('Create task service should be called', async () => {
    const dto = new CreateTaskDto();
    controller.createTask(dto);
    expect(service.createTask).toBeCalledWith(dto);
  });
  it('find single task service should be called', async () => {
    const id = '1';
    controller.findSingleTask(id);
    expect(service.findSingleTask).toBeCalledWith(id);
  });
  it('find all tasks service should be called', async () => {
    controller.findAllTask();
    expect(service.findAllTask).toBeCalled();
  });
  it('update task service should be called', async () => {
    const dto = new UpdateTaskDto();
    const id = '1';
    controller.updateTask(id, dto);
    expect(service.updateTask).toHaveBeenCalledWith(id, dto);
  });
  it('delete task service should be called', async () => {
    const id = '1';
    controller.deleteTask(id);
    expect(service.deleteTask).toHaveBeenCalledWith(id);
  });
});
