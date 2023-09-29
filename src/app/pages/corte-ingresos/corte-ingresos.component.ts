import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

@Component({
  selector: 'app-corte-ingresos',
  templateUrl: './corte-ingresos.component.html',
  styleUrls: ['./corte-ingresos.component.css']
})
export class CorteIngresosComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService,
    private _sucursales: SucursalesService) { }
  
  _rol:string
  _sucursal: string

  recepciones_arr:any[]=[]

  reporte = {total_ordenes:0,objetivo:0, operacion: 0, orden:0, ventas:0, sobrante:0, porcentajeGM:0, porcentaje:0, ticketPromedio:0}
  camposReporte = [
    {valor:'ticketPromedio', show:'Ticket Promedio'},
    {valor:'objetivo', show:'Objetivo'},
    {valor:'ventas', show:'Total ventas'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    {valor:'sobrante', show:'GM'},
  ]
  metodospago = [
    {metodo:'1', show:'Efectivo'},
    {metodo:'2', show:'Cheque'},
    {metodo:'3', show:'Tarjeta'},
    {metodo:'4', show:'OpenPay'},
    {metodo:'5', show:'Clip'},
    {metodo:'6', show:'BBVA'},
    {metodo:'7', show:'BANAMEX'},
    {metodo:'8', show:'credito'}
  ]
  metodos = {
    Efectivo:0,
    Cheque:0,
    Tarjeta:0,
    OpenPay:0,
    Clip:0,
    BBVA:0,
    BANAMEX:0,
    credito:0,
  }

  recepciones_arr_antes_filtro=[]
  
  filtro_sucursal:string

  sucursales_array = [...this._sucursales.lista_en_duro_sucursales]
   
  fechas_filtro = new FormGroup({
   start: new FormControl(new Date()),
   end: new FormControl(new Date()),
  })

  fecha_formateadas = {start:new Date(), end:new Date() }
  hora_start = '00:00:01';
  hora_end = '23:59:59';
  
  ngOnInit(): void {
    this.rol()
    this.vigila_calendario()
    this.resetea_horas_admin()
  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal
    this.filtro_sucursal = sucursal
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

    setTimeout(() => {
      this.listado_corte_ingresos()
    }, 500);


    
  }
  async listado_corte_ingresos(){
    const metas_sucursales = await this._publicos.revisar_cache('metas_sucursales')

    const recepciones_object = await this._publicos.revisar_cache('recepciones')

    const clientes = await this._publicos.revisar_cache('clientes')
    const vehiculos = await this._publicos.revisar_cache('vehiculos')

    const historial_gastos_orden = this._publicos.crearArreglo2(await this._publicos.revisar_cache('historial_gastos_orden'))
    const historial_pagos_orden = this._publicos.crearArreglo2(await this._publicos.revisar_cache('historial_pagos_orden'))

    const gastos_operacion_object = await this._publicos.revisar_cache('historial_gastos_operacion')
    const gastos_operacion_array = this._publicos.crearArreglo2(gastos_operacion_object)

    const arreglo_recepciones = this._publicos.crearArreglo2(recepciones_object)

    const solo_entregadas = arreglo_recepciones.filter(s=>s.status === 'entregado')

    const {start:start_, end: end_} = this.fecha_formateadas

    const filtro_fechas_entregadas = this._publicos.filtro_fechas(solo_entregadas,'fecha_recibido',start_,end_)

    const enviar_recepciones = {
      bruto: filtro_fechas_entregadas, 
      clientes, 
      vehiculos, 
      historial_gastos_orden, 
      historial_pagos_orden
    }

    const filtro_sucursales = this._publicos.asigna_datos_recepcion(enviar_recepciones)

    const recepciones_arr = (this.filtro_sucursal === 'Todas') 
    ?  filtro_sucursales 
    : this._publicos.filtra_campo(filtro_sucursales,'sucursal',this.filtro_sucursal)

    const solo_gastos_orden = this._publicos.obtener_historial_orden(recepciones_arr,'historial_gastos_orden')

    const filtro_fechas_operacion = this._publicos.filtro_fechas(gastos_operacion_array,'fecha_recibido',start_,end_)

    const total_gastos_operacion = this._publicos.sumatorias_aprobados(filtro_fechas_operacion)

    const total_gastos_ordenes = this._publicos.sumatorias_aprobados(solo_gastos_orden)

    const total_subtotales_ventas = this._publicos.suma_gastos_ordenes_subtotales(recepciones_arr)

    let  total_ordenes:number = recepciones_arr.length

    const fecha_start = new Date(start_)
    const fecha_end = new Date(end_)

    const sucursales = [
      '-N2gkVg1RtSLxK3rTMYc',
      '-N2gkzuYrS4XDFgYciId',
      '-N2glF34lV3Gj0bQyEWK',
      '-N2glQ18dLQuzwOv3Qe3',
      '-N2glf8hot49dUJYj5WP',
      '-NN8uAwBU_9ZWQTP3FP_',
    ]
    let sucursales_busqueda = (this.filtro_sucursal !== 'Todas') ? [this.filtro_sucursal] : sucursales

    const objetivo:number = this._publicos.sucursales_objetivos(
      {sucursales: sucursales_busqueda, metas_sucursales, fecha_start, fecha_end}
    )

    this.reporte.objetivo = objetivo 
    this.reporte.operacion = total_gastos_operacion
    this.reporte.orden = total_gastos_ordenes
    this.reporte.total_ordenes = total_ordenes

    if (total_subtotales_ventas) {
      const ticketPromedio = total_subtotales_ventas / total_ordenes
      const sobrante = total_subtotales_ventas - (total_gastos_operacion + total_gastos_ordenes)
      const porcentajeGM =  (sobrante / total_subtotales_ventas) * 100
  
      this.reporte.porcentaje = (total_subtotales_ventas / objetivo) * 100
      this.reporte.ticketPromedio = ticketPromedio
      this.reporte.ventas = total_subtotales_ventas
      this.reporte.sobrante = sobrante
      this.reporte.porcentajeGM = porcentajeGM

    }
    this.recepciones_arr = recepciones_arr

  }
  
}
