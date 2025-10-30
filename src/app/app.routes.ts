import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SpeciesComponent } from './pages/species/species.component';
import { ColectionR } from './pages/colection-r/colection-r';
import { Collections } from './pages/collections/collections';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, 
  { path: 'species', component: SpeciesComponent },
  { path: 'collectionr', component: ColectionR },
  { path: 'collections',component: Collections },
  { path: '**', redirectTo: '' } 
];