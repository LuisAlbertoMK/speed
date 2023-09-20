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
import { ServiciosService } from 'src/app/services/servicios.service';
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
      private _campos: CamposSystemService,private _reporte_gastos: ReporteGastosService, private _servicios: ServiciosService) { 
        const currentYear = new Date().getFullYear();
        this.minDate = new Date(currentYear , 0, 1);
        this.maxDate = new Date(currentYear , 11, 31);
      }
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
  depositos = []
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


  reporte = {deposito: 0, operacion: 0, sobrante:0, orden:0, restante:0}
  reporteAdministracion = {
    iva:0, refacciones:0, total:0, subtotal:0, operacion:0, cantidad:0,
    margen:0, por_margen:0
  }

  camposReporte = [
    {valor:'deposito', show:'Depositos'},
    {valor:'sobrante', show:'Suma de sobrantes'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    {valor:'restante', show:'Sobrante op'},
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

  rangeBarrido = new FormGroup({
    start: new FormControl(new Date())
  });

  hora_start = '00:00:01';
  hora_end = '23:59:59';

    
  fechas_get = {start:new Date(), end:new Date() }
  fechas_get_formateado = {start:new Date(), end:new Date() }
  
  fechas_getAdministracion ={start:new Date(), end:new Date() }
  fechas_get_formateado_admin = {start:new Date(), end:new Date() }


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
  


  filtro_sucursal:string = 'Todas'
  filtro_tipo:string = 'Todos'
  tipos_muestra:string [] = ['Todos','deposito','operacion','orden','sobrante']

  fecha_barrido = {
    start: this._publicos.resetearHoras_horas(new Date(),this.hora_start),
    end: this._publicos.resetearHoras_horas(new Date(), this.hora_end)
  } 

  minDate: Date;
  maxDate: Date;


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
          this.llamada_multiple()
        }        
    })
    this.rangeBarrido.valueChanges.subscribe(({start:start_})=>{
      const selectedDate = start_ && start_['_d'] ? new Date(start_['_d']) : new Date();
      this.fecha_barrido.start = this._publicos.resetearHoras_horas(new Date(selectedDate),this.hora_start) 
      this.fecha_barrido.end = this._publicos.resetearHoras_horas(new Date(selectedDate), this.hora_end)
    })
  }
  formate_fecha_horas(){
    const {start:start_, end:end_}= this.fechas_get
    const start = this._publicos.resetearHoras_horas(start_,'00:00:01')
    const end = this._publicos.resetearHoras_horas(end_,'23:59:59')
    this.fechas_get_formateado = {start, end}
  }
  primeraVez_fechas_default(){
    this.llamada_multiple()
  }

  llamada_multiple(){
    this.formate_fecha_horas()
    const historial_gastos_operacion = ref(db, `historial_gastos_operacion`)
    onValue(historial_gastos_operacion, async (snapshot) => {
      if (snapshot.exists()) {
      this.historial_gastos_operacion = this._publicos.crearArreglo2(snapshot.val())
       this.unirResultados_new()
      }
    })
    const historial_gastos_orden = ref(db, `historial_gastos_orden`)
    onValue(historial_gastos_orden, async (snapshot) => {
      if (snapshot.exists()) {
        this.historial_gastos_orden = this._publicos.crearArreglo2(snapshot.val())
        this.unirResultados_new()
      }
    })
    const historial_gastos_diarios = ref(db, `historial_gastos_diarios`)
    onValue(historial_gastos_diarios, async (snapshot) => {
      if (snapshot.exists()) {
        this.historial_gastos_diarios = this._publicos.crearArreglo2(snapshot.val())
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
    return Rutas
  }

  unirResultados_new(){
    const ultimate = [...this.historial_gastos_diarios, ...this.historial_gastos_operacion, ...this.historial_gastos_orden]
    
    function nueva_data_cliente(ultimate:any){
      const sucursales = [
        {clave: '-N2gkVg1RtSLxK3rTMYc',nombre:'Polanco'},
        {clave: '-N2gkzuYrS4XDFgYciId',nombre:'Toreo'},
        {clave: '-N2glF34lV3Gj0bQyEWK',nombre:'Culhuacán'},
        {clave: '-N2glQ18dLQuzwOv3Qe3',nombre:'Circuito'},
        {clave: '-N2glf8hot49dUJYj5WP',nombre:'Coapa'},
        {clave: '-NN8uAwBU_9ZWQTP3FP_',nombre:'lomas'},
      ]
      // const {sucursal, nombre, apellidos} = cliente
      let nuevos = [...ultimate]
      nuevos.map(hi=>{
        const {sucursal} = hi
        hi.sucursalShow = sucursales.find(s=>s.clave === sucursal).nombre
        return hi
      })
      return nuevos
    }
    const nuevos = nueva_data_cliente(ultimate)
    const ordenados = this._publicos.ordenarData(nuevos,'fecha_recibido',false)

    this.todos_ultimate = ordenados
    
    this.filtra_informacion()
  }
  async filtra_informacion(){

    let resultados_1 = (this.filtro_tipo === 'Todos') ? this.todos_ultimate : this.todos_ultimate.filter(c=>c.tipo === this.filtro_tipo)
    const resultados =  (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)
    
    const {start, end} = this.fechas_get_formateado
    const filtro = resultados.filter(r=>new Date(r.fecha_recibido) >= start && new Date(r.fecha_recibido) <= end )

    // console.log(filtro);
    // const filtro_clave_fecha = filtro.filter(f=>f.id !== clave_fecha)
    const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(filtro)
    this.reporte = reporte
    
    if (this.filtro_tipo === 'Todos' && (this.filtro_sucursal !== 'Todas')){

      const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(filtro)

      // console.log(this.todos_ultimate);
      
      //  const {start, end} = this.fechas_get_formateado
       const hoy = this._publicos.verificarFechasIgualesHoy(start, end)

       if (hoy) {
        const simular_fecha = this._publicos.sumarRestarDiasFecha(start, 1)
        let updates = {}
        const save = {
          sucursal: this.filtro_sucursal,
          concepto:  'Sobrante dia anterior',
          monto:     reporte.restante,      
          metodo:    1,
          status:    true,
          tipo:      'sobrante',
          fecha_recibido: this._publicos.retorna_fechas_hora({fechaString: simular_fecha}).toString_completa
        }
        
        if(reporte.restante !== 0){
         
          // console.log('Registro normal');
          if (this._publicos.esDomingo(simular_fecha)) {
            // console.log('NO es domingo registra para el lunes');
            const fecha_lunes = this._publicos.sumarRestarDiasFecha(simular_fecha, 1)
            save.fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: fecha_lunes.toString()}).toString_completa
          }

          const nueva_fecha_maniana = this._publicos.sumarRestarDiasFecha(new Date(), 1)
          const clave_fecha = genera_clave_diario(nueva_fecha_maniana, this.filtro_sucursal)

          const clave_encontrada = this.todos_ultimate.find(c=>c.id === clave_fecha)
          if (clave_encontrada) {
            // console.log('tenemos sobrante actualizar solamente');
            updates[`historial_gastos_diarios/${clave_fecha}/monto`] = reporte.restante
            updates[`historial_gastos_diarios/${clave_fecha}/status`] = true
          }else{
            // console.log('registrar nuevo sobrante');
            updates[`historial_gastos_diarios/${clave_fecha}`] = save
            
          }

          update(ref(db), updates).then(()=>{
            // console.log('finalizo');
          })
          .catch(err=>{
            console.log(err);
          })
        }
        
       }  
    }
    const campos = [
      'concepto',
      'fecha_recibido',
      'habilitado_por_rol',
      'habilitado_por_usuario',
      'inhabilitado_por_rol',
      'inhabilitado_por_usuario',
      'metodo',
      'modificado',
      'modificado_por_rol',
      'modificado_por_usuario',
      'monto',
      'status',
      'sucursal',
      'tipo',
    ]
    this.todos_ultimate  = (!this.todos_ultimate.length) 
        ?  filtro 
        :  this._publicos.actualizarArregloExistente(this.todos_ultimate, filtro,campos);

    this.dataSource.data = this.todos_ultimate
    this.newPagination('reporteGastos')
  }
  accion(data_get){
    const {accion, data, monto_caja} = data_get
    if (accion && data) {
      const data_accion = {...data}
      const {fecha_recibido, sucursal, id, tipo} = data_accion
      console.log(tipo);
      
      let donde 
      switch (tipo) {
        case 'deposito':
        case 'sobrante':
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
      const ruta = `${donde}/${id}`
      if (accion === 'activar') {
        updates[`${ruta}/status`] = true
        updates[`${ruta}/habilitado_por_usuario`] = this.USUARIO
        updates[`${ruta}/habilitado_por_rol`] = this.ROL
      } if (accion === 'eliminar') {
        updates[`${ruta}/status`] = false
        updates[`${ruta}/inhabilitado_por_usuario`] = this.USUARIO
        updates[`${ruta}/inhabilitado_por_rol`] = this.ROL
      } else if (accion === 'modificar' && monto_caja > 0) {
          updates[`${ruta}/status`] = true
          updates[`${ruta}/monto`] = parseInt(monto_caja)
          updates[`${ruta}/modificado_por_usuario`] = this.USUARIO
          updates[`${ruta}/modificado_por_rol`] = this.ROL
      } 
      const modificado = this._publicos.retorna_fechas_hora({fechaString: new Date(fecha_recibido).toString()}).toString_completa
      updates[`${donde}/${id}/modificado`] = modificado
      // console.log(updates);
      update(ref(db), updates).then(()=>{
        this._publicos.swalToast('acccion correcta',1,'top-start')
      })
      .catch(err=>{
        console.log(err);
      }) 
    }
  }
  async generaReporteExcelReporteGastos(){
    
    const resultados_1 = (this.filtro_tipo === 'Todos') ? this.todos_ultimate : this.todos_ultimate.filter(c=>c.tipo === this.filtro_tipo)
    const resultados =  (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)
    
    const {start, end} = this.fechas_get_formateado
    const filtro = resultados.filter(r=>new Date(r.fecha_recibido) >= start && new Date(r.fecha_recibido) <= end )

    const arreglado = await this.arreglado_para_reporte_excel(filtro)
  
    const filtro_facturas = filtro.filter(f=>f.facturaRemision === 'factura')
    const filtro_notas = filtro.filter(f=>f.facturaRemision === 'nota')

    const data_reporte_general = this._reporte_gastos.reporte_gastos_sucursal_unica(arreglado)

    const ordenados = this._publicos.ordenarData(arreglado,'fecha_recibido',false)
    const total_factura = this._reporte_gastos.totales_arreglo_1({arreglo: filtro_facturas, facturaRemision:'factura'})

    const total_notas = this._reporte_gastos.totales_arreglo_1({arreglo: filtro_notas, facturaRemision:'nota'})

    const restante_dia = total_factura + total_notas

    if (resultados.length) {
      this._publicos.mensajeSwal('Espere ....',3,false,`generando Excel`)
      this._export.generaReporteGastosExcel({
        arreglo: ordenados, data_reporte_general, 
        total_factura, total_notas, restante_dia,
        filtro_facturas, filtro_notas
      })
      Swal.close()
    }else{
      this._publicos.swalToast(`Ningun resultado para exportar`, 0)
    }
  }
  async arreglado_para_reporte_excel(arreglo:any[]){
    let nuevos = []
    const recepciones = await this._servicios.consulta_servicios()
    const vehiculos = await this._vehiculos.consulta_vehiculos_()

    function descripcion_orden(data){
      const { elementos } = data
      return [...elementos].map(nuevos=>{ return `${nuevos.nombre}`.toLowerCase() }).join(', ')
    }
    function metodo_pago(forma){
      const pagos = [
      {valor:'1', show:'Efectivo'},
        {valor:'2', show:'Cheque'},
        {valor:'3', show:'Tarjeta'},
        {valor:'4', show:'Transferencia'},
        {valor:'5', show:'Credito'},
        // {valor:4, show:'OpenPay'},
        // {valor:5, show:'Clip / Mercado Pago'},
        {valor:'6', show:'Terminal BBVA'},
        {valor:'7', show:'Terminal BANAMEX'},
      ]
      const forma_:string = String(forma)
      return pagos.find(p=>p.valor === forma_).show
    }
    
    arreglo.forEach(c=>{
      const {no_os,sucursalShow,
        fecha_recibido,
        referencia,
        concepto,
        descripcion,
        facturaRemision,
        monto,
        status,
        tipo, gasto_tipo, metodo, id_os } = c
        
      const data_registro = {
        no_os: no_os || '',
        sucursal: sucursalShow,
        descripcion: descripcion || '',
        fecha_recibido,
        referencia:  referencia || '',
        concepto,
        marca:  '',
        modelo: '',
        placas: '',
        facturaRemision: facturaRemision || '',
        metodo: metodo_pago(metodo),
        monto,
        status: (status) ? 'aprobado': 'no aprobado',
        tipo,
        gasto_tipo: gasto_tipo || '',
        status_orden: ''
      }
      if (tipo === 'orden') {
        const {vehiculo:id_vehiculo, status} = recepciones[id_os]
        const data_vehiculo = vehiculos[id_vehiculo]
        const { marca,modelo ,placas} = data_vehiculo
        data_registro.marca = marca
        data_registro.modelo = modelo
        data_registro.placas = `${placas}`.toUpperCase()
        data_registro.descripcion = descripcion_orden(recepciones[id_os])
        data_registro.status_orden = status

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
  async realizarBarrido(){
    
    if (this.sucursalBarrido && this.fecha_barrido.start) {

      const {start, end} = this.fecha_barrido
      
      const inicial = new Date(start)
      const final = this._publicos.resetearHoras_horas(new Date(),this.hora_end) 

      const diffTiempo = final.getTime() - inicial.getTime();
      const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));

      

      // let arreglo = []
      if(diffDias >= 0){
        const nombre_sucursal = nueva_data_cliente(this.sucursalBarrido)
        const { respuesta } = await this._publicos.mensaje_pregunta(`Realizar barrido`,true,`${nombre_sucursal}`)

        if(!respuesta) return

        

        Swal.fire({
          title: 'Realizando calculos en gastos diarios',
          html: 'espere porfavor ... ',
          allowOutsideClick: false,
          showConfirmButton:false
        })
        Swal.isLoading()
        // const donde = ['historial_gastos_orden','historial_gastos_diarios','historial_gastos_operacion']
        for (let i = 0; i <= diffDias; i++) {       
          const fecha_retorna = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);

          await this.llamada_multiple()

          const _operacion = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_operacion())
          const _orden = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_orden())
          const _diarios = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_diarios())

          const ultimate = [..._operacion, ..._orden, ..._diarios]
          
          const inicial:Date = this._publicos.resetearHoras_horas(new Date(fecha_retorna), this.hora_start)
          const final:Date = this._publicos.resetearHoras_horas(new Date(fecha_retorna), this.hora_end)

          const filtro_sucursal = ultimate.filter(s=>s.sucursal === this.sucursalBarrido)

          const resultados_fecha = filtro_sucursal.filter(r=>new Date(r.fecha_recibido) >= inicial && new Date(r.fecha_recibido) <= final )

          const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(resultados_fecha)
          
          const simular_fecha = this._publicos.sumarRestarDiasFecha(inicial, 1)
          let updates = {}
          const save = {
            sucursal: this.sucursalBarrido,
            concepto:  'Sobrante dia anterior',
            monto:     reporte.restante,      
            metodo:    1,
            status:    true,
            tipo:      'sobrante',
            fecha_recibido: this._publicos.retorna_fechas_hora({fechaString: simular_fecha}).toString_completa
          }


          if (reporte.restante !== 0 ) {
            if (this._publicos.esDomingo(simular_fecha)) {
              const fecha_lunes = this._publicos.sumarRestarDiasFecha(inicial, 1)
              save.fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: fecha_lunes.toString()}).toString_completa

            }
            const nueva_fecha_maniana = this._publicos.sumarRestarDiasFecha(new Date(inicial), 1)
            let clave_registro_sobrante = genera_clave_diario(nueva_fecha_maniana, this.sucursalBarrido)

            const clave_encontrada = this.todos_ultimate.find(c=>c.id === clave_registro_sobrante)
            if (clave_encontrada) {
              // console.log('tenemos sobrante actualizar solamente');
              const path = `historial_gastos_diarios/${clave_registro_sobrante}`
              updates[`${path}/monto`] = reporte.restante
              updates[`${path}/status`] = true
              updates[`${path}/habilitado_por_usuario`] = this.USUARIO
              updates[`${path}/habilitado_por_rol`] = this.ROL
              const modificado = this._publicos.retorna_fechas_hora({fechaString: new Date().toString()}).toString_completa
              updates[`${path}/modificado`] = modificado
              updates[`${path}/modificado_por_usuario`] = this.USUARIO
              updates[`${path}/modificado_por_rol`] = this.ROL

            }else{
              // console.log('registrar nuevo sobrante');
              updates[`historial_gastos_diarios/${clave_registro_sobrante}`] = save
            }
            update(ref(db), updates).then(()=>{
              // console.log('finalizo');
              // Swal.close()
            })
            .catch(err=>{
              console.log(err);
            })
          }

        }
        Swal.close()
        this._publicos.swalToast(`Completado`,1,'top-start')
        
      }else{
        this._publicos.swalToast(`no se puede realizar el barrido`,0,'top-start')
      }
    }else{
      this._publicos.swalToast(`no se puede realizar el barrido`,0,'top-start')
    }

   

    
    
    
  }

  data_deposito(event){
    if (event) this._publicos.cerrar_modal('modal-deposito')
  }

  //TODO relacionado con administracion


}


function nueva_data_cliente(sucursal){
  const nombres = [
    {clave: '-N2gkVg1RtSLxK3rTMYc',nombre:'Polanco'},
    {clave: '-N2gkzuYrS4XDFgYciId',nombre:'Toreo'},
    {clave: '-N2glF34lV3Gj0bQyEWK',nombre:'Culhuacán'},
    {clave: '-N2glQ18dLQuzwOv3Qe3',nombre:'Circuito'},
    {clave: '-N2glf8hot49dUJYj5WP',nombre:'Coapa'},
    {clave: '-NN8uAwBU_9ZWQTP3FP_',nombre:'lomas'},
  ]
  return nombres.find(s=>s.clave === sucursal).nombre
}

function genera_clave_diario(fecha, sucursal){
  const clave_sobrante_fecha = formatearFecha(new Date(fecha), false)
  const clave_sobrante_nombre = nueva_data_cliente(sucursal)
  
  const nombre_sucu = clave_sobrante_nombre.slice(0,2).toUpperCase()
  return `${nombre_sucu}${clave_sobrante_fecha}`
}
function formatearFecha(fecha_get,simbolo:boolean,symbol?) {
  let fecha = new Date(fecha_get)
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const anio = fecha.getFullYear().toString();
  if(!symbol) symbol= '/'
  return (simbolo) ? `${dia}${symbol}${mes}${symbol}${anio}` : `${dia}${mes}${anio}`;
}
