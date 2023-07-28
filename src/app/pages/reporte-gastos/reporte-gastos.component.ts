import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';


import { FormControl, FormGroup } from '@angular/forms';
import { getDatabase, onValue, ref, update } from "firebase/database";


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import Swal from 'sweetalert2';
import { CamposSystemService } from '../../services/campos-system.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
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
     private _sucursales: SucursalesService, private _cotizaciones: CotizacionesService, private _vehiculos: VehiculosService,
      private _campos: CamposSystemService,private _reporte_gastos: ReporteGastosService) { }
  ROL:string; SUCURSAL:string
  USUARIO:string 
  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  metodospago       =   [ ...this._cotizaciones.metodospago  ]
  sucursales_array  =   [ ...this._sucursales.lista_en_duro_sucursales  ]

  paquete: string = this._campos.paquete
  refaccion: string = this._campos.refaccion
  mo: string = this._campos.mo
  miniColumnas:number = this._campos.miniColumnas

  
  historial_gastos_operacion = []
  historial_gastos_diarios = []
  historial_gastos_orden = []
  todos_ultimate =[]

  // tabla
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['sucursalShow','no_os','metodoShow','status','monto','tipo','fecha']; //elementos
  columnsToDisplayWithExpand = [...this.elementos,'opciones', 'expand']; //elementos
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


  reporte = {deposito: 0, operacion: 0, sobrante:0, orden:0}
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
  ]
 
  sucursalFiltro: string = 'Todas'
  sucursalFiltroShow: string = 'Todas'

  rangeReporteGastos = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });
  rangeAdministracion = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  hora_start = '00:00:01';
  hora_end = '23:59:59';

    
  fechas_get = {start:new Date(), end:new Date() }
  fechas_get_formateado = {start:new Date(), end:new Date() }

  fechas_getAdministracion = {inicio: this._publicos.resetearHoras(new Date()), final: this._publicos.resetearHoras(new Date())}


  sucursalFiltroReporte: string = 'Todas'
  sucursalFiltroShowReporte: string = 'Todas'
  //´para el ordenamiento de las tablas
  fechas_reporte:boolean = true
  ordenamientoCampo_reporte = 'index'
  ordenamientoCampo_admin ='index'
  fechas_admin:boolean =  true

  sucursalBarrido: string = null
  
  fechaBarrido: Date = null

  ocupados_gastos = []
  dias_espera = 1
  campos_recupera = ['concepto','facturaRemision','fecha_recibido','id','index','metodo','metodoShow','monto','no_os','numero_os','referencia','status','sucursal','sucursalShow','tipo','numero_os']

  realizaGasto:string = 'gasto'
  
  private _arreglo_fechas_busca: any[];

  filtro_sucursal:string = 'Todas'
  filtro_tipo:string = 'Todos'
  tipos_muestra:string [] = ['Todos','deposito','operacion','orden']


  ngOnInit(): void {
    this.rol()
  }

  rol(){
    const { rol, sucursal, usuario} = this._security.usuarioRol()
    this.USUARIO = usuario
    this.ROL = rol
    this.SUCURSAL = sucursal
    this.filtro_sucursal =  this.SUCURSAL 
    this.vigila()
    this.primeraVez_fechas_default()
  }
  vigila(){
    this.rangeReporteGastos.valueChanges.subscribe(({start:start_, end: end_})=>{
        if (start_ && start_['_d'] && end_ && end_['_d']) {
          const start = start_._d, end  = end_._d
          this.fechas_get = {start, end}
          const {start:_start_format, end:_end_format} = this.formate_fecha_horas()
          this.fechas_get_formateado = {start: _start_format, end: _end_format}
          this.llamada_multiple()
        }        
    })
  }
  formate_fecha_horas(){
    const {start:start_, end:end_}= this.fechas_get
    const start = this._publicos.resetearHoras_horas(start_,'00:00:01')
    const end = this._publicos.resetearHoras_horas(end_,'23:59:59')
    return {start, end}
  }
  primeraVez_fechas_default(){
    const {start, end} = this.formate_fecha_horas()
    this.fechas_get_formateado = {start, end}
    this.llamada_multiple()
  }

  llamada_multiple(){
    const arreglo = ['historial_gastos_orden','historial_gastos_diarios','historial_gastos_operacion']
    arreglo.forEach(donde=>{
      this.funcion_obervador(donde)
    })
  }
  funcion_obervador(donde){
    const starCountRef = ref(db, `${donde}`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        // console.log(`cambio: ${donde}`);
        let arreglo_resultados = []
        
        let fecha_start :Date = new Date()
        const simular_fecha = this._publicos.sumarRestarDiasFecha(fecha_start, -1)

        // this.fechas_get.start = simular_fecha

          const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this.SUCURSAL]

          const arreglo_fechas_busca = this.obtenerArregloFechas_gastos_diarios({ruta: donde, arreglo_sucursal})
          // this._arreglo_fechas_busca = arreglo_fechas_busca
          const promesasConsultas = arreglo_fechas_busca.map(async (f_search) => {
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

          const promesas = await Promise.all(promesasConsultas);

          promesas.forEach(c=>{
            const arreglo_inter:any[] = c
            arreglo_inter.forEach(f=>{
              arreglo_resultados.push(f)
            })
          })
          switch (donde) {
            case 'historial_gastos_diarios':
              this.historial_gastos_diarios =  arreglo_resultados
              break;
            case 'historial_gastos_orden':
              this.historial_gastos_orden =  arreglo_resultados
              break;
            case 'historial_gastos_operacion':
              this.historial_gastos_operacion =  arreglo_resultados
              break;
          }

          this.unirResultados_new()
      }
    })
  }

 
  obtenerArregloFechas_gastos_diarios(data){
    const {ruta, arreglo_sucursal} = data
    const fecha_start = this.fechas_get.start
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
    // return Rutas
    return Rutas
  }

  unirResultados_new(){
    // console.log(this.historial_gastos_operacion);
    
    const ultimate = [...this.historial_gastos_diarios, ...this.historial_gastos_operacion, ...this.historial_gastos_orden]
    const ordenados = this._publicos.ordenarData(ultimate,'fecha_recibido',false)

    this.todos_ultimate = ordenados
    const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(ordenados)
    this.reporte = reporte

    this.dataSource.data = this.todos_ultimate
    this.newPagination('reporteGastos')
    this.filtra_informacion()
  }
  async filtra_informacion(){

    let resultados_1 = (this.filtro_tipo === 'Todos') ? this.todos_ultimate : this.todos_ultimate.filter(c=>c.tipo === this.filtro_tipo)
    const resultados =  (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)
    // console.log(resultados);
    
    const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(resultados)
    this.reporte = reporte
    
    if (this.filtro_tipo === 'Todos' && (this.filtro_sucursal !== 'Todas')){
       
       const {start, end} = this.fechas_get
       const hoy = this._publicos.verificarFechasIgualesHoy(start, end)
      //  console.log(hoy);
       if (hoy) {
        const simular_fecha = this._publicos.sumarRestarDiasFecha(start, 1)
        let updates = {}
        const save = {
          sucursal: this.filtro_sucursal,
          concepto:  'Sobrante dia anterior',
          monto:     reporte.sobrante,      
          metodo:    1,
          status:    true,
          tipo:      'sobrante',
          fecha_recibido: this._publicos.retorna_fechas_hora({fechaString: simular_fecha}).toString_completa
        }
        
        let Fecha_formateada = this._reporte_gastos.fecha_numeros_sin_Espacions(simular_fecha)
        // console.log('Registro normal');
        if (this._publicos.esDomingo(simular_fecha)) {
          // console.log('NO es domingo registra para el lunes');
          const fecha_lunes = this._publicos.sumarRestarDiasFecha(simular_fecha, 1)
          save.fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: fecha_lunes.toString()}).toString_completa
          Fecha_formateada = this._reporte_gastos.fecha_numeros_sin_Espacions(fecha_lunes)
        }
        const ruta_maniana = `historial_gastos_diarios/${this.filtro_sucursal}/${Fecha_formateada}/sobrante_anterior`
        const existe_sobrante_anterior = await this._reporte_gastos.gastos_hoy_sobrante_anterior({ ruta: ruta_maniana}); 
        console.log(existe_sobrante_anterior);
        
        if (!existe_sobrante_anterior) {
          updates[`historial_gastos_diarios/${this.filtro_sucursal}/${Fecha_formateada}/sobrante_anterior`] = save
        }else{
          updates[`historial_gastos_diarios/${this.filtro_sucursal}/${Fecha_formateada}/sobrante_anterior/monto`] = reporte.sobrante
        }
        // update(ref(db), updates).then(()=>{
        //   // console.log('finalizo');
        // })
        // .catch(err=>{
        //   console.log(err);
        // })
       }
       
    }
    
    this.dataSource.data = resultados
    this.newPagination('reporteGastos')
  }
  accion(data_get){
    const {accion, data, monto_caja} = data_get
    // console.log({accion, data});
    // console.log(data_get);
    
    if (accion && data) {
      const data_accion = {...data}
      // console.log(data_accion);
      const {fecha_recibido, sucursal, id} = data_accion
      // 'deposito','operacion','orden'
      let donde 
      switch (data_accion.tipo) {
        case 'deposito':
          donde = 'historial_gastos_diarios'
          break;
        case 'orden':
          donde = 'historial_gastos_orden'
          break;
        case 'operacion':
          donde = 'historial_gastos_operacion'
          break;
      }
      const Fecha_formateada = this._reporte_gastos.fecha_numeros_sin_Espacions(new Date(fecha_recibido))
      const updates = {}
      const ruta = `${donde}/${sucursal}/${Fecha_formateada}/${id}`
      if (accion === 'activar') {
        updates[`${ruta}/status`] = true
        updates[`${ruta}/habilitado_por_usuario`] = this.USUARIO
        updates[`${ruta}/habilitado_por_rol`] = this.ROL
      } if (accion === 'eliminar') {
        updates[`${ruta}/status`] = false
        updates[`${ruta}/inhabilitado_por_usuario`] = this.USUARIO
        updates[`${ruta}/inhabilitado_por_rol`] = this.ROL
      } else if (accion === 'modificar' && monto_caja > 0) {
        // if (typeof monto_caja === 'number' && monto_caja > 0) {
          updates[`${ruta}/status`] = true
          updates[`${ruta}/monto`] = parseInt(monto_caja)
          updates[`${ruta}/modificado_por_usuario`] = this.USUARIO
          updates[`${ruta}/modificado_por_rol`] = this.ROL
        // }
      } 
      const modificado = this._publicos.retorna_fechas_hora({fechaString: new Date(fecha_recibido).toString()}).toString_completa
      updates[`${donde}/${sucursal}/${Fecha_formateada}/${id}/modificado`] = modificado
      // console.log(updates);
      
      update(ref(db), updates).then(()=>{
        this._publicos.swalToast('acccion correcta',1,'top-start')
      })
      .catch(err=>{
        console.log(err);
      })
      
      
    }
    
  }
 
 
  

  

  generaReporteExcelReporteGastos(){
    
    let resultados_1 = (this.filtro_tipo === 'Todos') ? this.todos_ultimate : this.todos_ultimate.filter(c=>c.tipo === this.filtro_tipo)
    const resultados =  (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)

    const arreglado = this.arreglado_para_reporte_excel(resultados)
    // console.log(arreglado);
    

    const filtro_facturas = resultados.filter(f=>f.facturaRemision === 'factura')
    const filtro_notas = resultados.filter(f=>f.facturaRemision === 'nota')

    const data_reporte_general = this._reporte_gastos.reporte_gastos_sucursal_unica(arreglado)
    const data_reporte_facturas = this._reporte_gastos.totales_arreglo_({arreglo: filtro_facturas, facturaRemision:'factura'})
    const data_reporte_notas = this._reporte_gastos.totales_arreglo_({arreglo: filtro_notas, facturaRemision:'nota'})
   
    
    this._export.generaReporteGastosExcel({
      arreglo: arreglado, data_reporte_general, 
      data_reporte_facturas, data_reporte_notas,
      filtro_facturas, filtro_notas
    })

    
  }
  arreglado_para_reporte_excel(arreglo:any[]){
    let nuevos = []
    arreglo.forEach(c=>{
      const {no_os,sucursalShow,
        fecha_recibido,
        referencia,
        concepto,
        descripcion,
        facturaRemision,
        monto,
        status,
        tipo, gasto_tipo, metodoShow, status_orden, data_vehiculo} = c
        const data_vehiculo_ = {...data_vehiculo}
      const data_registro = {
        no_os: no_os || '',
        sucursal: sucursalShow,
        descripcion: descripcion || '',
        fecha_recibido,
        referencia:  referencia || '',
        concepto,
        marca: data_vehiculo_.marca || '',
        modelo: data_vehiculo_.modelo || '',
        placas: data_vehiculo_.placas || '',
        facturaRemision: facturaRemision || '',
        metodo: metodoShow,
        monto,
        status: (status) ? 'aprobado': 'no aprobado',
        tipo,
        gasto_tipo: gasto_tipo || '',
        status_orden: status_orden || ''
      }
      nuevos.push(data_registro)
    })
    return nuevos
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



