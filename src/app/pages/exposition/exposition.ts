import { Component } from '@angular/core';
import { ProfileCart } from '../../core/components/profile-cart/profile-cart';
import { NavBar } from '../../core/components/nav-bar/nav-bar';

@Component({
  selector: 'app-exposition',
  imports: [ProfileCart, NavBar],
  templateUrl: './exposition.html',
  styleUrl: './exposition.css'
})
export class Exposition {

}
