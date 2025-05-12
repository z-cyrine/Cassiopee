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
  } from '@nestjs/common';
  import { EtudiantService } from './etudiant.service';
  import { CreateEtudiantDto } from './dto/create-etudiant.dto';
  import { UpdateEtudiantDto } from './dto/update-etudiant.dto';
  import { Etudiant } from './etudiant.entity';
  
  @Controller('etudiant')
  export class EtudiantController {
    constructor(private readonly etudiantService: EtudiantService) {}
  
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
  
    @Get('all')
    findAllNotPaginated() {
      return this.etudiantService.findAll();
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
  }
  