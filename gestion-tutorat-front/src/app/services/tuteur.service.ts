import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TuteurService {

  private baseUrl = 'http://localhost:3000/tuteur';

  constructor(private http: HttpClient) {}

  getTuteur(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateTuteur(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, data);
  }
}
