import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-species',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './collection-species.htm',
  styleUrls: ['./collection-species.css']
})
export class CollectionSpeciesComponent implements OnInit {
  collections: any[] = [];

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id) {
      this.collectionService.getCollectionsByUserId(currentUser.id).subscribe({
        next: (data: any[]) => {
          console.log('✅ Colecciones de especies cargadas:', data);
          this.collections = data;
        },
        error: (error: any) => {
          console.error('❌ Error al cargar colecciones de especies:', error);
        }
      });
    } else {
      console.log('Usuario no autenticado o ID de usuario no disponible para colecciones de especies.');
      this.collections = [];
      this.router.navigate(['/login']);
    }
  }
}