import { Component, OnInit } from '@angular/core';

import { AutomaticosService } from '../../services/automaticos.service';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from '../../services/encriptado.service';

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { MO, refacciones, recepciones } from './ayuda';
import { BD } from './BD_completa';
pdfMake.vfs = pdfFonts.pdfMake.vfs



import { getDatabase, ref, onChildAdded, onChildChanged, onChildRemoved, onValue } from "firebase/database";

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ExporterService } from 'src/app/services/exporter.service';


const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-automaticos',
  templateUrl: './automaticos.component.html',
  styleUrls: ['./automaticos.component.css']
})
export class AutomaticosComponent implements OnInit {
  
  constructor(private _automaticos: AutomaticosService, private _encript: EncriptadoService, private _publicos: ServiciosPublicosService,
    private _security:EncriptadoService, public _router: Router, public _location: Location,private _pdfRecepcion: PdfRecepcionService,
    private _sucursales: SucursalesService, private _clientes: ClientesService, private _vehiculos: VehiculosService, 
    private formBuilder: FormBuilder, private _servicios: ServiciosService, private _exporter:ExporterService,

    ) {   }
  
    sucursales_array = [...this._sucursales.lista_en_duro_sucursales]

    claves_sucursales = [
      '-N2gkVg1RtSLxK3rTMYc',
      '-N2gkzuYrS4XDFgYciId',
      '-N2glF34lV3Gj0bQyEWK',
      '-N2glQ18dLQuzwOv3Qe3',
      '-N2glf8hot49dUJYj5WP',
      '-NN8uAwBU_9ZWQTP3FP_',
    ]
  _sucursal:string

  mensaje_actualizacion:boolean = true


  formulario_etiqueta: FormGroup

  anios = this._vehiculos.anios
  marcas_vehiculos = this._vehiculos.marcas_vehiculos
  marcas_vehiculos_id = []
  array_modelos = []
  faltante_s:string
  vehiculos_compatibles = [
    {
      "marca": "Chevrolet",
      "modelo": "Camaro ZL1",
      "anio_inicial": "1999",
      "anio_final": "1999"
    },
    {
      "marca": "Pontiac",
      "modelo": "Matiz",
      "anio_inicial": "1996",
      "anio_final": "2001"
    },
    {
      "marca": "Aston Martín",
      "modelo": "DBX",
      "anio_inicial": "1996",
      "anio_final": "1996"
    }
  ]

  recepciones_arr:any=[]
  cotizaciones_arr:any=[]
  clientes_arr:any=[]
  vehiculos_arr:any=[]

  // TODO esto pertenece a administracion
  
  hora_start = '00:00:01';
  hora_end = '23:59:59';

  fechas_getAdministracion ={start:new Date(), end:new Date() }
  fechas_get_formateado_admin = {start:new Date(), end:new Date() }

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
  // TODO esto pertenece a administracion

  // TODO pertenece a corte de ingresos
  reporte = {objetivo:0, operacion: 0, orden:0, ventas:0, sobrante:0, porcentajeGM:0, porcentaje:0, ticketPromedio:0, refacciones:0}
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
  // TODO pertenece a corte de ingresos
  //TODO reporte de gastos
  reporte_gastos = {deposito: 0, operacion: 0, sobrante:0, orden:0, restante:0}
  camposReporte_gastos = [
    {valor:'deposito', show:'Depositos'},
    {valor:'sobrante', show:'Suma de sobrantes'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    {valor:'restante', show:'Sobrante op'},
  ]
  //TODO reporte de gastos


  ngOnInit(): void {
    this.rol()
    const n = this._publicos.crearArreglo2(this._vehiculos.marcas_vehiculos)
    this.marcas_vehiculos_id = n.map(c=>{
      return c.id
    })
    // this.vigila_hijo()
  }
    rol(){
        const { rol, sucursal, usuario } = this._security.usuarioRol()
        this._sucursal = sucursal
    }

    async vigila_hijo(arreglo:any[]){
      
      let nombre  = 'clientes'

      const commentsRef = ref(db, `${nombre}` );

      const variable_busqueda = await this._publicos.revisar_cache(`${nombre}`)      

      const variable_busqueda_arr = this._publicos.crearArreglo2(variable_busqueda)

      const nueva_data_clientes = JSON.parse(JSON.stringify(variable_busqueda));

      if (variable_busqueda) {
        onChildAdded(commentsRef, (data) => {
          // console.log('nuevos');
          const key = data.key
          const valor = data.val()

          if (!nueva_data_clientes[key]) {
              nueva_data_clientes[key] = valor
              this._encript.guarda_informacion({nombre, data: nueva_data_clientes })
          }else{
            nueva_data_clientes[key] = valor
            this._encript.guarda_informacion({nombre, data: nueva_data_clientes })
          }          
        });
      }
      variable_busqueda_arr.forEach(cliente=>{
        const {id:id_nombre} = cliente
        const commentsRef_childs = ref(db, `${nombre}/${id_nombre}` );
        onChildChanged(commentsRef_childs, (data) => {
          const key_child = data.key
          const valor = data.val()
          if (nueva_data_clientes[id_nombre]) {
            nueva_data_clientes[id_nombre][key_child] = valor
            // console.log(nueva_data_clientes[id_nombre]);
            this._encript.guarda_informacion({nombre, data: nueva_data_clientes })
          }
        });
      })
    }




    manejar_cache(){
      const obtener = [
        'historial_gastos_orden',
        'historial_pagos_orden',
        'clientes',
        'recepciones',
        'cotizaciones',
        'cotizacionesRealizadas',
        'historial_gastos_diarios',
        'historial_gastos_operacion',
        'vehiculos',
        'metas_sucursales',
        'sucursales'
      ]

      obtener.forEach(camp=>{
        const nombre:string = `${camp}`.toString()
        console.log(nombre);
        const starCountRef = ref(db, `${nombre}`)
          onValue(starCountRef, (snapshot) => {
            if (snapshot.exists()) {
              this._encript.guarda_informacion({nombre, data: snapshot.val()})
            }
          })
      })
      
    }

    revisar_cache(nombre:string){
      const objeto_desencriptado = localStorage.getItem(`${nombre}`)
      const desc = this._encript.servicioDecrypt_object(objeto_desencriptado)
      const nueva = JSON.parse(JSON.stringify(desc));
      return nueva
    }
    armar_informacion(){
      console.time('Execution Time');
    
      const recepciones_object = this.revisar_cache('recepciones')
      const cotizacionesRealizadas_object = this.revisar_cache('cotizacionesRealizadas')

      const historial_gastos_orden = this.crearArreglo2(this.revisar_cache('historial_gastos_orden'))
      const historial_pagos_orden = this.crearArreglo2(this.revisar_cache('historial_pagos_orden'))

      const gastos_operacion_object = this.revisar_cache('historial_gastos_operacion')
      const gastos_operacion_array = this.crearArreglo2(gastos_operacion_object)

      const historial_gastos_diarios_object = this.revisar_cache('historial_gastos_diarios')
      const historial_gastos_diarios_array = this.crearArreglo2(historial_gastos_diarios_object)

      
      const clientes = this.revisar_cache('clientes')
      const vehiculos = this.revisar_cache('vehiculos')

      const clientes_arr = this.transformaDataCliente(this.crearArreglo2(clientes))
      
      const vehiculos_arr = this.transformaDataVehiculo({ vehiculos: this.crearArreglo2(vehiculos), clientes})

      const enviar_recepciones = {
        bruto: this.crearArreglo2(recepciones_object), 
        clientes, 
        vehiculos, 
        historial_gastos_orden, 
        historial_pagos_orden
      }
      const enviar_cotizaciones = {
        bruto: this.crearArreglo2(cotizacionesRealizadas_object), 
        clientes, 
        vehiculos, 
        historial_gastos_orden, 
        historial_pagos_orden
      }
      const recepciones_arr = this.asigna_datos_recepcion(enviar_recepciones)
      const cotizaciones_arr = this.asigna_datos_cotizaciones(enviar_cotizaciones)
      
      this.clientes_arr = clientes_arr
      this.vehiculos_arr = vehiculos_arr
      this.recepciones_arr = recepciones_arr
      console.log(this.recepciones_arr);
      
      this.cotizaciones_arr = cotizaciones_arr

      //empezar con administracion

      const servicios_terminados = recepciones_arr.filter(s=>s.status === 'entregado')

      const solo_gastos_orden = this.obtener_historial_orden(servicios_terminados,'historial_gastos_orden')
      // console.log(solo_gastos_orden);
      const solo_pagos_orden = this.obtener_historial_orden(servicios_terminados,'historial_pagos_orden')
      // console.log(solo_pagos_orden);
      const total_gastos_ordenes = this.sumatorias_aprobados(solo_gastos_orden)
      // console.log(total_gastos_ordenes);
      const total_pagos_ordenes = this.sumatorias_aprobados(solo_pagos_orden)
      // console.log(total_pagos_ordenes);
      const total_gastos_operacion = this.sumatorias_aprobados(gastos_operacion_array)
      // console.log(total_gastos_operacion);
      const total_historial_gastos_diarios = this.sumatorias_aprobados(historial_gastos_diarios_array)
      // console.log(total_historial_gastos_diarios);
      const total_refacciones = this.suma_refacciones_os_cerradas(recepciones_arr)
      // console.log(total_refacciones);
      const total_subtotales_ventas = this.suma_gastos_ordenes_subtotales(recepciones_arr)
      // console.log(total_subtotales_ventas);
      let margen:number = 0, por_margen:number = 0, total_ordenes:number =0
      total_ordenes = recepciones_arr.length
      if (total_subtotales_ventas > 0) {
        margen = total_subtotales_ventas - total_refacciones
        por_margen = (margen / total_subtotales_ventas) * 100
      }
      

      // this.reporteAdministracion.cantidad = total_ordenes
      // this.reporteAdministracion.margen = margen
      // this.reporteAdministracion.operacion = total_gastos_operacion
      // this.reporteAdministracion.por_margen = por_margen
      // this.reporteAdministracion.refacciones = total_refacciones
      // this.reporteAdministracion.subtotal = total_subtotales_ventas

      // console.log(this.reporteAdministracion);
      

      //TODO acciones corte de ingresos


      //TODO reporte de gastos
//       deposito
        // sobrante
        // operacion
        // orden
        // restante
        // console.log(solo_gastos_orden);
        // console.log(historial_gastos_diarios_array);
        

        let gastos_finales = [...solo_gastos_orden,...historial_gastos_diarios_array, ...gastos_operacion_array]
        
        const reporte_gastos = this.reporte_gastos_sucursal_unica(gastos_finales)
        // console.log(reporte_gastos);
        

      //TODO reporte de gastos

      // ticketPromedio
      // objetivo
      // ventas
      // operacion
      // orden
      // sobrante
      
      const ticketPromedio = total_subtotales_ventas / total_ordenes
      // this.reporte.ventas - (this.reporte.operacion + this.reporte.orden)
      const sobrante = total_subtotales_ventas - (total_gastos_operacion + total_gastos_ordenes)
      // (this.reporte.sobrante / this.reporte.ventas) *  100
      const porcentajeGM =  (sobrante / total_subtotales_ventas) * 100
      
      
      console.timeEnd('Execution Time');
    }
    generaExcel_corte_ingresos(){
      if (this.recepciones_arr.length) {
        const nueva_data = this.arreglar_info_recepciones(this.recepciones_arr)
        // const data_reporte_objetivos = this._publicos.crearArreglo2(this.reporte)
        // console.log(nueva_data);
        
        const casdgfh = [
          {valor:'objetivo', show:'Objetivo'},
          {valor:'ventas', show:'Total ventas'},
          {valor:'operacion', show:'Gastos de operación'},
          {valor:'orden', show:'Gastos de ordenes'},
          {valor:'refacciones', show:'Refacciones'},
          {valor:'sobrante', show:'GM'},
          {valor:'porcentajeGM', show:'% GM'},
          {valor:'ticketPromedio', show:'ticket Promedio'},
          {valor:'porcentaje', show:'% cumplido'},
        ]
  
        
        const data_reporte_objetivos = Object.keys(casdgfh).map((a,index)=>{
          const name = casdgfh[index].show
          return {
            Nombre: name,
            Valor: this.reporte[casdgfh[index].valor],
          }
        })
  
        // console.log(data_reporte_objetivos);
        const metodos_ = this.obtener_suma_metodos(nueva_data)
  
        let linea_blanca = 
        {
            no_os: '',
            placas:'',
            marca:'',
            modelo:'',
            descripcion:'',
            sucursal: '',
            empresa: '',
            tipo:'',
            Efectivo:'',
            Cheque:'',
            Tarjeta:'',
            OpenPay:'',
            Clip:'',
            BBVA:'',
            BANAMEX:'',
            credito:'',
            subtotal:'',
            iva:'',
            total:'',
            'status orden': '',
          }
          let nuevo_ob = JSON.parse(JSON.stringify(linea_blanca));
          Object.keys(this.metodos).forEach(m=>{
            nuevo_ob[m] = metodos_[m]
          })
          nueva_data.push({
            ...nuevo_ob,
            tipo: 'Totales formas pago'
          })
          nueva_data.push({
            ...linea_blanca
          })
          
  
        // console.log(nueva_data);
        // const {inicial, final} = this.fecha_formateadas
  
        // const { inicio: _inicial, final: _final } = this._publicos.getFirstAndLastDayOfCurrentMonth(inicial)
        // const { inicio: _inicial_, final: _final_ } = this._publicos.getFirstAndLastDayOfCurrentMonth(final)
  
        // const uno = this._publicos.retorna_fechas_hora({fechaString: new Date(_inicial)}).formateada
        // const uno_1 = this._publicos.retorna_fechas_hora({fechaString: new Date(_final_)}).formateada
  
        const dos = this._publicos.retorna_fechas_hora().formateada
  
        nueva_data.push({
          ...linea_blanca,
          Efectivo:'Arqueo Correspondiente a',
          Tarjeta:'Fecha de Realizacion',
        })
        nueva_data.push({
          ...linea_blanca,
          Efectivo: `${'uno'} - ${'uno_1'}`,
          Tarjeta: dos,
        })
        
        this._exporter.genera_excel_recorte_ingresos({arreglo: nueva_data, data_reporte_objetivos})
      }else{
        this._publicos.swalToast(`Ningun registro`,0)
      }
    }
    asigna_datos_recepcion(data){
      const {bruto, clientes, vehiculos, historial_gastos_orden, historial_pagos_orden} = data

      const nuevos_ordenamiento =this._publicos.ordenamiento_fechas(bruto,'fecha_recibido',false)
      return nuevos_ordenamiento.map(recepcion=>{
        const {id, cliente, vehiculo,elementos, margen, iva, descuento, formaPago, sucursal} = recepcion;
        recepcion.historial_gastos_orden = this.filtra_orden(historial_gastos_orden, id)
        recepcion.historial_pagos_orden = this.filtra_orden(historial_pagos_orden, id)
        recepcion.data_cliente = clientes[cliente]
        recepcion.data_vehiculo = vehiculos[vehiculo]
        recepcion.reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
        recepcion.data_sucursal = this._sucursales.lista_en_duro_sucursales.find(s=>s.id === sucursal)
        const solo_gastos_orden = this.obtener_historial_orden([recepcion],'historial_gastos_orden')
        const total_gastos = this.sumatorias_aprobados(solo_gastos_orden)
        // recepcion.reporte_real = sumatoria_reporte(total_gastos_ordenes, margen, iva)

        const nuevo = JSON.parse(JSON.stringify(recepcion.reporte));
        nuevo['refaccion'] = total_gastos

        const reporte_real = this.sumatoria_reporte(nuevo, margen, iva)
        recepcion.reporte_real = reporte_real
    
        return recepcion
      })
    }
    asigna_datos_cotizaciones(data){
      const {bruto, clientes, vehiculos} = data
      const nuevos_ordenamiento =this._publicos.ordenamiento_fechas(bruto,'fecha_recibido',false)
      return nuevos_ordenamiento.map(cotizacion=>{
        const { cliente, vehiculo,elementos, margen, iva, descuento, formaPago, id} = cotizacion;
        cotizacion.data_cliente = clientes[cliente]
        cotizacion.data_vehiculo = vehiculos[vehiculo]
        cotizacion.reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
        return cotizacion
      })
    }
    obtener_suma_metodos (nueva_data:any[]){
      let metodos = JSON.parse(JSON.stringify(this.metodos));
      nueva_data.forEach(g=>{
        Object.keys(metodos).forEach(m=>{
          metodos[m] += parseFloat(g[m])
        })
      })
      return metodos
    }
    obtener_pormetodo(historial_pagos:any[]){
      let metodos = JSON.parse(JSON.stringify(this.metodos));
      historial_pagos.forEach(h=>{
        const  {metodo, monto} = h
        const data_pago = this.metodospago.find(m=>m.metodo === metodo)
        if (metodo === data_pago.metodo) {
          metodos[data_pago.show] += parseFloat(monto)
        }
      })
      return metodos
    }
    filtra_orden(arreglo, id_orden){
      return [...arreglo].filter(f=>f.id_os === id_orden)
    }
    crearArreglo2(arrayObj: Record<string, any> | null): any[] {
      if (!arrayObj) return []; 
      return Object.entries(arrayObj).map(([key, value]) => ({ ...value, id: key }));
    }
    transformaDataCliente(data){
      const nuevos = [...data]
      const retornados = nuevos.map(cli=>{
        const {sucursal, nombre, apellidos } = cli
        cli.sucursalShow = this.sucursales_array.find(s=>s.id === sucursal).sucursal
        cli.fullname = `${String(nombre).toLowerCase()} ${String(apellidos).toLowerCase()}`
        return cli
      })
      return retornados
    }
    transformaDataVehiculo(data){
      const { clientes, vehiculos} = data
      const nuevos_ordenamiento =this._publicos.ordenamiento_fechas_x_campo(vehiculos,'placas',true)
      return nuevos_ordenamiento.map(vehiculo=>{
        const { cliente } = vehiculo
        vehiculo.data_cliente = clientes[cliente]
        return vehiculo
      })
    }
    resetea_horas_admin(data){
      const {start, end} = data
      this.fechas_get_formateado_admin.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
      this.fechas_get_formateado_admin.end = this._publicos.resetearHoras_horas(new Date(end), this.hora_end)
    }
    obtener_historial_orden(arreglo:any[], campo:string){
      let nuevos =[ ...arreglo]
      const arreglado = nuevos.map(recepcion=>{
        const historial_campo = recepcion[campo]
        return historial_campo
      })
      return arreglado.flat()
    }
    sumatorias_aprobados(arreglo:any[]):number{
      let nuevos = [...arreglo]

      let sumatoria_montos_historial = 0
      nuevos.forEach(gs=>{
        const {status, monto} = gs
        if (status) {
          sumatoria_montos_historial+= monto
        }
      })
      return sumatoria_montos_historial
    }
    suma_refacciones_os_cerradas(arreglo:any[]):number{
      let refacciones = 0
      arreglo.forEach(recep=>{
        const {reporte} = recep
        const {refaccionVenta} = reporte
        refacciones += refaccionVenta
      })
      return refacciones
    }
    suma_gastos_ordenes_subtotales(data:any[]):number{
      let  total_ventas= 0
        data.forEach(f=>{
          const {total_gastos, reporte} = f
          const {subtotal } = reporte
          total_ventas += subtotal
        })
      return  total_ventas
    }
    arreglar_info_recepciones(recepciones_arr:any[]){

      const nueva = recepciones_arr.map(recep=>{
      const data_recepcion = JSON.parse(JSON.stringify(recep));
  
      const {marca, modelo, placas } = data_recepcion.data_vehiculo
  
      const {  tipo, empresa} = data_recepcion.data_cliente
      const {sucursal: sucursalShow} = data_recepcion.data_sucursal
  
      const {elementos, no_os, status, reporte, historial_pagos_orden, reporte_real    } = recep
  
      const {subtotal, iva, total } = reporte_real
      const { formaPago } = data_recepcion
      
      const {
        Efectivo,
        Cheque,
        Tarjeta,
        OpenPay,
        Clip,
        BBVA,
        BANAMEX,
        credito
      }
      = this.obtener_pormetodo(historial_pagos_orden)
  
      const nombres_elementos = this._publicos.obtenerNombresElementos(elementos)
  
      let nueva_empresa = empresa ? empresa : ''
      const temp_data = {
          no_os: String(no_os).toUpperCase(),
          placas:String(placas).toUpperCase() ,
          marca,
          modelo,
          descripcion: String(nombres_elementos).toLowerCase(),
          sucursal: sucursalShow,
          empresa: nueva_empresa,
          tipo,
          Efectivo,
          Cheque,
          Tarjeta,
          OpenPay,
          Clip,
          BBVA,
          BANAMEX,
          credito,
          subtotal,
          iva,
          total,
          'status orden': status,
        }
        return temp_data
      })
      
      return nueva
    }
    sumatoria_reporte(data, margen, iva){
      const {mo,refaccion} = data
      const reporte = {mo:0,refaccion:0, refaccionVenta:0, subtotal:0, total:0, iva:0,ub:0}
      reporte.mo = mo 
      reporte.refaccion = refaccion
      reporte.refaccionVenta = refaccion * (1 +(margen/ 100))
      reporte.subtotal = reporte.mo + reporte.refaccionVenta
      reporte.iva = (iva) ? reporte.subtotal * .16 : reporte.subtotal
      reporte.total = reporte.subtotal + reporte.iva
      if (reporte.subtotal) {
        reporte.ub = (reporte.total - reporte.refaccionVenta) * (100 / reporte.total)
      }
      return reporte
    }
    reporte_gastos_sucursal_unica(data:any[]){
    let nueva = [...data]
    const tipos = ['deposito', 'operacion', 'sobrante', 'gasto', 'orden'];
    const reporte_general = { deposito: 0, operacion: 0, sobrante: 0, orden: 0, restante:0 };
    
    nueva.forEach(({ tipo, monto, status }) => {
      if (status && tipos.includes(tipo)) reporte_general[tipo] += monto;
    });

    const { deposito, operacion, sobrante, orden } = reporte_general;

    const gastos:number = operacion + orden
    const suma_positivos:number = deposito + sobrante

    reporte_general.restante = suma_positivos - gastos;

    return reporte_general;
    
    }

    










    realizaOperacionesClientes2(){
      const new_mo:any[] = Object.keys(MO).map((mo)=>{
        MO[mo].tipo = 'mo'
        return MO[mo]
      })
      console.log(new_mo);
      const new_refacciones:any[] = Object.keys(refacciones).map((refaccion)=>{
        refacciones[refaccion].tipo = 'refaccion'
        return refacciones[refaccion]
      })
      console.log(new_refacciones);
      const new_alls:any[] = [...new_mo, ...new_refacciones]

      console.log(new_alls);
    }
    operaciones_mo_refacciones() {
      const {refacciones, manos_obra} = BD
    
        const processItems = (items, tipo) => {
          return Object.keys(items).map((item) => {
            items[item].tipo = tipo;
            return items[item];
          });
        };
      
        const new_mo = processItems(manos_obra, 'mo');
        const new_refacciones =  processItems(refacciones, 'refaccion');
      
        const new_alls = [...new_mo, ...new_refacciones];
        
        new_alls.map((e, index)=>{
          e.id_publico = obtenerID_elemento(e, index + 1)
          return e
        })

        function obtenerID_elemento(data, index){
          const {nombre, tipo} = data
          const nuevo_nombre = nombre.slice(0,3).toUpperCase()
          const nuevo_tipo = tipo.slice(0,2).toUpperCase()
          const secuencia = (index).toString().padStart(4, '0')
          const cadena = `${nuevo_tipo}${nuevo_nombre}-${secuencia}`
          return cadena;
        }

       
        const objeto = {};
        new_alls.forEach((element) => {
          const {id} = element
          const new_data  = JSON.parse(JSON.stringify(element));
          delete new_data.id
          delete new_data.cantidad
          delete new_data.aprobado
          let descripcion_nueva = new_data.descripcion || 'ninguna descripción'
          new_data.compatibles = [
            {
              "marca": "Chevrolet",
              "modelo": "Aveo",
              "anio_inicial": "2008",
              "anio_final": "2030"
            }
          ]
          new_data.descripcion = descripcion_nueva
          objeto[id] = new_data
        });

        console.log(objeto);
    }
      

    operacionesBD(){

      const  {clientes, vehiculos, correos, cotizacionesRealizadas, recepciones } = BD
      // console.log(correos);
      

      const sucursales =  this.claves_sucursales

      const nuevos_clientes_ = nuevos_clientes({clientes,sucursales})
      // console.log('nuevos_clientes_')
      // console.log(nuevos_clientes_);

      const vehiculos_arra = nuevos_vehiculos({vehiculos,sucursales})
      // console.log('vehiculos_arra')
      // console.log(vehiculos_arra);
      
      const cotizaciones_new = nuevas_cotizaciones({cotizacionesRealizadas, sucursales })
      // console.log('cotizaciones_new')
      // console.log(cotizaciones_new);

      const recepciones_new = nuevas_recepciones({recepciones, sucursales })
      // console.log('recepciones_new')
      // console.log(recepciones_new);


      // const plac = placas('-NJLLN484p3b-aPyspIr')
      // console.log(plac);
      
      
      function placas(vehiculo){
        const data_vehiculo = vehiculos_arra[vehiculo]
        let placas = ''
        if (data_vehiculo) {
          const {placas:placas_found} = data_vehiculo
          placas = placas_found
        }
        return `${placas}`.toUpperCase()
      }
      function fullname(cliente){
        const data_cliente = nuevos_clientes_[cliente]
        let fullname = ''
        if (data_cliente) {
          const {nombre, apellidos} = data_cliente
          fullname = `${nombre} ${apellidos}`
        }
        return `${fullname}`.toUpperCase()
      }
      function nuevaRecuperacionData(data: any, camposRecuperar: any[]) {
        const necessary: any = {};
        camposRecuperar.forEach((recupera) => {
            if(typeof data[recupera] === 'string'){
                const evalua = String(data[recupera]).trim()
                if (evalua !== undefined && evalua !== null && evalua !== "") {
                    necessary[recupera] = evalua;
                }
            }else{
                if (data[recupera] !== undefined && data[recupera] !== null && data[recupera] !== "") {
                    necessary[recupera] = data[recupera];
                }
            }
        });
        return necessary;
    }

      function nuevas_recepciones(data){
        const {sucursales, recepciones} = data

        const clientes_new = [];

        sucursales.forEach((sucursal) => {
          if (recepciones[sucursal]) {
            const recepciones_ = recepciones[sucursal];
            const claves_clientes = Object.keys(recepciones_)
            claves_clientes.forEach(cli=>{
              const arreglo_ = crearArreglo2(recepciones_[cli]);
              const nuevo = arreglo_.map((c) => {
                c.cliente = cli;
                c.checkList = purifica_checklist(c.checkList)
                c.detalles = purifica_detalles(c.detalles)
                const {vehiculo, cliente} = c
                c.fullname = fullname(cliente)
                c.placas = placas(vehiculo)
                const campos = Object.keys(c)
                return nuevaRecuperacionData(c, campos)
              });
              clientes_new.push(...nuevo);
            })
          }
        })
        // const aplanado = aplanar_array(clientes_new)
        const nuevo =  aplanar_array(clientes_new)
        return nuevo_objeto(nuevo)
        // return 
      }
      function nuevas_cotizaciones(data){
        const {sucursales, cotizacionesRealizadas} = data

        const clientes_new = [];

        sucursales.forEach((sucursal) => {
          if (cotizacionesRealizadas[sucursal]) {
            const cotizaciones_ = cotizacionesRealizadas[sucursal];
            const claves_clientes = Object.keys(cotizaciones_)
            claves_clientes.forEach(cli=>{
              const arreglo_ = crearArreglo2(cotizaciones_[cli]);
              const nuevo = arreglo_.map((c) => {
                const {vehiculo, cliente} = c
                c.cliente = cli;
                c.fullname = fullname(cliente)
                c.placas = placas(vehiculo)
                const campos = Object.keys(c)
                return nuevaRecuperacionData(c, campos)
              });
              clientes_new.push(...nuevo);
            })
          }
        })
        const nuevo =  aplanar_array(clientes_new)
        return nuevo_objeto(nuevo)
        // return aplanar_array(clientes_new)
      }
      function nuevos_vehiculos(data){
        const {vehiculos, sucursales} = data
        // let vehiculos_new =[]

        const vehiculos_new = [];

        sucursales.forEach((sucursal) => {
          const vehiculos_ = vehiculos[sucursal];
          const nuevas = Object.keys(vehiculos_);
          
          nuevas.forEach((cli) => {
            const arreglo_ = crearArreglo2(vehiculos_[cli]);
            const nuevo = arreglo_.map((c) => {
              c.cliente = cli;
              return c;
            });
            
            vehiculos_new.push(...nuevo); // Usamos spread para agregar los elementos individualmente
          });
        });
        const nuevo =  aplanar_array(vehiculos_new)
        return nuevo_objeto(nuevo)
      }
      function nuevos_clientes(data){
        const { sucursales, clientes } = data

        const clientes_new = [];

        sucursales.forEach((sucursal) => {
          const arreglo_ = crearArreglo2(clientes[sucursal]);
          clientes_new.push(arreglo_)
        })
        const nuevo =  aplanar_array(clientes_new)
        return nuevo_objeto(nuevo)
      }
      function nuevo_objeto(arreglo:any[]){
        let nuevo_objeto = {}
        arreglo.forEach(c=>{
          const {id} = c
          nuevo_objeto[id] = c
        })
        return nuevo_objeto
      }
      function crearArreglo2(arrayObj: Record<string, any> | null): any[] {
        if (!arrayObj) return []; 
        return Object.entries(arrayObj).map(([key, value]) => ({ ...value, id: key }));
      }
      function aplanar_array(arreglo){
        const allas = arreglo.flat()
        return allas
      }
      function purifica_checklist(checkList){
        const nuevo_check = [...checkList]
        const XD = nuevo_check.map(c=>{
          const {status, valor, show} = c
          let a = {status, valor}
          return a
        })
        return XD
      }
      function purifica_detalles(detalles){
        const nuevos_detalles = [...detalles]
        const XD = nuevos_detalles.map(c=>{
          const {status, valor, show} = c
          let a = {status, valor}
          return a
        })
        return XD
      }
    }

    operaciones_gastos(){
      const {refacciones, manos_obra} = BD
    }
    
}