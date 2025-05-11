import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ImportComponent implements OnDestroy {
  parTutoratFile: File | null = null;
  tutoratsFile: File | null = null;
  majorsFile: File | null = null;

  alertMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (fileType === 'parTutorat') {
        this.parTutoratFile = input.files[0];
      } else if (fileType === 'tutorats') {
        this.tutoratsFile = input.files[0];
      } else if (fileType === 'majors') {
        this.majorsFile = input.files[0];
      }
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  
    if (!this.parTutoratFile && !this.tutoratsFile && !this.majorsFile) {
      this.alertMessage = 'Veuillez sélectionner au moins un fichier.';
      return;
    }
  
    const formData = new FormData();
    if (this.parTutoratFile) formData.append('parTutorat', this.parTutoratFile);
    if (this.tutoratsFile) formData.append('tutorats', this.tutoratsFile);
    if (this.majorsFile) { formData.append('majors', this.majorsFile); }
    
    this.http.post('http://localhost:3000/import/upload', formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.alertMessage = 'Fichier(s) importé(s) avec succès !';
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'importation des fichiers :', err);
          this.alertMessage = 'Une erreur est survenue lors de l\'importation.';
        },
      });
  }
  

  private resetForm(): void {
    this.parTutoratFile = null;
    this.tutoratsFile = null;
    this.majorsFile = null;

    setTimeout(() => (this.alertMessage = null), 5000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
