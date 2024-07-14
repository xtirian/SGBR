import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from 'src/domain/services/profile.service';
import { ProfileDto } from '../dtos/profile.dto';
import { Profile } from 'src/domain/entities/Profile';
import { ResponseDto } from '../dtos/response.dto';
import { AuthGuard } from '../middlewares/auth.guard';
import { Request as ExpressRequest } from 'express';

@Controller('api/auth')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('profile')
  @UseGuards(AuthGuard)
  async editUser(
    @Request() req: ExpressRequest,
    @Body() profileDto: ProfileDto,
  ): Promise<ResponseDto<Profile>> {
    try {
      const responseService = await this.profileService.edit({
        id: req.user!.profileId,
        data: profileDto,
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: responseService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to update user',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

// // user.service.ts

// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../entities/user.entity'; // Sua entidade de usuário
// import { EditUserDto } from './edit-user.dto'; // Seu DTO de edição de usuário

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async editUser(id: number, editUserDto: EditUserDto): Promise<User> {
//     const user = await this.userRepository.findOne(id);
//     if (!user) {
//       throw new Error('User not found');
//     }

//     // Update user fields based on editUserDto
//     user.username = editUserDto.username;
//     user.password = editUserDto.password;
//     user.name = editUserDto.name;
//     user.email = editUserDto.email;
//     user.foto = editUserDto.foto;

//     return await this.userRepository.save(user);
//   }
// }
