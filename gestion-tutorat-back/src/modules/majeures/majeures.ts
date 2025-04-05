import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsString, IsOptional } from 'class-validator';
import { Etudiant } from '../etudiant/etudiant.entity';

@Entity()
export class Majeures {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  groupe: string;

  @Column()
  @IsString()
  code: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  dept: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  responsible: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  langue: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  iniAlt: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  programme: string;

  @OneToMany(() => Etudiant, (etudiant) => etudiant.majeure)
  etudiants: Etudiant[];
}
