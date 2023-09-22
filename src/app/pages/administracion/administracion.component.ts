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
  elementosAdministracion = ['no_os','fecha_recibido','fecha_entregado','subtotal','fullname']; //elementos
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

  
  ngOnInit(): void {
    this.rol()
  }

  rol(){
    const { rol, sucursal, usuario} = this._security.usuarioRol()
    this.USUARIO = usuario
    this.ROL = rol
    this.SUCURSAL = sucursal
    if (sucursal !=='Todas') this.sucursalFiltroReporte = sucursal
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
    this.consulta_ordenes()
    
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
    const _orden = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_orden())
    const _pagos = this._publicos.crearArreglo2( await this._servicios.consulta_pagos())
    const _recepciones = this._publicos.crearArreglo2( await this._servicios.consulta_recepciones_())
    const {start, end}= this.fechas_get_formateado_admin
    const nuevas = _recepciones.filter(r=>new Date(r.fecha_entregado) >= start && new Date(r.fecha_entregado) <= end && r.status === 'entregado').map(recepcion=>{
      const { id, elementos, margen, iva } = recepcion
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
      
      
      recepcion.reporte = sumatoria_reporte(reporte_sum, margen, iva)
      recepcion.reporte_real = sumatoria_reporte(nuevo, margen, iva)
      
      return recepcion
    })

    this.array_recepciones = nuevas
    this.filtra_informacion()
    
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
          }else{
            reporte[tipo] += precio
          }
      })
      return reporte
    }
  }
  async filtra_informacion(){

    const {start, end}= this.fechas_get_formateado_admin

    const _operacion = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_operacion())
    const filtro_fecha = 
      (this.filtro_entregado_recibido === 'fecha_recibido') 
      ? this.array_recepciones.filter(c=>new Date(c[this.filtro_entregado_recibido]) >= start && new Date(c[this.filtro_entregado_recibido]) <= end )
      : this.array_recepciones.filter(c=>new Date(c[this.filtro_entregado_recibido]) >= start && new Date(c[this.filtro_entregado_recibido]) <= end )
    
    let filtro_sucursal = (this.sucursalFiltroReporte === 'Todas') ? filtro_fecha : filtro_sucursal_(filtro_fecha,this.sucursalFiltroReporte)
    
    const {total_ordenes,total_ventas } = suma_gastos_ordenes(filtro_sucursal)
    const tota_refacciones = suma_refacciones_os_cerradas(filtro_sucursal)

 
    
    this.reporteAdministracion.subtotal =total_ventas
    this.reporteAdministracion.refacciones = tota_refacciones

    // const operacion_sucursal =  filtro_sucursal_(_operacion,this.sucursalFiltroReporte)

    const cuales = (this.sucursalFiltroReporte === 'Todas') ? _operacion : filtro_sucursal_(_operacion,this.sucursalFiltroReporte)

    this.reporteAdministracion.operacion = filtro_fecha_operacion(cuales,start, end)

    if (this.reporteAdministracion.subtotal >=0 ) {
      this.reporteAdministracion.margen = this.reporteAdministracion.subtotal - this.reporteAdministracion.refacciones
      this.reporteAdministracion.por_margen = (this.reporteAdministracion.margen / this.reporteAdministracion.subtotal) * 100
    }

    this.reporteAdministracion.cantidad = filtro_sucursal.length

    // this.obtener_Admin(filtro_sucursal)
    
    this.dataSourceAdministracion.data = filtro_sucursal
    this.newPagination()

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
    function suma_refacciones_os_cerradas(arreglo:any[]){
      let refacciones = 0
      arreglo.forEach(recep=>{
        const {reporte} = recep
        const {refaccionVenta} = reporte
        refacciones += refaccionVenta
      })
      return refacciones
    }
    function filtro_fecha_operacion(arreglo:any[],start:Date, end:Date){
      const filtro_ = arreglo.filter(r=>new Date(r.fecha_recibido) >= new Date(start) && new Date(r.fecha_recibido) <= new Date(end))
        let total = 0
        filtro_.forEach(f=>{
          const {status, monto} = f
          if(status) total += monto
        })
        return  total
    }
    function filtro_sucursal_(arreglo:any[], sucursal:string){
      return arreglo.filter(c=>c.sucursal === sucursal)
    }
  }

  newPagination(){
    setTimeout(() => {
      this.dataSourceAdministracion.paginator = this.paginatorAdministracion;
      this.dataSourceAdministracion.sort = this.sortAdministracion;
    }, 500);
  }



}
