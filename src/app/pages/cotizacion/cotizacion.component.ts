import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

export interface Item { id: string; name: string; }
import { animate, state, style, transition, trigger } from '@angular/animations';

import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

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
    private _publicos: ServiciosPublicosService, private _security:EncriptadoService,private router: Router, 
    private rutaActiva: ActivatedRoute
  ) {
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

  objecto_actual:any ={}
  async ngOnInit() {
    this.rol()
    this.vigila_calendario()
    this.resetea_horas_admin()
  }
  ngAfterViewInit(): void { 
  }
  ngOnDestroy(): void {}
  irPagina(pagina){

    const anterior = this._publicos.extraerParteDeURL()
    const queryParams = {}
    queryParams['anterior'] = anterior
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  rol() {
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal

    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
    });
    
    this.asiganacion_resultados()
    this.segundo_llamado()
  }

  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.revision_cache('cotizaciones')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }

  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.revision_cache('cotizaciones')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asiganacion_resultados()
      }
    },500)
  }
  asiganacion_resultados(){
    this.objecto_actual = this._publicos.revision_cache('cotizaciones')

    const objetoFiltrado = this._publicos.filtrarObjetoPorPropiedad(this.objecto_actual, 'sucursal', this._sucursal);

    const {start, end }= this.fecha_formateadas

    const objeto_filtrado_fecha = this._publicos.filtrarObjetoPorPropiedad_fecha(objetoFiltrado, start, end)

    const data_recuperda_arr = this._publicos.crearArreglo2(objeto_filtrado_fecha)

    const cotizaciones_completas =this._publicos.nueva_asignacion_cotizaciones(data_recuperda_arr)

    const campos = [
      'cliente',
      'data_cliente',
      'vehiculo',
      'data_vehiculo',
      'vehiculos',
      'elementos',
      'sucursal',
      'reporte',
      // 'iva',
      'formaPago',
      'descuento',
      'margen',
      'promocion',
      // 'fecha_recibido',
      'no_cotizacion',
      'vencimiento',
      'nota',
      'servicio',
      // 'pdf',
      // 'data_sucursal',
    ]
     

    setTimeout(() => {
      this.cotizaciones_arr = this.cotizaciones_arr.length ? this._publicos.actualizarArregloExistente(this.cotizaciones_arr, cotizaciones_completas, campos) : cotizaciones_completas;
    }, 100);

    // this.cotizaciones_arr = (!this.cotizaciones_arr.length) 
    // ? data_recuperda_arr
    // :  this._publicos.actualizarArregloExistente(this.cotizaciones_arr, cotizaciones_completas, campos )

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
    this.asiganacion_resultados()
    
  }
  
}
