import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Get()
  async findAllUser() {
    return this.usersService.findAllUser();
  }

  @Get(':id')
  async findSingleUser(@Param('id') id: string) {
    return this.usersService.findSingleUser(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() data: CreateUserDto) {
    return this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
