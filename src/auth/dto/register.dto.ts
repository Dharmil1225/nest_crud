import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Email address — must be unique',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Str0ng!Pass',
    description: 'Password — minimum 8 characters',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '123 Main St', description: 'Residential address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 380001, description: 'Postal / pin code' })
  @IsNumber()
  @IsNotEmpty()
  pinCode: number;
}
