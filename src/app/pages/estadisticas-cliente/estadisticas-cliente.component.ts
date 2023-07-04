import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

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

import { Color, ScaleType } from '@swimlane/ngx-charts';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
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
})
export class EstadisticasClienteComponent implements OnInit {

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

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['placas','marca','modelo','categoria','anio']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos

  ///variables para las estadisticas
  ;
  infoSelect = {value: 0, name:'--------',contador: 0,arreglo:[]}
  view: [number, number] = [800, 500];
    legend_general: boolean = false;
    showText_general: boolean = false;
    legend: boolean = true;
    animations: boolean = true;    
    legendPosition: string = 'below';
    legendTitle_general = ''
    single_generales = [ ]
    clonado = []
    single_auto = []
    colorScheme:Color = {
      group: ScaleType.Ordinal, 
      selectable: true, 
      name: 'Customer Usage', 
      domain: ['#3574FA', '#FF8623', '#a8385d', '#5ca04a']
    };

  seleciona = [
    'Ticket general',
    'Más caro',
    'Ticket promedio',
    'Más barato',
  ]
  

  ngOnInit(): void {
    this.rol()
  }
  rol(){
  
    const { rol, sucursal,usuario } = this._security.usuarioRol()
    
    if (rol === this.rol_cliente && usuario) this.obtenerInformacion_cliente(usuario) 
  }
  async obtenerInformacion_cliente(cliente:string){

    const starCountRef_recepciones = ref(db, `recepciones`);
    onValue(starCountRef_recepciones, async (snapshot) => {
      const vehiculos = await this._clientes.consulta_cliente_vehiculos(cliente)
      const vehiculos_ids:any[] = vehiculos.map(c=> { return c.id })
      const recepciones = await this._servicios.consulta_recepciones_new();
      
      const recepciones_filter = recepciones.filter((c) => c.cliente.id === cliente);
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

      const { maximo,no_maximo, contadorMaximo,arreglo_maximo, minimo, no_minimo,contadorMinimo,arreglo_minimo} = this._publicos.obtenerValorMaximoMinimo(recepciones_filter)
     
      this.dataSource.data = this.clavesVehiculos
      this.newPagination()

      this.campos_estadisticas = { 
        ticketPromedioFinal: ticketGeneral / servicios_gen, 
        servicios_gen, 
        gasto_gen: ticketGeneral }
      
      this.clonado = [
        {
          name: "Ticket general",
          value: ticketGeneral,
          contador: 0,
          arreglo:[]
        },
        {
          name: "Más caro",
          value: maximo,
          no_os: no_maximo,
          contador: contadorMaximo,
          arreglo: arreglo_maximo
        },
        {
          name: "Ticket promedio",
          value: ticketGeneral / servicios_gen,
          contador: 0,
          arreglo:[]
        },
        {
          name: "Más barato",
          value: minimo,
          no_os: no_minimo,
          contador: contadorMinimo,
          arreglo: arreglo_minimo
        },
      ]
      this.single_generales = [ ...this.clonado]
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
    }else{
      this.infoSelect = {value: 0, name:'--------',contador: 0,arreglo:[]}
    }
  }
  onActivate_general(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
    // const {  value  } = JSON.parse(JSON.stringify(data))
    // const {  value: nuevoValue, name  } = value
    // this.infoSelect.name = name
    // this.infoSelect.value = (  !nuevoValue  ) ? this.single_generales.find(c=>c.name === name).value : nuevoValue
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  valueFormatting(value: number): string {
    if (!value || isNaN(value)) {
      return `$ 0.00`;
    }
    const isNegative = value < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(value).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');
  
    const formattedValue = `$ ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;
    return formattedValue;
    // return formattedValue;
  }


}
