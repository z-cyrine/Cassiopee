import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  resetDatabase(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-database`, {});
  }
} 