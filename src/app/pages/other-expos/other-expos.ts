import { Component } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { ExpoCartComponent } from '../../core/components/expo-cart/expo-cart.component';

@Component({
  selector: 'app-other-expos',
  imports: [NavBarComponent, ExpoCartComponent],
  templateUrl: './other-expos.html',
  styleUrl: './other-expos.css'
})
export class OtherExpos {

}
