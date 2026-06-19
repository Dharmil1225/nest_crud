import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { User } from '../../database/entities/user.entity';
import { UserResDto } from '../dto/user-res.dto';

@Injectable()
export class UserMapper {
  toResponseDto(entity: User): UserResDto {
    return plainToInstance(UserResDto, entity, {
      excludeExtraneousValues: false,
    });
  }

  toResponseDtoArray(entities: User[]): UserResDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
