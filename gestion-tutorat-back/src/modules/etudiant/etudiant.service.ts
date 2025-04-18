import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etudiant } from './etudiant.entity';
import { CreateEtudiantDto } from './dto/create-etudiant.dto';
import { UpdateEtudiantDto } from './dto/update-etudiant.dto';

@Injectable()
export class EtudiantService {
  constructor(
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
  ) {}

  async create(createEtudiantDto: CreateEtudiantDto): Promise<Etudiant> {

    const etudiant = this.etudiantRepository.create(createEtudiantDto);
    return await this.etudiantRepository.save(etudiant);
  }


  async findAll(): Promise<Etudiant[]> {
    return await this.etudiantRepository.find({
      relations: ['tuteur'],
    });
  }

 
  async findOne(id: number): Promise<Etudiant> {
    const etudiant = await this.etudiantRepository.findOne({
      where: { id },
      relations: ['tuteur'],
    });
    if (!etudiant) {
      throw new NotFoundException(`Etudiant with ID=${id} not found`);
    }
    return etudiant;
  }


  async update(id: number, updateEtudiantDto: UpdateEtudiantDto): Promise<Etudiant> {
    const etudiant = await this.findOne(id); 
    Object.assign(etudiant, updateEtudiantDto); 
    return this.etudiantRepository.save(etudiant);
  }

 
  async remove(id: number): Promise<void> {
    const etudiant = await this.findOne(id);
    await this.etudiantRepository.remove(etudiant);
  }
}
