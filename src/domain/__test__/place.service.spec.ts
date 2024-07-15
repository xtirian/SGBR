import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PlaceService } from '../services/place.service';
import { Place } from '../entities/Place';
import { PlaceDto } from 'src/application/dtos/place.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { LangService } from '../../shared/utils/LangService';

const mockPlaceRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis(),
  }),
});

const mockLangService = () => ({
  getLang: jest.fn((key: string) => key),
});

describe('PlaceService', () => {
  let service: PlaceService;
  let placesRepository: ReturnType<typeof mockPlaceRepository>;
  let langService: LangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceService,
        { provide: getRepositoryToken(Place), useFactory: mockPlaceRepository },
        { provide: LangService, useFactory: mockLangService },
      ],
    }).compile();

    service = module.get<PlaceService>(PlaceService);
    placesRepository = module.get(getRepositoryToken(Place));
    langService = module.get(LangService);
  });

  describe('validateData', () => {
    it('should throw an error if name is invalid', async () => {
      const data: PlaceDto = {
        name: 'Invalid Name!',
        city: 'City',
        state: 'State',
        thumb: '165156165165.jpg',
        profileId: 19,
        gallery: [],
      };
      await expect(service.validateData(data)).rejects.toThrow(
        new HttpException('placeTitleInvalid', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if city is invalid', async () => {
      const data: PlaceDto = {
        name: 'Valid Name',
        city: 'Invalid City!',
        state: 'State',
        thumb: '165156165165.jpg',
        profileId: 19,
        gallery: [],
      };
      await expect(service.validateData(data)).rejects.toThrow(
        new HttpException('cityInvalid', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if state is invalid', async () => {
      const data: PlaceDto = {
        name: 'Valid Name',
        city: 'City',
        state: 'Invalid State!',
        thumb: '165156165165.jpg',
        profileId: 19,
        gallery: [],
      };
      await expect(service.validateData(data)).rejects.toThrow(
        new HttpException('stateInvalid', HttpStatus.BAD_REQUEST),
      );
    });

    it('should not throw an error if all data is valid', async () => {
      const data: PlaceDto = {
        name: 'Valid Name',
        city: 'Valid City',
        state: 'RJ',
        thumb: '',
        gallery: [],
        profileId: 19,
      };
      await expect(service.validateData(data)).resolves.not.toThrow();
    });
  });

  describe('create', () => {
    it('should throw an error if data is not provided', async () => {
      // @ts-expect-error: Test case for error handling when data is null.
      await expect(service.create(null)).rejects.toThrow(
        new HttpException('dataRequired', HttpStatus.BAD_REQUEST),
      );
    });

    it('should create a place with valid data', async () => {
      const data: PlaceDto = {
        name: 'Lugar novo',
        city: 'Duque de Caxias',
        state: 'RJ',
        thumb: '/uploads/154154056056550.jpg',
        gallery: [],
        profileId: 19,
      };
      placesRepository.create.mockReturnValue(data);
      placesRepository.save.mockResolvedValue(data);
      await service.create(data);
      expect(placesRepository.create).toHaveBeenCalledWith(data);
      expect(placesRepository.save).toHaveBeenCalledWith(data);
    });
  });

  describe('edit', () => {
    it('should throw an error if id, data, or profileId is not provided', async () => {
      await expect(
        // @ts-expect-error: Test case for error handling when id, data, or profileId is null.
        service.edit({ id: null, data: null, profileId: null }),
      ).rejects.toThrow(
        new HttpException('dataRequired', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if place is not found', async () => {
      placesRepository.findOne.mockResolvedValue(null);
      await expect(
        // @ts-expect-error: Test case for error handling when place is not found.
        service.edit({ id: 1, data: {}, profileId: 1 }),
      ).rejects.toThrow(new HttpException('notFound', HttpStatus.NOT_FOUND));
    });

    it('should throw an error if profileId does not match', async () => {
      placesRepository.findOne.mockResolvedValue({ profileId: 2 });
      await expect(
        // @ts-expect-error: Test case for error handling when profileId does not match.
        service.edit({ id: 1, data: {}, profileId: 1 }),
      ).rejects.toThrow(
        new HttpException('notAuthorized', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should update a place with valid data', async () => {
      const place = { id: 1, profileId: 1 };
      const data = {
        name: 'Updated Name',
        city: 'Updated City',
        state: 'RJ',
        thumb: '/uploads/154154056056550.jpg',
        gallery: [],
        profileId: 19,
      };

      placesRepository.findOne.mockResolvedValue(place);
      placesRepository.create.mockReturnValue({ ...place, ...data });
      placesRepository.save.mockResolvedValue({ ...place, ...data });

      await service.edit({ id: 1, data, profileId: 1 });

      expect(placesRepository.create).toHaveBeenCalledWith({
        ...place,
        ...data,
      });
      expect(placesRepository.save).toHaveBeenCalledWith({ ...place, ...data });
    });
  });
});
