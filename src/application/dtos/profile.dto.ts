import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';
import { regex } from 'src/shared/lib/regex';

export class ProfileDto {
  @IsOptional()
  @Matches(regex.name, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString()
  photo: string;
}
