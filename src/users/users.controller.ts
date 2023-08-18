import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user.res.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'create a new user',
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Returns created user',
  })
  @Version('1')
  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @ApiOperation({
    summary: 'get all users from database',
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Returns all users from database',
  })
  @Version('1')
  @Get()
  async findAllUser() {
    return this.usersService.findAllUser();
  }

  @ApiOperation({
    summary: 'get a single user from database',
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Returns a single user from database',
  })
  @Version('1')
  @Get(':id')
  async findSingleUser(@Param('id') id: string) {
    return this.usersService.findSingleUser(id);
  }

  @ApiOperation({
    summary: 'update a single user in database',
  })
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'Returns a updated user from database',
  })
  @Version('1')
  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() data: CreateUserDto) {
    return this.usersService.updateUser(id, data);
  }

  @ApiOperation({
    summary: 'delete a single user from database',
  })
  @ApiOkResponse({
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'User delete successfully',
        },
      },
    },
  })
  @Version('1')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
