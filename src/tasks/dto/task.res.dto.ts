import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../../database/entities/task.entity';

export class TaskResponseDto {
  @ApiProperty()
  id: number | string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  dueDate: Date;

  constructor(data: Task) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status;
    this.dueDate = data.dueDate;
  }
}
