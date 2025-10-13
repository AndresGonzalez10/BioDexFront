import { Routes } from '@angular/router';
// Asegúrate de que esta ruta de importación sea correcta
import { LandingPageComponent } from './pages/landing-page/landing-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Muestra la LandingPage en la raíz
  // { path: 'otro', component: OtroComponent }, // Ejemplo de otra ruta
  { path: '**', redirectTo: '' } // Redirige cualquier ruta no encontrada a la raíz
];