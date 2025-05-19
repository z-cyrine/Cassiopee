import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

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
  modeLectureSeul = false; // Mettre à true si on veut cacher les boutons (par ex. pour un tuteur connecté)


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
            console.error('Erreur lors de la récupération de l’étudiant', err);
          }
        });
    }
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
}
