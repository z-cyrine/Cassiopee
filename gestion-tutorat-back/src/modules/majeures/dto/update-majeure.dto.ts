import { PartialType } from '@nestjs/mapped-types';
import {  CreateMajeureDto } from './create-majeure.dto';

export class UpdateMajeureDto extends PartialType(CreateMajeureDto) {}
