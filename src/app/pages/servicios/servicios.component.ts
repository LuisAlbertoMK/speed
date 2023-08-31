
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

interface ServicioEditar {
  reporte: any;
  observaciones: any;
  elementos: any[];
  iva: boolean;
  formaPago: string;
  margen: number;
  // pathPDF: any;
  status: any;
  servicio: string;
  tecnico: any;
  showNameTecnico: string;
  descuento: number;
}

const db = getDatabase()
const dbRef = ref(getDatabase());

import { CitaComponent } from '../cita/cita.component';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
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
    private router: Router,
    private _reporte_gastos: ReporteGastosService

    ) {
      // this.columnasRecepcionesExtended[6] = 'expand';
     }
     ROL:string; SUCURSAL:string
     
     recepciones_arr=[]
     // tabla
     dataSource = new MatTableDataSource(); //elementos
    //  'clienteShow'
     elementos = ['sucursalShow','no_os','placas','status','fecha_recibido','fecha_entregado'] //,'searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
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
    servicios =  [ ...this._servicios.servicios ]
    
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

     servicio_editar = {...this._servicios.servicio_editar}
     servicio_editar_copia = {...this._servicios.servicio_editar}
    myControl_status= new FormControl('');

    my_control_1 = new FormGroup({
      formaPago: new FormControl('1'),
      iva: new FormControl(true),
      margen: new FormControl(25),
      descuento: new FormControl(0),
      servicio: new FormControl(1),
    });

    

    variable_modal:string = 'gasto'
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
    this.myControl_status.valueChanges.subscribe(status=>{
      if (this.servicio_editar.id && status) {
        // this.servicio_editar.status = status
        this.actualiza_Servicios(status)
      }
    })

      this.my_control_1.get('servicio').valueChanges.subscribe(servicio=>{
        this.servicio_editar.servicio = servicio
      })
      this.my_control_1.get('margen').valueChanges.subscribe(margen=>{
        let new_margen = margen < 25 ? 0 : margen
        this.servicio_editar.margen = new_margen
        this.asigna_resultados_servicio_editar()
      })
      this.my_control_1.get('iva').valueChanges.subscribe(iva=>{
        this.servicio_editar['iva'] = iva
        this.asigna_resultados_servicio_editar()
      })
      this.my_control_1.get('formaPago').valueChanges.subscribe(formaPago=>{
        this.servicio_editar['formaPago'] = formaPago
        this.asigna_resultados_servicio_editar()
      })
      this.my_control_1.get('descuento').valueChanges.subscribe(descuento=>{
        let new_descuento = descuento < 0 ? 0 : descuento
        this.servicio_editar['descuento'] = new_descuento
        this.asigna_resultados_servicio_editar()
      })

    
  }
  llamado_multiple(){
    const arreglo = ['recepciones','historial_gastos_orden','historial_pagos_orden']
    // const arreglo = ['historial_gastos_orden','recepciones','historial_gastos_operacion']
    const recepciones = ref(db, `recepciones`)
      onValue(recepciones, async (snapshot) => {
        if (snapshot.exists()) {
            this.consulta_ordenes()
        }
      })
    const historial_gastos_orden = ref(db, `historial_gastos_orden`)
      onValue(historial_gastos_orden, async (snapshot) => {
        if (snapshot.exists()) {
            this.consulta_ordenes()
        }
      })
    const historial_pagos_orden = ref(db, `historial_pagos_orden`)
      onValue(historial_pagos_orden, async (snapshot) => {
        if (snapshot.exists()) {
            this.consulta_ordenes()
        }
      })
  }
  resetea_horas_admin(){
    const {start, end} = this.fechas_filtro.value
    const simula_fecha =  new Date('03-23-2023')
    // console.log(simula_fecha);
    this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
    this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(end),this.hora_end) 
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
    
    const promesas = await Promise.all(promesasConsultas);
    // console.log(promesas);
    const finales = promesas.flat() 
    // console.log(finales);
    const ordenada = this._publicos.ordernarPorCampo(finales,'fecha_recibido')
    
    this.array_recepciones = ordenada
    this.filtra_informacion()
    
  }
  filtra_informacion(){

    const {start, end}= this.fecha_formateadas

    let resultados_1 = (this.filtro_tipo === 'Todos') ? this.array_recepciones : this.array_recepciones.filter(c=>c.status === this.filtro_tipo)

    const resultados =  (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)

    const filtro = resultados.filter(r=>new Date(r.fecha_recibido) >= start && new Date(r.fecha_recibido) <= end )
    // console.log(filtro);
    const campos = [
      'cliente','clienteShow','data_cliente','data_sucursal','data_vehiculo',
      'showNameTecnico','diasSucursal','fecha_promesa','fecha_recibido','formaPago','id',
      'iva','margen','no_os','placas','reporte','servicio','elementos','status','subtotal',
      'sucursal','sucursalShow','vehiculo','historial_pagos','historial_gastos','status','fecha_entregado',
      'pdf_entrega'
    ]
    this.recepciones_arr = (!this.recepciones_arr.length) ?  filtro :  this._publicos.actualizarArregloExistente(this.recepciones_arr, filtro,campos);
    
    //  = filtro

    this.dataSource.data = this.recepciones_arr
    this.newPagination()
  }
  obtenerArregloFechas_gastos_diarios(data){
    const {ruta, arreglo_sucursal} = data
    const fecha_start = new Date('08-02-2023')
    const fecha_end = this.fechas_get.end
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
    const { respuesta } = data;
    let  obtenidos = [];
    
      Object.values(respuesta).forEach((entrie) => {
        const nuevas_entries = this._publicos.crearArreglo2(entrie);
        obtenidos.push(...nuevas_entries);
      });
    
    return obtenidos;
  }


  ///acciones_modal_
  asigna_servicio(data){
    
  this.servicio_editar = JSON.parse(JSON.stringify(data));
  this.servicio_editar_copia = JSON.parse(JSON.stringify(data));
  // const newObj = 
  // const newObj_ = JSON.parse(JSON.stringify(data));
  // console.log();
  
  }
  Actualiza_data_os(){
    
    const {sonIguales,diferencias}  = this.compararObjetos(this.servicio_editar, this.servicio_editar_copia)
    // console.log({sonIguales,diferencias});

    if (sonIguales){
      this._publicos.cerrar_modal('modal-servicio-editar-btn')
      this._publicos.swalToast('Cambios realizados',1)
    }else{
      console.log('comprobar los cambios ');
      const updates= {}

      const campos_update = [
        'elementos',
        'iva',
        'formaPago',
        'margen',
        'status',
        'servicio',
        'tecnico',
        'showNameTecnico'
      ]
      const {sucursal, cliente, id} = this.servicio_editar


      campos_update.forEach(campo=>{
        if (this.servicio_editar[campo] ) {
          updates[`recepciones/${sucursal}/${cliente}/${id}/${campo}`] = this.servicio_editar[campo] 
        }
      })
      // console.log(updates);


      update(ref(db), updates).then(()=>{
        this._publicos.cerrar_modal('cerrar-modal')
        this._publicos.swalToast('Cambios realizados',1)
        this.asigna_servicio(this.servicio_editar)
      })
      .catch(err=>{
        console.log(err);
      })
    }
    
  }
  async actualiza_Servicios(status){
    const {respuesta } = await this._publicos.mensaje_pregunta(`Cambiar status de orden ${status}`,true, `Este cambio de status general afecta a los servicios de la orden`)
    if (!respuesta) return
    console.log(status);
    const elementos = [...this.servicio_editar.elementos]

    let new_status 
    switch (status) {
      case 'espera':
      case 'recibido':
      case 'autorizado':
        new_status = 'espera'
        break;
      case 'terminado':
      case 'entregado':
        new_status = status
        break;

      case 'cancelado':
        new_status = status
        break;
    }
    elementos.forEach(s => {
          if (s.aprobado) {
            s.status = new_status
          }
        });

    this.servicio_editar.elementos = elementos
    this.servicio_editar.status = status
    this.asigna_resultados_servicio_editar()
  }
  actualiza_servicio_unico(data){
    const {servicio, aprobado,status} = data
    const elementos = [...this.servicio_editar.elementos]
    elementos
    .map(s=>{
      if (s.id === servicio.id && typeof aprobado === 'boolean') {
        s.aprobado = aprobado
        if (!aprobado) s.status = 'espera' 
      }
      if (s.id === servicio.id && status) s.status = status
      return s 
    })

    const filtrado = elementos .filter(s=>s.status !== 'eliminado')
    this.servicio_editar.elementos = filtrado
    this.asigna_resultados_servicio_editar()
  }
  agregar_servicio(event){
    const {id} = event
    if (id) {
      this.servicio_editar.elementos.push( {...event,status: 'espera'})
      this.asigna_resultados_servicio_editar()
    }
  }
  agregar_paquete(event){
    const {id} = event
    if (id) {
      this.servicio_editar.elementos.push( {...event,status: 'espera'})
      this.asigna_resultados_servicio_editar()
    }
  }

  tecnico_os(event){
    if (event instanceof Object) {
      const {id, usuario} = event
      this.servicio_editar.tecnico = id
      this.servicio_editar.showNameTecnico =  usuario
    }
  }
  compararObjetos(obj1: ServicioEditar, obj2: ServicioEditar): { sonIguales: boolean; diferencias: string } {
    const campos_comparar = ['elementos','reporte','servicio','margen','iva','descuento','status','tecnico','formaPago']

    const diferencias: string[] = [];
    let sonIguales = true;
    for (const key of campos_comparar) {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        sonIguales = false;
        diferencias.push(key);
      }
    }
    const otras_ = diferencias.join(', ')
    return { sonIguales, diferencias: otras_ };
  }
  async cerrar_modal_servicio_editar(){
    const {sonIguales,diferencias} = this.compararObjetos(this.servicio_editar, this.servicio_editar_copia)
    if (!sonIguales) {
      const {respuesta } = await this._publicos.mensaje_pregunta(`Guardar cambios en O.S`,false, `cambio de información en: ${diferencias} `)
      if (respuesta) {
        this.Actualiza_data_os() 
      }else{
        this.asigna_servicio(this.servicio_editar_copia)
        this._publicos.cerrar_modal('cerrar-modal')
        this._publicos.swalToast('se cancelo la actualizacion',0)
      }
    }else{
      this.asigna_servicio(this.servicio_editar_copia)
      this._publicos.cerrar_modal('cerrar-modal')
    }
  }
  asigna_resultados_servicio_editar(){
    const {reporte, elementos} = this.calcularTotales(this.servicio_editar);
    this.servicio_editar.reporte = reporte
    this.servicio_editar.elementos = elementos
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
 
}
  
  
  

