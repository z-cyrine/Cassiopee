import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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

  constructor(private http: HttpClient, private dialog: MatDialog, private translate: TranslateService) {}

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
    if (this.majorsFile) { formData.append('majors', this.majorsFile); }
    
    this.http.post<{ message?: string }>(`${environment.apiUrl}/import/upload`, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.importMessage = res && res.message ? res.message : this.translate.instant('IMPORT.ALERT_IMPORT_SUCCESS');
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'importation des fichiers :', err);
          this.importMessage = this.translate.instant('IMPORT.ALERT_IMPORT_ERROR');
        },
      });
  }
  

  private resetForm(): void {
    this.parTutoratFile = null;
    this.tutoratsFile = null;
    this.majorsFile = null;

    setTimeout(() => (this.importMessage = null), 5000);
  }

  openResetConfirmation(): void {
    const dialogRef = this.dialog.open(ResetConfirmationDialog, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post<{ message: string }>(`${environment.apiUrl}/admin/reset-database`, {})
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              console.log('Réponse reset:', res);
              this.resetMessage = typeof res === 'string'
                ? res
                : (res && res.message ? res.message : JSON.stringify(res));
            },
            error: (err) => {
              this.resetMessage = err.error?.message || this.translate.instant('IMPORT.ALERT_RESET_ERROR');
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

@Component({
  selector: 'reset-confirmation-dialog',
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">Confirmation de réinitialisation</h2>
      <div class="dialog-content">
        <p class="warning-text">
          ⚠️ Attention : Cette action va supprimer toutes les données de la base de données.<br>
          Cette action est irréversible !
        </p>
      </div>
      <div class="dialog-actions">
        <button mat-button (click)="onNoClick()">Annuler</button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          Réinitialiser
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
    }
    .dialog-title {
      margin: 0 0 20px;
      color: #333;
    }
    .dialog-content {
      margin-bottom: 20px;
    }
    .warning-text {
      color: #f44336;
      margin-bottom: 20px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class ResetConfirmationDialog {
  constructor(public dialogRef: MatDialogRef<ResetConfirmationDialog>) {}
  onNoClick(): void { this.dialogRef.close(); }
  onConfirm(): void { this.dialogRef.close(true); }
}
