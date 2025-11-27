import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../services/collection.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-collection-species',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './collection-species.htm',
  styleUrls: ['./collection-species.css']
})
export class CollectionSpeciesComponent implements OnInit {
  collections: any[] = [];

  constructor(private collectionService: CollectionService) { }

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.collectionService.getAllCollections().subscribe(data => {
      this.collections = data;
      console.log('Colecciones cargadas:', this.collections);
    }, error => {
      console.error('Error al cargar colecciones:', error);
    });
  }
}