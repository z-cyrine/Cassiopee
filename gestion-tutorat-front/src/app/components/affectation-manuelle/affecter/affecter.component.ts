import { Component, inject, Input, model, signal, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Tuteur } from '../../../services/tuteur/tuteur.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-affecter',
  imports: [TranslateModule],
  templateUrl: './affecter.component.html',
  styleUrl: './affecter.component.css'
})
export class AffecterComponent {
  @Input() etudiant!: { id: number, nom: string , prenom: string };

  @Output() etudiantAffecte = new EventEmitter<{ etudiantId: number; tuteur: Tuteur }>();


  readonly name = model('');
  readonly dialog = inject(MatDialog);

  affecter() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        etudiantId: this.etudiant.id,
        name: this.etudiant.nom,
        prenom: this.etudiant.prenom
      },
      autoFocus: false
    });
  
    dialogRef.componentInstance.etudiantAffecte.subscribe((data) => {
      this.etudiantAffecte.emit(data); // Re-transmet au parent
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log("dialog fermé")
    });
  }


}
