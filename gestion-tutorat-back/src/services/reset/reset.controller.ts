import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResetService } from './reset.service';

@ApiTags('Administration')
@Controller('admin')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  @Post('reset-database')
  @ApiOperation({ summary: 'Réinitialiser la base de données' })
  @ApiResponse({ status: 200, description: 'Base de données réinitialisée avec succès' })
  async resetDatabase(): Promise<{ message: string }> {
    try {
      await this.resetService.resetDatabase();
      return { message: 'Base de données réinitialisée avec succès' };
    } catch (error) {
      throw new Error('Erreur lors de la réinitialisation de la base de données');
    }
  }
} 