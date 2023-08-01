
import { Component, OnInit, ViewChild, OnDestroy, AfterContentChecked, AfterViewInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { EmailsService } from 'src/app/services/emails.service';
import { child, get, getDatabase, onValue, ref, set, push , update} from 'firebase/database';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import { ExporterService } from 'src/app/services/exporter.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { Router } from '@angular/router';



const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css'],
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
export class ServiciosComponent implements OnInit, OnDestroy {

  
  constructor( 
    private _publicos: ServiciosPublicosService, 
    private _email:EmailsService, 
    private _security:EncriptadoService,
    private _export_excel: ExporterService,
    private _sucursales: SucursalesService,
    private _clientes: ClientesService,
    private _cotizaciones: CotizacionesService,
    private _vehiculos: VehiculosService,
    private _servicios: ServiciosService,
    private _campos: CamposSystemService,
    private router: Router
    ) {
      // this.columnasRecepcionesExtended[6] = 'expand';
     }
     ROL:string; SUCURSAL:string
     
     recepciones_arr=[]
     // tabla
     dataSource = new MatTableDataSource(); //elementos
     elementos = ['sucursalShow','no_os','placas','clienteShow','status','fecha_recibido','fecha_entregado'] //,'searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
     columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
     expandedElement: any | null; //elementos
     @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
     @ViewChild('elements') sort: MatSort //elementos
   
     camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce ]
     camposCliente    =  [ ...this._clientes.camposCliente_show ]
     camposVehiculo   =  [ ...this._vehiculos.camposVehiculo_ ]
     formasPago       =  [ ...this._cotizaciones.formasPago ]
     metodospago      =  [ ...this._cotizaciones.metodospago ]
     sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]

     paquete: string     = this._campos.paquete
     refaccion: string   = this._campos.refaccion
     mo: string          = this._campos.mo
     miniColumnas:number = this._campos.miniColumnas
   
     estatusServicioUnico = [ ...this._servicios.estatusServicioUnico]
     statusOS             = [ ...this._servicios.statusOS ]
     // 'espera','autorizado','recibido','terminado','entregado','cancelado'
     indexEdicionRecepcion: number; indexEdicionRecepcionBoolean: boolean =  false
     dataOcupadaOS:any = {}
   
     busquedaStatus: string = 'todos'
     busquedaSucursalString: string = 'Todas'
     busquedaSucursalStringShow: string = 'Todas'
     
     fechas_filtro = new FormGroup({
      start: new FormControl(new Date()),
      end: new FormControl(new Date()),
     });
   
     fechas_get = {start: this._publicos.resetearHoras(new Date()), end: this._publicos.resetearHoras(new Date())}
     busquedaServicios:string = null
     
     idSucursalOS: string = null
   
     dataRecepcionEditar = null
     tiempoReal = true
     
   
     realizaGasto:string = null
     
     BusquedaTo: string = 'fecha_recibido'
   
     busqueda2 = [
       {valor:'fecha_recibido', show:'Fecha de Recibido'},
       {valor:'fecha_entregado', show:'Fecha de Entregado'},
     ]
     menuListaBusqueda_arr = [ ...this._servicios.menuListaBusqueda_arr]
     diasBusqueda: number = 0
     rangoBusqueda = {valor:'hoy',show:'Hoy', dias: 0}
   
     reporteEstancias = {  ...this._servicios.reporteEstancias}
     camposEstancia = [ ...this._servicios.camposEstancia]
    

     fecha_formateadas = {start:new Date(), end:new Date() }
     hora_start = '00:00:01';
     hora_end = '23:59:59';

     array_recepciones = []

     filtro_sucursal:string = 'Todas'
     filtro_tipo: string = 'Todos'
     ngOnDestroy(){
     
     }
    ngOnInit(): void {
      // this.consultaSucursales()
      this.rol()
      this.resetea_horas_admin()
      this.vigila()
      this.llamado_multiple()
    }

  
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal 
    this.filtro_sucursal =  this.SUCURSAL 
  }
  vigila(){
    this.fechas_filtro.valueChanges.subscribe(({start:start_, end: end_})=>{
      if (start_ && start_['_d'] && end_ && end_['_d'] ) {
        // this.resetea_horas_admin({start: start_, end: end_})
        this.resetea_horas_admin()
        this.filtra_informacion()
      }        
    })
  }
  llamado_multiple(){
    const arreglo = ['recepciones']
    // const arreglo = ['historial_gastos_orden','recepciones','historial_gastos_operacion']
    arreglo.forEach(donde=>{
      const starCountRef = ref(db, `${donde}`)
      onValue(starCountRef, async (snapshot) => {
        if (snapshot.exists()) {
          console.log(donde);
          // this.ordenes_realizadas_entregado()
          if (donde === 'recepciones') {
            this.consulta_ordenes()
          }
        }
      })
    })
  }
  resetea_horas_admin(){
    const {start, end} = this.fechas_filtro.value
    this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
    this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(end),this.hora_end) 
  }
  async consulta_ordenes(){
    const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this.SUCURSAL]
    // console.log(arreglo_sucursal);
    const arreglo_rutas = this.crea_ordenes_sucursal({arreglo_sucursal})
    // console.log(arreglo_rutas);
    const promesas = arreglo_rutas.map(async (ruta)=>{
        
      // const cliente = await this._clientes.consulta_cliente_new({sucursal:''})
      const respuesta = await  this._servicios.consulta_recepcion_sucursal({ruta})
      
        return this.regresa_servicios_por_cada_ruta({answer: respuesta}) 
    })
    const promesas_resueltas = await Promise.all(promesas);
    const finales = promesas_resueltas.flat() 
    // console.log(finales);

    const rutas_clientes = this.rutas_cliente(finales)

    console.log(rutas_clientes);
    
    
    const campos = [
      'cliente','clienteShow','data_cliente','data_sucursal','data_vehiculo','diasSucursal','fecha_promesa','fecha_recibido','formaPago','id','iva','margen','no_os','placas','reporte','servicio','servicios','status','subtotal','sucursal','sucursalShow','vehiculo'
    ]

    const nueva  = (!this.array_recepciones.length) ?  rutas_clientes :  this._publicos.actualizarArregloExistente(this.array_recepciones, rutas_clientes,campos);

    this.array_recepciones = nueva
    this.filtra_informacion()
    
  }
  filtra_informacion(){

    const {start, end}= this.fecha_formateadas

    let resultados_1 = (this.filtro_tipo === 'Todos') ? this.array_recepciones : this.array_recepciones.filter(c=>c.status === this.filtro_tipo)

    const resultados =  (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)

    const filtro = resultados.filter(r=>new Date(r.fecha_recibido) >= start && new Date(r.fecha_recibido) <= end )

    this.dataSource.data = filtro
    this.newPagination()
  }

  newPagination(){
   
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
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
        // console.log(entri_);
        const reporte = this.reporte_general(entri_)
        const nueva = {...entri_, reporte}
        obtenidos.push(nueva)
      })
    })
    return obtenidos
  }
  rutas_cliente(data){
    const arreglo = [...data]
    arreglo.map(async(r)=>{
      const {sucursal, cliente, vehiculo} = r
      const data_cliente:any =  await this._clientes.consulta_cliente_new({sucursal, cliente})
      const data_vehiculo =  await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
      const data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
      
      
      r.clienteShow = String(data_cliente.fullname).toLowerCase()
      r.placas = data_vehiculo.placas
      r.sucursalShow = data_sucursal.sucursal
      r.servicios =  this.caso_paquete({servicios: r.servicios, id: r.id})
      r.data_cliente = data_cliente
      r.data_vehiculo = data_vehiculo
      r.data_sucursal = data_sucursal
      // const reporte = this.reporte_general(r)
      // r.reporte = reporte
      // const {mo, refacciones_v,} = reporte
      // r.subtotal = mo + refacciones_v

      return r
    })    
    return arreglo
  }
  caso_paquete(data_paquete){
    const {servicios:servicios_, id} = data_paquete
    let servicios = [...servicios_]
    servicios.map(e=>{
      // console.log(e);
      
      const  {tipo, reporte, cantidad, costo} = e
      if (tipo === 'paquete') {
        const nuevo_r = {...reporte}
        const {precio} = nuevo_r
        e.precio = precio
        e.costo = costo
        const mul = (costo> 0) ? costo : precio
        e.subtotal = mul * cantidad
        e.total = mul * cantidad
      }
      return e
    })
    // console.log(elementos);
    
    return servicios
  }
  reporte_general(data){
    const {servicios} = data
    const elementos_ = [...servicios] || []
    const reporte = {mo:0, refacciones:0, refacciones_v:0, sobrescrito_mo:0, sobrescrito_refacciones:0,precio:0, ub:0, paquetes:0, paquetes_sobresrito:0}
    elementos_.map(element=>{
        const {tipo, costo, precio, aprobado, total, cantidad } = element
        if (aprobado) {
            let mul
            switch (tipo) {
                case 'MO':
                case 'mo':
                    reporte.mo +=  total 
                    if (costo>0 ) {
                        reporte.sobrescrito_mo += total
                    }
                break;
                case 'refaccion':
                    reporte.refacciones +=  precio
                    reporte.refacciones_v +=  total
                    if (costo>0 ) { reporte.sobrescrito_refacciones += total }
                break;
                case 'paquete':
                    const { reporte:reporte_interno } = element
                    reporte.paquetes += reporte_interno.precio
                    if (costo>0 ) { reporte.paquetes_sobresrito += reporte_interno.precio }
                    const ca = [
                        'mo',
                        'precio',
                        'refacciones',
                        'refacciones_v',
                        'sobrescrito_mo',
                        'sobrescrito_refacciones',
                    ]
                    
                    ca.forEach(c=>{
                        reporte[c] +=  reporte_interno[c]
                    })

                break;
            }
        }
    })
    const {mo,  refacciones_v, paquetes} = reporte
    const precio__ = mo + refacciones_v
    reporte.precio = precio__
    reporte.ub = 100 - ((refacciones_v * 100) / precio__ )
    return reporte
}
  
  
}
