import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TaskResponseDto } from './dto/task.res.dto';
import { mapCreateTask, mapUpdateTask } from './mapper/task.mapper';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from '../database/entities/task.entity';
import { connection } from '../database/database.module';

@Injectable()
export class TasksService {
  taskRepo: Repository<Task>;
  constructor() {
    this.taskRepo = connection.getRepository(Task);
  }

  /**
   * This function can be used to create a new task in database
   * @param data object containing task's data.
   * @returns it will returns created task's object
   */
  public async createTask(data: CreateTaskDto) {
    try {
      const mapCreateTaskReqData = mapCreateTask(
        Object.assign(new Task(), data),
      );
      const mapCreateTaskResData = await this.taskRepo.save(
        mapCreateTaskReqData,
      );
      return {
        message: 'Task created successfully',
        data: new TaskResponseDto(mapCreateTaskResData),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * This function can be used to find all tasks from database
   * @returns it will returns all task's objects
   */
  public async findAllTask() {
    try {
      const tasks = await this.taskRepo.find();
      return {
        message: 'Tasks fetched successfully',
        data: tasks.map((val) => new TaskResponseDto(val)),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * This function can be used to find a single task from database
   * @param id task's id
   * @returns it will returns single task's object
   */
  public async findSingleTask(id: string) {
    try {
      const task = await this.taskRepo.findOne({
        where: {
          id,
        },
      });
      Logger.log(task, 'findSingleTask');
      if (!task) {
        throw new BadRequestException('Task not found');
      }
      return {
        data: new TaskResponseDto(task),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * This function can be used to update a single task from database
   * @param id task's id
   * @param data task's requested data
   * @returns it will returns updated task's object
   */
  public async updateTask(id: string, data: CreateTaskDto) {
    try {
      const task = await this.taskRepo.findOne({ where: { id } });
      if (!task) throw new BadRequestException('Task not found');
      const mapUpdateTaskReqData = mapUpdateTask(data);
      await this.taskRepo.update({ id }, mapUpdateTaskReqData);
      const updatedTaskInfo = await this.taskRepo.findOne({ where: { id } });
      return {
        data: new TaskResponseDto(updatedTaskInfo),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * This function can be used to delete a single task from database
   * @param id task's id
   * @returns it will returns delete message
   */
  public async deleteTask(id: string) {
    try {
      const existingTask = await this.taskRepo.findOne({ where: { id } });
      if (!existingTask) throw new BadRequestException('Task not found');
      await this.taskRepo.delete({ id });
      return {
        message: `Task deleted successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
