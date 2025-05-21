import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/gestion-acces/auth-service.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { EtudiantService } from '../../services/etudiant/etudiant.service';
import { TuteurService } from '../../services/tuteur/tuteur.service';
import { MajorsService } from '../../services/majors/majors.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  role: string | null = null;
  casLoginUrl = `${environment.apiUrl}/cas/login`;

  totalEtudiants: number | null = null;
  totalTuteurs: number | null = null;
  totalMajors: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private etudiantService: EtudiantService,
    private tuteurService: TuteurService,
    private majorsService: MajorsService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.role = this.authService.getUserRole();

    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'unauthorized') {
        this.snackBar.open('⚠️ Utilisateur non autorisé.', 'Fermer', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['cas-snackbar-error'],
        });
      }
    });

    // Récupérer les totaux
    this.etudiantService.getAllStudents().subscribe(students => {
      this.totalEtudiants = students.length;
    });
    this.tuteurService.getTuteurs().subscribe(tuteurs => {
      this.totalTuteurs = tuteurs.filter(t => t.estEligiblePourTutorat).length;
    });
    this.majorsService.getAllMajors().subscribe(majors => {
      this.totalMajors = majors.length;
    });
  }

  hasRole(roles: string[]): boolean {
    return this.authService.hasRole(roles);
  }
}
