import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpecimenService {
  private apiUrl = 'http://localhost:8060'; 

  constructor(private http: HttpClient) { }

  // ... (Tus gets siguen igual) ...
  getSpecimen(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/specimens/${id}`);
  }

  getSpecimens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/specimens`);
  }

  getSpecimensByCollectionId(collectionId: string): Observable<Specimen[]> {
    return this.http.get<CollectionResponse>(`${this.apiUrl}/collections/${collectionId}`).pipe(
      map(response => response.specimens)
    );
  }

  checkConnection(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/specimens`);
  }

  // ✅ CAMBIO PRINCIPAL:
  // 1. Recibe 'any' (el objeto JSON con URLs).
  // 2. Ya no fuerza responseType: 'text', espera JSON.
  uploadSpecimen(specimenData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/specimens`, specimenData);
  }

  deleteSpecimen(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/specimens/${id}`);
  }

  updateSpecimen(id: number, specimenData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/specimens/${id}`, specimenData);
  }

  deleteCollection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/collections/${id}`);
  }
}

// ✅ INTERFACES ACTUALIZADAS PARA COINCIDIR CON BACKEND
export interface Specimen {
  id: number;
  idCollection: number;
  commonName: string;
  collectionDate: string;
  mainPhoto: string | null; // Puede ser null
  collector: string;
  individualsCount: number;
  determinationYear: number;
  determinador: string;
  sex: string;
  vegetationType: string;
  collectionMethod: string;
  notes: string | null;
  scientificName: string;
  
  // Aplanamos las fotos como en el backend
  additionalPhoto1?: string;
  additionalPhoto2?: string;
  additionalPhoto3?: string;
  additionalPhoto4?: string;
  additionalPhoto5?: string;
  additionalPhoto6?: string;
}

export interface CollectionResponse {
  id: number;
  idManager: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  imageUrl?: string;
  specimens: Specimen[];
}