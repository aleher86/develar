import { devutils } from '../develar-commons/utils';
import { Person, CoberturaData }  from '../entities/person/person';
import { CardGraph } from '../develar-commons/asset-helper';
import { MaterialSolicitado } from '../entities/consultas/consulta.model';



export class Empresa {
		empresaId:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
};

export class Responsable {
		responsableId:   string; 
		slug: string; 
		tdoc: string; 
		ndoc: string; 
};

export interface EstadoCenso {
	estado: string;
	navance: string;
	isCerrado: boolean;
	ts_alta: number;
	ts_umodif: number;
	fecierre_txa: string;
	fecierre_tsa: number;
	cerradoPor: Responsable;
}

export class CensoData {
	codigo: string = 'censo:industrias:2020:00';
	type: string =  'censo:anual'
	anio: number = 2020;
	q: string = 'q1';
	sector: string = 'produccion';
	slug: string = 'Censo Industrias - MAB 2020'
}

export class CensoActividad {
	_id?: string;
	type: string;
	level: number; //porcentaje de la facturación o la inversión
	codigo: string ;
	seccion: string;
	rubro: string;
	slug: string;
	rol: string;
	anio: number;
}

export class MercadoSumario {
	total: Mercado;
	local: Mercado;
	externo: Mercado;
	ventasLoc: number = 0;
	ventasExt: number = 0;
	comprasLoc: number = 0;
	comprasExt: number = 0;

	balanzaComMonto: number =0;
	balanzaComProp: number =0;

	balanzaVtaProp: number =0;
	balanzaImpProp: number =0;
	constructor(){
		this.total = new Mercado();
        this.total.target = 'TOTAL:';
        this.total.slug = 'Total compras y ventas'
		this.local = new Mercado();
		this.local.target = 'LOCAL';
		this.local.slug = 'Total compras y ventas mercado local';
		this.externo = new Mercado();
		this.externo.target = 'EXTERIOR';
		this.externo.slug = 'Total compras y ventas mercado externo';
	}

}


export class Mercado {
	target: string; // browr, pba, pais, brasil, mercosur, etc.
	isLocal: boolean = true;
	propVentas: number = 0; //proporción relativa de ventas
	propCompras: number = 0; //proporción relativa de ventas
	montoVentas: number = 0; //proporción relativa de ventas
	montoCompras: number = 0; //proporción relativa de ventas
	slug: string = ''; //proporción relativa de ventas
}
const mercadosOptList = [
	{val: 'brown',        isLocal: true,  label: 'Partido Almte Brown',  slug: 'Partido Almte Brown' },
	{val: 'pba',          isLocal: true,  label: 'Pcia de Buenos Aires', slug: 'Pcia de Buenos Aires' },
	{val: 'nacional',     isLocal: true,  label: 'Nacional',         slug: 'Nacional' },
	{val: 'brasil',       isLocal: false, label: 'Brasil',           slug: 'Brasil' },
	{val: 'mercosur',     isLocal: false, label: 'Mercosur',         slug: 'Mercosur' },
	{val: 'america',      isLocal: false, label: 'Región América',   slug: 'Región América' },
	{val: 'europa',       isLocal: false, label: 'EU',               slug: 'EU' },
	{val: 'resto',        isLocal: false, label: 'Otras regiones',   slug: 'Otras regiones' },
]

export class CensoComercializacion{
	_id?: string;
	type: string = 'comercializacion';
	slug: string = 'Modos de comercialización y marketing';

	mercados: Array<Mercado> = [];
	//exportaciones - importaciones || exportaciones/importaciones %
	balanzaComMonto: number = 0;
	balanzaComProp: number = 0;

	//comprasLoc - comprasImport || comprasLoc/comprasImp %
	balanzaImpProp: number = 0;
	balanzaImpMonto: number = 0;

	hasPlanAumentoExpo: boolean = false;
	planAumentoExpo: string = '';

	hasPlanPartFeriaInt: boolean = false;
	hasPlanPartFeriaLoc: boolean = false;
	hasPlanInvestigMerc: boolean = false;
	hasPlanRepresExt: boolean = false;
	hasOtrosPlanes: boolean = false;

	hasPlanSustImpo: boolean = false;
	planSustImpo: string = '';

	// proporción canales comercialización
	propComerPropia: number = 0;
	propComerMayor: number = 0;
	propComerMinor: number = 0;
	propComerDigital: number = 0;
	constructor(){
		this.mercados = mercadosOptList.map(t => {
			let m = new Mercado();
			m.target = t.val;
			m.isLocal = t.isLocal;
			return m;
		})
	}

	
}

export class CensoInversion{
	_id?: string;
	type: string = 'comercializacion';
	slug: string = 'Modos de comercialización y marketing';

	mercados: Array<Mercado> = [];
	//exportaciones - importaciones || exportaciones/importaciones %
	balanzaComMonto: number = 0;
	balanzaComProp: number = 0;

	//comprasLoc - comprasImport || comprasLoc/comprasImp %
	balanzaImpProp: number = 0;
	balanzaImpMonto: number = 0;

	hasPlanAumentoExpo: boolean = false;
	planAumentoExpo: string = '';

	hasPlanPartFeriaInt: boolean = false;
	hasPlanPartFeriaLoc: boolean = false;
	hasPlanInvestigMerc: boolean = false;
	hasPlanRepresExt: boolean = false;
	hasOtrosPlanes: boolean = false;

	hasPlanSustImpo: boolean = false;
	planSustImpo: string = '';

	// proporción canales comercialización
	propComerPropia: number = 0;
	propComerMayor: number = 0;
	propComerMinor: number = 0;
	propComerDigital: number = 0;
	constructor(){
		this.mercados = mercadosOptList.map(t => {
			let m = new Mercado();
			m.target = t.val;
			m.isLocal = t.isLocal;
			return m;
		})
	}
	
}

export class CensoRecursosHumanos {
	_id?: string;
	type: string;
	slug: string;
}
	

export class CensoExpectativas {
	_id?: string;
	type: string;
	slug: string;
}
	


export class CensoProductos {
	_id?: string;
	type: string;
	slug: string;
	
	tactividad: string;
	actividadId: string;
	parancelaria: string ;

	isProdpropia: boolean = false;
	cenproductivo: string ;

	isImportada: boolean = false;
	origen: string;

	isExportable: boolean = false;
	exportableTxt: string;
	propExportada: number; // todo


	isSustituible: boolean = false;
	sustituibleTxt: string;

	isInnovacion: boolean = false;
	innovacionTxt: string;

	anio: number;
	destino: string; // destino de la produccion opciones ídem origen
	capainstalada: string; // unidades año
	capautilizada: string; // unidades año

	competencia: string;
	competenciaTxt: string;
	competenciaOrigen: string;


	level: number; //porcentaje de la facturación o la inversión

}

export class CensoBienes {
	_id?: string;
	type: string;
	slug: string;
	
	tactividad: string;
	actividadId: string;
	parancelaria: string ;

	isProdpropia: boolean = false;
	cenproductivo: string ;

	isImportada: boolean = false;
	origen: string;

	isExportable: boolean = false;
	exportableTxt: string;
	propExportada: number; // todo


	isSustituible: boolean = false;
	sustituibleTxt: string;

	isInnovacion: boolean = false;
	innovacionTxt: string;

	anio: number;
	destino: string; // destino de la produccion opciones ídem origen
	capainstalada: string; // unidades año
	capautilizada: string; // unidades año

	competencia: string;
	competenciaTxt: string;
	competenciaOrigen: string;


	level: number; //porcentaje de la facturación o la inversión

}

export class CensoMaquinarias {
	_id?: string;
	type: string;
	slug: string;
	
	tactividad: string;
	actividadId: string;

	isImportada: boolean = false;
	origen: string;
	parancelaria: string ;

	isExportable: boolean = false;
	exportableTxt: string;
	propExportada: number; // todo


	isSustituible: boolean = false;
	sustituibleTxt: string;

	isInnovacion: boolean = false;
	innovacionTxt: string;

	anio: number;
	destino: string; // destino de la produccion opciones ídem origen
	capainstalada: string; // unidades año
	capautilizada: string; // unidades año

	competencia: string;
	competenciaTxt: string;
	competenciaOrigen: string;


	level: number; //porcentaje de la facturación o la inversión

}

export class CensoPatentes {
	_id?: string;
	type: string;
	slug: string;
	
	tactividad: string;
	actividadId: string;

	isImportada: boolean = false;
	origen: string;
	parancelaria: string ;

	isExportable: boolean = false;
	exportableTxt: string;
	propExportada: number; // todo


	isSustituible: boolean = false;
	sustituibleTxt: string;

	isInnovacion: boolean = false;
	innovacionTxt: string;

	anio: number;
	destino: string; // destino de la produccion opciones ídem origen
	capainstalada: string; // unidades año
	capautilizada: string; // unidades año

	competencia: string;
	competenciaTxt: string;
	competenciaOrigen: string;


	level: number; //porcentaje de la facturación o la inversión

}


/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
export class CensoIndustrias {
		_id: string;
		compPrefix:  string = 'CENSO';
		compName:    string = 'CEN';
		compNum:     string = '00000';

		action:      string = 'censo';
		sector:      string = 'produccion';

		categoriaEmp:   string;
		rubroEmp:       string;

		fecomp_tsa:  number;
		fecomp_txa:  string;

		empresa:  Empresa;

		responsable:  Responsable;

		estado: EstadoCenso;
		actividades: Array<CensoActividad>;
		bienes:     Array<CensoBienes>;
		productos:     Array<CensoProductos>;
		maquinarias: Array<CensoMaquinarias>;
		patentes:  Array<CensoPatentes>;


		comercializacion: Array<CensoComercializacion>;
		inversiones: Array<CensoInversion>;
		rhumanos: Array<CensoRecursosHumanos>;
		expectativas: Array<CensoExpectativas>;

    	assets: Array<CardGraph> = [];

		censo: CensoData;


};

/**************************/
/**   CENSO INDUSTRIAS  **/
/************************/
export class CensoIndustriasTable {
	_id: string;
	compNum:     string = '00000';

	action:      string = 'censo';
	sector:      string = 'produccion';
	slug:        string = '';

	categoriaEmp:   string;
	rubroEmp:       string;

	fecomp_tsa:  number;
	fecomp:  string;
	navance: string;


};

