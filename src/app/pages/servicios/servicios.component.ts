
import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';


import { animate, state, style, transition, trigger } from '@angular/animations';

import {  getDatabase, ref } from 'firebase/database';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';


import { EncriptadoService } from 'src/app/services/encriptado.service';

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

// const db = getDatabase()
// const dbRef = ref(getDatabase());


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
    private _security:EncriptadoService,
    private router: Router,

    ) {
      // this.columnasRecepcionesExtended[6] = 'expand';
     }
     miniColumnas:number = 100
     _rol:string; _sucursal:string
     

     fechas_filtro = new FormGroup({
      start: new FormControl(new Date()),
      end: new FormControl(new Date()),
     });

     fecha_formateadas = {start:new Date(), end:new Date() }
     hora_start = '00:00:01';
     hora_end = '23:59:59';

     recepciones_arr=[]
     objecto_actual:any ={}
     objecto_actuales:any = {
      recepciones:{},
      historial_gastos_orden:{},
      historial_pagos_orden:{},
     }

     campo_vigilar = [
      'recepciones',
      'historial_gastos_orden',
      'historial_pagos_orden',
    ]
 
     ngOnDestroy(){
     
     }
    ngOnInit(): void {
      this.resetea_horas_admin()
      this.rol()
      this.vigila_calendario()
      
    }

  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal 

    // this.primer_comprobacion_resultados()
    this.campo_vigilar.forEach(campo_vigila=>{
      this.asiganacion_resultados_multiples(campo_vigila)
    })
    this.segundo_llamado_multiple()
    
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

    this.genera_resultados()
    
  }
  
  comprobacion_resultados_multiple(campo){
    const objecto_recuperdado = this._publicos.nueva_revision_cache(campo)
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actuales[campo], objecto_recuperdado);
  }

  segundo_llamado_multiple(){
    setInterval(()=>{
      this.campo_vigilar.forEach(campo_vigila=>{
        if (!this.comprobacion_resultados_multiple(campo_vigila)) {
          console.log(`recuperando data ${campo_vigila}`);
          this.objecto_actuales[campo_vigila] = this._publicos.crear_new_object(this._publicos.nueva_revision_cache(campo_vigila))
          this.asiganacion_resultados_multiples(this.campo_vigilar)
        }
      })
    },500)
  }
  asiganacion_resultados_multiples(campo_vigila){
    this.objecto_actuales[campo_vigila] = this._publicos.nueva_revision_cache(campo_vigila)
    this.genera_resultados()
  }
  genera_resultados(){
    this.objecto_actual = this._publicos.nueva_revision_cache('recepciones')

    const objetoFiltrado = this._publicos.filtrarObjetoPorPropiedad(this.objecto_actual, 'sucursal', this._sucursal);

    const {start, end }= this.fecha_formateadas

    const objeto_filtrado_fecha = this._publicos.filtrarObjetoPorPropiedad_fecha(objetoFiltrado, start, end)

    const data_recuperda_arr = this._publicos.crearArreglo2(objeto_filtrado_fecha)

    const recepciones_completas =this._publicos.nueva_asignacion_recepciones(data_recuperda_arr)

    const campos = [
      'data_cliente',
      'data_sucursal',
      'data_vehiculo',
      'diasSucursal',
      'fecha_entregado',
      'fecha_promesa',
      'fecha_recibido',
      'fullname',
      'notifico',
      'status',
      'tecnico',
      'tecnicoShow',
      // 'cliente',
      // 'descuento',
      // 'elementos',
      // 'formaPago',
      // 'iva',
      // 'margen',
      // 'no_cotizacion',
      // 'nota',
      // 'pdf',
      // 'promocion',
      // 'reporte',
      // 'servicio',
      // 'sucursal',
      // 'vehiculo',
      // 'vehiculos',
      // 'vencimiento',
    ]

    

    setTimeout(() => {
      this.recepciones_arr = this.recepciones_arr.length ? this._publicos.actualizarArregloExistente(this.recepciones_arr, recepciones_completas, campos) : recepciones_completas;
    }, 100);

  }
  
  irPagina(pagina){
    const anterior = this._publicos.extraerParteDeURL()
    const queryParams = {}
    queryParams['anterior'] = anterior
    this.router.navigate([`/${pagina}`], { queryParams });
  }

 
}
  
  
  

