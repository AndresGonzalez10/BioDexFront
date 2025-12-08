import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../services/request.service';
import { AuthService } from '../../core/services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ManagerIdService } from '../../core/services/manager-id.service';

@Component({
  selector: 'app-solicitud',
  imports: [NavBarComponent, FormsModule, CommonModule],
  standalone: true,
  templateUrl: './solicitud-forms.html',
  styleUrls: ['./solicitud-forms.css']
})
export class SolicitudFormsComponent implements OnInit {

  especieSolicitada: string = 'Aulacophora femoralis';
  descripcion: string = '';
  specimen: any;
  imageUrlBase: string = 'http://34.202.158.56:8080/';

  constructor(
    private router: Router,
    private requestService: RequestService,
    private authService: AuthService,
    private managerIdService: ManagerIdService  
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit de SolicitudFormsComponent ejecutado.');

    const state = history.state;
    console.log('Contenido de history.state:', state);

    if (state && state['specimenData']) {
      this.specimen = state['specimenData'];
      console.log('Specimen recibido:', this.specimen);
      console.log('Foto principal:', this.specimen?.mainPhoto);

      if (this.specimen?.commonName) {
        this.especieSolicitada = this.specimen.commonName;
      }

    } else {
      console.warn('No specimen data found in history.state.');
    }
  }

  onSubmit() {

    if (this.descripcion.trim() && this.specimen) {

      const managerId = this.managerIdService.getManagerId();
      const specimenId = this.specimen.id;
      const description = this.descripcion;
      const requestType = 'INFORMATION';

      console.log("Enviando solicitud con: ", {
        managerId,
        specimenId,
        description,
        requestType
      });

      this.requestService.sendSpecimenRequest(
        managerId,
        specimenId,
        description,
        requestType
      )
      .pipe(
        catchError(error => {
          console.error('Error al enviar la solicitud:', error);
          alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.');
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('Solicitud enviada con éxito:', response);
          alert('Solicitud enviada con éxito!');
          this.router.navigate(['/requests']);
        }
      });

    } else {
      alert('Por favor, ingresa una descripción y asegúrate de que los datos del espécimen estén disponibles.');
    }
  }
}
