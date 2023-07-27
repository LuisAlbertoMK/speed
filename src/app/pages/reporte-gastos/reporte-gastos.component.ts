import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { ExporterService } from 'src/app/services/exporter.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
import Swal from 'sweetalert2';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-reporte-gastos',
  templateUrl: './reporte-gastos.component.html',
  styleUrls: ['./reporte-gastos.component.css'],
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
export class ReporteGastosComponent implements OnInit {
  
  myFilter = (d: Date | null): boolean => {
      const fecha = new Date(d)
      const day = fecha.getDay()
      return day !== 0;
  };
  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private _export: ExporterService,
     private _sucursales: SucursalesService, private _cotizaciones: CotizacionesService,
      private _campos: CamposSystemService,private _reporte_gastos: ReporteGastosService) { }
  ROL:string; SUCURSAL:string

  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  metodospago       =   [ ...this._cotizaciones.metodospago  ]
  sucursales_array  =   [ ...this._sucursales.lista_en_duro_sucursales  ]

  paquete: string = this._campos.paquete
  refaccion: string = this._campos.refaccion
  mo: string = this._campos.mo
  miniColumnas:number = this._campos.miniColumnas

  
  historial_gastos_operacion = []
  gastosDiarios_arr = []
  pagosGastosOP_arr = []
  
  listaConjunta_arr = []

  listaos_arr = []

  // tabla
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['id','sucursalShow','no_os','metodoShow','status','monto','tipo','fecha']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos
  // tabla
  dataSourceAdministracion = new MatTableDataSource(); //elementos
  elementosAdministracion = ['id','sucursalShow','no_os','fecha_recibido','fecha_entregado','subtotal','cliente','formaPago']; //elementos
  columnsToDisplayWithExpandAdministracion = [...this.elementosAdministracion, 'opciones', 'expand']; //elementos
  // expandedElement: any | null; //elementos
  @ViewChild('AdministracionPaginator') paginatorAdministracion: MatPaginator //elementos
  @ViewChild('Administracion') sortAdministracion: MatSort //elementos


  reporte = {deposito: 0, operacion: 0, sobrante:0, gasto: 0, orden:0}
  reporteAdministracion = {
    iva:0, refacciones:0, total:0, subtotal:0, operacion:0, cantidad:0,
    margen:0, por_margen:0
  }

  camposReporte = [
    {valor:'deposito', show:'Depositos'},
    // {valor:'pagos', show:'Pagos'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    {valor:'sobrante', show:'Sobrante'},
  ]
  camposReporteAdministracion = [
    {valor:'cantidad', show:'Ordenes cerradas'},
    {valor:'subtotal', show:'Monto de ventas (Antes de IVA)'},
    {valor:'refacciones', show:'Costos Refacciones (de los autos cerrados)'},
    {valor:'operacion', show:'Costo Operacion'},
    {valor:'margen', show:'Margen'},
    {valor:'por_margen', show:'% Margen'},
    // {valor:'iva', show:'I.V.A'},
    // {valor:'total', show:'total'},
    // {valor:'libreSinIVA', show:'libre sin Iva'},
    // {valor:'libreIva', show:'Libre con iva'},
    // {valor:'libre_neto', show:'Libre neto con iva'},
    // {valor:'libre_neto_sin_iva', show:'Libre neto sin iva'},
    // {valor:'libre_neto_con_iva', show:'Libre neto con iva'},
  ]
  // tiempoReal:boolean = false
  realizaGasto:string = null
  sucursalFiltro: string = 'Todas'
  sucursalFiltroShow: string = 'Todas'
  HOY:Date = this._publicos.resetearHoras(new Date()); 
  rangeReporteGastos = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  rangeAdministracion = new FormGroup({
    start: new FormControl(this.HOY),
    end: new FormControl(this.HOY),
  });

    
  fechas_get = {inicio:this.rangeReporteGastos.controls['start'].value, final: this.rangeReporteGastos.controls['end'].value}
  fechas_getAdministracion = {inicio: this._publicos.resetearHoras(this.HOY), final: this._publicos.resetearHoras(this.HOY)}


  sucursalFiltroReporte: string = 'Todas'
  sucursalFiltroShowReporte: string = 'Todas'
  //´para el ordenamiento de las tablas
  fechas_reporte:boolean = true
  ordenamientoCampo_reporte = 'index'
  ordenamientoCampo_admin ='index'
  fechas_admin:boolean =  true

  sucursalBarrido: string = null
  
  fechaBarrido: Date = null
  events: string[] = [];


  nuevo_gastosDiarios = []

  ocupados_gastos = []
  dias_espera = 1
  ngOnInit(): void {
    this.rol()
  }
  rol(){
    // console.log(new Date().toDateString());
    // console.log(new Date().toUTCString());
    // console.log(new Date().toString()); ///TODO esta es la buena para comparaciones de fechas
    // console.log(new Date().toLocaleString('es-MX', { timeZone: 'UTC' }));
    
    
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal

    // this.sucursalFiltro = (this.SUCURSAL === 'Todas') ? 'Todas' : sucursal
    // this.sucursalFiltroReporte = (this.SUCURSAL === 'Todas') ? 'Todas' : sucursal
    this.gastosDiarios()
    this.gastosOperacion()
    // this.gastosOperacion()
    // this.ordenesServicios()
    
  }

  gastosDiarios(){
    const starCountRef = ref(db, `gastosDiarios`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        // console.log('aqui');
        
        const fecha = new Date()
        const  dia = fecha.getDate().toString().padStart(2, '0')
        const  mes = (fecha.getMonth()+1).toString().padStart(2, '0')
        const  year = fecha.getFullYear()
        const Fecha_formateada = `${dia}${mes}${year}`
        const busqueda = (this.SUCURSAL === 'Todas') ? 'gastosDiarios': `gastosDiarios/${this.SUCURSAL}/${Fecha_formateada}`
        // console.log(busqueda);
        const gastos_hoy_array:any[] = await this._reporte_gastos.gastos_hoy({ruta: busqueda, sucursal: this.SUCURSAL})
        // console.log(gastos_hoy_array);
        
        
        
        this.gastosDiarios_arr =  gastos_hoy_array
        this.unirResultados_new()
        // this.dataSource.data = gastos_hoy_array
        // this.newPagination('gastosDiarios')
      }
    })
  }
//   historial_gastos_orden
// historial_gastos_operacion
  gastosOperacion(){
    const starCountRef = ref(db, `historial_gastos_operacion`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        const busqueda = (this.SUCURSAL === 'Todas') ? 'historial_gastos_operacion': `historial_gastos_operacion/${this.SUCURSAL}`
        console.log(busqueda);
        const historial_gastos_operacion = await this._reporte_gastos.historial_gastos_operacion({ruta: busqueda, sucursal: this.SUCURSAL})
        console.log(historial_gastos_operacion);
        const incio_dia = this._publicos.resetearHoras_horas(new Date(),'00:00:01')
        const fin_dia = this._publicos.resetearHoras_horas(new Date(),'23:59:59')
        console.log(incio_dia);
        console.log(fin_dia);
        
        const filtro = historial_gastos_operacion.filter(a => new Date(a.fecha_recibido) >= incio_dia && new Date(a.fecha_recibido) <= fin_dia)
        console.log(filtro);
        
        this.historial_gastos_operacion = filtro
        this.unirResultados_new()
        this.newPagination('gastosDiarios')
      }
    })
  }

  unirResultados_new(){
    console.log(this.historial_gastos_operacion);
    
    const ultimate = [...this.gastosDiarios_arr, ...this.historial_gastos_operacion]
    // console.log(ultimate);
    ultimate.map((c, index)=>{ c.index = index; return c})
    if (this.SUCURSAL !== 'Todas') {
      const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(ultimate)
      this.reporte = reporte
    }else{
      
    }
    this.dataSource.data = ultimate
  }
 
 
  async realizarOperaciones(){

    const fecha_inicial = new Date(this.fechas_get.inicio)
    const inicio = this._publicos.retorna_fechas_hora({fechaString:fecha_inicial.toString(), hora_recibida: '00:00:01'}).toString
    const inicio_i = new Date(inicio)

    const fecha_final = new Date(this.fechas_get.final)
    const final = this._publicos.retorna_fechas_hora({fechaString:fecha_final.toString(), hora_recibida: '23:59:59'}).toString
    const otro_f = new Date(final)
    
    const resultados  = this.listaConjunta_arr
      .map((a,index) => {
        const { show } = this.metodospago.find(m => m.valor === String(a.metodo))
        a.metodoShow = show
        a.fechaCompara = new Date(a.fecha_registro)
        return a
      })
      .filter(a => a.fechaCompara >= inicio_i && a.fechaCompara <= otro_f)

   
    const nuevos = (this.sucursalFiltroReporte === 'Todas') ? resultados : resultados.filter(r=>r.sucursal === this.sucursalFiltroReporte)
    // console.log(nuevos);
     
    const reporte_general_new= this._reporte_gastos.reporte_gastos_general(nuevos)

      this.reporte = reporte_general_new

      const _f1 = new Date(this.fechas_get.inicio)
      const _f2 = new Date(this.fechas_get.final)
      const esHoy = this._publicos.verificarFechasIgualesHoy(_f1, _f2)

      if (esHoy && this.sucursalFiltroReporte !=='Todas') {
        const reporte_general_new_1 = this._reporte_gastos.reporte_gastos_sucursal(resultados,this.sucursalFiltroReporte)

        const fechaSobrante = this._publicos.sumarRestarDiasFecha(_f1,1)

        const nueva = new Date(fechaSobrante.toString())

        const fecha_formato = this._publicos.retorna_fechas_hora({fechaString:nueva.toString(), hora_recibida: '00:00:02'})
        if(this.sucursalFiltroReporte !== 'Todas'){
          const tempData = {
            concepto: 'Sobrante del dia anterior',
            fecha_registro:fecha_formato.toString,
            metodo: '1',
            monto: reporte_general_new_1.sobrante,
            sucursal: this.sucursalFiltroReporte,
            tipo: 'sobrante',
            status:true
          }
          const domingo = true
          const updates = {}
          if(!this._publicos.esDomingo(fecha_formato.toString)){
          // if(!domingo){
              const ruta =`gastosDiarios/${this.sucursalFiltroReporte}/${this._publicos.formatearFecha(fecha_formato.toString,false)}/sobrante`
              updates[ruta] = tempData
          }else{
            // console.log('aqui 2');
            const fecha_domingo = new Date(fecha_formato.toString)
            // console.log('Hoy sabado: ', fecha_domingo.toString());
            // le sumamos dos dias en caso de que sea sabado y el sobrante se quiera registrar el domingo
            const nueva_domingo = this._publicos.sumarRestarDiasFecha(fecha_domingo.toString(),1)
            // console.log('Lunes: ', nueva_domingo);
            const fecha_formato_new = this._publicos.retorna_fechas_hora({fechaString:nueva_domingo.toString(), hora_recibida: '00:00:02'}).toString
            
            tempData.fecha_registro = fecha_formato_new
            const ruta =`gastosDiarios/${this.sucursalFiltroReporte}/${this._publicos.formatearFecha(fecha_formato_new,false)}/sobrante`
            updates[ruta] = tempData
          }
          // update(ref(db), updates)
          //     .catch(err=>{
          //       console.log(err);
          //     })
        }
      
      }
      const nuevos_index = this._publicos.ordenarData(nuevos,'fechaCompara',false)
      nuevos_index.forEach((a,index)=>{  a.index  = index })
      // console.log(nuevos_index);
      
      this.ocupados_gastos = nuevos_index
      this.dataSource.data = nuevos_index
      this.newPagination('reporte')
  }
  cambiosFechas(donde:string){
    const {start, end} = (donde === 'admin') ? this.rangeAdministracion.value : this.rangeReporteGastos.value
    if (start && end) {
      if (start['_d'] && end['_d']) {
        const fechaAsigan = {inicio: this._publicos.resetearHoras(start['_d']), final: this._publicos.resetearHoras_horas(end['_d'],'23:59:59')}
        if(donde === 'admin'){
          this.fechas_getAdministracion = fechaAsigan
          // this.operacionesAdmin();
        }else{
          this.fechas_get = fechaAsigan
          // this.unirResultados()
        }
      }
    }
  }
  

  generaReporteExcelReporteGastos(){
    
    const id_recepciones = this.listaos_arr.map(os=>{
      return {id:os.id, string_servicios: os.string_servicios, no_os: os.no_os}
    })



    // console.log(id_recepciones);
    const os_ :any= [ ...this.ocupados_gastos]
    // console.log(os_);
    const enviar_totales_orden = []
    id_recepciones.forEach(os_especifica =>{
      // console.log(os_especifica.id);
      const reporte = {total:0, subtotal:0, iva:0}
      const filtro = os_.filter(d=>d.id_orden === os_especifica.id && d.tipo === 'orden' && d.tipoNuevo === 'gasto')
      // console.log(filtro);

      filtro.forEach(element => {
        reporte.total += element.monto
      });
      // console.table(reporte)
      if (reporte.total >0 ) {
        enviar_totales_orden.push({
            no_os: os_especifica.no_os,
            descripion: os_especifica.string_servicios, 
            total_gastado: reporte.total,
          })
      }
    })

    // console.log(enviar_totales_orden);
    
    
    if(this.dataSource.data){
      // console.log(this.dataSource.data);
      this._export.generaReporteGastosExcel(this.dataSource.data, this.reporte, enviar_totales_orden)
      
    }else{
      this._publicos.swalToast('No hay ningun dato', 0)
    }
  }
  newPagination(donde:string){
    const dataSource = donde === 'admin' ? this.dataSourceAdministracion : this.dataSource;
    const paginator = donde === 'admin' ? this.paginatorAdministracion : this.paginator;
    const sort = donde === 'admin' ? this.sortAdministracion : this.sort;
    
    setTimeout(() => {
      dataSource.paginator = paginator;
      dataSource.sort = sort;
    }, 500);
  }
  ordenamiento(tabla:string,campo: string){
    const dataSource = tabla === 'reporte' ? this.dataSource : this.dataSourceAdministracion;
    const fechas = tabla === 'reporte' ? this.fechas_reporte : this.fechas_admin;
    tabla === 'reporte' ?  this.ordenamientoCampo_reporte = campo :  this.ordenamientoCampo_admin = campo
    const nueva = [...dataSource.data];
    dataSource.data = this._publicos.ordenarData(nueva, campo, fechas);
    this.newPagination(tabla);
  }
  ///extras
  traerDosVecesBarrido(){
    let timerInterval
    
    this.RealizaBarridoDia()
    const time = this.dias_espera * 1000
    Swal.fire({
      title: 'Realizando calculos en gastos diarios',
      html: 'espere porfavor ... ',
      timer: time,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
        // const b = Swal.getHtmlContainer().querySelector('b')
        // timerInterval = setInterval(() => {
        //   b.textContent = String(Swal.getTimerLeft())
        // }, 1000)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // console.log('I was closed by the timer')
        this.dias_espera = 1
      }
    })
    
    
  }
  async ultimoDia(){
    // const ultimo_registro = this._publicos.sumarRestarDiasFecha(new Date(),1)
    // const ultimo_registro_0 = this._publicos.resetearHoras(ultimo_registro)
    // console.log(ultimo_registro_0);
    // if(this.fechaBarrido && this.sucursalBarrido){
    //   const formateada = this._publicos.formatearFecha(ultimo_registro_0,false)
    //   const ruta = `gastosDiarios/${this.sucursalBarrido}/${formateada}/sobrante/monto`
    //   const consulta_sobrante = await this._reporte_gastos.consultaSobrante(ruta)
    //   console.log(consulta_sobrante);
    // }
  }
  RealizaBarridoDia(){
    
    if(this.fechaBarrido && this.sucursalBarrido){
      const fechaInicio = this._publicos.sumarRestarDiasFecha(this.fechaBarrido,0)
      const fech = this._publicos.resetearHoras(new Date(fechaInicio))
      const fechaActual = this._publicos.resetearHoras(new Date())
      const diffTiempo = fechaActual.getTime() - fech.getTime();
      const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));


      this.dias_espera = (diffDias >=1 ) ? diffDias : 1
      
      for (let i = 0; i <= diffDias; i++) {        
        
        const fechaImprimir = new Date(fech.getTime() + i * 24 * 60 * 60 * 1000);
        const dia = this._publicos.sumarRestarDiasFecha(fechaImprimir,0)
        // console.log(dia);

        const inicio = this._publicos.retorna_fechas_hora({fechaString:dia.toString(), hora_recibida: '00:00:01'}).toString
        const inicio_i = new Date(inicio)

        const final = this._publicos.retorna_fechas_hora({fechaString:dia.toString(), hora_recibida: '23:59:59'}).toString
        const otro_f = new Date(final)
        
        
        const resultados  = this.listaConjunta_arr
          .map((a,index) => {
            const { show } = this.metodospago.find(m => m.valor === String(a.metodo))
            a.metodoShow = show
            return a
          })
          .filter(a => new Date(a.fecha_registro) >= inicio_i && new Date(a.fecha_registro) <= otro_f)
          const nuevos = (this.sucursalBarrido === 'Todas') ? resultados : resultados.filter(r=>r.sucursal === this.sucursalBarrido)
          
          if (nuevos.length) {
            if (this._publicos.esDomingo(inicio)) {
              
            }else{
            
              const reporte =  this._reporte_gastos.reporte_gastos_general(nuevos)
              const registra_maniana = this._publicos.sumarRestarDiasFecha(dia,1)
              const fecha_registro_string = this._publicos.retorna_fechas_hora({
                  fechaString: registra_maniana.toString(),
                  hora_recibida: '00:00:02'
                })
              const tempData = {
                concepto: 'Sobrante del dia anterior',
                fecha_registro:fecha_registro_string.toString,
                metodo: '1',
                monto: reporte.sobrante,
                sucursal: this.sucursalBarrido,
                tipo: 'sobrante',
                status: true
              }
              if (this._publicos.esSabado(inicio)) {
                const lunes_1 = this._publicos.sumarRestarDiasFecha(registra_maniana,1)
                const lunes_final = this._publicos.retorna_fechas_hora({fechaString: lunes_1.toString(), hora_recibida: '00:00:03'}).toString
                tempData.fecha_registro = lunes_final
                const formateada = this._publicos.formatearFecha(tempData.fecha_registro,false)
                const ruta = `gastosDiarios/${this.sucursalBarrido}/${formateada}/sobrante`
                const updates = {};
                updates[`${ruta}`] = tempData;
                update(ref(db), updates).then(()=>{})
                .catch(err=>{
                  console.log(err);
                })
              }else{
                const formateada = this._publicos.formatearFecha(tempData.fecha_registro,false)
                const ruta = `gastosDiarios/${this.sucursalBarrido}/${formateada}/sobrante`
                const updates = {};
                updates[`${ruta}`] = tempData;
                update(ref(db), updates).then(()=>{})
                .catch(err=>{
                  console.log(err);
                })
              }
            }
          }
      }
    }
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const fecha = event.value
    if (fecha) {
      if(fecha['_d'] ){
        this.fechaBarrido = fecha['_d']
      }else{
        this.fechaBarrido = null
      }
    }else{
      this.fechaBarrido = null
    }
    
  }

  data_deposito(event){
    console.log(event);
    if (event) {
      this._publicos.cerrar_modal('modal-deposito')
    }
  }

}



