import { Module } from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { SnippetController } from './snippet.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SnippetController],
  providers: [SnippetService, JwtService, PrismaService],
})
export class SnippetModule {}
