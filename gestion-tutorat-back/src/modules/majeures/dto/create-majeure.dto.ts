import { IsString, IsOptional } from 'class-validator';

export class CreateMajeureDto {
  @IsOptional()
  @IsString()
  groupe?: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  dept?: string;

  @IsOptional()
  @IsString()
  responsible?: string;

  @IsOptional()
  @IsString()
  langue?: string;

  @IsOptional()
  @IsString()
  iniAlt?: string;

  @IsOptional()
  @IsString()
  programme?: string;
}

export class UpdateMajeureDto extends CreateMajeureDto {}
