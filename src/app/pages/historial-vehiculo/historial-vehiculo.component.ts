import { Component, OnInit, ViewChild } from '@angular/core';
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";

import { ActivatedRoute, Router } from '@angular/router';

import {animate, state, style, transition, trigger} from '@angular/animations';
//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
const db = getDatabase();
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-historial-vehiculo',
  templateUrl: './historial-vehiculo.component.html',
  styleUrls: ['./historial-vehiculo.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistorialVehiculoComponent implements OnInit {
  
  constructor(
    private rutaActiva: ActivatedRoute,private _cotizaciones: CotizacionesService,
    private _publicos: ServiciosPublicosService, private router: Router,private _sucursales: SucursalesService,
    private _campos: CamposSystemService, private _clientes: ClientesService,
    private _vehiculos: VehiculosService, private _servicios: ServiciosService
    ) { }
    ROL:string;SUCURSAL:string;

    miniColumnas:number = this._campos.miniColumnas
    reporte_Cotizaciones={subtotal:0, iva:0, total:0}
    reporte_Recepciones={subtotal:0, iva:0, total:0}
    campos_reportes = ['subtotal','iva','total']
    
    camposCliente   =  [ ...this._clientes.camposCliente_show ]
    camposVehiculo  =  [ ...this._vehiculos.camposVehiculo_ ]
    // camposDesgloce  =  [ ...this._cotizaciones.camposDesgloce ]
    sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]
  
    paquete: string     =  this._campos.paquete
    refaccion: string   =  this._campos.refaccion
    mo: string          =  this._campos.mo
    // tabla
    dataSourceCotizaciones = new MatTableDataSource(); //elementos
    cotizaciones =  ['index','no_cotizacion','placas','fecha_recibido']; //cotizaciones
    columnsToDisplayWithExpandCotizaciones = [...this.cotizaciones, 'opciones', 'expand']; //elementos
    expandedElementCotizaciones: any | null; //elementos
    @ViewChild('CotizacionesPaginator') paginatorCotizaciones: MatPaginator //elementos
    @ViewChild('Cotizaciones') sortCotizaciones: MatSort //elementos
  
    // tabla
    dataSourceRecepciones = new MatTableDataSource(); //elementos
    recepciones = ['id','no_os','placas','fecha_recibido','fecha_entregado'];//recepciones
    columnsToDisplayWithExpandRecepciones = [...this.recepciones, 'opciones', 'expand']; //elementos
    expandedElementRecepciones: any | null; //elementos
    @ViewChild('RecepcionesPaginator') paginatorRecepciones: MatPaginator //elementos
    @ViewChild('Recepciones') sortRecepciones: MatSort //elementos
  
    anterior:string
    enrutamiento = {vehiculo:'', cliente:'', anterior:'', sucursal:''}

    data_cliente
    data_vehiculo
    cotizaciones_arr:any[] =[]
    recepciones_arr:any[] =[]
  ngOnInit(): void {
    this.rol()
  }

  rol(){
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
    });
  }
  regresar(){
    // this.enrutamiento.anterior = ''
    const {vehiculo, cliente, anterior, sucursal} = this.enrutamiento
  
    const queryParams = {vehiculo, cliente, sucursal}
    this.router.navigate([`/historial-cliente`], { 
      queryParams
    });
  }
  

}
