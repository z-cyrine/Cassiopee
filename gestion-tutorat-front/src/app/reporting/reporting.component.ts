import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportingService } from '../services/reporting/reporting.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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
  filteredData: any[] = [];
  majors: any[] = [];
  departments: string[] = [];
  tuteurs: any[] = [];
  selectedTuteurs: number[] = [];

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
      status: ['']
    });
  }

  ngOnInit(): void {
    this.loadMajors();
    this.loadDepartments();
    this.loadTuteurs();
  }

  loadMajors() {
    this.reportingService.getDistinctMajors().subscribe((majors) => {
      this.majors = majors;
    });
  }

  loadDepartments() {
    this.reportingService.getDistinctDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  loadTuteurs() {
    this.reportingService.getAllTuteurs().subscribe((tuteurs) => {
      this.tuteurs = tuteurs;
    });
  }

  toggleTuteurSelection(tuteurId: number) {
    if (this.selectedTuteurs.includes(tuteurId)) {
      this.selectedTuteurs = this.selectedTuteurs.filter(id => id !== tuteurId);
    } else {
      this.selectedTuteurs.push(tuteurId);
    }
  }

  toggleMajor() {
    if (!this.filterForm.get('majorFilter')?.value) {
      this.filterForm.patchValue({ major: '' });
    }
  }

  toggleDepartment() {
    if (!this.filterForm.get('departmentFilter')?.value) {
      this.filterForm.patchValue({ department: '' });
    }
  }

  onSubmit(): void {
    const filters: any = {};

    if (this.filterForm.value.majorFilter && this.filterForm.value.major) {
      filters.majeure = this.filterForm.value.major;
    }

    if (this.filterForm.value.departmentFilter && this.filterForm.value.department) {
      filters.departement = this.filterForm.value.department;
    }

    if (this.filterForm.value.languageFilter && this.filterForm.value.language) {
      filters.langue = this.filterForm.value.language;
    }

    if (this.filterForm.value.tutorFilter && this.filterForm.value.tutorName) {
      filters.tuteur = this.filterForm.value.tutorName;
    }

    if (this.filterForm.value.studentFilter && this.filterForm.value.studentName) {
      filters.etudiant = this.filterForm.value.studentName;
    }

    if (this.filterForm.value.statusFilter && this.filterForm.value.status) {
      filters.assignmentStatus = this.filterForm.value.status;
    }

    if (this.selectedTuteurs.length > 0) {
      filters.tuteurIds = this.selectedTuteurs;
    }

    this.reportingService.getFilteredData(filters).subscribe((data) => {
      this.filteredData = data;
    });
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(
      this.filteredData.map((item) => ({
        ID: item.id,
        Prénom: item.prenom,
        Nom: item.nom,
        EmailÉcole: item.emailEcole,
        Origine: item.origine,
        École: item.ecole,
        ObligationInternationale: item.obligationInternational,
        Stage1A: item.stage1A,
        CodeClasse: item.codeClasse,
        NomGroupe: item.nomGroupe,
        LangueMajeure: item.langueMajeure,
        INI_ALT: item.iniAlt,
        Entreprise: item.entreprise,
        FonctionApprenti: item.fonctionApprenti,
        Langue: item.langue,
        CommentaireAffectation: item.commentaireAffectation,
        DépartementRattachement: item.departementRattachement,
        Tuteur: item.tuteur ? `${item.tuteur.prenom} ${item.tuteur.nom}` : 'Aucun Tuteur',
        Statut: item.affecte ? 'Affecté' : 'Non Affecté'
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporting');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(data, 'reporting-etudiants.xlsx');
  }
}
