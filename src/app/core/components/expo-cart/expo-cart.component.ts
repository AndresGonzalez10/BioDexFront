import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-expo-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './expo-cart.html',
  styleUrls: ['./expo-cart.css']
})
export class ExpoCartComponent {
  @Input() title: string = '';
  @Input() coverImageUrl: string = '';
  @Input() id: string = '';

  private readonly API_BASE_URL = 'http://localhost:8060'; // Asegúrate de que esta URL sea correcta

  get fullCoverImageUrl(): string {
    return this.coverImageUrl ? `${this.API_BASE_URL}${this.coverImageUrl}` : '';
  }
}