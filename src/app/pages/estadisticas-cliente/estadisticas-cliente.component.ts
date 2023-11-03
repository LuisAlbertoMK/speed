import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, AfterContentChecked} from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { CamposSystemService } from 'src/app/services/campos-system.service';

import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormControl, FormGroup } from '@angular/forms';

import { ViewEncapsulation, LOCALE_ID } from '@angular/core';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-estadisticas-cliente',
  templateUrl: './estadisticas-cliente.component.html',
  styleUrls: ['./estadisticas-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class EstadisticasClienteComponent implements OnInit{
  
  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService,
  private _campos: CamposSystemService, private _vehiculos: VehiculosService,
  private _cotizaciones: CotizacionesService,private _servicios: ServiciosService, private _clientes: ClientesService,
  private router: Router) { registerLocaleData(localeEs) }
  

  rol_cliente:string = 'cliente'
  camposReporte        = [  ...this._cotizaciones.camposReporte  ]
  camposReporte_show   = [  ...this._cotizaciones.camposReporte_show  ]
  camposReporte_show2  = {  ...this._cotizaciones.camposReporte_show2  }
  formasPago       =  [ ...this._cotizaciones.formasPago ]

  miniColumnas:number  = this._campos.miniColumnas

  campos_estadisticas_show = [
    {valor: 'servicios_gen', show:'Total de servicios', symbol:''},
    {valor: 'ticketPromedioFinal', show:'Ticket promedio servicios', symbol:'$'},
    {valor: 'gasto_gen', show:'Gasto total', symbol:'$'},
  ]
  campos_estadisticas = { ticketPromedioFinal:0 ,servicios_totales:0,ticketGeneral:0, servicios_gen:0}

  clavesVehiculos = []
  calves_vehiculos_new = []
  vehiculos_new = []

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['placas','marca','modelo','categoria','anio']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos

  @ViewChild('guet') divElement: ElementRef;

  recepciones_generales = []
  ///variables para las estadisticas
  infoSelect = {value: 0, name:'--------',contador: 0,arreglo:[]}
  view: [number, number] = [600, 400];
  width = 600;
  height = 400;
  legend_general: boolean = false;
  showText_general: boolean = false;
  legend: boolean = true;
  animations: boolean = true;    
  legendPosition= LegendPosition.Below;
  legendTitle_general = ''
  single_generales = [ ]
  clonado = []
  single_auto = []
  colorScheme:Color = {
    group: ScaleType.Ordinal, 
    selectable: true, 
    name: 'Customer Usage', 
    domain: ['#7aa3fc', '#f6a562', '#6fd5a4', '#97ea80']
  };
  gaugeUnits: string = '';
  gaugeTextValue: string = 'nuevo';
   // margin
   margin: boolean = false;
   marginTop: number = 40;
   marginRight: number = 10;
   marginBottom: number = 40;
   marginLeft: number = 10;
   showAxis:boolean = true
   
    //grafica comparativa
    single = []
    view_comparativa: [number, number] = [400, 400];
    clonado_busqueda = []
    infoSelect_busqueda = {value: 0, name:'--------',contador: 0,arreglo:[]}
    // options
      gradient: boolean = true;
      showLegend: boolean = true;
      showLabels: boolean = true;
      isDoughnut: boolean = false;
      // legendPosition: string = 'below';
    
      // colorScheme = {
      //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
      // };
      muestra_busqueda:string

  seleciona = [
    'Monto total invertido',
    'Monto mas grande en una orden',
    'Ticket promedio servicios',
    'Monto mas pequeño en en servicios',
  ]
  
  range_busqueda = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  fechas_busqueda = {inicio: this._publicos.resetearHoras(new Date()), final: this._publicos.resetearHoras(new Date())}

  _sucursal:string
  _uid:string

  recepciones_arr=[]
  fecha_formateadas = {start:new Date(), end:new Date() }
  hora_start = '00:00:01';
  hora_end = '23:59:59';

  pertenecientes
  data_seleccionada
  ngOnInit(): void {
    this.rol()
    this.vigila_calendario()
  }
  vigila_calendario(){
    this.range_busqueda.valueChanges.subscribe(({start:start_, end: end_})=>{
      if (start_ && start_['_d'] && end_ && end_['_d'] ) {
        if (end_['_d'] >= start_['_d']) {
          this.resetea_horas_admin()
        }
      }
    })
  }
  resetea_horas_admin(){
    const {start, end } = this.range_busqueda.value

    this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
    this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(end),this.hora_end)
    this.onSelect_busqueda('')

  }
  OnAfterContentChecked() {
    console.log("Sent from Ng After View Init");
    
  }
  rol(){
  
    const { rol, sucursal, uid } = this._security.usuarioRol()
    this._sucursal = sucursal
    if (uid) {
      this._uid = uid
      this.asiganacion_resultados()
    }
    this.ajustado_automatico()
    // if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
  }
  ajustado_automatico(){
    setInterval(() => {
      this.applyDimensions()
    }, 1000);
  }
  
  asiganacion_resultados(){
    
    const {data_cliente, cotizaciones_arr, recepciones_arr, vehiculos_arr} = this._publicos.data_relacionada_id_cliente(this._uid)
  
    this.recepciones_arr = recepciones_arr

    let finales = []
    let totales = 0
    recepciones_arr.forEach(cot=>{
      const {reporte } = cot
      const {total} = reporte
      totales+= total
      
    })
   

    const {
      maximo,
      no_maximo,
      contadorMaximo,
      arreglo_maximo,
      minimo,
      no_minimo,
      contadorMinimo,
      arreglo_minimo
    } = this._publicos.obtenerValorMaximoMinimo(recepciones_arr)
    
    finales.push({ name: 'Monto total invertido', value: totales })
    finales.push({ name: 'Ticket promedio servicios', value: totales / recepciones_arr.length })

    finales.push({ name: 'Monto mas grande en una orden', value: maximo })
    finales.push({ name: 'Monto mas pequeño en en servicios', value: minimo })

    this.clonado = [
      {
        name: "Monto total invertido",
        value: totales,
        contador: 0,
        arreglo:[]
      },
      {
        name: "Monto mas grande en una orden",
        value: maximo,
        no_os: no_maximo,
        contador: contadorMaximo,
        arreglo: arreglo_maximo
      },
      {
        name: "Ticket promedio servicios",
        value: totales / recepciones_arr.length,
        contador: 0,
        arreglo:[]
      },
      {
        name: "Monto mas pequeño en en servicios",
        value: minimo,
        no_os: no_minimo,
        contador: contadorMinimo,
        arreglo: arreglo_minimo
      },
    ]

    
    
    this.single_generales = finales

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  irPagina(pagina,vehiculo){
    const  { usuario } = this._security.usuarioRol() 
    let queryParams = {}
    if (pagina === 'historialCliente-vehiculo') {
      queryParams = { anterior:'estadisticasCliente', cliente: usuario,vehiculo } 
    }
    this.router.navigate([`/${pagina}`], { queryParams });
  }

  //funciones para las graficas de auto y general
  onSelect_general(event) {
    if (event) {
      const busqueda = (typeof event === 'object') ? event.name : event
      this.infoSelect  = this.clonado.find(c=>c.name === busqueda)
     
      
      const findIndex = (array, predicate) => {
        for (let i = 0; i < array.length; i++) {
          if (predicate(array[i])) {
            return i;
          }
        }
        return -1;
      };
      const index = findIndex(this.clonado, item => item.name === busqueda);
      
      let color = '#fe0000'

      this.gaugeTextValue = this._publicos.transform(this.infoSelect.value)
      
      let colores_originales = ['#7aa3fc', '#f6a562', '#6fd5a4', '#97ea80']
      colores_originales[index] = color
      this.colorScheme.domain = [...colores_originales]
    }else{
      this.infoSelect = {value: 0, name:'--------',contador: 0,arreglo:[]}
    }
  }
  applyDimensions() {
    const width = this.divElement.nativeElement.offsetWidth;
    const height = this.divElement.nativeElement.offsetHeight;
    // console.log('Ancho:', width, 'px');
    // console.log('Alto:', height, 'px');
    
    this.showAxis = (width < 500) ? false:  true

    this.height = (width < 530) ? 400 : 400
    this.width = width -20

    this.view = [this.width, this.height];
  }
  onActivate_general(event): void {
    const {  value  } = JSON.parse(JSON.stringify(event))
    const {  value: nuevoValue, name  } = value
    this.gaugeTextValue = this._publicos.transform(nuevoValue)
  }

  onDeactivate(data): void {
    this.gaugeTextValue = this._publicos.transform(0)
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    // this.colorScheme.domain[0] = '#5ca04a'
  }
  valueFormatting(value: number): string {

    const isNegative = value < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(value)
      .toFixed(2)
      .split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');

    const formattedValue = `$ ${
      isNegative ? '-' : ''
    } ${formattedIntegerPart}.${decimalPart}`;
    // console.log(formattedValue);
    
    return formattedValue;
  }
  axisTickFormatting(value):string{

    const enteros = value.split('.');
    const numero_1 = enteros[0].replace(',', '');

    const nuevoNumero = !enteros[1] ? numero_1: `${numero_1}.${enteros[1]}`;

    const isNegative = nuevoNumero < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(nuevoNumero).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');

    return ` $ ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;
  }
  tooltipText(velue_get){
    // console.log(velue_get);
    const {data} = velue_get
    const {value, name} = data

    const isNegative = value < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(value).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');
  
    const formattedValue = ` $ ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;

    return  `${ name } <br> ${ formattedValue }`
  }
  
  onSelect_busqueda(event){
    // console.log(event);
    const vehiculos = this._publicos.revision_cache('vehiculos')
    // if (event) {
      // const busqueda = (typeof event === 'object') ? event.name : event
      // this.infoSelect_busqueda  = this.clonado.find(c=>c.name === busqueda)

      const { recepciones_arr, vehiculos_arr} = this._publicos.data_relacionada_id_cliente(this._uid)
      const {start, end} = this.fecha_formateadas

      const filtro_fechas = recepciones_arr.filter(recep=> new Date(recep.fecha_recibido) >= start && new Date(recep.fecha_recibido) <= end)

      let pertenecientes = {}
      
      let data = []
       vehiculos_arr.forEach(v=>{
        const {id, placas} = v
        const recepciones_vehiculo = filtro_fechas.filter(recp=>recp.vehiculo === id)
        const {
          maximo,
          no_maximo,
          contadorMaximo,
          arreglo_maximo,
          minimo,
          no_minimo,
          contadorMinimo,
          arreglo_minimo
        } = this._publicos.obtenerValorMaximoMinimo(recepciones_vehiculo)
        const {ticketGeneral, ticketPromedio}= this._publicos.obtener_ticketPromedioFinal(recepciones_vehiculo)
        let servicios = recepciones_vehiculo.length
        
        const objeto =  {data_max_min: {
          maximo,
          no_maximo,
          contadorMaximo,
          arreglo_maximo,
          minimo,
          no_minimo,
          contadorMinimo,
          arreglo_minimo
        }, data_vehiculo: vehiculos[id]}    
        pertenecientes[placas.toUpperCase()] = {...Object(objeto), servicios, ticketGeneral, ticketPromedio}
        // clonar.push(Object({name: placas.toUpperCase(), value: ocupado}))
        let tota_vehiculo = total_ordenes(recepciones_vehiculo)
        data.push({name: placas.toUpperCase(), value: tota_vehiculo})
      })
      this.pertenecientes = pertenecientes

      function total_ordenes(filtro_fechas:any[]){
        let totales = 0
        filtro_fechas.forEach(cot=>{
          const {reporte } = cot
          const {total} = reporte
          totales+= total
        })
        return totales
      }
      this.single = data
    // }else{
    //   this.infoSelect_busqueda = {value: 0, name:'--------',contador: 0,arreglo:[]}
    // }
    
  }
  vehiculo_fd(event){
    const {name} = event
    if (this.pertenecientes[name]) {
      this.data_seleccionada = this.pertenecientes[name]
    }
  }

 

}
