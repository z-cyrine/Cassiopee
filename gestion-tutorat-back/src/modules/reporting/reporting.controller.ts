import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportingService } from './reporting.service';
import { RolesGuard } from '../auth/jwt/guards/roles.guard';
import { AuthGuard } from '../auth/jwt/guards/auth.guard';
import { Roles } from '../auth/jwt/decorator/roles.decorator';

@Controller('reporting')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'consultation')
  @Get('/dynamic')
  async getDynamicReporting(@Query() filters: any) {
    return await this.reportingService.getDynamicReporting(filters);
  }
}
