import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Majeures } from './majeures';

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
}
