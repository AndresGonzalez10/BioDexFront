import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-colection-r',
  standalone: true, 
  imports: [CommonModule, NavBarComponent],
  templateUrl: './colection-r.html',
  styleUrl: './colection-r.css'
})
export class ColectionR {

}
