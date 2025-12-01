import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


export interface UserRegister {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: 'MANAGER' | 'RESEARCHER'; 
  institution: string;
  description: string;
  photo: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: string;
  institution: string;
  description: string;
  photo: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8060/auth'; 
  
  currentUser = signal<UserResponse | null>(null);
  isAuthenticated = signal<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    const token = localStorage.getItem('authToken');
    const userJson = localStorage.getItem('currentUser');
    
    if (token && userJson) {
      try {
        const user: UserResponse = JSON.parse(userJson);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (e) {
        console.error("Error al parsear usuario de localStorage:", e);
        this.logout();
      }
    }
  }

  private saveAuthData(response: LoginResponse): void {
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }


  register(data: UserRegister): Observable<UserResponse> {
    const url = `${this.apiUrl}/register`;
    return this.http.post<UserResponse>(url, data).pipe(
      catchError(error => {
        console.error('Error en registro:', error);
        const errorMessage = error.error?.error || 'Error desconocido al registrar.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  login(data: UserLogin): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    return this.http.post<LoginResponse>(url, data).pipe(
      tap(response => {
        this.saveAuthData(response); 
      }),
      catchError(error => {
        console.error('Error en inicio de sesión:', error);
        const errorMessage = error.error?.error || 'Error desconocido al iniciar sesión.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }


  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']); 
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }


}