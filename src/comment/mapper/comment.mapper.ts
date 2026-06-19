import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Comment } from '../../database/entities/comment.entity';
import { CommentResDto } from '../dto/comment-res.dto';

@Injectable()
export class CommentMapper {
  toResponseDto(entity: Comment): CommentResDto {
    return plainToInstance(CommentResDto, entity, {
      excludeExtraneousValues: false,
    });
  }

  toResponseDtoArray(entities: Comment[]): CommentResDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
