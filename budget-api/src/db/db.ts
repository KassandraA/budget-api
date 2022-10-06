import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.db',
    name: 'default',
    synchronize: false,
    logging: true,
    entities: [__dirname + '/../models/*.js'],
    migrations: [__dirname + '/../migrations/*.js']
  });
