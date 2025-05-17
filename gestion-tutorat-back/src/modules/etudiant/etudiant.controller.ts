import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    ParseIntPipe,
    Query,
    DefaultValuePipe,
  } from '@nestjs/common';
  import { EtudiantService } from './etudiant.service';
  import { CreateEtudiantDto } from './dto/create-etudiant.dto';
  import { UpdateEtudiantDto } from './dto/update-etudiant.dto';
  import { Etudiant } from './etudiant.entity';
  
  @Controller('etudiant')
  export class EtudiantController {
    constructor(private readonly etudiantService: EtudiantService) {}
  
    @Get('all')
    findAllNotPaginated() {
      return this.etudiantService.findAll();
    }

    // CREATE
    @Post()
    create(@Body() createEtudiantDto: CreateEtudiantDto): Promise<Etudiant> {
      return this.etudiantService.create(createEtudiantDto);
    }
  
    // READ ALL
    @Get()
    findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 20
    ) {
      return this.etudiantService.findAllPaginated(Number(page), Number(limit));
    }
    // READ ONE
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Etudiant> {
      return this.etudiantService.findOne(id);
    }
  
    // UPDATE
    @Put(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateEtudiantDto: UpdateEtudiantDto,
    ): Promise<Etudiant> {
      return this.etudiantService.update(id, updateEtudiantDto);
    }
  
    // DELETE
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return this.etudiantService.remove(id);
    }

    @Put(':id/freeze')
    freeze(@Param('id', ParseIntPipe) id: number): Promise<Etudiant> {
      return this.etudiantService.update(id, { frozen: true });
    }

    @Put(':id/unfreeze')
    unfreeze(@Param('id', ParseIntPipe) id: number): Promise<Etudiant> {
      return this.etudiantService.update(id, { frozen: false });
    }

    @Put('batch/freeze')
    batchFreeze(@Body() ids: number[]): Promise<Etudiant[]> {
      return this.etudiantService.batchUpdate(ids, { frozen: true });
    }

    @Put('batch/unfreeze')
    batchUnfreeze(@Body() ids: number[]): Promise<Etudiant[]> {
      return this.etudiantService.batchUpdate(ids, { frozen: false });
    }

    @Get('diagnostic-majeures')
    async diagnosticMajeures() {
      await this.etudiantService.diagnostiquerEtudiantsSansMajeure();
      return { success: true };
    }
  }
  