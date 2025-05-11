import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuteur } from '../../modules/tuteur/tuteur.entity';
import { Etudiant } from '../../modules/etudiant/etudiant.entity';
import { Majeures } from '../../modules/majeures/majeures';

@Injectable()
export class ResetService {
  private readonly logger = new Logger(ResetService.name);

  constructor(
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
    @InjectRepository(Etudiant)
    private readonly etudiantRepository: Repository<Etudiant>,
    @InjectRepository(Majeures)
    private readonly majeuresRepository: Repository<Majeures>,
  ) {}

  /**
   * Réinitialise la base de données en supprimant toutes les données
   * @param adminPassword Mot de passe administrateur pour confirmation
   */
  async resetDatabase(adminPassword: string): Promise<void> {
    // Vérification du mot de passe administrateur
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      throw new UnauthorizedException('Mot de passe administrateur incorrect');
    }

    try {
      this.logger.log('Début de la réinitialisation de la base de données...');

      // Désactiver temporairement les contraintes de clés étrangères
      await this.etudiantRepository.query('SET FOREIGN_KEY_CHECKS = 0;');

      // Supprimer les données dans l'ordre pour éviter les problèmes de clés étrangères
      await this.etudiantRepository.query('DELETE FROM etudiant;');
      await this.tuteurRepository.query('DELETE FROM tuteur;');
      await this.majeuresRepository.query('DELETE FROM majeures;');

      // Réinitialiser les auto-increments
      await this.etudiantRepository.query('ALTER TABLE etudiant AUTO_INCREMENT = 1;');
      await this.tuteurRepository.query('ALTER TABLE tuteur AUTO_INCREMENT = 1;');
      await this.majeuresRepository.query('ALTER TABLE majeures AUTO_INCREMENT = 1;');

      // Réactiver les contraintes de clés étrangères
      await this.etudiantRepository.query('SET FOREIGN_KEY_CHECKS = 1;');

      this.logger.log('✅ Base de données réinitialisée avec succès');
    } catch (error) {
      this.logger.error(`Erreur lors de la réinitialisation: ${error.message}`);
      throw error;
    }
  }
} 