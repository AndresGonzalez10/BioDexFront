import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection-cart.html',
  styleUrls: ['./collection-cart.css']
})
export class CollectionCartComponent {
  @Input() collection: any;
  @Output() collectionSelected = new EventEmitter<string>();

  onCollectionClick(): void {
    this.collectionSelected.emit(this.collection.id);
  }
}