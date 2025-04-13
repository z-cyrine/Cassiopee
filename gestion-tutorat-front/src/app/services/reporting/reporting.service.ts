import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  // Adjust the API URL if needed; here it points to your local backend
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Fetch distinct majors from the backend endpoint.
  // The backend should return an array of objects with at least two properties:
  // For example: [{ code: 'MATH', name: 'Mathématiques' }, ...] 
  getMajors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/majeures/distinct`);
  }

  // Fetch tutors from the backend endpoint.
  // The backend should return an array of tutor objects containing id and nom (or similar)
  getTuteurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tuteurs`);
  }

  // Fetch distinct departments from the backend endpoint.
  // The backend should return an array of strings (for example: ["Mathematiques", "Informatique", ...])
  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/majeures/departments`);
  }

  // Get filtered reporting data based on the applied filters.
  // The filters object is sent as query parameters.
  getFilteredReportingData(filters: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reporting/dynamic`, { params: filters });
  }
}
