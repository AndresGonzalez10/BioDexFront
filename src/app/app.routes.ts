import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SpeciesComponent } from './pages/species/species.component';
import { ColectionR } from './pages/colection-r/colection-r';
import { Collections } from './pages/collections/collections';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Register2 } from './pages/register/register2/register2'
import { Mainview } from './pages/mainview/mainview';
import { CollectionMain } from './pages/collection-main/collection-main';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, 
  { path: 'species', component: SpeciesComponent },
  { path: 'collectionr', component: ColectionR },
  { path: 'collections',component: Collections },
  { path: 'login',component: Login},
  { path: 'register',component: Register},
  { path: 'register2',component: Register2},
  { path: 'mainview', component: Mainview},
  { path: 'collection', component: CollectionMain},
  { path: '**', redirectTo: '' } 
];