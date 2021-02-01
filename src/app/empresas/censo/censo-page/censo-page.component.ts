import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';

import { UserService } from '../../../entities/user/user.service';

import { EmpresasController } from '../../empresas.controller';
import { CensoIndustriasController } from '../../censo.controller';
import { CensoIndustriasService, UpdateListEvent } from '../../censo-service';

import { CardGraph } from '../../../develar-commons/asset-helper';
import { User } from '../../../entities/user/user';
import {  Person,
          Address,
          FamilyData,
          BusinessMembersData,
          OficiosData,
          SaludData,
          CoberturaData,
          EncuestaAmbiental,
          personModel,

          UpdatePersonEvent,
          UpdateItemListEvent,

          PersonContactData 
        } from '../../../entities/person/person';


import {  CensoIndustrias, 
          CensoActividad,
          CensoComercializacion,
          CensoBienes } from '../../censo.model';

import { Audit, ParentEntity } from '../../../develar-commons/observaciones/observaciones.model';


const UPDATE = 'update';
const NAVIGATE = 'navigate';
const ACTUAL_CENSO = "censo:industrias:2020:00";

@Component({
  selector: 'app-censo-page',
  templateUrl: './censo-page.component.html',
  styleUrls: ['./censo-page.component.scss']
})
export class CensoPageComponent implements OnInit {
  private unBindList = [];

  // template helper
  public title = "Censo Industrias 2020 - MAB";
  public subtitle = "Datos generales";

  //CensoIndustrias
  public currentCenso: CensoIndustrias;
  private censoId: string;
  public hasCurrentCenso = false;

  //Actividades
  public hasActividades = false;
  public actividades: CensoActividad[] = [];

  //Actividades
  public hasBienes = false;
  public bienes: CensoBienes[] = [];

  //Comercializacion
  public hasComercializacion = false;
  public comercializacion: CensoComercializacion[] = [];



  // Block SaludData
  public censoHeaderTitleTxt = "MUNICIPALIDAD DE ALMIRANTE BROWN - SECRETARÍA DE PRODUCCIÓN";
  public censoAltaTxt = "INICIE EL CENSO AQUÍ";
  public censoBajada = "CENSO INDUSTRIAL 2020";

  public censoEditHeaderTxt = "Edición de datos Básicos";

  private currentIndustry: Person;
  private contactList:   PersonContactData[];
  private addressList:   Address[];
  private familyList:    FamilyData[];
  private businessList:  BusinessMembersData[];
  private oficiosList:   OficiosData[];
  private saludList:     SaludData[];
  private coberturaList: CoberturaData[];
  private ambientalList: EncuestaAmbiental[];

  public hasCurrentPerson = false;
  public personFound = false;
  public altaPersona = false;
  private personId: string;

  public isAutenticated = false;
  private count = 0;
  public openEditor = false;
  public showData = false;
  
  public audit: Audit;
  public parentEntity: ParentEntity;
  public hasObservaciones = false;
  public observacionesOptListType = 'censo';

  public assetList:     CardGraph[] = []



  constructor(
    	private router: Router,
    	private route: ActivatedRoute,
      private censoCtrl: CensoIndustriasController,
      private empCtrl: EmpresasController,
      private _userService: UserService
  	) { }

  ngOnInit() {
    let first = true;    
    //this.censoId = this.route.snapshot.paramMap.get('id')

    this.empCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    let sscrp2 = this.empCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;
        this.lookUpActiveCenso();

      }
    })
    this.unBindList.push(sscrp2);
  }

  ngOnDestroy(){
    this.unBindList.forEach(x => {x.unsubscribe()});
  }



  private initCurrentPage(){

    let sscrp3 = this.empCtrl.personListener.subscribe(p => {
      if(p){
        this.initCurrentIndustry(p);

      }else{
        // ToDo.... qué pasa si no hay una Person activa?
      }
    })

    let sscrp4 = this.censoCtrl.censoListener.subscribe(censo => {
      if(censo){

        this.initCurrentCenso(censo);

      }else{
        // ToDo.... qué pasa si no hay una Person activa?
      }
    })

    this.unBindList.push(sscrp3);
    this.unBindList.push(sscrp4);
  
  }

  private lookUpActiveCenso(){
    console.log('lookUpActive Censo - TO BEGIN')
    this.showData = false;

    this._userService.userEmitter.subscribe((user: User) => {
      if(user && user._id){

        console.log('User encontrado: [%s] [%s]', user.username, user.isUsuarioWeb);
        this.empCtrl.fetchIndustriaFromUser(user).subscribe(industria =>{

          if(industria){
            this.currentIndustry = industria;
            this.censoCtrl.currentIndustry = this.currentIndustry;

            this.initCurrentIndustry(this.currentIndustry)

            let query = {
              search: 'actual:censo',
              empresaId: this.currentIndustry._id,
              codigo: ACTUAL_CENSO
            }
        
            this.censoCtrl.fetchCensoByQuery(query).subscribe(list => {
              console.log('lookUpActiveCenso [%s]', list && list.length)

              if(list && list.length){
                this.initCurrentCenso(list[0])
                this.showData = true;  
              }else{
                this.hasActividades = false;
                this.hasBienes = false;
                this.hasCurrentCenso = false;
                this.showData = true;
              }

            })
          }else{
            // Error: no hay industria no hay censo creado aún
          }

        })
            
      }else {
        // todo
      }
    })

  }




  private initCurrentCenso(censo: CensoIndustrias){
    this.hasActividades = false;
    this.hasBienes = false;
    this.hasComercializacion = false;

    if(censo && censo._id){
      console.log('CurrentCenso LOADED: [%s] [%s]', censo.empresa && censo.empresa.slug, censo.compNum);
      this.censoId = censo._id;
      this.currentCenso = censo;

      this.actividades = censo.actividades || [];
      this.initActividades(this.actividades);

      this.bienes = censo.bienes || [];
      this.initBienes(this.bienes);

      this.comercializacion = censo.comercializacion || [];
      this.initComercializacion(this.comercializacion);

      this.refreshCenso(censo);

      this.audit = this.censoCtrl.getUserData();
      this.parentEntity = this.censoCtrl.parentEntity(censo);
      this.hasObservaciones = this.parentEntity ? true : false;

      this.assetList = censo.assets || [];


    } else{
      this.hasCurrentCenso = false;

    }

  }

  private initActividades(actividades: CensoActividad[]){
    if(actividades ){
      this.hasActividades = true;
    }
  }

  private initBienes(bienes: CensoBienes[]){
    if(bienes ){
      this.hasBienes = true;
    }
  }

  private initComercializacion(comercializacion: CensoComercializacion[]){
    if(comercializacion ){
      this.hasComercializacion = true;
    }
  }

  private refreshCenso(censo){
    this.hasCurrentCenso = true;
  }


  private initCurrentIndustry(p: Person){
    if(p){
      console.log('initCurrentIndustry: [%s] [%s]', p.displayName, p._id);
      this.personId = p._id;
      this.currentIndustry = p;
      //this.contactData = p.contactdata[0];
      this.contactList =   p.contactdata || [];
      this.addressList =   p.locaciones || [];
      this.familyList  =   p.familiares || [];
      this.businessList =  p.integrantes || [];
      this.oficiosList =   p.oficios || [];
      this.saludList =     p.salud || [];
      this.coberturaList = p.cobertura || [];
      this.ambientalList = p.ambiental || [];

      this.hasCurrentPerson = true;

      //this.fetchActiveCenso(p);
      
    }
    // todo: Search For S/Asistencias
  }

  private fetchActiveCenso(p: Person){
    this.censoCtrl.fetchActiveCensoFromOrganisation(p._id);
  }


  /**********************/
  /*      Events        */
  /**********************/
  updateCore(e){
    //this.router.navigate(['/mab/comercios/empresa', e.person._id]);    
  }

  navigateToProfile(e: UpdatePersonEvent){
    if(e.action === NAVIGATE){
      this.router.navigate(['/mab/comercios/empresa', e.person._id]);    
    }

  }

  editCensoHeader(e){
    this.upsertCensoIndustrias();

  }

  updateActividadesList(event: UpdateListEvent){
    console.log('Actividades BUBBLED')

    if(event.action === UPDATE){
      this.updateActividades(event);
    }
  }

  private updateActividades(event: UpdateListEvent){
    this.currentCenso.actividades = event.items as CensoActividad[];
    this.censoCtrl.partialUpdateCenso(this.currentCenso).subscribe(censo =>{
      if(censo) this.currentCenso = censo;
    })
  }


  updateBienesList(event: UpdateListEvent){
    console.log('Bienes BUBBLED')

    if(event.action === UPDATE){
      this.updateBienes(event);
    }
  }

  private updateBienes(event: UpdateListEvent){
    this.currentCenso.bienes = event.items as CensoBienes[];
    this.censoCtrl.partialUpdateCenso(this.currentCenso).subscribe(censo =>{
      if(censo) this.currentCenso = censo;
    })
  }

  updateComercializacionList(event: UpdateListEvent){
    console.log('Comercializacion BUBBLED')

    if(event.action === UPDATE){
      this.updateComercializacion(event);
    }
  }

  private updateComercializacion(event: UpdateListEvent){
    this.currentCenso.comercializacion = event.items as CensoComercializacion[];
    this.censoCtrl.partialUpdateCenso(this.currentCenso).subscribe(censo =>{
      if(censo) this.currentCenso = censo;
    })
  }

  /**********************/
  /*      Person        */
  /**********************/
  loadPerson(id?){
    if(id){
      this.empCtrl.setCurrentPersonFromId(id);

    }else{
      this.empCtrl.setCurrentPersonFromUser();
      
    }
  }

  /************************/
  /*     Censo           */
  /**********************/
  private upsertCensoIndustrias(){
    if(this.currentCenso && this.censoId){
      console.log('update')
      ///dashboard/censos/censo2020/core
      this.router.navigate(['../core', this.censoId], {relativeTo: this.route})

    }else{
      console.log('create: Ready to Navigate')
      this.router.navigate(['../core'], {relativeTo: this.route})

    }
  }

  /************************/
  /*     Assets           */
  /**********************/
  updateAssetList(event:UpdateListEvent){
    if(event.action === UPDATE){
      this.upsertAssetlList(event);
    }
  }

  private upsertAssetlList(event:UpdateListEvent){
    this.currentCenso.assets = event.items as CardGraph[];
    this.censoCtrl.partialUpdateCenso(this.currentCenso).subscribe(censo =>{
      if(censo) this.currentCenso = censo;
    })

  }



}



/***
http://develar-local.co:4200/mab/empresas/inicio/5e52cc650dbe2f1ac00d5c38
http://develar-local.co:4200/mab/empresas/gestion/registro/5e52cc650dbe2f1ac00d5c38

http://develar-local.co:4200/mab/comercios/registro/5da4df4b1cd64809a3f18861

http://develar-local.co:4200/dsocial/gestion/atencionsocial/59701fab9c481d0391eb39b9
http://develar-local.co:4200/dsocial/gestion/atencionsocial/5a00cb6c3ba0cd0c576a1870

https://api.brown.gob.ar/empleados?legajo=5765

https://api.brown.gob.ar/

**/
