import { PartialType } from '@nestjs/mapped-types';
import { CreateTuteurDto } from './create-tuteur.dto';

export class UpdateTuteurDto extends PartialType(CreateTuteurDto) {}
