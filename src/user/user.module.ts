import { Module } from '@nestjs/common';
import { User } from '../database/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMapper } from './mapper/user.mapper';
import { DatabaseModule } from '../database/database.module';
import { DataSource } from 'typeorm';

export const userRepositoryProvider = {
  provide: 'USER_REPOSITORY',
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: ['DATA_SOURCE'],
};

@Module({
  imports: [DatabaseModule],
  providers: [userRepositoryProvider, UserService, UserMapper],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
