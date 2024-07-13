import { Injectable } from '@nestjs/common';
import { lang } from 'src/lib/lang.lib';

@Injectable()
export class LangService {
  private readonly lang = lang;

  getLang(key: keyof typeof this.lang): string {
    return this.lang[key];
  }
}
