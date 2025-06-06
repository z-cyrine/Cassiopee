import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Etudiant } from '../etudiant/etudiant.service';

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
  private baseUrl = `${environment.apiUrl}/tuteur`;
  private affectationUrl = `${environment.apiUrl}/affectation-manuelle`; // Uniformiser avec baseUrl

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

  getTuteurs(): Observable<Tuteur[]> {
    return this.http.get<Tuteur[]>(this.baseUrl);
  }

  affecterEtudiant(etudiantId: number, tuteurId: number): Observable<any> {
    return this.http.post(this.affectationUrl, {
      etudiantId,
      tuteurId
    });
  }

    /** Récupérer les étudiants affectés à un tuteur */
  getTuteurEtudiants(tuteurId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${tuteurId}/etudiants`);
  }

  /** Récupérer les étudiants affectés à un tuteur par son nom et prénom */
  getTuteurEtudiantsByNomPrenom(nom: string, prenom: string): Observable<any[]> {
    const params = new HttpParams()
      .set('nom', nom)
      .set('prenom', prenom);
    return this.http.get<any[]>(`${this.baseUrl}/etudiants`, { params });
  }

  searchTuteurs(nom?: string, prenom?: string): Observable<Tuteur[]> {
  const queryParams = [];
  if (nom) queryParams.push(`nom=${encodeURIComponent(nom)}`);
  if (prenom) queryParams.push(`prenom=${encodeURIComponent(prenom)}`);
  const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
  return this.http.get<Tuteur[]>(`${this.baseUrl}/search${queryString}`);
}

  getTuteurByEmail(email: string): Observable<Tuteur> {
    return this.http.get<Tuteur>(`${environment.apiUrl}/tuteur/by-email/${email}`);
  }

  getTuteurByUserEmail(email: string): Observable<Tuteur> {
  return this.http.get<Tuteur>(`${this.baseUrl}/by-user-email`, {
    params: { email }
  });
}


}
