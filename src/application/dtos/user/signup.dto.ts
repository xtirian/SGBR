import { regex } from 'src/utils/regex';
import { Matches } from 'class-validator';

export class SignupDto {
  @Matches(regex.username, {
    message: 'Username must be alphanumeric and up to 10 characters long',
  })
  username: string;

  @Matches(regex.password, {
    message:
      'Password must be between 8 and 16 characters long, and include at least one special character, one uppercase letter, and one number',
  })
  password: string;
}
