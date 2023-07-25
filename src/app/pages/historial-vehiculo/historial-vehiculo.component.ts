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
    private _vehiculos: VehiculosService, private _servicios: ServiciosService
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
  ngOnInit(): void {
    this.rol()
  }

  rol(){
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
      this.acciones()
    });
  }
  regresar(){
    // this.enrutamiento.anterior = ''
    const {vehiculo, cliente, anterior, sucursal} = this.enrutamiento
  
    const queryParams = {vehiculo, cliente, sucursal}
    this.router.navigate([`/${anterior}`], { 
      queryParams
    });
  }
  async acciones(){
    const {vehiculo, cliente, sucursal} = this.enrutamiento
    // console.log( this.enrutamiento);
    // const ruta_cotizaciones = `cotizacionesRealizadas/${sucursal}/${cliente}`
    const data_cliente  = await this._clientes.consulta_cliente_new({sucursal, cliente})
    // console.log(data_cliente);
    const data_vehiculo = await this._vehiculos.consulta_vehiculo_new({sucursal, cliente, vehiculo})
    // console.log(data_vehiculo);

    const ruta_buqueda_cotizaciones = `cotizacionesRealizadas/${sucursal}/${cliente}`
    const ruta_buqueda_recepciones = `recepciones/${sucursal}/${cliente}`
    let vehiculos = [ ]
    vehiculos.push(data_vehiculo)

    const cotizaciones = await this._cotizaciones.consulta_cotizaciones({ruta: ruta_buqueda_cotizaciones, data_cliente, vehiculos})
    const filtro_cotizaciones = cotizaciones.filter(c=>c.vehiculo === vehiculo)


    const recepciones = await this._servicios.consulta_recepciones({ruta: ruta_buqueda_recepciones, data_cliente, vehiculos})
    const filtro_recepciones = recepciones.filter(c=>c.vehiculo === vehiculo)


    this.data_cliente = data_cliente
    this.data_vehiculo = data_vehiculo

    filtro_cotizaciones.map((c, index)=>{
      c.index = index
    })
    filtro_recepciones.map((c, index)=>{
      c.index = index
    })

    this.reporte_Cotizaciones = this._publicos.obtener_subtotales(filtro_cotizaciones)
    this.reporte_Recepciones = this._publicos.obtener_subtotales(filtro_recepciones)
    this.dataSourceCotizaciones.data = filtro_cotizaciones
    this.dataSourceRecepciones.data = filtro_recepciones

    this.newPagination('cotizaciones')
    this.newPagination('recepciones')
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
