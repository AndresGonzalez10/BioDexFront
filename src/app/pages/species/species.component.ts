import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpecimenService } from '../../services/specimen.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { lastValueFrom, Observable } from 'rxjs';
import { TaxonomyService } from '../../services/taxonomy.service';
import { LocationService } from '../../services/location.service';

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
  
  nombreComun: string = '';
  fechaColeccion: Date = new Date();
  colector: string = '';
  cantidadIndividuos: number = 1;
  idCollection: number = 1;
  anioDeterminacion: number = 2023;
  determinador: string = '';
  sexo: string = 'No especificado';
  tipoVegetacion: string = '';
  metodoColecta: string = '';
  notas: string = '';
  familia: string = '';
  genero: string = '';
  especie: string = '';
  categoria: string = '';
  pais: string = '';
  estado: string = '';
  municipio: string = '';
  localidad: string = '';
  latitudGrados: number = 0;
  latitudMinutos: number = 0;
  latitudSegundos: number = 0;
  longitudGrados: number = 0;
  longitudMinutos: number = 0;
  longitudSegundos: number = 0;
  altitud: number = 0;
  apiConnected: boolean = false;
  connectionMessage: string = '';
  showMessage: boolean = false;
  collectionId: string | null = null;
  isSubmitting: boolean = false;
  specimenId: string | null = null;
  isEditMode: boolean = false;
  idLocation: number | null = null;
  selectedFile: File | null = null;  imageUrl: string | ArrayBuffer | null = null;
  mainPhotoFileName: string | null = null;
  selectedFile1: File | null = null; imageUrl1: string | ArrayBuffer | null = null;
  imageUrl1FileName: string | null = null;
  selectedFile2: File | null = null; imageUrl2: string | ArrayBuffer | null = null;
  imageUrl2FileName: string | null = null;
  selectedFile3: File | null = null; imageUrl3: string | ArrayBuffer | null = null;
  imageUrl3FileName: string | null = null;
  selectedFile4: File | null = null; imageUrl4: string | ArrayBuffer | null = null;
  imageUrl4FileName: string | null = null;
  selectedFile5: File | null = null; imageUrl5: string | ArrayBuffer | null = null;
  imageUrl5FileName: string | null = null;
  selectedFile6: File | null = null; imageUrl6: string | ArrayBuffer | null = null;
  imageUrl6FileName: string | null = null;

  private readonly API_BASE_URL = 'http://34.202.158.56:8080';

  constructor(
    private fb: FormBuilder,
    private specimenService: SpecimenService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private http: HttpClient, 
    private taxonomyService: TaxonomyService,
    private locationService: LocationService
  ) {
    this.specieForm = this.fb.group({
      nombreComun: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('collectionId');
      if (this.collectionId) {
        this.idCollection = Number(this.collectionId);
      }

      this.specimenId = params.get('specimenId');
      if (this.specimenId) {
        this.isEditMode = true;
        this.loadSpecimenForEdit(this.specimenId);
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

  async loadSpecimenForEdit(id: string): Promise<void> {
    try {
      const specimen = await lastValueFrom(this.specimenService.getSpecimen(id));
      
      this.nombreComun = specimen.commonName;
      this.fechaColeccion = new Date(specimen.collectionDate);
      this.colector = specimen.collector;
      this.cantidadIndividuos = specimen.individualsCount;
      this.anioDeterminacion = specimen.determinationYear;
      this.determinador = specimen.determinador;
      this.sexo = specimen.sex;
      this.tipoVegetacion = specimen.vegetationType;
      this.metodoColecta = specimen.collectionMethod;
      this.notas = specimen.notes;
      this.idCollection = specimen.idCollection;
      const taxonomy = await lastValueFrom(this.taxonomyService.getTaxonomyById(specimen.idTaxonomy));
      this.familia = taxonomy.family;
      this.genero = taxonomy.genus;
      this.especie = taxonomy.species;
      this.categoria = taxonomy.category;
      const location = await lastValueFrom(this.locationService.getLocationById(specimen.idLocation));
      this.idLocation = specimen.idLocation; 
      this.pais = location.country;
      this.estado = location.state;
      this.municipio = location.municipality;
      this.localidad = location.locality;
      this.latitudGrados = location.latitude_degrees;
      this.latitudMinutos = location.latitude_minutes;
      this.latitudSegundos = location.latitude_seconds;
      this.longitudGrados = location.longitude_degrees;
      this.longitudMinutos = location.longitude_minutes;
      this.longitudSegundos = location.longitude_seconds;
      this.altitud = location.altitude;

      if (specimen.mainPhoto) {
        this.imageUrl = specimen.mainPhoto;
        this.mainPhotoFileName = this.getFileNameFromUrl(specimen.mainPhoto);
      }
      if (specimen.additionalPhoto1) {
        this.imageUrl1 = specimen.additionalPhoto1;
        this.imageUrl1FileName = this.getFileNameFromUrl(specimen.additionalPhoto1);
      }
      if (specimen.additionalPhoto2) {
        this.imageUrl2 = specimen.additionalPhoto2;
        this.imageUrl2FileName = this.getFileNameFromUrl(specimen.additionalPhoto2);
      }
      if (specimen.additionalPhoto3) {
        this.imageUrl3 = specimen.additionalPhoto3;
        this.imageUrl3FileName = this.getFileNameFromUrl(specimen.additionalPhoto3);
      }
      if (specimen.additionalPhoto4) {
        this.imageUrl4 = specimen.additionalPhoto4;
        this.imageUrl4FileName = this.getFileNameFromUrl(specimen.additionalPhoto4);
      }
      if (specimen.additionalPhoto5) {
        this.imageUrl5 = specimen.additionalPhoto5;
        this.imageUrl5FileName = this.getFileNameFromUrl(specimen.additionalPhoto5);
      }
      if (specimen.additionalPhoto6) {
        this.imageUrl6 = specimen.additionalPhoto6;
        this.imageUrl6FileName = this.getFileNameFromUrl(specimen.additionalPhoto6);
      }

    } catch (error) {
      console.error('Error al cargar el espécimen para edición:', error);
      alert('Error al cargar los datos del espécimen.');
      this.router.navigate(['/specimens/collection', this.collectionId]); 
    }
  }

    getFileNameFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split('/');
      return pathSegments[pathSegments.length - 1];
    } catch (e) {
      console.error("Error parsing URL for filename:", e);
      return url; 
    }
  }

  onFileSelected(event: Event, imageVarName: string): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result;
        if (imageVarName === 'imageUrl') { this.selectedFile = file; this.imageUrl = result; this.mainPhotoFileName = file.name; }
        else if (imageVarName === 'imageUrl1') { this.selectedFile1 = file; this.imageUrl1 = result; this.imageUrl1FileName = file.name; }
        else if (imageVarName === 'imageUrl2') { this.selectedFile2 = file; this.imageUrl2 = result; this.imageUrl2FileName = file.name; }
        else if (imageVarName === 'imageUrl3') { this.selectedFile3 = file; this.imageUrl3 = result; this.imageUrl3FileName = file.name; }
        else if (imageVarName === 'imageUrl4') { this.selectedFile4 = file; this.imageUrl4 = result; this.imageUrl4FileName = file.name; }
        else if (imageVarName === 'imageUrl5') { this.selectedFile5 = file; this.imageUrl5 = result; this.imageUrl5FileName = file.name; }
        else if (imageVarName === 'imageUrl6') { this.selectedFile6 = file; this.imageUrl6 = result; this.imageUrl6FileName = file.name; }
      };
      reader.readAsDataURL(file);
    }
  }


  async uploadFileToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${this.API_BASE_URL}/upload?folder=specimens`;
    
    try {
      const response = await lastValueFrom(this.http.post<any>(url, formData));
      return response.url;
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      throw error;
    }
  }

  async getOrCreateTaxonomyId(): Promise<number> {
    try {
      const taxonomy = await lastValueFrom(this.taxonomyService.getTaxonomyByAttributes(
        this.familia, this.genero, this.especie, this.categoria
      ));
      return taxonomy.id;
    } catch (error: any) {
      if (error.status === 404) {
        const newTaxonomy = await lastValueFrom(this.taxonomyService.createTaxonomy({
          family: this.familia,
          genus: this.genero,
          species: this.especie,
          category: this.categoria
        }));
        return newTaxonomy.id;
      }
      throw error; 
    }
  }

  async getOrCreateLocationId(): Promise<number> {
    if (this.isEditMode && this.idLocation) {
      const updatedLocationData = {
        country: this.pais,
        state: this.estado,
        municipality: this.municipio,
        locality: this.localidad,
        latitude_degrees: this.latitudGrados,
        latitude_minutes: this.latitudMinutos,
        latitude_seconds: this.latitudSegundos,
        longitude_degrees: this.longitudGrados,
        longitude_minutes: this.longitudMinutos,
        longitude_seconds: this.longitudSegundos,
        altitude: this.altitud
      };
      console.log('Modo edición: Actualizando ubicación con ID:', this.idLocation, 'Datos:', updatedLocationData);
      await lastValueFrom(this.locationService.updateLocation(this.idLocation, updatedLocationData));
      console.log('Ubicación actualizada correctamente.');
      return this.idLocation;
    }

    try {
      const location = await lastValueFrom(this.locationService.getLocationByAttributes(
        this.pais, this.estado, this.municipio, this.localidad,
        this.latitudGrados, this.latitudMinutos, this.latitudSegundos,
        this.longitudGrados, this.longitudMinutos, this.longitudSegundos,
        this.altitud
      ));
      return location.id;
    } catch (error: any) {
      if (error.status === 404) {
        const newLocation = await lastValueFrom(this.locationService.createLocation({
          country: this.pais,
          state: this.estado,
          municipality: this.municipio,
          locality: this.localidad,
          latitude_degrees: this.latitudGrados,
          latitude_minutes: this.latitudMinutos,
          latitude_seconds: this.latitudSegundos,
          longitude_degrees: this.longitudGrados,
          longitude_minutes: this.longitudMinutos,
          longitude_seconds: this.longitudSegundos,
          altitude: this.altitud
        }));
        return newLocation.id;
      }
      throw error;
    }
  }

  async onSubmit() {
    this.isSubmitting = true;

    try {
      let mainPhotoUrl = null;
      if (this.selectedFile) {
        mainPhotoUrl = await this.uploadFileToCloudinary(this.selectedFile);
      } else {
        mainPhotoUrl = null; 
      }

      let url1 = null; if (this.selectedFile1) url1 = await this.uploadFileToCloudinary(this.selectedFile1);
      let url2 = null; if (this.selectedFile2) url2 = await this.uploadFileToCloudinary(this.selectedFile2);
      let url3 = null; if (this.selectedFile3) url3 = await this.uploadFileToCloudinary(this.selectedFile3);
      let url4 = null; if (this.selectedFile4) url4 = await this.uploadFileToCloudinary(this.selectedFile4);
      let url5 = null; if (this.selectedFile5) url5 = await this.uploadFileToCloudinary(this.selectedFile5);
      let url6 = null; if (this.selectedFile6) url6 = await this.uploadFileToCloudinary(this.selectedFile6);

      const formattedDate = this.fechaColeccion ? new Date(this.fechaColeccion).toISOString().split('T')[0] : '';

      const taxonomyId = await this.getOrCreateTaxonomyId();
      const locationId = await this.getOrCreateLocationId();

      const payload = {
        idCollection: Number(this.idCollection),
        commonName: this.nombreComun,
        idTaxonomy: taxonomyId,
        idLocation: locationId,
        collectionDate: formattedDate,
        collector: this.colector,
        individualsCount: Number(this.cantidadIndividuos),
        determinationYear: Number(this.anioDeterminacion),
        determinador: this.determinador,
        sex: this.sexo,
        vegetationType: this.tipoVegetacion,
        collectionMethod: this.metodoColecta,
        notes: this.notas,
        mainPhoto: mainPhotoUrl,
        additionalPhoto1: url1,
        additionalPhoto2: url2,
        additionalPhoto3: url3,
        additionalPhoto4: url4,
        additionalPhoto5: url5,
        additionalPhoto6: url6
      };

      console.log('Enviando JSON:', payload);

      let operation: Observable<any>;
      if (this.isEditMode && this.specimenId) {
        operation = this.specimenService.updateSpecimen(Number(this.specimenId), payload);
      } else {
        operation = this.specimenService.uploadSpecimen(payload);
      }

      operation.subscribe({
        next: (response) => {
          alert(`¡Espécimen ${this.isEditMode ? 'actualizado' : 'guardado'} con éxito!`);
          this.router.navigate(['/specimens', response.id]);
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