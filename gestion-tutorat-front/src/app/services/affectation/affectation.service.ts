// affectation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AffectationResult {
  total: number;
  assigned: number;
  details: any[]; // Chaque objet contient les infos de l'étudiant + tutor (nom, prenom, departement) et logs
}

@Injectable({
  providedIn: 'root',
})
export class AffectationService {
  private readonly baseUrl = 'http://localhost:3000'; // Adaptez selon votre configuration

  constructor(private http: HttpClient) {}

  runAffectation(equivalence: number): Observable<AffectationResult> {
    return this.http.post<AffectationResult>(`${this.baseUrl}/auto-affectation`, {equivalence });
  }
}
