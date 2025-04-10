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

@Injectable({ providedIn: 'root' })
export class EtudiantService {
  private baseUrl = 'http://localhost:3000/etudiant'; 

  constructor(private http: HttpClient) {}

  createEtudiant(data: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.baseUrl, data);
  }

  // D'autres méthodes CRUD viendront plus tard (findAll, update, etc.)
}
