import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportingService } from '../services/reporting/reporting.service'; // Adjust this path as necessary

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  providers: [ReportingService]
})
export class ReportingComponent implements OnInit {
  filterForm: FormGroup;
  majors: any[] = [];       // expected items: { code: string, name: string } (or groupe)
  departments: any[] = [];  // expected items: strings (department names)
  tuteurs: any[] = [];      // expected items: { id: number, name: string }
  filteredData: any[] = []; // expected Etudiant objects with nested tuteur and majeure
  selectedTuteurs: string[] = [];

  constructor(private fb: FormBuilder, private reportingService: ReportingService) {
    this.filterForm = this.fb.group({
      majorFilter: [false],
      major: [''],
      departmentFilter: [false],
      department: [''],
      languageFilter: [false],
      language: [''],
      tutorFilter: [false],
      tutorName: [''],
      studentFilter: [false],
      studentName: [''],
      statusFilter: [false],
      status: ['ALL']
    });
  }

  ngOnInit(): void {
    this.loadMajors();
    this.loadDepartments();
    this.loadTuteurs();
  }

  loadMajors(): void {
    this.reportingService.getMajors().subscribe((data: any[]) => {
      // Map your backend’s distinct majors so that m.code is used as the value and m.name (or m.groupe) is displayed.
      this.majors = data.map(m => ({ code: m.code, name: m.groupe || m.name }));
    });
  }

  loadDepartments(): void {
    this.reportingService.getDepartments().subscribe((data: any[]) => {
      // data is assumed an array of strings (department names)
      this.departments = data;
    });
  }

  loadTuteurs(): void {
    this.reportingService.getTuteurs().subscribe((data: any[]) => {
      // Map tutor objects. Assume each tutor has a property 'id' and 'nom'
      this.tuteurs = data.map(t => ({ id: t.id, name: t.nom }));
    });
  }

  toggleMajor(): void {
    if (!this.filterForm.get('majorFilter')?.value) {
      this.filterForm.patchValue({ major: '' });
    }
  }

  toggleDepartment(): void {
    if (!this.filterForm.get('departmentFilter')?.value) {
      this.filterForm.patchValue({ department: '' });
    }
  }

  toggleTuteurSelection(tuteurName: string): void {
    const index = this.selectedTuteurs.indexOf(tuteurName);
    if (index === -1) {
      this.selectedTuteurs.push(tuteurName);
    } else {
      this.selectedTuteurs.splice(index, 1);
    }
  }

  onSubmit(): void {
    console.log('onSubmit called, form value:', this.filterForm.value);
    const filters = { ...this.filterForm.value };
    // Map the status field to assignmentStatus
    if (filters.statusFilter && filters.status) {
      filters.assignmentStatus = filters.status;
    }
    filters.tuteurs = this.selectedTuteurs;
    this.reportingService.getFilteredReportingData(filters).subscribe(
      (data: any[]) => {
        console.log('Filtered Data Received:', data);
        this.filteredData = data;
      },
      (error: any) => {
        console.error('Error fetching filtered data:', error);
      }
    );
  }
}
