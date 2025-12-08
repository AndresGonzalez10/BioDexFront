import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProfileCart } from '../../core/components/profile-cart/profile-cart';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { lastValueFrom } from 'rxjs';

interface ExhibitionContent {
  id: number;
  idExhibition: number;
  contentType: 'TEXT' | 'IMAGE';
  textContent: string | null;
  imageUrl: string | null;
  imageDescription: string | null;
  displayOrder: number;
}

interface Exhibition {
  id: number;
  idManager: number;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  
  coverImageUrl: string | null; 
  
  content: ExhibitionContent[];
}

@Component({
  selector: 'app-other-exposition',
  standalone: true,
  imports: [ProfileCart, NavBarComponent, CommonModule, HttpClientModule],
  templateUrl: './other-exposition.html',
  styleUrl: './other-exposition.css'
})
export class OtherExposition implements OnInit {
  exhibition: Exhibition | undefined;
  
  public readonly API_BASE_URL = 'http://localhost:8060';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getExhibitionDetails(parseInt(id, 10));
      }
    });
  }

  async getExhibitionDetails(id: number): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.get<Exhibition>(`${this.API_BASE_URL}/exhibitions/${id}`)
      );
      
      if (response.content) {
        response.content.sort((a, b) => a.displayOrder - b.displayOrder);
      }
      
      this.exhibition = response;
    } catch (error) {
      console.error('Error al obtener los detalles de la exposición:', error);
    }
  }

  deleteExposition(): void {
    if (this.exhibition && confirm('¿Estás seguro de que quieres eliminar esta exposición?')) {
      this.http.delete(`${this.API_BASE_URL}/exhibitions/${this.exhibition.id}`).subscribe({
        next: () => {
          alert('Exposición eliminada con éxito.');
          this.router.navigate(['/myexpos']);
        },
        error: (error: any) => {
          console.error('Error al eliminar:', error);
          alert('Error al eliminar la exposición.');
        }
      });
    }
  }
}