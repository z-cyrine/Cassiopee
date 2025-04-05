import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsOptional } from 'class-validator';

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
}
