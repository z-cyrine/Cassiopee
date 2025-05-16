import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Etudiant } from './etudiant.entity';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto';
import { Majeures } from '../majeures/majeures';

@Injectable()
export class EtudiantService {
  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
    @InjectRepository(Majeures)
    private readonly majeureRepository: Repository<Majeures>,
  ) {}

async create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant> {
  try {
    const etudiant = this.etudiantRepository.create(createEtudiantDto);
    return await this.etudiantRepository.save(etudiant);
  } catch (err) {
    if (err instanceof QueryFailedError && (err as any).code === 'ER_DUP_ENTRY') {
      // Duplicate email detected
      throw new ConflictException({
        duplicate: true,
        message: 'Cet e-mail est déjà utilisé.'
      });
    }
    throw new InternalServerErrorException('Erreur inattendue lors de la création.');
  }
}



  async findAll(): Promise<Etudiant[]> {
    return await this.etudiantRepository.find({
      relations: ['tuteur', 'majeure'],
    });
  }

 
  async findOne(id: number): Promise<Etudiant> {
    const etudiant = await this.etudiantRepository.findOne({
      where: { id },
      relations: ['tuteur', 'majeure'],
    });
    if (!etudiant) {
      throw new NotFoundException(`Etudiant with ID=${id} not found`);
    }
    return etudiant;
  }


  async update(id: number, updateEtudiantDto: UpdateEtudiantDto): Promise<Etudiant> {
    const etudiant = await this.findOne(id); 
    Object.assign(etudiant, updateEtudiantDto); 
    return this.etudiantRepository.save(etudiant);
  }

 
  async remove(id: number): Promise<void> {
    const etudiant = await this.findOne(id);
    await this.etudiantRepository.remove(etudiant);
  }

  async findAllPaginated(page: number = 1, limit: number = 20): Promise<{ data: Etudiant[]; total: number; page: number; pageCount: number }> {
    const [result, total] = await this.etudiantRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['tuteur', 'majeure'],
      order: { id: 'ASC' }
    });
    return {
      data: result,
      total,
      page,
      pageCount: Math.ceil(total / limit)
    };
  }

  async getDistinctCodeClasses(): Promise<string[]> {
    const result = await this.etudiantRepository
      .createQueryBuilder('etudiant')
      .select('DISTINCT etudiant.codeClasse', 'codeClasse')
      .where('etudiant.codeClasse IS NOT NULL')
      .getRawMany();

    return result.map(r => r.codeClasse);
  }

  async batchUpdate(ids: number[], updateData: Partial<Etudiant>): Promise<Etudiant[]> {
    const etudiants = await this.etudiantRepository.findByIds(ids);
    if (!etudiants.length) {
      throw new NotFoundException('No students found with the provided IDs');
    }
    
    const updatedEtudiants = etudiants.map(etudiant => {
      Object.assign(etudiant, updateData);
      return etudiant;
    });
    
    return this.etudiantRepository.save(updatedEtudiants);
  }

  async diagnostiquerEtudiantsSansMajeure() {
    const etudiants = await this.etudiantRepository.find({ relations: ['majeure'] });
    let sansMajeure = 0;
    let majeureInexistante = 0;
    let majeureSansDept = 0;
    for (const etu of etudiants) {
      if (!etu.majeure) {
        console.log(`Etudiant ID=${etu.id} (${etu.nom} ${etu.prenom}) n'a PAS de majeure (majeureId: ${etu['majeureId'] || 'null'})`);
        sansMajeure++;
      } else {
        // Vérifie que la majeure existe bien en base (sécurité)
        const maj = await this.majeureRepository.findOne({ where: { id: etu.majeure.id } });
        if (!maj) {
          console.log(`Etudiant ID=${etu.id} (${etu.nom} ${etu.prenom}) a une majeureId=${etu.majeure.id} qui n'existe PAS dans la table majeures`);
          majeureInexistante++;
        } else if (!maj.dept) {
          console.log(`Etudiant ID=${etu.id} (${etu.nom} ${etu.prenom}) a une majeure (${maj.code}) SANS département`);
          majeureSansDept++;
        }
      }
    }
    console.log(`\nRésumé :`);
    console.log(`- Etudiants sans majeure : ${sansMajeure}`);
    console.log(`- Etudiants avec majeure inexistante : ${majeureInexistante}`);
    console.log(`- Etudiants avec majeure sans département : ${majeureSansDept}`);
  }

}
