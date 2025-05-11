import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tuteur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  departement: string;
  estEligiblePourTutorat: boolean;
  statut: string;
  colonne2?: string;
  infoStatut?: string;
  langueTutorat?: string[];
  profil: string;
  parTutoratAlt: number;
  tutoratAltAff: number;
  soldeAlt: number;
  parTutoratIni: number;
  tutoratIniAff: number;
  soldeIni: number;
  totalEtudiantsPar: number;
  nbTutoratAffecte: number;
  soldeTutoratRestant: number;
  matieres?: string[];
  domainesExpertise?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TuteurService {
  private baseUrl = 'http://localhost:3000/tuteur'; // Adjust if needed (or use a proxy)

  constructor(private http: HttpClient) {}

  createTuteur(tuteur: Tuteur): Observable<Tuteur> {
    return this.http.post<Tuteur>(this.baseUrl, tuteur);
  }

  findOne(id: number): Observable<Tuteur> {
    return this.http.get<Tuteur>(`${this.baseUrl}/${id}`);
  }
  
  update(id: number, tuteur: Tuteur): Observable<Tuteur> {
    return this.http.put<Tuteur>(`${this.baseUrl}/${id}`, tuteur);
  }
  
}
