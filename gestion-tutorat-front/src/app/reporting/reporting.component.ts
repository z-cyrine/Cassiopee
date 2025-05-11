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
  hasSubmitted = false;

  // Pagination
  page = 1;
  limit = 20;
  pageCount = 1;
  pagedData: any[] = [];

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
    this.hasSubmitted = true;

    const filters: any = {};

    if (this.filterForm.value.majorFilter && this.filterForm.value.major) {
      filters.groupe = this.filterForm.value.major;
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
      this.page = 1;
      this.pageCount = Math.ceil(this.filteredData.length / this.limit) || 1;
      this.updatePagedData();
    });
  }

  updatePagedData() {
    const start = (this.page - 1) * this.limit;
    const end = start + this.limit;
    this.pagedData = this.filteredData.slice(start, end);
  }

  nextPage() {
    if (this.page < this.pageCount) {
      this.page++;
      this.updatePagedData();
    }
  }
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePagedData();
    }
  }
  goToPage(pageNum: number) {
    if (pageNum >= 1 && pageNum <= this.pageCount) {
      this.page = pageNum;
      this.updatePagedData();
    }
  }
  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.pageCount, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
        LangueMajeure: item.langueMajeure,
        INI_ALT: item.iniAlt,
        Entreprise: item.entreprise,
        FonctionApprenti: item.fonctionApprenti,
        Langue: item.langue,
        CommentaireAffectation: item.commentaireAffectation,
        DépartementRattachement: item.departementRattachement,
        Département: item.majeure?.dept || 'Aucun Département',
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
