import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuteur } from 'src/modules/tuteur/tuteur.entity';
import { Etudiant } from 'src/modules/etudiant/etudiant.entity';

@Injectable()
export class AffectationManuelleService {
  constructor(
    @InjectRepository(Etudiant)
    private etudiantRepository: Repository<Etudiant>,

    @InjectRepository(Tuteur)
    private tuteurRepository: Repository<Tuteur>,
  ) {}

  async affecterEtudiant(etudiantId: number, tuteurId: number): Promise<{ success: boolean; message: string; etudiant?: Etudiant; tuteur?: Tuteur }>
  {
    const etudiant = await this.etudiantRepository.findOneBy({ id: etudiantId });
    const tuteur = await this.tuteurRepository.findOneBy({ id: tuteurId });

    if (!tuteur) {
        return {
            success: false,
            message: 'Tuteur non trouvé'
          };
    }
    if (!etudiant) {
        return {
            success: false,
            message: 'Étudiant non trouvé'
          };
    }
    
    if (etudiant.affecte == false) {
    if (tuteur.soldeTutoratRestant > 0) {
        // Affectation
        etudiant.tuteur = tuteur;    
        
        tuteur.soldeTutoratRestant -= 1;
        tuteur.nbTutoratAffecte += 1;

        etudiant.affecte = true;
        await this.tuteurRepository.save(tuteur);

        
        await this.etudiantRepository.save(etudiant);

        return {
            success: true,
            message: 'Étudiant affecté avec succès',
            etudiant: etudiant,
            tuteur: tuteur
          };
        
    }
    else {
        return {
            success: false,
            message: 'Le tuteur n\'a plus de solde de tutorat restant'
          };
    
    }
  }
  else {
    return {
            success: false,
            message: 'Étudiant déjà affecté'
          };
    }
  }
}