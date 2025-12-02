import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ManagerIdService } from './manager-id.service';


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

export interface UserUpdate {
  name?: string;
  lastName?: string;
  institution?: string;
  description?: string;
  photo?: string;
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
  private usersApiUrl = 'http://localhost:8060/users'; // Nuevo endpoint para usuarios
  
  currentUser = signal<UserResponse | null>(null);
  isAuthenticated = signal<boolean>(false);
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private managerIdService: ManagerIdService
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
        this.managerIdService.setManagerId(user.id);
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

  private updateUserDataInLocalStorage(updatedUser: UserResponse): void {
    const currentUser = this.currentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
      const newUser = { ...currentUser, ...updatedUser };
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      this.currentUser.set(newUser);
    }
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

  updateProfile(userId: number, userData: UserUpdate): Observable<UserResponse> {
    const url = `${this.apiUrl}/me/${userId}`;
const token = this.getToken();
if (!token) {
  return throwError(() => new Error('No authentication token found.'));
}

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<UserResponse>(url, userData, { headers }).pipe(
      tap(updatedUser => {
        this.updateUserDataInLocalStorage(updatedUser);
      }),
      catchError(error => {
        console.error('Error updating profile:', error);
        const errorMessage = error.error?.error || 'Error desconocido al actualizar el perfil.';
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