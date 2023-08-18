import { Module } from '@nestjs/common';
import { envConfig } from '../config/env';
import { DataSource } from 'typeorm';
import { DatabaseService } from './database.service';

export const dbOptions = {
  name: envConfig.app.database.name,
  type: envConfig.app.database.type as any,
  host: envConfig.app.database.host,
  port: envConfig.app.database.port,
  username: envConfig.app.database.user,
  database: envConfig.app.database.name,
};

export const connection = new DataSource({
  ...dbOptions,
  logging: true,
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  synchronize: envConfig.enviroment === 'local' ? true : false,
});

export const databaseProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      return await connection.initialize();
    },
  },
  DatabaseService,
];

@Module({
  providers: databaseProvider,
  exports: databaseProvider,
})
export class DatabaseModule {}
