import { Component } from '@angular/core';
import { ProfileCart } from '../../core/components/profile-cart/profile-cart';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-exposition',
  imports: [ProfileCart, NavBarComponent],
  templateUrl: './exposition.html',
  styleUrl: './exposition.css'
})
export class Exposition {

}
