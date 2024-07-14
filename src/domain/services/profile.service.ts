import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/Profile';
import { LangService } from 'src/utils/LangService';
import { ProfileDto } from 'src/application/dtos/profile/profile.dto';
import { regex } from 'src/lib/regex';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    private readonly langService: LangService,
  ) {}

  async edit({
    id,
    data,
  }: {
    id: Profile['id'];
    data: ProfileDto;
  }): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({ where: { id } });
    if (!profile) {
      throw new HttpException(
        this.langService.getLang('profileNotFound'),
        HttpStatus.NOT_FOUND,
      );
    }
    if (data.name && !regex.name.test(data.name))
      throw new HttpException(
        this.langService.getLang('nameInvalid'),
        HttpStatus.BAD_REQUEST,
      );
    if (data.email && !regex.email.test(data.email))
      throw new HttpException(
        this.langService.getLang('emailInvalid'),
        HttpStatus.BAD_REQUEST,
      );

    const profileModel = this.profilesRepository.create({
      ...profile,
      ...data,
    });

    const updateProfile = await this.profilesRepository.save(profileModel);

    return updateProfile;
  }
}
