import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
  } from 'typeorm';
  import { IsEmail, IsString, IsBoolean, IsOptional, IsInt, Min, Max, IsArray } from 'class-validator';
import { Etudiant } from '../etudiant/etudiant.entity';
  
  @Entity()
  export class Tuteur {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    @IsString()
    nom: string; // Nom du tuteur
  
    @Column()
    @IsString()
    prenom: string; // Prénom du tuteur
  
    @Column({ unique: true })
    @IsEmail()
    email: string; // Adresse email unique du tuteur
  
    @Column()
    @IsString()
    departement: string; // Département du tuteur (ex. : Informatique)
  
    @Column({ default: true })
    @IsBoolean()
    estEligiblePourTutorat: boolean; // Le tuteur est-il éligible pour les tutorats ?
  
    @Column()
    @IsString()
    statut: string; // Statut du tuteur : PERM ou VAC

    @Column()
    @IsOptional()
    @IsString()
    colonne2: string; // Statut du tuteur : PERM ou VAC

    @Column()
    @IsString()
    infoStatut: string; // Info du Statut du tuteur 

    @Column({ type: 'json', nullable: true })
    @IsArray()
    langueTutorat: string[]; // Langues disponibles (ex. : "FR" ou "ANG")
  
    @Column()
    @IsString()
    profil: string; // Profil du tuteur  A, B, C, ...

    @Column({ type: 'int' })
    @IsInt()
    @Min(0)
    parTutoratAlt: number; // Nombre de tutorats ALT disponibles (entier >= 0)
  
    @Column({ type: 'int' })
    @IsInt()
    @Min(0)
    parEquivalentIni: number; // Par equivalent Ini (1ALT = 2INI) (entier >= 0)
  
    @Column({ type: 'int', nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    tutoratAltAff: number; // Nombre de tutorats ALT affectés (entier >= 0)
  
    @Column({ type: 'int', nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    parTutoratIni: number; // Nombre de tutorats INI disponibles (entier >= 0)
  
    @Column({ type: 'int', nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    tutoratIniAff: number; // Nombre de tutorats INI affectés (entier >= 0)
  
    @Column({ type: 'int', nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    totalTutoratAff: number; // Nombre total de tutorats affectés (entier >= 0)
  
    @Column({ type: 'int', nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    participationJury: number; // Nombre de participations à des jurys de soutenances Memoire, These (entier >= 0)
  
    @Column({ type: 'json', nullable: true })
    @IsOptional()
    @IsArray()
    matieres: string[]; // Liste des matières enseignées par le tuteur
  
    @Column({ type: 'int', nullable: true })
    @IsOptional()
    @IsInt()
    @Min(0)
    totalEtudiantsPar: number; // Nombre total d'étudiants dans le PAR (entier >= 0)
  
    @Column({ type: 'int', nullable: true })
    @IsOptional()
    @IsInt()
    ecartAff: number; // Écart avec l'affectation idéale (entier positif ou négatif)
  
    @Column({ type: 'json', nullable: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    domaines: string[]; // Domaines d'enseignement de l'enseignant EC (ex : ["Informatique", "Mathématiques"])

    @Column({ nullable: true })
    @IsOptional()
    @IsString()
    telephone: string; // Numéro de téléphone du tuteur (ex : "+33 6 12 34 56 78")
    
    @OneToMany(() => Etudiant, (etudiant) => etudiant.tuteur)
    etudiants: Etudiant[]; // Liste des étudiants associés au tuteur
  }
  