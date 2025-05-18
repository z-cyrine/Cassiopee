import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TuteurService } from './tuteur.service';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';
import { Tuteur } from './tuteur.entity';

@Controller('tuteur')
export class TuteurController {
  constructor(private readonly tuteurService: TuteurService) {}

  // CREATE
  @Post()
  create(@Body() createTuteurDto: CreateTuteurDto): Promise<Tuteur> {
    return this.tuteurService.create(createTuteurDto);
  }

  // READ ALL
  @Get()
  findAll(): Promise<Tuteur[]> {
    return this.tuteurService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Tuteur> {
    return this.tuteurService.findOne(id);
  }

  // UPDATE
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTuteurDto: UpdateTuteurDto,
  ): Promise<Tuteur> {
    return this.tuteurService.update(id, updateTuteurDto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tuteurService.remove(id);
  }

  // tuteur.controller.ts
@Get(':id/etudiants')
async getEtudiants(@Param('id') id: number) {
  return this.tuteurService.getEtudiantsForTuteur(+id);
}

}
