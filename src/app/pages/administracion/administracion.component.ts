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
  
  ngOnInit(): void {
    this.rol()
    this.vigila_calendario()
  }

  rol(){
    const { rol, sucursal } = this._security.usuarioRol()
    this._rol = rol
    this._sucursal = sucursal
    this.filtro_sucursal = sucursal
    this.vigila_hijo()
  }

  vigila_hijo(){
    const rutas_vigila = [
      'clientes',
      'vehiculos',
      'recepciones',
      'historial_gastos_operacion',
      'historial_gastos_orden',
      'historial_pagos_orden',
    ]
    rutas_vigila.forEach(nombre=>{
      const starCountRef = ref(db, `${nombre}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          this.lista_gastos_administracion()
        }
      })
    })
    
  }


  async lista_gastos_administracion(){
    
    console.time('Execution Time');
      const recepciones_object = await this._publicos.revisar_cache('recepciones')
      const historial_gastos_orden = this._publicos.crearArreglo2(await this._publicos.revisar_cache('historial_gastos_orden'))
      const historial_pagos_orden = this._publicos.crearArreglo2(await this._publicos.revisar_cache('historial_pagos_orden'))

      const gastos_operacion_object = await this._publicos.revisar_cache('historial_gastos_operacion')
      const gastos_operacion_array = this._publicos.crearArreglo2(gastos_operacion_object)

      const clientes = await this._publicos.revisar_cache('clientes')
      const vehiculos = await this._publicos.revisar_cache('vehiculos')

      const entregadas = this._publicos.filtra_campo(this._publicos.crearArreglo2(recepciones_object),'status','entregado')

      const enviar_recepciones = {
        bruto: entregadas, 
        clientes, 
        vehiculos, 
        historial_gastos_orden, 
        historial_pagos_orden
      }

      const antes_filtro_recepciones = this._publicos.asigna_datos_recepcion(enviar_recepciones)
      // console.log(antes_filtro_recepciones);
      const {start:start_, end: end_} = this.fecha_formateadas
      const filtro_sucursales = this._publicos.filtro_fechas(antes_filtro_recepciones,'fecha_recibido',start_,end_)
      // console.log(recepciones_arr);
      const recepciones_arr = (this.filtro_sucursal === 'Todas') 
        ?  filtro_sucursales 
        : this._publicos.filtra_campo(filtro_sucursales,'sucursal',this.filtro_sucursal)
    
      const filtro_fechas_operacion = this._publicos.filtro_fechas(gastos_operacion_array,'fecha_recibido',start_,end_)
      // console.log(filtro_fechas_operacion);
      const total_gastos_operacion = this._publicos.sumatorias_aprobados(filtro_fechas_operacion)
      // console.log(total_gastos_operacion);
      const total_refacciones = this._publicos.suma_refacciones_os_cerradas_reales(recepciones_arr)
      // console.log(total_refacciones);
      const total_subtotales_ventas = this._publicos.suma_gastos_ordenes_subtotales_reales(recepciones_arr)
      // console.log(total_subtotales_ventas);
      let margen:number = 0, por_margen:number = 0, total_ordenes:number =0
      total_ordenes = recepciones_arr.length
      if (total_subtotales_ventas > 0) {
        margen = total_subtotales_ventas - total_refacciones
        por_margen = (margen / total_subtotales_ventas) * 100
      }

      // console.log(recepciones_arr);
      
      this.reporteAdministracion.cantidad = total_ordenes
      this.reporteAdministracion.margen = margen
      this.reporteAdministracion.operacion = total_gastos_operacion
      this.reporteAdministracion.por_margen = por_margen
      this.reporteAdministracion.refacciones = total_refacciones
      this.reporteAdministracion.subtotal = total_subtotales_ventas

      this.recepciones_arr = recepciones_arr
      console.timeEnd('Execution Time');
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
      this.lista_gastos_administracion()
    }, 500);
  }

  data_deposito(event){
    if (event) this._publicos.cerrar_modal('modal-deposito')
  }



}
