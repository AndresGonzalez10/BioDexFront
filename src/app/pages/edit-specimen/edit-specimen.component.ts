import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { SpecimenService } from '../../services/specimen.service';

@Component({
  selector: 'app-edit-specimen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavBarComponent
  ],
  templateUrl: './edit-specimen.component.html',
  styleUrls: ['./edit-specimen.component.css']
})
export class EditSpecimenComponent implements OnInit {
  specimen: any;
  specimenId: string | null = null;
  imageUrlBase: string = 'http://34.202.158.56:8080/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private specimenService: SpecimenService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.specimenId = params.get('id');
      if (this.specimenId) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras.state && navigation.extras.state['specimenData']) {
          this.specimen = navigation.extras.state['specimenData'];
          console.log('Specimen data received from router state:', this.specimen);
        } else {
          this.specimenService.getSpecimen(this.specimenId).subscribe({
            next: (data: any) => {
              this.specimen = data;
              console.log('Specimen data fetched from service:', this.specimen);
            },
            error: (error: any) => {
              console.error('Error fetching specimen for edit:', error);
            }
          });
        }
      }
    });
  }

  onFileSelected(event: any) {
    console.log('File selected:', event.target.files[0]);
  }

  onSubmit() {
    if (this.specimen && this.specimenId) {
      const updatedSpecimen: any = { ...this.specimen };

      if (updatedSpecimen.location && typeof updatedSpecimen.location === 'object' && updatedSpecimen.location.id) {
        updatedSpecimen.idLocation = updatedSpecimen.location.id;
        delete updatedSpecimen.location; 
      }
      if (updatedSpecimen.taxonomy && typeof updatedSpecimen.taxonomy === 'object' && updatedSpecimen.taxonomy.id) {
        updatedSpecimen.idTaxonomy = updatedSpecimen.taxonomy.id;
        delete updatedSpecimen.taxonomy; 
      }

      if (updatedSpecimen.collectionDate instanceof Date) {
        updatedSpecimen.collectionDate = updatedSpecimen.collectionDate.toISOString().split('T')[0];
      } else if (typeof updatedSpecimen.collectionDate === 'string' && updatedSpecimen.collectionDate.includes('T')) {
        updatedSpecimen.collectionDate = updatedSpecimen.collectionDate.split('T')[0];
      }

      delete updatedSpecimen.id; 
      delete updatedSpecimen.idCollection; 
      for (let i = 1; i <= 6; i++) {
        const photoKey = `additionalPhoto${i}`;
        if (updatedSpecimen[photoKey] === null || updatedSpecimen[photoKey] === '') {
          delete updatedSpecimen[photoKey];
        }
      }

      console.log('Updating specimen with JSON:', updatedSpecimen);
      this.specimenService.updateSpecimen(this.specimen.id, updatedSpecimen).subscribe({
        next: () => {
          console.log('Specimen updated successfully!');
          this.router.navigate(['/specimens', this.specimen.id]);
        },
        error: (error: any) => {
          console.error('Error updating specimen:', error);
          alert('Error al actualizar el espécimen. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/specimens', this.specimenId]);
  }
}
