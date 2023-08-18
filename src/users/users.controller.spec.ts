import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useFactory: () => ({
            createUser: jest.fn(() => { }),
            findAllUser: jest.fn(() => []),
            findSingleUser: jest.fn(() => { }),
            updateUser: jest.fn(() => { }),
            deleteUser: jest.fn(() => { }),
          }),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
  it('Create user should be called', async () => {
    const dto = new CreateUserDto();
    expect(controller.createUser(dto)).not.toEqual(null);
  });
  it('Create user service should be called', async () => {
    const dto = new CreateUserDto();
    controller.createUser(dto);
    expect(service.createUser).toBeCalledWith(dto);
  });
  it('find single user service should be called', async () => {
    const id = '1';
    controller.findSingleUser(id);
    expect(service.findSingleUser).toBeCalledWith(id);
  });
  it('find all users service should be called', async () => {
    controller.findAllUser();
    expect(service.findAllUser).toBeCalled();
  });
  it('update user service should be called', async () => {
    const dto = new CreateUserDto();
    const id = '1';
    controller.updateUser(id, dto);
    expect(service.updateUser).toHaveBeenCalledWith(id, dto);
  });
  it('delete users service should be called', async () => {
    const id = '1';
    controller.deleteUser(id);
    expect(service.deleteUser).toHaveBeenCalledWith(id);
  });
});
