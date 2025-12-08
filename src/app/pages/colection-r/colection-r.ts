import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CollectionService } from '../../services/collection.service';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-collection-create',
  standalone: true,
  imports: [CommonModule, NavBarComponent, ReactiveFormsModule, HttpClientModule],
  templateUrl: './colection-r.html',
  styleUrl: './colection-r.css'
})
export class CollectionCreateComponent implements OnInit {
  collectionForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  coverImageFileName: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient, 
    private collectionService: CollectionService,
    private router: Router,
    private authService: AuthService
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

      // Guardamos el archivo en el formulario
      this.collectionForm.patchValue({ portadaFile: file });
            this.collectionForm.get('portadaFileName')?.setValue(file.name);
            this.coverImageFileName = file.name;

      // Previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.collectionForm.patchValue({
      portadaFile: null,
      portadaFileName: ''
    });
    this.imagePreview = null;
    this.coverImageFileName = null;
  }

  onSubmit(): void {
    if (this.collectionForm.invalid) {
      this.collectionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const file = this.collectionForm.get('portadaFile')?.value;

    if (file) {
      this.uploadImageFirst(file);
    } 
    else {
      this.saveCollectionToBackend(null);
    }
  }

  private uploadImageFirst(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = 'http://34.202.158.56:8080/upload?folder=collections';

    this.http.post<any>(uploadUrl, formData).subscribe({
      next: (response) => {
        console.log('Imagen subida exitosamente:', response.url);
        
        this.saveCollectionToBackend(response.url);
      },
      error: (error) => {
        console.error('Error al subir la imagen:', error);
        alert('Error al subir la imagen al servidor.');
        this.isSubmitting = false;
      }
    });
  }

  private saveCollectionToBackend(imageUrl: string | null): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser || !currentUser.id) {
      alert('No se pudo obtener el ID del usuario actual. Por favor, inicia sesión de nuevo.');
      this.isSubmitting = false;
      return;
    }

    const collectionData = {
      idManager: currentUser.id, 
      name: this.collectionForm.value.nombreColeccion,
      description: this.collectionForm.value.descripcion,
      category: this.collectionForm.value.categoria,
      imageUrl: imageUrl || '' 
    };

    console.log('Enviando datos al backend:', collectionData);

    this.collectionService.createCollection(collectionData).subscribe({
      next: (response) => {
        console.log('Colección creada:', response);
        alert('Colección creada con éxito');
        this.isSubmitting = false;
        this.router.navigate(['/my-collection']);
      },
      error: (error) => {
        console.error('Error al crear colección:', error);
        alert('Error al guardar la colección. Revisa la consola.');
        this.isSubmitting = false;
      }
    });
  }
}