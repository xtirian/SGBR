import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../services/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxMiwicHJvZmlsZUlkIjoxOSwiUHJvZmlsZSI6eyJpZCI6MTksIm5hbWUiOiJBZG1pbiBUZXN0ZSIsImVtYWlsIjoiZW1haWxAZW1haWwuY29tIiwicGhvdG8iOm51bGwsImNyZWF0ZWRBdCI6IjIwMjQtMDctMTRUMTc6MzQ6MTQuNzgzWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDctMTRUMTQ6Mzc6NTIuMDQ1WiJ9LCJpYXQiOjE3MjA5ODg4NTksImV4cCI6MTcyMDk5MjQ1OX0.RFrxg50eDj4HbuR1azMBak4tbD2cGFg7aK2t1yP32YA';
  const expectedResult = {
    username: 'admin',
    sub: 12,
    profileId: 19,
    Profile: {
      id: 19,
      name: 'Admin Teste',
      email: 'email@email.com',
      photo: null,
      createdAt: '2024-07-14T17:34:14.783Z',
      updatedAt: '2024-07-14T14:37:52.045Z',
    },
    iat: 1720988859,
    exp: 1720992459,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn().mockReturnValue(expectedResult),
            decode: jest.fn().mockReturnValue(expectedResult),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should decode the token and return the correct payload', async () => {
    const result = jwtService.verify(token);
    expect(result).toEqual(expectedResult);
    expect(jwtService.verify).toHaveBeenCalledWith(token);
  });

  describe('validateToken', () => {
    it('should validate the token', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxMiwicHJvZmlsZUlkIjoxOSwiUHJvZmlsZSI6eyJpZCI6MTksIm5hbWUiOiJBZG1pbiBUZXN0ZSIsImVtYWlsIjoiZW1haWxAZW1haWwuY29tIiwicGhvdG8iOm51bGwsImNyZWF0ZWRBdCI6IjIwMjQtMDctMTRUMTc6MzQ6MTQuNzgzWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDctMTRUMTQ6Mzc6NTIuMDQ1WiJ9LCJpYXQiOjE3MjA5ODg4NTksImV4cCI6MTcyMDk5MjQ1OX0.RFrxg50eDj4HbuR1azMBak4tbD2cGFg7aK2t1yP32YA';
      const expectedResult = {
        username: 'admin',
        sub: 12,
        profileId: 19,
        Profile: {
          id: 19,
          name: 'Admin Teste',
          email: 'email@email.com',
          photo: null,
          createdAt: '2024-07-14T17:34:14.783Z',
          updatedAt: '2024-07-14T14:37:52.045Z',
        },
        iat: 1720988859,
        exp: 1720992459,
      };

      // Mockando o comportamento do método verify do JwtService
      (jwtService.verify as jest.Mock).mockReturnValue(expectedResult);

      const result = service.validateToken(token);

      expect(result).toEqual(expectedResult);
      expect(jwtService.verify).toHaveBeenCalledWith(token, {
        secret: process.env.SECRET_KEY,
      });
    });
  });

  describe('decodeToken', () => {
    it('should decode the token', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxMiwicHJvZmlsZUlkIjoxOSwiUHJvZmlsZSI6eyJpZCI6MTksIm5hbWUiOiJBZG1pbiBUZXN0ZSIsImVtYWlsIjoiZW1haWxAZW1haWwuY29tIiwicGhvdG8iOm51bGwsImNyZWF0ZWRBdCI6IjIwMjQtMDctMTRUMTc6MzQ6MTQuNzgzWiIsInVwZGF0ZWRBdCI6IjIwMjQtMDctMTRUMTQ6Mzc6NTIuMDQ1WiJ9LCJpYXQiOjE3MjA5ODg4NTksImV4cCI6MTcyMDk5MjQ1OX0.RFrxg50eDj4HbuR1azMBak4tbD2cGFg7aK2t1yP32YA';
      const expectedResult = {
        username: 'admin',
        sub: 12,
        profileId: 19,
        Profile: {
          id: 19,
          name: 'Admin Teste',
          email: 'email@email.com',
          photo: null,
          createdAt: '2024-07-14T17:34:14.783Z',
          updatedAt: '2024-07-14T14:37:52.045Z',
        },
        iat: 1720988859,
        exp: 1720992459,
      };

      (jwtService.decode as jest.Mock).mockReturnValue(expectedResult);

      const result = service.decodeToken(token);

      expect(result).toEqual(expectedResult);
      expect(jwtService.decode).toHaveBeenCalledWith(token, { complete: true });
    });
  });
});
