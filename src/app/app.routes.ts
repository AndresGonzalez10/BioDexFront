import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SpeciesComponent } from './pages/species/species.component';
import { ColectionR } from './pages/colection-r/colection-r';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, 
  { path: 'species', component: SpeciesComponent },
  { path: 'colection', component: ColectionR },
  { path: '**', redirectTo: '' } 
];