import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from '../../services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
@Component({
  selector: 'app-servicios-cliente',
  templateUrl: './servicios-cliente.component.html',
  styleUrls: ['./servicios-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ServiciosClienteComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, private _reporte_gastos: ReporteGastosService,
    private _clientes: ClientesService, private _sucursales: SucursalesService, private _campos: CamposSystemService,
    private _vehiculos: VehiculosService, private _servicios: ServiciosService, private _cotizaciones: CotizacionesService) { }

  rol_cliente:string = 'cliente'

  // camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_  ]

  paquete: string     =   this._campos.paquete
  refaccion: string   =   this._campos.refaccion
  mo: string          =   this._campos.mo
  miniColumnas:number =   this._campos.miniColumnas

  ///elementos de la tabla de vehiculos
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['id','no_os','searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('recepcionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('recepciones') sort: MatSort //elementos

  

  recepciones_arr= []
  _sucursal:string
  _rol:string
  _uid:string
  objecto_actual:any ={}
  ngOnInit(): void {
    this.rol()
  }
  rol(){

    const {rol, usuario, sucursal, uid} = this._security.usuarioRol()
    
    this._sucursal = sucursal
    this._rol = rol
    // if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
    if (uid) {
      this._uid = uid
      this.primer_comprobacion_resultados()
    }
  }

  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.revision_cache('recepciones')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }
  primer_comprobacion_resultados(){
    this.asiganacion_resultados()
    this.segundo_llamado()
  }
  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.revision_cache('recepciones')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asiganacion_resultados()
      }
    },1500)
  }
  asiganacion_resultados(){
    const objecto_recuperdado = this._publicos.revision_cache('recepciones')

    const {data_cliente, cotizaciones_arr, recepciones_arr, vehiculos_arr} = this._publicos.data_relacionada_id_cliente(this._uid)

    const campos_recpciones = [
      'checkList','detalles','diasEntrega','diasSucursal','elementos','fecha_promesa','fecha_recibido','formaPago','iva','margen','no_os','notifico','pathPDF','servicio','status','reporte','historial_gastos_orden','historial_pagos_orden'
    ]
    this.objecto_actual = objecto_recuperdado

    this.recepciones_arr = (!this.recepciones_arr.length)  ? recepciones_arr :
    this._publicos.actualizarArregloExistente(this.recepciones_arr,recepciones_arr,campos_recpciones)
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
}
