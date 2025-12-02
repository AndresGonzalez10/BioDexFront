import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private apiUrl = 'http://34.202.158.56:8080/collections'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCollectionsByUserId(userId: number): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      // Manejar el caso donde no hay token, quizás redirigir al login o lanzar un error
      return new Observable<any[]>(); // O throwError
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/manager/${userId}`, { headers });
  }

  createCollection(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateCollection(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
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

  getOtherUsersCollections(currentUserId: number): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      return new Observable<any[]>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      map(collections => collections.filter(collection => collection.idManager !== currentUserId))
    );
  }

  searchCollections(searchTerm: string, userId?: number): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      return new Observable<any[]>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    let url = `${this.apiUrl}`;
    if (userId) {
      url = `${this.apiUrl}/manager/${userId}`;
    }

    return this.http.get<any[]>(url, { headers }).pipe(
      map(collections => collections.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }
}