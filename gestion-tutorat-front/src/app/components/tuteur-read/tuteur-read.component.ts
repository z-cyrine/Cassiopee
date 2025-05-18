import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

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
  modeLectureSeul = false; // Mettre à true si on veut cacher les boutons (par ex. pour un tuteur connecté)


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
