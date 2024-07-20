import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger('UserService');

  async createUser(userDto: CreateUserDto) {
    try {
      const user = await this.findByEmail(userDto.email);

      if (user) {
        this.logger.error(`User with email : ${user.email} already Exist`);
        throw new ConflictException('User with same email already Exist');
      }

      const hashedPassword = await bcrypt.hash(
        userDto.password,
        Number(process.env.SALT_ROUNDS),
      );

      const createdUser = await this.prisma.user.create({
        data: {
          email: userDto.email,
          password: hashedPassword,
        },
      });
      this.logger.log(
        `User with email : ${createdUser.email} created sucessfully`,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = createdUser;
      return rest;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}
