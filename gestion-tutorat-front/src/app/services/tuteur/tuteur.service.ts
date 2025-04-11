import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TuteurService {

    private apiUrl = 'http://localhost:3000/tuteur/all'; 
    private affectationUrl = 'http://localhost:3000/affectation-manuelle';
    
      constructor(private http: HttpClient) {}
    
      getTuteurs(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
      }

      affecterEtudiant(etudiantId: number, tuteurId: number): Observable<any> {
        return this.http.post(this.affectationUrl, {
          etudiantId,
          tuteurId
        });
      }
}
