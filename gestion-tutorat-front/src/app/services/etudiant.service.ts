import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  private baseUrl = 'http://localhost:3000/etudiant';

  constructor(private http: HttpClient) {}

  getEtudiant(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateEtudiant(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }
}
