import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Etudiant {
  id?: number;
  emailEcole: string;
  origine: string;
  ecole: string;
  prenom: string;
  nom: string;
  obligationInternational: string;
  stage1A: string;
  codeClasse: string;
  nomGroupe: string;
  langueMajeure: string;
  iniAlt: string;
  entreprise?: string;
  fonctionApprenti?: string;
  langue?: string;
  commentaireAffectation?: string;
  departementRattachement?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  // Use the backend Etudiant controller base URL.
  private baseUrl = `${environment.apiUrl}/etudiant`;

  constructor(private http: HttpClient) {}

  searchStudents(nom?: string, prenom?: string): Observable<Etudiant[]> {
  const params: any = {};
  if (nom) params.nom = nom;
  if (prenom) params.prenom = prenom;

  return this.http.get<Etudiant[]>(`${this.baseUrl}/search`, { params });
}


  createEtudiant(data: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.baseUrl, data);
  }

  // Get all students (paginated)
  getStudents(page: number = 1, limit: number = 20) {
    return this.http.get<{ data: Etudiant[]; total: number; page: number; pageCount: number }>(
      `${this.baseUrl}?page=${page}&limit=${limit}`
    );
  }

  // Get a single student by ID
  getEtudiant(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.baseUrl}/${id}`);
  }

  // Update an existing student
  update(id: number, etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.baseUrl}/${id}`, etudiant);
  }

  getAllStudents() {
  return this.http.get<Etudiant[]>(`${this.baseUrl}/all`);
}

toggleFrozen(etudiantId: number, action: 'freeze' | 'unfreeze') {
  return this.http.put(`${this.baseUrl}/${etudiantId}/${action}`, {});
}

batchFreeze(ids: number[]) {
  return this.http.put(`${this.baseUrl}/batch/freeze`, ids);
}

batchUnfreeze(ids: number[]) {
  return this.http.put(`${this.baseUrl}/batch/unfreeze`, ids);
}

}
