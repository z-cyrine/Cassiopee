// majors.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Majeure {
  id?: number;
  groupe?: string;
  code: string;
  dept?: string;
  responsible?: string;
  langue?: string;
  iniAlt?: string;
  programme?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MajorsService {
  private baseUrl = `${environment.apiUrl}/majeures`;

  constructor(private http: HttpClient) {}

  // CREATE
  createMajeure(majeure: Majeure): Observable<any> {
    return this.http.post(`${this.baseUrl}`, majeure);
  }

  // READ ONE
  getMajeure(id: number): Observable<Majeure> {
    return this.http.get<Majeure>(`${this.baseUrl}/${id}`);
  }

  // UPDATE
  updateMajeure(id: number, updatedMajeure: Majeure): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updatedMajeure);
  }

  // DELETE
  deleteMajeure(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // LIST ALL (optional for future)
  getAllMajors(): Observable<Majeure[]> {
    return this.http.get<Majeure[]>(this.baseUrl);
  }
}
