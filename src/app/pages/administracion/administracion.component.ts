import { Component, OnInit } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { FormControl, FormGroup } from '@angular/forms';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { getDatabase, onValue, ref } from 'firebase/database';


const db = getDatabase()

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css'],
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
export class AdministracionComponent implements OnInit {

  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService, 
    private _sucursales: SucursalesService) { }
  
    miniColumnas:number = 100
    _rol:string
    _sucursal:string

    recepciones_arr:any[]=[]

    reporteAdministracion = {
      refacciones:0, subtotal:0, operacion:0, cantidad:0,
      margen:0, por_margen:0
    }
    camposReporteAdministracion = [
      {valor:'cantidad', show:'Ordenes cerradas'},
      {valor:'subtotal', show:'Monto de ventas (Antes de IVA)'},
      {valor:'refacciones', show:'Costos Refacciones (de los autos cerrados)'},
      {valor:'operacion', show:'Costo Operacion'},
      {valor:'margen', show:'Margen'},
      {valor:'por_margen', show:'% Margen'},
    ]

    fechas_filtro = new FormGroup({
      start: new FormControl(new Date()),
      end: new FormControl(new Date()),
     });

     fecha_formateadas = {start:new Date(), end:new Date() }
     hora_start = '00:00:01';
     hora_end = '23:59:59';

     sucursales_array = [...this._sucursales.lista_en_duro_sucursales]

     filtro_sucursal:string
     realizaGasto:string = 'gasto'
  
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
  ngOnInit(): void {
    this.rol()
    this.vigila_calendario()
  }

  rol(){
    const { rol, sucursal } = this._security.usuarioRol()
    this._rol = rol
    this._sucursal = sucursal
    this.filtro_sucursal = sucursal
    this.primer_comprobacion_resultados_multiple()
  }
  comprobacion_resultados_multiple(campo){
    const objecto_recuperdado = this._publicos.nueva_revision_cache(campo)
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actuales[campo], objecto_recuperdado);
  }
  primer_comprobacion_resultados_multiple(){
    this.campo_vigilar.forEach(campo_vigila=>{
      this.asiganacion_resultados_multiples(campo_vigila)
    })
    this.segundo_llamado_multiple()
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

    },1500)
  }
  asiganacion_resultados_multiples(campo_vigila){
    this.objecto_actuales[campo_vigila] = this._publicos.nueva_revision_cache(campo_vigila)
    this.genera_resultados()
  }
  genera_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('recepciones')

    const objetoFiltrado = this._publicos.filtrarObjetoPorPropiedad(objecto_recuperdado, 'sucursal', this.filtro_sucursal);

    const {start, end }= this.fecha_formateadas

    const objeto_filtrado_fecha = this._publicos.filtrarObjetoPorPropiedad_fecha(objetoFiltrado, start, end)

    const data_recuperda_arr = this._publicos.crearArreglo2(objeto_filtrado_fecha)

    const recepciones_completas =this._publicos.nueva_asignacion_recepciones(data_recuperda_arr)

    // console.log(recepciones_completas);

    //obeterner los gastos de operacion 

    // console.log('==========><==========');
    
    const gastos_operacion = this._publicos.nueva_revision_cache('historial_gastos_operacion')
    // console.log(gastos_operacion);
    // console.log(this.filtro_sucursal);
    const objetoFiltrado_operacion = this._publicos.filtrarObjetoPorPropiedad(gastos_operacion, 'sucursal', this.filtro_sucursal);
    // console.log(objetoFiltrado_operacion);
    const objeto_filtrado_fecha_operacion = this._publicos.filtrarObjetoPorPropiedad_fecha(objetoFiltrado_operacion, start, end)
    // console.log(objeto_filtrado_fecha_operacion);
    const array_operacion = this._publicos.crearArreglo2(objeto_filtrado_fecha_operacion)
    // console.log(array_operacion);
    
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

    const total_gastos_operacion = this._publicos.sumatorias_aprobados(array_operacion)
    // console.log(total_gastos_operacion);
    

    this.objecto_actual = objecto_recuperdado
    this.recepciones_arr = (!this.recepciones_arr.length) 
    ? recepciones_completas
    :  this._publicos.actualizarArregloExistente(this.recepciones_arr, recepciones_completas, campos )

    
    let margen:number = 0, por_margen:number = 0, total_ordenes:number =0
      total_ordenes = this.recepciones_arr.length
      // const total_gastos_operacion = this._publicos.sumatorias_aprobados(filtro_fechas_operacion)
      const total_refacciones = this._publicos.suma_refacciones_os_cerradas_reales(this.recepciones_arr)
      const total_subtotales_ventas = this._publicos.suma_gastos_ordenes_subtotales_reales(this.recepciones_arr)
      if (total_subtotales_ventas > 0) {
        margen = total_subtotales_ventas - total_refacciones
        por_margen = (margen / total_subtotales_ventas) * 100
      }
      this.reporteAdministracion.cantidad = total_ordenes
      this.reporteAdministracion.margen = margen
      this.reporteAdministracion.operacion = total_gastos_operacion
      this.reporteAdministracion.por_margen = por_margen
      this.reporteAdministracion.refacciones = total_refacciones
      this.reporteAdministracion.subtotal = total_subtotales_ventas


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

  data_deposito(event){
    if (event) this._publicos.cerrar_modal('modal-deposito')
  }



}
