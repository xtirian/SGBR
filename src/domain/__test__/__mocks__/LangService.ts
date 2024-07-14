import { Injectable } from '@nestjs/common';

@Injectable()
export class LangService {
  getLang(): string {
    return 'en';
  }
}
