import { Component, OnInit, Output, Inject, Input, EventEmitter} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import { Person, Address, UpdatePersonEvent, PersonContactData, personModel } from '../../../entities/person/person';
import { PersonService } from '../../../salud/person.service';
import { InternacionService } from '../../../salud/internacion/internacion.service';

import { 	SolicitudInternacion, MotivoInternacion,
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					MasterAllocation,UpdateInternacionEvent,MasterSelectedEvent } from '../../../salud/internacion/internacion.model';

import { InternacionHelper }  from '../../../salud/internacion/internacion.helper';
import { LocacionHospitalaria} from '../../../entities/locaciones/locacion.model';

const CREATE =   'create';
const UPDATE =   'update';
const CANCEL =   'cancel';
const SELECTED = 'selected';

const NAVIGATE = 'navigate';
const SERVICIO_DEFAULT = "INTERNACION"

const SEARCH_LOCACION = 'search_locacion';
const NEXT = 'next';

const TOKEN_TYPE = 'asistencia';


@Component({
  selector: 'ilocacion-alta',
  templateUrl: './ilocacion-alta.component.html',
  styleUrls: ['./ilocacion-alta.component.scss']
})
export class IlocacionAltaComponent implements OnInit {
	public  person: Person;
	private hasPerson = false;
  public title = 'Alta de Solicitud de Internacion';

  public solInternacion: SolicitudInternacion;
  private hasSolicitud = false;
  public isInvalidForEdit = true;
  public actionTxt = 'Se creará una nueva solicitud de internación'
  public locacion: LocacionHospitalaria;

  public masterSelected: MasterAllocation;

  public triage: MotivoInternacion;
  public internacion: Internacion;

  private servicio = SERVICIO_DEFAULT;

	public showEditor = false;
	public showView = false;
  public confirmaInternacion = false;

  public showTriageEditor = false;
  public hasSolInternacion = false;

  public showMasterAllocator = false;
  public queryMaster = {};

  public finalStep = false;

  public searchPerson = true;



  constructor(
  		private perSrv: PersonService,
      private intSrv: InternacionService,
      public dialogRef: MatDialogRef<IlocacionAltaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
  	) { }

  ngOnInit() {
  	this.person = new Person('alta rápida', '');
    this.locacion = this.data.locacion;
  }

  /************************************/
  /******* Template Events *******/
  /**********************************/
  // STEP-1: Persona Creada
  personFetched(person: Person){
    this.person = person;
    this.hasPerson = true;
    this.fetchSolInternacion(this.person, true); // no genera la solinternacion

  }

  // STEP-2: CREA /EDITA SOL ASISTENCIA
  confirmaActualizarInternacionEvent(action){
    this.confirmaInternacion = false;
    if(action === NEXT){
      this.fetchSolInternacion(this.person, false);

    }else{
      this.resetProcess(null)
    }
  }

  // STEP-3: TRIAGE ESTABLECIDO
  internacionEvent(event: UpdateInternacionEvent){
      this.resetProcess(UPDATE)    
  }


  triageEvent(event: UpdateInternacionEvent){
    if(event.action === SEARCH_LOCACION){
      this.triage = event.token as MotivoInternacion;
      this.saveSolicitud()


    }else if(event.action === NEXT ){
      this.triage = event.token as MotivoInternacion;
      this.saveSolicitud()


    }else if(event.action === CANCEL ){
      this.resetProcess(null)

    }

  }


  /***************************************************/
  /******* Solicitud de Intervención  Manager *******/
  /*************************************************/
  /***************************************************/
  /******* Solicitud de Intervención  Manager *******/
  /*************************************************/
  private fetchSolInternacion(person: Person, dry: boolean){
    this.intSrv.fetchInternacionesByPersonId(person._id).subscribe(list => {
      if(list && list.length){
        this.solInternacion = list[0];
        this.hasSolicitud = true;
        this.handleSolicitudInternacion(dry)

      }else {
        this.hasSolicitud = false;
        this.solInternacion = null;
        this.initNewIntervencion(this.person, this.servicio, dry)
      }
    })
  }

  private canEditSolicitud(sinternacion: SolicitudInternacion){
    if(!sinternacion.internacion) return true;
    if(sinternacion.queue === 'pool' || sinternacion.queue === 'transito' ) return true;
    return false;
  }

  private handleSolicitudInternacion(dry: boolean){
    this.isInvalidForEdit = true;
    if(dry){
      if(this.hasSolicitud){
        if(this.canEditSolicitud(this.solInternacion)) this.isInvalidForEdit = false;

      }else{
        this.isInvalidForEdit = false;

      }

      this.actionTxt = this.hasSolicitud ? 
              'Solicitud existente': 'Se creará una nueva solicitud de internación'

      this.confirmaInternacion = true;
      this.showView = true;

    }else{
      this.servicio = SERVICIO_DEFAULT;
      this.triage = this.solInternacion.triage || new MotivoInternacion({servicio: this.servicio});
      this.triage.transitType = 'pool:servicio';
      this.internacion = this.solInternacion.internacion || new Internacion();

      this.internacion.locId =   this.locacion._id;
      this.internacion.locCode = this.locacion.code;
      this.internacion.locSlug = this.locacion.slug;

      this.solInternacion.triage =   this.triage;
      this.internacion.servicio =    this.triage.servicio;
      this.internacion.slug =        this.triage.slug;
      this.internacion.description = this.triage.description;

      this.triageStep() // STEP 3
    }
  }

  private triageStep(){
    this.showTriageEditor = true;
  }


  private initNewIntervencion(person: Person, servicio: string, dry: boolean){
    if(dry){
      this.handleSolicitudInternacion(dry)
      return
    }

    let spec = new InternacionSpec();
    
    spec.servicio = servicio|| spec.servicio;

    this.intSrv.createNewSolicitudInternacion(spec, person).subscribe(sol => {
      if(sol){
        this.solInternacion = sol;
        this.handleSolicitudInternacion(dry)

      }else {
        //c onsole.log('fallo la creación de solicitud')
      }
    })

  }


  private saveSolicitud(){
    if(this.triage){
      this.intSrv.asignarPool(this.solInternacion, this.triage).subscribe(sol =>{
        if(sol){
          this.solInternacion = sol;
          this.intSrv.openSnackBar('Grabación exitosa', 'CERRAR')
          this.resetProcess({process: 'ok'})
          // reset TODO
        }else{
          this.intSrv.openSnackBar('Se produjo un error en la actualización del dato', 'CERRAR')
          // reset TODO CANCEL
        }
      }) 
    }
  }


  /************************************/
  /******* Template Helpers *******/
  /**********************************/

  private resetProcess(result: any){
    this.showView = false;

    this.solInternacion = null;
    this.hasSolicitud = false;

    this.person = null;
    this.hasPerson = false;

		this.dialogRef.close(result);

  }

}
