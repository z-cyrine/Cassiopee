import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsEmail, IsString, IsOptional } from 'class-validator';
import { Tuteur } from '../tuteur/tuteur.entity';

@Entity()
export class Etudiant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  emailEcole: string;

  @Column()
  @IsString()
  origine: string;

  @Column()
  @IsString()
  ecole: string;

  @Column()
  @IsString()
  prenom: string;

  @Column()
  @IsString()
  nom: string;

  @Column()
  @IsString()
  obligationInternational: string;

  @Column()
  @IsString()
  stage1A: string;

  @Column()
  @IsString()
  codeClasse: string;

  @Column()
  @IsString()
  nomGroupe: string;

  @Column()
  @IsString()
  langueMajeure: string;

  @Column()
  @IsString()
  iniAlt: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  entreprise: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  fonctionApprenti: string;
  
  @Column({ nullable: true })
  @IsString()
  langue: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  commentaireAffectation: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  departementRattachement: string;

  @ManyToOne(() => Tuteur, (tuteur) => tuteur.etudiants, { nullable: true, onDelete: 'CASCADE' })
  tuteur: Tuteur;
}
