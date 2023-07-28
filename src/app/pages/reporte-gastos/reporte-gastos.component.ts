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
      private _campos: CamposSystemService,private _reporte_gastos: ReporteGastosService, private _servicios: ServiciosService) { }
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
  tipos_muestra:string [] = ['Todos','deposito','operacion','orden','sobrante']

  fecha_barrido = {start:null, end:null} 

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
    this.ordenes_realizadas_entregado()
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
      if (start_ && start_['_d'] ) {
        this.fecha_barrido.start = this._publicos.resetearHoras_horas(new Date(start_['_d']),this.hora_start) 
        this.fecha_barrido.end = this._publicos.resetearHoras_horas(new Date(start_['_d']), this.hora_end)
      }        
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
    return Rutas
  }

  unirResultados_new(){
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
          monto:     reporte.restante,      
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
        // console.log(existe_sobrante_anterior);
        
        if (!existe_sobrante_anterior) {
          updates[`historial_gastos_diarios/${this.filtro_sucursal}/${Fecha_formateada}/sobrante_anterior`] = save
        }else{
          updates[`historial_gastos_diarios/${this.filtro_sucursal}/${Fecha_formateada}/sobrante_anterior/monto`] = reporte.restante
        }
        update(ref(db), updates).then(()=>{
          // console.log('finalizo');
        })
        .catch(err=>{
          console.log(err);
        })
       }  
    }
    
    this.dataSource.data = resultados
    this.newPagination('reporteGastos')
  }
  accion(data_get){
    const {accion, data, monto_caja} = data_get
    if (accion && data) {
      const data_accion = {...data}
      const {fecha_recibido, sucursal, id} = data_accion
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
          updates[`${ruta}/status`] = true
          updates[`${ruta}/monto`] = parseInt(monto_caja)
          updates[`${ruta}/modificado_por_usuario`] = this.USUARIO
          updates[`${ruta}/modificado_por_rol`] = this.ROL
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

    const filtro_facturas = resultados.filter(f=>f.facturaRemision === 'factura')
    const filtro_notas = resultados.filter(f=>f.facturaRemision === 'nota')

    const data_reporte_general = this._reporte_gastos.reporte_gastos_sucursal_unica(arreglado)
    const data_reporte_facturas = this._reporte_gastos.totales_arreglo_({arreglo: filtro_facturas, facturaRemision:'factura'})
    const data_reporte_notas = this._reporte_gastos.totales_arreglo_({arreglo: filtro_notas, facturaRemision:'nota'})
   
    // console.log(data_reporte_general);
    const ordenados = this._publicos.ordenarData(arreglado,'fecha_recibido',true)
    
    if (resultados.length) {
      this._publicos.mensajeSwal('Espere ....',3,false,`generando Excel`)
      this._export.generaReporteGastosExcel({
        arreglo: ordenados, data_reporte_general, 
        data_reporte_facturas, data_reporte_notas,
        filtro_facturas, filtro_notas
      })
      Swal.close()
    }else{
      this._publicos.swalToast(`Ningun resultado para exportar`, 0)
    }
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
  async realizarBarrido(){
    
    if (this.sucursalBarrido && this.fecha_barrido.start) {
      // mensaje, allowOutsideClick?, html?:string
      

      const { start }= this.fecha_barrido
      
      const inicial = new Date(start)
      const final = this._publicos.resetearHoras_horas(new Date(),this.hora_end) 

      const diffTiempo = final.getTime() - inicial.getTime();
      const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));

      

      // let arreglo = []
      if(diffDias > 0){
        const { respuesta } = await this._publicos.mensaje_pregunta(`Realizar barrido`,true,`${this.sucursalBarrido}`)

        if(!respuesta) return

        Swal.fire({
          title: 'Realizando calculos en gastos diarios',
          html: 'espere porfavor ... ',
          allowOutsideClick: false,
        })
        const donde = ['historial_gastos_orden','historial_gastos_diarios','historial_gastos_operacion']
        for (let i = 0; i <= diffDias; i++) {       
          const fecha_retorna = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
          if (!this._publicos.esDomingo(fecha_retorna)) {
            const Fecha_formateada = this._reporte_gastos.fecha_numeros_sin_Espacions(fecha_retorna)
            // arreglo.push(Fecha_formateada)
            console.log(Fecha_formateada);
            
            let arreglo = []
            donde.forEach(donde_=>{
              arreglo.push(`${donde_}/${this.sucursalBarrido}/${Fecha_formateada}`)
            })

             const promesasConsultas = arreglo.map(async(c)=>{
              return  await this._reporte_gastos.gastos_hoy({ ruta: c});
            })
            const promesas = await Promise.all(promesasConsultas);

            let arreglo_resultados = []
            promesas.forEach(c=>{
              const arreglo_inter:any[] = c
              arreglo_inter.forEach(f=>{
                arreglo_resultados.push(f)
              })
            })
            let updates = {}
            const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(arreglo_resultados)
            
            const simular_fecha = this._publicos.sumarRestarDiasFecha(fecha_retorna, 1)
            const save = {
              sucursal: this.sucursalBarrido,
              concepto:  'Sobrante dia anterior',
              monto:     reporte.restante,      
              metodo:    1,
              status:    true,
              tipo:      'sobrante',
              fecha_recibido: this._publicos.retorna_fechas_hora({fechaString: simular_fecha}).toString_completa
            }
            let Fecha_formateada_ = this._reporte_gastos.fecha_numeros_sin_Espacions(simular_fecha)
            
            if (this._publicos.esDomingo(simular_fecha)) {
              // console.log('NO es domingo registra para el lunes');
              const fecha_lunes = this._publicos.sumarRestarDiasFecha(simular_fecha, 1)
              save.fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: fecha_lunes.toString()}).toString_completa
              Fecha_formateada_ = this._reporte_gastos.fecha_numeros_sin_Espacions(fecha_lunes)
            }
            const ruta_maniana = `historial_gastos_diarios/${this.sucursalBarrido}/${Fecha_formateada_}/sobrante_anterior`
            const existe_sobrante_anterior = await this._reporte_gastos.gastos_hoy_sobrante_anterior({ ruta: ruta_maniana}); 

            if (!existe_sobrante_anterior) {
              updates[`historial_gastos_diarios/${this.sucursalBarrido}/${Fecha_formateada_}/sobrante_anterior`] = save
            }else{
              updates[`historial_gastos_diarios/${this.sucursalBarrido}/${Fecha_formateada_}/sobrante_anterior/monto`] = reporte.restante
            }
            const actualizo = await this._reporte_gastos.registra_sobrante(updates); 
            console.log(actualizo);
            
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
  async ordenes_realizadas_entregado(){
    const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s=>{return s.id}) : [this.SUCURSAL]
    // const arreglo_fechas_busca = this.obtenerArregloFechas_gastos_diarios({ruta: donde, arreglo_sucursal})
    const arreglo_rutas = this.crea_ordenes_sucursal({arreglo_sucursal})
    console.log(arreglo_rutas);
    
    const promesas = arreglo_rutas.map(async (ruta)=>{
      // regresa_servicios_por_cada_ruta({answer}) 
      
      const respuesta = await  this._servicios.consulta_recepcion_sucursal({ruta})
        return this.regresa_servicios_por_cada_ruta({answer: respuesta}) 
      })

    // const promesas_resueltas = await Promise.all(promesas);
    // console.log(promesas_resueltas);

    // let finales = []

    // promesas_resueltas.forEach(s=>{
    //   finales = [...finales, ...s]
    // })

    const promesas_resueltas = await Promise.all(promesas);
    const finales = promesas_resueltas.flat() //.filter(s=>s.status === 'entregado');
    console.log(finales);

    // console.log(answer);
    // console.log(finales);
    

    // console.log(obtenidos);
    
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
    const answera = {
      "-NG2LstV0NhaJkHH6ro-": {
        "-NRFjRowgFS_D7porrDF": {
          "cliente": "-NG2LstV0NhaJkHH6ro-",
          "diasSucursal": 123,
          "fechaPromesa": "24/3/2023",
          "fecha_recibido": "23/3/2023",
          "formaPago": 1,
          "hora_recibido": "17:11:27",
          "iva": true,
          "margen": 25,
          "no_os": "CU0323GE00021",
          "reporte": {
            "descuento": 0,
            "iva": 1945.6000000000001,
            "meses": 0,
            "mo": 5360,
            "refacciones_a": 4640,
            "refacciones_v": 5800,
            "sobrescrito": 1000,
            "sobrescrito_mo": 1000,
            "sobrescrito_paquetes": 0,
            "sobrescrito_refaccion": 0,
            "subtotal": 12160,
            "total": 14105.599999999999,
            "ub": 61.8421052631579
          },
          "servicio": 1,
          "servicios": [
            {
              "UB": "100.00",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "6",
              "costo": 0,
              "desgloce": {
                "UB": 100,
                "flotilla": 200,
                "mo": 200,
                "normal": 250,
                "precio": 0,
                "refacciones1": 0,
                "refacciones2": 0
              },
              "elementos": [
                {
                  "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 0,
                  "nombre": "FRENOSSSS",
                  "precio": 200,
                  "tipo": "MO",
                  "total": 200
                }
              ],
              "enCatalogo": true,
              "flotilla": 200,
              "id": "-NE2pvE6CS_1mdeHFL5W",
              "index": 0,
              "marca": "Ford",
              "modelo": "F-350",
              "nombre": "x",
              "precio": 200,
              "reporte": {
                "mo": 200,
                "refacciones": 0,
                "refacciones_v": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 200,
                "ub": 100
              },
              "reporte_interno": {
                "mo": 200,
                "refacciones": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 200,
              "tipo": "paquete",
              "total": 200
            },
            {
              "UB": "73.02",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "6",
              "costo": 0,
              "desgloce": {
                "UB": 73.02504816955684,
                "flotilla": 2595,
                "mo": 1720,
                "normal": 3243.75,
                "precio": 0,
                "refacciones1": 700,
                "refacciones2": 875
              },
              "elementos": [
                {
                  "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 0,
                  "nombre": "nueva",
                  "precio": 100,
                  "tipo": "MO",
                  "total": 100
                },
                {
                  "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 1,
                  "marca": "BMW",
                  "nombre": "prueba 2000 mo",
                  "precio": 700,
                  "tipo": "refaccion",
                  "total": 875
                },
                {
                  "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 2,
                  "nombre": "nueva",
                  "precio": 120,
                  "tipo": "MO",
                  "total": 120
                },
                {
                  "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 3,
                  "marca": "BMW",
                  "nombre": "prueba 2000 mo",
                  "precio": 700,
                  "tipo": "MO",
                  "total": 700
                },
                {
                  "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 4,
                  "nombre": "prueba 500",
                  "precio": 800,
                  "tipo": "MO",
                  "total": 800
                }
              ],
              "enCatalogo": true,
              "flotilla": 2595,
              "id": "-NE430_ohL7xCijFnR3i",
              "index": 1,
              "marca": "GMC",
              "modelo": "Canyon",
              "nombre": "paquete z",
              "precio": 2595,
              "reporte": {
                "mo": 1720,
                "refacciones": 700,
                "refacciones_v": 875,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 2595,
                "ub": 66.28131021194605
              },
              "reporte_interno": {
                "mo": 1720,
                "refacciones": 700,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 2595,
              "tipo": "paquete",
              "total": 2595
            },
            {
              "UB": "58.62",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "6",
              "costo": 0,
              "desgloce": {
                "UB": 58.62068965517241,
                "flotilla": 1450,
                "mo": 700,
                "normal": 1812.5,
                "precio": 0,
                "refacciones1": 600,
                "refacciones2": 750
              },
              "elementos": [
                {
                  "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "XD",
                  "flotilla": 750,
                  "index": 0,
                  "marca": "BMW",
                  "nombre": "exprimi",
                  "normal": 975,
                  "precio": 600,
                  "subtotal": 750,
                  "tipo": "refaccion",
                  "total": 750
                },
                {
                  "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 700,
                  "index": 1,
                  "marca": "BMW",
                  "nombre": "prueba 2000 mo",
                  "normal": 910,
                  "precio": 700,
                  "subtotal": 700,
                  "tipo": "MO",
                  "total": 700
                }
              ],
              "enCatalogo": true,
              "flotilla": 1450,
              "id": "-NEH_O1qK7I5z8sWdOQz",
              "index": 2,
              "marca": "BMW",
              "modelo": "iX M60",
              "nombre": "paquete bmw",
              "precio": 1450,
              "reporte": {
                "mo": 700,
                "refacciones": 600,
                "refacciones_v": 750,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 1450,
                "ub": 48.275862068965516
              },
              "reporte_interno": {
                "mo": 700,
                "refacciones": 600,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 1450,
              "tipo": "paquete",
              "total": 1450
            },
            {
              "UB": "20.00",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "4",
              "costo": 0,
              "desgloce": {
                "UB": 20,
                "flotilla": 375,
                "mo": 0,
                "normal": 468.75,
                "precio": 0,
                "refacciones1": 300,
                "refacciones2": 375
              },
              "elementos": [
                {
                  "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 375,
                  "index": 0,
                  "marca": "Audi",
                  "nombre": "BALATAS",
                  "normal": 487.5,
                  "precio": 300,
                  "subtotal": 375,
                  "tipo": "refaccion",
                  "total": 375
                }
              ],
              "enCatalogo": true,
              "flotilla": 375,
              "id": "-NFng8NXTiO7yySaUCtQ",
              "index": 3,
              "marca": "BMW",
              "modelo": "Serie 1",
              "nombre": "nuevo",
              "precio": 375,
              "reporte": {
                "mo": 0,
                "refacciones": 300,
                "refacciones_v": 375,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 375,
                "ub": 0
              },
              "reporte_interno": {
                "mo": 0,
                "refacciones": 300,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 375,
              "tipo": "paquete",
              "total": 375
            },
            {
              "UB": "20.00",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "6",
              "costo": 0,
              "desgloce": {
                "UB": 20,
                "flotilla": 375,
                "mo": 0,
                "normal": 468.75,
                "precio": 0,
                "refacciones1": 300,
                "refacciones2": 375
              },
              "elementos": [
                {
                  "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 375,
                  "index": 0,
                  "marca": "Audi",
                  "nombre": "BALATAS",
                  "normal": 487.5,
                  "precio": 300,
                  "subtotal": 375,
                  "tipo": "refaccion",
                  "total": 375
                }
              ],
              "enCatalogo": true,
              "flotilla": 375,
              "id": "-NFyFt2ltBZt-CMx0way",
              "index": 4,
              "marca": "Bentley",
              "modelo": "Continental ",
              "nombre": "aqui",
              "precio": 375,
              "reporte": {
                "mo": 0,
                "refacciones": 300,
                "refacciones_v": 375,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 375,
                "ub": 0
              },
              "reporte_interno": {
                "mo": 0,
                "refacciones": 300,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 375,
              "tipo": "paquete",
              "total": 375
            },
            {
              "UB": "47.82",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "6",
              "costo": 0,
              "desgloce": {
                "UB": 47.82608695652174,
                "flotilla": 1437.5,
                "mo": 500,
                "normal": 1796.875,
                "precio": 0,
                "refacciones1": 750,
                "refacciones2": 937.5
              },
              "elementos": [
                {
                  "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 375,
                  "index": 0,
                  "marca": "Audi",
                  "nombre": "BALATAS",
                  "normal": 487.5,
                  "precio": 300,
                  "subtotal": 375,
                  "tipo": "refaccion",
                  "total": 375
                },
                {
                  "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 562.5,
                  "index": 1,
                  "marca": "GMC",
                  "nombre": "XD",
                  "normal": 731.25,
                  "precio": 450,
                  "subtotal": 562.5,
                  "tipo": "refaccion",
                  "total": 562.5
                },
                {
                  "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 500,
                  "index": 2,
                  "marca": "ninguna",
                  "nombre": "Mandk",
                  "normal": 650,
                  "precio": 500,
                  "subtotal": 500,
                  "tipo": "MO",
                  "total": 500
                }
              ],
              "enCatalogo": true,
              "flotilla": 1437.5,
              "id": "-NG386DKUmKAlxvapTIK",
              "index": 5,
              "marca": "Jeep",
              "modelo": "Wrangler",
              "nombre": "nuevo",
              "precio": 1437.5,
              "reporte": {
                "mo": 500,
                "refacciones": 750,
                "refacciones_v": 937.5,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 1437.5,
                "ub": 34.78260869565217
              },
              "reporte_interno": {
                "mo": 500,
                "refacciones": 750,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 1437.5,
              "tipo": "paquete",
              "total": 1437.5
            },
            {
              "UB": "74.68",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "6",
              "costo": 0,
              "desgloce": {
                "UB": 74.68354430379746,
                "flotilla": 1185,
                "mo": 810,
                "normal": 1481.25,
                "precio": 0,
                "refacciones1": 300,
                "refacciones2": 375
              },
              "elementos": [
                {
                  "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 500,
                  "index": 0,
                  "marca": "ninguna",
                  "nombre": "Mandk",
                  "normal": 650,
                  "precio": 500,
                  "subtotal": 500,
                  "tipo": "MO",
                  "total": 500
                },
                {
                  "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 375,
                  "index": 1,
                  "marca": "Audi",
                  "nombre": "BALATAS",
                  "normal": 487.5,
                  "precio": 300,
                  "subtotal": 375,
                  "tipo": "refaccion",
                  "total": 375
                },
                {
                  "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 230,
                  "index": 2,
                  "marca": "ninguna",
                  "nombre": "new mo",
                  "normal": 299,
                  "precio": 230,
                  "subtotal": 230,
                  "tipo": "MO",
                  "total": 230
                },
                {
                  "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 80,
                  "index": 3,
                  "marca": "Aston Martín",
                  "nombre": "mano de obra cara",
                  "normal": 104,
                  "precio": 80,
                  "subtotal": 80,
                  "tipo": "MO",
                  "total": 80
                }
              ],
              "enCatalogo": true,
              "flotilla": 1185,
              "id": "-NG38XM-ZEqoNxvurYl0",
              "index": 6,
              "marca": "Jeep",
              "modelo": "Wrangler",
              "nombre": "personalizado 1",
              "precio": 1185,
              "reporte": {
                "mo": 810,
                "refacciones": 300,
                "refacciones_v": 375,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 1185,
                "ub": 68.35443037974683
              },
              "reporte_interno": {
                "mo": 810,
                "refacciones": 300,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 1185,
              "tipo": "paquete",
              "total": 1185
            },
            {
              "UB": "57.33",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "6",
              "costo": 0,
              "desgloce": {
                "UB": 57.333333333333336,
                "flotilla": 1500,
                "mo": 700,
                "normal": 1875,
                "precio": 0,
                "refacciones1": 640,
                "refacciones2": 800
              },
              "elementos": [
                {
                  "IDreferencia": "-NFof935I4yJ0ulZ945p",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 250,
                  "index": 0,
                  "marca": "ninguna",
                  "nombre": "refa refa",
                  "normal": 325,
                  "precio": 200,
                  "subtotal": 250,
                  "tipo": "refaccion",
                  "total": 250
                },
                {
                  "IDreferencia": "-NFof935I4yJ0ulZ945p",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 250,
                  "index": 1,
                  "marca": "ninguna",
                  "nombre": "refa refa",
                  "normal": 325,
                  "precio": 200,
                  "subtotal": 250,
                  "tipo": "refaccion",
                  "total": 250
                },
                {
                  "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 300,
                  "index": 2,
                  "marca": "-NFiyBdjmZFfdpSoyWNU",
                  "nombre": "nueva refac 45",
                  "normal": 390,
                  "precio": 240,
                  "subtotal": 300,
                  "tipo": "refaccion",
                  "total": 300
                },
                {
                  "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 700,
                  "index": 3,
                  "marca": "BMW",
                  "nombre": "prueba 2000 mo",
                  "normal": 910,
                  "precio": 700,
                  "subtotal": 700,
                  "tipo": "MO",
                  "total": 700
                }
              ],
              "enCatalogo": true,
              "flotilla": 1500,
              "id": "-NG38nZre8RkONgpHMEY",
              "index": 7,
              "marca": "Jeep",
              "modelo": "Wrangler",
              "nombre": "personalizado 2",
              "precio": 1500,
              "reporte": {
                "mo": 700,
                "refacciones": 640,
                "refacciones_v": 800,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 1500,
                "ub": 46.666666666666664
              },
              "reporte_interno": {
                "mo": 700,
                "refacciones": 640,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 1500,
              "tipo": "paquete",
              "total": 1500
            },
            {
              "UB": "42.12",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "4",
              "costo": 0,
              "desgloce": {
                "UB": 42.12218649517685,
                "flotilla": 1555,
                "mo": 430,
                "normal": 1943.75,
                "precio": 0,
                "refacciones1": 900,
                "refacciones2": 1125
              },
              "elementos": [
                {
                  "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 350,
                  "index": 0,
                  "marca": "ninguna",
                  "nombre": "600",
                  "normal": 455,
                  "precio": 350,
                  "subtotal": 350,
                  "tipo": "MO",
                  "total": 350
                },
                {
                  "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 500,
                  "index": 1,
                  "marca": "-NFyYn5eKO2EuaZhukGs",
                  "nombre": "BALATAS CERÁMICA",
                  "normal": 650,
                  "precio": 400,
                  "subtotal": 500,
                  "tipo": "refaccion",
                  "total": 500
                },
                {
                  "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 625,
                  "index": 2,
                  "marca": "BMW",
                  "nombre": "SEGURO BALASTASSSS",
                  "normal": 812.5,
                  "precio": 500,
                  "subtotal": 625,
                  "tipo": "refaccion",
                  "total": 625
                },
                {
                  "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "flotilla": 80,
                  "index": 3,
                  "marca": "Aston Martín",
                  "nombre": "mano de obra cara",
                  "normal": 104,
                  "precio": 80,
                  "subtotal": 80,
                  "tipo": "MO",
                  "total": 80
                }
              ],
              "enCatalogo": true,
              "flotilla": 1555,
              "id": "-NG3sNo5jlk1a0qoBMjL",
              "index": 8,
              "marca": "Chevrolet",
              "modelo": "Equinox",
              "nombre": "paquetePruebaWEB",
              "precio": 1555,
              "reporte": {
                "mo": 430,
                "refacciones": 900,
                "refacciones_v": 1125,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 1555,
                "ub": 27.652733118971057
              },
              "reporte_interno": {
                "mo": 430,
                "refacciones": 900,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 1555,
              "tipo": "paquete",
              "total": 1555
            },
            {
              "aprobada": false,
              "aprobado": true,
              "cantidad": 2,
              "costo": 500,
              "descripcion": "ninguna",
              "enCatalogo": true,
              "flotilla": 500,
              "id": "-NG3I_ejiuh3KiL9EdAp",
              "index": 9,
              "nombre": "600",
              "precio": 100,
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 1000,
              "tipo": "MO",
              "total": 1000
            },
            {
              "aprobada": false,
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "enCatalogo": true,
              "flotilla": 150,
              "id": "-NI8Qx6S-SUBqjhU_z2k",
              "index": 10,
              "marca": "-NFyYn5eKO2EuaZhukGs",
              "nombre": "BALATAS CERÁMICA",
              "precio": 150,
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 150,
              "tipo": "refaccion",
              "total": 187.5
            },
            {
              "aprobada": false,
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "enCatalogo": true,
              "flotilla": 300,
              "id": "-NFGEgUK6OVe2fEDvCgS",
              "index": 11,
              "marca": "Aston Martín",
              "nombre": "LAVAR CPO DE ACELERACION",
              "precio": 300,
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            }
          ],
          "status": "recibido",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NG2MESh7vZpmKP_Rpso"
        }
      },
      "-NLRhhoHEmZzs36LQyO-": {
        "-NLRjhBpGQ8M3tJTpA4I": {
          "ckeckList": [
            {
              "id": "antena",
              "mostrar": "antena",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "birlo_seguridad",
              "mostrar": "birlo seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "bocinas",
              "mostrar": "bocinas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "botones_interiores",
              "mostrar": "botones interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "boxina_claxon",
              "mostrar": "boxina claxon",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "calefaccion",
              "mostrar": "calefaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "cenicero",
              "mostrar": "cenicero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "cristales",
              "mostrar": "cristales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "encendedor",
              "mostrar": "encendedor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "espejo_retorvisor",
              "mostrar": "espejo retorvisor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "espejos_laterales",
              "mostrar": "espejos laterales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "estuche_herramientas",
              "mostrar": "estuche herramientas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "extintor",
              "mostrar": "extintor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "gato",
              "mostrar": "gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "golpes_y_carroceria",
              "mostrar": "golpes y carroceria",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "instrumentos_tablero",
              "mostrar": "instrumentos tablero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "interiores",
              "mostrar": "interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "limpiadores",
              "mostrar": "limpiadores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "llanta_refaccion",
              "mostrar": "llanta refaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "llave_cruz",
              "mostrar": "llave cruz",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "llega_en_grua",
              "mostrar": "llega en grua",
              "opciones": [
                "si",
                "no"
              ],
              "status": "no"
            },
            {
              "id": "luces",
              "mostrar": "luces",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "maneral_gato",
              "mostrar": "maneral gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "manijas_interiores",
              "mostrar": "manijas interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "molduras_completas",
              "mostrar": "molduras completas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "nivel_gasolina",
              "mostrar": "nivel gasolina",
              "opciones": [
                "vacio",
                "1/4",
                "1/2",
                "3/4",
                "lleno"
              ],
              "status": "3/4"
            },
            {
              "id": "radio",
              "mostrar": "radio",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapetes",
              "mostrar": "tapetes",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapon_combustible",
              "mostrar": "tapon combustible",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapones_llantas",
              "mostrar": "tapones llantas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapones_motor",
              "mostrar": "tapones motor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tarjeta_de_circulacion",
              "mostrar": "tarjeta de circulacion",
              "opciones": [
                "si",
                "no"
              ],
              "status": "si"
            },
            {
              "id": "testigos_en_tablero",
              "mostrar": "testigos en tablero",
              "opciones": [
                "si",
                "no"
              ],
              "status": "si"
            },
            {
              "id": "triangulos_seguridad",
              "mostrar": "triangulos seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            }
          ],
          "cliente": "-NLRhhoHEmZzs36LQyO-",
          "detalles": [
            {
              "checado": false,
              "id": "Capo",
              "index": 0
            },
            {
              "checado": false,
              "id": "Paragolpes_frontal",
              "index": 1
            },
            {
              "checado": false,
              "id": "Paragolpes_posterior",
              "index": 2
            },
            {
              "checado": false,
              "id": "Techo",
              "index": 3
            },
            {
              "checado": false,
              "id": "espejo_derecho",
              "index": 4
            },
            {
              "checado": false,
              "id": "espejo_izquierdo",
              "index": 5
            },
            {
              "checado": false,
              "id": "faros_frontales",
              "index": 6
            },
            {
              "checado": false,
              "id": "faros_posteriores",
              "index": 7
            },
            {
              "checado": false,
              "id": "parabrisas_posterior",
              "index": 8
            },
            {
              "checado": false,
              "id": "paragolpes_frontal",
              "index": 9
            },
            {
              "checado": false,
              "id": "paragolpes_posterior",
              "index": 10
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_1",
              "index": 11
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_2",
              "index": 12
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_1",
              "index": 13
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_2",
              "index": 14
            },
            {
              "checado": false,
              "id": "puerta_posterior",
              "index": 15
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_1",
              "index": 16
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_2",
              "index": 17
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_1",
              "index": 18
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_2",
              "index": 19
            },
            {
              "checado": false,
              "id": "tirador_posterior",
              "index": 20
            }
          ],
          "diasSucursal": 195,
          "fechaPromesa": "12/1/2023",
          "fecha_recibido": "10/1/2023",
          "formaPago": 1,
          "hora_recibido": "11:33:48",
          "iva": true,
          "margen": 25,
          "no_os": "CU0123GE00007",
          "reporte": {
            "descuento": 0,
            "iva": 19.2,
            "meses": 0,
            "mo": 120,
            "refacciones_a": 0,
            "refacciones_v": 0,
            "sobrescrito": 0,
            "sobrescrito_mo": 0,
            "sobrescrito_paquetes": 0,
            "sobrescrito_refaccion": 0,
            "subtotal": 120,
            "total": 139.2,
            "ub": 100
          },
          "servicio": 1,
          "servicios": [
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "enCatalogo": true,
              "id": "-NE2JJZu_LtUYJXSBola",
              "index": 0,
              "nombre": "CAMBIO DE ACEITE Y FILTRO",
              "precio": 120,
              "status": true,
              "tipo": "MO",
              "total": 120
            }
          ],
          "status": "recibido",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NLRhx7nvvrQjTtMDudv"
        }
      },
      "-NLS512d_ACSLeFE5r02": {
        "-NLS7TphRB86LSfRilno": {
          "ckeckList": [
            {
              "id": "antena",
              "mostrar": "antena",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "birlo_seguridad",
              "mostrar": "birlo seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "bocinas",
              "mostrar": "bocinas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "botones_interiores",
              "mostrar": "botones interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "boxina_claxon",
              "mostrar": "boxina claxon",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "calefaccion",
              "mostrar": "calefaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "cenicero",
              "mostrar": "cenicero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "cristales",
              "mostrar": "cristales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "encendedor",
              "mostrar": "encendedor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "espejo_retorvisor",
              "mostrar": "espejo retorvisor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "espejos_laterales",
              "mostrar": "espejos laterales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "estuche_herramientas",
              "mostrar": "estuche herramientas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "extintor",
              "mostrar": "extintor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "gato",
              "mostrar": "gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "golpes_y_carroceria",
              "mostrar": "golpes y carroceria",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "instrumentos_tablero",
              "mostrar": "instrumentos tablero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "interiores",
              "mostrar": "interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "limpiadores",
              "mostrar": "limpiadores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "llanta_refaccion",
              "mostrar": "llanta refaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "llave_cruz",
              "mostrar": "llave cruz",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "llega_en_grua",
              "mostrar": "llega en grua",
              "opciones": [
                "si",
                "no"
              ],
              "status": "si"
            },
            {
              "id": "luces",
              "mostrar": "luces",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "maneral_gato",
              "mostrar": "maneral gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "manijas_interiores",
              "mostrar": "manijas interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "molduras_completas",
              "mostrar": "molduras completas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "nivel_gasolina",
              "mostrar": "nivel gasolina",
              "opciones": [
                "vacio",
                "1/4",
                "1/2",
                "3/4",
                "lleno"
              ],
              "status": "1/4"
            },
            {
              "id": "radio",
              "mostrar": "radio",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapetes",
              "mostrar": "tapetes",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapon_combustible",
              "mostrar": "tapon combustible",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapones_llantas",
              "mostrar": "tapones llantas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapones_motor",
              "mostrar": "tapones motor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tarjeta_de_circulacion",
              "mostrar": "tarjeta de circulacion",
              "opciones": [
                "si",
                "no"
              ],
              "status": "si"
            },
            {
              "id": "testigos_en_tablero",
              "mostrar": "testigos en tablero",
              "opciones": [
                "si",
                "no"
              ],
              "status": "no"
            },
            {
              "id": "triangulos_seguridad",
              "mostrar": "triangulos seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            }
          ],
          "cliente": "-NLS512d_ACSLeFE5r02",
          "detalles": [
            {
              "checado": false,
              "id": "Capo",
              "index": 0
            },
            {
              "checado": false,
              "id": "Paragolpes_frontal",
              "index": 1
            },
            {
              "checado": false,
              "id": "Paragolpes_posterior",
              "index": 2
            },
            {
              "checado": false,
              "id": "Techo",
              "index": 3
            },
            {
              "checado": false,
              "id": "espejo_derecho",
              "index": 4
            },
            {
              "checado": false,
              "id": "espejo_izquierdo",
              "index": 5
            },
            {
              "checado": false,
              "id": "faros_frontales",
              "index": 6
            },
            {
              "checado": false,
              "id": "faros_posteriores",
              "index": 7
            },
            {
              "checado": false,
              "id": "parabrisas_posterior",
              "index": 8
            },
            {
              "checado": false,
              "id": "paragolpes_frontal",
              "index": 9
            },
            {
              "checado": false,
              "id": "paragolpes_posterior",
              "index": 10
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_1",
              "index": 11
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_2",
              "index": 12
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_1",
              "index": 13
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_2",
              "index": 14
            },
            {
              "checado": false,
              "id": "puerta_posterior",
              "index": 15
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_1",
              "index": 16
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_2",
              "index": 17
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_1",
              "index": 18
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_2",
              "index": 19
            },
            {
              "checado": false,
              "id": "tirador_posterior",
              "index": 20
            }
          ],
          "diasSucursal": 195,
          "fechaPromesa": "12/1/2023",
          "fecha_entregado": "",
          "fecha_recibido": "10/1/2023",
          "formaPago": 1,
          "hora_entregado": "",
          "hora_recibido": "13:33:2",
          "iva": false,
          "margen": 25,
          "no_os": "CU0123GE00008",
          "reporte": {
            "descuento": 0,
            "iva": 0,
            "meses": 0,
            "mo": 0,
            "refacciones_a": 450,
            "refacciones_v": 562.5,
            "sobrescrito": 0,
            "sobrescrito_mo": 0,
            "sobrescrito_paquetes": 0,
            "sobrescrito_refaccion": 0,
            "subtotal": 562.5,
            "total": 562.5,
            "ub": 20
          },
          "servicio": 1,
          "servicios": [
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "enCatalogo": true,
              "id": "-NIXsW7Y5RzRrbI_F9dB",
              "index": 0,
              "marca": "Ford",
              "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
              "precio": 450,
              "status": true,
              "tipo": "refaccion",
              "total": 562.5
            }
          ],
          "status": "recibido",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NLS5GEDMnA0gVmS8iob"
        }
      },
      "-NLSJqiLdov_8LgUbzmJ": {
        "-NLSLVcG9jyrF_8ZtnYt": {
          "ckeckList": [
            {
              "id": "antena",
              "mostrar": "antena",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "birlo_seguridad",
              "mostrar": "birlo seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "bocinas",
              "mostrar": "bocinas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "botones_interiores",
              "mostrar": "botones interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "boxina_claxon",
              "mostrar": "boxina claxon",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "calefaccion",
              "mostrar": "calefaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "cenicero",
              "mostrar": "cenicero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "cristales",
              "mostrar": "cristales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "encendedor",
              "mostrar": "encendedor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "espejo_retorvisor",
              "mostrar": "espejo retorvisor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "espejos_laterales",
              "mostrar": "espejos laterales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "estuche_herramientas",
              "mostrar": "estuche herramientas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "extintor",
              "mostrar": "extintor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "gato",
              "mostrar": "gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "golpes_y_carroceria",
              "mostrar": "golpes y carroceria",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "instrumentos_tablero",
              "mostrar": "instrumentos tablero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "interiores",
              "mostrar": "interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "limpiadores",
              "mostrar": "limpiadores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "llanta_refaccion",
              "mostrar": "llanta refaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "llave_cruz",
              "mostrar": "llave cruz",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "llega_en_grua",
              "mostrar": "llega en grua",
              "opciones": [
                "si",
                "no"
              ],
              "status": "si"
            },
            {
              "id": "luces",
              "mostrar": "luces",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "maneral_gato",
              "mostrar": "maneral gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "manijas_interiores",
              "mostrar": "manijas interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "molduras_completas",
              "mostrar": "molduras completas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "nivel_gasolina",
              "mostrar": "nivel gasolina",
              "opciones": [
                "vacio",
                "1/4",
                "1/2",
                "3/4",
                "lleno"
              ],
              "status": "1/2"
            },
            {
              "id": "radio",
              "mostrar": "radio",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapetes",
              "mostrar": "tapetes",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapon_combustible",
              "mostrar": "tapon combustible",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapones_llantas",
              "mostrar": "tapones llantas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapones_motor",
              "mostrar": "tapones motor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tarjeta_de_circulacion",
              "mostrar": "tarjeta de circulacion",
              "opciones": [
                "si",
                "no"
              ],
              "status": "si"
            },
            {
              "id": "testigos_en_tablero",
              "mostrar": "testigos en tablero",
              "opciones": [
                "si",
                "no"
              ],
              "status": "no"
            },
            {
              "id": "triangulos_seguridad",
              "mostrar": "triangulos seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            }
          ],
          "cliente": "-NLSJqiLdov_8LgUbzmJ",
          "detalles": [
            {
              "checado": false,
              "id": "Capo",
              "index": 0
            },
            {
              "checado": false,
              "id": "Paragolpes_frontal",
              "index": 1
            },
            {
              "checado": false,
              "id": "Paragolpes_posterior",
              "index": 2
            },
            {
              "checado": false,
              "id": "Techo",
              "index": 3
            },
            {
              "checado": false,
              "id": "espejo_derecho",
              "index": 4
            },
            {
              "checado": false,
              "id": "espejo_izquierdo",
              "index": 5
            },
            {
              "checado": false,
              "id": "faros_frontales",
              "index": 6
            },
            {
              "checado": false,
              "id": "faros_posteriores",
              "index": 7
            },
            {
              "checado": false,
              "id": "parabrisas_posterior",
              "index": 8
            },
            {
              "checado": false,
              "id": "paragolpes_frontal",
              "index": 9
            },
            {
              "checado": false,
              "id": "paragolpes_posterior",
              "index": 10
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_1",
              "index": 11
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_2",
              "index": 12
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_1",
              "index": 13
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_2",
              "index": 14
            },
            {
              "checado": false,
              "id": "puerta_posterior",
              "index": 15
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_1",
              "index": 16
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_2",
              "index": 17
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_1",
              "index": 18
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_2",
              "index": 19
            },
            {
              "checado": false,
              "id": "tirador_posterior",
              "index": 20
            }
          ],
          "diasSucursal": 195,
          "fechaPromesa": "11/1/2023",
          "fecha_entregado": "",
          "fecha_recibido": "10/1/2023",
          "formaPago": 1,
          "hora_entregado": "",
          "hora_recibido": "14:23:23",
          "iva": true,
          "margen": 25,
          "no_os": "CU0123GE00009",
          "reporte": {
            "descuento": 0,
            "iva": 504,
            "meses": 0,
            "mo": 3150,
            "refacciones_a": 0,
            "refacciones_v": 0,
            "sobrescrito": 0,
            "sobrescrito_mo": 0,
            "sobrescrito_paquetes": 0,
            "sobrescrito_refaccion": 0,
            "subtotal": 3150,
            "total": 3653.9999999999995,
            "ub": 100
          },
          "servicio": 1,
          "servicios": [
            {
              "aprobado": true,
              "cantidad": 3,
              "costo": 0,
              "descripcion": "CAMBIO DE ACEITE\nCAMBIO DE FILTRO",
              "enCatalogo": true,
              "id": "-NE2JJZu_LtUYJXSBola",
              "index": 0,
              "nombre": "CAMBIO DE ACEITE Y FILTRO",
              "precio": 1050,
              "status": true,
              "tipo": "MO",
              "total": 3150
            }
          ],
          "status": "terminado",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "tecnico": "-NL1hTSnVq0ImKF7kCT7",
          "vehiculo": "-NLSJwWeFEuZSI9jaHnB"
        }
      },
      "-NLcE0c8GTpe9BHqzCl9": {
        "-NLcHvqQSAXltoOQvN4O": {
          "ckeckList": [
            {
              "id": "antena",
              "mostrar": "antena",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "birlo_seguridad",
              "mostrar": "birlo seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "bocinas",
              "mostrar": "bocinas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "botones_interiores",
              "mostrar": "botones interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "boxina_claxon",
              "mostrar": "boxina claxon",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "calefaccion",
              "mostrar": "calefaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "cenicero",
              "mostrar": "cenicero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "cristales",
              "mostrar": "cristales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "encendedor",
              "mostrar": "encendedor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "espejo_retorvisor",
              "mostrar": "espejo retorvisor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "espejos_laterales",
              "mostrar": "espejos laterales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "estuche_herramientas",
              "mostrar": "estuche herramientas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "extintor",
              "mostrar": "extintor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "gato",
              "mostrar": "gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "golpes_y_carroceria",
              "mostrar": "golpes y carroceria",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "instrumentos_tablero",
              "mostrar": "instrumentos tablero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "interiores",
              "mostrar": "interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "limpiadores",
              "mostrar": "limpiadores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "llanta_refaccion",
              "mostrar": "llanta refaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "llave_cruz",
              "mostrar": "llave cruz",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "llega_en_grua",
              "mostrar": "llega en grua",
              "opciones": [
                "si",
                "no"
              ],
              "status": "si"
            },
            {
              "id": "luces",
              "mostrar": "luces",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "maneral_gato",
              "mostrar": "maneral gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "manijas_interiores",
              "mostrar": "manijas interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "molduras_completas",
              "mostrar": "molduras completas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "nivel_gasolina",
              "mostrar": "nivel gasolina",
              "opciones": [
                "vacio",
                "1/4",
                "1/2",
                "3/4",
                "lleno"
              ],
              "status": "1/2"
            },
            {
              "id": "radio",
              "mostrar": "radio",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapetes",
              "mostrar": "tapetes",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapon_combustible",
              "mostrar": "tapon combustible",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapones_llantas",
              "mostrar": "tapones llantas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapones_motor",
              "mostrar": "tapones motor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tarjeta_de_circulacion",
              "mostrar": "tarjeta de circulacion",
              "opciones": [
                "si",
                "no"
              ],
              "status": "no"
            },
            {
              "id": "testigos_en_tablero",
              "mostrar": "testigos en tablero",
              "opciones": [
                "si",
                "no"
              ],
              "status": "no"
            },
            {
              "id": "triangulos_seguridad",
              "mostrar": "triangulos seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            }
          ],
          "cliente": "-NLcE0c8GTpe9BHqzCl9",
          "detalles": [
            {
              "checado": false,
              "id": "Capo",
              "index": 0
            },
            {
              "checado": false,
              "id": "Paragolpes_frontal",
              "index": 1
            },
            {
              "checado": false,
              "id": "Paragolpes_posterior",
              "index": 2
            },
            {
              "checado": false,
              "id": "Techo",
              "index": 3
            },
            {
              "checado": false,
              "id": "espejo_derecho",
              "index": 4
            },
            {
              "checado": false,
              "id": "espejo_izquierdo",
              "index": 5
            },
            {
              "checado": false,
              "id": "faros_frontales",
              "index": 6
            },
            {
              "checado": false,
              "id": "faros_posteriores",
              "index": 7
            },
            {
              "checado": false,
              "id": "parabrisas_posterior",
              "index": 8
            },
            {
              "checado": false,
              "id": "paragolpes_frontal",
              "index": 9
            },
            {
              "checado": false,
              "id": "paragolpes_posterior",
              "index": 10
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_1",
              "index": 11
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_2",
              "index": 12
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_1",
              "index": 13
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_2",
              "index": 14
            },
            {
              "checado": false,
              "id": "puerta_posterior",
              "index": 15
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_1",
              "index": 16
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_2",
              "index": 17
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_1",
              "index": 18
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_2",
              "index": 19
            },
            {
              "checado": false,
              "id": "tirador_posterior",
              "index": 20
            }
          ],
          "diasSucursal": 193,
          "fechaPromesa": "13/1/2023",
          "fecha_recibido": "12/1/2023",
          "formaPago": 1,
          "hora_recibido": "17:23:34",
          "iva": true,
          "margen": 25,
          "no_os": "CU0123GE000010",
          "reporte": {
            "descuento": 0,
            "iva": 24,
            "meses": 0,
            "mo": 150,
            "refacciones_a": 0,
            "refacciones_v": 0,
            "sobrescrito": 0,
            "sobrescrito_mo": 0,
            "sobrescrito_paquetes": 0,
            "sobrescrito_refaccion": 0,
            "subtotal": 150,
            "total": 174,
            "ub": 100
          },
          "servicio": 1,
          "servicios": [
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "enCatalogo": true,
              "id": "-NIXsiafAdRrmZsuD-fs",
              "index": 0,
              "nombre": "LAVAR CARROCERIA",
              "precio": 150,
              "status": true,
              "terminado": false,
              "tipo": "MO",
              "total": 150
            }
          ],
          "status": "recibido",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NLcHUz59SzQ6-NZhs0f"
        }
      },
      "-NMVmWPPwsDkW64EvmLQ": {
        "-NMVoXy552eDpoZLtLmf": {
          "ckeckList": [
            {
              "id": "antena",
              "mostrar": "antena",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "birlo_seguridad",
              "mostrar": "birlo seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "bocinas",
              "mostrar": "bocinas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "botones_interiores",
              "mostrar": "botones interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "boxina_claxon",
              "mostrar": "boxina claxon",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "calefaccion",
              "mostrar": "calefaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "cenicero",
              "mostrar": "cenicero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "cristales",
              "mostrar": "cristales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "encendedor",
              "mostrar": "encendedor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "espejo_retorvisor",
              "mostrar": "espejo retorvisor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "espejos_laterales",
              "mostrar": "espejos laterales",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "estuche_herramientas",
              "mostrar": "estuche herramientas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "extintor",
              "mostrar": "extintor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "gato",
              "mostrar": "gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "golpes_y_carroceria",
              "mostrar": "golpes y carroceria",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "instrumentos_tablero",
              "mostrar": "instrumentos tablero",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "interiores",
              "mostrar": "interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "limpiadores",
              "mostrar": "limpiadores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "llanta_refaccion",
              "mostrar": "llanta refaccion",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "llave_cruz",
              "mostrar": "llave cruz",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "llega_en_grua",
              "mostrar": "llega en grua",
              "opciones": [
                "si",
                "no"
              ],
              "status": "no"
            },
            {
              "id": "luces",
              "mostrar": "luces",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "maneral_gato",
              "mostrar": "maneral gato",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "manijas_interiores",
              "mostrar": "manijas interiores",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "molduras_completas",
              "mostrar": "molduras completas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "nivel_gasolina",
              "mostrar": "nivel gasolina",
              "opciones": [
                "vacio",
                "1/4",
                "1/2",
                "3/4",
                "lleno"
              ],
              "status": "1/4"
            },
            {
              "id": "radio",
              "mostrar": "radio",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "si"
            },
            {
              "id": "tapetes",
              "mostrar": "tapetes",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            },
            {
              "id": "tapon_combustible",
              "mostrar": "tapon combustible",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapones_llantas",
              "mostrar": "tapones llantas",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tapones_motor",
              "mostrar": "tapones motor",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "no"
            },
            {
              "id": "tarjeta_de_circulacion",
              "mostrar": "tarjeta de circulacion",
              "opciones": [
                "si",
                "no"
              ],
              "status": "no"
            },
            {
              "id": "testigos_en_tablero",
              "mostrar": "testigos en tablero",
              "opciones": [
                "si",
                "no"
              ],
              "status": "no"
            },
            {
              "id": "triangulos_seguridad",
              "mostrar": "triangulos seguridad",
              "opciones": [
                "si",
                "no",
                "dañado"
              ],
              "status": "dañado"
            }
          ],
          "cliente": "-NMVmWPPwsDkW64EvmLQ",
          "detalles": [
            {
              "checado": false,
              "id": "Capo",
              "index": 0
            },
            {
              "checado": false,
              "id": "Paragolpes_frontal",
              "index": 1
            },
            {
              "checado": false,
              "id": "Paragolpes_posterior",
              "index": 2
            },
            {
              "checado": false,
              "id": "Techo",
              "index": 3
            },
            {
              "checado": false,
              "id": "espejo_derecho",
              "index": 4
            },
            {
              "checado": false,
              "id": "espejo_izquierdo",
              "index": 5
            },
            {
              "checado": false,
              "id": "faros_frontales",
              "index": 6
            },
            {
              "checado": false,
              "id": "faros_posteriores",
              "index": 7
            },
            {
              "checado": false,
              "id": "parabrisas_posterior",
              "index": 8
            },
            {
              "checado": false,
              "id": "paragolpes_frontal",
              "index": 9
            },
            {
              "checado": false,
              "id": "paragolpes_posterior",
              "index": 10
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_1",
              "index": 11
            },
            {
              "checado": false,
              "id": "puerta_lateral_derecha_2",
              "index": 12
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_1",
              "index": 13
            },
            {
              "checado": false,
              "id": "puerta_lateral_izquierda_2",
              "index": 14
            },
            {
              "checado": false,
              "id": "puerta_posterior",
              "index": 15
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_1",
              "index": 16
            },
            {
              "checado": false,
              "id": "tirador_lateral_derecha_2",
              "index": 17
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_1",
              "index": 18
            },
            {
              "checado": false,
              "id": "tirador_lateral_izquierda_2",
              "index": 19
            },
            {
              "checado": false,
              "id": "tirador_posterior",
              "index": 20
            }
          ],
          "diasSucursal": 174,
          "fechaPromesa": "26/1/2023",
          "fecha_entregado": "",
          "fecha_recibido": "31/1/2023",
          "formaPago": 1,
          "hora_entregado": "",
          "hora_recibido": "16:25:9",
          "iva": true,
          "margen": 25,
          "no_os": "CU0123GE00013",
          "reporte": {
            "descuento": 0,
            "iva": 160,
            "meses": 0,
            "mo": 1000,
            "refacciones_a": 0,
            "refacciones_v": 0,
            "sobrescrito": 0,
            "sobrescrito_mo": 0,
            "sobrescrito_paquetes": 0,
            "sobrescrito_refaccion": 0,
            "subtotal": 1000,
            "total": 1160,
            "ub": 100
          },
          "servicio": 1,
          "servicios": [
            {
              "UB": "100.00",
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "elementos": [
                {
                  "cantidad": 1,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "enCatalogo": true,
                  "index": 0,
                  "nombre": "600",
                  "precio": 350,
                  "subtotal": 350,
                  "tipo": "MO",
                  "total": 350
                }
              ],
              "enCatalogo": true,
              "flotilla": 350,
              "id": "-NIsK5qJwfzE7e3Qn582",
              "index": 0,
              "marca": "Alfa Romeo",
              "modelo": "Giulia",
              "nombre": "nuevo paquete prueba",
              "precio": 350,
              "refacciones1": 0,
              "refacciones2": 0,
              "reporte": {
                "mo": 350,
                "refacciones": 0,
                "refacciones_v": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 350,
                "ub": 100
              },
              "reporte_interno": {
                "mo": 350,
                "refacciones": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "terminado": true,
              "tipo": "paquete",
              "total": 350,
              "totalMO": 350
            },
            {
              "UB": "100.00",
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "elementos": [
                {
                  "cantidad": "1",
                  "costo": 0,
                  "descripcion": "ninguna",
                  "enCatalogo": true,
                  "index": 0,
                  "nombre": "SCANEO POR COMPUTADORA",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                }
              ],
              "enCatalogo": true,
              "flotilla": 300,
              "id": "-NIrjPCMIRGHbzy5cbJ_",
              "index": 1,
              "marca": "Alfa Romeo",
              "modelo": "Giulia",
              "nombre": "nuwvo",
              "precio": 300,
              "refacciones1": 0,
              "refacciones2": 0,
              "reporte": {
                "mo": 300,
                "refacciones": 0,
                "refacciones_v": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 300,
                "ub": 100
              },
              "reporte_interno": {
                "mo": 300,
                "refacciones": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "terminado": true,
              "tipo": "paquete",
              "total": 300,
              "totalMO": 300
            },
            {
              "UB": "100.00",
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "elementos": [
                {
                  "cantidad": 1,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "enCatalogo": true,
                  "index": 0,
                  "nombre": "600",
                  "precio": 350,
                  "subtotal": 350,
                  "tipo": "MO",
                  "total": 350
                }
              ],
              "enCatalogo": true,
              "flotilla": 350,
              "id": "-NIsRgZ4mMSMpLFyD8V4",
              "index": 2,
              "marca": "Alfa Romeo",
              "modelo": "Giulia",
              "nombre": "juanMT",
              "precio": 350,
              "refacciones1": 0,
              "refacciones2": 0,
              "reporte": {
                "mo": 350,
                "refacciones": 0,
                "refacciones_v": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 350,
                "ub": 100
              },
              "reporte_interno": {
                "mo": 350,
                "refacciones": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "terminado": true,
              "tipo": "paquete",
              "total": 350,
              "totalMO": 350
            }
          ],
          "status": "terminado",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "tecnico": "-NL1hTSnVq0ImKF7kCT7",
          "vehiculo": "-NMVmoTpk_8R3NpybQlB"
        }
      },
      "-NQgAgmAXe7P7GVPeHtw": {
        "-NQgGARQXmplGMfE9hXV": {
          "cliente": "-NQgAgmAXe7P7GVPeHtw",
          "diasSucursal": 130,
          "fechaPromesa": "17/3/2023",
          "fecha_recibido": "16/3/2023",
          "formaPago": 1,
          "hora_recibido": "15:12:52",
          "iva": true,
          "margen": 25,
          "no_os": "CU0323GE00017",
          "reporte": {
            "descuento": 0,
            "iva": 512,
            "meses": 0,
            "mo": 0,
            "refacciones_a": 0,
            "refacciones_v": 0,
            "sobrescrito": 3200,
            "sobrescrito_mo": 0,
            "sobrescrito_paquetes": 3200,
            "sobrescrito_refaccion": 0,
            "subtotal": 3200,
            "total": 3711.9999999999995,
            "ub": -45.3125
          },
          "servicio": 1,
          "servicios": [
            {
              "UB": "",
              "aprobado": true,
              "cantidad": 1,
              "cilindros": "4",
              "costo": 3200,
              "desgloce": "",
              "elementos": [
                {
                  "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 0,
                  "nombre": "CAMBIO DE ACEITE Y FILTRO",
                  "precio": 120,
                  "subtotal": 120,
                  "tipo": "MO",
                  "total": 120
                },
                {
                  "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 1,
                  "nombre": "REEMPLAZAR FILTRO DE AIRE",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 2,
                  "nombre": "REV. Y CORREGIR NIVELES",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 3,
                  "nombre": "LAVAR INYECTORES",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "C",
                  "index": 4,
                  "nombre": "LAVAR CPO DE ACELERACION",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 5,
                  "nombre": "SCANEO POR COMPUTADORA",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 6,
                  "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 7,
                  "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 8,
                  "nombre": "ROTACION DE LLANTAS",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 9,
                  "nombre": "REGIMEN DE CARGA DE BATERIA",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 10,
                  "nombre": "LAVAR MOTOR",
                  "precio": 150,
                  "subtotal": 150,
                  "tipo": "MO",
                  "total": 150
                },
                {
                  "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 11,
                  "nombre": "LAVAR CARROCERIA",
                  "precio": 150,
                  "subtotal": 150,
                  "tipo": "MO",
                  "total": 150
                },
                {
                  "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 12,
                  "nombre": "REEMPLAZAR BUJIAS",
                  "precio": 300,
                  "subtotal": 300,
                  "tipo": "MO",
                  "total": 300
                }
              ],
              "enCatalogo": true,
              "flotilla": 3200,
              "flotilla2": "$  3,200.00",
              "id": "",
              "index": 0,
              "marca": "Ford",
              "modelo": "Fiesta",
              "nombre": "SERVICIO MAYOR",
              "normal": "$  4,160.00",
              "precio": 3420,
              "reporte": {
                "mo": 3420,
                "refacciones": 0,
                "refacciones_v": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 3420,
                "ub": 100
              },
              "reporte_interno": {
                "mo": 3420,
                "refacciones": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "Aprobado",
              "status": "aprobado",
              "subtotal": "",
              "tipo": "paquete",
              "total": 3200
            },
            {
              "UB": "",
              "aprobado": "",
              "cantidad": 1,
              "cilindros": "",
              "costo": 7800,
              "desgloce": "",
              "enCatalogo": "",
              "flotilla": 7800,
              "flotilla2": "$  7,800.00",
              "id": "-NQgBXpNofrC9fYVkVly",
              "index": 1,
              "marca": "",
              "modelo": "",
              "nombre": "amortiguadores delanteros",
              "normal": "$  10,140.00",
              "precio": 0,
              "reporte": {
                "mo": 0,
                "refacciones": 0,
                "refacciones_v": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 0
              },
              "reporte_interno": {
                "mo": 0,
                "refacciones": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "No aprobado",
              "status": "noAprobado",
              "subtotal": "",
              "tipo": "paquete",
              "total": 7800
            },
            {
              "aprobado": false,
              "cantidad": 1,
              "costo": 1850,
              "descripcion": "",
              "enCatalogo": true,
              "flotilla": 1850,
              "flotilla2": "$  1,850.00",
              "id": "-NQgBwClFOvNip529MeL",
              "index": 2,
              "marca": "",
              "nombre": "valvula iac",
              "normal": "$  2,405.00",
              "precio": 900,
              "showStatus": "No aprobado",
              "status": "noAprobado",
              "subtotal": 1850,
              "tipo": "refaccion",
              "total": 2312.5
            },
            {
              "aprobado": false,
              "cantidad": 1,
              "costo": 2800,
              "descripcion": "",
              "enCatalogo": true,
              "flotilla": 2800,
              "flotilla2": "$  2,800.00",
              "id": "-NQgCtXfrQ0HY4_WmA9E",
              "index": 3,
              "marca": "",
              "nombre": "reemplazar caliper",
              "normal": "$  3,640.00",
              "precio": 1300,
              "showStatus": "No aprobado",
              "status": "noAprobado",
              "subtotal": 2800,
              "tipo": "refaccion",
              "total": 3500
            }
          ],
          "status": "recibido",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NQgB6OV3TgsdvV1NPNL"
        },
        "-NQgHasoi4hOw2wdQ1eB": {
          "cliente": "-NQgAgmAXe7P7GVPeHtw",
          "diasSucursal": 130,
          "fechaPromesa": "16/3/2023",
          "fecha_recibido": "16/3/2023",
          "formaPago": 1,
          "hora_recibido": "15:19:6",
          "iva": true,
          "margen": 25,
          "no_os": "CU0323GE00018",
          "reporte": {
            "descuento": 0,
            "iva": 0,
            "meses": 0,
            "mo": 0,
            "refacciones_a": 0,
            "refacciones_v": 0,
            "sobrescrito": 0,
            "sobrescrito_mo": 0,
            "sobrescrito_paquetes": 0,
            "sobrescrito_refaccion": 0,
            "subtotal": 0,
            "total": 0,
            "ub": 0
          },
          "servicio": 1,
          "servicios": [
            {
              "aprobado": false,
              "cantidad": 1,
              "cilindros": "4",
              "costo": 3200,
              "elementos": [
                {
                  "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 0,
                  "nombre": "CAMBIO DE ACEITE Y FILTRO",
                  "precio": 120,
                  "tipo": "MO",
                  "total": 120
                },
                {
                  "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 1,
                  "nombre": "REEMPLAZAR FILTRO DE AIRE",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 2,
                  "nombre": "REV. Y CORREGIR NIVELES",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 3,
                  "nombre": "LAVAR INYECTORES",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "C",
                  "index": 4,
                  "nombre": "LAVAR CPO DE ACELERACION",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 5,
                  "nombre": "SCANEO POR COMPUTADORA",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 6,
                  "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 7,
                  "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 8,
                  "nombre": "ROTACION DE LLANTAS",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 9,
                  "nombre": "REGIMEN DE CARGA DE BATERIA",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                },
                {
                  "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 10,
                  "nombre": "LAVAR MOTOR",
                  "precio": 150,
                  "tipo": "MO",
                  "total": 150
                },
                {
                  "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "N",
                  "index": 11,
                  "nombre": "LAVAR CARROCERIA",
                  "precio": 150,
                  "tipo": "MO",
                  "total": 150
                },
                {
                  "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                  "cantidad": 1,
                  "catalogo": true,
                  "costo": 0,
                  "descripcion": "ninguna",
                  "index": 12,
                  "nombre": "REEMPLAZAR BUJIAS",
                  "precio": 300,
                  "tipo": "MO",
                  "total": 300
                }
              ],
              "enCatalogo": true,
              "flotilla": 3200,
              "flotilla2": "$  3,200.00",
              "index": 0,
              "marca": "Ford",
              "modelo": "Fiesta",
              "nombre": "SERVICIO MAYOR",
              "normal": "$  4,160.00",
              "precio": 3420,
              "reporte": {
                "mo": 3420,
                "refacciones": 0,
                "refacciones_v": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0,
                "total": 3420,
                "ub": 100
              },
              "reporte_interno": {
                "mo": 3420,
                "refacciones": 0,
                "sobrescrito_mo": 0,
                "sobrescrito_refaccion": 0
              },
              "showStatus": "No aprobado",
              "status": "noAprobado",
              "tipo": "paquete",
              "total": 3200
            }
          ],
          "status": "terminado",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NQgB6OV3TgsdvV1NPNL"
        }
      }
    }
    const nueva = {...answer}

    Object.entries(nueva).forEach(([key, entrie])=>{
      const nuevas_entries = this._publicos.crearArreglo2(entrie)
      nuevas_entries.forEach(entri_=>{
        obtenidos.push(entri_)
      })
    })
    
    return obtenidos
  }

}



