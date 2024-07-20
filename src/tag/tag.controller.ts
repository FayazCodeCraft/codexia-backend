import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tag')
@UseGuards(AuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  private logger = new Logger('TagController');

  @Post()
  async createTagDto(@Body() dto: CreateTagDto, @Req() req: Request) {
    this.logger.log('API to create tag');
    return await this.tagService.createTag(dto, req.user);
  }

  @Get(':id')
  async getTagById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    this.logger.log('API to retrieve tag');
    return await this.tagService.getTagById(id, req.user);
  }

  @Put(':id')
  async updateTag(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTagDto,
    @Req() req: Request,
  ) {
    this.logger.log('API to update tag');
    return await this.tagService.updateTag(id, dto, req.user);
  }

  @Delete(':id')
  async deleteTag(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    this.logger.log('API to delete tag');
    return await this.tagService.deleteTag(id, req.user);
  }
}
