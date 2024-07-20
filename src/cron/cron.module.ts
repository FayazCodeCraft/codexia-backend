import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CronService, PrismaService],
})
export class CronModule {}
