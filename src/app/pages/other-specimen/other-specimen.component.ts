import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpecimenService } from '../../services/specimen.service';
import { CollectionService } from '../../services/collection.service';
import { CommonModule } from '@angular/common';
import { SpecimenCardComponent } from '../../core/components/specimen-card/specimen-card.component';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { AuthService } from '../../core/services/auth.service';

interface Specimen {
  id: number;
  commonName: string;
  scientificName: string;
  collectionDate: string;
  mainPhoto: string | null;
  collector: string;
  locationName: string;  
  individualsCount: number;
  determinationYear: number;
  determinador: string;
  sex: string;
  vegetationType: string;
  collectionMethod: string;
  notes: string | null;
  additionalPhoto1?: string;
  additionalPhoto2?: string;
  additionalPhoto3?: string;
  additionalPhoto4?: string;
  additionalPhoto5?: string;
  additionalPhoto6?: string;
}

interface TaxonomyType {
  family: string;
  genus: string;
  species: string;
  category: string;
}

interface LocationType {
  country: string;
  state: string;
  municipality: string;
  locality: string;
  latitude_degrees: number;
  latitude_minutes: number;
  latitude_seconds: number;
  longitude_degrees: number;
  longitude_minutes: number;
  longitude_seconds: number;
  altitude: number;
}

interface Specimen {
  id: number;
  commonName: string;
  collectionDate: string;
  mainPhoto: string | null;
  collector: string;
  individualsCount: number;
  determinationYear: number;
  determinador: string;
  sex: string;
  vegetationType: string;
  collectionMethod: string;
  notes: string | null;
  taxonomy: TaxonomyType;
  location: LocationType; 
  additionalPhoto1?: string;
  additionalPhoto2?: string;
  additionalPhoto3?: string;
  additionalPhoto4?: string;
  additionalPhoto5?: string;
  additionalPhoto6?: string;
}

@Component({
  selector: 'app-other-specimen',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SpecimenCardComponent,
    FormsModule,
    NavBarComponent,
  ],
  templateUrl: './other-specimen.component.html',
  styleUrl: './other-specimen.component.css'
})
export class OtherSpecimenComponent implements OnInit {
  specimens: any[] = [];
  filteredSpecimens: any[] = [];
  searchTerm: string = '';
  collectionId: string | null = null;
  specimenId: string | null = null;
  
  specimen: Specimen | null = null; 

  constructor(
    private specimenService: SpecimenService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private collectionService: CollectionService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.collectionId = params.get('collectionId');
      this.specimenId = params.get('id');
      this.loadData();
    });
  }

  loadData(): void {
    console.log('loadData() called');
    const currentUser = this.authService.currentUser();

    if (this.specimenId) {
      this.specimenService.getSpecimen(this.specimenId).subscribe({
        next: (data: any) => {
          this.specimen = data;
          console.log("Espécimen cargado:", this.specimen);
        },
        error: (error: any) => {
          console.error('Error al cargar espécimen:', error);
          this.specimen = null;
        }
      });
    } else if (this.collectionId) {
      this.specimenService.getSpecimensByCollectionId(this.collectionId).subscribe({
        next: (data: any[]) => {
          this.specimens = data;
          this.filteredSpecimens = data;
        },
        error: (error: any) => {
          console.error('Error al cargar por colección:', error);
        }
      });
    } else if (currentUser && currentUser.id) {
      this.specimenService.getOtherUsersSpecimens(currentUser.id).subscribe({
        next: (data: any[]) => {
          this.specimens = data;
          this.filteredSpecimens = data;
        },
        error: (error: any) => {
          console.error('Error al cargar especímenes de otros usuarios:', error);
        }
      });
    } else {
      console.log('Usuario no autenticado o ID de usuario no disponible.');
      this.specimens = [];
    }
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value.toLowerCase();
    this.filterSpecimens();
  }

  filterSpecimens(): void {
    if (this.searchTerm) {
      this.filteredSpecimens = this.specimens.filter(specimen =>
        specimen.commonName.toLowerCase().includes(this.searchTerm) 
      );
    } else {
      this.filteredSpecimens = this.specimens;
    }
  }

  goToRequestForm(): void {
    if (this.specimen) {
      this.router.navigate(['/solicitud-forms'], { state: { specimenData: this.specimen } });
    } else {
      this.router.navigate(['/solicitud-forms']); 
    }
  }

  onSpecimenSelected(specimenId: string): void {
    this.router.navigate(['/other-specimens', specimenId]);
  }
}
