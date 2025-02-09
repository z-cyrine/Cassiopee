import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Tuteur } from '../tuteur/tuteur.entity';
import { Etudiant } from '../etudiant/etudiant.entity';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async processParTutorat(file: Express.Multer.File) {
    const data = this.parseExcel(file.path);
    await this.clearTuteurs();
    await this.insertTuteurs(data);
  }

  async processTutorats(file: Express.Multer.File) {
    const data = this.parseExcel(file.path);
    await this.clearEtudiants();
    await this.insertEtudiants(data);
  }

  private parseExcel(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  private async clearTuteurs() {
    await this.tuteurRepository.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await this.tuteurRepository.query(`TRUNCATE TABLE tuteur;`);
    await this.tuteurRepository.query(`ALTER TABLE tuteur AUTO_INCREMENT = 1;`);
    await this.tuteurRepository.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }
  
  private async clearEtudiants() {
    await this.etudiantRepository.query(`SET FOREIGN_KEY_CHECKS = 0;`);
    await this.etudiantRepository.query(`TRUNCATE TABLE etudiant;`);
    await this.etudiantRepository.query(`ALTER TABLE etudiant AUTO_INCREMENT = 1;`);
    await this.etudiantRepository.query(`SET FOREIGN_KEY_CHECKS = 1;`);
  }

  private async insertTuteurs(data: any[]) {
    const tuteurs = data.map(row => ({
      nom: row['NOM TUTEUR'],
      prenom: row['PRENOM TUTEUR'],
      email: row['adresse e-mail'],
      departement: row['DPT TUTEUR'],
      estEligiblePourTutorat: row['Peut faire des tutorats ?'] === 'Oui',
      statut: row['Statut PERM/VAC'],
      colonne2: row['Colonne2'] || null,
      infoStatut: row['Info Statut'] || null,
      langueTutorat: row['Langue Tutorat'] ? row['Langue Tutorat'].split(',') : [],
      profil: row['Profil'],
      parTutoratAlt: this.toNumber(row['#PAR Tutorat ALT']),
      tutoratAltAff: this.toNumber(row['Tutorat ALT - Affecté']),
      soldeAlt: this.toNumber(row['SOLDE ALT']),
      parTutoratIni: this.toNumber(row['# PAR  Tutorat INI']),
      tutoratIniAff: this.toNumber(row['Tutorat INI - Affecté']),
      soldeIni: this.toNumber(row['SOLDE INI']),
      totalEtudiantsPar: this.toNumber(row['Tot étudiants du par']),
      nbTutoratAffecte: this.toNumber(row['NB TUTORAT ALT+INI AFFECTE']),
      soldeTutoratRestant: this.toNumber(row['Solde nombre tutorat restant à affecter ALT+INI']),
      matieres: row['DONNE DES COURS DANS LA/LES MAJEURES '] ? row['DONNE DES COURS DANS LA/LES MAJEURES '].split(',') : [],
      domainesExpertise: row['DOMAINES d\'expertise'] ? row['DOMAINES d\'expertise'].split(',') : [],
    }));
    await this.tuteurRepository.save(tuteurs);
  }

  private async insertEtudiants(data: any[]) {
    const etudiants = await Promise.all(
      data.map(async row => {
        const tuteur = await this.tuteurRepository.findOne({
          where: {
            nom: row['Nom Tuteur'],
            prenom: row['Prénom Tuteur'],
            email: row['e-mail Tuteur'],
          },
        });

        console.log('Département:', row['Département rattachement du tuteur']);
        console.log('Colonnes détectées dans Excel:', Object.keys(row));


        return {
          emailEcole: row['Adresse Mail Ecole'],
          origine: row['Origine'],
          ecole: row['Ecole'],
          prenom: row['Prenom Etudiant'],
          nom: row['Nom Etudiant'],
          obligationInternational: row['Obligation à l\'International'],
          stage1A: row['Stage 1A'],
          codeClasse: row['Code Classe'],
          nomGroupe: row['Nom groupe'],
          langueMajeure: row['Langue Majeure '],
          iniAlt: row['INI/ALT'],
          entreprise: row['Entreprise'] || null,
          fonctionApprenti: row['Fonction de l\'apprenti'] || null,
          langue: row['Langue Tutorat'],
          commentaireAffectation: row['Commentaires affectation'] || null,
          departementRattachement: row['Département \nrattachement\n du tuteur']?.trim(), 
          tuteur: tuteur || null,
        };
      })
    );
    await this.etudiantRepository.save(etudiants);
  }

  private toNumber(value: any): number {
    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}
