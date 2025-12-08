import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './form.html', 
  styleUrl: './form.css'
})
export class FormComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage = null; 
    
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, ingresa correo y contraseña.';
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso:', response);
        this.router.navigate(['/mainview']); 
      },
      error: (error) => {
        this.errorMessage = error.message; 
      }
    });
  }
}