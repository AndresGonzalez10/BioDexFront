import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


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
  imageUrlBase: string = 'http://localhost:8060/';

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log('ngOnInit de SolicitudFormsComponent ejecutado.');
    const state = history.state;
    console.log('Contenido de history.state:', state);

    if (state && state['specimenData']) {
      this.specimen = state['specimenData'];
      console.log('Specimen data received from history.state:', this.specimen);
      console.log('Specimen mainPhoto from history.state:', this.specimen?.mainPhoto);
      if (this.specimen && this.specimen.commonName) {
        this.especieSolicitada = this.specimen.commonName;
      }
    } else {
      console.warn('No specimen data found in history.state.');
    }
  }

  onSubmit() {
    if (this.descripcion.trim()) {
      console.log('Solicitud enviada:', {
        especie: this.especieSolicitada,
        descripcion: this.descripcion
      });
    }
  }
}
