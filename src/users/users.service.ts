import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async isUnique(objs) {
    const found = await this.usersRepository.find({
      where: objs,
    });

    if (found.length > 0) {
      return false;
    }

    return true;
  }

  private async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto) {
    const uniqueCheck = await this.isUnique({
      username: createUserDto.username,
    });

    if (!uniqueCheck) {
      throw new BadRequestException('Username has been used, try another');
    }

    createUserDto.password = await this.hashPassword(createUserDto.password);
    const result = await this.usersRepository.save(createUserDto);
    delete result.password;
    return result;
  }

  async findAll(options) {
    let page = options.page || 0;
    let take = options.take || 10;
    let query = [];

    options.username &&
      query.push({ username: ILike(`%${options.username}%`) });
    options.fullName &&
      query.push({ fullName: ILike(`%${options.fullName}%`) });
    options.phoneNumber &&
      query.push({ phoneNumber: ILike(`%${options.phoneNumber}%`) });
    options.address && query.push({ address: ILike(`%${options.address}%`) });

    const result = await this.usersRepository.find({
      where: query,
      take,
      skip: page * take,
    });

    return result;
  }

  async findOne(id: number) {
    const result = await this.usersRepository.findOne({
      where: { id },
    });

    if (!result) {
      throw new BadRequestException('user not found');
    }
    return result;
  }

  async findOneByAuth(username, password) {
    const result = await this.usersRepository.findOne({
      where: { username },
      select: ['username', 'password', 'id'],
    });

    if (!result) {
      throw new BadRequestException('user not found');
    }

    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      throw new UnauthorizedException('password is wrong');
    }

    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const old = await this.findOne(id);

    updateUserDto.fullName && (old.fullName = updateUserDto.fullName);
    updateUserDto.address && (old.address = updateUserDto.address);
    updateUserDto.phoneNumber && (old.phoneNumber = updateUserDto.phoneNumber);

    if (updateUserDto.password) {
      old.password = await this.hashPassword(updateUserDto.password);
    }

    const result = await this.usersRepository.save(old);
    delete result.password;
    return result;
  }

  async remove(id: number) {
    const old = await this.findOne(id);
    return await this.usersRepository.delete({ id: old.id });
  }
}
