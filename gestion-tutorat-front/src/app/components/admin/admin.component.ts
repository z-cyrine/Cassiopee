import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResetService } from '../../services/reset.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminComponent {
  adminPassword: string = '';
  isLoading: boolean = false;
  message: string | null = null;
  messageType: 'success' | 'error' | 'info' = 'info';

  constructor(private resetService: ResetService) {}

  async onResetDatabase(): Promise<void> {
    if (!this.adminPassword) {
      this.showMessage('Veuillez entrer le mot de passe administrateur', 'error');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir réinitialiser la base de données ? Cette action est irréversible.')) {
      return;
    }

    this.isLoading = true;
    this.message = null;

    try {
      const result = await this.resetService.resetDatabase(this.adminPassword).toPromise();
      this.showMessage(result?.message || 'Base de données réinitialisée avec succès', 'success');
      this.adminPassword = '';
    } catch (error: any) {
      this.showMessage(
        error.error?.message || 'Une erreur est survenue lors de la réinitialisation',
        'error'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = null;
    }, 5000);
  }
} 