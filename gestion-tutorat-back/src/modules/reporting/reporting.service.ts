import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etudiant } from '../etudiant/etudiant.entity';
import { Majeures } from '../majeures/majeures';
import { Tuteur } from '../tuteur/tuteur.entity';

@Injectable()
export class ReportingService {
  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
    
    @InjectRepository(Majeures)
    private readonly majeuresRepository: Repository<Majeures>,

    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
  ) {}

  async getDynamicReporting(filters: any): Promise<any> {
    const queryBuilder = this.etudiantRepository.createQueryBuilder('etudiant');
    
    // Join Majeures and Tuteurs
    queryBuilder.leftJoinAndSelect('etudiant.majeure', 'majeure');
    queryBuilder.leftJoinAndSelect('etudiant.tuteur', 'tuteur');
    
    // Apply filters based on the received query parameters
    if (filters.assignmentStatus) {
      if (filters.assignmentStatus === 'AFFECTES') {
        queryBuilder.andWhere('etudiant.affecte = :affecte', { affecte: true });
      } else if (filters.assignmentStatus === 'NON_AFFECTES') {
        queryBuilder.andWhere('etudiant.affecte = :affecte', { affecte: false });
      }
    }
    
    if (filters.majeure) {
      queryBuilder.andWhere('majeure.code = :majeure', { majeure: filters.majeure });
    }
    
    if (filters.departement) {
      queryBuilder.andWhere('majeure.dept = :dept', { dept: filters.departement });
    }
    
    if (filters.tuteur) {
      queryBuilder.andWhere('tuteur.nom LIKE :tuteur', { tuteur: `%${filters.tuteur}%` });
    }
    
    if (filters.etudiant) {
      queryBuilder.andWhere('etudiant.nom LIKE :etudiant', { etudiant: `%${filters.etudiant}%` });
    }

    if (filters.langue) {
      queryBuilder.andWhere('etudiant.langue LIKE :langue', { langue: `%${filters.langue}%` });
    }

    if (filters.checkAll) {
      queryBuilder.andWhere('1 = 1');  // No filter applied, select all
    }

    // Execute the query and return the result
    return await queryBuilder.getMany();
  }
}
