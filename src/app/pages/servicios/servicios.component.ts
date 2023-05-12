
import { Component, OnInit, ViewChild, OnDestroy, AfterContentChecked, AfterViewInit } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';

import {FormBuilder} from '@angular/forms';

import { Route, Router } from '@angular/router';
import { EmailsService } from 'src/app/services/emails.service';
import { child, get, getDatabase, onValue, ref, set, push , update} from 'firebase/database';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { ServiciosService } from '../../services/servicios.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { months } from 'moment';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { uniqueSort } from 'jquery';
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

  ROL:string; SUCURSAL:string
  sucursales_arr=[]
  recepciones_arr=[]
  miniColumnas:number = 100

  // tabla
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['id','no_os','searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos

  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
    {valor:'sobrescrito', show:'sobrescrito'},
    {valor:'descuento', show:'descuento'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'iva', show:'iva'},
    {valor:'total', show:'total'},
    {valor:'meses', show:'meses'},
  ]
  camposCliente=[
    {valor: 'no_cliente', show:'# Cliente'},
    {valor: 'nombre', show:'Nombre'},
    {valor: 'apellidos', show:'Apellidos'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'},
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    {valor: 'sucursal', show:'Sucursal'}
  ]
  camposVehiculo=[
    {valor: 'placas', show:'Placas'},
    {valor: 'marca', show:'marca'},
    {valor: 'modelo', show:'modelo'},
    {valor: 'anio', show:'añio'},
    {valor: 'categoria', show:'categoria'},
    {valor: 'cilindros', show:'cilindros'},
    {valor: 'engomado', show:'engomado'},
    {valor: 'color', show:'color'},
    {valor: 'transmision', show:'transmision'},
    {valor: 'no_motor', show:'No. Motor'},
    {valor: 'vinChasis', show:'vinChasis'},
    {valor: 'marcaMotor', show:'marcaMotor'}
  ]
  formasPago=[
    {id:'1',pago:'contado',interes:0,numero:0},
    {id:'2',pago:'3 meses',interes:4.49,numero:3},
    {id:'3',pago:'6 meses',interes:6.99,numero:6},
    {id:'4',pago:'9 meses',interes:9.90,numero:9},
    {id:'5',pago:'12 meses',interes:11.95,numero:12},
    {id:'6',pago:'18 meses',interes:17.70,numero:18},
    {id:'7',pago:'24 meses',interes:24.,numero:24}
  ]
  metodospago = [
    {valor:'1', show:'Efectivo', ocupa:'Efectivo'},
    {valor:'2', show:'Cheque', ocupa:'Cheque'},
    {valor:'3', show:'Tarjeta', ocupa:'Tarjeta'},
    {valor:'4', show:'Transferencia', ocupa:'Transferencia'},
    {valor:'5', show:'Credito', ocupa:'credito'},
    // {valor:4, show:'OpenPay', ocupa:'OpenPay'},
    // {valor:5, show:'Clip / Mercado Pago', ocupa:'Clip'},
    {valor:'6', show:'Terminal BBVA', ocupa:'BBVA'},
    {valor:'7', show:'Terminal BANAMEX', ocupa:'BANAMEX'}
  ]

  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

  estatusServicioUnico = [
    {valor: 'aprobado'   , show: 'Aprobar'},
    {valor: 'Noaprobado'  , show: 'No Aprobado'},
    {valor: 'terminar'   , show: 'Terminado'},
    {valor: 'eliminado'  , show: 'Eliminar'},
    {valor: 'cancelado'  , show: 'Cancelado'}
  ]
  statusOS = [
    {valor: 'espera'   , show: 'Espera'},
    {valor: 'recibido'   , show: 'Recibido'},
    {valor: 'autorizado'  , show: 'Autorizado'},
    {valor: 'terminado'   , show: 'Terminado'},
    {valor: 'entregado'  , show: 'Entregado'},
    {valor: 'cancelado'  , show: 'Cancelado'}
  ]
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
  menuListaBusqueda_arr = [
    {valor:'hoy',show:'Hoy', dias: 0},
    {valor:'ayer',show:'Ayer', dias: -1},
    {valor:'ult7dias',show:'Últimos 7 días', dias:-7},
    {valor:'ult30dias',show:'Últimos 30 días', dias: -30},
    {valor:'esteMes',show:'Este mes', dias: 0},
    {valor:'ultMes',show:'Último mes', dias: 0},
    {valor:'esteAnio',show:'Este año', dias: 0},
    {valor:'ultAnio',show:'Último año', dias: 0},
    {valor:'personalizado',show:'Personalizado',dias: 0},
  ]
  diasBusqueda: number = 0
  rangoBusqueda = {valor:'hoy',show:'Hoy', dias: 0}


  reporteEstancias = {  servicios_totales:0, ticket_total:0, ticketPromedio:0, diasSucursal_total:0, diasSucursal:0, horas_totales_totales:0, horas_totales:0}
  camposEstancia = [
    {valor: 'servicios_totales', show:'Numero servicios'},
    {valor: 'ticket_total', show:'ticket total'},
    {valor: 'ticketPromedio', show:'ticket promedio'},
    {valor: 'diasSucursal_total', show:'dias Sucursal total'},
    {valor: 'diasSucursal', show:'dias Sucursal promedio'},
    {valor: 'horas_totales_totales', show:'horas totales'},
    {valor: 'horas_totales', show:'horas totales promedio'},
  ]
  constructor( 
    private _publicos: ServiciosPublicosService, 
    private _email:EmailsService, 
    private _security:EncriptadoService,
    ) {
      // this.columnasRecepcionesExtended[6] = 'expand';
     }
    
     ngOnDestroy(){
      
      // this.consultaSucursales()
      this.verificaServiciosPendientesEmail()
     
     }
    ngOnInit(): void {
      this.consultaSucursales()
    }

  consultaSucursales(){
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.sucursales_arr = this._publicos.crearArreglo2(snapshot.val())
        this.rol()
      }
    }, {
        onlyOnce: true
    })
  }
  rol(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      this.ROL = this._security.servicioDecrypt(variableX['rol'])
      this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
      if (this.SUCURSAL !=='Todas') {
        this.busquedaSucursalString = this.SUCURSAL
        const {sucursal} = this.sucursales_arr.find(s=>s.id === this.SUCURSAL)
        this.busquedaSucursalStringShow = sucursal
      }    
      this.acciones()
    }
    if(localStorage.getItem('busquedaServicios')){
      this.busquedaServicios = localStorage.getItem('busquedaServicios')
    }
  }
  cargaIndexPadre(data){
    this.dataOcupadaOS = {...data}
  }
  acciones(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordenes_s = this._publicos.crearArreglo2(snapshot.val())
        ordenes_s.map((recep,index)=>{
          recep.index  = index
          // console.log(recep.id);
          recep.searchCliente = recep.cliente['nombre']
          recep.searchPlacas = recep.vehiculo['placas']
          // if (recep.id === '-NJLWImtmWlFAvUZDPof') {
            const getTime  = this._publicos.getFechaHora()
            recep.diasSucursal = this._publicos.calcularDias(recep.fecha_recibido, getTime.fecha)
          // }
          const updates = {
            [`recepciones/${recep.id}/diasSucursal`]: recep.diasSucursal
          };
          update(ref(db), updates)
          .then(() => {});
          
          recep.hitorial_gastos = (recep.HistorialGastos) ? this._publicos.crearArreglo2(recep.HistorialGastos) : []
          recep.historial_pagos = (recep.HistorialPagos) ? this._publicos.crearArreglo2(recep.HistorialPagos) : []
          let totalGastos = 0, totalPagos=0
          recep.historial_pagos.forEach(element => {
            element.tipoNuevo = 'pago'
            const { show } = this.metodospago.find(m => m.valor === String(element.metodo))
            element.metodoShow = show
            if(element.status) totalPagos += element.monto
          });
          recep.hitorial_gastos.forEach(element => {
            element.tipoNuevo = 'gasto'
            const { show } = this.metodospago.find(m => m.valor === String(element.metodo))
            element.metodoShow = show
            if(element.status) totalGastos += element.monto
          });
          recep.totalGastos = totalGastos
          recep.totalPagos = totalPagos
          
          recep.fecha_recibido_compara = this._publicos.construyeFechaString(recep.fecha_recibido)
          if (recep.fecha_entregado) {
            recep.fecha_entrega_compara = this._publicos.construyeFechaString(recep.fecha_entregado)
          }
          recep.fechaRecibido = `${recep.fecha_recibido} ${recep.hora_recibido}`
          recep.fechaEntregado = `${recep.fecha_entregado} ${recep.hora_entregado}`
        })
        this.fechas_get.start.setHours(0,0,0,0)
        this.fechas_get.end.setHours(0,0,0,0)
        const comparaOrdenes = (this.busquedaSucursalString === 'Todas') ? ordenes_s :  ordenes_s.filter(os=>os.sucursal.id === this.busquedaSucursalString)
        if(!this.recepciones_arr.length){
          this.recepciones_arr = comparaOrdenes
        }else{
          if (comparaOrdenes.length === this.recepciones_arr.length) {
            comparaOrdenes.map((os, index)=>{
                if (JSON.stringify(os) !== JSON.stringify(this.recepciones_arr[index])) {
                  const camposRecupera = ['index','checkList','cliente','detalles','diasEntrega','diasSucursal','fecha_recibido','formaPago','hora_recibido','iva','hitorial_gastos','historial_pagos',
                    'margen','sucursal','notificar','reporte','servicio','servicios','status','vehiculo','fecha_entregado','hora_entregado','tecnico','showNameTecnico']
                    camposRecupera.forEach(c=>{
                      // this.recepciones_arr[index][c] = os[c]
                      if (os[c] !== this.recepciones_arr[index][c]) {
                        this.recepciones_arr[index][c] = os[c];
                      }
                    })
                } 
            })
          }else if(comparaOrdenes.length > this.recepciones_arr.length){
            this.recepciones_arr.push(...comparaOrdenes.slice(this.recepciones_arr.length));
          }else{
            // this.recepciones_arr = ordenes_s
            this.recepciones_arr.splice(comparaOrdenes.length, this.recepciones_arr.length - comparaOrdenes.length);
          }
        }
        
        

        setTimeout(()=>{
          this.nuevasBusquedas()
        },500)
        
        
      }
    })
  }
  sonIguales(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
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
      this._publicos.swalToastError('intenta de nuevo')
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
              this._publicos.swalToast('Tecnico actualizado correctamente!!')
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
    
    this.fechas_get = {start: this._publicos.reseteaHoras( start ),end: this._publicos.reseteaHoras( end )}
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
    gastosFechas.forEach(element => {
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
          this._publicos.swalToast('Se elimino '+  donde)
        })
        .catch(error=>{
          this._publicos.swalToastError('Error al eliminar '+  donde)
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
              this.recepciones_arr[index]['notificar'] = false 
            });
          })
        }
      })
      
    }
    
    
  }

  
}
