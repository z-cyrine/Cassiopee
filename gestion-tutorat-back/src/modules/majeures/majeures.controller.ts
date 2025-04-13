import { Controller, Get } from '@nestjs/common';
import { MajorsService } from './majeures.service';


@Controller('majeures')
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  // GET /majeures/distinct
  @Get('distinct')
  getDistinctMajors() {
    return this.majorsService.getDistinctMajors();
  }

  // GET /majeures/departments
  @Get('departments')
  getDistinctDepartments() {
    return this.majorsService.getDistinctDepartments();
  }
}
