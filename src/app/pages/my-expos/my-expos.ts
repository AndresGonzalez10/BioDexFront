import { Component } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { ExpoCart } from '../../core/components/expo-cart/expo-cart';

@Component({
  selector: 'app-my-expos',
  imports: [NavBarComponent, ExpoCart],
  templateUrl: './my-expos.html',
  styleUrl: './my-expos.css'
})
export class MyExpos {

}
