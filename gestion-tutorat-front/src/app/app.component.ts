import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImportComponent } from './components/import/import.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [ImportComponent, RouterModule],
})
export class AppComponent {
  title = 'gestion-tutorat-front';
}
