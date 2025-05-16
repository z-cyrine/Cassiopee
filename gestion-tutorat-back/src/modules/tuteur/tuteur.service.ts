import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuteur } from './tuteur.entity';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';

@Injectable()
export class TuteurService {
  constructor(
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
  ) {}

  // CREATE
  async create(createTuteurDto: CreateTuteurDto): Promise<Tuteur> {
    const tuteur = this.tuteurRepository.create(createTuteurDto);
    return await this.tuteurRepository.save(tuteur);
  }

  // READ ALL
  async findAll(): Promise<Tuteur[]> {
    return await this.tuteurRepository.find({ relations: ['etudiants'] });
  }

  // READ ONE
  async findOne(id: number): Promise<Tuteur> {
    const tuteur = await this.tuteurRepository.findOne({
      where: { id },
      relations: ['etudiants'],
    });
    if (!tuteur) {
      throw new NotFoundException(`Tuteur with ID=${id} not found`);
    }
    return tuteur;
  }

  // UPDATE
  async update(id: number, updateTuteurDto: UpdateTuteurDto): Promise<Tuteur> {
    const tuteur = await this.findOne(id);
    Object.assign(tuteur, updateTuteurDto);
    return await this.tuteurRepository.save(tuteur);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const tuteur = await this.findOne(id);
    await this.tuteurRepository.remove(tuteur);
  }

  async getDistinctProfils(): Promise<string[]> {
    const result = await this.tuteurRepository
      .createQueryBuilder('tuteur')
      .select('DISTINCT tuteur.profil', 'profil')
      .where('tuteur.profil IS NOT NULL')
      .getRawMany();

    return result.map(r => r.profil);
  }
}
