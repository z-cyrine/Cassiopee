import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ImportComponent } from './components/import/import.component'; // Import necessary components
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Corrected styleUrls to plural
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class AppComponent {
  title = 'gestion-tutorat-front';
}
