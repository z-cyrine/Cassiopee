import { CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-auto-affectation',
  imports: [CommonModule, JsonPipe],
  templateUrl: './auto-affectation.component.html',
  styleUrl: './auto-affectation.component.css'
})
export class AutoAffectationComponent {
  result: any = null;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  runAffectation() {
    this.loading = true;
    this.error = null;
    this.http.post('http://localhost:3000/auto-affectation', {}).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.error = "Erreur lors de l'affectation";
        this.loading = false;
      },
    });
  }
}
