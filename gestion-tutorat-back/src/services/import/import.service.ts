import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';

import { ExcelParserService } from './excel-parser/excel-parser.service';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Majeures } from 'src/modules/majeures/majeures';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  constructor(
    private readonly excelParserService: ExcelParserService,
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
    @InjectRepository(Majeures)
    private readonly majeuresRepository: Repository<Majeures>,
  ) {}

  /*========================================================================
      PROCESSUS D’IMPORTATION DES DONNÉES
  =========================================================================*/

  /**
   * Traite le fichier "PAR tutorat" pour importer les tuteurs.
   * Avant insertion, on supprime tous les tuteurs et étudiants afin de respecter les contraintes FK.
   */
  async processParTutorat(file: Express.Multer.File): Promise<void> {
    const data = this.excelParserService.parseExcel(file.path);
    await this.clearTuteurs();
    await this.insertTuteurs(data);
  }

  /**
   * Traite le fichier "Tutorats" pour importer les étudiants.
   * Le champ "tuteur" est forcé à null pour permettre l'affectation ultérieure.
   */
  async processTutorats(file: Express.Multer.File): Promise<void> {
    const data = this.excelParserService.parseExcel(file.path);
    await this.clearEtudiants();
    await this.insertEtudiants(data);
  }

  /**
   * Traite le fichier des majeures et insère les majeures dans la base.
   * Le fichier doit contenir au moins 7 lignes.
   */
  async processMajors(file: Express.Multer.File): Promise<void> {
    const data2D = this.excelParserService.parseExcelMajors(file.path);
    if (!Array.isArray(data2D) || data2D.length < 7) {
      throw new BadRequestException(
        "Le fichier des majeures n'a pas le format attendu (au moins 7 lignes)."
      );
    }

    // Extraction des 7 premières lignes :
    // 0: groupes, 1: départements, 2: responsables, 3: langues, 4: INI/ALT, 5: programme, 6: code classe
    await this.clearMajors();

    const [rowGroupe, rowDept, rowResponsible, rowLangue, rowIniAlt, rowProgramme, rowCodeClasse] = data2D;
    const majorsToSave: Majeures[] = [];
    const nbCols = rowGroupe.length;

    // Ignorer la première colonne (titre)
    for (let colIndex = 1; colIndex < nbCols; colIndex++) {
      const maj = new Majeures();
      maj.groupe = this.excelParserService.cleanForAffectation(rowGroupe[colIndex]);
      maj.dept = this.excelParserService.cleanForAffectation(rowDept[colIndex]);
      maj.responsible = this.excelParserService.cleanForAffectation(rowResponsible[colIndex]);
      maj.langue = this.excelParserService.cleanForAffectation(rowLangue[colIndex]);
      maj.iniAlt = this.excelParserService.cleanForAffectation(rowIniAlt[colIndex]);
      maj.programme = this.excelParserService.cleanForAffectation(rowProgramme[colIndex]);
      maj.code = this.excelParserService.cleanForAffectation(rowCodeClasse[colIndex]);

      majorsToSave.push(maj);
    }

    if (majorsToSave.length === 0) {
      this.logger.warn('⚠️ Aucune majeure trouvée dans le fichier.');
      return;
    }

    await this.majeuresRepository.save(majorsToSave);
    this.logger.log(`✅ ${majorsToSave.length} majeures insérées en base.`);
  }

  /*========================================================================
      MÉTHODES DE NETTOYAGE / SUPPRESSION
  =========================================================================*/

  private async clearMajors(): Promise<void> {
    await this.majeuresRepository.query(`DELETE FROM majeures;`);
    await this.majeuresRepository.query(`ALTER TABLE majeures AUTO_INCREMENT = 1;`);
  }

  private async clearTuteurs(): Promise<void> {
    // Dissocier les étudiants de leurs tuteurs pour respecter les clés étrangères
    await this.etudiantRepository.query(`UPDATE etudiant SET tuteurId = NULL;`);
    await this.etudiantRepository.query(`DELETE FROM etudiant;`);
    await this.tuteurRepository.query(`DELETE FROM tuteur;`);
    await this.tuteurRepository.query(`ALTER TABLE tuteur AUTO_INCREMENT = 1;`);
    await this.etudiantRepository.query(`ALTER TABLE etudiant AUTO_INCREMENT = 1;`);
  }

  private async clearEtudiants(): Promise<void> {
    await this.etudiantRepository.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await this.etudiantRepository.query(`DELETE FROM etudiant;`);
    await this.etudiantRepository.query(`ALTER TABLE etudiant AUTO_INCREMENT = 1;`);
    await this.etudiantRepository.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }

  /*========================================================================
      MÉTHODES D'INSERTION EN BASE
  =========================================================================*/

  /**
   * Insère les tuteurs dans la base à partir des données extraites.
   */
  private async insertTuteurs(data: any[]): Promise<void> {
    const tuteurs = data.map(row => ({
      nom: this.excelParserService.cleanForAffectation(row['NOM TUTEUR']),
      prenom: this.excelParserService.cleanForAffectation(row['PRENOM TUTEUR']),
      email: this.excelParserService.cleanForAffectation(row['adresse e-mail']),
      departement: this.excelParserService.cleanForAffectation(row['DPT TUTEUR']),
      estEligiblePourTutorat: this.excelParserService.parseEligibleTutorat(row['Peut faire des tutorats ?']),
      statut: this.excelParserService.cleanForAffectation(row['Statut PERM/VAC']),
      colonne2: this.excelParserService.cleanForAffectation(row['Colonne2']),
      infoStatut: this.excelParserService.cleanForAffectation(row['Info Statut']),
      langueTutorat: this.excelParserService.parseLangueTutorat(row['Langue Tutorat']),
      profil: this.excelParserService.cleanForAffectation(row['Profil']),
      parTutoratAlt: this.excelParserService.toNumber(row['#PAR Tutorat ALT']),
      tutoratAltAff: this.excelParserService.toNumber(row['Tutorat ALT - Affecté']),
      soldeAlt: this.excelParserService.toNumber(row['SOLDE ALT']),
      parTutoratIni: this.excelParserService.toNumber(row['# PAR  Tutorat INI']),
      tutoratIniAff: this.excelParserService.toNumber(row['Tutorat INI - Affecté']),
      soldeIni: this.excelParserService.toNumber(row['SOLDE INI']),
      totalEtudiantsPar: this.excelParserService.toNumber(row['Tot étudiants du par']),
      nbTutoratAffecte: this.excelParserService.toNumber(row['NB TUTORAT ALT+INI AFFECTE']),
      soldeTutoratRestant: this.excelParserService.toNumber(row['Solde nombre tutorat restant à affecter ALT+INI']),
      matieres: this.excelParserService.parseList(row['DONNE DES COURS DANS LA/LES MAJEURES ']),
      domainesExpertise: this.excelParserService.parseList(row["DOMAINES d'expertise"]),
    }));

    if (!tuteurs.length) {
      this.logger.warn('⚠️ Aucun tuteur trouvé dans le fichier.');
      return;
    }

    await this.tuteurRepository.save(tuteurs);
    this.logger.log(`✅ ${tuteurs.length} tuteurs insérés en base.`);
  }

  /**
   * Insère les étudiants dans la base à partir des données extraites.
   * Le champ "tuteur" est forcé à null pour permettre l'affectation ultérieure.
   */
  private async insertEtudiants(data: any[]): Promise<void> {
    const etudiants = data.map(row => ({
      emailEcole: this.excelParserService.cleanForAffectation(row['Adresse Mail Ecole']),
      origine: this.excelParserService.cleanForAffectation(row['Origine']),
      ecole: this.excelParserService.cleanForAffectation(row['Ecole']),
      prenom: this.excelParserService.cleanForAffectation(row['Prenom Etudiant']),
      nom: this.excelParserService.cleanForAffectation(row['Nom Etudiant']),
      obligationInternational: this.excelParserService.cleanForAffectation(row["Obligation à l'International"]),
      stage1A: this.excelParserService.cleanForAffectation(row['Stage 1A']),
      codeClasse: this.excelParserService.cleanForAffectation(row['Code Classe']),
      nomGroupe: this.excelParserService.cleanForAffectation(row['Nom groupe']),
      langueMajeure: this.excelParserService.cleanForAffectation(row['Langue Majeure ']),
      iniAlt: this.excelParserService.cleanForAffectation(row['INI/ALT']),
      entreprise: this.excelParserService.cleanForAffectation(row['Entreprise']),
      fonctionApprenti: this.excelParserService.cleanForAffectation(row["Fonction de l'apprenti"]),
      langue: this.excelParserService.cleanForAffectation(row['Langue Tutorat']),
      commentaireAffectation: this.excelParserService.cleanForAffectation(row['Commentaires affectation']),
      departementRattachement: this.excelParserService.cleanForAffectation(row['Département \nrattachement\n du tuteur']),
      // Force l'affectation à null
      tuteur: null,
    }));

    if (!etudiants.length) {
      this.logger.warn('⚠️ Aucun étudiant trouvé dans le fichier.');
      return;
    }

    await this.etudiantRepository.save(etudiants);
    this.logger.log(`✅ ${etudiants.length} étudiants insérés en base (tuteur=null).`);
  }
}
