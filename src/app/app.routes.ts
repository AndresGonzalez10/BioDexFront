import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SpeciesComponent } from './pages/species/species.component';
import { CollectionCreateComponent } from './pages/colection-r/colection-r';
import { CollectionR } from './pages/collections/collections';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { MyCollectionComponent } from './pages/my-collection/my-collection';
import { Register2 } from './pages/register/register2/register2';
import { Mainview } from './pages/mainview/mainview';
import { CollectionMain } from './pages/collection-main/collection-main';
import { ExposMain } from './pages/expos-main/expos-main';
import { RequetsMain } from './pages/requets-main/requets-main';
import { MyExpos } from './pages/my-expos/my-expos';
import { OtherExpos } from './pages/other-expos/other-expos';
import { ExpoR } from './pages/expo-r/expo-r';
import { Exposition } from './pages/exposition/exposition';
import { SpecimenComponent } from './pages/specimen/specimen.component';
import { SolicitudModuleComponent } from './pages/solicitud-module/solicitud-module.component';
import { SolicitudAceptadaComponent } from './pages/solicitud-aceptada/solicitud-aceptada.component';
import { SolicitudRechazadaComponent } from './pages/solicitud-rechazada/solicitud-rechazada.component';
import { SolicitudPendienteComponent } from './pages/solicitud-pendiente/solicitud-pendiente.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SolicitudFormsComponent } from './pages/solicitud-forms/solicitud-forms';
import {SolicitudSpecimenComponent} from './pages/solicitud-specimen/solicitud-specimen.component';
import { EditSpecimenComponent } from './pages/edit-specimen/edit-specimen.component';
import { OtherSpecimenComponent } from './pages/other-specimen/other-specimen.component';
import { OtherExposition } from './pages/other-exposition/other-exposition';


export const routes: Routes = [
  { path: '', component: LandingPageComponent }, 
  { path: 'species', component: SpeciesComponent },
  { path: 'collections', component: CollectionCreateComponent },
  { path: 'collectionr',component: CollectionR },
  { path: 'my-collection', component: MyCollectionComponent },
  { path: 'login',component: Login},
  { path: 'register',component: Register},
  { path: 'register2',component: Register2},
  { path: 'mainview', component: Mainview},
  { path: 'collection', component: CollectionMain},
  { path: 'expos', component: ExposMain},
  { path: 'requets', component: RequetsMain},
  { path: 'myexpos', component: MyExpos},
  { path: 'otherexpos', component: OtherExpos},
  { path: 'expor', component: ExpoR},
  { path: 'exposition/:id', component: Exposition},
  { path: 'other-exposition/:id', component: OtherExposition},
  { path: 'solicitud', component: SolicitudModuleComponent},
  { path: 'solicitud-aceptada', component: SolicitudAceptadaComponent},
  { path: 'solicitud-rechazada', component: SolicitudRechazadaComponent},
  { path: 'solicitud-pendiente', component: SolicitudPendienteComponent},
  { path: 'perfil', component: PerfilComponent},
  { path: 'solicitud-forms', component: SolicitudFormsComponent},
  { path: 'solicitud-specimen', component: SolicitudSpecimenComponent},
  { path: 'edit-specimen/:id', component: EditSpecimenComponent},

  { path: 'specimens/:id', component: SpecimenComponent },
  { path: 'specimens/collection/:collectionId', component: SpecimenComponent },
  { path: 'specimens', component: SpecimenComponent },
  { path: 'other-specimens/:id', component: OtherSpecimenComponent },
  { path: 'other-specimens/collection/:collectionId', component: OtherSpecimenComponent },
  { path: 'other-specimens', component: OtherSpecimenComponent },
  { path: 'add-specimen/:collectionId', component: SpeciesComponent },
  { path: '**', redirectTo: '' }
];