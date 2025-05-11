import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MajorsService } from '../../services/majors/majors.service';

@Component({
  standalone: true,
  selector: 'app-majeure-create',
  templateUrl: './majeure-create.component.html',
  styleUrls: ['./majeure-create.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule]
})
export class MajeureCreateComponent implements OnInit, OnDestroy {
  majeureForm!: FormGroup;
  successMessage = '';
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private majorsService: MajorsService) {}

  ngOnInit() {
    this.majeureForm = this.fb.group({
      code: ['', Validators.required],
      groupe: ['', Validators.required],
      dept: ['', Validators.required],
      responsible: ['', Validators.required],
      langue: ['', Validators.required], // dropdown handles values directly now
      iniAlt: ['', Validators.required],
      programme: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.majeureForm.invalid) return;

    const formValue = this.majeureForm.value;

    this.majorsService.createMajeure(formValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.successMessage = 'Majeure créée avec succès !';
          this.majeureForm.reset();
        },
        error: (err: any) => {
          console.error('Erreur création majeure :', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
