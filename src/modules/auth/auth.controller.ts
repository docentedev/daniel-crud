import { Body, Controller, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { IsLoginDto } from './dto/is-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('logout/:username')
  logout(@Body() body: LogoutDto, @Param('username') username: string) {
    return this.authService.logout(username, body);
  }

  @Post('is-login/:username')
  isLogin(@Body() body: IsLoginDto, @Param('username') username: string) {
    return this.authService.isLoggin(username, body);
  }
}
