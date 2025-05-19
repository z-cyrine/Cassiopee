// affectation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AffectationResult {
  total: number;
  assigned: number;
  details: any[]; // Chaque objet contient les infos de l'étudiant + tutor (nom, prenom, departement) et logs
}

@Injectable({
  providedIn: 'root',
})
export class AffectationService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  runAffectation(equivalence: number): Observable<AffectationResult> {
    return this.http.post<AffectationResult>(`${this.baseUrl}/auto-affectation`, {equivalence });
  }

  getEtatAffectation(): Observable<AffectationResult> {
    return this.http.get<AffectationResult>(`${this.baseUrl}/auto-affectation/etat-actuel`);
  }

  resetAffectation(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auto-affectation/reset`, {});
  }

  toggleFrozen(etudiantId: number, action: 'freeze' | 'unfreeze') {
    return this.http.put(`${this.baseUrl}/etudiant/${etudiantId}/${action}`, {});
  }
}
