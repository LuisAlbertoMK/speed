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
    // sucursales_arr=[]
    //informacion de cliente
    cliente = {cliente:{}, vehiculos:[], cotizaciones:[],servicios:[]}
  
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
     columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
     expandedElement: any | null; //elementos
     @ViewChild('VehiculosPaginator') paginator: MatPaginator //elementos
     @ViewChild('Vehiculos') sort: MatSort //elementos
  
     // tabla
     dataSourceCotizaciones = new MatTableDataSource(); //elementos
     cotizaciones =  ['index','no_cotizacion','searchName','searchPlacas']; //cotizaciones
     columnsToDisplayWithExpandCotizaciones = [...this.cotizaciones, 'expand']; //elementos
     expandedElementCotizaciones: any | null; //elementos
     @ViewChild('CotizacionesPaginator') paginatorCotizaciones: MatPaginator //elementos
     @ViewChild('Cotizaciones') sortCotizaciones: MatSort //elementos
  
     // tabla
     dataSourceRecepciones = new MatTableDataSource(); //elementos
     recepciones = ['id','no_os','searchName','searchPlacas','fechaRecibido','fechaEntregado'];//recepciones
     columnsToDisplayWithExpandRecepciones = [...this.recepciones, 'expand']; //elementos
     expandedElementRecepciones: any | null; //elementos
     @ViewChild('RecepcionesPaginator') paginatorRecepciones: MatPaginator //elementos
     @ViewChild('Recepciones') sortRecepciones: MatSort //elementos
  
    ordenamiento_Asc_vehiculos: boolean = true
    campoSelect_vehiculos = 'placas'
    ordenamiento_Asc_cotizaciones: boolean = true
    campoSelect_cotizaciones = 'no_cotizacion'
  
    reporteHistorial = {reporteCotizaciones:0,reporteRecepciones:0}
    rutaAnterior:null
    idCliente:string
    enrutamiento = {cliente:'', anterior:'',sucursal:''}
  async ngOnInit() {
    this.rol()
  }
  irPagina(vehiculo){
    this.router.navigate(['/historial-vehiculo'], { 
      queryParams: { vehiculo, cliente: this.idCliente, anterior:'historial-cliente' } 
    });
  }
  regresar(){
    this.router.navigate([`/${this.enrutamiento.anterior}`], { 
      queryParams: 
      { cliente: this.enrutamiento.cliente, anterior:'clientes' } 
    });
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
    console.log(this.enrutamiento);
    const ruta_buqueda_vehiculos = `vehiculos/${sucursal}/${cliente}`
    const ruta_buqueda_cotizaciones = `cotizacionesRealizadas/${sucursal}/${cliente}`
    const ruta_buqueda_recepciones = `recepciones/${sucursal}/${cliente}`
    console.log(ruta_buqueda_vehiculos);
    console.log(ruta_buqueda_cotizaciones);
    console.log(ruta_buqueda_recepciones);
    
    const data_cliente  = await this._clientes.consulta_cliente_new({sucursal, cliente})
    const vehiculos = await this._vehiculos.consulta_vehiculos({cliente, sucursal})
    const cotizaciones = await this._cotizaciones.consulta_cotizaciones({ruta: ruta_buqueda_cotizaciones, data_cliente, vehiculos})
    console.log(cotizaciones);
    

    // this.dataSource.data = vehiculos
    // this.ordenamiento('vehiculos','placas')
    
  }

  //realziar paginacion de los resultados 
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
