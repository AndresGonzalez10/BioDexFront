import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRegister } from '../../../services/auth.service';

@Component({
  selector: 'app-form2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form2.html',
  styleUrl: './form2.css'
})
export class Form2Component {
  
  description: string = '';
  photo: string = ''; // Opcional
  
  errorMessage: string | null = null;
  successMessage: string | null = null;
  registering: boolean = false;

  private step1Data: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // 1. RECUPERAR DATOS: Buscamos en la memoria del navegador lo que guardamos en el paso 1
    const savedData = sessionStorage.getItem('registerData');
    
    if (savedData) {
      this.step1Data = JSON.parse(savedData);
      console.log('Datos del paso 1 recuperados:', this.step1Data);
    } else {
      // SI NO HAY DATOS: Redirigir al paso 1 para evitar el error 500
      console.warn('Faltan datos del paso 1. Redirigiendo...');
      this.router.navigate(['/register']); 
    }
  }

  onRegister(): void {
    this.errorMessage = null;
    this.successMessage = null;
    this.registering = true;

    // Validación del paso 2 (solo descripción es obligatoria)
    if (!this.description) {
        this.errorMessage = 'La descripción es obligatoria.';
        this.registering = false;
        return;
    }

    // SEGURIDAD CRÍTICA: Si por alguna razón los datos del paso 1 no están, detenemos todo.
    if (!this.step1Data) {
        this.errorMessage = 'Error: Faltan datos del registro. Por favor vuelve a empezar desde el paso 1.';
        this.registering = false;
        return;
    }

    // 2. UNIR TODO: Juntamos datos paso 1 + datos paso 2
    const finalData: UserRegister = {
      ...this.step1Data, // Esparce name, email, password, etc.
      description: this.description,
      // Si la foto está vacía, enviamos 'default.jpg'
      photo: this.photo.trim() || 'default.jpg' 
    };
    
    // Debug: Muestra en consola qué se va a enviar exactamente
    console.log('Enviando al Backend:', finalData);

    // 3. ENVIAR AL BACKEND
    this.authService.register(finalData).subscribe({
      next: (response) => {
        this.registering = false;
        this.successMessage = '¡Registro exitoso!';
        // Limpiamos la memoria
        sessionStorage.removeItem('registerData');
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.registering = false;
        console.error('Error del servidor:', error);
        
        // Manejo específico del error 500 o errores de validación
        if (error.status === 500) {
            this.errorMessage = 'Error interno del servidor. Revisa si el correo ya existe o si la base de datos está activa.';
        } else {
            this.errorMessage = error.message || 'Ocurrió un error al registrar.';
        }
      }
    });
  }
}