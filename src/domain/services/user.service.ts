import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { UserDto } from 'src/application/dtos/user.dto';
import { LangService } from 'src/utils/LangService';
import { Profile } from '../entities/Profile';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { regex } from 'src/lib/regex';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly langService: LangService,
    private jwtService: JwtService,
  ) {}

  async validateSignup({ username, password }: UserDto): Promise<UserDto> {
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

  async signup(signupDto: UserDto): Promise<User> {
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

  async generateToken(user: User): Promise<string> {
    const payload = {
      username: user.username,
      sub: user.id,
      profile: user.profileId,
    };
    return await this.jwtService.sign(payload);
  }

  async signin(signupDto: UserDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: signupDto.username },
    });
    if (!user) {
      throw new HttpException(
        this.langService.getLang('invalidCredentials'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isValidPassword = await bcrypt.compareSync(
      signupDto.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new HttpException(
        this.langService.getLang('invalidCredentials'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
