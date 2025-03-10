import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateEtudiantDto {
  @IsOptional()
  @IsString()
  prenom?: string; // Prénom de l'étudiant

  @IsOptional()
  @IsString()
  nom?: string; // Nom de l'étudiant

  @IsOptional()
  @IsEmail()
  emailEcole?: string; // Adresse mail école de l'étudiant

  @IsOptional()
  @IsString()
  origine?: string; // Origine (ex : "BACHELOR", "HEC/E", etc.)

  @IsOptional()
  @IsString()
  ecole?: string; // École de l'étudiant

  @IsOptional()
  @IsString()
  groupe?: string; // Groupe de l'étudiant (ex : "ALT", "INI")

  @IsOptional()
  @IsEnum(['ALT', 'INI'])
  iniAlt?: string; // Type (ex : "ALT" ou "INI")

  @IsOptional()
  @IsString()
  entreprise?: string; // Entreprise de l'étudiant (facultatif)

  @IsOptional()
  @IsString()
  commentaireAffectation?: string; // Commentaire sur l'affectation (facultatif)

  @IsOptional()
  @IsString()
  langueTutorat?: string; // Langue utilisée pour le tutorat (ex : "FR", "ENG")

  @IsOptional()
  @IsString()
  soutenanceDate?: string; // Date de soutenance (facultatif)

  @IsOptional()
  @IsString()
  soutenanceHoraire?: string; // Horaire de soutenance (facultatif)

  @IsOptional()
  @IsString()
  soutenanceSalle?: string; // Salle de soutenance (facultatif)

  @IsOptional()
  @IsString()
  membreJury1?: string; // Membre du jury 1 (facultatif)

  @IsOptional()
  @IsString()
  membreJury2?: string; // Membre du jury 2 (facultatif)
}
