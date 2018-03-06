import { NgModule } from '@angular/core';
import { Routes, RouterModule }  from '@angular/router';

import { BookshelfComponent }    from './bookshelf/bookshelf.component';
import { UnitcardComponent }     from './unitcard/unitcard.component';

import { CardsviewlistComponent }  from './cardsviewlist/cardsviewlist.component';
import { CardsviewgridComponent }  from './cardsviewgrid/cardsviewgrid.component';

import { UnitcardviewComponent } from './unitcardview/unitcardview.component';
import { UnitcardeditComponent } from './unitcardedit/unitcardedit.component';
import { InputDemoComponent }    from './input-demo/input-demo.component';
import { ShowviewComponent }        from './showview/showview.component';
import { GraphcontrollerComponent } from './cardgraphcontroller/graphcontroller.component';
import { ProjectDashboardComponent } from './workgroup/project-dashboard/project-dashboard.component';
import { ProjectProductComponent }    from './workgroup/project-product/project-product.component';

const routes: Routes = [
	{
		path:'',
		component: BookshelfComponent,
		pathMatch: 'full'

	},
	{
		path:'followup/:id/productos',
		component: ProjectProductComponent
	},
	{
		path:'followup/:id',
		component: ProjectDashboardComponent
	},
	{
		path:'grid/:id',
		component: UnitcardeditComponent
	},
	{
		path:'grid',
		component: CardsviewgridComponent
	},
	{
		path:'lista',
		component: CardsviewlistComponent
	},
	{
		path:'editar/:id',
		component: UnitcardeditComponent
	},
	{
		path:'alta',
		component: UnitcardComponent
	},
	{
		path:'show/:id',
		component: ShowviewComponent
	},

	{
		path:':id',
		component: UnitcardviewComponent
	}


];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookshelfRoutingModule { }
