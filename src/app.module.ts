import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/User';
import { Profile } from './domain/entities/Profile';
import { Place } from './domain/entities/Place';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env' : '.env.local',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Place, Profile, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Profile, Place]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
