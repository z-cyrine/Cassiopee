import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Tuteur } from '../tuteur/tuteur.entity';
import { Etudiant } from '../etudiant/etudiant.entity';
import { ExcelParserService } from './excel-parser/excel-parser.service';

@Injectable()
export class ImportService {
  constructor(
    private readonly excelParserService: ExcelParserService,
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
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
