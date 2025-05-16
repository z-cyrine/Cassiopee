import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { MajorsService } from './majeures.service';
import { CreateMajeureDto } from './dto/create-majeure.dto';
import { UpdateMajeureDto } from './dto/update-majeure.dto';

@Controller('majeures')
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  // GET /majeures/distinct
  @Get('distinct')
  getDistinctMajors() {
    return this.majorsService.getDistinctMajors();
  }

  // GET /majeures/departments
  @Get('departments')
  getDistinctDepartments() {
    return this.majorsService.getDistinctDepartments();
  }

   @Get()
  findAll() {
    return this.majorsService.findAll();
  }
  
  @Get('code-classes')
  getDistinctCodeClasses() {
    return this.majorsService.getDistinctCodeClasses();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.majorsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMajeureDto) {
    return this.majorsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMajeureDto) {
    return this.majorsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.majorsService.remove(id);
  }



}
