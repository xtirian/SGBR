import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { SignupDto } from 'src/application/dtos/user/signup.dto';
import { LangService } from 'src/utils/LangService';
import { Profile } from '../entities/Profile';
import { regex } from 'src/utils/regex';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly langService: LangService,
  ) {}

  async validateSignup({ username, password }: SignupDto): Promise<SignupDto> {
    if (!username && !password)
      throw new HttpException(
        this.langService.getLang('dataRequired'),
        HttpStatus.BAD_REQUEST,
      );

    if (regex.username.test(username) === false)
      throw new HttpException(
        this.langService.getLang('usernameInvalid'),
        HttpStatus.BAD_REQUEST,
      );
    if (regex.password.test(password) === false)
      throw new HttpException(
        this.langService.getLang('passwordInvalid'),
        HttpStatus.BAD_REQUEST,
      );

    const usernameExists = await this.usersRepository.findOne({
      where: { username },
    });

    if (usernameExists)
      throw new HttpException(
        this.langService.getLang('usernameAlreadyInUse'),
        HttpStatus.BAD_REQUEST,
      );

    const hashedPassword = await bcrypt.hashSync(password, 12);

    return { username, password: hashedPassword };
  }

  async signup(signupDto: SignupDto): Promise<User> {
    const { username, password } = await this.validateSignup(signupDto);
    const profile = this.profileRepository.create();
    await this.profileRepository.save(profile);
    const user = this.usersRepository.create({
      username,
      password,
      profileId: profile.id,
      role: 'user',
    });
    console.log(user);
    return this.usersRepository.save(user);
  }
}
