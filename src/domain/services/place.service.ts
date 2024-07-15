import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from '../entities/Place';
import { Brackets, DeleteResult, Repository } from 'typeorm';
import { LangService } from '../../utils/LangService';
import { PlaceDto } from 'src/application/dtos/place.dto';
import { regex } from '../../lib/regex';
import { Profile } from '../entities/Profile';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private placesRepository: Repository<Place>,
    private readonly langService: LangService,
  ) {}

  async validateData(data: PlaceDto) {
    const { city, name, state, thumb } = data;

    if (!name || !regex.title.test(name))
      throw new HttpException(
        this.langService.getLang('placeTitleInvalid'),
        HttpStatus.BAD_REQUEST,
      );
    if (!city || !regex.city.test(city))
      throw new HttpException(
        this.langService.getLang('cityInvalid'),
        HttpStatus.BAD_REQUEST,
      );
    if (!state || !regex.state.test(state))
      throw new HttpException(
        this.langService.getLang('stateInvalid'),
        HttpStatus.BAD_REQUEST,
      );

    if (thumb && !regex.photo.test(thumb))
      throw new HttpException(
        this.langService.getLang('photoInvalid'),
        HttpStatus.BAD_REQUEST,
      );
  }

  validateGallery(data: PlaceDto) {
    const { gallery } = data;

    if (gallery && gallery.length) {
      gallery.forEach((photo) => {
        if (!regex.photo.test(photo.photo))
          throw new HttpException(
            this.langService.getLang('photoInvalid'),
            HttpStatus.BAD_REQUEST,
          );
      });
    }
  }

  async create(data: PlaceDto): Promise<Place> {
    if (!data)
      throw new HttpException(
        this.langService.getLang('dataRequired'),
        HttpStatus.BAD_REQUEST,
      );

    try {
      await this.validateData(data);
      const place = this.placesRepository.create(data);
      await this.placesRepository.save(place);
      return place;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async edit({
    id,
    data,
    profileId,
  }: {
    id: Place['id'];
    data: PlaceDto;
    profileId: Profile['id'];
  }): Promise<Place> {
    if (!id || !data || !profileId) {
      throw new HttpException(
        this.langService.getLang('dataRequired'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const place = await this.placesRepository.findOne({ where: { id } });
    if (!place) {
      throw new HttpException(
        this.langService.getLang('notFound'),
        HttpStatus.NOT_FOUND,
      );
    }
    if (place.profileId !== profileId) {
      throw new HttpException(
        this.langService.getLang('notAuthorized'),
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.validateData(data);
    this.validateGallery(data);

    const placeModel = this.placesRepository.create({
      ...place,
      ...data,
    });

    const updatePlace = await this.placesRepository.save(placeModel);

    if (!updatePlace) {
      throw new HttpException(
        this.langService.getLang('somethingWentWrong'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatePlace;
  }

  async editGallery({
    id,
    gallery,
    profileId,
  }: {
    id: Place['id'];
    gallery: Place['gallery'];
    profileId: Place['id'];
  }): Promise<Place> {
    if (!id || !gallery || !profileId) {
      throw new HttpException(
        this.langService.getLang('dataRequired'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const place = await this.placesRepository.findOne({ where: { id } });
    if (!place) {
      throw new HttpException(
        this.langService.getLang('notFound'),
        HttpStatus.NOT_FOUND,
      );
    }
    if (place.profileId !== profileId) {
      throw new HttpException(
        this.langService.getLang('notAuthorized'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    const placeModel = this.placesRepository.create({ ...place, gallery });
    this.validateGallery(placeModel);
    const updatePlace = await this.placesRepository.save(placeModel);
    if (!updatePlace) {
      throw new HttpException(
        this.langService.getLang('somethingWentWrong'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return updatePlace;
  }

  async delete({
    id,
    profileId,
  }: {
    id: Place['id'];
    profileId: Place['profileId'];
  }): Promise<DeleteResult> {
    if (!id || !profileId) {
      throw new HttpException(
        this.langService.getLang('dataRequired'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const place = await this.placesRepository.findOne({ where: { id } });
    if (!place) {
      throw new HttpException(
        this.langService.getLang('notFound'),
        HttpStatus.NOT_FOUND,
      );
    }
    if (place.profileId !== profileId) {
      throw new HttpException(
        this.langService.getLang('notAuthorized'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    const deletePlace = await this.placesRepository.delete({ id });
    if (!deletePlace) {
      throw new HttpException(
        this.langService.getLang('somethingWentWrong'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return deletePlace;
  }

  async getById(id: Place['id']) {
    if (!id) {
      throw new HttpException(
        this.langService.getLang('dataRequired'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const place = await this.placesRepository.findOne({ where: { id } });
    if (!place) {
      throw new HttpException(
        this.langService.getLang('notFound'),
        HttpStatus.NOT_FOUND,
      );
    }

    return place;
  }

  async getAll(filter: IFilterPlace) {
    const { busca } = filter;
    const state = typeof busca.state === 'string' ? busca.state : '';
    const city = typeof busca.city === 'string' ? busca.city : '';
    const search = typeof busca.search === 'string' ? busca.search : '';
    const take = filter.take ? filter.take : 5;
    const skip = filter.skip ? filter.skip : 0;    
    const query = this.placesRepository.createQueryBuilder('place');
    if (state) {
      query.andWhere('place.state ILIKE :state', { state: `%${state}%` });
    }
    if (city) {
      query.andWhere('place.city ILIKE :city', { city: `%${city}%` });
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('place.name ILIKE :search', { search: `%${search}%` })
            .orWhere('place.city ILIKE :search', { search: `%${search}%` })
            .orWhere('place.state ILIKE :search', { search: `%${search}%` });
        })
      );
    }

    const places = await query
      .skip(skip)
      .take(take)
      .getMany();
    return places;
  }
}

interface IFilterPlace {
  busca: {
    search?: string;
    state?: string;
    city?: string;
  };
  take?: number;
  skip?: number;
}
