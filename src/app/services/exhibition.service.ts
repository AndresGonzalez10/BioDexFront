import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {
  private apiUrl = 'http://localhost:8080/exhibitions'; // Ajusta esta URL a tu API real

  constructor(private http: HttpClient) { }

  getExhibitions(): Observable<any[]> {
    // Aquí deberías hacer la llamada HTTP a tu backend
    // Por ahora, devolveremos datos de prueba
    return of([
      { id: 1, image: 'https://via.placeholder.com/150', name: 'Exposición 1' },
      { id: 2, image: 'https://via.placeholder.com/150', name: 'Exposición 2' },
      { id: 3, image: 'https://via.placeholder.com/150', name: 'Exposición 3' },
      { id: 4, image: 'https://via.placeholder.com/150', name: 'Exposición 4' },
    ]);
  }
}