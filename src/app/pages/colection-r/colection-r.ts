import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CollectionService } from '../../services/collection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-collection-create',
  standalone: true,
  imports: [CommonModule, NavBarComponent, ReactiveFormsModule, HttpClientModule],
  templateUrl: './colection-r.html',
  styleUrl: './colection-r.css'
})
export class CollectionCreateComponent implements OnInit {
  collectionForm!: FormGroup;
  imagePreview: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private collectionService: CollectionService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.collectionForm = this.fb.group({
      nombreColeccion: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      portadaFile: [null],
      portadaFileName: ['']
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('La imagen es muy grande. Máximo 5MB');
        return;
      }

      this.collectionForm.patchValue({ portadaFile: file });
      this.collectionForm.get('portadaFileName')?.setValue(file.name);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log('Archivo seleccionado:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  }

  removeImage(): void {
    this.collectionForm.patchValue({ 
      portadaFile: null,
      portadaFileName: ''
    });
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.collectionForm.invalid) {
      console.log('Formulario no válido');
      Object.keys(this.collectionForm.controls).forEach(key => {
        const control = this.collectionForm.get(key);
        if (control?.invalid) {
          console.log(`Campo inválido: ${key}`, control.errors);
        }
      });
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('idManager', '1'); 
    formData.append('name', this.collectionForm.value.nombreColeccion);
    formData.append('description', this.collectionForm.value.descripcion);
    formData.append('category', this.collectionForm.value.categoria);

    const portadaFile = this.collectionForm.get('portadaFile')?.value;
    if (portadaFile) {
      formData.append('image', portadaFile, portadaFile.name);
      console.log('📁Imagen adjuntada:', portadaFile.name, `(${portadaFile.size} bytes)`);
    } else {
      console.log(' No se seleccionó imagen');
    }

   
    console.log('Enviando FormData:');
    for (let pair of formData.entries()) {
      if (pair[1] instanceof File) {
        const file = pair[1] as File;
        console.log(`  ${pair[0]}: [File] ${file.name} (${file.size} bytes, ${file.type})`);
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`);
      }
    }

    this.collectionService.createCollection(formData).subscribe({
      next: (response) => {
        console.log('Colección creada con éxito:', response);
        alert('Colección creada con éxito');
        this.isSubmitting = false;
        this.router.navigate(['/collections']);
      },
      error: (error) => {
        console.error('Error al crear la colección:', error);
        console.error('   Status:', error.status);
        console.error('   Error completo:', error.error);
        
        let errorMessage = 'Error al crear la colección';
        if (error.error?.message) {
          errorMessage += ': ' + error.error.message;
        } else if (typeof error.error === 'string') {
          errorMessage += ': ' + error.error;
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        }
        
        alert(errorMessage);
        this.isSubmitting = false;
      }
    });
  }
}
