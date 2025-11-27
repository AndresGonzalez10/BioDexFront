import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  usuario = {
    nombre: 'Usuario',
    email: 'usuario@ejemplo.com',
    rol: 'Investigador'
  };

  constructor() { }
}