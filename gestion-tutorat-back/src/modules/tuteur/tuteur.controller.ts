import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TuteurService } from './tuteur.service';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';

@Controller('tuteur')
export class TuteurController {
  constructor(private readonly tuteurService: TuteurService) {}

  @Post()
  create(@Body() createTuteurDto: CreateTuteurDto) {
    return this.tuteurService.create(createTuteurDto);
  }

  @Get()
  findAll() {
    return this.tuteurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tuteurService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTuteurDto: UpdateTuteurDto) {
    return this.tuteurService.update(+id, updateTuteurDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tuteurService.remove(+id);
  }
}
