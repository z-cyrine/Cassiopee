import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto';
import { Etudiant } from './etudiant.entity';

@Injectable()
export class EtudiantService {
  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  // Create a new Etudiant
  async create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant> {
    const newEtudiant = this.etudiantRepository.create(createEtudiantDto);
    return this.etudiantRepository.save(newEtudiant);
  }

  // Get all Etudiants
  async findAll(): Promise<Etudiant[]> {
    return this.etudiantRepository.find();
  }

  // Get a single Etudiant by ID
  async findOne(id: number): Promise<Etudiant> {
    const etudiant = await this.etudiantRepository.findOne({ where: { id } });
    if (!etudiant) {
      throw new Error(`Etudiant with ID ${id} not found`);
    }
    return etudiant;
  }

  // Update an Etudiant by ID
  async update(
    id: number,
    updateEtudiantDto: UpdateEtudiantDto,
  ): Promise<Etudiant> {
    const etudiant = await this.findOne(id); // Ensure the Etudiant exists
    if (!etudiant) {
      throw new NotFoundException(`Etudiant with ID ${id} not found`);
    }
    Object.assign(etudiant, updateEtudiantDto);
    return this.etudiantRepository.save(etudiant);
  }

  // Delete an Etudiant by ID
  async remove(id: number): Promise<void> {
    const etudiant = await this.findOne(id); // Ensure the Etudiant exists
    await this.etudiantRepository.remove(etudiant);
  }
}
