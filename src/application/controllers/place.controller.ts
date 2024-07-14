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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest } from 'express';
import { ResponseDto } from '../dtos/response.dto';
import { Place } from 'src/domain/entities/Place';
import { AuthGuard } from '../middlewares/auth.guard';
import { PlaceDto } from '../dtos/place.dto';
import { PlaceService } from 'src/domain/services/place.service';
import { LangService } from 'src/utils/LangService';
import { DeleteResult } from 'typeorm';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('api/auth')
export class PlacesController {
  constructor(
    private readonly placeService: PlaceService,
    private readonly langService: LangService,
  ) {}

  @Post('place')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const name = uuidv4();
          const extension = extname(file.originalname);
          cb(null, `${name}${extension}`);
        },
      }),
    }),
  )
  async createPlace(
    @UploadedFile() thumb: Express.Multer.File,
    @Request() req: ExpressRequest,
    @Body() placeDto: PlaceDto,
  ): Promise<ResponseDto<Place>> {
    try {
      if (!placeDto) {
        throw new HttpException(
          this.langService.getLang('dataRequired'),
          HttpStatus.BAD_REQUEST,
        );
      }

      placeDto.profileId = req.user!.profileId;
      if (thumb.filename) {
        placeDto.thumb = `/uploads/${thumb.filename}`;
      }
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

  @Put('place')
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

  @Delete('place/:id')
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

  @Get('place/:id')
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

  @Get('places')
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
