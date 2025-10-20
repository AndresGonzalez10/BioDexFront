import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SpycesComponent } from './pages/spyces/spyces.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, 
  { path: 'spyces', component: SpycesComponent },
  { path: '**', redirectTo: '' } 
];