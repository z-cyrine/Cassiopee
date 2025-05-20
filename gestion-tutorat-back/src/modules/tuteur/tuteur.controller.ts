import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { TuteurService } from './tuteur.service';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';
import { Tuteur } from './tuteur.entity';
import { Roles } from '../auth/jwt/decorator/roles.decorator';
import { AuthGuard } from '../auth/jwt/guards/auth.guard';
import { RolesGuard } from '../auth/jwt/guards/roles.guard';

@Controller('tuteur')
export class TuteurController {
  constructor(private readonly tuteurService: TuteurService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get('search')
search(
  @Query('nom') nom?: string,
  @Query('prenom') prenom?: string
): Promise<Tuteur[]> {
  return this.tuteurService.searchByName(nom, prenom);
}

  // CREATE
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() createTuteurDto: CreateTuteurDto): Promise<Tuteur> {
    return this.tuteurService.create(createTuteurDto);
  }

  // READ ALL
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get()
  findAll(): Promise<Tuteur[]> {
    return this.tuteurService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get('profils')
  getDistinctProfils() {
    return this.tuteurService.getDistinctProfils();
  }

  // READ ONE
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tuteur> {
    return this.tuteurService.findOne(id);
  }

  // UPDATE
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTuteurDto: UpdateTuteurDto,
  ): Promise<Tuteur> {
    return this.tuteurService.update(id, updateTuteurDto);
  }

  // DELETE
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tuteurService.remove(id);
  }

  // tuteur.controller.ts
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation', 'prof')
  @Get(':id/etudiants')
  async getEtudiants(@Param('id') id: number, @Request() req) {
    // Si c'est un prof, il ne peut voir que ses propres étudiants
    if (req.user.role === 'prof' && req.user.id !== Number(id)) {
      throw new ForbiddenException('Vous ne pouvez consulter que vos propres étudiants.');
    }
    return this.tuteurService.getEtudiantsForTuteur(+id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation', 'prof')
  @Get('etudiants')
  async getEtudiantsByNomPrenom(
    @Query('nom') nom: string,
    @Query('prenom') prenom: string,
    @Request() req
  ) {
    // Si c'est un prof, vérifier que c'est bien son nom et prénom
    if (req.user.role === 'prof') {
      if (req.user.name !== nom || req.user.prenom !== prenom) {
        throw new ForbiddenException('Vous ne pouvez consulter que vos propres étudiants.');
      }
    }
    return this.tuteurService.getEtudiantsForTuteurByNomPrenom(nom, prenom);
  }

  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.tuteurService.findByEmail(email);
  }


}
