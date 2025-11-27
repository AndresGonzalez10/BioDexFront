import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { CollectionService } from '../../services/collection.service';
import { Router } from '@angular/router';
import { CollectionCartComponent } from '../../core/components/collection-cart/collection-cart.component';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.collectionService.getAllCollectionsWithSpecimens().subscribe({
      next: (data: any[]) => {
        console.log('✅ Colecciones cargadas:', data);
        this.collections = data;
        console.log('✅ Colecciones cargadas (con imageUrl):', this.collections);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar colecciones:', error);
      }
    });
  }

  onCollectionSelected(collectionId: string): void {
    this.router.navigate(['/specimens/collection', collectionId]);
  }
}