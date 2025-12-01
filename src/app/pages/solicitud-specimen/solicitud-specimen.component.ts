import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';



@Component({
  selector: 'app-solicitud-specimen',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NavBarComponent],
  templateUrl: './solicitud-specimen.component.html',
  styleUrls: ['./solicitud-specimen.component.css']
})
export class SolicitudSpecimenComponent implements OnInit {
  solicitud = {
    especieSolicitada: 'Aulacophora femoralis',
    tipoSolicitud: 'Información',
    solicitadoPor: 'Cesar Yair Toledo Villarreal',
    institucion: 'Universidad Politécnica de Chiapas',
    fechaSolicitud: '23/10/2025',
    descripcion: 'Descripción de la solicitud',
    imagenUrl: 'assets/beetle.jpg'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
    }
  }

  aceptarSolicitud() {
    console.log('Solicitud aceptada');
    this.router.navigate(['/requets']);
  }

  rechazarSolicitud() {
    console.log('Solicitud rechazada');
    this.router.navigate(['/requets']);
  }

  verPerfil() {
    console.log('Ver perfil del solicitante');
  }

  volver() {
    this.router.navigate(['/requets']);
  }
}