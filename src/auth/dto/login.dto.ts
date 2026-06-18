import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Registered email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Str0ng!Pass', description: 'Account password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
