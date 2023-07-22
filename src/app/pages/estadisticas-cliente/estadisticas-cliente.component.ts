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
  private _campos: CamposSystemService,
  private _cotizaciones: CotizacionesService,private _servicios: ServiciosService, private _clientes: ClientesService,
  private router: Router) { registerLocaleData(localeEs) }
  

  rol_cliente:string = 'cliente'
  camposReporte        = [  ...this._cotizaciones.camposReporte  ]
  camposReporte_show   = [  ...this._cotizaciones.camposReporte_show  ]
  camposReporte_show2  = {  ...this._cotizaciones.camposReporte_show2  }

  miniColumnas:number  = this._campos.miniColumnas

  campos_estadisticas_show = [
    {valor: 'servicios_gen', show:'Total de servicios', symbol:''},
    {valor: 'ticketPromedioFinal', show:'Ticket promedio servicios', symbol:'$'},
    {valor: 'gasto_gen', show:'Gasto total', symbol:'$'},
  ]
  campos_estadisticas = { ticketPromedioFinal:0 ,servicios_gen:0,gasto_gen:0 }

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



  ngOnInit(): void {
    this.rol()
  }
  OnAfterContentChecked() {
    console.log("Sent from Ng After View Init");
    
  }
  rol(){
  
    const { rol,uid } = this._security.usuarioRol()
    
    if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
  }
  async obtenerInformacion_cliente(cliente:string){

    const starCountRef_recepciones = ref(db, `recepciones`);
    onValue(starCountRef_recepciones, async (snapshot) => {
      const vehiculos = await this._clientes.consulta_cliente_vehiculos(cliente)
      const vehiculos_ids:any[] = vehiculos.map(c=> { return c.id })
      this.calves_vehiculos_new = vehiculos_ids
      this.vehiculos_new = vehiculos
      const recepciones = await this._servicios.consulta_recepciones_new();
      const recepciones_filter = recepciones.filter((c) => c.cliente.id === cliente);
      this.recepciones_generales = recepciones_filter
      let ticketGeneral = 0
      
      const servicios_gen = recepciones_filter.length, info = {};
      vehiculos_ids.forEach((v) => {

        const servicios_totales = recepciones_filter.filter((ser) => ser.vehiculo.id === v);
        const data = vehiculos.find((ve) => ve.id === v);
        const reporteSum = {...this.camposReporte_show2};
        recepciones_filter.forEach((coti) => {
          const { reporte } = coti;
          if (v === coti.vehiculo.id) {
            this.camposReporte.forEach((c) => {
              reporteSum[c] += Number(reporte[c]);
            });
            info[v] = { data, servicios_totales: servicios_totales.length,ticketPromedio:0, reporte: { ...reporteSum } };
            info[v].ticketPromedio = info[v].reporte['total'] / info[v].servicios_totales
          }
        });
      });
      
      this.clavesVehiculos = this._publicos.crearArreglo2(info)
      this.clavesVehiculos.map(coti=>{
        const  {data} = coti
        coti['searchPlacas'] = data.placas
        coti['searchMarca'] = data.marca
        coti['searchModelo'] = data.modelo
        coti['searchCategoria'] = data.categoria
        coti['searchAnio'] = data.anio
        ticketGeneral += Number(coti.reporte['total'])
      })
      // console.log(this.clavesVehiculos);
      

      const { maximo,no_maximo, contadorMaximo,arreglo_maximo, minimo, no_minimo,contadorMinimo,arreglo_minimo} = this._publicos.obtenerValorMaximoMinimo(recepciones_filter)
     
      this.dataSource.data = this.clavesVehiculos
      this.newPagination()

      this.campos_estadisticas = { 
        ticketPromedioFinal: ticketGeneral / servicios_gen, 
        servicios_gen, 
        gasto_gen: ticketGeneral }
      
      this.clonado = [
        {
          name: "Monto total invertido",
          value: ticketGeneral,
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
          value: ticketGeneral / servicios_gen,
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
      this.single_generales = [ ...this.clonado]
      setTimeout(()=>{ this.applyDimensions() },800)
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
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
    const enteros = value.split(',');
    const numero_1 = enteros[0].replace('.', '');
    const nuevoNumero = !enteros[1] ? numero_1 : `${numero_1}.${enteros[1]}`;

    const isNegative = nuevoNumero < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(nuevoNumero).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');
  
    const formattedValue = ` $ ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;
      
    return formattedValue;
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
    
    if (event) {
      const busqueda = (typeof event === 'object') ? event.name : event
      this.infoSelect_busqueda  = this.clonado_busqueda.find(c=>c.name === busqueda)
      // console.log('aqui');
      const encontrado = this.seleciona.find(c=>c === busqueda)
      // console.log(encontrado);
      // this.colorScheme = {
      //   group: ScaleType.Ordinal, 
      //   selectable: true, 
      //   name: 'Customer Usage', 
      //   domain: ['#FF8623', '#FF8623', '#6fd5a4', '#FF8623']
      // };
      this.muestra_busqueda = encontrado
      this.cambiosFechas()
      
    }else{
      this.infoSelect_busqueda = {value: 0, name:'--------',contador: 0,arreglo:[]}
    }
    // console.log(this.infoSelect_busqueda);
    
  }
  cambiosFechas(){

    const {start, end} = this.range_busqueda.value
    if (start && end && (start['_d'] && end['_d'] ) && this.muestra_busqueda) {
      
      // console.log('si es fecha');
      // console.log(this.muestra_busqueda);
      
      const fechaAsigan = {inicio: this._publicos.resetearHoras(start['_d']), final: this._publicos.resetearHoras(end['_d'])}
      this.fechas_busqueda = fechaAsigan
      // console.log(this.fechas_busqueda);
      // console.log(this.recepciones_generales);
      const filtro_entregado = 
      // this.recepciones_generales.filter(
      //   r=>r.status === 'entregado' && (fechaAsigan.inicio >= r.fechaEntregado && fechaAsigan.final <= r.fechaEntregado)
      // )
       this.recepciones_generales.filter(r => {
        const fechaEntregado = new Date(r.fechaEntregado);
        return r.status === 'entregado' && fechaEntregado >= fechaAsigan.inicio && fechaEntregado <= fechaAsigan.final;
      });
      //TODO CONTINUAR CON LA MUESTRA DE INFORMACION EN ESTADISTICAS DE CLIENTE
      // console.log(filtro_entregado);
      let pertenecientes = {}
      const clonar = []
      this.calves_vehiculos_new.forEach(c=>{
        const recepciones       = filtro_entregado.filter(re=>re.vehiculo.id === c)
        const max_min           = this._publicos.obtenerValorMaximoMinimo(recepciones)
        const data_vehiculo     = this.vehiculos_new.find(v=>v.id === c)
        const {ticketGeneral, ticketPromedio}= this._publicos.obtener_ticketPromedioFinal(recepciones)

        let ocupado, contador=0, arreglo = [], servicios = recepciones.length
        switch (this.muestra_busqueda) {
          case 'Monto total invertido':
            ocupado = ticketGeneral
            break;
          case 'Monto mas grande en una orden':
            ocupado = max_min.maximo
            arreglo = max_min.arreglo_maximo
            contador = max_min.contadorMaximo
            break;
          case 'Ticket promedio servicios':
            ocupado = ticketPromedio
            break;
          case 'Monto mas pequeño en en servicios':
            ocupado = max_min.minimo
            arreglo = max_min.arreglo_minimo
            contador = max_min.contadorMinimo
            break;
        
          default:
            
            break;
        }
        const objeto =  {data_max_min: max_min, vehiculo: data_vehiculo}    
        pertenecientes[c] = Object(objeto)
        
        clonar.push(Object({name: ' '+String(data_vehiculo.placas).toUpperCase(), value: ocupado, contador, arreglo, servicios_totales: servicios}))
      })
      this.clonado_busqueda = [...clonar]
      this.single = [...clonar]
      // console.log(pertenecientes);
      // console.log(this.single);
      
      
    }else{
      // console.log('no es fecha');
      
    }
  }


}
