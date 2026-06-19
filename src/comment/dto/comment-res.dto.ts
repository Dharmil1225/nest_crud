export class CommentResDto {
  id: string;

  content: string;

  userId: string;

  postId: string;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;

  deletedAt?: Date;

  deletedBy?: string;
}
