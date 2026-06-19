import { Module } from '@nestjs/common';
import { Post } from '../database/entities/post.entity';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostMapper } from './mapper/post.mapper';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';

export const postRepositoryProvider = {
  provide: 'POST_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [DatabaseModule],
  providers: [postRepositoryProvider, PostService, PostMapper],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
