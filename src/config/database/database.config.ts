import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

const databaseConfig: TypeOrmModuleAsyncOptions = {
  // imports: [ConfigModule], >> I Set ConfigModule {isGlobal: true}, so don't need to imports here or in any other modules
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),

    // entities: [User], >> not need to add every entity manually, with autoLoadEntities: true >>  every entity registered through the forFeature() method will be automatically added to the entities array of the configuration object.
    // !NOTE
    // Note that entities that aren't registered through the forFeature() method, but are only referenced from the entity (via a relationship), won't be included by way of the autoLoadEntities setting.

    autoLoadEntities: true,
    synchronize: true
  }),
  inject: [ConfigService]
};

export default databaseConfig;
