export class PostResDto {
  id: string;

  title: string;

  content: string;

  author: string;

  published: boolean;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date;

  updatedBy: string;

  deletedAt?: Date;

  deletedBy?: string;
}
