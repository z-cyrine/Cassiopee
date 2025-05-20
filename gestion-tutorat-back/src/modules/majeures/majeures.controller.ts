import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MajorsService } from './majeures.service';
import { CreateMajeureDto } from './dto/create-majeure.dto';
import { UpdateMajeureDto } from './dto/update-majeure.dto';
import { RolesGuard } from '../auth/jwt/guards/roles.guard';
import { AuthGuard } from '../auth/jwt/guards/auth.guard';
import { Roles } from '../auth/jwt/decorator/roles.decorator';

@Controller('majeures')
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get('search')
  searchMajors(@Query('code') code?: string, @Query('groupe') groupe?: string) {
    return this.majorsService.searchByCodeOrGroupe(code, groupe);
  }

  // GET /majeures/distinct
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get('distinct')
  getDistinctMajors() {
    return this.majorsService.getDistinctMajors();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get('departments')
  getDistinctDepartments() {
    return this.majorsService.getDistinctDepartments();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get()
  findAll() {
    return this.majorsService.findAll();
  }
  
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get('code-classes')
  getDistinctCodeClasses() {
    return this.majorsService.getDistinctCodeClasses();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.majorsService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateMajeureDto) {
    return this.majorsService.create(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMajeureDto) {
    return this.majorsService.update(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.majorsService.remove(id);
  }

}
