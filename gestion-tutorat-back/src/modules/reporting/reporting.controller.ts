import { Controller, Get, Query } from '@nestjs/common';
import { ReportingService } from './reporting.service';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('/dynamic')
  async getDynamicReporting(@Query() filters: any) {
    return await this.reportingService.getDynamicReporting(filters);
  }
}
