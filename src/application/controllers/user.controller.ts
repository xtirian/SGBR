import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../../domain/services/user.service';

import { User } from '../../domain/entities/User';
import { SignupDto } from '../dtos/user/signup.dto';
import { ResponseDto } from '../dtos/response.dto';
import { LangService } from 'src/utils/LangService';

@Controller('api')
export class UserController {
  constructor(
    private readonly signupService: UserService,
    private readonly langService: LangService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<ResponseDto<User>> {
    try {
      const serviceResponse = await this.signupService.signup(signupDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: this.langService.getLang('userCreated'),
        data: serviceResponse,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.langService.getLang('userCreationFailed'),
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('signin')
  async signin(
    @Body() signupDto: SignupDto,
  ): Promise<ResponseDto<{ user: User; token: string }>> {
    try {
      const serviceResponse = await this.signupService.signin(signupDto);
      const token = await this.signupService.generateToken(serviceResponse);
      return {
        statusCode: HttpStatus.CREATED,
        message: this.langService.getLang('userCreated'),
        data: {
          user: serviceResponse,
          token,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.langService.getLang('loginFailed'),
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
