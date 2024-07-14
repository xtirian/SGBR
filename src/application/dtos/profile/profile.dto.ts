import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class ProfileDto {
  @IsOptional()
  @Matches(/^[a-zA-Z ]*$/, {
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
