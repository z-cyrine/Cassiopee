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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
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
