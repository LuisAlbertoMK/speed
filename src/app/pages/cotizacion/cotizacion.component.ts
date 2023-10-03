import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { getDatabase, onValue, ref, set, push, get, child, limitToFirst } from 'firebase/database';
import { CotizacionService } from 'src/app/services/cotizacion.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {
  nombre: string;
}

export interface Item { id: string; name: string; }
import { animate, state, style, transition, trigger } from '@angular/animations';

import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ExporterService } from '../../services/exporter.service';
import { FormControl, FormGroup } from '@angular/forms';

registerLocaleData(localeES, 'es');
@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
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
export class CotizacionComponent implements AfterViewInit, OnDestroy, OnInit {
  
  constructor(
    private _publicos: ServiciosPublicosService, private _security:EncriptadoService, private _campos: CamposSystemService,
    private router: Router, private _sucursales: SucursalesService, private _cotizacion: CotizacionService,
    private _servicios: ServiciosService, private _cotizaciones: CotizacionesService, private _clientes: ClientesService,
    private _vehiculos: VehiculosService, private rutaActiva: ActivatedRoute, private _exporter_excel: ExporterService
  ) {
    // this.itemsCollection = this.afs.collection<Item>('partesAuto');
    // this.items = this.itemsCollection.valueChanges()
   
  }
  miniColumnas:number = 100
  
  _rol:string; _sucursal:string
  
  cotizaciones_arr:any[]=[]
  cotizaciones_arr_antes_filtro:any[]=[]
  enrutamiento = {cliente:'', sucursal:'', recepcion:'', tipo:'', anterior:'', vehiculo:''}
  fecha_formateadas = {start:new Date(), end:new Date() }
  hora_start = '00:00:01';
  hora_end = '23:59:59';
  fechas_filtro = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
   });
  async ngOnInit() {
    this.rol()
    this.vigila_calendario()
    this.vigila_hijo()
  }
  ngAfterViewInit(): void { 
  }
  ngOnDestroy(): void {}
  rol() {
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal

    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
    });
    this.lista_cotizaciones()
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


  async vigila_hijo(){
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.lista_cotizaciones()
      }
    })
  }
  async lista_cotizaciones(){
    const cotizacionesRealizadas = await this._publicos.revisar_cache('cotizacionesRealizadas')
    const cotizaciones_arr = this._publicos.crearArreglo2(cotizacionesRealizadas)

    const clientes = await this._publicos.revisar_cache('clientes')
    const vehiculos = await this._publicos.revisar_cache('vehiculos')

    // console.log(cotizaciones_arr);
    

    const cotizaciones_completas =this._publicos.asigna_datos_cotizaciones({bruto:cotizaciones_arr, clientes, vehiculos})

    const ordenar = (this._sucursal === 'Todas') ? cotizaciones_completas : this._publicos.filtra_campo(cotizaciones_completas,'sucursal',this._sucursal)

    this.cotizaciones_arr_antes_filtro = this._publicos.ordenamiento_fechas(ordenar,'fecha_recibido',false)

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

    const filtro_fechas = this._publicos.filtro_fechas(this.cotizaciones_arr_antes_filtro,'fecha_recibido',start_,end_)

    setTimeout(() => {
      this.cotizaciones_arr = filtro_fechas
    }, 1000);
    
  }
  
}
