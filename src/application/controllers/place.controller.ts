import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { ResponseDto } from '../dtos/response.dto';
import { Place } from 'src/domain/entities/Place';
import { AuthGuard } from '../middlewares/auth.guard';
import { PlaceDto } from '../dtos/place.dto';
import { PlaceService } from 'src/domain/services/place.service';
import { LangService } from 'src/utils/LangService';
import { DeleteResult } from 'typeorm';

@Controller('api/auth')
export class PlacesController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly langService: LangService,
  ) {}

  @Post('profile')
  @UseGuards(AuthGuard)
  async createPlace(
    @Request() req: ExpressRequest,
    @Body() placeDto: PlaceDto,
  ): Promise<ResponseDto<Place>> {
    try {
      placeDto.profileId = req.user!.profileId;
      const responseService = await this.placeService.create(placeDto);
      return {
        statusCode: HttpStatus.OK,
        message: this.langService.getLang('placeCreated'),
        data: responseService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.langService.getLang('somethingWentWrong'),
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async editPlace(
    @Request() req: ExpressRequest,
    @Param('id') id: Place['id'],
    @Body() placeDto: PlaceDto,
  ): Promise<ResponseDto<Place>> {
    try {
      const responseService = await this.placeService.edit({
        id,
        data: placeDto,
        profileId: req.user!.profileId,
      });
      return {
        statusCode: HttpStatus.OK,
        message: this.langService.getLang('placeUpdated'),
        data: responseService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.langService.getLang('somethingWentWrong'),
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('profile/:id')
  @UseGuards(AuthGuard)
  async delete(
    @Request() req: ExpressRequest,
    @Param('id') id: Place['id'],
  ): Promise<ResponseDto<DeleteResult>> {
    try {
      const responseService = await this.placeService.delete({
        id,
        profileId: req.user!.profileId,
      });
      return {
        statusCode: HttpStatus.OK,
        message: this.langService.getLang('placeDeleted'),
        data: responseService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.langService.getLang('somethingWentWrong'),
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('profiles')
  @UseGuards(AuthGuard)
  async getById(@Param('id') id: Place['id']): Promise<ResponseDto<Place>> {
    try {
      const responseService = await this.placeService.getById(id);
      return {
        statusCode: HttpStatus.OK,
        message: this.langService.getLang('sucessLabel'),
        data: responseService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.langService.getLang('somethingWentWrong'),
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getAll(
    @Query() search: string,
    @Query() state: string,
    @Query() city: string,
    @Query() take: number,
    @Query() skip: number,
  ): Promise<ResponseDto<Place[]>> {
    try {
      const responseService = await this.placeService.getAll({
        busca: {
          search,
          state,
          city,
        },
        take,
        skip,
      });
      return {
        statusCode: HttpStatus.OK,
        message: this.langService.getLang('sucessLabel'),
        data: responseService,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: this.langService.getLang('somethingWentWrong'),
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
