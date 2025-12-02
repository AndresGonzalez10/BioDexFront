import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
      // Handle case where token is not available, e.g., user not logged in
      return new Observable<any[]>();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Using the correct backend endpoint for user-specific exhibitions
    return this.http.get<any[]>(`${this.apiUrl}/manager/${userId}`, { headers });
  }
}
