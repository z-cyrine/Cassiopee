import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';
import { Etudiant } from '../etudiant/etudiant.entity';

@Entity()
export class Tuteur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  nom?: string; // Nom du tuteur

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  prenom?: string; // Prénom du tuteur

  @Column({ unique: true, nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string; // Adresse email du tuteur

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  departement?: string; // Département du tuteur

  @Column({ default: true, nullable: true })
  @IsOptional()
  @IsBoolean()
  estEligiblePourTutorat?: boolean; // Le tuteur est-il éligible pour les tutorats ?

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  statut?: string; // Statut du tuteur

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  colonne2?: string; // Colonne supplémentaire

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  infoStatut?: string; // Info du Statut du tuteur

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  langueTutorat?: string[]; // Langues disponibles pour le tutorat

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  profil?: string; // Profil du tuteur

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  parTutoratAlt?: number; // Nombre de tutorats ALT disponibles

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  parEquivalentIni?: number; // Nombre équivalent INI disponibles

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  tutoratAltAff?: number; // Nombre de tutorats ALT affectés

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  parTutoratIni?: number; // Nombre de tutorats INI disponibles

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  tutoratIniAff?: number; // Nombre de tutorats INI affectés

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalTutoratAff?: number; // Nombre total de tutorats affectés

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  participationJury?: number; // Nombre de participations à des jurys

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  matieres?: string[]; // Matières enseignées par le tuteur

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  totalEtudiantsPar?: number; // Nombre total d'étudiants dans le PAR

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  ecartAff?: number; // Écart avec l'affectation idéale

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  domaines?: string[]; // Domaines d'enseignement

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  telephone?: string; // Numéro de téléphone

  @OneToMany(() => Etudiant, (etudiant) => etudiant.tuteur, { nullable: true })
  etudiants?: Etudiant[]; // Liste des étudiants associés
}
