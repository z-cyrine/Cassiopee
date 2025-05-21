import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { Tuteur } from '../tuteur/tuteur.entity';

@Injectable()
export class UserImportService {
  private readonly logger = new Logger(UserImportService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tuteur)
    private readonly tuteurRepository: Repository<Tuteur>,
  ) {}

  /**
   * Importe les tuteurs éligibles dans la table des utilisateurs
   * @returns Le nombre d'utilisateurs créés, ignorés et les erreurs
   */
  async importEligibleTutors(): Promise<{ created: number; skipped: number; errors: any[] }> {
    const stats = { created: 0, skipped: 0, errors: [] };

    try {
      // SUPPRIMER tous les users ayant le rôle 'prof' avant import
      await this.userRepository.delete({ role: UserRole.PROF });

      // Récupérer tous les tuteurs éligibles
      const tuteurs = await this.tuteurRepository.find({
        where: { estEligiblePourTutorat: true }
      });

      for (const tuteur of tuteurs) {
        try {
          // Vérifier si l'utilisateur existe déjà (par email)
          const existingUser = await this.userRepository.findOne({
            where: { email: tuteur.email }
          });

          if (existingUser) {
            stats.skipped++;
            continue;
          }

          // Créer le username (première lettre du prénom + nom)
          const username = (tuteur.prenom.charAt(0) + tuteur.nom).toLowerCase();

          // Créer le nouvel utilisateur
          const newUser = this.userRepository.create({
            email: tuteur.email,
            name: `${tuteur.prenom} ${tuteur.nom}`,
            username: username,
            role: UserRole.PROF,
          });

          await this.userRepository.save(newUser);
          stats.created++;
          this.logger.log(`✅ Utilisateur créé pour le tuteur ${tuteur.prenom} ${tuteur.nom}`);
        } catch (error) {
          stats.errors.push({
            tuteur: `${tuteur.prenom} ${tuteur.nom}`,
            error: error.message
          });
          this.logger.error(`❌ Erreur lors de l'import du tuteur ${tuteur.email}: ${error.message}`);
        }
      }

      return stats;
    } catch (error) {
      this.logger.error(`❌ Erreur dans importEligibleTutors: ${error.message}`);
      throw error;
    }
  }
} 