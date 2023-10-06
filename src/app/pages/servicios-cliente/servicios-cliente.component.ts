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
  SUCURSAL:string

  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const { rol, sucursal, uid} = this._security.usuarioRol()
    this.SUCURSAL = sucursal

    if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
  }
  async obtenerInformacion_cliente(cliente:string){
    

    const starCountRef_recpciones = ref(db, `recepciones`)
    onValue(starCountRef_recpciones, async (snapshot) => {
      if (snapshot.exists()) {
        const _orden = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_orden())
        const _pagos = this._publicos.crearArreglo2( await this._servicios.consulta_pagos())
    
        const _recepciones = this._publicos.crearArreglo2( await this._servicios.consulta_recepciones_())
        const recepciones_filtrados = this._publicos.filtra_informacion(_recepciones,'cliente',cliente)
        
        const nuevas_recepciones  = [...recepciones_filtrados].map(recepcion=>{
          const {elementos, margen, iva, descuento, formaPago} = recepcion
          const reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
          recepcion.reporte = reporte
          recepcion.historial_gastos_orden = filtra_orden(_orden, cliente)
          recepcion.historial_pagos_orden = filtra_orden(_pagos, cliente)
          return recepcion
        })
        function filtra_orden(arreglo, id_orden){
          return [...arreglo].filter(f=>f.id_os === id_orden)
        }
        const campos_recpciones = [
          'checkList',
          'detalles',
          'diasEntrega',
          'diasSucursal',
          'elementos',
          'fecha_promesa',
          'fecha_recibido',
          'formaPago',
          'iva',
          'margen',
          'no_os',
          'notifico',
          'pathPDF',
          'servicio',
          'status',
          'reporte',
          'historial_gastos_orden',
          'historial_pagos_orden',
        ]
        // console.log(nuevas_recepciones);

        this.recepciones_arr = (!this.recepciones_arr.length)  ? nuevas_recepciones :
        this._publicos.actualizarArregloExistente(this.recepciones_arr,nuevas_recepciones,campos_recpciones)
      }
      else {
        // console.log("No data available");
        this.recepciones_arr = []
      }
    })
    
    
    

    

    

    
    // if (!this.recepciones_arr.length) {
    //   this.recepciones_arr = filtro_recepciones;
    //   // this.cargandoInformacion = false
    // } else {
    //   this.recepciones_arr = this._publicos.actualizarArregloExistente(this.recepciones_arr,filtro_recepciones,[...this._cotizaciones.camposCotizaciones])
    //   // this.cargandoInformacion = false
    // }
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
