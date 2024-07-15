import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/User';
import { Profile } from '../entities/Profile';
import { LangService } from '../../shared/utils/LangService';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserDto } from 'src/application/dtos/user.dto';

const mockLangService = () => ({
  getLang: jest.fn((key: string) => key),
});

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockType<Repository<User>>;
  let langService: LangService;
  let profileRepository: MockType<Repository<Profile>>;
  let dataSourceMock: MockType<DataSource>;
  let jwtServiceMock: MockType<JwtService>;

  beforeEach(async () => {
    usersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as MockType<Repository<User>>;

    profileRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as unknown as MockType<Repository<Profile>>;
    dataSourceMock = {
      createQueryRunner: jest.fn(() => ({
        connect: jest.fn(),
        startTransaction: jest.fn().mockImplementation(() => Promise.resolve()),
        commitTransaction: jest
          .fn()
          .mockImplementation(() => Promise.resolve()),
        rollbackTransaction: jest
          .fn()
          .mockImplementation(() => Promise.resolve()),

        release: jest.fn(),
      })) as any,
    } as MockType<DataSource>;
    jwtServiceMock = {} as MockType<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
        {
          provide: getRepositoryToken(Profile),
          useValue: profileRepository,
        },
        { provide: DataSource, useValue: dataSourceMock },
        { provide: LangService, useFactory: mockLangService },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(User));
    profileRepository = module.get(getRepositoryToken(Profile));
    langService = module.get(LangService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateSignup', () => {
    it('should validate signup information', async () => {
      const data: UserDto = { username: 'test', password: 'Acesso1!' };

      await expect(service.validateSignup(data)).resolves.not.toThrow();
    });
    it('should throw an error if username is invalid', async () => {
      const data: UserDto = {
        username: 'Username inválido',
        password: 'SenhaV@lid4',
      };
      await expect(service.validateSignup(data)).rejects.toThrow();
    });
    it('should throw an error if password is invalid', async () => {
      const userDto: UserDto = {
        username: 'usernameVaildo',
        password: 'invalido',
      };
      await expect(service.validateSignup(userDto)).rejects.toThrow();
    });
    it('should throw an error if the user already exist', async () => {
      const data = { username: 'usernameVaildo', password: 'SenhaV@lid4' };

      const mockUser: UserDto = {
        username: 'usernameValido',
        password: 'hashedPassword',
      };
      usersRepository.findOne!.mockImplementation(async (arg: unknown) => {
        const userArg = arg as UserDto;
        if (userArg.username === 'usernameValido') {
          return mockUser;
        }
        return null;
      });
      await expect(service.validateSignup(data)).rejects.toThrow();
    });
  });
});
