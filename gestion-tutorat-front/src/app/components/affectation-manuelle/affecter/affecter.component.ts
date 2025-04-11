import { Component, inject, Input, model, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-affecter',
  imports: [],
  templateUrl: './affecter.component.html',
  styleUrl: './affecter.component.css'
})
export class AffecterComponent {
  @Input() etudiant : { nom: string , prenom: string} = { nom: '' , prenom: ''};
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  affecter() : void {
    (document.activeElement as HTMLElement)?.blur();
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {name: this.etudiant.nom, prenom:this.etudiant.prenom
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }
}
