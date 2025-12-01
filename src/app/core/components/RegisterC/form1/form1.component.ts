import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form1.html',
  styleUrl: './form1.css'
})
export class Form1Component {
  
  // Variables para capturar los inputs del HTML
  name: string = '';
  lastName: string = '';
  institution: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {
    // Si el usuario regresa a esta pantalla, recuperamos lo que escribió antes
    const savedData = sessionStorage.getItem('registerData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.name = data.name || '';
      this.lastName = data.lastName || '';
      this.institution = data.institution || '';
      this.email = data.email || '';
      this.password = data.password || '';
    }
  }

  goToNextStep(): void {
    // 1. Validar que no haya campos vacíos
    if (!this.name || !this.lastName || !this.institution || !this.email || !this.password) {
      alert('Por favor, completa todos los campos para continuar.');
      return;
    }

    // 2. Crear el objeto con los datos del paso 1
    const step1Data = {
      name: this.name,
      lastName: this.lastName,
      institution: this.institution,
      email: this.email,
      password: this.password,
      role: 'RESEARCHER' // Asignamos el rol por defecto
    };

    // 3. ¡IMPORTANTE! Guardar en sessionStorage para que no se pierdan al cambiar de página
    sessionStorage.setItem('registerData', JSON.stringify(step1Data));
    
    // 4. Ir al siguiente paso
    this.router.navigate(['/register2']); 
  }
}