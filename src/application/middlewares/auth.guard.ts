import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from 'src/domain/entities/User';
import { AuthService } from 'src/domain/services/auth.service';
import { LangService } from 'src/shared/utils/LangService';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private langService: LangService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException(
          this.langService.getLang('tokenInvalid'),
        );
      }
      const authToken = authorization.replace(/bearer/gim, '').trim();
      const resp = await this.authService.validateToken(authToken);
      request.decodedData = resp;
      const decodedToken = await this.authService.decodeToken(authToken);
      const user: User = {
        ...decodedToken.payload,
      };

      request.user = user;

      return true;
    } catch (error) {
      console.log('auth error - ', error.message);
      throw new ForbiddenException(
        error.message || this.langService.getLang('tokenExpired'),
      );
    }
  }
}
