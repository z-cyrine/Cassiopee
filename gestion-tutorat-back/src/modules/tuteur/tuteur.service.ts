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

  // Profil distincts
  async getDistinctProfils(): Promise<string[]> {
    const result = await this.tuteurRepository
      .createQueryBuilder('tuteur')
      .select('DISTINCT tuteur.profil', 'profil')
      .where('tuteur.profil IS NOT NULL')
      .getRawMany();

    return result.map(r => r.profil);
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


async searchByName(nom?: string, prenom?: string): Promise<Tuteur[]> {
  const query = this.tuteurRepository
    .createQueryBuilder('tuteur')
    .leftJoinAndSelect('tuteur.etudiants', 'etudiant');

  if (nom) {
    query.andWhere('tuteur.nom LIKE :nom', { nom: `%${nom}%` });
  }

  if (prenom) {
    query.andWhere('tuteur.prenom LIKE :prenom', { prenom: `%${prenom}%` });
  }

  const result = await query.getMany();

  if (result.length === 0) {
    throw new NotFoundException('Aucun tuteur ne correspond à la recherche.');
  }

  return result;
}


}
