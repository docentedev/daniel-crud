import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { IsLoginDto } from './dto/is-login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(body: LoginDto) {
    const user = await this.usersService.findByUsername(body.username);
    if (!user) {
      throw new HttpException('Usuario no existe', 404);
    }
    const passwordResult = bcrypt.compareSync(body.password, user.password);
    if (!passwordResult) {
      throw new HttpException('Credenciales incorrectas', 401);
    }

    return this.usersService.generateToken(user.username);
  }

  logout(username: string, body: LogoutDto) {
    return this.usersService.deleteToken(username, body.token);
  }

  async isLoggin(username: string, body: IsLoginDto) {
    return this.usersService.isLoggin(username, body.token);
  }
}
