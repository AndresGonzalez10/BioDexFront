import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { CollectionService } from '../../services/collection.service';
import { Router } from '@angular/router';
import { CollectionCartComponent } from '../../core/components/collection-cart/collection-cart.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-collection-r',
  standalone: true,
  imports: [CommonModule, NavBarComponent, CollectionCartComponent],
  templateUrl: './collections.html',
  styleUrl: './collections.css'
})
export class CollectionR implements OnInit {
  collections: any[] = [];

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.id) {
      this.collectionService.getCollectionsByUserId(currentUser.id).subscribe({
        next: (data: any[]) => {
          console.log('✅ Colecciones cargadas:', data);
          this.collections = data;
          console.log('✅ Colecciones cargadas (con imageUrl):', this.collections);
        },
        error: (error: any) => {
          console.error('❌ Error al cargar colecciones:', error);
        }
      });
    } else {
      console.log('Usuario no autenticado o ID de usuario no disponible.');
      this.collections = [];
    }
  }

  onCollectionSelected(collectionId: string): void {
    this.router.navigate(['/specimens/collection', collectionId]);
  }
}