
import { Component, OnInit, ViewChild, OnDestroy, AfterContentChecked, AfterViewInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { EmailsService } from 'src/app/services/emails.service';
import { child, get, getDatabase, onValue, ref, set, push , update} from 'firebase/database';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import { ExporterService } from 'src/app/services/exporter.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { Router } from '@angular/router';

interface ServicioEditar {
  reporte: any;
  observaciones: any;
  elementos: any[];
  iva: boolean;
  formaPago: string;
  margen: number;
  // pathPDF: any;
  status: any;
  servicio: string;
  tecnico: any;
  showNameTecnico: string;
  descuento: number;
}

const db = getDatabase()
const dbRef = ref(getDatabase());

import { CitaComponent } from '../cita/cita.component';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ServiciosComponent implements OnInit, OnDestroy {

  
  constructor( 
    private _publicos: ServiciosPublicosService, 
    private _email:EmailsService, 
    private _security:EncriptadoService,
    private _export_excel: ExporterService,
    private _sucursales: SucursalesService,
    private _clientes: ClientesService,
    private _cotizaciones: CotizacionesService,
    private _vehiculos: VehiculosService,
    private _servicios: ServiciosService,
    private _campos: CamposSystemService,
    private router: Router,
    private _reporte_gastos: ReporteGastosService

    ) {
      // this.columnasRecepcionesExtended[6] = 'expand';
     }
     miniColumnas:number = 100
     _rol:string; _sucursal:string
     
     recepciones_arr=[]
     recepciones_arr_antes_filtro=[]
  
   
     fechas_filtro = new FormGroup({
      start: new FormControl(new Date()),
      end: new FormControl(new Date()),
     });

     fecha_formateadas = {start:new Date(), end:new Date() }
     hora_start = '00:00:01';
     hora_end = '23:59:59';

     array_recepciones = []

 
     ngOnDestroy(){
     
     }
    ngOnInit(): void {
      this.rol()
      this.vigila_calendario()
    }

  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal 
    this.lista_cotizaciones()
  }

  async lista_cotizaciones(){
    const recepciones = await this._publicos.revisar_cache('recepciones')
    const recepciones_arr = this._publicos.crearArreglo2(recepciones)

    const clientes = await this._publicos.revisar_cache('clientes')
    const vehiculos = await this._publicos.revisar_cache('vehiculos')

    const historial_gastos_orden = this._publicos.crearArreglo2(await this._publicos.revisar_cache('historial_gastos_orden'))
    const historial_pagos_orden = this._publicos.crearArreglo2(await this._publicos.revisar_cache('historial_pagos_orden'))

    const cotizaciones_completas =this._publicos.asigna_datos_recepcion({
      bruto:recepciones_arr, clientes, vehiculos,
      historial_gastos_orden, historial_pagos_orden
    })

    const ordenar = (this._sucursal === 'Todas') ? cotizaciones_completas : this._publicos.filtra_campo(cotizaciones_completas,'sucursal',this._sucursal)
    
    this.recepciones_arr_antes_filtro = this._publicos.ordenamiento_fechas(ordenar,'fecha_recibido',false)

    this.resetea_horas_admin()
  }

  vigila_calendario(){
    this.fechas_filtro.valueChanges.subscribe(({start:start_, end: end_})=>{
      if (start_ && start_['_d'] && end_ && end_['_d'] ) {
        if (end_['_d'] >= start_['_d']) {
          this.resetea_horas_admin()
        }
      }
    })
  }
  async resetea_horas_admin(){
    const {start, end } = this.fechas_filtro.value

    this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
    this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(end),this.hora_end)

    const {start:start_, end: end_} = this.fecha_formateadas

    const filtro_fechas = this._publicos.filtro_fechas(this.recepciones_arr_antes_filtro,'fecha_recibido',start_,end_)

    setTimeout(() => {
      this.recepciones_arr = filtro_fechas
    }, 1000);
    
  }
  irPagina(pagina, data){
    // console.log(data);
    const {cliente, sucursal, id: idCotizacion, tipo, vehiculo } = data
    // console.log(this.enrutamiento);
    let queryParams = {}
    if (pagina === 'cotizacionNueva' && !tipo) {
      queryParams = { anterior:'cotizacion',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion',vehiculo} 
    }else if (pagina === 'cotizacionNueva' && tipo) {
      queryParams = { anterior:'cotizacion', tipo} 
    }else if (pagina === 'ServiciosConfirmar' && !tipo) {
      queryParams = { anterior:'cotizacion',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion',vehiculo} 
    }else if (pagina === 'ServiciosConfirmar' && tipo) {
      queryParams = { anterior:'cotizacion', tipo}
    }
    // console.log(queryParams);
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  

 
}
  
  
  

