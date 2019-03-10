import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//modules
import { NgbModule }               from '@ng-bootstrap/ng-bootstrap';

import { DevelarCommonsModule }    from '../develar-commons/develar-commons.module';
import { BookshelfModule } from '../bookshelf/bookshelf.module';
import { MinimalRoutingModule } from './minimal-routing.module';
import { LoginModule }  from '../entities/user/login/login.module';
import { ProductModule }  from '../entities/products/product.module';


//site component
import { HomeComponent } from './home/home.component';

import { MinimalistLayoutComponent } from './layouts/minimalist/minimalist.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { LasargenNavbarComponent } from './layouts/lasargen-navbar/lasargen-navbar.component';
import { UtopiasNavbarComponent } from './layouts/utopias-navbar/utopias-navbar.component';
import { TopBrandingComponent } from './top-branding/top-branding.component';
import { TopAboutComponent } from './top-about/top-about.component';
import { TopAboutlrComponent } from './top-about-lr/top-aboutlr.component';

import { SiteMinimalController } from './minimal.controller';
import { HighlightService } from './minimal-highlighter.service';
import { DestacadoComponent } from './destacado/destacado.component';

import { PortfolioTokenComponent } from './portfolio/portfolio-token/portfolio-token.component';
import { TopPortfolioComponent } from './top-portfolio/top-portfolio.component';

import { TopServiciosComponent } from './top-servicios/top-servicios.component';
import { PortfolioPageComponent } from './portfolio/portfolio-page/portfolio-page.component';
import { PortfolioDetailComponent } from './portfolio/portfolio-detail/portfolio-detail.component';

import { TopContactoComponent } from './top-contacto/top-contacto.component';
import { PapersComponent } from './papers/papers.component';
import { DetailCardComponent } from './detail/detail-card/detail-card.component';
import { ShowAssetsComponent } from './detail/show-assets/show-assets.component';
import { ShowResourcesComponent } from './detail/show-resources/show-resources.component';
import { TopCarrouselComponent } from './top-carrousel/top-carrousel.component';
import { TopFooterComponent } from './top-footer/top-footer.component';
import { PbaLayoutComponent } from './layouts/pba-layout/pba-layout.component';
import { PbaNavbarComponent } from './layouts/pba-navbar/pba-navbar.component';
import { HomePbaComponent } from './home-pba/home-pba.component';
import { AntecedentesPageComponent } from './antecedentes/antecedentes-page/antecedentes-page.component';
import { SearchPersonComponent } from './antecedentes/search-person/search-person.component';
import { SearchAntecedentesComponent } from './antecedentes/search-antecedentes/search-antecedentes.component';
import { SearchScoringComponent } from './antecedentes/search-scoring/search-scoring.component';
import { TopFooterPageComponent } from './top-footer-page/top-footer-page.component';
import { PostDetailContainerComponent } from './foros/post-detail-container/post-detail-container.component';
import { PostDetailComponent } from './foros/post-detail/post-detail.component';
import { PostTopContainerComponent } from './foros/post-top-container/post-top-container.component';
import { PostTokenComponent } from './foros/post-token/post-token.component';
import { RegistroContainerComponent } from './registracion/registro-container/registro-container.component';
import { MyproductsPageComponent } from './productos/myproducts-page/myproducts-page.component';
import { PorfolioCarrouselPageComponent } from './portfolio/porfolio-carrousel-page/porfolio-carrousel-page.component';
import { PorfolioCarrouselComponent } from './portfolio/porfolio-carrousel/porfolio-carrousel.component';
import { PortfolioCarrouselComponent } from './portfolio/portfolio-carrousel/portfolio-carrousel.component';




@NgModule({
  imports: [
    MinimalRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DevelarCommonsModule,
    BookshelfModule,
    LoginModule,
    ProductModule
  ],
  declarations: [
  	MinimalistLayoutComponent,
  	HomeComponent,
  	NavbarComponent,
    LasargenNavbarComponent,
    UtopiasNavbarComponent,
    PbaNavbarComponent,
  	TopBrandingComponent,
  	TopAboutComponent,
    TopAboutlrComponent,
  	DestacadoComponent,
    TopFooterComponent,
  	TopServiciosComponent,
    TopPortfolioComponent,
    PortfolioTokenComponent,
    PortfolioPageComponent,
    PortfolioDetailComponent,
  	TopContactoComponent,
  	PapersComponent,
  	DetailCardComponent,
  	ShowAssetsComponent,
  	ShowResourcesComponent,
  	TopCarrouselComponent,
  	PbaLayoutComponent,
  	HomePbaComponent,
  	AntecedentesPageComponent,
  	SearchPersonComponent,
  	SearchAntecedentesComponent,
  	SearchScoringComponent,
  	TopFooterPageComponent,
  	PostDetailContainerComponent,
  	PostDetailComponent,
  	PostTopContainerComponent,
  	PostTokenComponent,
  	RegistroContainerComponent,
  	MyproductsPageComponent,
  	PorfolioCarrouselPageComponent,
  	PorfolioCarrouselComponent,
  	PortfolioCarrouselComponent
  ],
  providers:[
    SiteMinimalController, HighlightService
  ]
})
export class MinimalModule { }
