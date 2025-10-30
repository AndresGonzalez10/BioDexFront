import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { ColetcionCartComponent } from '../../core/components/colletcion-cart/collection-cart.component';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, NavBarComponent,ColetcionCartComponent],
  templateUrl: './collections.html',
  styleUrl: './collections.css'
})
export class Collections {

}
