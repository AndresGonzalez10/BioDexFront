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

  uploadSpecimen(specimenData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/specimens`, specimenData, { responseType: 'text' });
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

export interface Specimen {
  id: number;
  idCollection: number;
  commonName: string;
  collectionDate: string;
  mainPhoto: string;
  collector: string;
  individualsCount: number;
  determinationYear: number;
  determinador: string;
  sex: string;
  vegetationType: string;
  collectionMethod: string;
  notes: string;
  scientificName: string;
  images: SpecimenImage[];
}

export interface SpecimenImage {
  id: number;
  idSpecimen: number;
  imageUrl: string;
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