/*******************************************
*  PRODUCT product Product
*/

export interface LocacionEvent {
    action: string;
    type: string;
    token?: LocacionHospitalaria;
    items?: LocacionHospitalaria[];
};

export interface OcupacionHospitalariaEvent {
  action: string;
  type: string;
  token?: OcupacionHospitalaria;
  items?: OcupacionHospitalaria[];
};

export class Address {
    _id?: string;
    slug: string = '';
    estado: string = 'activo';
    isDefault: boolean = false;
    addType: string = 'principal';

    street1: string = '';
    street2: string = '';
    streetIn: string = '';
    streetOut: string = '';

    city: string = '';
    barrio?: string = '';
    state: string = '';
    statetext:string= '';

    zip: string = '';
    lat: number = 0;
    lng: number = 0;

    country: string = 'AR';
}

export class Servicio {
    srvorder: string = ''
    srvIsActive: boolean = true;
    
    srvtype: string = '';
    srvcode: string = '';
    
    srvQDisp: number = 0;
    srvQAdic: number = 0;
    
    srvCapacidad?: string = '';
}

export class Recurso {
    _id?: string;
    rtype: string = 'cama'; // cama; repirador;
    rservicio: string = 'uti'
    //ubicacion
    piso: string = "PISO-1"; // piso o nivel
    sector: string = "SEC-1"; // sector / area / sala
    hab: string = "HAB-1"; //sala o habitacion
    code: string = '';
    slug: string = '';
    description: string = '';

    estado: string = 'activo';
}


export class LocacionHospitalaria {
  _id:         string;
  code:        string = "";
  slug:        string = "";
  fecha_tx:    string;

  type:        string = 'HOSP' // Hospital

 
  description: string = "";

  estado:      string = "activo";
  ts_alta:     number = 0;
  ts_umodif:   number = 0;

  ubicacion: Address;
  servicios: Servicio[] = [];
  recursos: Recurso[];

  constructor(){

  }
}


export class OcupacionHospitalaria {
  _id:         string;
  slug:        string = "";
  fecha_tx:    string;
  fecha_ts:    number;

  estado:      string = "activo";
  ts_alta:     number = 0;
  ts_umodif:   number = 0;

  servicios: OcupacionXServicio[] = [];

}

export class OcupacionXServicio {
  // ocupacionFe: string = "";
  // ocupacionFets: number = 0;
  // ocupacionId: string = "";

  locId: string = "";
  locCode: string = "";
  locType: string = 'HOSPAPROV' // Hospital PROVINCIAL
  
  srvtype: string = '';
  srvcode: string = '';
  
  srvQDisp: number = 0;
  srvQOcup: number = 0;
  srvPOcup: number = 0;
  
  constructor(locacion?: LocacionHospitalaria){
    if(locacion){
      this.locId = locacion._id;
      this.locCode = locacion.code;
      this.locType = locacion.type;
    }
  }
}

export class OcupacionHospitalariaTable {
  _id:         string;
  slug:        string = "";
  fecha_tx:    string;
  fecha_ts:    number;

  estado:      string = "activo";
  ts_alta:     number = 0;
  ts_umodif:   number = 0;
  
  qlocaciones: number = 0; 
  pOcupUTI:    number = 0; 
  pOcupUTE:    number = 0; 
  pOcupAMB:    number = 0;
}

export class OcupacionHospitalariaBrowse {
  slug:        string = "";
  fecha_tx:    string;
  fecha_ts:    number;
  estado:      string = "activo";
}



export class LocacionHospTable {
  _id:         string; 
  code:        string = "";
  slug:        string = "";
  fecha_tx:    string;

  type:        string = 'HOSP' // Hospital
  description: string = "";

  estado:      string = "activo";
  ts_alta:     number = 0;
  ts_umodif:   number = 0;
}

export class LocacionHospBrowse {
  code:        string = "";
  slug:        string = "";
  type:        string = "";
  searchAction: string = "";
}

