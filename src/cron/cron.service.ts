import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { subDays } from 'date-fns';

@Injectable()
export class CronService {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger('CronService');
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async removeExpiredSnippetsFromBin() {
    try {
      this.logger.log('Auto removal of expired snippets from bin started');
      const date30DaysAgo = subDays(new Date(), 30);
      const { count } = await this.prisma.snippetBin.deleteMany({
        where: {
          deletedAt: {
            lt: date30DaysAgo,
          },
        },
      });

      this.logger.log(`Deleted ${count} expired snippets from the bin`);
    } catch (error) {
      throw error;
    }
  }
}
