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
    private _publicos: ServiciosPublicosService, private router: Router,
    private _campos: CamposSystemService, private _clientes: ClientesService,
    private _vehiculos: VehiculosService,
    ) { }
    ROL:string;SUCURSAL:string;

    miniColumnas:number = this._campos.miniColumnas
    reporte_Cotizaciones={subtotal:0, iva:0, total:0}
    reporte_Recepciones={subtotal:0, iva:0, total:0}
    campos_reportes = ['subtotal','iva','total']
    
    camposCliente   =  [ ...this._clientes.camposCliente_show ]
    camposVehiculo  =  [ ...this._vehiculos.camposVehiculo_ ]
    camposDesgloce  =  [ ...this._cotizaciones.camposDesgloce ]
  
    paquete: string     =  this._campos.paquete
    refaccion: string   =  this._campos.refaccion
    mo: string          =  this._campos.mo
    // tabla
    dataSourceCotizaciones = new MatTableDataSource(); //elementos
    cotizaciones =  ['index','no_cotizacion','fullname','searchPlacas']; //cotizaciones
    columnsToDisplayWithExpandCotizaciones = [...this.cotizaciones, 'opciones', 'expand']; //elementos
    expandedElementCotizaciones: any | null; //elementos
    @ViewChild('CotizacionesPaginator') paginatorCotizaciones: MatPaginator //elementos
    @ViewChild('Cotizaciones') sortCotizaciones: MatSort //elementos
  
    // tabla
    dataSourceRecepciones = new MatTableDataSource(); //elementos
    recepciones = ['id','no_os','fullname','searchPlacas','fechaRecibido','fechaEntregado'];//recepciones
    columnsToDisplayWithExpandRecepciones = [...this.recepciones, 'opciones', 'expand']; //elementos
    expandedElementRecepciones: any | null; //elementos
    @ViewChild('RecepcionesPaginator') paginatorRecepciones: MatPaginator //elementos
    @ViewChild('Recepciones') sortRecepciones: MatSort //elementos
  
    anterior:string
    enrutamiento = {vehiculo:'', cliente:'', anterior:''}
  ngOnInit(): void {
    this.rol()
  }

  rol(){
    this.rutaActiva.queryParams.subscribe(params => {
      const {vehiculo, cliente, anterior} = params
      if(vehiculo && cliente){
        this.enrutamiento.vehiculo = vehiculo
        this.enrutamiento.cliente = cliente
        this.acciones(vehiculo)
      }
      this.enrutamiento.anterior = anterior
      
    });
  }
  regresar(){
    this.router.navigate([`/${this.enrutamiento.anterior}`], { 
      queryParams: Object(this.enrutamiento)
    });
  }
  acciones(vehiculo){
    const idVehiculo = vehiculo
    this._cotizaciones.consulta_cotizaciones_new().then((cotizaciones)=>{
      const mis_cotizaciones = cotizaciones.filter(c=>c.vehiculo.id === idVehiculo)
      this.reporte_Cotizaciones = this._publicos.reporte_cotizaciones_recepciones(mis_cotizaciones)
      mis_cotizaciones.map((c,index)=>{ c.index = index})
      this.dataSourceCotizaciones.data = mis_cotizaciones
      this.newPagination('cotizaciones')
    })
    this._cotizaciones.consulta_recepciones_new().then((recepciones)=>{
      const mis_recepciones = recepciones.filter(c=>c.vehiculo.id === idVehiculo)
      this.reporte_Recepciones = this._publicos.reporte_cotizaciones_recepciones(mis_recepciones)
      mis_recepciones.map((c,index)=>{ c.index = index})
      this.dataSourceRecepciones.data = mis_recepciones
      this.newPagination('recepciones')
    })
  }

  newPagination(tabla){
    setTimeout(() => {
      let dataSource;
      let paginator;
      let sort;
  
      if (tabla === 'cotizaciones') {
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

}
