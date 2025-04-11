import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME || 'hirespheredb',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'hirespheredb',
  schema: 'public', // Explicitly set the schema
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
  ssl: false,
  entities: ['dist/**/*.entity{.ts,.js}'], // Specify entity loading path
}));
