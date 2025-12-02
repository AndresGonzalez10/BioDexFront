import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { ExpoCartComponent } from '../../core/components/expo-cart/expo-cart.component';
import { ExpoService } from '../../services/expo.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-other-expos',
  standalone: true,
  imports: [CommonModule, NavBarComponent, ExpoCartComponent],
  templateUrl: './other-expos.html',
  styleUrl: './other-expos.css'
})
export class OtherExpos implements OnInit {
  expos: any[] = [];

  constructor(
    private expoService: ExpoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadExpos();
  }

  loadExpos(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id) {
      this.expoService.getOtherUsersExpos(currentUser.id).subscribe({
        next: (data: any[]) => {
          console.log('✅ Exposiciones de otros usuarios cargadas:', data);
          this.expos = data;
        },
        error: (error: any) => {
          console.error('❌ Error al cargar exposiciones de otros usuarios:', error);
        }
      });
    } else {
      console.log('Usuario no autenticado o ID de usuario no disponible.');
      this.expos = [];
    }
  }
}
