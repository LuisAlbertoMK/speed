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
    // reporte_Cotizaciones={subtotal:0, iva:0, total:0}
    // reporte_Recepciones={subtotal:0, iva:0, total:0}
    // campos_reportes = ['subtotal','iva','total']
    
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

      const data_enrutamiento = this._publicos.crear_new_object(params)
      // console.log(data_enrutamiento);
      const {vehiculo} = data_enrutamiento
      if (data_enrutamiento && vehiculo) {
        this.consulta_info_vehiculo(vehiculo)
      }
    });
  }
  consulta_info_vehiculo(id_vehiculo){
    // {data_cliente, cotizaciones_arr, recepciones_arr, vehiculos_arr}
    const {data_vehiculo, data_cliente, cotizaciones_arr} = this._publicos.data_relacionada_id_vehiculo(id_vehiculo)
    this.data_cliente = data_cliente
    this.data_vehiculo = data_vehiculo
    this.cotizaciones_arr = cotizaciones_arr
  }
  // regresar(){
  //   // this.enrutamiento.anterior = ''
  //   const {vehiculo, cliente, anterior, sucursal} = this.enrutamiento
  
  //   const queryParams = {vehiculo, cliente, sucursal}
  //   this.router.navigate([`/historial-cliente`], { 
  //     queryParams
  //   });
  // }
  

}
