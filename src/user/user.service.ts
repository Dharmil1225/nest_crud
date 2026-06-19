import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../database/entities/user.entity';
import { UserMapper } from './mapper/user.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResDto } from './dto/user-res.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResDto> {
    const normalizedEmail = createUserDto.email.toLowerCase();

    const existingUser = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
      withDeleted: true,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.userMapper.toResponseDto(savedUser);
  }

  async findAll(): Promise<UserResDto[]> {
    const users = await this.usersRepository.find();
    return this.userMapper.toResponseDtoArray(users);
  }

  async findOne(id: string): Promise<UserResDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.userMapper.toResponseDto(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.email) {
      const normalizedEmail = updateUserDto.email.toLowerCase();

      const existingUser = await this.usersRepository.findOne({
        where: { email: normalizedEmail },
        withDeleted: true,
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }

      updateUserDto.email = normalizedEmail;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    return this.userMapper.toResponseDto(updatedUser);
  }

  async patch(id: string, updateUserDto: UpdateUserDto): Promise<UserResDto> {
    return this.update(id, updateUserDto);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.usersRepository.softDelete(id);
    return { message: 'User deleted successfully' };
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.toLowerCase();
    return this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });
  }
}
