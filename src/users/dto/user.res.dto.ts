import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../database/entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id: number | string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  pinCode: number;

  constructor(data: User) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.address = data.address;
    this.pinCode = data.pinCode;
  }
}
