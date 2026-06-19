import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from '../database/entities/comment.entity';
import { CommentMapper } from './mapper/comment.mapper';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentResDto } from './dto/comment-res.dto';

@Injectable()
export class CommentService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private readonly commentsRepository: Repository<Comment>,
    private readonly commentMapper: CommentMapper,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<CommentResDto> {
    const comment = this.commentsRepository.create(createCommentDto);
    const savedComment = await this.commentsRepository.save(comment);
    return this.commentMapper.toResponseDto(savedComment);
  }

  async findAll(): Promise<CommentResDto[]> {
    const comments = await this.commentsRepository.find();
    return this.commentMapper.toResponseDtoArray(comments);
  }

  async findOne(id: string): Promise<CommentResDto> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    return this.commentMapper.toResponseDto(comment);
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResDto> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    Object.assign(comment, updateCommentDto);
    const updatedComment = await this.commentsRepository.save(comment);
    return this.commentMapper.toResponseDto(updatedComment);
  }

  async patch(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResDto> {
    return this.update(id, updateCommentDto);
  }

  async remove(id: string): Promise<{ message: string }> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }

    await this.commentsRepository.softDelete(id);
    return { message: 'Comment deleted successfully' };
  }
}
