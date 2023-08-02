
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
  cliente: any;
  data_cliente: any;
  vehiculo: any;
  data_vehiculo: any;
  sucursal: any;
  data_sucursal: any;
  reporte: any;
  no_os: any;
  dataFacturacion: any;
  observaciones: any;
  id: any;
  checkList: any[];
  vehiculos: any[];
  servicios: any[];
  iva: boolean;
  formaPago: string;
  margen: number;
  personalizados: any[];
  detalles: any[];
  diasEntrega: number;
  fecha_promesa: string;
  firma_cliente: any;
  pathPDF: any;
  status: any;
  diasSucursal: number;
  fecha_recibido: any;
  notifico: boolean;
  servicio: string;
  tecnico: any;
  showNameTecnico: string;
  descuento: number;
}

const db = getDatabase()
const dbRef = ref(getDatabase());

import { CitaComponent } from '../cita/cita.component';
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

     servicio_editar = {
        cliente:null, data_cliente:null, vehiculo:null, data_vehiculo:null,sucursal:null, data_sucursal:null, reporte:null, no_os:null, 
        dataFacturacion: {},observaciones:null, id:null,
        checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:'1', margen: 25, personalizados: [],
        detalles:[],diasEntrega: 0, fecha_promesa: '', firma_cliente:null, pathPDF:null, status:null, diasSucursal:0,
        fecha_recibido:null, notifico:true,servicio:'1', tecnico:null, showNameTecnico: '', descuento:0
      }
     servicio_editar_copia = {
        cliente:null, data_cliente:null, vehiculo:null, data_vehiculo:null,sucursal:null, data_sucursal:null, reporte:null, no_os:null, 
        dataFacturacion: {},observaciones:null, id:null,
        checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:'1', margen: 25, personalizados: [],
        detalles:[],diasEntrega: 0, fecha_promesa: '', firma_cliente:null, pathPDF:null, status:null, diasSucursal:0,
        fecha_recibido:null, notifico:true,servicio:'1', tecnico:null, showNameTecnico: '', descuento:0
      }
    myControl_status= new FormControl('');

    my_control_1 = new FormGroup({
      formaPago: new FormControl('1'),
      iva: new FormControl(true),
      margen: new FormControl(25),
      servicios: new FormControl(),
    });

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
    const vigila = ['margen','iva','formaPago']
    
      this.my_control_1.get('margen').valueChanges.subscribe(margen=>{
        this.servicio_editar.margen = margen
        // this.servicio_editar.reporte =  this.reporte_general(this.servicio_editar)
      })
      this.my_control_1.get('iva').valueChanges.subscribe(iva=>{
        this.servicio_editar['iva'] = iva
        // this.servicio_editar.reporte =  this.reporte_general(this.servicio_editar)
      })
      this.my_control_1.get('formaPago').valueChanges.subscribe(formaPago=>{
        this.servicio_editar['formaPago'] = formaPago
        // this.servicio_editar.reporte =  this.reporte_general(this.servicio_editar)
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
    const simula_fecha =  new Date('03-23-2023')
    // console.log(simula_fecha);
    this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
    this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(end),this.hora_end) 
  }
  async consulta_ordenes(){
    const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this.SUCURSAL]

    const arreglo_rutas = this.crea_ordenes_sucursal({arreglo_sucursal})
   
    const promesasConsultas = arreglo_rutas.map(async (f_search) => {

    const respuesta = await  this._servicios.consulta_recepcion_sucursal({ruta: f_search})
      
    const gastos_hoy_array = await this.regresa_servicios_por_cada_ruta({respuesta}) 
     
      
      const promesasVehiculos = gastos_hoy_array
        
        .map(async (g) => {
          const { sucursal, cliente, vehiculo } = g;
          // g.data_vehiculo = await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
          const data_cliente:any =  await this._clientes.consulta_cliente_new({sucursal, cliente})
          g.data_cliente = data_cliente
          g.clienteShow = data_cliente.fullname
          const data_vehiculo:any =  await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
          g.data_vehiculo = data_vehiculo
          g.placas = data_vehiculo.placas
          const data_sucursal =  this.sucursales_array.find(s=>s.id === sucursal)
          g.data_sucursal =  data_sucursal
          g.sucursalShow = data_sucursal.sucursal
          // const reporte  = this.reporte_general(g)
          // g.reporte = reporte
          g.servicios = this.caso_paquete(g)
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
      'cliente','clienteShow','data_cliente','data_sucursal','data_vehiculo','diasSucursal','fecha_promesa','fecha_recibido','formaPago','id','iva','margen','no_os','placas','reporte','servicio','servicios','status','subtotal','sucursal','sucursalShow','vehiculo'
    ]

    const nueva  = (!this.array_recepciones.length) ?  ordenada :  this._publicos.actualizarArregloExistente(this.array_recepciones, ordenada,campos);

    this.array_recepciones = nueva
    this.filtra_informacion()
    
  }
  filtra_informacion(){

    const {start, end}= this.fecha_formateadas

    let resultados_1 = (this.filtro_tipo === 'Todos') ? this.array_recepciones : this.array_recepciones.filter(c=>c.status === this.filtro_tipo)

    const resultados =  (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)

    const filtro = resultados.filter(r=>new Date(r.fecha_recibido) >= start && new Date(r.fecha_recibido) <= end )
    console.log(filtro);
    
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
    const { respuesta } = data;
    let  obtenidos = [];
    
      Object.values(respuesta).forEach((entrie) => {
        const nuevas_entries = this._publicos.crearArreglo2(entrie);
        obtenidos.push(...nuevas_entries);
      });
    
    return obtenidos;
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
    const {servicios, descuento, formaPago, margen} = data
    console.log(data);
    const new_margen = (1+ (margen / 100))
    
    const elementos_ = [...servicios] || []
    const reporte = {descuento:0,mo:0, refacciones:0, refacciones_v:0, sobrescrito_mo:0, sobrescrito_refacciones:0,precio:0, ub:0, paquetes:0, paquetes_sobresrito:0, meses: 0}
    elementos_.map(element=>{
        const {tipo,aprobado} = element
        if (aprobado) {
            let mul
            switch (tipo) {
                case 'MO':
                case 'mo':
                  const equipado_ = this.operaciones_mo_refaccion({...element, margen: new_margen})
                  reporte.mo +=  equipado_.total
                  element = equipado_
                break;
                case 'refaccion':
                  const equipado = this.operaciones_mo_refaccion({...element, margen: new_margen})
                  reporte.refacciones +=  equipado.subtotal
                  reporte.refacciones_v +=   equipado.total
                  element = equipado
                  // if (costo>0 ) { reporte.sobrescrito_refacciones += con_margen }
                break;
                case 'paquete':
                  const {elementos, id} = element
                  // if (id === '-NEH_O1qK7I5z8sWdOQz') {

                    const reporte_interno  = this.operaciones_paquete({elementos: elementos, margen: new_margen})

                    element.reporte = reporte_interno
                    reporte.paquetes += reporte_interno.precio
                    // if (costo>0 ) { reporte.paquetes_sobresrito += reporte_interno.precio }
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
        return element
    })
    const {mo,  refacciones_v} = reporte
    const precio__ = mo + refacciones_v
    let _precio = precio__
    reporte.ub = 100 - ((refacciones_v * 100) / _precio )
    let new_descuento = (!descuento) ? 0 : parseFloat(descuento)
    const enCaso_meses = this.formasPAgo.find(f=>f.id === String(formaPago))
    if (enCaso_meses.id === '1') {
      _precio -= new_descuento
    }else{
      new_descuento = 0
      reporte.meses = _precio * (1 + (enCaso_meses['interes'] / 100));
    }
    reporte.precio = _precio

    // console.log(elementos_);
    // if (this.servicio_editar.id) {
    //   this.servicio_editar.servicios = []
    //   this.servicio_editar.servicios = elementos_
    //   console.log('asigno');
      
    // }

    console.log(this.servicio_editar);
    
    
    
    return reporte
  }
  operaciones_mo_refaccion(data){
    const {cantidad , precio, tipo, costo, margen , nombre} = data
    const new_ = (costo> 0) ? costo : precio
    switch (tipo) {
      case 'MO':
      case 'mo':
        data.total = cantidad * new_
        data.subtotal = cantidad * new_
        break;
        case 'refaccion':
          console.log(margen);
          
            const can = cantidad * new_
            data.subtotal = can
            data.total = can * margen
        break;
    }
    data.tipo = String(tipo).toLowerCase()
    data.nombre = String(nombre).toLowerCase()
    delete data.margen
    return data
  }
  operaciones_paquete(data){
    const {elementos, margen} = data
    const reporte = {mo: 0,precio: 0,refacciones: 0,refacciones_v: 0}
    elementos.forEach(element => {
      const equipa = this.operaciones_mo_refaccion({...element, margen})
      if (element.tipo === 'mo') {
        reporte.mo = equipa.total
      }else{
        reporte.refacciones = equipa.subtotal
        reporte.refacciones_v = equipa.total
      }
      reporte.precio = equipa.total
    });
    return reporte
}
  ///acciones_modal_
  asigna_servicio(data){
  this.servicio_editar = {...data}
  this.servicio_editar_copia = {...data}

  }
  Actualiza_data_os(){
    
    const {sonIguales,diferencias}  = this.compararObjetos(this.servicio_editar, this.servicio_editar_copia)
    console.log({sonIguales,diferencias});

    if (sonIguales){
      this._publicos.cerrar_modal('modal-servicio-editar-btn')
      this._publicos.swalToast('Cambios realizados',1)
    }else{
      console.log('comprobar los cambios ');
      const updates= {}

      const campos_update = [
        'servicios',
        'iva',
        'formaPago',
        'margen',
        'status',
        'servicio',
        'tecnico',
      ]
      const {sucursal, cliente, id} = this.servicio_editar


      campos_update.forEach(campo=>{
        if (this.servicio_editar[campo] ) {
          updates[`recepciones/${sucursal}/${cliente}/${id}/${campo}`] = this.servicio_editar[campo] 
        }
      })
      console.log(updates);


      update(ref(db), updates).then(()=>{
        // this._publicos.cerrar_modal('modal-servicio-editar-btn')
        this._publicos.swalToast('Cambios realizados',1)
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
    const servicios = [...this.servicio_editar.servicios]

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
    servicios.forEach(s => {
          if (s.aprobado) {
            s.status = new_status
          }
        });

    this.servicio_editar.servicios = servicios
    this.servicio_editar.status = status
    this.servicio_editar.reporte =  this.reporte_general(this.servicio_editar)
    
  }
  actualiza_servicio_unico(data){
    const {servicio, aprobado,status} = data
    const servicios = [...this.servicio_editar.servicios]
    servicios
    .map(s=>{
      if (s.id === servicio.id && typeof aprobado === 'boolean') {
        s.aprobado = aprobado
        if (!aprobado) s.status = 'espera' 
      }
      if (s.id === servicio.id && status) s.status = status
      return s 
    })

    const filtrado = servicios .filter(s=>s.status !== 'eliminado')

    this.servicio_editar.servicios = filtrado
    this.servicio_editar.reporte =  this.reporte_general(this.servicio_editar)
  }
  agregar_servicio(event){
    const {id} = event
    if (id) {
      const nueva = {...this.operaciones_mo_refaccion(event), margen: this.servicio_editar.margen, status: 'espera'}
      this.servicio_editar.servicios.push(nueva)
      this.servicio_editar.reporte =  this.reporte_general(this.servicio_editar)
    }
  }
  tecnico_os(event){
    console.log(event);
    if (event instanceof Object) {
      const {id} = event
      this.servicio_editar.tecnico = id
      // this.servicio_editar.tecnicoShow = id
    }
  }
  compararObjetos(obj1: ServicioEditar, obj2: ServicioEditar): { sonIguales: boolean; diferencias: string } {
    const keys = Object.keys(obj1);
    const diferencias: string[] = [];
  
    let sonIguales = true;
    for (const key of keys) {
      if (obj1[key] !== obj2[key]) {
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
      const {respuesta } = await this._publicos.mensaje_pregunta(`hubo cambios en la O.S`,true, `los cambios son en: ${diferencias} `)
      if (respuesta) {
        this.Actualiza_data_os() 
      }else{
        this._publicos.cerrar_modal('modal-servicio-editar-btn')
        this._publicos.swalToast('se cancelo la actualizacion',0)
      }
    }else{
      this._publicos.cerrar_modal('modal-servicio-editar-btn')
    }
  }
  nuevaffff(){
    // this.servicio_editar.margen = 100
    const paqueteConTotales = this.calcularTotales(this.servicio_editar, this.formasPAgo);
    console.log(paqueteConTotales);
  }

 
  calcularTotales(data, formasPago) {
    const {margen: new_margen, formaPago, servicios, iva} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, total:0}
    const servicios_ = [...servicios] 
    const margen = 1 + (new_margen / 100)
    servicios_.map(ele=>{
      
      
      if (ele.tipo === 'paquete') {
        // console.log(ele.id);
        // console.log(ele.tipo);
        // console.log(ele.elementos);
        
        const report = this.total_paquete(ele)
        // console.log(report);
        
        const {mo, refacciones} = report
        reporte.mo += mo
        reporte.refacciones += refacciones
        console.log(refacciones * margen);
        
        reporte.refacciones_v += refacciones * margen
      }else if (ele.tipo === 'mo') {
        const operacion = this.mano_refaccion(ele)
        reporte.mo += operacion
        ele.subtotal = operacion
        ele.total = operacion
      }else if (ele.tipo === 'refaccion') {
        const operacion = this.mano_refaccion(ele)
        reporte.refacciones += operacion
        reporte.refacciones_v += operacion * margen
        ele.subtotal = operacion
        ele.total = operacion * margen
      }
      return ele
    })
    console.log(servicios_);
    
    
    return reporte
    
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




// for paquete in data["servicios"]:
//     reporte_paquete = calcular_totales(paquete["elementos"], paquete["margen"], data["formaPago"])
//     paquete["reporte"] = reporte_paquete


  
  
  

