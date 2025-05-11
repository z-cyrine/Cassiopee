import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for ngIf, ngFor
import { MatTableModule } from '@angular/material/table'; // Required for mat-table
import { MatButtonModule } from '@angular/material/button'; // Required for buttons
import { MatInputModule } from '@angular/material/input'; // Required for inputs
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatInputModule, MatIconModule], // Add necessary modules
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: { columnDef: string; header: string; cell: (element: any) => string  | number}[] = [];

  @Input() showEdit: boolean = false;
  @Input() showDelete: boolean = false;

  // Pour le modal logs
  showLogModal = false;
  logModalContent = '';

  // Pour afficher/masquer la colonne logs
  showLogsCol = false;
  toggleLogsCol() {
    this.showLogsCol = !this.showLogsCol;
  }

  get columnDefinitions(): string[] {
    const baseColumns = this.columns.map((c) => c.columnDef);
    if (this.showEdit || this.showDelete) {
      baseColumns.push('actions');
    }
    return baseColumns;
  }

  edit(element: any): void {
    // Action d'édition (à implémenter)
  }

  delete(element: any): void {
    // Action de suppression (à implémenter)
  }

  openLogModal(log: string) {
    this.logModalContent = log;
    this.showLogModal = true;
  }

  closeLogModal() {
    this.showLogModal = false;
    this.logModalContent = '';
  }
}
