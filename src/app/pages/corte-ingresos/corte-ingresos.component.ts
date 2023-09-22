import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { MetasSucursalService } from '../../services/metas-sucursal.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ClientesService } from 'src/app/services/clientes.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ExporterService } from '../../services/exporter.service';
const db = getDatabase()
const dbRef = ref(getDatabase());


@Component({
  selector: 'app-corte-ingresos',
  templateUrl: './corte-ingresos.component.html',
  styleUrls: ['./corte-ingresos.component.css']
})
export class CorteIngresosComponent implements OnInit {

  constructor(private _sucursales: SucursalesService, private _formBuilder: FormBuilder,
    private _publicos: ServiciosPublicosService, private _metas: MetasSucursalService,
    private _security:EncriptadoService, private _reporte_gastos: ReporteGastosService,
    private _vehiculos: VehiculosService, private _servicios: ServiciosService,
    private _cotizaciones: CotizacionesService, private _exporter:ExporterService,
    private _clientes: ClientesService,) { }
  
  _rol:string
  _sucursal: string

  sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]
  formasPago       =  [ ...this._cotizaciones.formasPago ]

  fechas_corte = new FormGroup({
    inicial: new FormControl(new Date()),
    final: new FormControl(new Date()),
  });

  fecha_formateadas = {inicial:new Date(), final:new Date() }
  hora_start = '00:00:01';
  hora_end = '23:59:59';

  metas_mes = []

  array_recepciones = []
  recepciones_arr = []


  my_control = new FormGroup({
    sucursal: new FormControl('')
  })
  sucursal_select:string
  reporte = {objetivo:0, operacion: 0, orden:0, ventas:0, sobrante:0, porcentajeGM:0, porcentaje:0, ticketPromedio:0, refacciones:0}
  camposReporte = [
    {valor:'ticketPromedio', show:'Ticket Promedio'},
    {valor:'objetivo', show:'Objetivo'},
    {valor:'ventas', show:'Total ventas'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    // {valor:'refacciones', show:'Refacciones'},
    // {valor:'porcentaje', show:'% cumplido'},
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
  ngOnInit(): void {
    this.rol()
    this.resetea_horas_admin()
    this.primer_llamado()
    this.vigila()
    this.vigila_cambios_metas()

  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal 
    
    // this.filtro_sucursal =  this._sucursal 
  }
  primer_llamado(){
    const {inicial, final} = this.fechas_corte.value

    const S = new Date(inicial)
    const F = new Date(final)
    this.resultados_objetivos({S, F})

    if (this._sucursal !== 'Todas') {
      this.my_control.get('sucursal').setValue(this._sucursal)
      this.sucursal_select = this._sucursal
      // this.consulta_gastos_operacion()
    }
    this.nueva_consulta()
    // this.consulta_servicios()
    // this.consulta_gastos_operacion()
  }

  vigila(){
 
    this.fechas_corte.valueChanges.subscribe(({inicial:start_, final: end_})=>{
      if (start_ && start_['_d'] && end_ && end_['_d'] ) {
        if (end_['_d'] >= start_['_d']) {
          this.resetea_horas_admin()
        }
      }        
    })

    this.my_control.get('sucursal').valueChanges.subscribe((sucursal:string)=>{
      if(sucursal){
        this.sucursal_select = sucursal
        // this.consulta_gastos_operacion()
        const {inicial, final} = this.fechas_corte.value
        const S = new Date(inicial)
        const F = new Date(final)
        this.resultados_objetivos({S, F})
      }
    })
  }
  vigila_cambios_metas(){
    

    const starCountRef = ref(db, `metas_sucursales`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const {inicial, final} = this.fechas_corte.value
        const S = new Date(inicial)
        const F = new Date(final)
        this.resultados_objetivos({S, F})
        // this.consulta_gastos_operacion()
      }
    })
  }
  async resetea_horas_admin(){
    const {inicial, final} = this.fechas_corte.value
    const simula_fecha =  new Date('03-23-2023')
    const S = new Date(inicial)
    const F = new Date(final)
    this.fecha_formateadas.inicial = this._publicos.resetearHoras_horas(S,this.hora_start) 
    this.fecha_formateadas.final = this._publicos.resetearHoras_horas(F,this.hora_end) 

    this.resultados_objetivos({S, F})
    // this.consulta_gastos_operacion()
    // this.consulta_servicios()
    // this.nueva_consulta()
    this.actualiza()
    
  }

actualiza(){
  const cuales = ['recepciones','historial_gastos_operacion','historial_gastos_orden']
  cuales.forEach(cual=>{
    const starCountRef = ref(db, `${cual}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          this.nueva_consulta()
        }
      })
  })
  
}
async nueva_consulta(){
  // console.time('Execution Time');

  const {inicial:fec_f, final: fech_f}= this.fecha_formateadas;

  // console.log(this.fecha_formateadas);
  
  const _operacion = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_operacion())

  // console.log(_operacion);
  
  const _orden = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_orden())
  const _pagos = this._publicos.crearArreglo2( await this._servicios.consulta_pagos())
  const _recepciones = this._publicos.crearArreglo2( await this._servicios.consulta_recepciones_())
  const _clientes = this._publicos.crearArreglo2( await this._clientes.consulta_clientes())
  const _vehiculos = this._publicos.crearArreglo2( await this._vehiculos.consulta_vehiculos_())
  // console.log(_recepciones);

  const nuevas = _recepciones.filter(r=>new Date(r.fecha_entregado) >= fec_f && new Date(r.fecha_entregado) <= fech_f && r.status === 'entregado').map(recepcion=>{
    const { id, elementos, margen, iva, vehiculo, cliente, sucursal } = recepcion
    recepcion.historial_gastos_orden = filtra_orden(_orden, id)
    recepcion.historial_pagos_orden = filtra_orden(_pagos, id)

    const filtro_elementos_only = elementos.filter(e =>e.tipo !== 'paquete' && e.aprobado)
    const reporte_solo_elementos = nuevo_reporte(filtro_elementos_only)
    const filtro_paquetes_only = elementos.filter(e =>e.tipo === 'paquete' && e.aprobado )
    const aplicado = filtro_paquetes_only.map(paquete=>{
      const {elementos} = paquete
      const filtro_aprobado_internos = elementos.filter(e=>e.aprobado)
      return nuevo_reporte(filtro_aprobado_internos) 
    })
    const sumatoria_paquetes = sumatorio_reportes(aplicado)
    const reporte_sum = sumatorio_reportes([sumatoria_paquetes, reporte_solo_elementos])

    // reporte_sum.refaccion = suma_gastos_ordenes([recepcion]).total_ordenes
    // console.log(reporte_sum);
    const nuevo = JSON.parse(JSON.stringify(reporte_sum));
    nuevo['refaccion'] = gastos_orden_suma(recepcion.historial_gastos_orden)
    // console.log(nuevo);
    recepcion.total_gastos = gastos_orden_suma(recepcion.historial_gastos_orden)
    
    recepcion.data_vehiculo = _vehiculos.find(v=>v.id === vehiculo)
    recepcion.data_cliente = _clientes.find(c=>c.id === cliente)
    recepcion.data_sucursal = this.sucursales_array.find(c=>c.id === sucursal)
    
    recepcion.reporte = sumatoria_reporte(reporte_sum, margen, iva)
    recepcion.reporte_real = sumatoria_reporte(nuevo, margen, iva)
    
    return recepcion
  })
  // console.log(nuevas);

  const {total_ordenes,total_ventas } = suma_gastos_ordenes(nuevas)
  let objetivo = 0
  this.metas_mes.forEach(g=>{
    objetivo+= g.objetivo
  })
  this.reporte.objetivo = objetivo
  
  this.reporte.porcentaje = (total_ventas / objetivo) * 100
  this.reporte.ticketPromedio = total_ventas / nuevas.length 
  this.reporte.orden = total_ordenes
  this.reporte.ventas = total_ventas
  this.reporte.operacion = filtro_operacion_fechas(_operacion, fec_f, fech_f)
  this.reporte.sobrante = this.reporte.ventas - (this.reporte.operacion + this.reporte.orden)
  this.reporte.porcentajeGM = (this.reporte.sobrante / this.reporte.ventas) *  100

  this.recepciones_arr = nuevas
  
  
  function filtro_operacion_fechas(arreglo, start, end){
    const filtro_ = arreglo.filter(r=>new Date(r.fecha_recibido) >= new Date(start) && new Date(r.fecha_recibido) <= new Date(end))
    let total = 0
    filtro_.forEach(f=>{
      const {status, monto} = f
      if(status) total += monto
    })
    return  total
  }
  function filtra_orden(arreglo, id_orden){
    return [...arreglo].filter(f=>f.id_os === id_orden)
  }
  function suma_gastos_ordenes(data:any){
    let total_ordenes = 0, total_ventas= 0
      data.forEach(f=>{
        const {total_gastos, reporte_real} = f
        const {subtotal } = reporte_real
        total_ordenes += total_gastos
        total_ventas += subtotal
      })
    return {total_ordenes, total_ventas}
  }
  function gastos_orden_suma(data:any[]){
    let total = 0
      data.forEach(f=>{
        const {monto, status} = f
        if (status) total += monto
      })
    return total
  }
  function sumatoria_reporte(data, margen, iva){
    const {mo,refaccion} = data
    const reporte = {mo:0,refaccion:0, refaccionVenta:0, subtotal:0, total:0, iva:0,ub:0}
    reporte.mo = mo 
    reporte.refaccion = refaccion
    reporte.refaccionVenta = refaccion * (1 +(margen/ 100))
    reporte.subtotal = reporte.mo + reporte.refaccionVenta
    reporte.iva = (iva) ? reporte.subtotal * .16 : reporte.subtotal
    reporte.total = reporte.subtotal + reporte.iva

    reporte.ub = (reporte.total - reporte.refaccionVenta) * (100 / reporte.total)
    return reporte
  }
  function sumatorio_reportes(arreglo_sumatorias){
    const reporte = {mo:0,refaccion:0}
    arreglo_sumatorias.forEach(a=>{
        const {mo,refaccion, } = a
        reporte.mo += mo
        reporte.refaccion += refaccion
    })
    return reporte
  }
  function nuevo_reporte(elementos){
    const reporte = {mo:0,refaccion:0}
    const nuevos = [...elementos].forEach(elemento =>{
      const { costo, precio, status, tipo} = elemento
        if (costo > 0 ) {
          reporte[tipo] += costo
          // if (tipo === 'mo') {
          //   reporte.sobrescritomo += costo
          // }else{
          //   reporte.sobrescritorefaccion += costo
          // }
        }else{
          reporte[tipo] += precio
        }
    })
    return reporte
  }
  // console.timeEnd('Execution Time');
}
  


  async resultados_objetivos(data){
    // console.log(this.my_control.get('sucursal').value);
    const sucursal = this.my_control.get('sucursal').value
    if (sucursal) {
      const {S, F} = data
      const rutas = this.rutas_consulta({S, F})
      const promesasClientes = rutas.map(async (data) => {
        const {anio, mes, ruta} = data
        const registro = await this._metas.consulta_registro_meta_mes({ruta})
        let objetivo_mes = registro > 0 ? registro : 0
  
        const meses =  ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ];
  
        return {mes: meses[mes - 1],anio, objetivo: objetivo_mes}
      });
      
      const promesasResueltasClientes = await Promise.all(promesasClientes);
      // console.log(promesasResueltasClientes);
      const filtro = promesasResueltasClientes.filter(g=>g.objetivo !==0 )
      this.metas_mes = filtro
    }
   
  }
  rutas_consulta(data){
    const {S, F} = data
    const  aniosMeses = this.obtenerAniosMesesPorAnio_1(S, F)

    let rutas = []
    aniosMeses.forEach(regis=>{
      const {anio, meses} = regis
      const mesess = [...meses]
      mesess.forEach(m=>{
        const ruta = `metas_sucursales/${this.sucursal_select}/${anio}/${m - 1}`
        rutas.push({mes: m, anio, ruta})
      })
    })
    return rutas
  }
  obtenerAniosMesesPorAnio_1(fechaInicio, fechaFin) {
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
  
    const anioInicio = fechaInicioObj.getFullYear();
    const mesInicio = fechaInicioObj.getMonth();
    const anioFin = fechaFinObj.getFullYear();
    const mesFin = fechaFinObj.getMonth();
  
    const aniosMeses = [];
  
    for (let anio = anioInicio; anio <= anioFin; anio++) {
      const mesesPorAnio = [];
      const mesInicial = (anio === anioInicio) ? mesInicio : 0;
      const mesFinal = (anio === anioFin) ? mesFin : 11;
  
      for (let mes = mesInicial; mes <= mesFinal; mes++) {
        mesesPorAnio.push(mes + 1);
      }
  
      aniosMeses.push({ anio, meses: mesesPorAnio });
    }
  
    return aniosMeses;
  }
  crea_ordenes_sucursal(data){
    const {arreglo_sucursal, } = data
    let Rutas_retorna = []
    arreglo_sucursal.forEach(sucursal=>{
      Rutas_retorna.push(`recepciones/${sucursal}`)
    })
    return Rutas_retorna
  }
  obtenerArregloFechas_gastos_diarios(data){
    const {ruta, arreglo_sucursal} = data
    const fecha_start = new Date('08-02-2023')
    const fecha_end = this.fecha_formateadas.final
    const diffTiempo = fecha_end.getTime() - fecha_start.getTime();
    const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
    let arreglo = []
    for (let i = 0; i <= diffDias; i++) {       
      const fecha_retorna = new Date(fecha_start.getTime() + i * 24 * 60 * 60 * 1000);
      if (!this._publicos.esDomingo(fecha_retorna)) {
        const Fecha_formateada = this._reporte_gastos.fecha_numeros_sin_Espacions(fecha_retorna)
        arreglo.push(Fecha_formateada)
      }
    }

    let Rutas = []
    arreglo_sucursal.forEach(s=>{
      arreglo.forEach(Fecha_formateada_=>{
        Rutas.push(`${ruta}/${s}/${Fecha_formateada_}`)
      })
    })
    return Rutas
  }
  regresa_servicios_por_cada_ruta(data){
    const { respuesta } = data;
    let  obtenidos = [];
    
      Object.values(respuesta).forEach((entrie) => {
        const nuevas_entries = this._publicos.crearArreglo2(entrie);
        obtenidos.push(...nuevas_entries);
      });
    
    return obtenidos;
  }

  
  generaExcel(){
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
          // no_cliente: String(no_cliente).toUpperCase(),
          sucursal: '',
          // correo_cliente,
          empresa: '',
          // correo_sucursal,
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
      const {inicial, final} = this.fecha_formateadas

      const { inicio: _inicial, final: _final } = this._publicos.getFirstAndLastDayOfCurrentMonth(inicial)
      const { inicio: _inicial_, final: _final_ } = this._publicos.getFirstAndLastDayOfCurrentMonth(final)

      const uno = this._publicos.retorna_fechas_hora({fechaString: new Date(_inicial)}).formateada
      const uno_1 = this._publicos.retorna_fechas_hora({fechaString: new Date(_final_)}).formateada

      const dos = this._publicos.retorna_fechas_hora().formateada

      nueva_data.push({
        ...linea_blanca,
        Efectivo:'Arqueo Correspondiente a',
        Tarjeta:'Fecha de Realizacion',
      })
      nueva_data.push({
        ...linea_blanca,
        Efectivo: `${uno} - ${uno_1}`,
        Tarjeta: dos,
      })
      
      this._exporter.genera_excel_recorte_ingresos({arreglo: nueva_data, data_reporte_objetivos})
    }else{
      this._publicos.swalToast(`Ningun registro`,0)
    }
  }

  arreglar_info_recepciones(recepciones_arr:any[]){
    // console.log(recepciones_arr);
    const nueva = recepciones_arr.map(recep=>{
    const data_recepcion = JSON.parse(JSON.stringify(recep));

    const {marca, modelo, placas } = data_recepcion.data_vehiculo

    const {no_cliente, sucursalShow, tipo, empresa, correo: correo_cliente} = data_recepcion.data_cliente

    const { correo: correo_sucursal } = data_recepcion.data_sucursal

    const {elementos, no_os, status, reporte, historial_pagos_orden    } = recep

    const {subtotal, iva, total } = reporte
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
    // const reporte_

    const temp_data = {
        no_os: String(no_os).toUpperCase(),
        placas:String(placas).toUpperCase() ,
        marca,
        modelo,
        descripcion: String(nombres_elementos).toLowerCase(),
        // no_cliente: String(no_cliente).toUpperCase(),
        sucursal: sucursalShow,
        // correo_cliente,
        empresa: nueva_empresa,
        // correo_sucursal,
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
  obtener_suma_metodos (nueva_data:any[]){
    let metodos = JSON.parse(JSON.stringify(this.metodos));
    nueva_data.forEach(g=>{
      Object.keys(metodos).forEach(m=>{
        metodos[m] += parseFloat(g[m])
      })
    })

    return metodos
  }

}
