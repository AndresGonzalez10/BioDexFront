import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SpeciesComponent } from './pages/species/species.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, 
  { path: 'species', component: SpeciesComponent },
  { path: '**', redirectTo: '' } 
];