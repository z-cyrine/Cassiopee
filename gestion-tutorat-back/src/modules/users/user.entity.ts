import { IsNotEmpty, IsOptional } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  PROF = 'prof',
  CONSULTATION = 'consultation',
}


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ unique: true })
  email: string;

  @IsNotEmpty()
  @Column({ unique: true })
  name: string;

  @IsNotEmpty()
  @Column({ unique: true })
  username: string;

  @IsOptional()
  @Column()
  password: string;

  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CONSULTATION,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}
