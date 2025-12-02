import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://34.202.158.56:8080/locations';

  constructor(private http: HttpClient) { }

  // Método para obtener una ubicación por sus atributos
  getLocationByAttributes(
    country: string, state: string, municipality: string, locality: string,
    latitude_degrees: number, latitude_minutes: number, latitude_seconds: number,
    longitude_degrees: number, longitude_minutes: number, longitude_seconds: number,
    altitude: number
  ): Observable<any> {
    // Asumiendo que tu backend tiene un endpoint para buscar por atributos
    // Esto es un ejemplo, puede que necesites ajustar la URL y los parámetros
    return this.http.get<any>(`${this.apiUrl}/search`, {
      params: {
        country, state, municipality, locality,
        latitude_degrees, latitude_minutes, latitude_seconds,
        longitude_degrees, longitude_minutes, longitude_seconds,
        altitude
      }
    });
  }

  // Método para crear una nueva ubicación
  createLocation(locationData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, locationData);
  }

  getLocationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para actualizar una ubicación existente
  updateLocation(id: number, locationData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, locationData);
  }
}
