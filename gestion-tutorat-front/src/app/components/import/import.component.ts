import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class ImportComponent implements OnDestroy {
  parTutoratFile: File | null = null;
  tutoratsFile: File | null = null;
  majorsFile: File | null = null;

  importMessage: string | null = null;
  resetMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {}

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
      this.importMessage = this.translate.instant('IMPORT.ALERT_SELECT_FILE');
      return;
    }

    const formData = new FormData();
    if (this.parTutoratFile) formData.append('parTutorat', this.parTutoratFile);
    if (this.tutoratsFile) formData.append('tutorats', this.tutoratsFile);
    if (this.majorsFile) formData.append('majors', this.majorsFile);

    this.http.post<{ message?: string }>(`${environment.apiUrl}/import/upload`, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const msg = res?.message || this.translate.instant('IMPORT.ALERT_IMPORT_SUCCESS');
          this.snackBar.open(msg, 'Fermer', {
            duration: 4000,
            panelClass: ['snack-success']
          });
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'importation des fichiers :', err);
          this.snackBar.open(
            this.translate.instant('IMPORT.ALERT_IMPORT_ERROR'),
            'Fermer',
            {
              duration: 5000,
              panelClass: ['snack-error']
            }
          );
        },
      });
  }

  private resetForm(): void {
    this.parTutoratFile = null;
    this.tutoratsFile = null;
    this.majorsFile = null;
    this.importMessage = null;
  }

  openResetConfirmation(): void {
    const confirmed = window.confirm(
      this.translate.instant('IMPORT.CONFIRM_RESET_MESSAGE') ||
      'Confirmez-vous la réinitialisation de la base de données ? Cette action est irréversible.'
    );
    if (confirmed) {
      this.http.post<{ message: string }>(`${environment.apiUrl}/admin/reset-database`, {})
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this.snackBar.open(
              res?.message || this.translate.instant('IMPORT.ALERT_RESET_SUCCESS'),
              'Fermer',
              { duration: 5000, panelClass: ['snack-success'] }
            );
            this.resetMessage = null;
          },
          error: (err) => {
            this.snackBar.open(
              err.error?.message || this.translate.instant('IMPORT.ALERT_RESET_ERROR'),
              'Fermer',
              { duration: 5000, panelClass: ['snack-error'] }
            );
            this.resetMessage = null;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
