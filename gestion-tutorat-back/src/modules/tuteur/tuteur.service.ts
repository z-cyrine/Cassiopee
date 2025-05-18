import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Tuteur } from './tuteur.entity';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';
import { Etudiant } from '../etudiant/etudiant.entity';

@Injectable()
export class TuteurService {
  constructor(
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
  ) {}

  // CREATE
async create(createTuteurDto: CreateTuteurDto): Promise<Tuteur> {
  try {
    const tuteur = this.tuteurRepository.create(createTuteurDto);
    return await this.tuteurRepository.save(tuteur);
  } catch (err) {
    if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
      throw new ConflictException({ duplicate: true, message: 'Cet e-mail est déjà utilisé.' });
    }
    throw new InternalServerErrorException('Erreur interne');
  }
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

  // tuteur.service.ts
async getEtudiantsForTuteur(id: number): Promise<Etudiant[]> {
  const tuteur = await this.tuteurRepository.findOne({
    where: { id },
    relations: ['etudiants'],
  });

  if (!tuteur) {
    throw new NotFoundException(`Tuteur avec l'ID=${id} introuvable`);
  }

  return tuteur.etudiants;
}

}
