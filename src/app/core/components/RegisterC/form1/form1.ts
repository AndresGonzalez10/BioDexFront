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
  
  name: string = '';
  lastName: string = '';
  institution: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {
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
    if (!this.name || !this.lastName || !this.institution || !this.email || !this.password) {
      alert('Por favor, completa todos los campos para continuar.');
      return;
    }

    const step1Data = {
      name: this.name,
      lastName: this.lastName,
      institution: this.institution,
      email: this.email,
      password: this.password,
      role: 'MANAGER' 
    };

    sessionStorage.setItem('registerData', JSON.stringify(step1Data));
    
    this.router.navigate(['/register2']); 
  }
}