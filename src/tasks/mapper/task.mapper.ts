import { Task } from '../../database/entities/task.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';

/**
 * This mapper function can be used to map request data while creating a task
 * @param data task's requested data
 * @returns it will returns mapped object with requested data.
 */
export const mapCreateTask = (data: Task) => {
  return {
    title: data.title,
    description: data.description,
    status: data.status,
    dueDate: data.dueDate,
  };
};

/**
 * This mapper function can be used to map request data while updating a task
 * @param data task's requested data
 * @returns it will returns mapped object with requested data.
 */
export const mapUpdateTask = (data: UpdateTaskDto) => {
  return {
    title: data.title,
    description: data.description,
    status: data.status,
    dueDate: data.dueDate,
  };
};
