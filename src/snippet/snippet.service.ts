import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSnippetDto, UpdateSnippetDto } from './dto/snippet.dto';
import { User } from 'types';
import { Prisma, Visibility } from '@prisma/client';
import { GetAllQGetAllQueryParamsDto } from 'src/common/queryParams';

@Injectable()
export class SnippetService {
  constructor(private readonly prisma: PrismaService) {}
  private logger = new Logger('SnippetService');

  private selectArgs: Prisma.SnippetSelect = {
    id: true,
    title: true,
    description: true,
    code: true,
    language: true,
    visibility: true,
    tags: {
      select: {
        id: true,
        name: true,
      },
    },
    codePreview: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  };

  private gellAllSelectArgs: Prisma.SnippetSelect = {
    id: true,
    title: true,
    description: true,
    language: true,
    visibility: true,
    tags: {
      select: {
        id: true,
        name: true,
      },
    },
    codePreview: true,
    createdAt: true,
    updatedAt: true,
  };

  private async validateTagIds(
    tagIds: string[],
    userId: string,
  ): Promise<void> {
    const validTagIds = await this.prisma.tag.findMany({
      where: {
        id: {
          in: tagIds,
        },
        createdBy: {
          id: userId,
        },
      },
      select: {
        id: true,
      },
    });

    if (validTagIds.length !== tagIds.length) {
      this.logger.error('Some of the tag ids are invalid. Please Check');
      throw new NotFoundException(
        'Some of the tag ids are invalid. Please Check',
      );
    }
  }

  private generateCodePreview(code: string): string {
    const maxLines = 5;
    const maxChars = 50;
    const lines = code.split('\n');
    let preview = '';
    let charCount = 0;

    for (const line of lines) {
      if (charCount + line.length > maxChars) {
        preview += line.slice(0, maxChars - charCount) + '...';
        break;
      }
      preview += line + '\n';
      charCount += line.length;
      if (charCount >= maxChars || preview.split('\n').length >= maxLines + 1) {
        preview += '...';
        break;
      }
    }

    return preview;
  }

  async createSnippet(dto: CreateSnippetDto, user: User) {
    try {
      if (dto.tagIds && dto.tagIds.length > 0) {
        await this.validateTagIds(dto.tagIds, user.id);
      }
      const codePreview = this.generateCodePreview(dto.code);
      const createdSnippet = await this.prisma.snippet.create({
        data: {
          title: dto.title,
          description: dto.description,
          code: dto.code,
          codePreview,
          language: dto.language,
          visibility: dto.visibility,
          ...(dto.tagIds && dto.tagIds.length > 0
            ? {
                tags: {
                  connect: dto.tagIds.map((id) => ({ id })),
                },
              }
            : {}),
          ...(dto.allowedUsersIds && dto.allowedUsersIds.length > 0
            ? {
                allowedUsers: {
                  connect: dto.allowedUsersIds.map((id) => ({ id })),
                },
              }
            : {}),
          createdBy: {
            connect: {
              id: user.id,
            },
          },
        },
        select: this.selectArgs,
      });
      this.logger.log(
        `Snippet with id : ${createdSnippet.id} created suceessfully`,
      );
      return createdSnippet;
    } catch (error) {
      throw error;
    }
  }

  async updateSnippet(id: string, dto: UpdateSnippetDto, user: User) {
    try {
      if (dto.tagIds && dto.tagIds.length > 0) {
        await this.validateTagIds(dto.tagIds, user.id);
      }

      const snippet = await this.getSnippetByIdInternal(id, user);

      let codePreview = snippet.codePreview;
      if (dto.code !== undefined) {
        codePreview = dto.code === '' ? '' : this.generateCodePreview(dto.code);
      }

      const { tagIds, allowedUsersIds, ...updateData } = dto;

      const updatedSnippet = await this.prisma.snippet.update({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
        },
        data: {
          ...updateData,
          codePreview,
          ...(tagIds && tagIds.length > 0
            ? {
                tags: {
                  set: tagIds.map((id) => ({ id })),
                },
              }
            : {}),
          ...(allowedUsersIds && allowedUsersIds.length > 0
            ? {
                allowedUsers: {
                  set: allowedUsersIds.map((id) => ({ id })),
                },
              }
            : {}),
        },
        select: this.selectArgs,
      });
      this.logger.log(
        `Snippet with id : ${updatedSnippet.id} updated suceessfully`,
      );
      return updatedSnippet;
    } catch (error) {
      throw error;
    }
  }

  async getSnippetByIdInternal(id: string, user: User) {
    try {
      const snippet = await this.prisma.snippet.findFirst({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
        },
        select: this.selectArgs,
      });

      if (!snippet) {
        this.logger.error(`Snippet with id : ${id} not found `);
        throw new NotFoundException(`Snippet with id : ${id} not found `);
      }

      this.logger.log(`Snippet with id: ${snippet.id} retrieved suceessfully`);

      return snippet;
    } catch (error) {
      throw error;
    }
  }

  async getSnippetById(id: string, user: User) {
    try {
      const snippet = await this.prisma.snippet.findFirst({
        where: {
          id,
        },
        include: {
          tags: {
            select: {
              id: true,
            },
          },
          allowedUsers: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!snippet) {
        this.logger.error(`Snippet with id : ${id} not found `);
        throw new NotFoundException(`Snippet with id : ${id} not found `);
      }

      const isUserAllowed =
        snippet.visibility === Visibility.PUBLIC ||
        snippet.userId === user.id ||
        snippet.allowedUsers.some((allowedUser) => allowedUser.id === user.id);

      if (isUserAllowed) {
        this.logger.log(
          `Snippet with id: ${snippet.id} retrieved suceessfully`,
        );
        return snippet;
      } else {
        throw new ForbiddenException('You do not have access to this snippet');
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteSnippet(id: string, user: User) {
    try {
      const snippet = await this.getSnippetByIdInternal(id, user);

      const isDeleted = await this.prisma.$transaction(async (prisma) => {
        await prisma.snippetBin.create({
          data: {
            snippetId: snippet.id,
            title: snippet.title,
            description: snippet.description,
            code: snippet.code,
            codePreview: snippet.codePreview,
            language: snippet.language,
            visibility: snippet.visibility,
            createdAt: snippet.createdAt,
            createdBy: {
              connect: {
                id: user.id,
              },
            },
            tags: {
              connect: snippet.tags.map((tag) => ({ id: tag.id })),
            },
          },
        });

        this.logger.log(
          `Snippet with id : ${snippet.id} created in bin suceessfully`,
        );

        await prisma.snippet.delete({
          where: {
            id,
            createdBy: {
              id: user.id,
            },
          },
        });

        this.logger.log(`Snippet with id : ${snippet.id} deleted suceessfully`);

        return { isDeleted: true };
      });

      return isDeleted;
    } catch (error) {
      throw error;
    }
  }

  async restoreSnippetFromBin(id: string, user: User) {
    try {
      const binSnippet = await this.prisma.snippetBin.findFirst({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
        },
        include: {
          tags: true,
        },
      });

      if (!binSnippet) {
        this.logger.error(`Snippet with id : ${id} not found in bin`);
        throw new NotFoundException(`Snippet with id : ${id} not found in bin`);
      }

      const restoredSnippet = await this.prisma.$transaction(async (prisma) => {
        const restoredSnippet = await prisma.snippet.create({
          data: {
            id: binSnippet.snippetId,
            title: binSnippet.title,
            description: binSnippet.description,
            code: binSnippet.code,
            codePreview: binSnippet.codePreview,
            language: binSnippet.language,
            visibility: binSnippet.visibility,
            createdAt: binSnippet.createdAt,
            createdBy: {
              connect: {
                id: user.id,
              },
            },
            tags: {
              connect: binSnippet.tags.map((tag) => ({ id: tag.id })),
            },
          },
          select: this.selectArgs,
        });

        this.logger.log(
          `Snippet with id : ${binSnippet.snippetId} restored from bin suceessfully`,
        );

        await prisma.snippetBin.delete({
          where: {
            id,
            createdBy: {
              id: user.id,
            },
          },
        });

        this.logger.log('Snippet deleted from bin suceessfully');

        return restoredSnippet;
      });

      return restoredSnippet;
    } catch (error) {
      throw error;
    }
  }

  async getallSnippets(user: User, query: GetAllQGetAllQueryParamsDto) {
    try {
      const page = query?.page ? query.page : undefined;
      const limit = query?.limit ? query.limit : undefined;
      const skip = page && limit ? (page - 1) * limit : 0;

      const orderBy = {
        [query?.sortBy || 'createdAt']: query?.sortOrder || 'desc',
      };

      const whereOptions: Prisma.SnippetWhereInput = query.searchInput
        ? {
            OR: [
              {
                title: {
                  contains: query.searchInput,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: query.searchInput,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : undefined;

      const snippets = await this.prisma.snippet.findMany({
        where: {
          createdBy: {
            id: user.id,
          },
          ...whereOptions,
        },
        orderBy,
        take: limit,
        skip,
        select: this.gellAllSelectArgs,
      });

      const count = await this.prisma.snippet.count({
        where: {
          createdBy: {
            id: user.id,
          },
          ...whereOptions,
        },
      });

      return { snippets, count };
    } catch (error) {
      throw error;
    }
  }
}
