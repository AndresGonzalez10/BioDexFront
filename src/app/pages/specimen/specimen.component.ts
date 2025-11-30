import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpecimenService } from '../../services/specimen.service';
import { CommonModule } from '@angular/common';
import { SpecimenCardComponent } from '../../core/components/specimen-card/specimen-card.component';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-specimen',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SpecimenCardComponent,
    FormsModule,
    NavBarComponent,
  ],
  templateUrl: './specimen.component.html',
  styleUrl: './specimen.component.css'
})
export class SpecimenComponent implements OnInit {
  specimens: any[] = [];
  filteredSpecimens: any[] = [];
  searchTerm: string = '';
  collectionId: string | null = null;
  specimenId: string | null = null;
  specimen: any;
  imageUrlBase: string = 'http://localhost:8060/';

  constructor(
    private specimenService: SpecimenService,
    private router: Router,
    private route: ActivatedRoute
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
    if (this.specimenId) {
      this.specimenService.getSpecimen(this.specimenId).subscribe({
        next: (data: any) => {
          this.specimen = data;
        },
        error: (error: any) => {
          console.error(' Error al cargar el espécimen individual:', error);
          this.specimen = null;
        }
      });
    } else if (this.collectionId) {
      this.specimenService.getSpecimensByCollectionId(this.collectionId).subscribe({
        next: (data: any[]) => {
          this.specimens = data;
          this.filteredSpecimens = data;
          console.log('Especímenes cargados por colección:', data);
        },
        error: (error: any) => {
          console.error('Error al cargar especímenes por colección:', error);
        }
      });
    } else {
      this.specimenService.getSpecimens().subscribe({
        next: (data: any[]) => {
          this.specimens = data;
          this.filteredSpecimens = data;
          console.log('Todos los especímenes cargados:', data);
        },
        error: (error: any) => {
          console.error('Error al cargar todos los especímenes:', error);
        }
      });
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
        specimen.name.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredSpecimens = this.specimens;
    }
  }

  goToAddSpecimen(): void {
    this.router.navigate(['/add-specimen', this.collectionId]);
  }

  goToRequestForm(): void {
    if (this.specimen) {
      const specimenToPass = { ...this.specimen };
      if (specimenToPass.mainPhoto && specimenToPass.mainPhoto.endsWith('.jp')) {
        specimenToPass.mainPhoto = specimenToPass.mainPhoto + 'g'; // Append 'g' to make it '.jpg'
      }
      this.router.navigate(['/solicitud-forms'], { state: { specimenData: specimenToPass } });
    } else {
      console.warn('No specimen data available to pass to the request form.');
      this.router.navigate(['/solicitud-forms']); // Navigate anyway, but without data
    }
  }

  deleteSpecimen(): void {
    if (this.specimen && confirm('¿Estás seguro de que quieres eliminar este espécimen?')) {
      this.specimenService.deleteSpecimen(this.specimen.id).subscribe({
        next: () => {
          console.log('Espécimen eliminado con éxito.');
          this.router.navigate(['/specimens']); // Navegar de vuelta a la lista de especímenes
        },
        error: (error: any) => {
          console.error('Error al eliminar el espécimen:', error);
          alert('Error al eliminar el espécimen. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }

  goToEditSpecimen(): void {
    if (this.specimen) {
      const specimenToPass = { ...this.specimen };
      if (specimenToPass.mainPhoto && specimenToPass.mainPhoto.endsWith('.jp')) {
        specimenToPass.mainPhoto = specimenToPass.mainPhoto + 'g'; // Append 'g' to make it '.jpg'
      }
      this.router.navigate(['/edit-specimen', this.specimen.id], { state: { specimenData: specimenToPass } });
    } else {
      console.warn('No specimen data available to pass to the edit form.');
    }
  }
}