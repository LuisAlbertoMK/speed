import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { animate, state, style, transition, trigger } from '@angular/animations';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';

import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-cotizaciones-cliente',
  templateUrl: './cotizaciones-cliente.component.html',
  styleUrls: ['./cotizaciones-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CotizacionesClienteComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, 
    private _vehiculos: VehiculosService, private _servicios: ServiciosService, private _campos: CamposSystemService,
    private _clientes: ClientesService, private _sucursales: SucursalesService, private _cotizaciones: CotizacionesService) { }
  rol_cliente:string = 'cliente'

  // camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  camposCliente     =   [ ...this._clientes.camposCliente_show  ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_  ]
  // formasPago        =   [ ...this._cotizaciones.formasPago  ]

  paquete: string     =   this._campos.paquete
  refaccion: string   =   this._campos.refaccion
  mo: string          =   this._campos.mo
  miniColumnas:number =   this._campos.miniColumnas

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','no_cotizacion','fullname','placas']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos


  cotizaciones_Existentes = []


  ///grafica de datos
  single = []
  view_comparativa: [number, number] = [500, 200];
  clonado_busqueda = []
  infoSelect_busqueda = {value: 0, name:'--------',contador: 0,arreglo:[]}
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme:Color = {
    group: ScaleType.Ordinal, 
    selectable: true, 
    name: 'Customer Usage', 
    domain: ['#3574FA', '#FF8623', '#a8385d', '#5ca04a']
  };
  tabla_promedios = [
    {valor:'servicios_totales', show:'Total de cotizaciones'},
    {valor:'ticketGeneral', show:'Ticket general'},
    {valor:'ticketPromedio', show:'Ticket promedio'},
  ]
  valores_promedios = {servicios_totales: 0, ticketGeneral:0, ticketPromedio:0}
  tabla_maximos  = [
    {valor:'maximo', show:'Inversion mas alta', },
    {valor:'contadorMaximo', show:'contador altas', },
    {valor:'similitudesMaximo', show:'cotizaciones maximas'},
  ]
   valores_tabla_maximos = { maximo: 0,contadorMaximo: 0,similitudesMaximo: '' }
  tabla_minimos = [
    {valor:'minimo', show:'Inversion mas baja'},
    {valor:'contadorMinimo', show:'contador bajas'},
    {valor:'similitudesMinimo', show:'cotizaciones minimas'},
  ]
  valores_tabla_minimos = { minimo: 0,contadorMinimo: 0,similitudesMinimo: '' }
  SUCURSAL:string
  cotizaciones_arr= []
  collapse_maximos_class:string = 'collapse'
  collapse_maximo_b:boolean = false
  collapse_minimas_b:boolean = false
  ngOnInit(): void {
    this.rol()
  }

  rol(){

    // const { rol,  uid } = this._security.usuarioRol()
    const {rol, usuario, sucursal, uid} = this._security.usuarioRol()
    this.SUCURSAL = sucursal
    // if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
    
  }
}