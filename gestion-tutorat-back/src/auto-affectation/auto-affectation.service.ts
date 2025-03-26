import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Majeures } from 'src/modules/majeures/majeures';
import { ExcelParserService } from 'src/services/import/excel-parser/excel-parser.service';

@Injectable()
export class AutoAffectationService {
  private readonly logger = new Logger(AutoAffectationService.name);
  // Par défaut, 2 INI = 1 ALT
  private readonly equivalence = 2;

  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,

    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,

    @InjectRepository(Majeures)
    private readonly majeuresRepository: Repository<Majeures>,

    private readonly excelParserService: ExcelParserService,
  ) {}

  /**
   * Exécute l’algorithme d’affectation automatique pour les étudiants non assignés.
   * @returns Un objet contenant le nombre total d’étudiants traités, le nombre assigné et les détails de l’affectation.
   */
  async runAffectation(): Promise<{ total: number; assigned: number; details: any[] }> {
    // Charger les étudiants n’ayant pas encore de tuteur, ainsi que les tuteurs et majeures.
    const students = await this.etudiantRepository.find({ where: { tuteur: null } });
    const tutors = await this.tuteurRepository.find();
    const majors = await this.majeuresRepository.find();

    // Construction d’un mapping des majeures à partir des groupes normalisés.
    const majorsInfo: Record<string, { dept: string; responsible: string }> = {};
    for (const m of majors) {
      const key = this.excelParserService.cleanForAffectation(m.groupe);
      majorsInfo[key] = {
        dept: this.excelParserService.cleanForAffectation(m.dept),
        responsible: this.excelParserService.cleanForAffectation(m.responsible),
      };
    }
    this.logger.debug('Majors Info: ' + JSON.stringify(majorsInfo));

    // Création d’une map des tuteurs avec leur capacité restante.
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

    // Trier les étudiants : traiter d’abord les "ALT" puis les "INI".
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

      const majorInfo = majorsInfo[groupKey];
      if (!majorInfo) {
        logs.push(`=> No major info for group '${groupKey}' => Assignment impossible.`);
        details.push({ etudiantId: student.id, assigned: false, logs });
        continue;
      }
      const dept = majorInfo.dept;
      const responsible = majorInfo.responsible;
      let assigned = false;

      // PRIORITÉ 1 : Affectation basée sur le responsable de majeure.
      if (responsible) {
        let candidates = Array.from(tutorsMap.values()).filter(tu => tu.nomTuteur === responsible);
        logs.push(`P1: after name filter => ${candidates.length} tutor(s)`);
        candidates = candidates.filter(tu => this.tutorSupportsLang(tu.langueTutorat, studentLang));
        logs.push(`P1: after language filter => ${candidates.length} tutor(s)`);
        candidates = candidates.filter(tu => this.checkCapacity(tu, studentType));
        logs.push(`P1: after capacity filter => ${candidates.length} tutor(s)`);

        if (candidates.length > 0) {
          candidates.sort((a, b) => this.availableCapacity(b) - this.availableCapacity(a));
          const chosen = candidates[0];
          this.updateCapacity(chosen, studentType);
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
        candidates = candidates.filter(tu => this.checkCapacity(tu, studentType));
        logs.push(`P2: after capacity filter => ${candidates.length} tutor(s)`);

        if (candidates.length > 0) {
          candidates.sort((a, b) => this.availableCapacity(b) - this.availableCapacity(a));
          const chosen = candidates[0];
          this.updateCapacity(chosen, studentType);
          student.tuteur = chosen.tutorEntity;
          assignedCount++;
          assigned = true;
          logs.push(`=> Assigned in Priority 2 to ${chosen.tutorEntity.nom}`);
        } else {
          logs.push('=> No valid candidate in Priority 2.');
        }
      }

      if (!assigned) {
        logs.push('=> Student remains for manual assignment.');
      }

      details.push({ etudiantId: student.id, assigned, logs });
      this.logger.debug(logs.join(' | '));
    }

    // Sauvegarder les étudiants mis à jour (avec tuteur affecté)
    await this.etudiantRepository.save(students);

    return {
      total: students.length,
      assigned: assignedCount,
      details,
    };
  }

  /*========================================================================
      MÉTHODES UTILES POUR L’AFFECTATION
  =========================================================================*/

  /**
   * Vérifie si le tuteur supporte la langue de l’étudiant.
   * La vérification est flexible : si l’un des langages du tuteur contient la langue demandée, c’est accepté.
   * @param tutorLangs Tableau des langues du tuteur.
   * @param studentLang Langue de l’étudiant.
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
   * @param studentType Type d’étudiant ("ALT" ou "INI").
   * @returns true si le tuteur peut encadrer l’étudiant.
   */
  private checkCapacity(tu: any, studentType: string): boolean {
    if (studentType === 'ALT') {
      return tu.capaAlt >= 1 || tu.capaIni >= this.equivalence;
    } else {
      return tu.capaIni >= 1 || tu.capaAlt >= 1 / this.equivalence;
    }
  }

  /**
   * Met à jour la capacité du tuteur suite à l’affectation d’un étudiant.
   * @param tu Les capacités du tuteur.
   * @param studentType Type d’étudiant ("ALT" ou "INI").
   */
  private updateCapacity(tu: any, studentType: string): void {
    if (studentType === 'ALT') {
      if (tu.capaAlt >= 1) {
        tu.capaAlt -= 1;
      } else if (tu.capaIni >= this.equivalence) {
        tu.capaIni -= this.equivalence;
      }
    } else {
      if (tu.capaIni >= 1) {
        tu.capaIni -= 1;
      } else if (tu.capaAlt >= 1 / this.equivalence) {
        tu.capaAlt -= 1 / this.equivalence;
      }
    }
  }

  /**
   * Calcule la capacité totale disponible du tuteur exprimée en unités "INI".
   * @param tu Les capacités du tuteur.
   * @returns Le nombre total d’unités disponibles.
   */
  private availableCapacity(tu: any): number {
    return tu.capaIni + this.equivalence * tu.capaAlt;
  }
}
