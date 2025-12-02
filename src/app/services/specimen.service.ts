import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpecimenService {
  private apiUrl = 'http://34.202.158.56:8080'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  getSpecimen(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/specimens/${id}`);
  }

  getSpecimens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/specimens`);
  }

  getAllSpecimens(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      return new Observable<any[]>();
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/specimens`, { headers });
  }

  getSpecimensByCollectionId(collectionId: string): Observable<Specimen[]> {
    return this.http.get<CollectionResponse>(`${this.apiUrl}/collections/${collectionId}`).pipe(
      map(response => response.specimens)
    );
  }

  getSpecimensByUserId(userId: number): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      return new Observable<any[]>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/specimens/user/${userId}`, { headers });
  }

  getOtherUsersSpecimens(currentUserId: number): Observable<any[]> {
    return this.getAllSpecimens().pipe(
      map(specimens => specimens.filter(specimen => specimen.idManager !== currentUserId))
    );
  }

  checkConnection(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/specimens`);
  }

  uploadSpecimen(specimenData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/specimens`, specimenData);
  }

  deleteSpecimen(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/specimens/${id}`);
  }

  updateSpecimen(id: number, specimenData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/specimens/${id}`, specimenData);
  }


}

export interface Specimen {
  id: number;
  idCollection: number;
  commonName: string;
  collectionDate: string;
  mainPhoto: string | null;
  collector: string;
  individualsCount: number;
  determinationYear: number;
  determinador: string;
  sex: string;
  vegetationType: string;
  collectionMethod: string;
  notes: string | null;
  scientificName: string;
  
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