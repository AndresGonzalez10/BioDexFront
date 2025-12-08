import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://34.202.158.56:8080';

  constructor(private http: HttpClient, private authService: AuthService) { }

  sendSpecimenRequest(managerId: number, specimenId: number, description: string, requestType: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      managerId: managerId,
      specimenId: specimenId,
      description: description,
     requestType: requestType    };

    console.log('Request body being sent:', body);

    return this.http.post(`${this.apiUrl}/requests`, body, { headers });
  }

  

  getMyReceivedRequests(): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.apiUrl}/requests/received`, { headers });
  }

  getRequestById(requestId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/requests/${requestId}`, { headers });
  }

  updateRequestStatus(requestId: number, status: 'ACCEPTED' | 'REJECTED'): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No hay token de autenticación disponible.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const body = {
      status: status
    };

    return this.http.put(`${this.apiUrl}/requests/${requestId}/status`, body, { headers });
  }
}
