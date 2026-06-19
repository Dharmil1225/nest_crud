import { Module } from '@nestjs/common';
import { Comment } from '../database/entities/comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentMapper } from './mapper/comment.mapper';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';

export const commentRepositoryProvider = {
  provide: 'COMMENT_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Comment),
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [DatabaseModule],
  providers: [commentRepositoryProvider, CommentService, CommentMapper],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
