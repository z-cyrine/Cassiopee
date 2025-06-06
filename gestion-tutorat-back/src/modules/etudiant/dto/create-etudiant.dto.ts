import {
    IsEmail,
    IsString,
    IsOptional,
    IsNumber,
    IsNotEmpty,
    IsBoolean,
  } from 'class-validator';
  
  export class CreateEtudiantDto {
    @IsEmail()
    @IsNotEmpty()
    emailEcole: string;
  
    @IsString()
    @IsNotEmpty()
    origine: string;
  
    @IsString()
    @IsNotEmpty()
    ecole: string;
  
    @IsString()
    @IsNotEmpty()
    prenom: string;
  
    @IsString()
    @IsNotEmpty()
    nom: string;
  
    @IsString()
    @IsNotEmpty()
    obligationInternational: string;
  
    @IsString()
    @IsNotEmpty()
    stage1A: string;
  
    @IsString()
    @IsNotEmpty()
    codeClasse: string;
  
    @IsString()
    @IsNotEmpty()
    nomGroupe: string;
  
    @IsString()
    @IsNotEmpty()
    langueMajeure: string;
  
    @IsString()
    @IsNotEmpty()
    iniAlt: string;
  
    @IsString()
    @IsOptional()
    entreprise?: string;
  
    @IsString()
    @IsOptional()
    fonctionApprenti?: string;
  
    @IsString()
    @IsOptional()
    langue?: string;
  
    @IsString()
    @IsOptional()
    commentaireAffectation?: string;
  
    @IsString()
    @IsOptional()
    departementRattachement?: string;
  
    @IsBoolean()
    @IsOptional()
    frozen?: boolean;
  
  }
  