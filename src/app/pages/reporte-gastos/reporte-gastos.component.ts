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
  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private _export: ExporterService, private _sucursales: SucursalesService, private _cotizaciones: CotizacionesService, private _campos: CamposSystemService) { }
  ROL:string; SUCURSAL:string

  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  metodospago       =   [ ...this._cotizaciones.metodospago  ]
  sucursales_array  =   [ ...this._sucursales.lista_en_duro_sucursales  ]

  paquete: string = this._campos.paquete
  refaccion: string = this._campos.refaccion
  mo: string = this._campos.mo
  miniColumnas:number = this._campos.miniColumnas

  
  gastosOperacion_arr = []
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
  elementosAdministracion = ['id','sucursalShow','no_os','fecha_recibido','fecha_entregado','total','cliente','formaPago']; //elementos
  columnsToDisplayWithExpandAdministracion = [...this.elementosAdministracion, 'opciones', 'expand']; //elementos
  // expandedElement: any | null; //elementos
  @ViewChild('AdministracionPaginator') paginatorAdministracion: MatPaginator //elementos
  @ViewChild('Administracion') sortAdministracion: MatSort //elementos


  reporte = {operacion:0, gastos:0, pagos:0, depositos:0,sobrante:0}
  reporteAdministracion = {
    iva:0, refacciones:0, total:0, subtotal:0, operacion:0, cantidad:0,
    margen:0, por_margen:0
  }

  camposReporte = [
    {valor:'depositos', show:'Depositos'},
    // {valor:'pagos', show:'Pagos'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'gastos', show:'Gastos de ordenes'},
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
  tiempoReal: true
  realizaGasto:string = null
  sucursalFiltro: string = 'Todas'
  sucursalFiltroShow: string = 'Todas'
  HOY:Date = this._publicos.resetearHoras(new Date()); 
  rangeReporteGastos = new FormGroup({
    start: new FormControl(this.HOY),
    end: new FormControl(this.HOY),
  });
  rangeAdministracion = new FormGroup({
    start: new FormControl(this.HOY),
    end: new FormControl(this.HOY),
  });
  fechas_get = {inicio:this._publicos.resetearHoras(this.HOY), final: this._publicos.resetearHoras(this.HOY)}
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
 
  ngOnInit(): void {
    this.rol()
  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal

    this.sucursalFiltro = (this.SUCURSAL === 'Todas') ? 'Todas' : this.SUCURSAL
    this.sucursalFiltroReporte = (this.SUCURSAL === 'Todas') ? 'Todas' : this.SUCURSAL

    this.funcionesNueva()
    this.gastosDiarios()
    this.gastosOperacion()
    this.ordenesServicios()
  }

  gastosDiarios(){
    const starCountRef = ref(db, `gastosDiarios`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let nuevosGO = []
        const gastosDiarios= this._publicos.crearArreglo(snapshot.val())
        gastosDiarios.forEach(go=>{
          const clavesDias = Object.keys(go)
          clavesDias.forEach(d=>{
            const nuevosD = this._publicos.crearArreglo2(go[d])
            // const nuevosD = this._publicos.crearArreglo2(go[d] || [])
            nuevosD.forEach(registro=>{
              if(registro.fecha_registro){
                registro.fechaCompara = this._publicos.construyeFechaString(registro.fecha_registro)
              }
              const {sucursal} = this.sucursales_array.find(s=>s.id === registro.sucursal)
              registro.sucursalShow = sucursal,
              // registro.tipo = 'diario'
              nuevosGO.push(registro)
            })
          })
        })
        const filtro = (this.SUCURSAL === 'Todas') ? nuevosGO : nuevosGO.filter(g=>g.sucursal === this.SUCURSAL)
        this.gastosDiarios_arr = filtro
        // console.log('gastosDiarios_arr',filtro.length);
        setTimeout(() => {
          this.unirResultados()
        }, 500);
        
      }
    }, {
        onlyOnce: this.tiempoReal
      })
  }
  gastosOperacion(){
    const starCountRef = ref(db, `HistorialGastosOperacion`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let gastosOperacion = []
        const gastosOp = this._publicos.crearArreglo2(snapshot.val())
        gastosOp.forEach(go=>{
          const {sucursal} = this.sucursales_array.find(s=>s.id === go.sucursal)
          go.sucursalShow = sucursal
          go.tipo = 'operacion'
          // go.fechaCompara = this._publicos.construyeFechaString(go.fecha)
          go.fechaCompara = this._publicos.construyeFechaString(go.fecha_registro)
          go.fecha_registro_compara = this._publicos.construyeFechaString(go.fecha_registro)
          gastosOperacion.push(go)
        })        
        const filtro = (this.SUCURSAL === 'Todas') ? gastosOperacion : gastosOperacion.filter(g=>g.sucursal === this.SUCURSAL)
        this.gastosOperacion_arr = filtro
        
        // console.log('gastosOperacion_arr',filtro.length);
        setTimeout(() => {
          this.unirResultados()
        }, 500);
      }
    }, {
        onlyOnce: this.tiempoReal
      })
  }
  ordenesServicios(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let recepciones= this._publicos.crearArreglo2(snapshot.val())
        // HistorialGastos
        // HistorialPagos
        let aquiDocumentos = []
        recepciones.map(os=>{
          
          os.hitorial_gastos = (os.HistorialGastos) ? this._publicos.crearArreglo2(os.HistorialGastos) : []
          os.historial_pagos = (os.HistorialPagos) ? this._publicos.crearArreglo2(os.HistorialPagos) : []

          os.historial_pagos.map(element => {
            element.tipoNuevo = 'pago'
          });
          let totalGastosOrden = 0
          os.hitorial_gastos.map(element => {
            element.tipoNuevo = 'gasto'
            totalGastosOrden += element.monto
          });
          const mitad = os.reporte.total / 2
          os.totalGastosOrden = totalGastosOrden
          os.advertencia = ( totalGastosOrden > mitad) ? 'Cuidado' : 'Se ve bien!'

          const nuevosHistoriales = os.hitorial_gastos.concat(os.historial_pagos)
          nuevosHistoriales.forEach(histo => {
            histo.fechaCompara = this._publicos.construyeFechaString(histo.fecha_registro)
            
            const {sucursal} = this.sucursales_array.find(s=>s.id === histo.sucursal)
            histo.sucursalShow = sucursal
            histo.no_os = os.no_os
            histo.vehiculo = os.vehiculo
            histo.reporte = os.reporte
            histo.statusOrden = os.status
            histo.advertencia =  os.advertencia
            histo.totalOrden =  os.reporte.total
            histo.totalGastosOrden = os.totalGastosOrden
            aquiDocumentos.push(histo)
          });
          if(os.status === 'entregado'){
            os.fecha_entregado_compara = this._publicos.construyeFechaString(os.fecha_entregado)
          }
          if(os.fecha_recibido){
            os.fecha_recibido_compara = this._publicos.construyeFechaString(os.fecha_recibido)
          }
          const {sucursal} = this.sucursales_array.find(s=>s.id === os.sucursal.id)
          os.sucursalShow = sucursal
          os.reporte = this._publicos.realizarOperaciones_2(os).reporte
        })         
        
        const filtro = (this.SUCURSAL === 'Todas') ? aquiDocumentos : aquiDocumentos.filter(os=>os.sucursal === this.SUCURSAL)
        // console.log(filtro);
        this.listaos_arr = (this.SUCURSAL === 'Todas') ? recepciones : recepciones.filter(os=>os.sucursal.id === this.SUCURSAL)
        // console.log(this.listaos_arr);
        
        // this.operacionesAdmin()
        
        this.pagosGastosOP_arr = filtro
        // console.log('pagosGastosOP_arr',filtro.length);
        setTimeout(() => {
          this.unirResultados()
        }, 500);
        
      } else {
        console.log("No data available");
      }
    }, {
        onlyOnce: this.tiempoReal
    })
  }
  unirResultados(){
    // const informa = this.gastosOperacion_arr.concat( this.gastosDiarios_arr ).concat( this.pagosGastosOP_arr )    
    const informa = [...this.gastosOperacion_arr, ...this.gastosDiarios_arr, ...this.pagosGastosOP_arr];
    informa.forEach(con => {
      con.no_os = con.no_os || '';
    });
    this.listaConjunta_arr = informa
    this.realizarOperaciones()
    this.operacionesAdmin()
  }
  realizarOperaciones(){
    const resultados = this.listaConjunta_arr
      .map((a,index) => {
        const { show } = this.metodospago.find(m => m.valor === String(a.metodo))
        a.metodoShow = show
        return a
      })
      .filter(a => a.fechaCompara >= this.fechas_get.inicio && a.fechaCompara <= this.fechas_get.final)
      const reporte_general =  {operacion:0, gastos:0, pagos:0, depositos:0,sobrante:0}

      const nuevos = (this.sucursalFiltroReporte === 'Todas') ? resultados : resultados.filter(r=>r.sucursal === this.sucursalFiltroReporte)
      nuevos.map((f,index)=>{
        f.index = index
        f.referencia = (f.referencia) ? f.referencia : ''
        if (f.tipo === 'deposito' || f.tipo === 'sobrante') reporte_general.depositos += f.monto 
        if (f.tipo === 'operacion') reporte_general.operacion += f.monto;
        if(f.tipo !== 'sobrante'){
          (f.tipoNuevo === 'gasto') ? reporte_general.gastos += f.monto : reporte_general.pagos += f.monto
        }
        
      })
    
      
      reporte_general.sobrante = (reporte_general.depositos) -  (reporte_general.gastos + reporte_general.operacion)
      this.reporte = reporte_general

      const _f1 = this.fechas_get.inicio
      const _f2 = this.fechas_get.final
      if ((_f1.getTime() === _f2.getTime()) && (this.HOY.getTime() === _f1.getTime())) {
        const filtro2 = this.pagosGastosOP_arr.filter(a => {
          return (a.fechaCompara >= _f1 && a.fechaCompara <= _f1) && a.sucursal === this.sucursalFiltroReporte;
        });
        const filtro_op = this.gastosOperacion_arr.filter(a => {
          return (a.fechaCompara >= _f1 && a.fechaCompara <= _f1) && a.sucursal === this.sucursalFiltroReporte;
        });
        const unico_dia = filtro2.filter(a => {
          return a.fechaCompara >= _f1 && a.fechaCompara <= _f1
        });
        const filtro_resultados = this.nuevo_gastosDiarios.filter(a => {
          return a.fechaCompara >= _f1 && a.fechaCompara <= _f1
        });

        let sobrante = 0
      const reporte =  {operacion:0, gastos:0, depositos:0,sobrante:0}
      unico_dia.forEach(f=>{
        if (f.tipoNuevo === 'gasto' && f.tipo ==='orden') reporte.gastos += f.monto 
      })
      filtro_resultados.forEach(f=>{
        if (f.tipo === 'deposito') reporte.depositos += f.monto 
        if (f.tipo === 'sobrante') reporte.sobrante += f.monto 
      })
      filtro_op.forEach(f=>{
        reporte.operacion += f.monto 
      })

      if (reporte.sobrante > 0) {
        sobrante = (reporte.depositos +  reporte.sobrante ) - (reporte.gastos + reporte.operacion)
      }else{
        sobrante = reporte.depositos  - (reporte.gastos + reporte.operacion + Math.abs(reporte.sobrante))
      }

      const fechaSobrante = this._publicos.sumarRestarDiasFecha(_f1,1)
      
      if(this.sucursalFiltroReporte !== 'Todas'){
        const tempData = {
          concepto: 'Sobrante del dia anterior',
          fecha_registro: this._publicos.formatearFecha(fechaSobrante, true),
          hora: '00:00:00',
          metodo: '1',
          monto: sobrante,
          sucursal: this.sucursalFiltroReporte,
          tipo: 'sobrante',
          status:true
        }
        if(!this._publicos.esDomingo(fechaSobrante)){
         
            const ruta =`gastosDiarios/${this.sucursalFiltroReporte}/${this._publicos.formatearFecha(fechaSobrante,false)}/sobrante`
            const updates = { [ruta] : tempData};
            // updates[ruta] = tempData;
            update(ref(db), updates)
        }else{
          //le sumamos dos dias en caso de que sea sabado y el sobrante se quiera registrar el domingo
          const nueva = this._publicos.sumarRestarDiasFecha(fechaSobrante,1)
          tempData.fecha_registro = this._publicos.formatearFecha(nueva, true)  
            const ruta =`gastosDiarios/${this.sucursalFiltroReporte}/${this._publicos.formatearFecha(nueva,false)}/sobrante`
            const updates = { [ruta] : tempData};
            update(ref(db), updates)
        }
      }
      
      }
      this.dataSource.data = this._publicos.ordenarData(nuevos,'fechaCompara',true)
      this.newPagination('reporte')
  }
  cambiosFechas(donde:string){
    const {start, end} = (donde === 'admin') ? this.rangeAdministracion.value : this.rangeReporteGastos.value
    if (start && end) {
      if (start['_d'] && end['_d']) {
        const fechaAsigan = {inicio: this._publicos.resetearHoras(start['_d']), final: this._publicos.resetearHoras(end['_d'])}
        if(donde === 'admin'){
          this.fechas_getAdministracion = fechaAsigan
          this.operacionesAdmin();
        }else{
          this.fechas_get = fechaAsigan
          this.unirResultados()
        }
      }
    }
  }
  operacionesAdmin(){

    const reporteEND = {iva:0, refacciones:0, total:0, subtotal:0, operacion:0, cantidad:0,margen:0, por_margen:0}
    const filtrarEntregados = this.listaos_arr.filter(r=>r.status === 'entregado')
    
    const filtrosSucursal = (this.sucursalFiltro === 'Todas') ? filtrarEntregados :  filtrarEntregados.filter(os=>os.sucursal.id === this.sucursalFiltro )

    const gastosFechas = filtrosSucursal.filter(a => a.fecha_entregado_compara >= this.fechas_getAdministracion.inicio && a.fecha_entregado_compara <= this.fechas_getAdministracion.final)
    gastosFechas.map((g,index)=>{
      g.index = index
      const {cliente, reporte} = g
      g.total = reporte.total
      g.clienteShow = `${cliente.nombre} ${cliente.apellidos}`
      const { show } = this.metodospago.find(m=>m.valor === String(g.formaPago))
      g.formaPagoShow = show
    })
    this.dataSourceAdministracion.data = gastosFechas
    this.newPagination('admin')
    gastosFechas.forEach(os=>{
       os.hitorial_gastos.forEach(gasto => {

        // if(gasto.status ) reporteEND.gastosmoRefacciones += gasto.monto
      });
      const {reporte} = os
      const {subtotal, total, iva} = reporte
      reporteEND.subtotal  += subtotal
      reporteEND.total     += total
      if(os.iva){
        reporteEND.iva     += iva
      }
    })

    const Cerradas = gastosFechas.filter(c=>c.status === 'entregado')
    // console.log(Cerradas.length);
    // console.log(Cerradas);
    Cerradas.forEach(os=>{
      os.hitorial_gastos.forEach(gasto => {
        if(gasto.status && gasto.gasto_tipo === 'refaccion') reporteEND.refacciones += gasto.monto
      })
    })
    //margen de la ordenes cerradas
    reporteEND.margen = reporteEND.total - reporteEND.refacciones
    //porcentaje de margen
    reporteEND.por_margen = (reporteEND.margen / reporteEND.total) * 100

    const gastosOperacionFechas = this.gastosOperacion_arr.filter(a => a.fecha_registro_compara >= this.fechas_getAdministracion.inicio && a.fecha_registro_compara <= this.fechas_getAdministracion.final)

    // const filtrosSucursal2 = (this.sucursalFiltro !== this.SUCURSAL) ? gastosOperacionFechas :  gastosOperacionFechas.filter(os=>os.sucursal.id === this.sucursalFiltro )
    gastosOperacionFechas.forEach(element => {
      if(element.status) reporteEND.operacion += element.monto
    });
    reporteEND.cantidad = Cerradas.length
    // reporteEND.libreSinIVA = reporteEND.subtotal - reporteEND.gastosmoRefacciones
    // reporteEND.libreIva = reporteEND.total - (reporteEND.gastosmoRefacciones)
    // reporteEND.libre_neto = reporteEND.total - (reporteEND.gastosmoRefacciones + reporteEND.operacion)


    // reporteEND.libre_neto_sin_iva = reporteEND.subtotal - (reporteEND.gastosmoRefacciones + reporteEND.operacion)
    // reporteEND.libre_neto_con_iva = reporteEND.total - (reporteEND.gastosmoRefacciones + reporteEND.operacion)

    this.reporteAdministracion = reporteEND
  }

  generaReporteExcelReporteGastos(){
    if(this.dataSource.data){
      // console.log(this.dataSource.data);
      this._export.generaReporteGastosExcel(this.dataSource.data, this.reporte)
      
    }else{
      this._publicos.swalToastError('No hay ningun dato')
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
funcionesNueva(){
    const starCountRef = ref(db, `gastosDiarios/${this.sucursalBarrido}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const nuevos = snapshot.val()
        const ids = Object.keys(snapshot.val())
        let resultados = []
        ids.forEach(id => {
          const internos = this._publicos.crearArreglo2(nuevos[id])
          internos.forEach(t=>{
            t.fechaCompara = this._publicos.construyeFechaString(t.fecha_registro)
            resultados.push(t)
          })
        });        
        this.nuevo_gastosDiarios = resultados
        setTimeout(() => {
          this.unirResultados()
        }, 500);
      }
    })
  
  
}
  ///extras
  RealizaBarridoDia(){
    if(this.fechaBarrido && this.sucursalBarrido){
      const fechaInicio = this._publicos.sumarRestarDiasFecha(this.fechaBarrido,0)
      const fechaActual = this._publicos.reseteaHoras(new Date())
      const diffTiempo = fechaActual.getTime() - fechaInicio.getTime();
      const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
      
      for (let i = 0; i <= diffDias; i++) {
        const fechaImprimir = new Date(fechaInicio.getTime() + i * 24 * 60 * 60 * 1000);
        const dia = this._publicos.sumarRestarDiasFecha(fechaImprimir,0)
        

        if(this._publicos.esDomingo(dia)){

        }else{
          const filtro2 = this.pagosGastosOP_arr.filter(a => {
            return (a.fechaCompara >= dia && a.fechaCompara <= dia) && a.sucursal === this.sucursalBarrido;
          });
          const filtro_op = this.gastosOperacion_arr.filter(a => {
            return (a.fechaCompara >= dia && a.fechaCompara <= dia) && a.sucursal === this.sucursalBarrido;
          });
          const unico_dia = filtro2.filter(a => {
            return a.fechaCompara >= dia && a.fechaCompara <= dia
          });
          const filtro_resultados = this.nuevo_gastosDiarios.filter(a => {
            return a.fechaCompara >= dia && a.fechaCompara <= dia
          });
  
          let sobrante = 0
        const reporte =  {operacion:0, gastos:0, depositos:0,sobrante:0}
        unico_dia.forEach(f=>{
          if (f.tipoNuevo === 'gasto' && f.tipo ==='orden') reporte.gastos += f.monto 
        })
        filtro_resultados.forEach(f=>{
          if (f.tipo === 'deposito') reporte.depositos += f.monto 
          if (f.tipo === 'sobrante') reporte.sobrante += f.monto 
        })
        filtro_op.forEach(f=>{
          reporte.operacion += f.monto 
        })

        if (reporte.sobrante > 0) {
          sobrante = (reporte.depositos +  reporte.sobrante ) - (reporte.gastos + reporte.operacion)
        }else{
          sobrante = reporte.depositos  - (reporte.gastos + reporte.operacion + Math.abs(reporte.sobrante))
        }
        
        const fechaSobrante = this._publicos.sumarRestarDiasFecha(dia,1)
        const tempData = {
                concepto: 'Sobrante del dia anterior',
                fecha_registro: this._publicos.formatearFecha(fechaSobrante, true),
                hora: '00:00:00',
                metodo: '1',
                monto: sobrante,
                sucursal: this.sucursalBarrido,
                tipo: 'sobrante',
                status:true
              }
              if(!this._publicos.esDomingo(fechaSobrante)){
               
                  const ruta =`gastosDiarios/${this.sucursalBarrido}/${this._publicos.formatearFecha(fechaSobrante,false)}/sobrante`
                  const updates = { [ruta] : tempData};
                  // updates[ruta] = tempData;
                  update(ref(db), updates)
              }else{
                //le sumamos dos dias en caso de que sea sabado y el sobrante se quiera registrar el domingo
                const nueva = this._publicos.sumarRestarDiasFecha(fechaSobrante,1)
                tempData.fecha_registro = this._publicos.formatearFecha(nueva, true)  
                  const ruta =`gastosDiarios/${this.sucursalBarrido}/${this._publicos.formatearFecha(nueva,false)}/sobrante`
                  const updates = { [ruta] : tempData};
                  update(ref(db), updates)
              }
        }
        
        
      }
    }
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // this.events.push(`${type}: ${event.value}`);
    // console.log(event.value);
    const fecha = event.value
    if (fecha) {
      if(fecha['_d'] ){
        this.fechaBarrido = fecha['_d']
        this.funcionesNueva()
      }else{
        this.fechaBarrido = null
      }
    }else{
      this.fechaBarrido = null
    }
    
  }

}



