import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MajorsService, Majeure } from '../../services/majors/majors.service';

@Component({
  standalone: true,
  selector: 'app-majeure-create',
  templateUrl: './majeure-create.component.html',
  styleUrls: ['./majeure-create.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
})
export class MajeureCreateComponent implements OnInit, OnDestroy {
  majeureForm!: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private majorsService: MajorsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.majeureForm = this.fb.group({
      code: [''],
      groupe: [''],
      dept: [''],
      responsible: [''],
      langue: [''],
      iniAlt: ['', Validators.required], // dropdown, must be ALT or INI
      programme: ['']
    });
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.majeureForm.invalid) return;

    const formValue = this.majeureForm.value;

    this.majorsService.createMajeure(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created: Majeure) => {
          this.successMessage = 'Majeure créée avec succès !';
          setTimeout(() => this.router.navigate(['/majeures', created.id]), 1000);
        },
        error: () => {
          this.errorMessage = 'Erreur';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
