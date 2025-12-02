import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {};

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.usuario = {
        nombre: currentUser.name || 'N/A',
        email: currentUser.email || 'N/A',
        rol: currentUser.role || 'N/A',
        // Agrega otros campos del usuario que quieras mostrar, excluyendo la foto
        // Por ejemplo:
        // id: currentUser.id,
        // username: currentUser.username,
      };
    }
  }
}