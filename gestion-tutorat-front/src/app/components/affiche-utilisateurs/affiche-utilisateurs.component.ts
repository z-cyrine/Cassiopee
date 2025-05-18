import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserService, User } from '../../services/user/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-affiche-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './affiche-utilisateurs.component.html',
  styleUrls: ['./affiche-utilisateurs.component.css']
})
export class AfficheUtilisateursComponent implements OnInit {
  users: User[] = [];
  pagedUsers: User[] = [];
  searchResults: User[] = [];
  searchMode = false;
  roles: string[] = ['admin', 'prof', 'consultation'];

  // Pagination
  page = 1;
  limit = 20;
  total = 0;
  pageCount = 1;
  maxVisiblePages = 5;
  loading = false;

  // Search
  searchEmail: string = '';
  selectedRole: string = '';

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
      next: (data: User[]) => {
        this.users = data;
        this.total = data.length;
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

  updatePagedUsers(): void {
    const start = (this.page - 1) * this.limit;
    const end = this.page * this.limit;
    this.pagedUsers = this.users.slice(start, end);
  }

  // Pagination
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

  // Search logic
  onSearch(): void {
    const trimmedEmail = this.searchEmail.trim().toLowerCase();
    const roleFilter = this.selectedRole;

    if (!trimmedEmail && !roleFilter) {
      alert('Veuillez renseigner un email ou un rôle pour effectuer une recherche.');
      return;
    }

    this.searchMode = true;
    this.searchResults = this.users.filter(user => {
      const matchesEmail = !trimmedEmail || user.email.toLowerCase().includes(trimmedEmail);
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesEmail && matchesRole;
    });
  }

  onClearSearch(): void {
    this.searchEmail = '';
    this.selectedRole = '';
    this.searchResults = [];
    this.searchMode = false;
    this.loadUsers();
  }

  onEditUser(userId: number): void {
    this.router.navigate(['/utilisateurs/edit', userId]);
  }

  onDeleteUser(userId: number): void {
    if (confirm("Confirmez-vous la suppression de cet utilisateur ?")) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          alert('Utilisateur supprimé avec succès.');
          this.searchMode ? this.onSearch() : this.loadUsers();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert("Une erreur est survenue lors de la suppression.");
        }
      });
    }
  }
}
