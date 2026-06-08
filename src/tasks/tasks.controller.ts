import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { TaskResponseDto } from './dto/task.res.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({
    summary: 'create a new task',
  })
  @ApiOkResponse({
    type: TaskResponseDto,
    description: 'Returns created task',
  })
  @Version('1')
  @Post()
  async createTask(@Body() data: CreateTaskDto) {
    return this.tasksService.createTask(data);
  }

  @ApiOperation({
    summary: 'get all tasks from database',
  })
  @ApiOkResponse({
    type: TaskResponseDto,
    description: 'Returns all tasks from database',
  })
  @Version('1')
  @Get()
  async findAllTask() {
    return this.tasksService.findAllTask();
  }

  @ApiOperation({
    summary: 'get a single task from database',
  })
  @ApiOkResponse({
    type: TaskResponseDto,
    description: 'Returns a single task from database',
  })
  @Version('1')
  @Get(':id')
  async findSingleTask(@Param('id') id: string) {
    return this.tasksService.findSingleTask(id);
  }

  @ApiOperation({
    summary: 'update a single task in database',
  })
  @ApiOkResponse({
    type: TaskResponseDto,
    description: 'Returns a updated task from database',
  })
  @Version('1')
  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() data: UpdateTaskDto) {
    return this.tasksService.updateTask(id, data);
  }

  @ApiOperation({
    summary: 'delete a single task from database',
  })
  @ApiOkResponse({
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Task deleted successfully',
        },
      },
    },
  })
  @Version('1')
  @Delete(':id')
  async deleteTask(@Param('id') id: string) {
    return this.tasksService.deleteTask(id);
  }
}
