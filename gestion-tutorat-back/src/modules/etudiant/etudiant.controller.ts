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
    UseGuards,
  } from '@nestjs/common';
  import { EtudiantService } from './etudiant.service';
  import { CreateEtudiantDto } from './dto/create-etudiant.dto';
  import { UpdateEtudiantDto } from './dto/update-etudiant.dto';
  import { Etudiant } from './etudiant.entity';
  import { RolesGuard } from '../auth/jwt/guards/roles.guard';
  import { AuthGuard } from '../auth/jwt/guards/auth.guard';
  import { Roles } from '../auth/jwt/decorator/roles.decorator';
  
  @Controller('etudiant')
  export class EtudiantController {
    constructor(private readonly etudiantService: EtudiantService) {}
  @Get('search')
async searchByName(
  @Query('nom') nom?: string,
  @Query('prenom') prenom?: string,
): Promise<Etudiant[]> {
  return this.etudiantService.searchByName(nom, prenom);
}

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin','consultation')
    @Get('all')
    findAllNotPaginated() {
      return this.etudiantService.findAll();
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    // CREATE
    @Post()
    create(@Body() createEtudiantDto: CreateEtudiantDto): Promise<Etudiant> {
      return this.etudiantService.create(createEtudiantDto);
    }
  
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin','consultation')
    // READ ALL
    @Get()
    findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 20
    ) {
      return this.etudiantService.findAllPaginated(Number(page), Number(limit));
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin','consultation', 'prof')
    // READ ONE
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Etudiant> {
      return this.etudiantService.findOne(id);
    }
  
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    // UPDATE
    @Put(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateEtudiantDto: UpdateEtudiantDto,
    ): Promise<Etudiant> {
      return this.etudiantService.update(id, updateEtudiantDto);
    }
  
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    // DELETE
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return this.etudiantService.remove(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/freeze')
    freeze(@Param('id', ParseIntPipe) id: number): Promise<Etudiant> {
      return this.etudiantService.update(id, { frozen: true });
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/unfreeze')
    unfreeze(@Param('id', ParseIntPipe) id: number): Promise<Etudiant> {
      return this.etudiantService.update(id, { frozen: false });
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Put('batch/freeze')
    batchFreeze(@Body() ids: number[]): Promise<Etudiant[]> {
      return this.etudiantService.batchUpdate(ids, { frozen: true });
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Put('batch/unfreeze')
    batchUnfreeze(@Body() ids: number[]): Promise<Etudiant[]> {
      return this.etudiantService.batchUpdate(ids, { frozen: false });
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Get('diagnostic-majeures')
    async diagnosticMajeures() {
      await this.etudiantService.diagnostiquerEtudiantsSansMajeure();
      return { success: true };
    }

    
  }
  