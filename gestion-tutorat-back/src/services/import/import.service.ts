import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ExcelParserService } from './excel-parser/excel-parser.service';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';
import { Majeures } from 'src/modules/majeures/majeures';

@Injectable()
export class ImportService {
  constructor(
    private readonly excelParserService: ExcelParserService,
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
    @InjectRepository(Majeures)
    private readonly majeuresRepository: Repository<Majeures>,
  ) {}

  async processParTutorat(file: Express.Multer.File) {
    const data = this.excelParserService.parseExcel(file.path);
    await this.clearTuteurs();
    await this.insertTuteurs(data);
  }

  async processTutorats(file: Express.Multer.File) {
    const data = this.excelParserService.parseExcel(file.path);
    await this.clearEtudiants();
    await this.insertEtudiants(data);
  }

  async processMajors(file: Express.Multer.File) {
    // On lit un tableau 2D
    const data2D = this.excelParserService.parseExcelMajors(file.path);

    // On s'attend à 7 lignes minimum
    if (!Array.isArray(data2D) || data2D.length < 7) {
      throw new BadRequestException(
        "Le fichier des majeures n'a pas le format attendu (7 lignes).",
      );
    }

    // data2D[0] = ex: ["majeure/groupe", "CL_FE-Bachelor3", "CL_FE-Bachelor3_PLG", ...]
    // data2D[1] = ex: ["departement", "BACHELOR", "BACHELOR", ...]
    // data2D[2] = ex: ["responsable majeure", "MALET", "MALET", ...]
    // data2D[3] = ex: ["lanque enseignement", "Français", ...]
    // data2D[4] = ex: ["INI/ALT", "INI", "INI", "ALT", ...]
    // data2D[5] = ex: ["programme", "BACH 3", "BACH 3", ...]
    // data2D[6] = ex: ["code classe", "CL_FE-Bachelor3", "CL_FE-Bachelor3_PLG", ...]

    // On vide la table
    await this.clearMajors();

    const rowGroupe     = data2D[0];
    const rowDept       = data2D[1];
    const rowResponsible= data2D[2];
    const rowLangue     = data2D[3];
    const rowIniAlt     = data2D[4];
    const rowProgramme  = data2D[5];
    const rowCodeClasse = data2D[6];

    const majorsToSave: Majeures[] = [];

    // On suppose que rowGroupe.length = nombre total de colonnes
    // On ignore la colonne 0
    const nbCols = rowGroupe.length;
    for (let colIndex = 1; colIndex < nbCols; colIndex++) {
      const groupeVal      = rowGroupe[colIndex];      
      const deptVal        = rowDept[colIndex];        
      const responsibleVal = rowResponsible[colIndex]; 
      const langueVal      = rowLangue[colIndex];      
      const iniAltVal      = rowIniAlt[colIndex];      
      const progVal        = rowProgramme[colIndex];   
      const codeVal        = rowCodeClasse[colIndex];  

      // Normalisation (optionnel)
      const groupeClean = this.excelParserService.normalizeValue(groupeVal);
      const deptClean   = this.excelParserService.normalizeValue(deptVal);
      const respClean   = this.excelParserService.normalizeValue(responsibleVal);
      const langClean   = this.excelParserService.normalizeValue(langueVal);
      const iniAltClean = this.excelParserService.normalizeValue(iniAltVal);
      const progClean   = this.excelParserService.normalizeValue(progVal);
      const codeClean   = this.excelParserService.normalizeValue(codeVal);

      const maj = new Majeures();
      // On stocke le "groupe" = la 1ère ligne
      maj.groupe      = groupeClean;  // => "CL_FE-Bachelor3", etc.
      maj.dept        = deptClean;
      maj.responsible = respClean;
      maj.langue      = langClean;
      maj.iniAlt      = iniAltClean;
      maj.programme   = progClean;
      maj.code        = codeClean;

      majorsToSave.push(maj);
    }

    if (majorsToSave.length === 0) {
      console.warn('⚠️ Aucune majeure trouvée (0 colonnes) dans le fichier Excel.');
      return;
    }

    // Sauvegarde
    await this.majeuresRepository.save(majorsToSave);
    console.log(`✅ ${majorsToSave.length} majeures insérées en base.`);
  }

  private async clearMajors() {
    await this.majeuresRepository.query(`DELETE FROM majeures;`);
    await this.majeuresRepository.query(`ALTER TABLE majeures AUTO_INCREMENT = 1;`);
  }

  private async clearTuteurs() {
    await this.etudiantRepository.query(`UPDATE etudiant SET tuteurId = NULL;`);
    await this.etudiantRepository.query(`DELETE FROM etudiant;`);
    await this.tuteurRepository.query(`DELETE FROM tuteur;`);
    await this.tuteurRepository.query(`ALTER TABLE tuteur AUTO_INCREMENT = 1;`);
    await this.etudiantRepository.query(`ALTER TABLE etudiant AUTO_INCREMENT = 1;`);
  }

  private async clearEtudiants() {
    await this.etudiantRepository.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await this.etudiantRepository.query(`DELETE FROM etudiant;`);
    await this.etudiantRepository.query(`ALTER TABLE etudiant AUTO_INCREMENT = 1;`);
    await this.etudiantRepository.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }

  private async insertTuteurs(data: any[]) {
    const tuteurs = data.map(row => ({
      nom: this.excelParserService.normalizeValue(row['NOM TUTEUR']),
      prenom: this.excelParserService.normalizeValue(row['PRENOM TUTEUR']),
      email: this.excelParserService.normalizeValue(row['adresse e-mail']),
      departement: this.excelParserService.normalizeValue(row['DPT TUTEUR']),
      estEligiblePourTutorat: row['Peut faire des tutorats ?']?.trim().toLowerCase() === 'oui',
      statut: this.excelParserService.normalizeValue(row['Statut PERM/VAC']),
      colonne2: this.excelParserService.normalizeValue(row['Colonne2']),
      infoStatut: this.excelParserService.normalizeValue(row['Info Statut']),
      langueTutorat: this.excelParserService.parseList(row['Langue Tutorat']),
      profil: this.excelParserService.normalizeValue(row['Profil']),
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
      domainesExpertise: this.excelParserService.parseList(row['DOMAINES d\'expertise']),
    }));

    if (tuteurs.length === 0) {
      console.warn('⚠️ Aucun tuteur valide trouvé dans le fichier.');
      return;
    }

    await this.tuteurRepository.save(tuteurs);
  }

  private async insertEtudiants(data: any[]) {
    const etudiants = await Promise.all(
      data.map(async row => {
        const nomTuteur = this.excelParserService.normalizeValue(row['Nom Tuteur']);

        console.log(`🔍 Recherche du tuteur: Nom="${nomTuteur}"`);

        const tuteur = await this.tuteurRepository.findOne({
          where: [
            { email: row['e-mail Tuteur'] },
            { nom: ILike(`%${this.excelParserService.normalizeValue(row['Nom Tuteur'])}%`) }
          ],
        });

        if (!tuteur) {
          console.warn(`⚠️ Aucun tuteur trouvé pour: Nom="${nomTuteur}"`);
        } else {
          console.log(`✅ Tuteur trouvé: Nom="${nomTuteur}" -> ID: ${tuteur.id}`);
        }

        return {
          emailEcole: this.excelParserService.normalizeValue(row['Adresse Mail Ecole']),
          origine: this.excelParserService.normalizeValue(row['Origine']),
          ecole: this.excelParserService.normalizeValue(row['Ecole']),
          prenom: this.excelParserService.normalizeValue(row['Prenom Etudiant']),
          nom: this.excelParserService.normalizeValue(row['Nom Etudiant']),
          obligationInternational: this.excelParserService.normalizeValue(row['Obligation à l\'International']),
          stage1A: this.excelParserService.normalizeValue(row['Stage 1A']),
          codeClasse: this.excelParserService.normalizeValue(row['Code Classe']),
          nomGroupe: this.excelParserService.normalizeValue(row['Nom groupe']),
          langueMajeure: this.excelParserService.normalizeValue(row['Langue Majeure ']),
          iniAlt: this.excelParserService.normalizeValue(row['INI/ALT']),
          entreprise: this.excelParserService.normalizeValue(row['Entreprise']),
          fonctionApprenti: this.excelParserService.normalizeValue(row['Fonction de l\'apprenti']),
          langue: this.excelParserService.normalizeValue(row['Langue Tutorat']),
          commentaireAffectation: this.excelParserService.normalizeValue(row['Commentaires affectation']),
          departementRattachement: this.excelParserService.normalizeValue(row['Département \nrattachement\n du tuteur']),
          tuteur: tuteur || null,
        };
      })
    );

    if (etudiants.length === 0) {
      console.warn('⚠️ Aucun étudiant valide trouvé dans le fichier.');
      return;
    }

    await this.etudiantRepository.save(etudiants);
  }
}