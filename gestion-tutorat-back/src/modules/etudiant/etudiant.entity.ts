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
    IsInt,
    Min,
  } from 'class-validator';
import { Tuteur } from '../tuteur/tuteur.entity';
  
  @Entity()
  export class Etudiant {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @IsString()
    prenom: string; // Prénom de l'étudiant
  
    @Column()
    @IsString()
    nom: string; // Nom de l'étudiant
  
    @Column({ unique: true })
    @IsEmail()
    emailEcole: string; // Adresse mail école de l'étudiant
  
    @Column()
    @IsString()
    origine: string; // Origine (ex : "BACHELOR", "HEC/E", etc.)
  
    @Column()
    @IsString()
    ecole: string; // École de l'étudiant (ex : "Institut Mines-Télécom Business School")
  
    @Column()
    @IsString()
    groupe: string; // Nom du groupe (ex : "ALT", "INI")
  
    @Column()
    @IsEnum(['ALT', 'INI'])
    iniAlt: string; // Type (ex : "ALT" ou "INI")
  
    @Column()
    @IsOptional()
    @IsString()
    entreprise: string; // Entreprise de l'étudiant

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    commentaireAffectation: string; // Commentaire sur l'affectation (nullable)

    @Column()
    @IsString()
    langueTutorat: string; // Langue utilisée pour le tutorat (ex : "FR", "ENG")

  
    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    soutenanceDate: string; // Date de soutenance (nullable)
  
    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    soutenanceHoraire: string; // Horaire de soutenance (nullable)
  
    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    soutenanceSalle: string; // Salle de soutenance (nullable)
  
    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    membreJury1: string; // Membre du jury 1 (nullable)
  
    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    membreJury2: string; // Membre du jury 2 (nullable)
  
    @ManyToOne(() => Tuteur, (tuteur) => tuteur.etudiants)
    tuteur: Tuteur; // Relation avec le tuteur
  }
  