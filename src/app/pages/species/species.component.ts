import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecimenService } from '../../services/specimen.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Importante HttpClient
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { lastValueFrom } from 'rxjs'; // Importante para convertir Observables a Promesas

@Component({
  selector: 'app-registro-especimen',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, HttpClientModule],
  providers: [DatePipe],
  templateUrl: './species.component.html',
  styleUrl: './species.component.css'
})
export class SpeciesComponent implements OnInit, OnDestroy {
  specieForm: FormGroup;
  
  // Variables de datos (usadas en tu HTML con ngModel)
  nombreComun: string = 'Mariposa';
  fechaColeccion: Date = new Date();
  colector: string = 'Dr. Juan Pérez';
  cantidadIndividuos: number = 1;
  idCollection: number = 1;
  idTaxonomy: number = 1;
  idLocation: number = 1;
  anioDeterminacion: number = 2023;
  determinador: string = 'Dr. Smith';
  sexo: string = 'No especificado';
  tipoVegetacion: string = 'Bosque';
  metodoColecta: string = 'Red entomológica';
  notas: string = 'Ninguna';
  
  // Variables de estado
  apiConnected: boolean = false;
  connectionMessage: string = '';
  showMessage: boolean = false;
  collectionId: string | null = null;
  isSubmitting: boolean = false;

  // Variables de Imágenes (Mantenemos tu estructura)
  selectedFile: File | null = null;  imageUrl: string | ArrayBuffer | null = null;
  selectedFile1: File | null = null; imageUrl1: string | ArrayBuffer | null = null;
  selectedFile2: File | null = null; imageUrl2: string | ArrayBuffer | null = null;
  selectedFile3: File | null = null; imageUrl3: string | ArrayBuffer | null = null;
  selectedFile4: File | null = null; imageUrl4: string | ArrayBuffer | null = null;
  selectedFile5: File | null = null; imageUrl5: string | ArrayBuffer | null = null;
  selectedFile6: File | null = null; imageUrl6: string | ArrayBuffer | null = null;

  // Variables extras que tenías (aunque no se usen en el submit actual, las dejo)
  altitud: string = ''; longitudMinutos: string = ''; longitudSegundos: string = '';
  latitudSegundos: string = ''; longitudGrados: string = ''; latitudGrados: string = '';
  latitudMinutos: string = ''; municipio: string = ''; localidad: string = '';
  pais: string = ''; estado: string = ''; especie: string = '';
  categoria: string = ''; familia: string = ''; genero: string = '';

  // URL Base para subir a Cloudinary
  private readonly API_BASE_URL = 'http://localhost:8060';

  constructor(
    private fb: FormBuilder,
    private specimenService: SpecimenService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private http: HttpClient // Inyectamos HTTP para la subida de fotos
  ) {
    // Inicializamos el form group aunque uses ngModel en el HTML (según tu código anterior)
    this.specieForm = this.fb.group({
      nombreComun: ['', Validators.required],
      // ... resto de validadores ...
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('collectionId');
      if (this.collectionId) {
        this.idCollection = Number(this.collectionId);
      }
    });
    this.checkApiConnection();
  }

  ngOnDestroy(): void {}

  checkApiConnection(): void {
    this.specimenService.checkConnection().subscribe({
      next: () => {
        this.apiConnected = true;
        this.connectionMessage = 'Conectado a la API correctamente.';
      },
      error: () => {
        this.apiConnected = false;
        this.connectionMessage = 'Error de conexión.';
      }
    });
  }

  // Lógica de selección de archivos (Igual que antes)
  onFileSelected(event: Event, imageVarName: string): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result;
        // Asignamos según el nombre de variable
        if (imageVarName === 'imageUrl') { this.selectedFile = file; this.imageUrl = result; }
        else if (imageVarName === 'imageUrl1') { this.selectedFile1 = file; this.imageUrl1 = result; }
        else if (imageVarName === 'imageUrl2') { this.selectedFile2 = file; this.imageUrl2 = result; }
        else if (imageVarName === 'imageUrl3') { this.selectedFile3 = file; this.imageUrl3 = result; }
        else if (imageVarName === 'imageUrl4') { this.selectedFile4 = file; this.imageUrl4 = result; }
        else if (imageVarName === 'imageUrl5') { this.selectedFile5 = file; this.imageUrl5 = result; }
        else if (imageVarName === 'imageUrl6') { this.selectedFile6 = file; this.imageUrl6 = result; }
      };
      reader.readAsDataURL(file);
    }
  }

  // --- NUEVA LÓGICA DE SUBIDA ---

  async uploadFileToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    // Subimos a la carpeta 'specimens'
    const url = `${this.API_BASE_URL}/upload?folder=specimens`;
    
    try {
      const response = await lastValueFrom(this.http.post<any>(url, formData));
      return response.url;
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  }

  async onSubmit() {
    this.isSubmitting = true;

    try {
      // 1. Subir Foto Principal
      let mainPhotoUrl = null;
      if (this.selectedFile) {
        mainPhotoUrl = await this.uploadFileToCloudinary(this.selectedFile);
      } else {
        // Si no seleccionó foto, puedes mandar null o la foto por defecto
        mainPhotoUrl = null; 
      }

      // 2. Subir Fotos Adicionales (secuencial o paralelo)
      let url1 = null; if (this.selectedFile1) url1 = await this.uploadFileToCloudinary(this.selectedFile1);
      let url2 = null; if (this.selectedFile2) url2 = await this.uploadFileToCloudinary(this.selectedFile2);
      let url3 = null; if (this.selectedFile3) url3 = await this.uploadFileToCloudinary(this.selectedFile3);
      let url4 = null; if (this.selectedFile4) url4 = await this.uploadFileToCloudinary(this.selectedFile4);
      let url5 = null; if (this.selectedFile5) url5 = await this.uploadFileToCloudinary(this.selectedFile5);
      let url6 = null; if (this.selectedFile6) url6 = await this.uploadFileToCloudinary(this.selectedFile6);

      // 3. Armar el JSON (CreateSpecimenRequest)
      const formattedDate = this.fechaColeccion ? new Date(this.fechaColeccion).toISOString().split('T')[0] : '';

      const payload = {
        // Datos
        idCollection: Number(this.idCollection),
        commonName: this.nombreComun,
        idTaxonomy: Number(this.idTaxonomy),
        idLocation: Number(this.idLocation),
        collectionDate: formattedDate,
        collector: this.colector,
        individualsCount: Number(this.cantidadIndividuos),
        determinationYear: Number(this.anioDeterminacion),
        determinador: this.determinador,
        sex: this.sexo,
        vegetationType: this.tipoVegetacion,
        collectionMethod: this.metodoColecta,
        notes: this.notas,

        // URLs de Cloudinary
        mainPhoto: mainPhotoUrl,
        additionalPhoto1: url1,
        additionalPhoto2: url2,
        additionalPhoto3: url3,
        additionalPhoto4: url4,
        additionalPhoto5: url5,
        additionalPhoto6: url6
      };

      console.log('Enviando JSON:', payload);
      this.specimenService.uploadSpecimen(payload).subscribe({
        next: (response) => {
          alert('¡Espécimen guardado con éxito!');
          this.router.navigate(['/specimens/collection', this.collectionId]);
        },
        error: (error) => {
          console.error('Error backend:', error);
          alert('Error al guardar datos: ' + JSON.stringify(error));
          this.isSubmitting = false;
        }
      });

    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      alert('Error al subir las imágenes a Cloudinary.');
      this.isSubmitting = false;
    }
  }
}