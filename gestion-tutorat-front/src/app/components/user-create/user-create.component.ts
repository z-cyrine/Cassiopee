// src/app/components/user-create/user-create.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { UserService } from '../../services/user/user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-create',
  standalone: true,
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
  ],
})
export class UserCreateComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  roles = ['admin', 'prof', 'consultation'];
  private destroy$ = new Subject<void>();
  private displayNameManuallyChanged = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      prenom: ['', Validators.required],
      nom: ['', Validators.required],
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      role: ['', Validators.required],
    });

    this.userForm.get('prenom')!.valueChanges.subscribe(() => {
      this.updateUsername();
      this.updateDisplayName();
    });
    this.userForm.get('nom')!.valueChanges.subscribe(() => {
      this.updateUsername();
      this.updateDisplayName();
    });
    this.userForm.get('displayName')!.valueChanges.subscribe((value) => {
      // Si l'utilisateur modifie manuellement le displayName, on arrête la génération automatique
      const prenom = this.userForm.get('prenom')!.value || '';
      const nom = this.userForm.get('nom')!.value || '';
      const autoValue = prenom && nom ? `${prenom} ${nom.toUpperCase()}` : '';
      if (value !== autoValue) {
        this.displayNameManuallyChanged = true;
      } else {
        this.displayNameManuallyChanged = false;
      }
    });
  }

  updateUsername() {
    const prenom = this.userForm.get('prenom')!.value || '';
    const nom = this.userForm.get('nom')!.value || '';
    // username: première lettre du prénom + nom, tout attaché, en minuscules
    const username = prenom && nom ? `${prenom[0]}${nom}`.replace(/\s/g, '').toLowerCase() : '';
    this.userForm.get('username')!.setValue(username, { emitEvent: false });
  }

  updateDisplayName() {
    if (this.displayNameManuallyChanged) return;
    const prenom = this.userForm.get('prenom')!.value || '';
    const nom = this.userForm.get('nom')!.value || '';
    const displayName = prenom && nom ? `${prenom} ${nom.toUpperCase()}` : '';
    this.userForm.get('displayName')!.setValue(displayName, { emitEvent: false });
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.userForm.invalid) return;

    this.userService.createUser(this.userForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdUser) => {
          this.successMessage = 'Utilisateur créé avec succès !';
          setTimeout(() => {
            this.router.navigate(['/utilisateurs/all']);
          }, 1000);
        },
        error: (err) => {
          console.error('Erreur création utilisateur :', err);
          this.errorMessage = err?.error?.message || 'Erreur inattendue lors de la création.';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
