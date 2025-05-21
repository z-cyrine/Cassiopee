import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards, ForbiddenException, Request, NotFoundException } from '@nestjs/common';
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
  @Roles('admin', 'prof')
  @Get('by-user-email')
  async getTuteurByUserEmail(@Query('email') email: string): Promise<Tuteur> {
    if (!email) {
      throw new NotFoundException('Email requis');
    }
    return await this.tuteurService.findByEmail(email);
  }


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

@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'consultation', 'prof')
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<Tuteur> {
  if (req.user?.role === 'prof') {
    const tuteur = await this.tuteurService.findByEmail(req.user.email);

    if (!tuteur) {
      throw new ForbiddenException("Tuteur non trouvé pour cet utilisateur.");
    }

    // On ignore l’ID dans l’URL pour éviter les erreurs et on retourne le bon tuteur
    return this.tuteurService.findOne(tuteur.id);
  }

  // Cas admin / consultation
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

@Get(':id/etudiants')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'consultation', 'prof')
async getEtudiants(@Param('id', ParseIntPipe) id: number, @Request() req) {
  if (req.user.role === 'prof') {
    const tuteur = await this.tuteurService.findByEmail(req.user.email);

    if (!tuteur) {
      throw new ForbiddenException('Tuteur non trouvé pour cet utilisateur.');
    }

    // Ignore l'id fourni et retourne les étudiants du tuteur connecté
    return this.tuteurService.getEtudiantsForTuteur(tuteur.id);
  }

  // Cas admin / consultation
  return this.tuteurService.getEtudiantsForTuteur(id);
}



 @Get('etudiants')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin', 'consultation', 'prof')
async getEtudiantsByNomPrenom(
  @Query('nom') nom: string,
  @Query('prenom') prenom: string,
  @Request() req
) {
  if (req.user.role === 'prof') {
    const tuteur = await this.tuteurService.findByEmail(req.user.email);

    if (!tuteur || tuteur.nom.toLowerCase() !== nom?.toLowerCase() || tuteur.prenom.toLowerCase() !== prenom?.toLowerCase()) {
      throw new ForbiddenException('Vous ne pouvez consulter que vos propres étudiants.');
    }
  }

  return this.tuteurService.getEtudiantsForTuteurByNomPrenom(nom, prenom);
}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'prof')
  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.tuteurService.findByEmail(email);
  }



  }

