import { IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  name: string;
}

export class UpdateTagDto extends CreateTagDto {}
