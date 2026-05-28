import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserResponseDto } from '../users/dto/user.res.dto';
import { mapCreateUser, mapUpdateUser } from '../users/mapper/user.mapper';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../database/entities/user.entity';
import { connection } from '../database/database.module';

@Injectable()
export class UsersService {
  userRepo: Repository<User>;
  constructor() {
    this.userRepo = connection.getRepository(User);
  }

  /**
   * This function can be used to create a new user in database
   * @param data object containing user's data.
   * @returns it will returns created user's object
   */
  public async createUser(data: CreateUserDto) {
    try {
      const mapCreateUserReqData = mapCreateUser(
        Object.assign(new User(), data),
      );
      const mapCreateUserResData = await this.userRepo.save(
        mapCreateUserReqData,
      );
      return {
        message: 'User created successfully',
        data: new UserResponseDto(mapCreateUserResData),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * This function can be used to find all users from database
   * @returns it will returns all user's objects
   */
  public async findAllUser() {
    try {
      const users = await this.userRepo.find();
      return {
        message: 'Users fetched successfully',
        data: users.map((val) => new UserResponseDto(val)),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * This function can be used to find a single user from database
   * @param id user's id
   * @returns it will returns single user's object
   */
  public async findSingleUser(id: string) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return {
        data: new UserResponseDto(user),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * This function can be used to update a single user from database
   * @param id user's id
   * @param data user's requested data
   * @returns it will returns updated user's object
   */
  public async updateUser(id: string, data: CreateUserDto) {
    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) throw new BadRequestException('User not found');
      const mapUpdateUserReqData = mapUpdateUser(data);
      await this.userRepo.update({ id }, mapUpdateUserReqData);
      const updatedUserInfo = await this.userRepo.findOne({ where: { id } });
      return {
        data: new UserResponseDto(updatedUserInfo),
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }

  /**
   * This function can be used to delete a single user from database
   * @param id user's id
   * @returns it will returns delete message
   */
  public async deleteUser(id: string) {
    try {
      const existingUser = await this.userRepo.findOne({ where: { id } });
      if (!existingUser) throw new BadRequestException('User not found');
      await this.userRepo.delete({ id });
      return {
        message: `User deleted successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
