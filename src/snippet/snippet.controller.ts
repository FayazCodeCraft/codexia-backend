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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SnippetService } from './snippet.service';
import { CreateSnippetDto, UpdateSnippetDto } from './dto/snippet.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetAllQGetAllQueryParamsDto } from 'src/common/queryParams';

@Controller('snippet')
@UseGuards(AuthGuard)
export class SnippetController {
  constructor(private readonly snippetService: SnippetService) {}
  private logger = new Logger('SnippetController');

  @Post()
  async createSnippet(@Body() dto: CreateSnippetDto, @Req() req: Request) {
    this.logger.log('API to create snippet');
    return await this.snippetService.createSnippet(dto, req.user);
  }

  @Put(':id')
  async updateSnippet(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSnippetDto,
    @Req() req: Request,
  ) {
    this.logger.log('API to update snippet');
    return await this.snippetService.updateSnippet(id, dto, req.user);
  }

  @Get(':id')
  async getSnippetById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    this.logger.log('API to retrieve snippet by id');
    return await this.snippetService.getSnippetById(id, req.user);
  }

  @Delete(':id')
  async deleteSnippet(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    this.logger.log('API to delete snippet');
    return await this.snippetService.deleteSnippet(id, req.user);
  }

  @Put('restore/:id')
  async restoreSnippetFromBin(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    this.logger.log('API to retrieve deleted snippet');
    return await this.snippetService.restoreSnippetFromBin(id, req.user);
  }

  @Get()
  async getAllSnippets(
    @Req() req: Request,
    @Query() query: GetAllQGetAllQueryParamsDto,
  ) {
    this.logger.log('API to retrieve all snippets');
    return this.snippetService.getallSnippets(req.user, query);
  }
}
