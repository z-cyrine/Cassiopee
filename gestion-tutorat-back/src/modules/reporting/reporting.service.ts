import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Majeures } from 'src/modules/majeures/majeures';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger('ReportingService');

  constructor(
    @InjectRepository(Etudiant) private readonly etudiantRepo: Repository<Etudiant>,
    @InjectRepository(Tuteur) private readonly tuteurRepo: Repository<Tuteur>,
    @InjectRepository(Majeures) private readonly majeureRepo: Repository<Majeures>,
  ) {}

  async getDynamicReporting(filters: any): Promise<any> {
    this.logger.log(`📥 Filtres reçus : ${JSON.stringify(filters)}`);

    const qb = this.etudiantRepo.createQueryBuilder('etudiant')
      .leftJoinAndSelect('etudiant.tuteur', 'tuteur')
      .leftJoinAndSelect('etudiant.majeure', 'majeure');

    // 📌 Filtrage par groupe (nom de la majeure)
    if (filters.groupe?.trim()) {
      const targetMajeure = await this.majeureRepo.findOne({
        where: { groupe: filters.groupe.trim() },
      });

      if (targetMajeure) {
        qb.andWhere('etudiant.majeure = :majeureId', { majeureId: targetMajeure.id });
      } else {
        this.logger.warn(`❗ Aucun majeure trouvée avec groupe='${filters.groupe}'`);
        return [];
      }
    }

    // ✅ Filtrage par statut
    if (filters.assignmentStatus === 'AFFECTES') {
      qb.andWhere('etudiant.affecte = true');
    } else if (filters.assignmentStatus === 'NON_AFFECTES') {
      qb.andWhere('etudiant.affecte = false');
    }

    // ✅ Filtrage par nom ou prénom du tuteur
    if (filters.tuteur) {
      qb.andWhere('(tuteur.nom = :tuteur OR tuteur.prenom = :tuteur)', {
        tuteur: filters.tuteur,
      });
    }

    // ✅ Filtrage par nom ou prénom de l'étudiant
    if (filters.etudiant) {
      qb.andWhere('(etudiant.nom = :etudiant OR etudiant.prenom = :etudiant)', {
        etudiant: filters.etudiant,
      });
    }

    // ✅ Filtrage par langue
    if (filters.langue) {
      qb.andWhere('etudiant.langue LIKE :langue', {
        langue: `%${filters.langue}%`,
      });
    }

    // ✅ Filtrage par département (majeure.dept)
    if (filters.departement) {
      qb.andWhere('majeure.dept = :dept', { dept: filters.departement });
    }

    const sql = qb.getSql();
    this.logger.debug(`🧠 SQL généré :\n${sql}`);

    const results = await qb.getMany();
    this.logger.log(`🔍 Résultats : ${results.length}`);
    return results;
  }
}
