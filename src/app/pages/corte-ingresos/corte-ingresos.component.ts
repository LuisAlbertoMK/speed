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
  reporte = {objetivo:0, operacion: 0, orden:0, ventas:0, sobrante:0, porcentaje:0, ticketPromedio:0}
  camposReporte = [
    {valor:'objetivo', show:'Objetivo'},
    {valor:'ventas', show:'Total ventas'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    {valor:'sobrante', show:'Restante '},
    {valor:'ticketPromedio', show:'ticket Promedio'},
  ]
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
      this.consulta_gastos_operacion()
    }
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
        this.consulta_gastos_operacion()
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
        this.consulta_gastos_operacion()
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
    this.consulta_gastos_operacion()
    // this.consulta_servicios()
    
  }

  
  

  async consulta_gastos_operacion(){

    // `historial_gastos_operacion/${sucursal}/${solo_numeros_fecha_hoy}/${clave_}`
    const {inicial, final} = this.fechas_corte.value

    const { inicio: _inicial, final: _final } = this._publicos.getFirstAndLastDayOfCurrentMonth(inicial)
    const { inicio: _inicial_, final: _final_ } = this._publicos.getFirstAndLastDayOfCurrentMonth(final)

    const inicial_ = this._publicos.resetearHoras_horas(_inicial,this.hora_start) 
    const final_ = this._publicos.resetearHoras_horas(_final_,this.hora_end) 
    
    // console.log(inicial_)
    // console.log(final_);

    let fechas_busqueda = []

    const diffTiempo = final_.getTime() - inicial_.getTime();
    const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
    // console.log(diffDias);
    
    for (let i = 0; i <= diffDias; i++) {
      const fecha_retorna = new Date(inicial_.getTime() + i * 24 * 60 * 60 * 1000);
      const solo_numeros_fecha_hoy = this._reporte_gastos.fecha_numeros_sin_Espacions(new Date(fecha_retorna))
      fechas_busqueda.push(solo_numeros_fecha_hoy)
    }
    // console.log(fechas_busqueda);
    
    const nuevas = this.rutas_sucursal({arreglo: fechas_busqueda, sucursal: this.sucursal_select})
    // console.log(nuevas);
    
    
    const promesasGOperacion = nuevas.map(async (ruta) => {
      const gastos_hoy_array: any[] = await this._reporte_gastos.gastos_hoy({ ruta });
      return gastos_hoy_array
    });
  
    const promesasResueltasGOperacion = await Promise.all(promesasGOperacion);
    const finales = promesasResueltasGOperacion.flat();
    // console.log(finales);
    let operacion = 0
    finales.forEach(f=>{
      const {monto, status} = f
      if (status) {
        operacion+= monto
      }
    })
    // console.log(operacion);

    this.reporte.operacion = operacion
    

    const arreglo_sucursal = [this.sucursal_select]

    const arreglo_fechas_busca = this.obtenerArregloFechas_gastos_diarios({ruta: 'historial_gastos_orden', arreglo_sucursal})

    const promesasConsultas_gastos_orden = arreglo_fechas_busca.map(async (f_search) => {
      const gastos_hoy_array: any[] = await this._reporte_gastos.gastos_hoy({ ruta: f_search});
      const promesasVehiculos = gastos_hoy_array
        .filter(g => g.tipo === 'orden')
        .map(async (g) => {
          const { sucursal, cliente, vehiculo } = g;
          g.data_vehiculo = await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
        });
      await Promise.all(promesasVehiculos);
              return gastos_hoy_array;
      });
    const promesas_gastos_orden = await Promise.all(promesasConsultas_gastos_orden);

    const muestra_gastos_ordenes = promesas_gastos_orden.flat()

    // console.log(muestra_gastos_ordenes);
    let orden =0
    muestra_gastos_ordenes.forEach(g=>{
      const {monto, status} = g
      if (status) {
        orden+= monto
      }
    })

    this.reporte.orden = orden


    const arreglo_rutas = this.crea_ordenes_sucursal({arreglo_sucursal})

    const promesasConsultas = arreglo_rutas.map(async (f_search) => {

      const respuesta = await  this._servicios.consulta_recepcion_sucursal({ruta: f_search})
        
      const gastos_hoy_array = await this.regresa_servicios_por_cada_ruta({respuesta}) 
        const promesasVehiculos = gastos_hoy_array
          
          .map(async (g) => {
            const { sucursal, cliente, vehiculo , id, fecha_recibido} = g;
            // console.log(id);
            
            // g.data_vehiculo = await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
            const data_cliente:any =  await this._clientes.consulta_cliente_new({sucursal, cliente})
            g.data_cliente = data_cliente
            g.clienteShow = data_cliente.fullname
            const data_vehiculo:any =  await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
            
            const historial_pagos:any =  await this._servicios.historial_pagos({ sucursal, cliente, id });

            
            const historial_gastos = muestra_gastos_ordenes.filter(g=>g.numero_os === id)
            g.historial_pagos = historial_pagos
            g.historial_gastos = historial_gastos
            g.data_vehiculo = data_vehiculo
            g.placas = data_vehiculo.placas
            const data_sucursal =  this.sucursales_array.find(s=>s.id === sucursal)

            const dias =this._publicos.dias_transcurridos_en_sucursal(fecha_recibido)
            // console.log(dias);

            const updates = {[`recepciones/${sucursal}/${cliente}/${id}/diasSucursal`]: dias};
            update(ref(db), updates).then(()=>{})
  
            g.data_sucursal =  data_sucursal
            g.sucursalShow = data_sucursal.sucursal

            return g
          });
        await Promise.all(promesasVehiculos);
        return gastos_hoy_array;
    });
    const promesas_gastos_ordenes = await Promise.all(promesasConsultas);
    const muestra_ordenes = promesas_gastos_ordenes.flat()
    // console.log(muestra_ordenes);

    let total_ventas = 0

    
    const {inicial:fec_f, final: fech_f}= this.fecha_formateadas;


    const filtro = muestra_ordenes.filter(r=>new Date(r.fecha_recibido) >= fec_f && new Date(r.fecha_recibido) <= fech_f && r.status === 'entregado' )
    
    this.recepciones_arr = filtro

    filtro.forEach(f=>{
      const { reporte, status} = f
      if (status === 'entregado') {
        const {total} = reporte
        total_ventas += total 
      }
    })
    this.reporte.ventas = total_ventas

    
    let objetivo = 0
    this.metas_mes.forEach(g=>{
      objetivo+= g.objetivo
    })
    this.reporte.objetivo = objetivo
    this.reporte.sobrante = total_ventas - (operacion + orden)
    // (Cantidad base / Total) * 100

    // console.log(this.metas_mes);
    
    this.reporte.porcentaje = (total_ventas / objetivo) * 100


    this.reporte.ticketPromedio = total_ventas / filtro.length 

    
  }
  rutas_sucursal(data){
    const {arreglo, sucursal} = data
    let Rutas = []
    // arreglo_sucursal.forEach(s=>{
      arreglo.forEach(Fecha_formateada_=>{
        Rutas.push(`historial_gastos_operacion/${sucursal}/${Fecha_formateada_}`)
      })
    // })
    return Rutas
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

  calcularTotales(data) {
    const {margen: new_margen, formaPago, elementos: servicios_, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0}
    const elementos = (servicios_) ? [...servicios_] : []
    const margen = 1 + (new_margen / 100)
    elementos.map(ele=>{
      const {cantidad, costo, tipo} = ele
      if (tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          reporte.mo += mo
          reporte.refacciones += refacciones
          reporte.refacciones_v += refacciones * margen
        }
        ele.precio = mo + (refacciones * margen)
        ele.total = (mo + (refacciones * margen)) * cantidad
        if (costo > 0 ) ele.total = costo * cantidad 
      }else if (tipo === 'mo' || tipo === 'refaccion') {

        const operacion = this.mano_refaccion(ele)

        ele.subtotal = operacion
        ele.total = (tipo === 'refaccion') ? operacion * margen : operacion
        
        const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'

        if (ele.aprobado) reporte[donde] += operacion

      }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0
    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))
    const {mo, refacciones_v, refacciones} = reporte

    let nuevo_total = mo + refacciones_v

    let total_iva = _iva ? nuevo_total * 1.16 : nuevo_total;

    let iva =  _iva ? nuevo_total * .16 : 0;

    let total_meses = (enCaso_meses.id === '1') ? 0 : total_iva * (1 + (enCaso_meses.interes / 100))
    let newTotal = (enCaso_meses.id === '1') ?  total_iva -= descuento : total_iva
    let descuentoshow = (enCaso_meses.id === '1') ? descuento : 0

    reporte.descuento = descuentoshow
    reporte.iva = iva
    reporte.subtotal = nuevo_total
    reporte.total = newTotal
    reporte.meses = total_meses
    // console.log(reporte);
    // (reporteGeneral.subtotal - cstoCOmpra) *100/reporteGeneral.subtotal
    reporte.ub = (nuevo_total - refacciones) * (100 / nuevo_total)
    return {reporte, elementos}
    
  }
  mano_refaccion({costo, precio, cantidad}){
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete({elementos}){
    const reporte = {mo:0, refacciones:0}
    const nuevos_elementos = [...elementos] 

    if (!nuevos_elementos.length) return reporte

    nuevos_elementos.forEach(ele=>{
      const {tipo} = ele
      const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
      const operacion = this.mano_refaccion(ele)
      reporte[donde] += operacion
    })
    return reporte
  }

  generaExcel(){
    if (this.recepciones_arr.length) {
      // console.log(this.recepciones_arr.length);
      const nueva_data = this.arreglar_info_recepciones(this.recepciones_arr)
      console.log(nueva_data);
      
      this._exporter.genera_excel_recorte_ingresos(nueva_data)
    }
  }

  arreglar_info_recepciones(recepciones_arr:any[]){
    console.log(recepciones_arr);
    const nueva = recepciones_arr.map(recep=>{
      const data_recepcion = JSON.parse(JSON.stringify(recep));

      const {marca, modelo, placas } = data_recepcion.data_vehiculo

      const {no_cliente, sucursalShow, tipo, empresa, correo: correo_cliente} = data_recepcion.data_cliente

      const { correo: correo_sucursal } = data_recepcion.data_sucursal

      const {elementos, no_os, status, reporte } = recep

      const {subtotal, iva, total } = reporte

      const nombres_elementos = this._publicos.obtenerNombresElementos(elementos)

      let nueva_empresa = empresa ? empresa : ''

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
        subtotal,
        iva,
        total,
        'status orden': status,
      }
      return temp_data
    })

    return nueva
  }

}
