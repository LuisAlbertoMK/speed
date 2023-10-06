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

  // camposDesgloce    =  [  ...this._cotizaciones.camposDesgloce ]
  // camposVehiculo    =  [  ...this._cotizaciones.camposVehiculo ]
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
      // if(vehiculo && cliente){
      //   this.enrutamiento.vehiculo = vehiculo
      //   this.enrutamiento.cliente = cliente
      //   this.vigila_cotizaciones_servicios(cliente, vehiculo)
      // }
      // this.enrutamiento.anterior = anterior
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

}
