import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { ExpoCartComponent } from '../../core/components/expo-cart/expo-cart.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ManagerIdService } from '../../core/services/manager-id.service';

interface Exhibition {
  id: string;
  title: string;
  coverImageUrl: string;
}

@Component({
  selector: 'app-my-expos',
  standalone: true,
  imports: [NavBarComponent, ExpoCartComponent, HttpClientModule, CommonModule],
  templateUrl: './my-expos.html',
  styleUrl: './my-expos.css'
})
export class MyExpos implements OnInit {
  exhibitions: Exhibition[] = [];
  private API_BASE_URL = 'http://localhost:8060'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient, private managerIdService: ManagerIdService) { }

  ngOnInit(): void {
    this.loadMyExhibitions();
  }

  loadMyExhibitions(): void {
    const idManager = this.managerIdService.getManagerId(); // Obtener del servicio
    this.http.get<Exhibition[]>(`${this.API_BASE_URL}/exhibitions/manager/${idManager}`)      .subscribe({
        next: (data) => {
          this.exhibitions = data;
          console.log('Exposiciones cargadas:', this.exhibitions);
        },
        error: (error) => {
          console.error('Error al cargar las exposiciones:', error);
        }
      });
  }
}
