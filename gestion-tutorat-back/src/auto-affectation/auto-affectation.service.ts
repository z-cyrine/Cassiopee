import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Majeures } from 'src/modules/majeures/majeures';
import { ExcelParserService } from 'src/services/import/excel-parser/excel-parser.service';

@Injectable()
export class AutoAffectationService {
  private readonly logger = new Logger(AutoAffectationService.name);

  // Stockage en mémoire du dernier état d'affectation
  private lastAffectationResult: any = null;

  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,

    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,

    @InjectRepository(Majeures)
    private readonly majeuresRepository: Repository<Majeures>,

    private readonly excelParserService: ExcelParserService,
  ) { }

  /**
   * Exécute l'algorithme d'affectation automatique pour les étudiants non assignés.
   * @returns Un objet contenant le nombre total d'étudiants traités, le nombre assigné et les détails de l'affectation.
   */
  async runAffectation(equivalence = 2): Promise<{ total: number; assigned: number; details: any[]; lastUpdated: Date; stats: any }> {
    // Réinitialise tous les étudiants et tuteurs avant l'affectation
    await this.resetAffectationState();
    // Charger les étudiants n'ayant pas encore de tuteur et non figés, ainsi que les tuteurs et majeures.
    const students = await this.etudiantRepository.find({ where: { tuteur: null, frozen: false }, relations: ['majeure'] });
    const tutors = await this.tuteurRepository.find();
    
    // Création d'une map des tuteurs avec leur capacité restante.
    const tutorsMap = new Map<number, any>();
    for (const t of tutors) {
      tutorsMap.set(t.id, {
        tutorEntity: t,
        nomTuteur: (t.nom || '').toUpperCase(),
        deptTuteur: (t.departement || '').toUpperCase(),
        // On utilise la méthode de parsing des langues du service de parsing.
        langueTutorat: (t.langueTutorat || []).map(x => x.toUpperCase()),
        capaAlt: t.parTutoratAlt - t.tutoratAltAff,
        capaIni: t.parTutoratIni - t.tutoratIniAff,
      });
    }

    // Trier les étudiants : traiter d'abord les "ALT" puis les "INI".
    students.sort((a, b) => {
      const A = a.iniAlt?.toUpperCase() === 'ALT' ? 0 : 1;
      const B = b.iniAlt?.toUpperCase() === 'ALT' ? 0 : 1;
      return A - B;
    });

    let assignedCount = 0;
    const details = [];

    // Parcourir la liste des étudiants et tenter l'affectation.
    for (const student of students) {
      const logs: string[] = [];
      const groupKey = this.excelParserService.cleanForAffectation(student.nomGroupe);
      const studentLang = (student.langue || '').trim().toUpperCase();
      const studentType = (student.iniAlt || '').trim().toUpperCase();

      logs.push(`Student ID=${student.id}, Group=${groupKey}, Lang=${studentLang}, Type=${studentType}`);

      const major = student.majeure;
      if (!major) {
        logs.push(`=> No major linked to student => Assignment impossible.`);
        continue;
      }
      const dept = (major.dept || '').toUpperCase();
      const responsible = (major.responsible || '').toUpperCase();
      let assigned = false;

      // PRIORITÉ 1 : Affectation basée sur le responsable de majeure.
      if (responsible) {
        let candidates = Array.from(tutorsMap.values()).filter(tu => tu.nomTuteur === responsible);
        logs.push(`P1: after name filter => ${candidates.length} tutor(s)`);
        candidates = candidates.filter(tu => this.tutorSupportsLang(tu.langueTutorat, studentLang));
        logs.push(`P1: after language filter => ${candidates.length} tutor(s)`);
        candidates = candidates.filter(tu => this.checkCapacity(tu, studentType, equivalence));
        logs.push(`P1: after capacity filter => ${candidates.length} tutor(s)`);

        if (candidates.length > 0) {
          candidates.sort((a, b) => this.availableCapacity(b, equivalence) - this.availableCapacity(a, equivalence));
          const chosen = candidates[0];
          this.updateCapacity(chosen, studentType, equivalence);
          student.tuteur = chosen.tutorEntity;
          assignedCount++;
          assigned = true;
          logs.push(`=> Assigned in Priority 1 to ${chosen.tutorEntity.nom}`);
        } else {
          logs.push('=> No valid candidate in Priority 1.');
        }
      } else {
        logs.push(`=> No responsible defined for group '${groupKey}'.`);
      }

      // PRIORITÉ 2 : Affectation basée sur le département.
      if (!assigned && dept) {
        logs.push(`P2: Department filter = ${dept}`);
        let candidates = Array.from(tutorsMap.values()).filter(tu =>
          this.departmentMatches(tu.deptTuteur, dept)
        );
        logs.push(`P2: after department filter => ${candidates.length} tutor(s)`);
        candidates = candidates.filter(tu => this.tutorSupportsLang(tu.langueTutorat, studentLang));
        logs.push(`P2: after language filter => ${candidates.length} tutor(s)`);
        candidates = candidates.filter(tu => this.checkCapacity(tu, studentType, equivalence));
        logs.push(`P2: after capacity filter => ${candidates.length} tutor(s)`);

        if (candidates.length > 0) {
          candidates.sort((a, b) => this.availableCapacity(b, equivalence) - this.availableCapacity(a, equivalence));
          const chosen = candidates[0];
          this.updateCapacity(chosen, studentType, equivalence);
          student.tuteur = chosen.tutorEntity;
          assignedCount++;
          assigned = true;
          logs.push(`=> Assigned in Priority 2 to ${chosen.tutorEntity.nom}`);
        } else {
          logs.push('=> No valid candidate in Priority 2.');
        }
      }

      if (assigned && student.tuteur) {
        // Met à jour les compteurs sur l'entité tuteur
        const tuteur = tutors.find(t => t.id === student.tuteur.id);
        if (tuteur) {
          if (studentType === 'ALT') {
            tuteur.tutoratAltAff = (tuteur.tutoratAltAff || 0) + 1;
            tuteur.soldeAlt = (tuteur.parTutoratAlt || 0) - tuteur.tutoratAltAff;
          } else {
            tuteur.tutoratIniAff = (tuteur.tutoratIniAff || 0) + 1;
            tuteur.soldeIni = (tuteur.parTutoratIni || 0) - tuteur.tutoratIniAff;
          }
          tuteur.nbTutoratAffecte = (tuteur.tutoratAltAff || 0) + (tuteur.tutoratIniAff || 0);
          tuteur.soldeTutoratRestant = ((tuteur.parTutoratAlt || 0) + (tuteur.parTutoratIni || 0)) - tuteur.nbTutoratAffecte;
        }
      }

      if (!assigned) {
        logs.push('=> Student remains for manual assignment.');
      }

      details.push({
        ...student,
        etudiantId: student.id,
        tutorNom: student.tuteur ? student.tuteur.nom : '',
        tutorPrenom: student.tuteur ? student.tuteur.prenom : '',
        tutorDept: student.tuteur ? student.tuteur.departement : '',
        logs,
        assigned,
      });

      student.affecte = assigned;
      student.logs = logs.join('\n');

      this.logger.debug(logs.join(' | '));
    }

    // Sauvegarder les étudiants mis à jour (avec tuteur affecté)
    // Recharge la relation majeure avant le save massif
    const studentsWithMaj = await this.etudiantRepository.find({ where: { id: In(students.map(s => s.id)) }, relations: ['majeure'] });
    for (const s of students) {
      const majStudent = studentsWithMaj.find(e => e.id === s.id);
      if (majStudent) {
        majStudent.tuteur = s.tuteur;
        majStudent.affecte = s.affecte;
        majStudent.logs = s.logs;
      }
    }
    await this.etudiantRepository.save(studentsWithMaj);
    await this.tuteurRepository.save(tutors);

    const lastUpdated = await this.getLastUpdated();
    const stats = await this.getStats(details);
    const result = {
      total: students.length,
      assigned: assignedCount,
      details,
      lastUpdated,
      stats,
    };
    this.lastAffectationResult = result; // On stocke le dernier état
    return result;
  }

  public async resetAffectationState() {
    // Réinitialise tous les étudiants
    const allStudents = await this.etudiantRepository.find({ relations: ['majeure'] });
    for (const etu of allStudents) {
      etu.tuteur = null;
      etu.affecte = false;
      etu.logs = '';
    }
    await this.etudiantRepository.save(allStudents);

    // Réinitialise tous les tuteurs
    const allTuteurs = await this.tuteurRepository.find();
    for (const tut of allTuteurs) {
      tut.tutoratAltAff = 0;
      tut.tutoratIniAff = 0;
      tut.soldeAlt = tut.parTutoratAlt || 0;
      tut.soldeIni = tut.parTutoratIni || 0;
      tut.nbTutoratAffecte = 0;
      tut.soldeTutoratRestant = (tut.parTutoratAlt || 0) + (tut.parTutoratIni || 0);
    }
    await this.tuteurRepository.save(allTuteurs);
  }

  /*========================================================================
      MÉTHODES UTILES POUR L'AFFECTATION
  =========================================================================*/

  /**
   * Vérifie si le tuteur supporte la langue de l'étudiant.
   * La vérification est flexible : si l'un des langages du tuteur contient la langue demandée, c'est accepté.
   * @param tutorLangs Tableau des langues du tuteur.
   * @param studentLang Langue de l'étudiant.
   * @returns true si la langue est supportée.
   */
  private tutorSupportsLang(tutorLangs: string[], studentLang: string): boolean {
    const stLang = studentLang.trim().toUpperCase();
    return tutorLangs.some(lang => lang.includes(stLang));
  }

  /**
   * Vérifie si le département du tuteur correspond (partiellement) au département attendu.
   * @param tutorDept Département du tuteur.
   * @param expectedDept Département attendu.
   * @returns true si une correspondance partielle est trouvée.
   */
  private departmentMatches(tutorDept: string, expectedDept: string): boolean {
    return tutorDept.trim().toUpperCase().includes(expectedDept.trim().toUpperCase());
  }

  /**
   * Vérifie si le tuteur dispose de la capacité pour un étudiant donné.
   * @param tu Les capacités du tuteur.
   * @param studentType Type d'étudiant ("ALT" ou "INI").
   * @returns true si le tuteur peut encadrer l'étudiant.
   */
  private checkCapacity(tu: any, studentType: string, equivalence: number): boolean {
    if (studentType === 'ALT') {
      return tu.capaAlt >= 1 || tu.capaIni >= equivalence;
    } else {
      return tu.capaIni >= 1 || tu.capaAlt >= 1 / equivalence;
    }
  }

  /**
   * Met à jour la capacité du tuteur suite à l'affectation d'un étudiant.
   * @param tu Les capacités du tuteur.
   * @param studentType Type d'étudiant ("ALT" ou "INI").
   */
  private updateCapacity(tu: any, studentType: string, equivalence: number): void {
    if (studentType === 'ALT') {
      if (tu.capaAlt >= 1) {
        tu.capaAlt -= 1;
      } else if (tu.capaIni >= equivalence) {
        tu.capaIni -= equivalence;
      }
    } else {
      if (tu.capaIni >= 1) {
        tu.capaIni -= 1;
      } else if (tu.capaAlt >= 1 / equivalence) {
        tu.capaAlt -= 1 / equivalence;
      }
    }
  }

  /**
   * Calcule la capacité totale disponible du tuteur exprimée en unités "INI".
   * @param tu Les capacités du tuteur.
   * @returns Le nombre total d'unités disponibles.
   */
  private availableCapacity(tu: any, equivalence: number): number {
    return tu.capaIni + equivalence * tu.capaAlt;
  }

  private async getLastUpdated(): Promise<Date> {
    // Cherche la date de dernière modification d'un étudiant ou tuteur
    const lastStudent = await this.etudiantRepository.createQueryBuilder('etudiant')
      .orderBy('etudiant.id', 'DESC')
      .getOne();
    const lastTuteur = await this.tuteurRepository.createQueryBuilder('tuteur')
      .orderBy('tuteur.id', 'DESC')
      .getOne();
    const dates = [lastStudent?.updatedAt, lastTuteur?.updatedAt].filter(Boolean).map(d => new Date(d));
    return dates.length ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
  }

  private async getStats(details: any[]): Promise<any> {
    // Nombre de tuteurs saturés
    const tuteurs = await this.tuteurRepository.find();
    const tuteursSatures = tuteurs.filter(t => (t.soldeAlt || 0) + (t.soldeIni || 0) + (t.soldeTutoratRestant || 0) === 0).length;
    // Nombre d'étudiants sans tuteur par majeure
    const etudiantsSansTuteur = details.filter(d => !d.assigned);
    const parMajeure: Record<string, number> = {};
    etudiantsSansTuteur.forEach(e => {
      const maj = e.majeure?.code || 'Inconnue';
      parMajeure[maj] = (parMajeure[maj] || 0) + 1;
    });
    return {
      tuteursSatures,
      etudiantsSansTuteurParMajeure: parMajeure,
    };
  }

  async getEtatAffectation(): Promise<{ total: number; assigned: number; details: any[]; lastUpdated: Date; stats: any }> {
    if (this.lastAffectationResult) {
      return this.lastAffectationResult;
    }
    // Si aucun run n'a encore été fait, retourne l'état courant (fallback)
    const students = await this.etudiantRepository.find({ relations: ['tuteur', 'majeure'] });
    const details = students.map(student => ({
      ...student,
      etudiantId: student.id,
      tutorNom: student.tuteur ? student.tuteur.nom : '',
      tutorPrenom: student.tuteur ? student.tuteur.prenom : '',
      tutorDept: student.tuteur ? student.tuteur.departement : '',
      assigned: !!student.tuteur,
      frozen: student.frozen,
      logs: student.logs || '',
    }));
    const assigned = details.filter(d => d.assigned).length;
    const lastUpdated = await this.getLastUpdated();
    const stats = await this.getStats(details);
    return {
      total: students.length,
      assigned,
      details,
      lastUpdated,
      stats,
    };
  }
}
