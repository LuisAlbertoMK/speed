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
    {metodo:'8', show:'Credito'}
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
          console.log(cual);
          
          this.nueva_consulta()
        }
      })
  })
  
}
async nueva_consulta(){
  console.time('Execution Time');

  const {inicial:fec_f, final: fech_f}= this.fecha_formateadas;

  console.log(this.fecha_formateadas);
  
  const _operacion = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_operacion())

  console.log(_operacion);
  
  const _orden = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_orden())
  // const _diarios = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_diarios())
  const _recepciones = this._publicos.crearArreglo2( await this._servicios.consulta_recepciones_())
  console.log(_recepciones);

  const nuevas = _recepciones.filter(r=>new Date(r.fecha_entregado) >= fec_f && new Date(r.fecha_entregado) <= fech_f && r.status === 'entregado').map(recepcion=>{
    const { id, elementos, margen, iva } = recepcion
    recepcion.historial_gastos_orden = filtra_orden(_orden, id)
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
        const {total_gastos, reporte} = f
        const {subtotal } = reporte
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
  console.timeEnd('Execution Time');
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

    const {inicial:fec_fa, final: fech_fa}= this.fecha_formateadas;

    const arreglo_rutas = this.crea_ordenes_sucursal({arreglo_sucursal})

    const promesasConsultas = arreglo_rutas.map(async (f_search) => {

      const respuesta = await  this._servicios.consulta_recepcion_sucursal({ruta: f_search})
        
      const gastos_hoy_array = await this.regresa_servicios_por_cada_ruta({respuesta}) 
        const promesasVehiculos = gastos_hoy_array
          
          .map(async (g) => {
            const { sucursal, cliente, vehiculo , id, fecha_recibido} = g;
            // console.log(id);
            
            // g.data_vehiculo = await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
            const data_cliente:any =  await this._clientes.consulta_Cliente(cliente)

            g.fullname = fullname(data_cliente)
            g.data_cliente = data_cliente
            g.clienteShow = data_cliente.fullname
            const data_vehiculo:any =  await this._vehiculos.consulta_vehiculo_id( vehiculo );
            
            const historial_pagos:any =  await this._servicios.historial_pagos({ sucursal, cliente, id });
            const historial_gastos = muestra_gastos_ordenes.filter(g=>g.numero_os === id)

            g.historial_pagos = historial_pagos
            g.historial_gastos = historial_gastos
            
            g.data_vehiculo = data_vehiculo
            g.placas = placas(data_vehiculo)
            const data_sucursal =  this.sucursales_array.find(s=>s.id === sucursal)

            const dias =this._publicos.dias_transcurridos_en_sucursal(fecha_recibido)
            // console.log(dias);

            const updates = {[`recepciones/${sucursal}/${cliente}/${id}/diasSucursal`]: dias};
            update(ref(db), updates).then(()=>{})
  
            g.data_sucursal =  data_sucursal
            g.sucursalShow = data_sucursal.sucursal

            const  {reporte, _servicios} = this.calcularTotales(g)
            g.servicios = _servicios
            g.reporte = reporte

            return g
          });
        await Promise.all(promesasVehiculos);
        return gastos_hoy_array;
    });

    function fullname(cliente){
      const {sucursal, nombre, apellidos} = cliente
      return `${nombre} ${apellidos}`.toUpperCase()
    }
    function placas(vehiculo){
      const {placas} = vehiculo
      return `${placas}`.toUpperCase()
    }

    const promesas_gastos_ordenes = await Promise.all(promesasConsultas);
    const muestra_ordenes = promesas_gastos_ordenes.flat()
    // console.log(muestra_ordenes);

    let total_ventas = 0

    
    const {inicial:fec_f, final: fech_f}= this.fecha_formateadas;


    const filtro = muestra_ordenes.filter(r=>new Date(r.fecha_entregado) >= fec_f && new Date(r.fecha_entregado) <= fech_f && r.status === 'entregado' )
    
    this.recepciones_arr = filtro

    // console.log(filtro);

    // const filtro_fechas = muestra_gastos_ordenes.filter(r=>new Date(r.fecha_entregado) >= fec_fa && new Date(r.fecha_entregado) <= fech_fa && r.status_orden === 'entregado' )
    let orden =0
    // las fechas de los gastos de orden son aunque no esten teminadas

    // console.log(filtro_fechas);
    
    filtro.forEach(g=>{
      const {historial_gastos} = g
      // console.log(historial_gastos);
      const new_historial_gastos = [...historial_gastos]
      new_historial_gastos.forEach(gas=>{
        const {monto, status} = gas
        if (status) {
          orden+= monto
        }
      })
      
    })

    this.reporte.orden = orden
    let total_refacciones = 0

    filtro.forEach(f=>{
      const { reporte, status } = f      
      if (status === 'entregado') {
        const {subtotal, refacciones} = reporte
        total_ventas += subtotal
        total_refacciones += refacciones
      }
    })
    this.reporte.ventas = total_ventas
    this.reporte.refacciones = total_refacciones
    
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
    const op_refacciones = total_ventas - total_refacciones
    // this.reporte.porcentajeGM = total_ventas / op_refacciones
    this.reporte.porcentajeGM = (this.reporte.sobrante / total_ventas) *  100
    //notas

    //gm /  VENTAS
    // res = ventas_totales - gastos_refacciones
total_ventas
    // porce = res / ventas_totales
    
    // agregar columna credito
    // sin modificacion de ordenes despues de entregado
    // y pago


    
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
    const {margen: new_margen, formaPago, elementos, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0, costos:0}
    
    const _servicios = [...elementos] 
    
    const margen = 1 + (new_margen / 100)
    _servicios.map((ele, index) =>{
      const {cantidad, costo, tipo, precio} = ele
      ele.index = index
      if (tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          ele.precio = mo + (refacciones * margen)
          ele.subtotal = mo + (refacciones * margen) * cantidad
          ele.total = (mo + (refacciones * margen)) * cantidad
          if (costo > 0 ){
            ele.total = costo * cantidad
            reporte.costos += costo * cantidad
          }else{
            reporte.mo += mo
            reporte.refacciones += refacciones
          }
        }
      }else if (tipo === 'mo' || tipo === 'refaccion') {

        // const operacion = this.mano_refaccion(ele)
        const operacion = (costo>0) ? cantidad * costo : cantidad * precio 

        ele.subtotal = operacion
        
        if (ele.aprobado){
          if (costo > 0 ){
            reporte.costos += (tipo === 'refaccion') ? operacion * margen : operacion
          }else{
            const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
            reporte[donde] += operacion
          }
          ele.total = (tipo === 'refaccion') ? operacion * margen : operacion
        }
      }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0

    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))

    const {mo, refacciones} = reporte

    reporte.refacciones_v = refacciones * margen

    let nuevo_total = mo + reporte.refacciones_v + reporte.costos
    
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

    reporte.ub = (nuevo_total - refacciones) * (100 / nuevo_total)
    return {reporte, _servicios}
    
  }
  mano_refaccion({costo, precio, cantidad}){
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete(ele){
    const reporte = {mo:0, refacciones:0}
    const {elementos} = ele
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
      const nueva_data = this.arreglar_info_recepciones(this.recepciones_arr)
      // const data_reporte_objetivos = this._publicos.crearArreglo2(this.reporte)

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

    const {elementos, no_os, status, reporte, historial_pagos    } = recep

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
    }
    = this.obtener_pormetodo(historial_pagos)

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
        credito: (formaPago === '1') ? `${0}` : `${1}`,
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
