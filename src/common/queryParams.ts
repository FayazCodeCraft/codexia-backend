import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { SORT_BY, SORT_ORDER } from './sort.enum';

export class GetAllQGetAllQueryParamsDto {
  @IsOptional()
  @IsString()
  searchInput: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsEnum(SORT_BY)
  sortBy: SORT_BY;

  @IsOptional()
  @IsEnum(SORT_ORDER)
  sortOrder: SORT_ORDER;
}
