import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { getDatabase, onValue, ref } from 'firebase/database';

import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';


const db = getDatabase()

@Component({
  selector: 'app-corte-ingresos',
  templateUrl: './corte-ingresos.component.html',
  styleUrls: ['./corte-ingresos.component.css']
})
export class CorteIngresosComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, private _exporter:ExporterService,
    private _sucursales: SucursalesService) { }
    miniColumnas:number = 100
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

  realizaGasto:string = 'gasto'

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
  objecto_actual:any ={}
  
  ngOnInit(): void {
    this.rol()
    this.resetea_horas_admin()
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
    const objecto_recuperdado = this._publicos.revision_cache(campo)
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
          this.objecto_actuales[campo_vigila] = this._publicos.crear_new_object(this._publicos.revision_cache(campo_vigila))
          this.asiganacion_resultados_multiples(this.campo_vigilar)
        }
      })

    },1500)
  }

  genera_resultados(){

    const {start, end} = this.fecha_formateadas
    const recepciones = this._publicos.revision_cache('recepciones')
    
    const resultados_recepciones = filtrarInformacion(recepciones,{sucursal: this.filtro_sucursal, status: 'entregado', start, end})

    const arreglo_recepciones = this._publicos.crearArreglo2(resultados_recepciones)
    
    const arregaldas_recepciones = this._publicos.nueva_asignacion_recepciones(arreglo_recepciones)

    const gastos_orden = this._publicos.revision_cache('historial_gastos_orden')
    const gastos_operacion = this._publicos.revision_cache('historial_gastos_operacion')

    const gastos_orden_filtrados = this._publicos.filtrarObjetoPorPropiedad_fecha(gastos_orden, start, end)
    const gastos_operacion_filtro = this._publicos.filtrarObjetoPorPropiedad_fecha(gastos_operacion, start, end)

    const total_gastos_ordenes = this._publicos.sumatorias_aprobados(this._publicos.crearArreglo2(gastos_orden_filtrados))

    const total_gastos_operacion = this._publicos.sumatorias_aprobados(this._publicos.crearArreglo2(gastos_operacion_filtro))

    const total_subtotales_ventas = this._publicos.suma_gastos_ordenes_subtotales_reales(arregaldas_recepciones)

  
    const objetivos = this._publicos.revision_cache('metas_sucursales')

    const filtro_objetivos_sucursal = this._publicos.filtrarObjetoPorPropiedad(objetivos, 'sucursal', this.filtro_sucursal)

    const {primerDia, ultimoDia} = this._publicos.new_obtenerPrimerUltimoDiaMes(start, end)

    
    const filtro_objetivos_fechas = this._publicos.filtrarObjetoPorPropiedad_fecha(filtro_objetivos_sucursal, primerDia, ultimoDia)

    const total_objetivos = suma_objetivos(this._publicos.crearArreglo2(filtro_objetivos_fechas))
    
    function suma_objetivos(arreglo:any[]){
      let nuevo = [...arreglo]
      let total_objetivos = 0
      nuevo.forEach(obj=>{
        const {objetivo} = obj
        total_objetivos += parseInt(objetivo)
      })
      return total_objetivos
    }
    
    this.reporte.total_ordenes = arregaldas_recepciones.length
    this.reporte.orden = total_gastos_ordenes
    this.reporte.operacion = total_gastos_operacion
    this.reporte.ventas = total_subtotales_ventas
    // let objetivo = 10000
    this.reporte.objetivo = total_objetivos 
    if (total_subtotales_ventas) {
      this.reporte.porcentaje = (total_subtotales_ventas / total_objetivos) * 100
      this.reporte.ticketPromedio = total_subtotales_ventas / arregaldas_recepciones.length
      this.reporte.sobrante = total_subtotales_ventas - (total_gastos_operacion + total_gastos_ordenes)
      this.reporte.porcentajeGM =  (this.reporte.sobrante / total_subtotales_ventas) * 100
    }
    // this.recepciones_arr = arregaldas_recepciones

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
      'descuento',
      'elementos',
      'formaPago',
      'iva',
      'margen',
      // 'no_cotizacion',
      'nota',
      'pdf',
      'promocion',
      'reporte',
      // 'servicio',
      // 'sucursal',
      // 'vehiculo',
      // 'vehiculos',
      // 'vencimiento',
    ]

    this.objecto_actual = recepciones
    this.recepciones_arr = (!this.recepciones_arr.length) 
    ? arregaldas_recepciones
    :  this._publicos.actualizarArregloExistente(this.recepciones_arr, arregaldas_recepciones, campos )

    function filtrarInformacion(objeto, filtro) {
      const { sucursal, status, start, end } = filtro;
      const resultado = {};
    
      for (const clave in objeto) {
        const elemento = objeto[clave];
    
        // Filtrar por sucursal
        if (sucursal === 'Todas' || elemento.sucursal === sucursal) {
          // Filtrar por estado (status)
          if (status === 'Todos' || elemento.status === status) {
            // Filtrar por fechas
            if (start && end) {
              if (comprobarFechas(elemento.fecha_recibido, start, end)) {
                resultado[clave] = elemento;
              }
            }else{
              resultado[clave] = elemento;
            }
            
          }
        }
      }
    
      return resultado;
    }
    
    function comprobarFechas(fechaElemento, start, end) {
      if (!fechaElemento || !start || !end) {
        return false;
      }
    
      const fechaCompara = new Date(fechaElemento);
      const fechaStart = new Date(start);
      const fechaEnd = new Date(end);
    
      return fechaCompara >= fechaStart && fechaCompara <= fechaEnd;
    }
 
  }

  asiganacion_resultados_multiples(campo_vigila){
    this.objecto_actuales[campo_vigila] = this._publicos.revision_cache(campo_vigila)
    this.genera_resultados()
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
 
  generaExcel_corte_ingresos(){
    if (this.recepciones_arr.length) {
      const nueva_data = this.arreglar_info_recepciones(this.recepciones_arr)
      
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
  data_deposito(event){
    if (event) this._publicos.cerrar_modal('modal-deposito')
  }
  
}
