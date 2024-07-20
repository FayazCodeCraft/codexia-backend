import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SnippetModule } from './snippet/snippet.module';
import { JwtModule } from '@nestjs/jwt';
import { TagModule } from './tag/tag.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron/cron.service';
import { CronModule } from './cron/cron.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    SnippetModule,
    JwtModule,
    TagModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService, CronService, PrismaService],
})
export class AppModule {}
