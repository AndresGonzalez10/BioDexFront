import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManagerIdService {

  private currentManagerId: number = 1; 

  constructor() { }

  getManagerId(): number {
  
    return this.currentManagerId;
  }

  setManagerId(id: number): void {
    this.currentManagerId = id;
  }
}
