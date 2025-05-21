import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService, User } from '../../services/user/user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
})
export class UserEditComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  submitted = false;
  successMessage = '';
  userId: number | null = null;
  roles = ['admin', 'prof', 'consultation'];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = idParam ? parseInt(idParam, 10) : null;

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
       password: ['']
    });

    if (this.userId !== null) {
      this.userService.getUserById(this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user: User) => {
            this.userForm.patchValue({
              name: user.name,
              email: user.email,
              role: user.role,
            });
          },
          error: (err) => {
            console.error('Erreur chargement utilisateur', err);
          }
        });
    }
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    

    if (this.userForm.invalid || this.userId === null) return;

    const updatedUser = this.userForm.value;
    if (!updatedUser.password) {
  delete updatedUser.password;
}
    this.userService.updateUser(this.userId, updatedUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Utilisateur mis à jour avec succès !';
          setTimeout(() => {
            this.router.navigate(['/utilisateurs/all']);
          }, 1000);
        },
        error: (err) => {
          console.error('Erreur mise à jour utilisateur', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
