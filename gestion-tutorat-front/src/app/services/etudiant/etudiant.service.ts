import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  private apiUrl = 'http://localhost:3000/etudiants/all'; 
  
    constructor(private http: HttpClient) {}
  
    getStudents(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
    }
}
