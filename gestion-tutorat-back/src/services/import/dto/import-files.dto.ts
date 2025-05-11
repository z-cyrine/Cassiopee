import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportFilesDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  parTutorat?: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  tutorats?: Express.Multer.File;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  majors?: Express.Multer.File;
} 