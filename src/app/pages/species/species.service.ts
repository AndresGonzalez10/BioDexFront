import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {
  
  private apiUrl = 'http://34.202.158.56:8080';

  constructor(private http: HttpClient) { }


  uploadSpecimen(specimenData: any): Observable<any> {
    return this.http.post(this.apiUrl, specimenData);
  }

  checkConnection(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}