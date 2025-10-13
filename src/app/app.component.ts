import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Necesitas importar RouterOutlet aquí
  template: '<router-outlet></router-outlet>', // Solo un router-outlet
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'biodex-landing'; // Nombre de tu proyecto
}