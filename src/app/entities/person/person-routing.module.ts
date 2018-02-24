import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonCreateComponent } from './person-create/person-create.component';
import { PersonComponent }       from './person/person.component';
import { PersonEditComponent }       from './person-edit/person-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PersonComponent,
    pathMatch: 'full'
  },
  {
    path: 'alta',
    component: PersonCreateComponent,
  },
  {
    path: ':id',
    component: PersonEditComponent,
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule { }
