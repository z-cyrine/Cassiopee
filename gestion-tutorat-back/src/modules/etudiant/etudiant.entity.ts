import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Tuteur } from '../tuteur/tuteur.entity';

@Entity()
export class Etudiant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  prenom?: string; // Prénom de l'étudiant

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  nom?: string; // Nom de l'étudiant

  @Column({ unique: true, nullable: true })
  @IsOptional()
  @IsEmail()
  emailEcole?: string; // Adresse mail école de l'étudiant

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  origine?: string; // Origine (ex : "BACHELOR", "HEC/E", etc.)

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  ecole?: string; // École de l'étudiant

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  groupe?: string; // Nom du groupe

  @Column({ nullable: true })
  @IsOptional()
  @IsEnum(['ALT', 'INI'])
  iniAlt?: string; // Type (ex : "ALT" ou "INI")

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  entreprise?: string; // Entreprise de l'étudiant

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  commentaireAffectation?: string; // Commentaire sur l'affectation

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  langueTutorat?: string; // Langue utilisée pour le tutorat

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  soutenanceDate?: string; // Date de soutenance

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  soutenanceHoraire?: string; // Horaire de soutenance

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  soutenanceSalle?: string; // Salle de soutenance

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  membreJury1?: string; // Membre du jury 1

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  membreJury2?: string; // Membre du jury 2

  @ManyToOne(() => Tuteur, (tuteur) => tuteur.etudiants, { nullable: true })
  tuteur?: Tuteur; // Relation avec le tuteur
}
