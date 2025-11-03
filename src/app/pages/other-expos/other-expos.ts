import { Component } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { ExpoCart } from '../../core/components/expo-cart/expo-cart';

@Component({
  selector: 'app-other-expos',
  imports: [NavBarComponent, ExpoCart],
  templateUrl: './other-expos.html',
  styleUrl: './other-expos.css'
})
export class OtherExpos {

}
