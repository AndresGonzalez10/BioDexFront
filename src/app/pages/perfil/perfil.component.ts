import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, NavBarComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: any = {};
  isEditMode: boolean = false;
  editForm: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.usuario = {
        nombre: currentUser.name || 'N/A',
        apellido: currentUser.lastName || 'N/A',
        email: currentUser.email || 'N/A',
        rol: currentUser.role || 'N/A',
        institucion: currentUser.institution || 'N/A',
        descripcion: currentUser.description || 'N/A',
        foto: currentUser.photo || '/public/assets/mariposa3.png'
      };
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.editForm = {
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        institucion: this.usuario.institucion,
        descripcion: this.usuario.descripcion
      };
    }
  }

  saveProfile(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      const userId = currentUser.id;
      const updatedData = {
        name: this.editForm.nombre,
        lastName: this.editForm.apellido,
        institution: this.editForm.institucion,
        description: this.editForm.descripcion
      };

      this.authService.updateProfile(userId, updatedData).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.loadUserData(); 
          this.isEditMode = false; 
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert('Error al actualizar el perfil.');
        }
      });
    }
  }
}