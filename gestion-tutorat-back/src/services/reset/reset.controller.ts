import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { ResetService } from './reset.service';

class ResetDatabaseDto {
  @ApiProperty({
    description: 'Mot de passe administrateur pour confirmer la réinitialisation',
  })
  adminPassword: string;
}

@ApiTags('Administration')
@Controller('admin')
export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  @Post('reset-database')
  @ApiOperation({ summary: 'Réinitialiser la base de données' })
  @ApiResponse({ status: 200, description: 'Base de données réinitialisée avec succès' })
  @ApiResponse({ status: 401, description: 'Mot de passe administrateur incorrect' })
  @ApiBearerAuth()
  async resetDatabase(@Body() resetDto: ResetDatabaseDto): Promise<{ message: string }> {
    try {
      await this.resetService.resetDatabase(resetDto.adminPassword);
      return { message: 'Base de données réinitialisée avec succès' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new Error('Erreur lors de la réinitialisation de la base de données');
    }
  }
} 