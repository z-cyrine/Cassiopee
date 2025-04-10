import { IsEmail, IsString, IsBoolean, IsOptional, IsInt, Min, IsArray, IsNotEmpty } from 'class-validator';

export class CreateTuteurDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  departement: string;

  @IsBoolean()
  @IsOptional()
  estEligiblePourTutorat?: boolean;

  @IsString()
  @IsNotEmpty()
  statut: string;

  @IsString()
  @IsOptional()
  colonne2?: string;

  @IsString()
  @IsOptional()
  infoStatut?: string;

  @IsArray()
  @IsOptional()
  langueTutorat?: string[];

  @IsString()
  @IsNotEmpty()
  profil: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  parTutoratAlt?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  tutoratAltAff?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  soldeAlt?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  parTutoratIni?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  tutoratIniAff?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  soldeIni?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalEtudiantsPar?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  nbTutoratAffecte?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  soldeTutoratRestant?: number;

  @IsArray()
  @IsOptional()
  matieres?: string[];

  @IsArray()
  @IsOptional()
  domainesExpertise?: string[];
}
