import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
dismissError() {
throw new Error('Method not implemented.');
}

  errorMessage = '';

constructor(private route: ActivatedRoute, private snackBar: MatSnackBar) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    if (params['error'] === 'unauthorized') {
      this.snackBar.open('⚠️ Utilisateur non autorisé.', 'Fermer', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['cas-snackbar-error'],
      });
    }
  });
}


}
