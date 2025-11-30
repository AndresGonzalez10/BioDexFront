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
  imageUrlBase: string = 'http://localhost:8060/';

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
      const formData = new FormData();

      for (const key in this.specimen) {
        if (Object.prototype.hasOwnProperty.call(this.specimen, key) &&
            typeof this.specimen[key] !== 'object' &&
            key !== 'id' && key !== 'idCollection') { 
          formData.append(key, this.specimen[key]);
        }
      }

      if (this.specimen.taxonomy) {
        formData.append('taxonomy', JSON.stringify(this.specimen.taxonomy));
      }
      if (this.specimen.location) {
        formData.append('location', JSON.stringify(this.specimen.location));
      }
      if (this.specimen.mainPhoto) {
        formData.append('mainPhoto', this.specimen.mainPhoto);
      }

      console.log('Updating specimen with FormData:', formData);
      this.specimenService.updateSpecimen(this.specimen.id, formData).subscribe({
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
