import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/gestion-acces/auth-service.service';

@Component({
  selector: 'app-majeure-read',
  templateUrl: './majeure-read.component.html',
  styleUrls: ['./majeure-read.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MajeureReadComponent implements OnInit {
  majeure: any;
  id: number | null = null;
  role: string | null = null;
  modeLectureSeul = true;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? parseInt(idParam, 10) : null;

    if (this.id !== null) {
      this.http.get(`${environment.apiUrl}/majeures/${this.id}`).subscribe({
        next: data => {
          this.majeure = data;
        },
        error: err => {
          console.error('Erreur lors de la récupération de la majeure', err);
        }
      });
    }
    this.authService.authStatus$.subscribe(() => {
      this.role = this.authService.getUserRole();
      this.modeLectureSeul = this.role !== 'admin';
    });

    this.authService.updateAuthStatus();

  }

  onDeleteMajeure(): void {
    if (this.id !== null && confirm('Confirmez-vous la suppression de cette majeure ?')) {
      this.http.delete(`${environment.apiUrl}/majeures/${this.id}`).subscribe({
        next: () => {
          alert('Majeure supprimée avec succès.');
          this.router.navigate(['/reporting']);
        },
        error: err => {
          console.error('Erreur lors de la suppression de la majeure', err);
          alert("Une erreur s'est produite.");
        }
      });
    }
  }

  goToList(): void {
    this.router.navigate(['/majeures/all']);
  }
}
