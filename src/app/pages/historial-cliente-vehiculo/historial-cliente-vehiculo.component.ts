import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosService } from 'src/app/services/servicios.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CamposSystemService } from 'src/app/services/campos-system.service';
@Component({
  selector: 'app-historial-cliente-vehiculo',
  templateUrl: './historial-cliente-vehiculo.component.html',
  styleUrls: ['./historial-cliente-vehiculo.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistorialClienteVehiculoComponent implements OnInit {

  constructor(private rutaActiva: ActivatedRoute,private _security:EncriptadoService,private router: Router,
    private _campos: CamposSystemService,
    private _servicios: ServiciosService, private _cotizaciones: CotizacionesService, private _publicos: ServiciosPublicosService) { }
  enrutamiento = {vehiculo:'', cliente:'', anterior:''}

  camposDesgloce    =  [  ...this._cotizaciones.camposDesgloce ]
  camposVehiculo    =  [  ...this._cotizaciones.camposVehiculo ]
  camposGastos      =  [  ...this._servicios.camposGastos ]
  camposGastos_show =  [  ...this._servicios.camposGastos_show ]
  camposPagos       =  [  ...this._servicios.camposPagos ]
  camposPagos_show  =  [  ...this._servicios.camposPagos_show ]

  paquete: string     =  this._campos.paquete
  refaccion: string   =  this._campos.refaccion
  mo: string          =  this._campos.mo
  miniColumnas:number =  this._campos.miniColumnas

  // tabla
  dataSourceCotizaciones = new MatTableDataSource(); //elementos
  cotizaciones =  ['no_cotizacion','searchPlacas']; //cotizaciones
  columnsToDisplayWithExpandCotizaciones = [...this.cotizaciones, 'opciones', 'expand']; //elementos
  expandedElementCotizaciones: any | null; //elementos
  @ViewChild('CotizacionesPaginator') paginatorCotizaciones: MatPaginator //elementos
  @ViewChild('Cotizaciones') sortCotizaciones: MatSort //elementos

  // tabla
  dataSourceRecepciones = new MatTableDataSource(); //elementos
  recepciones = ['no_os','searchPlacas','fechaRecibido','fechaEntregado'];//recepciones
  columnsToDisplayWithExpandRecepciones = [...this.recepciones, 'opciones', 'expand']; //elementos
  expandedElementRecepciones: any | null; //elementos
  @ViewChild('RecepcionesPaginator') paginatorRecepciones: MatPaginator //elementos
  @ViewChild('Recepciones') sortRecepciones: MatSort //elementos

  lista_cotizaciones_arr = []
  lista_recepciones_arr = []
 
  ngOnInit(): void {
    this.recupera_enrutamiento()
  }
  recupera_enrutamiento(){
    this.rutaActiva.queryParams.subscribe(params => {
      const { vehiculo, cliente, anterior } = params
      if(vehiculo && cliente){
        this.enrutamiento.vehiculo = vehiculo
        this.enrutamiento.cliente = cliente
        this.vigila_cotizaciones_servicios(cliente, vehiculo)
      }
      this.enrutamiento.anterior = anterior
    });
  }
  irPagina(pagina,vehiculo){
    
    const { usuario } = this._security.usuarioRol()
    let queryParams = {}
    if (pagina === 'historialCliente-vehiculo') {
      queryParams = { anterior:'estadisticasCliente', cliente: usuario,vehiculo } 
    }
    this.router.navigate([`/${pagina}`], {  queryParams });
  }
  regresar(){
    const { anterior } = this.enrutamiento
    this.router.navigate([`/${anterior}`], { queryParams: {} });
  }

  async cotizaciones_get(cliente, vehiculo){

      const cotizaciones = await this._cotizaciones.consulta_cotizaciones_new()
      const cotizaciones_filtro = cotizaciones.filter(c=>c.vehiculo.id === vehiculo && c.cliente.id === cliente )
      // console.log(cotizaciones_filtro);
      if (!this.lista_cotizaciones_arr.length) {
        this.lista_cotizaciones_arr = cotizaciones_filtro
      }else{
        this.lista_cotizaciones_arr = this._publicos.actualizarArregloExistente(this.lista_cotizaciones_arr,cotizaciones_filtro,[...this._cotizaciones.camposCotizaciones])
      }
      this.dataSourceCotizaciones.data = this.lista_cotizaciones_arr
      this.newPagination('cotizaciones')
  }
  async recepciones_get(cliente, vehiculo){
      
      const recepciones = await this._servicios.consulta_recepciones_new();
      const recepciones_filtro = recepciones.filter(c=>c.vehiculo.id === vehiculo && c.cliente.id === cliente )
      // console.log(recepciones_filtro);
      if (!this.lista_recepciones_arr.length) {
        this.lista_recepciones_arr = recepciones_filtro
      }else{
        this.lista_recepciones_arr = this._publicos.actualizarArregloExistente(this.lista_recepciones_arr,recepciones_filtro,[...this._servicios.campos_servicios_hard])
      }
      this.dataSourceRecepciones.data = this.lista_recepciones_arr
      this.newPagination('recepciones')
  }
  vigila_cotizaciones_servicios(cliente, vehiculo){
      const starCountRef_cotizaciones = ref(db, `cotizacionesRealizadas`)
      onValue(starCountRef_cotizaciones, async () => {
        this.cotizaciones_get(cliente, vehiculo)
      })
      const starCountRef_recepciones = ref(db, `recepciones`)
      onValue(starCountRef_recepciones, async () => {
        this.recepciones_get(cliente, vehiculo)
      })    
  }
  newPagination(tabla){
    let dataSource, paginator, sort
    if (tabla === 'cotizaciones' ) {
      dataSource = this.dataSourceCotizaciones;
      paginator = this.paginatorCotizaciones;
      sort = this.sortCotizaciones;
    } else if (tabla === 'recepciones' ) {
      dataSource = this.dataSourceRecepciones;
      paginator = this.paginatorRecepciones;
      sort = this.sortRecepciones;
    }
    setTimeout(() => {
      if (dataSource && paginator && sort) {
        dataSource.paginator = paginator;
        dataSource.sort = sort;
      }
    },500)
  }

}
