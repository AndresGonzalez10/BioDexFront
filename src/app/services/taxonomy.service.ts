import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxonomyService {
  private apiUrl = 'http://34.202.158.56:8080/taxonomy'; // Ajusta la URL de tu API

  constructor(private http: HttpClient) { }

  // Método para obtener una taxonomía por sus atributos
  getTaxonomyByAttributes(family: string, genus: string, species: string, category: string): Observable<any> {
    // Asumiendo que tu backend tiene un endpoint para buscar por atributos
    // Esto es un ejemplo, puede que necesites ajustar la URL y los parámetros
    return this.http.get<any>(`${this.apiUrl}/search`, {
      params: { family, genus, species, category }
    });
  }

  // Método para crear una nueva taxonomía
  createTaxonomy(taxonomyData: { family: string, genus: string, species: string, category: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, taxonomyData);
  }

  getTaxonomyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
