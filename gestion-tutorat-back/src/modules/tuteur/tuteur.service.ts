import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTuteurDto } from './dto/create-tuteur.dto';
import { UpdateTuteurDto } from './dto/update-tuteur.dto';
import { Tuteur } from './tuteur.entity';

@Injectable()
export class TuteurService {
  constructor(
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
  ) {}

  // Create a new tuteur
  async create(createTuteurDto: CreateTuteurDto): Promise<Tuteur> {
    const newTuteur = this.tuteurRepository.create(createTuteurDto);
    return this.tuteurRepository.save(newTuteur);
  }

  // Get all tuteurs
  async findAll(): Promise<Tuteur[]> {
    return this.tuteurRepository.find();
  }

  // Get a single tuteur by ID
  async findOne(id: number): Promise<Tuteur> {
    const tuteur = await this.tuteurRepository.findOne({ where: { id } });
    if (!tuteur) {
      throw new NotFoundException(`Tuteur with ID ${id} not found`);
    }
    return tuteur;
  }

  // Update a tuteur by ID
  async update(id: number, updateTuteurDto: UpdateTuteurDto): Promise<Tuteur> {
    const tuteur = await this.findOne(id); // Ensure the tuteur exists
    if (!tuteur) {
      throw new NotFoundException(`Tuteur with ID ${id} not found`);
    }
    Object.assign(tuteur, updateTuteurDto); // Update fields
    return this.tuteurRepository.save(tuteur);
  }

  // Delete a tuteur by ID
  async remove(id: number): Promise<void> {
    const tuteur = await this.findOne(id); // Ensure the tuteur exists
    await this.tuteurRepository.remove(tuteur);
  }
}
