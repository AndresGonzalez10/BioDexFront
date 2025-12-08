import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {
  private apiUrl = 'http://34.202.158.56:8080/taxonomy';

  constructor(private http: HttpClient) { }

  
  getTaxonomyByAttributes(family: string, genus: string, species: string, category: string): Observable<any> {
    
    
    return this.http.get<any>(`${this.apiUrl}/search`, {
      params: { family, genus, species, category }
    });
  }

  
  createTaxonomy(taxonomyData: { family: string, genus: string, species: string, category: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, taxonomyData);
  }

  getTaxonomyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
