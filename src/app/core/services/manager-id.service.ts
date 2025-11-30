import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagerIdService {

  private currentManagerId: number = 1; 

  constructor() { }

  getManagerId(): number {
    // En un sistema real, aquí se obtendría el ID del manager del usuario autenticado
    // Por ejemplo, de un servicio de autenticación, localStorage, etc.
    return this.currentManagerId;
  }

  // Método para establecer el ID del manager (útil si se implementa un login)
  setManagerId(id: number): void {
    this.currentManagerId = id;
  }
}
