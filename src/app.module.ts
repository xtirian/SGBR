import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/User';
import { Profile } from './domain/entities/Profile';
import { Place } from './domain/entities/Place';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './application/controllers/user.controller';
import { UserService } from './domain/services/user.service';
import { LangService } from './utils/LangService';
import { jwtConstants } from './lib/contants';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from './application/controllers/profile.controller';
import { ProfileService } from './domain/services/profile.service';
import { AuthService } from './domain/services/auth.service';
import { AuthGuard } from './application/middlewares/auth.guard';
import { PlacesController } from './application/controllers/place.controller';
import { PlaceService } from './domain/services/place.service';

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
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY || jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, ProfileController, PlacesController],
  providers: [
    LangService,
    UserService,
    AuthGuard,
    AuthService,
    ProfileService,
    PlaceService,
  ],
})
export class AppModule {}
