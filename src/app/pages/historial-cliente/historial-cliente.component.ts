import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onValue, ref, set, push } from 'firebase/database';

const db = getDatabase()
const dbRef = ref(getDatabase());
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ClientesService } from '../../services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

@Component({
  selector: 'app-historial-cliente',
  templateUrl: './historial-cliente.component.html',
  styleUrls: ['./historial-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistorialClienteComponent implements OnInit {
  
  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private rutaActiva: ActivatedRoute,
    private router: Router, private _clientes: ClientesService, private _vehiculos: VehiculosService, private _cotizaciones: CotizacionesService,
    private _servicios: ServiciosService, private _campos: CamposSystemService, private _sucursales: SucursalesService) { }

    ROL:string; SUCURSAL:string

    camposCliente        =  [ ...this._clientes.camposCliente_show ]
    camposVehiculo       =  [ ...this._vehiculos.camposVehiculo_ ]
    camposDesgloce       =  [ ...this._cotizaciones.camposDesgloce ]
    formasPago           =  [ ...this._cotizaciones.formasPago ]
    metodospago          =  [ ...this._cotizaciones.metodospago ]
    statusOS             =  [ ...this._servicios.statusOS ]
    estatusServicioUnico =  [ ...this._servicios.estatusServicioUnico ]
    sucursales_array     =  [ ...this._sucursales.lista_en_duro_sucursales ]
    
  
    paquete: string     =  this._campos.paquete
    refaccion: string   =  this._campos.refaccion
    mo: string          =  this._campos.mo
    miniColumnas:number =  this._campos.miniColumnas
  
    tiemoReal: true
     // tabla
     dataSource = new MatTableDataSource(); //elementos
     elementos = ['index','placas','marca','modelo']; //elementos
     columnsToDisplayWithExpand = [...this.elementos, 'opciones']; //elementos
     expandedElement: any | null; //elementos
     @ViewChild('VehiculosPaginator') paginator: MatPaginator //elementos
     @ViewChild('Vehiculos') sort: MatSort //elementos
  
     // tabla
     dataSourceCotizaciones = new MatTableDataSource(); //elementos
     cotizaciones =  ['index','no_cotizacion','placas','fecha_recibido']; //cotizaciones
     columnsToDisplayWithExpandCotizaciones = [...this.cotizaciones, 'expand']; //elementos
     expandedElementCotizaciones: any | null; //elementos
     @ViewChild('CotizacionesPaginator') paginatorCotizaciones: MatPaginator //elementos
     @ViewChild('Cotizaciones') sortCotizaciones: MatSort //elementos
  
     // tabla
     dataSourceRecepciones = new MatTableDataSource(); //elementos
     recepciones = ['id','no_os','placas','fecha_recibido','fecha_entregado'];//recepciones
     columnsToDisplayWithExpandRecepciones = [...this.recepciones, 'expand']; //elementos
     expandedElementRecepciones: any | null; //elementos
     @ViewChild('RecepcionesPaginator') paginatorRecepciones: MatPaginator //elementos
     @ViewChild('Recepciones') sortRecepciones: MatSort //elementos
  
    ordenamiento_Asc_vehiculos: boolean = true
    campoSelect_vehiculos = 'placas'
    ordenamiento_Asc_cotizaciones: boolean = false
    campoSelect_cotizaciones = 'no_cotizacion'
  
    reporteHistorial = {reporteCotizaciones:0,reporteRecepciones:0}
    rutaAnterior:null
    idCliente:string
    enrutamiento = {cliente:'', anterior:'',sucursal:''}

    data_cliente
    cotizaciones_arr:any = []
    recepciones_arr:any[] =[]
    vehiculos_arr:any[] =[]

  async ngOnInit() {
    this.rol()
  }
  irPagina(vehiculo){
    const { cliente, sucursal }  = this.enrutamiento
    const  queryParams = {  cliente, anterior:'historial-cliente',sucursal, vehiculo } 

    // console.log(queryParams);
    
    this.router.navigate(['/historial-vehiculo'], { 
      queryParams
    });
  }
  regresar(){
    this.router.navigate([`/clientes`]);
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
      this.acciones()
    });
    
  }
  async acciones(){
    const { cliente, sucursal }  = this.enrutamiento

    if (cliente) this.data_cliente  = await this._clientes.consulta_Cliente(cliente)
    // console.log(this.data_cliente);
    
    this.vigila_vehiculos_cliente()

    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, (snapshot) => {
      // const {id:id_cliente} = this.data_cliente
      this.cotizaciones_arr = this.filtra_cliente({
        cliente: id_cliente(this.data_cliente),
        data_temp: snapshot.val(),
      })
    })
    const starCountRef_rcepciones = ref(db, `recepciones`)
    onValue(starCountRef_rcepciones, (snapshot) => {
      // const {id:id_cliente} = this.data_cliente
      this.recepciones_arr = this.filtra_cliente({
        cliente: id_cliente(this.data_cliente),
        data_temp: snapshot.val(),
      })
    })
  }
  async vigila_vehiculos_cliente(){
    const starCountRef = ref(db, `vehiculos`)
    onValue(starCountRef, (snapshot) => {
      this.vehiculos_arr = this.filtra_cliente({
        cliente: id_cliente(this.data_cliente),
        data_temp: snapshot.val(),
      })
    })
  }
  filtra_cliente(data){
    const data_cliente = this.data_cliente
    const { cliente, data_temp} = data
    const nuevo = this._publicos.crearArreglo2(data_temp)
    function fullname(data_cliente){
      const {nombre, apellidos} = data_cliente
      return `${nombre} ${apellidos}`
    }
    return nuevo.filter(element=>element.cliente === cliente)
  }
  newPagination(tabla){
    setTimeout(() => {
      let dataSource;
      let paginator;
      let sort;
  
      if (tabla === 'vehiculos') {
        dataSource = this.dataSource;
        paginator = this.paginator;
        sort = this.sort;
      } else if (tabla === 'cotizaciones') {
        dataSource = this.dataSourceCotizaciones;
        paginator = this.paginatorCotizaciones;
        sort = this.sortCotizaciones;
      } else if (tabla === 'recepciones') {
        dataSource = this.dataSourceRecepciones;
        paginator = this.paginatorRecepciones;
        sort = this.sortRecepciones;
      }
  
      if (dataSource && paginator && sort) {
        dataSource.paginator = paginator;
        dataSource.sort = sort;
      }
    }, 500);
  }
  ordenamiento(tabla,campo){
    let dataSource;
    let campoSelect;
    let odena_asc 
    
      if (tabla === 'vehiculos') {
        dataSource = this.dataSource;
        campoSelect = this.campoSelect_vehiculos;
        // this.campoSelect_vehiculos = campo
        odena_asc = this.ordenamiento_Asc_vehiculos
      } else if (tabla === 'cotizaciones') {
        dataSource = this.dataSourceCotizaciones;
        campoSelect = this.campoSelect_cotizaciones;
        odena_asc = this.ordenamiento_Asc_cotizaciones
        // this.campoSelect_cotizaciones = campo
      } else if (tabla === 'recepciones') {
        dataSource = this.dataSourceRecepciones;
        // campoSelect = this.campoSelect_vehiculos;
      }
      if (dataSource) {
        const nueva = [...dataSource.data];
        campoSelect = campo;
        const ordenados = this._publicos.ordenarData(nueva, campo, odena_asc);
        ordenados.forEach((v, index) => {
          v.index = index;
        });
        dataSource.data = ordenados;
        this.newPagination(tabla);
      }
  }
}
function id_cliente(data_cliente){
  const {id}  = data_cliente
  return id
}