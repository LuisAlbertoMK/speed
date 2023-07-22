
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
     elementos = ['id','no_os','searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
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
       start: new FormControl(Date),
       end: new FormControl(Date),
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
    
     ngOnDestroy(){
      
      // this.consultaSucursales()
      this.verificaServiciosPendientesEmail()
     
     }
    ngOnInit(): void {
      // this.consultaSucursales()
      this.rol()
    }

  
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal 

    if (this.SUCURSAL !=='Todas') {
      this.busquedaSucursalString = this.SUCURSAL
      const {sucursal} = this.sucursales_array.find(s=>s.id === this.SUCURSAL)
      this.busquedaSucursalStringShow = sucursal
    }    
    this.acciones()
    
    if(localStorage.getItem('busquedaServicios')){
      this.busquedaServicios = localStorage.getItem('busquedaServicios')
    }
  }
  cargaIndexPadre(data){
    this.dataOcupadaOS = {...data}
  }
  acciones(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, async (snapshot) => {
      this.fechas_get.start.setHours(0,0,0,0)
      this.fechas_get.end.setHours(0,0,0,0)
      const recepcionesNew = await this._servicios.consulta_recepciones_new()
      const comparaOrdenes = (this.busquedaSucursalString === 'Todas') ? recepcionesNew :  recepcionesNew.filter(os=>os.sucursal.id === this.busquedaSucursalString)
      if (!this.recepciones_arr.length) {
        this.recepciones_arr = comparaOrdenes
      }else{
        const camposRecupera = ['index','checkList','cliente','detalles','diasEntrega','diasSucursal','fecha_recibido','formaPago','hora_recibido','iva','hitorial_gastos','historial_pagos', 'margen','sucursal','notificar','reporte','servicio','servicios','status','vehiculo','fecha_entregado','hora_entregado','tecnico','showNameTecnico']
        this.recepciones_arr =  this._publicos. actualizarArregloExistente(this.recepciones_arr, comparaOrdenes,camposRecupera);
      } 
      setTimeout(()=>{
              this.nuevasBusquedas()
        },500)
    })
    
  }
  accionServicio(padre, hijo, statusGet){
    const  aprobado = (statusGet === 'aprobado' || statusGet === 'terminar') ? true:  false
    const showStatus1 =  (statusGet === 'terminar') ? 'Terminado' : 'En espera'
    const servicios = [...padre.servicios]
    servicios.map((s,index)=>{
      if(s.index === hijo.index){
        s.status = statusGet
        s.aprobado = aprobado
        s.showStatus = showStatus1
      }
    })
    if (statusGet === 'eliminado') {
      this._publicos.mensaje_pregunta('Eliminar servicio de la orden').then(({respuesta})=>{
        if (respuesta) {
          servicios.splice(hijo.index, 1);
          const { reporte } = this._publicos.realizarOperaciones_2(padre)
          const updates = {
            [`recepciones/${padre.id}/servicios`]: servicios,
            [`recepciones/${padre.id}/reporte`]: reporte,
          };
          update(ref(db), updates)
        }
      })
    }else{
      const { reporte } = this._publicos.realizarOperaciones_2(padre)
      const updates = {
        [`recepciones/${padre.id}/servicios`]: servicios,
        [`recepciones/${padre.id}/reporte`]: reporte,
      };
      update(ref(db), updates)
    }
    
  }
  actualizarReporteIVA(data){
    setTimeout(()=>{
        const reporte = this._publicos.realizarOperaciones_2(data).reporte
        const { id, iva } = data;
        const updates = {
          [`recepciones/${id}/reporte`]: reporte,
          [`recepciones/${id}/iva`]: iva,
          [`recepciones/${id}/notificar`]: true
        };
        update(ref(db), updates)
    },200)
  }
  statusServicio(padre, status){
    const padreID = padre.id;
    const servicios = [...padre.servicios];
    const { fecha, hora } = this._publicos.getFechaHora();
    
    
    const updates = {};
    servicios.forEach(servicio => {
      if(status === 'terminado' || status === 'entregado') {
        servicio.status = 'terminar';
        servicio.showStatus = 'Terminado';
        updates[`recepciones/${padreID}/fecha_entregado`] = fecha;
        updates[`recepciones/${padreID}/hora_entregado`] = hora;
      } else {
        servicio.status = 'Aprobado';
        servicio.showStatus = 'En espera';
        updates[`recepciones/${padreID}/fecha_entregado`] = null;
        updates[`recepciones/${padreID}/hora_entregado`] = null;
        updates[`recepciones/${padreID}/fecha_recibido`] = fecha;
        updates[`recepciones/${padreID}/hora_recibido`] = hora;
      }
    });
    updates[`recepciones/${padreID}/status`] = status;
    updates[`recepciones/${padreID}/notificar`] = true;
    updates[`recepciones/${padreID}/servicios`] = servicios;
    
    setTimeout(() => {
      update(ref(db), updates).then(()=>{
        this.nuevasBusquedas()
      })
    }, 500);
    
      
    
  }
  //para actualizar el tecnico de la orden de servicio
  infoTecnico(event){
    if (!event) {
      this._publicos.swalToast('intenta de nuevo',0)
    }else{
      this._publicos.mensaje_pregunta('Seguro que es el tecnico de la o.s?').then(({respuesta})=>{
        if (respuesta) {
          // console.log(this.dataRecepcionEditar);
          const updates = {
            [`recepciones/${this.dataRecepcionEditar}/tecnico`]: event.id,
            [`recepciones/${this.dataRecepcionEditar}/showNameTecnico`]: event.usuario
          };
          update(ref(db), updates)
            .then(() => {
              this._publicos.swalToast('Tecnico actualizado correctamente!!', 1)
            });
        }
      })
    }
  }
 
  nuevasBusquedas(){
    const {valor, dias} = this.rangoBusqueda;
    const hoy = new Date()
    let start= hoy, end = hoy
    switch (valor) {
      case 'hoy':
      case 'ayer':
      case 'ult7dias':
      case 'ult30dias':
        start = this._publicos.sumarRestarDiasFecha(hoy, dias);
        end = hoy;
        break;
        case 'esteMes':
          const valores = this._publicos.getFirstAndLastDayOfCurrentMonth(hoy)
          start = valores.inicio
          end = valores.final
          break;
        case 'ultMes':
          const mesAnterior = this._publicos.sumarRestarMesesFecha(hoy,-1)
          let {inicio, final} = this._publicos.getFirstAndLastDayOfCurrentMonth(mesAnterior)
          start = inicio
          end = final 
          break;
        case 'esteAnio':
          const {primerDia, ultimoDia} = this._publicos.obtenerPrimerUltimoDiaAnio(hoy.getFullYear())
          start = primerDia
          end = ultimoDia
          break;
        case 'ultAnio':
          const ultimoAnio = this._publicos.sumarRestarAniosFecha(hoy,-1)
          const nuevosv = this._publicos.obtenerPrimerUltimoDiaAnio(ultimoAnio.getFullYear())
          start = nuevosv.primerDia
          end = nuevosv.ultimoDia
          break;
          case 'personalizado':
            const calendar = this.fechas_filtro.value
            if (calendar.start?.['_d'] && calendar.end?.['_d']) {
              start = calendar.start['_d']
              end = calendar.end['_d']
            }
            break;
      default:
        break;
    }
    
    this.fechas_get = {start: this._publicos.resetearHoras( start ),end: this._publicos.resetearHoras( end )}
    this.dataSource.data = this.filtrarRecepciones(this.recepciones_arr,this.busquedaStatus,this.busquedaSucursalString,this.BusquedaTo, this.fechas_get)
    this.newPagination()
  }
  filtrarRecepciones(recepciones, busquedaStatus, busquedaSucursalString, BusquedaTo, fechas_get) {
    let filtrados = recepciones;
  
    if (busquedaStatus !== 'todos') {
      filtrados = filtrados.filter(os => os.status === busquedaStatus);
    }
  
    if (busquedaSucursalString !== 'Todas') {
      filtrados = filtrados.filter(os => os.sucursal.id === busquedaSucursalString);
    }
  
    const dondeBuscar = (BusquedaTo === 'fecha_recibido') ? 'fecha_recibido_compara' : 'fecha_entrega_compara';
    
    const start = new Date(fechas_get.start).getTime();
    const end = new Date(fechas_get.end).getTime();
  
    const gastosFechas = filtrados.filter(a => {
      const fecha = new Date(a[dondeBuscar]).getTime();
      return fecha >= start && fecha <= end;
    });
    const reporte = {ticket:0, diasSucursal:0, horas_totales:0}
    gastosFechas.forEach((element,index) => {
      element.index = index + 1
      reporte.ticket += element.reporte.total
      if(element.diasSucursal) reporte.diasSucursal += element.diasSucursal
      if(element.fecha_entrega_compara ){
        reporte.horas_totales += this._publicos.obtenerHorasEntreFechas(element.fecha_recibido_compara, element.fecha_entrega_compara)
      }else{
        reporte.horas_totales += this._publicos.obtenerHorasEntreFechas(element.fecha_recibido_compara, new Date())
      }
    });
    let ticketPromedio = 0, diasSucursal= 0, horas_totales=0
    if (gastosFechas.length) {
      ticketPromedio = reporte.ticket / gastosFechas.length
      diasSucursal = reporte.diasSucursal / gastosFechas.length
      horas_totales = reporte.horas_totales / gastosFechas.length
    }
    
    this.reporteEstancias = 
    {
      servicios_totales: gastosFechas.length,
      ticket_total: reporte.ticket,
      ticketPromedio,
      diasSucursal_total: reporte.diasSucursal,
      diasSucursal,
      horas_totales_totales: reporte.horas_totales,
      horas_totales
    }
    
    return gastosFechas;
  }
  
  EliminaPago(padre:string, idPG:string, donde:string){
    const dondeUpdate = (donde === 'pago') ?  'HistorialPagos': 'HistorialGastos'
    const updates = {[`recepciones/${padre}/${dondeUpdate}/${idPG}/status`]: false}

    this._publicos.mensaje_pregunta('Eliminar '+ donde + '?').then(({respuesta})=>{
      if (respuesta) {
        update(ref(db), updates).then(()=>{
          this._publicos.swalToast('Se elimino '+  donde, 1)
        })
        .catch(error=>{
          this._publicos.swalToast('Error al eliminar '+  donde, 0)
        })
      }
    })    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    localStorage.setItem('busquedaServicios',filterValue.trim().toLowerCase())
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      if(this.busquedaServicios){
        this.dataSource.filter = this.busquedaServicios
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 300)
  }


  //cuando quiera abandonar la apgina pregutar si desea enviar los email
  verificaServiciosPendientesEmail(){
    const enviarEmail = this.recepciones_arr.filter(recepcion=>recepcion.notificar)
    // console.log(enviarEmail);
    if (enviarEmail.length) {
      this._publicos.mensaje_pregunta('notificar a clientes de cambios?').then(({respuesta})=>{
        if (respuesta) {
          enviarEmail.forEach(recepcion=>{

            const { sucursal, cliente, servicios, reporte, no_os, vehiculo,id, index} = recepcion;
      
            const correos = this._publicos.dataCorreo(sucursal,cliente)
            
            const info = servicios.map(({ nombre, aprobado }) => {
              const status = aprobado ? 'aprobado' : 'no aprobado';
              return `Servicio ${nombre.toLowerCase()}: ${status}`;
            }).join(', ');
      
            const clavesReporte = Object.keys(reporte);
            const infoReporte = ['Anexo el desglose de O.S:<br>'];
            clavesReporte.forEach((c) => {
              if (reporte[c] > 0 && c !== 'refacciones_a' && c !== 'ub') {
                const nombre = c === 'refacciones_v' ? 'refacciones' : c;
                infoReporte.push(`${nombre}: ${this._publicos.redondeado2(reporte[c], true)}<br>`);
              }
            });
            
            const infoCorreo = {
              subject: 'Le informamos que se han realizado cambios en su información de la O.S #' + recepcion.no_os,
              correos,
              cliente,
              vehiculo,
              no_os,
              resumen: info,
              desgloce: infoReporte.join(' ')
            }
            // console.log(infoCorreo);
      
            this._email.cambioInformacionOS(infoCorreo)
            const updates = {
              [`recepciones/${id}/notificar`] : false
            };
            
            update(ref(db), updates).then(()=>{
              // this.recepciones_arr[index].notificar = false 
            });
          })
        }
      }) 
    }
  }
  generaReporteExcel(){
    if(this.dataSource.data.length){
      this._export_excel.exportExcelServicios(this.dataSource.data)
    }else{
      this._publicos.swalToast('no hay ningun dato para generar excel!!', 0)
    }
  }
  irPagina(pagina){
    const queryParams = { anterior: 'servicios', tipo: 'nueva' }
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  
}
