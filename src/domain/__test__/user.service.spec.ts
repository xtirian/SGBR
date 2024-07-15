import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/User';
import { Profile } from '../entities/Profile';
import { LangService } from '../../utils/LangService';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let service: UserService;
  let usersRepositoryMock: jest.Mocked<Repository<User>>;
  let profileRepositoryMock: jest.Mocked<Repository<Profile>>;
  let dataSourceMock: jest.Mocked<DataSource>;
  let langServiceMock: jest.Mocked<LangService>;
  let jwtServiceMock: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: usersRepositoryMock },
        {
          provide: getRepositoryToken(Profile),
          useValue: profileRepositoryMock,
        },
        { provide: DataSource, useValue: dataSourceMock },
        { provide: LangService, useValue: langServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
