import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Majeures } from './majeures';
import { CreateMajeureDto } from './dto/create-majeure.dto';
import { UpdateMajeureDto } from './dto/update-majeure.dto';
@Injectable()
export class MajorsService {
  constructor(
    @InjectRepository(Majeures)
    private readonly majorsRepository: Repository<Majeures>,
  ) {}

  // Returns distinct majors based on the 'code' field, along with the 'groupe'
  async getDistinctMajors(): Promise<{ code: string; groupe: string }[]> {
    const result = await this.majorsRepository
      .createQueryBuilder('majeure')
      .select('majeure.code', 'code')
      .addSelect('majeure.groupe', 'groupe')
      .distinct(true)
      .getRawMany();
    return result;
  }

  // Returns distinct department values from the 'dept' field (ignoring null values)
  async getDistinctDepartments(): Promise<string[]> {
    const result = await this.majorsRepository
      .createQueryBuilder('majeure')
      .select('majeure.dept', 'dept')
      .distinct(true)
      .where('majeure.dept IS NOT NULL')
      .getRawMany();
    return result.map(r => r.dept);
  }

    findAll(): Promise<Majeures[]> {
    return this.majorsRepository.find();
  }

  async findOne(id: number): Promise<Majeures> {
    const major = await this.majorsRepository.findOne({ where: { id } });
    if (!major) throw new NotFoundException(`Majeure ${id} introuvable`);
    return major;
  }

  create(dto: CreateMajeureDto): Promise<Majeures> {
    const entity = this.majorsRepository.create(dto);
    return this.majorsRepository.save(entity);
  }

  async update(id: number, dto: UpdateMajeureDto): Promise<Majeures> {
    const major = await this.findOne(id);
    Object.assign(major, dto);
    return this.majorsRepository.save(major);
  }

  async remove(id: number): Promise<void> {
    const major = await this.findOne(id);
    await this.majorsRepository.remove(major);
  }
}
