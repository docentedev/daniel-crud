import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const prevUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (prevUser) {
      throw new HttpException('Usuario existe', 400);
    }
    const hash = bcrypt.hashSync(createUserDto.password, 10);
    createUserDto.password = hash;

    return this.userRepository.save(createUserDto);
  }

  async findAll() {
    const data = await this.userRepository.find();
    data.forEach((user) => {
      delete user.password;
      delete user.token;
    });
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async generateToken(username: string) {
    const token = uuidv4();
    await this.userRepository.update({ username }, { token });
    return { token };
  }

  async deleteToken(username: string, token: string) {
    const res = await this.userRepository.update(
      { username, token },
      { token: null },
    );
    return Boolean(res.affected);
  }

  async isLoggin(username: string, token: string) {
    const res = await this.userRepository.findOne({
      where: { username, token },
    });
    return Boolean(res);
  }
}
