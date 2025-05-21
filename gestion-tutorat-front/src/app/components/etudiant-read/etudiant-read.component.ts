import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/gestion-acces/auth-service.service';

@Component({
  selector: 'app-etudiant-read',
  templateUrl: './etudiant-read.component.html',
  styleUrls: ['./etudiant-read.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class EtudiantReadComponent implements OnInit {
  etudiant: any;
  etudiantId: number | null = null;
  modeLectureSeul = false;
  role: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.modeLectureSeul = false;
    const idParam = this.route.snapshot.paramMap.get('id');
    this.etudiantId = idParam ? parseInt(idParam, 10) : null;
    if (this.etudiantId !== null) {
      this.http.get(`${environment.apiUrl}/etudiant/${this.etudiantId}`)
        .subscribe({
          next: data => {
            this.etudiant = data;
          },
          error: err => {
            console.error("Erreur lors de la récupération de l'étudiant", err);
          }
        });
    }

    this.authService.authStatus$.subscribe(() => {
      this.role = this.authService.getUserRole();
      this.modeLectureSeul = this.role !== 'admin';
    });

    this.authService.updateAuthStatus();

  }

  onEditEtudiant(): void {
    if (this.etudiantId !== null) {
      // Navigue vers la page d'édition – assurez-vous que votre route est définie correctement
      this.router.navigate(['/etudiant-edit', this.etudiantId]);
    }
  }

  onDeleteEtudiant(): void {
    if (this.etudiantId !== null && confirm("Confirmez-vous la suppression de cet étudiant ?")) {
      this.http.delete(`${environment.apiUrl}/etudiant/${this.etudiantId}`)
        .subscribe({
          next: () => {
            alert("Étudiant supprimé avec succès.");
            this.router.navigate(['/etudiants/all']);
          },
          error: err => {
            console.error("Erreur lors de la suppression de l'étudiant", err);
            alert("Une erreur s'est produite lors de la suppression.");
          }
        });
    }
  }

  goToList(): void {
    if (this.role == 'prof') {
      this.router.navigate(['/tuteur-dashboard']);
    }
    else{
    this.router.navigate(['/etudiants/all']);
  }}
}
