import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../environments/environment';
import { UserService, User } from '../../services/user/user.service';

@Component({
  selector: 'app-affiche-utilisateurs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './affiche-utilisateurs.component.html',
  styleUrls: ['./affiche-utilisateurs.component.css']
})
export class AfficheUtilisateursComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role', 'createdAt', 'actions'];
  users: User[] = [];
  pagedUsers: User[] = [];
  roles: string[] = ['admin', 'prof', 'consultation'];
  
  // Search and filter
  searchEmail: string = '';
  selectedRole: string = '';
  
  // Pagination maison
  page = 1;
  limit = 10;
  total = 0;
  pageCount = 1;
  maxVisiblePages = 5;
  loading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.total = users.length;
        this.pageCount = Math.ceil(this.total / this.limit);
        this.updatePagedUsers();
        this.loading = false;
      },
      error: err => {
        console.error('Erreur chargement utilisateurs :', err);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.loading = true;
    this.userService.searchUsers(this.searchEmail, this.selectedRole)
      .subscribe({
        next: (users: User[]) => {
          this.users = users;
          this.total = users.length;
          this.pageCount = Math.ceil(this.total / this.limit);
          this.page = 1;
          this.updatePagedUsers();
          this.loading = false;
        },
        error: err => {
          console.error('Erreur recherche utilisateurs :', err);
          this.loading = false;
        }
      });
  }

  updatePagedUsers(): void {
    const start = (this.page - 1) * this.limit;
    const end = this.page * this.limit;
    this.pagedUsers = this.users.slice(start, end);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const half = Math.floor(this.maxVisiblePages / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.pageCount, start + this.maxVisiblePages - 1);
    if (end - start + 1 < this.maxVisiblePages) {
      start = Math.max(1, end - this.maxVisiblePages + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(pageNum: number): void {
    if (pageNum !== this.page) {
      this.page = pageNum;
      this.updatePagedUsers();
    }
  }

  nextPage(): void {
    if (this.page < this.pageCount) {
      this.page++;
      this.updatePagedUsers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePagedUsers();
    }
  }

  onEditUser(userId: number): void {
    this.router.navigate(['/utilisateurs/edit', userId]);
  }

  onDeleteUser(userId: number): void {
    if (confirm("Confirmez-vous la suppression de cet utilisateur ?")) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.applyFilter();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert("Une erreur est survenue lors de la suppression.");
        }
      });
    }
  }
}
