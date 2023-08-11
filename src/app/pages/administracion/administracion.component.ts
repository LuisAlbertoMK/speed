import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { FormControl, FormGroup } from '@angular/forms';
import { getDatabase, onValue, ref, update } from "firebase/database";
import { SucursalesService } from 'src/app/services/sucursales.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';

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

  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,  private _sucursales: SucursalesService,
    private _cotizaciones: CotizacionesService,  private _servicios: ServiciosService, private _clientes: ClientesService, private _vehiculos: VehiculosService,
    private _reporte_gastos: ReporteGastosService) { }
  USUARIO:string
  ROL:string
  SUCURSAL:string

  miniColumnas:number = 100

  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  metodospago       =   [ ...this._cotizaciones.metodospago  ]
  sucursales_array  =   [ ...this._sucursales.lista_en_duro_sucursales  ]

  rangeAdministracion = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  hora_start = '00:00:01';
  hora_end = '23:59:59';

  fechas_getAdministracion ={start:new Date(), end:new Date() }
  fechas_get_formateado_admin = {start:new Date(), end:new Date() }

  sucursalFiltroReporte: string = 'Todas'
  filtro_entregado_recibido: string = 'fecha_entregado'
  filtros_entregado_recibido= [
    {valor: 'fecha_recibido', show:'fecha recibido'},
    {valor: 'fecha_entregado', show:'fecha entregado'},
  ]

  array_recepciones = []
//   clienteShow
// placas
// sucursalShow
// subtotal

  dataSourceAdministracion = new MatTableDataSource(); //elementos
  elementosAdministracion = ['sucursalShow','no_os','fecha_recibido','fecha_entregado','subtotal','clienteShow']; //elementos
  columnsToDisplayWithExpandAdministracion = [...this.elementosAdministracion, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('AdministracionPaginator') paginatorAdministracion: MatPaginator //elementos
  @ViewChild('Administracion') sortAdministracion: MatSort //elementos


  camposReporteAdministracion = [
    {valor:'cantidad', show:'Ordenes cerradas'},
    {valor:'subtotal', show:'Monto de ventas (Antes de IVA)'},
    {valor:'refacciones', show:'Costos Refacciones (de los autos cerrados)'},
    {valor:'operacion', show:'Costo Operacion'},
    {valor:'margen', show:'Margen'},
    {valor:'por_margen', show:'% Margen'},
  ]
  reporteAdministracion = {
    iva:0, refacciones:0, total:0, subtotal:0, operacion:0, cantidad:0,
    margen:0, por_margen:0
  }

  formasPAgo = [
    {
        id: '1',
        pago: 'contado',
        interes: 0,
        numero: 0
    }, {
        id: '2',
        pago: '3 meses',
        interes: 4.49,
        numero: 3
    }, {
        id: '3',
        pago: '6 meses',
        interes: 6.99,
        numero: 6
    }, {
        id: '4',
        pago: '9 meses',
        interes: 9.90,
        numero: 9
    }, {
        id: '5',
        pago: '12 meses',
        interes: 11.95,
        numero: 12
    }, {
        id: '6',
        pago: '18 meses',
        interes: 17.70,
        numero: 18
    }, {
        id: '7',
        pago: '24 meses',
        interes: 24.,
        numero: 24
    }
  ]
  ngOnInit(): void {
    this.rol()
  }

  rol(){
    const { rol, sucursal, usuario} = this._security.usuarioRol()
    this.USUARIO = usuario
    this.ROL = rol
    this.SUCURSAL = sucursal
    if (sucursal !=='Todas') this.sucursalFiltroReporte = sucursal
    // this.filtro_sucursal =  this.SUCURSAL 
    // this.vigila()
    // this.primeraVez_fechas_default()
    this.resetea_horas_admin(this.rangeAdministracion.value)
    this.vigila()
    this.llamada_multiple()
  }
  vigila(){
    this.rangeAdministracion.valueChanges.subscribe(({start:start_, end: end_})=>{
      if (start_ && start_['_d'] && end_ && end_['_d'] ) {
        this.resetea_horas_admin({start: start_, end: end_})
      }        
    })
  }
  resetea_horas_admin(data){
    const {start, end} = data
    this.fechas_get_formateado_admin.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
    this.fechas_get_formateado_admin.end = this._publicos.resetearHoras_horas(new Date(end), this.hora_end)
    this.filtra_informacion()
  }
  llamada_multiple(){
    // this.formate_fecha_horas()
    const arreglo = ['historial_gastos_orden','recepciones','historial_gastos_operacion']
    arreglo.forEach(donde=>{
      const starCountRef = ref(db, `${donde}`)
      onValue(starCountRef, async (snapshot) => {
        if (snapshot.exists()) {
          // console.log(donde);
          // this.ordenes_realizadas_entregado()
          this.consulta_ordenes()
        }
      })
      
    })
  }

  async consulta_ordenes(){
    const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this.SUCURSAL]

    const arreglo_rutas = this.crea_ordenes_sucursal({arreglo_sucursal})
   
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

    // console.log(promesas_gastos_orden);
    // console.log( promesas_gastos_orden.flat() );
    const muestra_gastos_ordenes = promesas_gastos_orden.flat()
    // console.log(arreglo_rutas);
    
    const promesasConsultas = arreglo_rutas.map(async (f_search) => {

      const respuesta = await  this._servicios.consulta_recepcion_sucursal({ruta: f_search})
      // console.log(respuesta)
      const gastos_hoy_array = await this.regresa_servicios_por_cada_ruta({respuesta}) 
      // console.log(gastos_hoy_array);
      
        const promesasVehiculos = gastos_hoy_array
          
          .map(async (g) => {
            const { sucursal, cliente, vehiculo , id} = g;
            // console.log(id);
            
            // g.data_vehiculo = await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
            const data_cliente:any =  await this._clientes.consulta_cliente_new({sucursal, cliente})
            g.data_cliente = data_cliente
            g.clienteShow = data_cliente.fullname
            const data_vehiculo:any =  await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
            const historial_pagos:any =  await this._servicios.historial_pagos({ sucursal, cliente, id });
            // console.log(historial_pagos);
            
            const historial_gastos = muestra_gastos_ordenes.filter(g=>g.numero_os === id)
            g.historial_pagos = historial_pagos
            g.historial_gastos = historial_gastos
            g.data_vehiculo = data_vehiculo
            g.placas = data_vehiculo.placas
            const data_sucursal =  this.sucursales_array.find(s=>s.id === sucursal)
  
            g.data_sucursal =  data_sucursal
            g.sucursalShow = data_sucursal.sucursal
            const {reporte, _servicios} = this.calcularTotales(g);
            g.reporte = reporte
            g.subtotal = reporte.subtotal
            g.servicios = _servicios
            return g
          });
        await Promise.all(promesasVehiculos);
        return gastos_hoy_array;
    });
    
    const promesas = await Promise.all(promesasConsultas);
    // console.log(promesas);
    const finales = promesas.flat() 
    // console.log(finales);

    const ordenada = this._publicos.ordernarPorCampo(finales,'fecha_recibido')
    
    const campos = [
      'cliente','clienteShow','data_cliente','data_sucursal','data_vehiculo','showNameTecnico','diasSucursal','fecha_promesa','fecha_recibido','formaPago','id','iva','margen','no_os','placas','reporte','servicio','servicios','status','subtotal','sucursal','sucursalShow','vehiculo','historial_pagos','historial_gastos'
    ]

    const filtro_entregado = ordenada.filter(o=>o.status === 'entregado')
    // console.log(filtro_entregado);
    
    const nueva  = (!this.array_recepciones.length) ?  filtro_entregado :  this._publicos.actualizarArregloExistente(this.array_recepciones, filtro_entregado,campos);
    // console.log(nueva);
    
    this.array_recepciones = nueva
    this.filtra_informacion()
    
  }
  filtra_informacion(){

    const {start, end}= this.fechas_get_formateado_admin

    const filtro_fecha = 
      (this.filtro_entregado_recibido === 'fecha_recibido') 
      ? this.array_recepciones.filter(c=>new Date(c[this.filtro_entregado_recibido]) >= start && new Date(c[this.filtro_entregado_recibido]) <= end )
      : this.array_recepciones.filter(c=>new Date(c[this.filtro_entregado_recibido]) >= start && new Date(c[this.filtro_entregado_recibido]) <= end )
    
    let filtro_sucursal = (this.sucursalFiltroReporte === 'Todas') ? filtro_fecha : filtro_fecha.filter(c=>c.sucursal === this.sucursalFiltroReporte)
    
    this.reporteAdministracion.cantidad = filtro_sucursal.length
    this.obtener_Admin(filtro_sucursal)
    
    this.dataSourceAdministracion.data = filtro_sucursal
    this.newPagination()
  }
  obtener_Admin(data){
    const reporte_admin = { iva:0,refacciones:0,total:0,subtotal:0,operacion:0,cantidad:0,margen:0,por_margen:0 }
    const arreglo = [...data]
    
    arreglo.forEach(r=>{
      const {reporte} = r
      const new_r = {...reporte}
      const {mo, refacciones_v} = new_r
      const subtotal = mo + refacciones_v
      reporte_admin.refacciones += refacciones_v
      reporte_admin.subtotal += subtotal
    })
    const arreglo_ = ['historial_gastos_operacion']
    const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this.SUCURSAL]
    arreglo_.forEach(async(donde)=>{

      const arreglo_fechas_busca = this.obtenerArregloFechas_gastos_diarios({ruta: donde, arreglo_sucursal})

      const promesasConsultas = arreglo_fechas_busca.map(async (f_search) => {
        const gastos_hoy_array: any[] = await this._reporte_gastos.gastos_hoy({ ruta: f_search});
        return gastos_hoy_array;
      })
      const promesas = await Promise.all(promesasConsultas);
      const finales = promesas.flat()

      
      const {start, end}= this.fechas_get_formateado_admin
      const _filtro_finales_fechas =  finales.filter(c=>new Date(c.fecha_recibido) >= start && new Date(c.fecha_recibido) <= end )

      _filtro_finales_fechas.forEach(op=>{
        reporte_admin.operacion += op.monto
      })
    })
    if (reporte_admin.subtotal >0 ) {
      reporte_admin.margen = reporte_admin.subtotal - reporte_admin.refacciones
      reporte_admin.por_margen = (reporte_admin.margen / reporte_admin.subtotal) * 100
    }
    reporte_admin.cantidad = arreglo.length

    this.reporteAdministracion = reporte_admin
  }
  obtenerArregloFechas_gastos_diarios(data){
    const {ruta, arreglo_sucursal} = data
    const fecha_start = new Date('08-02-2023')
    const fecha_end = this.fechas_getAdministracion.end
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

  crea_ordenes_sucursal(data){
    const {arreglo_sucursal, } = data
    let Rutas_retorna = []
    arreglo_sucursal.forEach(sucursal=>{
      Rutas_retorna.push(`recepciones/${sucursal}`)
    })
    return Rutas_retorna
  }
  newPagination(){
    setTimeout(() => {
      this.dataSourceAdministracion.paginator = this.paginatorAdministracion;
      this.dataSourceAdministracion.sort = this.sortAdministracion;
    }, 500);
  }


  calcularTotales(data) {
    const {margen: new_margen, formaPago, servicios, elementos, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0}
    const servicios_ = (elementos) ? elementos : servicios
    const _servicios = [...servicios_] 
    const margen = 1 + (new_margen / 100)
    _servicios.map(ele=>{
      const {cantidad, costo} = ele
      if (ele.tipo === 'paquete') {
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
      }else if (ele.tipo === 'mo') {
        const operacion = this.mano_refaccion(ele)
        if (ele.aprobado) {
          reporte.mo += operacion
        }
        ele.subtotal = operacion
        ele.total = operacion
      }else if (ele.tipo === 'refaccion') {
        const operacion = this.mano_refaccion(ele)
        if (ele.aprobado) {
          reporte.refacciones += operacion
          reporte.refacciones_v += operacion * margen
        }
        ele.subtotal = operacion
        ele.total = operacion * margen
      }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0
    const enCaso_meses = this.formasPAgo.find(f=>f.id === String(formaPago))
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
    return {reporte, _servicios}
    
  }
  mano_refaccion(ele){
    const {costo, precio, cantidad} = ele
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete(data){
    const {elementos} = data
    const reporte = {mo:0, refacciones:0}
    elementos.forEach(ele=>{
      if (ele.tipo === 'mo') {
        const operacion = this.mano_refaccion(ele)
        reporte.mo += operacion
      }else if (ele.tipo === 'refaccion') {
        const operacion = this.mano_refaccion(ele)
        reporte.refacciones += operacion
      }
    })
    return reporte
  }
}
