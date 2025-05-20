import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/gestion-acces/auth-service.service';

@Component({
  selector: 'app-tuteur-read',
  templateUrl: './tuteur-read.component.html',
  styleUrls: ['./tuteur-read.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TuteurReadComponent implements OnInit {
  tuteur: any;
  tuteurId: number | null = null;
  modeLectureSeul = false;
  role: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
      this.modeLectureSeul = true;

    const idParam = this.route.snapshot.paramMap.get('id');
    this.tuteurId = idParam ? parseInt(idParam, 10) : null;
    if (this.tuteurId !== null) {
      this.http.get(`${environment.apiUrl}/tuteur/${this.tuteurId}`)
        .subscribe({
          next: data => {
            this.tuteur = data;
          },
          error: err => {
            console.error('Erreur lors de la récupération du tuteur', err);
          }
        });
    }
    this.authService.authStatus$.subscribe(() => {
      this.role = this.authService.getUserRole();
      this.modeLectureSeul = this.role !== 'admin';
    });

    this.authService.updateAuthStatus();
  }

  onEditTuteur(): void {
    if (this.tuteurId !== null) {
      // Naviguer vers la page d'édition du tuteur (ajustez la route si nécessaire)
      this.router.navigate(['/tuteur-edit', this.tuteurId]);
    }
  }

  onDeleteTuteur(): void {
    if (this.tuteurId !== null && confirm("Confirmez-vous la suppression de ce tuteur ?")) {
      this.http.delete(`${environment.apiUrl}/tuteur/${this.tuteurId}`)
        .subscribe({
          next: () => {
            alert("Tuteur supprimé avec succès.");
            this.router.navigate(['/home']);
          },
          error: err => {
            console.error("Erreur lors de la suppression du tuteur", err);
            alert("Une erreur est survenue lors de la suppression.");
          }
        });
    }
  }
}
