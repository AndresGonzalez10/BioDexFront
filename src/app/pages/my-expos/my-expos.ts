import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { ExpoCartComponent } from '../../core/components/expo-cart/expo-cart.component';
import { CommonModule } from '@angular/common';
import { ExpoService } from '../../services/expo.service';
import { AuthService } from '../../core/services/auth.service';

interface Exhibition {
  id: string;
  title: string;
  coverImageUrl: string;
}

@Component({
  selector: 'app-my-expos',
  standalone: true,
  imports: [NavBarComponent, ExpoCartComponent, CommonModule],
  templateUrl: './my-expos.html',
  styleUrl: './my-expos.css'
})
export class MyExpos implements OnInit {
  exhibitions: Exhibition[] = [];

  constructor(private expoService: ExpoService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadMyExhibitions();
  }

  loadMyExhibitions(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id) {
      this.expoService.getExposByUserId(currentUser.id).subscribe({
        next: (data) => {
          this.exhibitions = data;
        },
        error: (error) => {
          console.error('Error al cargar las exposiciones:', error);
        }
      });
    } else {
      console.log('Usuario no autenticado o ID de usuario no disponible.');
      this.exhibitions = [];
    }
  }
}
