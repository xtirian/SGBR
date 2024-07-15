import { IsOptional, Matches } from 'class-validator';
import { Profile } from 'src/domain/entities/Profile';
import { regex } from 'src/shared/lib/regex';

export class PlaceDto {
  @Matches(regex.title, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @Matches(regex.city, {
    message: 'City must contain only letters and spaces',
  })
  city: string;

  @Matches(regex.state, {
    message: 'State must contain only letters and spaces',
  })
  state: string;

  @IsOptional()
  @Matches(regex.photo, {
    message: 'Thumb must be a valid url',
  })
  thumb: string;

  @IsOptional()
  gallery: IGalery_Photo[];

  profileId: number;

  @IsOptional()
  Profile?: Profile;
}

interface IGalery_Photo {
  order: number;
  photo: string;
}
