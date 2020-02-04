import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { DirectorioComponent } from './components/directorio/directorio.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { BlankComponent } from './components/blank/blank.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { ConsultasComponent } from './components/consultas/consultas.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';

import { 
  GuardService as Guard 
} from '../services/guard.service';
import { 
  RoleGuardService as RoleGuard 
} from '../services/role-guard.service';

const routes: Routes = [
  {
    path: '', 
    component: BlankComponent,
    canActivate: [Guard],  
  },
  {
    path: 'adm/:id', 
    component: AdministracionComponent,
    canActivate: [Guard],
    data: {role: 'Admin'}
  },
  {
    path: 'perfil/:id', 
    component: PerfilComponent,
    canActivate: [Guard],
  },
  {
    path: 'dir/:id', 
    component: DirectorioComponent,
    canActivate: [Guard],
    data: {
      role1: 'Admin'
    }
  },
  {
    path: 'consultas/:id', 
    component: ConsultasComponent,
    canActivate: [Guard],
    data: {
      role1: 'Admin'
    }
  },
  {
    path: 'agenda/:id', 
    component: AgendaComponent,
    canActivate: [Guard],
    data: {
      role1: 'Admin'
    }
  },
  {
    path: 'preguntas/:id', 
    component: PreguntasComponent,
    canActivate: [Guard],
    data: {
      role1: 'Admin'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {

  constructor(
  ) {

	}

 }
