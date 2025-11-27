import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiUrl = 'http://localhost:8060/collections';

  constructor(private http: HttpClient) { }


  createCollection(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  updateCollection(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  getAllCollections(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllCollectionsWithSpecimens(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCollectionById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  deleteCollection(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}