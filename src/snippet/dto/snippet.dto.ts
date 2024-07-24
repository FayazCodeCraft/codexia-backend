import { PartialType } from '@nestjs/mapped-types';
import { Language, Visibility } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  code: string;

  @IsEnum(Language)
  language: Language;

  @IsEnum(Visibility)
  @IsOptional()
  visibility: Visibility;

  @IsOptional()
  @IsArray()
  @IsUUID('all', {
    each: true,
    message: 'Each tagId must be a valid UUID',
  })
  tagIds: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('all', {
    each: true,
    message: 'Each userId must be a valid UUID',
  })
  allowedUsersIds: string[];
}

export class UpdateSnippetDto extends PartialType(CreateSnippetDto) {}
