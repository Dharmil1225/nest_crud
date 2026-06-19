export class CommentResDto {
  id: string;

  content: string;

  authorId: string;

  taskId: string;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;

  deletedAt?: Date;

  deletedBy?: string;
}
