import { ProfileService } from '../services/profile.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../entities/Profile';
import { ProfileDto } from 'src/application/dtos/profile.dto';
import { LangService } from '../../utils/LangService';

jest.mock('../../utils/LangService');

const mockProfileRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('ProfileService', () => {
  let service: ProfileService;
  let profilesRepository: ReturnType<typeof mockProfileRepository>;
  let langService: LangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        LangService,
        {
          provide: getRepositoryToken(Profile),
          useFactory: mockProfileRepository,
        },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
    profilesRepository = module.get(getRepositoryToken(Profile));
    langService = module.get<LangService>(LangService);
  });

  describe('edit', () => {
    it('should throw an error if profile is not found', async () => {
      profilesRepository.findOne.mockResolvedValue(null);
      // @ts-expect-error: We are testing the error
      await expect(service.edit({ id: 1, data: {} })).rejects.toThrow(
        'Http Exception',
      );
    });

    it('should throw an error if name is invalid', async () => {
      const profileData: ProfileDto = {
        name: 'Invalid Name!',
        email: 'valid@email.com',
        photo: '/uploads/154154056056550.jpg',
      };
      const profile = { id: 1 };

      profilesRepository.findOne.mockResolvedValue(profile);

      await expect(service.edit({ id: 1, data: profileData })).rejects.toThrow(
        'Http Exception',
      );
    });

    it('should throw an error if email is invalid', async () => {
      const profileData: ProfileDto = {
        name: 'Valid Name',
        email: 'invalidemail',
        photo: '/uploads/154154056056550.jpg',
      };
      const profile = { id: 1 };

      profilesRepository.findOne.mockResolvedValue(profile);

      await expect(service.edit({ id: 1, data: profileData })).rejects.toThrow(
        'Http Exception',
      );
    });
  });
});
