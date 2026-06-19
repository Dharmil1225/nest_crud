import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Post } from '../../database/entities/post.entity';
import { PostResDto } from '../dto/post-res.dto';

@Injectable()
export class PostMapper {
  toResponseDto(entity: Post): PostResDto {
    return plainToInstance(PostResDto, entity, {
      excludeExtraneousValues: false,
    });
  }

  toResponseDtoArray(entities: Post[]): PostResDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
