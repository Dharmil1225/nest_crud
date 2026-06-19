import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  authorId?: string;

  @IsString()
  @IsNotEmpty()
  taskId: string;
}
