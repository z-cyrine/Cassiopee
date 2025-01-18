import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  private readonly API_URL = 'http://localhost:3000/import/upload';

  constructor(private http: HttpClient) {}

  uploadFiles(parTutoratFile: File, tutoratsFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('parTutorat', parTutoratFile);
    formData.append('tutorats', tutoratsFile);

    return this.http.post(this.API_URL, formData);
  }
}
