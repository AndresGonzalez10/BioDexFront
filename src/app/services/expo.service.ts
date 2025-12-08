import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpoService {
  private apiUrl = `${environment.apiUrl}/exhibitions`; // Corrected to match backend route

  constructor(private http: HttpClient, private authService: AuthService) { }

  getExposByUserId(userId: number): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      return new Observable<any[]>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/manager/${userId}`, { headers });
  }

  getAllExpos(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      return new Observable<any[]>();
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getOtherUsersExpos(currentUserId: number): Observable<any[]> {
    return this.getAllExpos().pipe(
      map(expos => expos.filter(expo => expo.idManager !== currentUserId))
    );
  }
}
