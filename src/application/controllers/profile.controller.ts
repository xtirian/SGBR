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
  async editProfile(
    @Request() req: ExpressRequest,
    @Body() profileDto: ProfileDto,
  ): Promise<ResponseDto<Profile>> {
    try {
      console.log(req.user);
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
