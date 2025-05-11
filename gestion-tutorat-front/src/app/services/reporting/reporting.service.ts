import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportingService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Récupérer les données filtrées depuis le backend
  getFilteredData(filters: any): Observable<any[]> {
    let params = new HttpParams();

if (filters.groupe) {
  params = params.set('groupe', filters.groupe);
}


    if (filters.departement) {
      params = params.set('departement', filters.departement);
    }

    if (filters.langue) {
      params = params.set('langue', filters.langue);
    }

    if (filters.etudiant) {
      params = params.set('etudiant', filters.etudiant);
    }

    if (filters.tuteur) {
      params = params.set('tuteur', filters.tuteur);
    }

    if (filters.assignmentStatus) {
      params = params.set('assignmentStatus', filters.assignmentStatus);
    }

    // Support multi-tuteurs
    if (filters.tuteurIds && Array.isArray(filters.tuteurIds)) {
      filters.tuteurIds.forEach((id: number) => {
        params = params.append('tuteurIds', id.toString());
      });
    }

    return this.http.get<any[]>(`${this.baseUrl}/reporting/dynamic`, { params });
  }

  // Récupérer les majeures
  getDistinctMajors(): Observable<{ code: string; groupe: string }[]> {
    return this.http.get<{ code: string; groupe: string }[]>(`${this.baseUrl}/majeures/distinct`);
  }

  // Récupérer les départements
  getDistinctDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/majeures/departments`);
  }

  // Récupérer tous les tuteurs
  getAllTuteurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tuteurs`);
  }
}
