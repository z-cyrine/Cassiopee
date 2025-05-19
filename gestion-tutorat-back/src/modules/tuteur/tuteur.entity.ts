import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail, IsString, IsBoolean, IsOptional, IsInt, Min, IsArray } from 'class-validator';
import { Etudiant } from '../etudiant/etudiant.entity';

@Entity()
export class Tuteur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  nom: string;

  @Column()
  @IsString()
  prenom: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  departement: string;

  @Column({ default: true })
  @IsBoolean()
  estEligiblePourTutorat: boolean;

  @Column()
  @IsString()
  statut: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  colonne2: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  infoStatut: string;

  @Column({ type: 'json', nullable: true })
  @IsArray()
  langueTutorat: string[];

  @Column()
  @IsString()
  profil: string;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  parTutoratAlt: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  tutoratAltAff: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  soldeAlt: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  parTutoratIni: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  tutoratIniAff: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  soldeIni: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  totalEtudiantsPar: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  nbTutoratAffecte: number;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  @Min(0)
  soldeTutoratRestant: number;

  @Column({ type: 'json', nullable: true })
  @IsArray()
  matieres: string[];

  @Column({ type: 'json', nullable: true })
  @IsArray()
  domainesExpertise: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Etudiant, (etudiant) => etudiant.tuteur)
  etudiants: Etudiant[];
}