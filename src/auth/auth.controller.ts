import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  private logger = new Logger('AuthController');

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    this.logger.log('API to register user');
    return await this.userService.createUser(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    this.logger.log('API to login user');
    return await this.authService.login(body);
  }
}
