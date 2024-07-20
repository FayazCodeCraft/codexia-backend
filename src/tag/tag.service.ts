import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { User } from 'types';
import { Prisma } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger('TagService');

  private selectArgs: Prisma.TagSelect = {
    id: true,
    name: true,
  };

  async createTag(dto: CreateTagDto, user: User) {
    try {
      const tagExist = await this.prisma.tag.findFirst({
        where: {
          name: {
            equals: dto.name,
            mode: 'insensitive',
          },
          createdBy: {
            id: user.id,
          },
        },
      });

      if (tagExist) {
        this.logger.error('Tag name already exist');
        throw new ConflictException('Tag name already exist');
      }

      const createdTag = await this.prisma.tag.create({
        data: {
          name: dto.name,
          createdBy: {
            connect: {
              id: user.id,
            },
          },
        },
        select: this.selectArgs,
      });

      this.logger.log(`Tag with id: ${createdTag.id} created suceessfully`);
      return createdTag;
    } catch (error) {
      throw error;
    }
  }

  async getTagById(id: string, user: User) {
    try {
      const tag = await this.prisma.tag.findFirst({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
        },
        select: this.selectArgs,
      });

      if (!tag) {
        this.logger.error(`Tag with id :${id} not found`);
        throw new NotFoundException(`Tag with id :${id} not found`);
      }

      this.logger.log(`Tag with id: ${tag.id} retrieved suceessfully`);

      return tag;
    } catch (error) {
      throw error;
    }
  }

  async updateTag(id: string, dto: UpdateTagDto, user: User) {
    try {
      const tag = await this.getTagById(id, user);

      const tagCount = await this.prisma.tag.count({
        where: {
          NOT: [
            {
              name: {
                equals: tag.name,
                mode: 'insensitive',
              },
              createdBy: {
                id: user.id,
              },
            },
          ],
          OR: [
            {
              name: {
                equals: dto.name,
                mode: 'insensitive',
              },
              createdBy: {
                id: user.id,
              },
            },
          ],
        },
      });

      if (tagCount) {
        this.logger.error(`Tag with name : ${dto.name} already exist`);
        throw new ConflictException(
          `Tag with name : ${dto.name} already exist`,
        );
      }

      const updatedTag = await this.prisma.tag.update({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
        },
        data: {
          name: dto.name,
        },
        select: this.selectArgs,
      });

      this.logger.log(`Tag with id : ${updatedTag.id} updated successfully`);
      return updatedTag;
    } catch (error) {
      throw error;
    }
  }

  async deleteTag(id: string, user: User) {
    try {
      await this.getTagById(id, user);

      await this.prisma.tag.delete({
        where: {
          id,
          createdBy: {
            id: user.id,
          },
        },
      });
      this.logger.log(`Tag with id : ${id} deleted successfully`);

      return { isDeleted: true };
    } catch (error) {
      throw error;
    }
  }
}
