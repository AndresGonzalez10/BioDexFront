import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecimenService } from '../../services/specimen.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-registro-especimen',
  standalone: true,
  imports: [CommonModule, FormsModule, NavBarComponent, HttpClientModule],
  providers: [DatePipe],
  templateUrl: './species.component.html',
  styleUrl: './species.component.css'
})
export class SpeciesComponent implements OnInit {
  specieForm: FormGroup;
  imageUrl: string | null = null;
  nombreComun: string = 'Mariposa';
  fechaColeccion: Date = new Date();
  mainPhoto: string = 'assets/logo1.png';
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
  apiConnected: boolean = false;
  connectionMessage: string = '';
  showMessage: boolean = false;
  selectedFile: File | null = null;
  selectedFile1: File | null = null;
  imageUrl1: string | ArrayBuffer | null = null;
  selectedFile2: File | null = null;
  imageUrl2: string | ArrayBuffer | null = null;
  selectedFile3: File | null = null;
  imageUrl3: string | ArrayBuffer | null = null;
  selectedFile4: File | null = null;
  imageUrl4: string | ArrayBuffer | null = null;
  selectedFile5: File | null = null;
  imageUrl5: string | ArrayBuffer | null = null;
  selectedFile6: File | null = null;
  imageUrl6: string | ArrayBuffer | null = null;
  altitud: string = ''; 
  longitudMinutos: string = '';
  longitudSegundos: string = '';
  latitudSegundos: string = '';
  longitudGrados: string = '';
  latitudGrados: string = '';
  latitudMinutos: string = '';
  municipio: string = '';
  localidad: string = '';
  pais: string = '';
  estado: string = '';
  especie: string = '';
  categoria: string = '';
  familia: string = '';
  genero: string = '';
  collectionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private specimenService: SpecimenService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute
  ) {
    console.log('SpeciesComponent constructor called');
    this.specieForm = this.fb.group({
      nombreComun: ['', Validators.required],
      fechaColeccion: [new Date(), Validators.required],
      mainPhoto: [null],
      colector: ['', Validators.required],
      individualsCount: [1, Validators.required],
      idCollection: [null, Validators.required],
      idTaxonomy: [1, Validators.required],
      idLocation: [1, Validators.required],
      determinationYear: [2023, Validators.required],
      determinador: ['', Validators.required],
      sex: ['', Validators.required],
      vegetationType: ['', Validators.required],
      collectionMethod: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    console.log('SpeciesComponent ngOnInit called');
    this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('collectionId');
      if (this.collectionId) {
        this.specieForm.patchValue({ idCollection: this.collectionId });
      }
    });
    this.checkApiConnection();
  }

  ngOnDestroy(): void {
    console.log('SpeciesComponent ngOnDestroy called');
  }

  checkApiConnection(): void {
    this.specimenService.checkConnection().subscribe({
      next: () => {
        this.apiConnected = true;
        this.connectionMessage = 'Conectado a la API correctamente.';
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        }, 3000); 
      },
      error: (error: any) => {
        this.apiConnected = false;
        this.connectionMessage = 'Error al conectar con la API. Asegúrate de que el backend esté funcionando.';
        this.showMessage = true; 
        console.log('Error al verificar la conexión de la API:', error);
      }
    });
  }

  onFileSelected(event: Event, imageVarName: string): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log('Original file size:', file.size, 'bytes');
      if (imageVarName === 'imageUrl') {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          if (imageVarName === 'imageUrl1') {
            this.selectedFile1 = file;
            this.imageUrl1 = reader.result;
          } else if (imageVarName === 'imageUrl2') {
            this.selectedFile2 = file;
            this.imageUrl2 = reader.result;
          } else if (imageVarName === 'imageUrl3') {
            this.selectedFile3 = file;
            this.imageUrl3 = reader.result;
          } else if (imageVarName === 'imageUrl4') {
            this.selectedFile4 = file;
            this.imageUrl4 = reader.result;
          } else if (imageVarName === 'imageUrl5') {
            this.selectedFile5 = file;
            this.imageUrl5 = reader.result;
          } else if (imageVarName === 'imageUrl6') {
            this.selectedFile6 = file;
            this.imageUrl6 = reader.result;
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onSubmit(): void {
    const formattedCollectionDate = this.fechaColeccion ? new Date(this.fechaColeccion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    console.log('Valor de individuos:', this.cantidadIndividuos);
    console.log('Valor de anioDeterminacion:', this.anioDeterminacion);
    const formData = new FormData();
    formData.append('commonName', this.nombreComun);
    formData.append('collectionDate', this.datePipe.transform(this.fechaColeccion, 'yyyy-MM-dd') || '');
    if (this.selectedFile) {
      formData.append('mainPhoto', this.selectedFile, this.selectedFile.name);
    }
    if (this.selectedFile1) {
      formData.append('additionalPhoto1', this.selectedFile1, this.selectedFile1.name);
    }
    if (this.selectedFile2) {
      formData.append('additionalPhoto2', this.selectedFile2, this.selectedFile2.name);
    }
    if (this.selectedFile3) {
      formData.append('additionalPhoto3', this.selectedFile3, this.selectedFile3.name);
    }
    if (this.selectedFile4) {
      formData.append('additionalPhoto4', this.selectedFile4, this.selectedFile4.name);
    }
    if (this.selectedFile5) {
      formData.append('additionalPhoto5', this.selectedFile5, this.selectedFile5.name);
    }
    if (this.selectedFile6) {
      formData.append('additionalPhoto6', this.selectedFile6, this.selectedFile6.name);
    }
    formData.append('collector', this.colector);
    formData.append('individualsCount', this.cantidadIndividuos.toString());
    formData.append('idCollection', this.collectionId || ''); 
    formData.append('idTaxonomy', '1'); 
    formData.append('idLocation', '1');
    formData.append('determinationYear', this.anioDeterminacion.toString());
    formData.append('determinador', this.determinador);
    formData.append('sex', this.sexo);
    formData.append('vegetationType', this.tipoVegetacion);
    formData.append('collectionMethod', this.metodoColecta);
    formData.append('notes', this.notas);

    console.log('Datos a enviar:', formData);

    this.specimenService.uploadSpecimen(formData).subscribe({
      next: (response: any) => {
        console.log('Especimen subido con éxito', response);
        alert('Especimen subido con éxito: ' + JSON.stringify(response));
        this.router.navigate(['/specimens/collection', this.collectionId]); 
      },
      error: (error: any) => {
        console.error('Error al subir el especimen', error);
        alert('Error al subir el especimen: ' + JSON.stringify(error));
      }
    });
  }
}