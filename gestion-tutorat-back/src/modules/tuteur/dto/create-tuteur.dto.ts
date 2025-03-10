import { IsString, IsEmail, IsBoolean, IsOptional, IsInt, Min, IsArray } from 'class-validator';

export class CreateTuteurDto {
  @IsOptional()
  @IsString()
  prenom?: string; // Prénom du tuteur

  @IsOptional()
  @IsString()
  nom?: string; // Nom du tuteur

  @IsOptional()
  @IsEmail()
  email?: string; // Adresse email du tuteur

  @IsOptional()
  @IsString()
  departement?: string; // Département du tuteur (ex : "Informatique")

  @IsOptional()
  @IsBoolean()
  estEligiblePourTutorat?: boolean; // Le tuteur est-il éligible pour les tutorats ?

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  langueTutorat?: string[]; // Langues disponibles pour le tutorat

  @IsOptional()
  @IsInt()
  @Min(0)
  parTutoratAlt?: number; // Nombre de tutorats ALT disponibles (facultatif)

  @IsOptional()
  @IsInt()
  @Min(0)
  parEquivalentIni?: number; // Nombre équivalent INI disponibles (facultatif)

  @IsOptional()
  @IsInt()
  @Min(0)
  tutoratAltAff?: number; // Nombre de tutorats ALT affectés (facultatif)

  @IsOptional()
  @IsInt()
  @Min(0)
  parTutoratIni?: number; // Nombre de tutorats INI disponibles (facultatif)

  @IsOptional()
  @IsInt()
  @Min(0)
  tutoratIniAff?: number; // Nombre de tutorats INI affectés (facultatif)

  @IsOptional()
  @IsInt()
  @Min(0)
  totalTutoratAff?: number; // Nombre total de tutorats affectés (facultatif)

  @IsOptional()
  @IsInt()
  @Min(0)
  participationJury?: number; // Nombre de participations à des jurys (facultatif)

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  matieres?: string[]; // Matières enseignées par le tuteur (facultatif)

  @IsOptional()
  @IsInt()
  @Min(0)
  totalEtudiantsPar?: number; // Nombre total d'étudiants dans le PAR (facultatif)

  @IsOptional()
  @IsInt()
  ecartAff?: number; // Écart avec l'affectation idéale (facultatif)

  @IsOptional()
  @IsString()
  telephone?: string; // Numéro de téléphone du tuteur (facultatif)
}
