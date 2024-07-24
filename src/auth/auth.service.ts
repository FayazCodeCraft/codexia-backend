import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private logger = new Logger('AuthService');

  async login(dto: LoginDto) {
    try {
      const user = await this.validateUser(dto);
      this.logger.log(
        `Validation of user with email : ${user.email} is successfull`,
      );
      const payload = {
        email: user.email,
        id: user.id,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.EXPIRES_IN,
      });
      this.logger.log(`User with email : ${user.email} logged in successfully`);
      return {
        ...payload,
        accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async validateUser(dto: LoginDto) {
    try {
      const user = await this.userService.findByEmail(dto.email);

      if (!user) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
