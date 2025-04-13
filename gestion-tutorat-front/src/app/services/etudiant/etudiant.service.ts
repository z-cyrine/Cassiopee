import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private baseUrl = 'http://localhost:3000/etudiant';

  constructor(private http: HttpClient) {}

  createEtudiant(data: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.baseUrl, data);
  }

  // Get all students
  getStudents(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.baseUrl);
  }

  // Get a single student by ID
  getEtudiant(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.baseUrl}/${id}`);
  }

  // Update an existing student
  update(id: number, etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.baseUrl}/${id}`, etudiant);
  }

  // (You can add create and delete methods here if needed in the future)
}
