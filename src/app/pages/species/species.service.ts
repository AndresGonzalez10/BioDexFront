import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {
  
  private apiUrl = 'http://localhost:8060/specimens';

  constructor(private http: HttpClient) { }


  uploadSpecimen(specimenData: any): Observable<any> {
    return this.http.post(this.apiUrl, specimenData);
  }

  checkConnection(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}