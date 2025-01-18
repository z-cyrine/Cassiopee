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

  async processFiles(files: { parTutorat: Express.Multer.File; tutorats: Express.Multer.File }) {
    const parTutoratData = this.parseExcel(files.parTutorat.path);
    const tutoratsData = this.parseExcel(files.tutorats.path);

    await this.processParTutorat(parTutoratData);
    await this.processTutorats(tutoratsData);
  }

  private parseExcel(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  }

  private async processParTutorat(data: any[]) {
    const tuteurs = await Promise.all(
      data.map(async (row) => {
        const email = row['adresse e-mail'];
        if (!email) {
          console.warn(`Email vide détecté pour le tuteur : ${row['NOM TUTEUR']} ${row['PRENOM TUTEUR']}`);
          return null;
        }

        const existingTuteur = await this.tuteurRepository.findOne({ where: { email } });
        if (existingTuteur) {
          console.warn(`Duplication détectée : ${email}. Ce tuteur sera ignoré.`);
          return null;
        }

        return {
          nom: row['NOM TUTEUR'],
          prenom: row['PRENOM TUTEUR'],
          email,
          departement: row['DPT TUTEUR'],
          estEligiblePourTutorat: row['Peut faire des tutorats ?'] === 'Oui',
          statut: row['Statut PERM/VAC'],
          colonne2: row['Colonne2'],
          infoStatut: row['Info Statut'],
          langueTutorat: row['Langue Tutorat']?.split(','),
          profil: row['Profil'],
          parTutoratAlt: this.validateNumber(row['#PAR Tutorat ALT']),
          parEquivalentIni: this.validateNumber(row['PAR équivalent INI']),
          tutoratAltAff: this.validateNumber(row['Tutorat ALT - Affecté']),
          parTutoratIni: this.validateNumber(row['# PAR  Tutorat INI']),
          tutoratIniAff: this.validateNumber(row['Tutorat INI - Affecté']),
          totalTutoratAff: this.validateNumber(row['NB TUTORAT ALT+INI AFFECTE']),
          participationJury: this.validateNumber(row['# PARTICIPATIONS A DES JURYS DE SOUTENANCE MÉMOIRE/THESE  EN NB DE SOUTENANCES']),
          matieres: row['DONNE DES COURS DANS LA/LES MAJEURES']?.split(','),
          totalEtudiantsPar: this.validateNumber(row['Tot étudiants du par']),
          ecartAff: this.validateNumber(row['Ecart avec affectation']),
          domaines: row['DOMAINES ET/OU MATIERES D\'ENSEIGNEMENT DE L\'EC']?.split(','),
          telephone: row['Téléphone'],
        };
      }),
    );

    const filteredTuteurs = tuteurs.filter((tuteur) => tuteur !== null);
    await this.tuteurRepository.save(filteredTuteurs);
  }

  private async processTutorats(data: any[]) {
    const parsedData = [];

    for (const row of data) {
      const tuteur = await this.tuteurRepository.findOne({
        where: {
          nom: row['Nom Tuteur'],
          prenom: row['Prenom Tuteur'],
          email: row['e-mail Tuteur'],
        },
      });

      if (!tuteur) {
        console.warn(`Tuteur non trouvé pour l'étudiant : ${row['Prenom Etudiant']} ${row['Nom Etudiant']}`);
      }

      parsedData.push({
        emailEcole: row['Adresse Mail Ecole'],
        origine: row['Origine'],
        ecole: row['Ecole'],
        prenom: row['Prenom Etudiant'],
        nom: row['Nom Etudiant'],
        langueTutorat: row['Langue Tutorat'],
        iniAlt: row['INI/ALT'],
        commentaireAffectation: row['Commentaires affectation'],
        soutenanceDate: row['SOUTENANCE DATE'],
        soutenanceHoraire: row['SOUTENANCE HORAIRE'],
        soutenanceSalle: row['SOUTENANCE SALLE'],
        membreJury1: row['MEMBRE JURY 1'],
        membreJury2: row['MEMBRE JURY 2'],
        tuteur: tuteur || null,
      });
    }

    await this.etudiantRepository.save(parsedData);
  }

  private validateNumber(value: any): number {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      console.warn(`Invalid number: "${value}", defaulting to 0`);
      return 0;
    }
    return parsed;
  }
}
