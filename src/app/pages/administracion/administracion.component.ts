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
    this.ordenes_realizadas_entregado()
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
          this.ordenes_realizadas_entregado()
        }
      })
      
    })
  }
  async ordenes_realizadas_entregado(){
    // console.time('Execution Time');

    const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this.SUCURSAL]
    // const arreglo_fechas_busca = this.obtenerArregloFechas_gastos_diarios({ruta: donde, arreglo_sucursal})
    const arreglo_rutas = this.crea_ordenes_sucursal({arreglo_sucursal})
    const promesas = arreglo_rutas.map(async (ruta)=>{
        
        // const cliente = await this._clientes.consulta_cliente_new({sucursal:''})
        const respuesta = await  this._servicios.consulta_recepcion_sucursal({ruta})
        
        return this.regresa_servicios_por_cada_ruta({answer: respuesta}) 
    })

    const promesas_resueltas = await Promise.all(promesas);
    const finales = promesas_resueltas.flat() //.filter(s=>s.status === 'entregado');
    // console.log(finales);

    const rutas_clientes = this.rutas_cliente(finales)
    // console.log(rutas_clientes);
    
    this.array_recepciones  = rutas_clientes
    // console.timeEnd('Execution Time');
    this.filtra_informacion()
  }
  filtra_informacion(){

    const {start, end} = this.fechas_get_formateado_admin

    const filtro_sucursal = (this.sucursalFiltroReporte === 'Todas') ? this.array_recepciones : this.array_recepciones.filter(r=>r.sucursal === this.sucursalFiltroReporte)

    const informacion_filtrada = filtro_sucursal.filter(recep=>recep.status === 'entregado' && new Date(recep[this.filtro_entregado_recibido]) >= start && new Date(recep[this.filtro_entregado_recibido]) <= end)
    // console.log(informacion_filtrada);

    // console.log('realizar las operaciones de administracion');
    this.camposReporteAdministracion
    this.reporteAdministracion

    this.obtenerAdmin(informacion_filtrada)
    
    
    this.dataSourceAdministracion.data = informacion_filtrada
    this.newPagination()
  }
  async obtenerAdmin(data){
    // console.log(data);
    const reporte_admin = { iva:0,refacciones:0,total:0,subtotal:0,operacion:0,cantidad:0,margen:0,por_margen:0 }

    const arreglo = [...data]
    arreglo.forEach(r=>{
      const {reporte} = r
      const new_r = {...reporte}
      const {mo, refacciones, refacciones_v} = new_r
      const subtotal = mo + refacciones
      reporte_admin.refacciones += refacciones
      reporte_admin.subtotal += subtotal
    })
    
    const arreglo_ = ['historial_gastos_orden','historial_gastos_operacion']

    const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this.SUCURSAL]
    arreglo_.forEach(async(donde)=>{

      const arreglo_fechas_busca = this.obtenerArregloFechas_gastos_diarios({ruta: donde, arreglo_sucursal})

      const promesasConsultas = arreglo_fechas_busca.map(async (f_search) => {
        const gastos_hoy_array: any[] = await this._reporte_gastos.gastos_hoy({ ruta: f_search});
        return gastos_hoy_array;
      })
      const promesas = await Promise.all(promesasConsultas);
      promesas.forEach(c=>{
        const arreglo_inter:any[] = c
        arreglo_inter.forEach(f=>{
          if (f.status) {
          if (f.tipo === 'orden' && f.gasto_tipo === 'refaccion') {
            reporte_admin.refacciones += f.monto
          }
          if (f.tipo === 'operacion') {
            reporte_admin.operacion += f.monto
          }
          }
        })
      })
    })
    
    reporte_admin.cantidad = arreglo.length

    if (reporte_admin.subtotal >0 ) {
      reporte_admin.margen = reporte_admin.subtotal - reporte_admin.refacciones
      reporte_admin.por_margen = (reporte_admin.margen / reporte_admin.subtotal) * 100
    }

    this.reporteAdministracion = reporte_admin
  }
  crea_ordenes_sucursal(data){
    const {arreglo_sucursal, } = data
    let Rutas_retorna = []
    arreglo_sucursal.forEach(sucursal=>{
      Rutas_retorna.push(`recepciones/${sucursal}`)
    })
    return Rutas_retorna
  }
  regresa_servicios_por_cada_ruta(data){
    const {answer } = data
    const obtenidos = []
    const nueva = {...answer}

    Object.entries(nueva).forEach(([key, entrie])=>{
      const nuevas_entries = this._publicos.crearArreglo2(entrie)
      nuevas_entries.forEach(entri_=>{
        obtenidos.push(entri_)
      })
    })
    
    return obtenidos
  }
  rutas_cliente(data){
    const arreglo = [...data]
    arreglo.map(async(r)=>{
      const {sucursal, cliente, vehiculo, reporte} = r
      const data_cliente:any =  await this._clientes.consulta_cliente_new({sucursal, cliente})
      const data_vehiculo =  await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
      const data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
      
      const {mo, refacciones_v} = reporte

      r.clienteShow = data_cliente.fullname
      r.placas = data_vehiculo.placas
      r.sucursalShow = data_sucursal.sucursal
      r.subtotal = mo + refacciones_v

      r.data_cliente = data_cliente
      r.data_vehiculo = data_vehiculo
      r.data_sucursal = data_sucursal
      return r
    })
    return arreglo
  }
  obtenerArregloFechas_gastos_diarios(data){
    const {ruta, arreglo_sucursal} = data
    const fecha_start = this.fechas_get_formateado_admin.start
    const fecha_end = this.fechas_get_formateado_admin.end
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

  newPagination(){
    // const dataSource = donde === 'admin' ? this.dataSourceAdministracion : this.dataSource;
    // const paginator = donde === 'admin' ? this.paginatorAdministracion : this.paginator;
    // const sort = donde === 'admin' ? this.sortAdministracion : this.sort;
    
    setTimeout(() => {
      this.dataSourceAdministracion.paginator = this.paginatorAdministracion;
      this.dataSourceAdministracion.sort = this.sortAdministracion;
    }, 500);
  }
}
