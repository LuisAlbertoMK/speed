import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import { getDatabase, onValue, ref, update } from "firebase/database";

//paginacion

import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { AutomaticosService } from 'src/app/services/automaticos.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { CamposSystemService } from 'src/app/services/campos-system.service';

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
  
  constructor(
    private _security:EncriptadoService,private _publicos: ServiciosPublicosService, private _automaticos: AutomaticosService,
    private _reporte_gastos: ReporteGastosService, private _sucursales: SucursalesService, private _export: ExporterService,
    private _campo: CamposSystemService) { 
        const currentYear = new Date().getFullYear();
        // this.minDate = new Date(currentYear , 0, 1);
        // this.maxDate = new Date(currentYear , 11, 31);
      }
  _rol:string
  _sucursal:string
  _usuario:string

  miniColumnas:number = 100

  fechas_filtro = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  fecha_formateadas = {start:new Date(), end:new Date() }
  hora_start = '00:00:01';
  hora_end = '23:59:59';

  reporte = {deposito: 0, operacion: 0, sobrante:0, orden:0, restante:0}

  camposReporte = [
    {valor:'deposito', show:'Depositos'},
    {valor:'sobrante', show:'Suma de sobrantes'},
    {valor:'operacion', show:'Gastos de operación'},
    {valor:'orden', show:'Gastos de ordenes'},
    {valor:'restante', show:'Sobrante del dia'},
  ]

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['sucursalShow','no_os','metodoShow','status','monto','tipo','fecha']; //elementos
  columnsToDisplayWithExpand = [...this.elementos,'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  sucursales_array = [...this._sucursales.lista_en_duro_sucursales]

  filtro_sucursal:string

  realizaGasto:string = 'gasto'

  objecto_actual:any ={}
  objecto_actuales:any = {
    recepciones:{},
    historial_gastos_orden:{},
    historial_pagos_orden:{},
   }
   campo_vigilar = [
    'recepciones',
    'historial_gastos_orden',
    'historial_pagos_orden',
  ]

  gastos_diarios_table = []
  ngOnInit(): void {
    this.rol()
    this.vigila_calendario()
    // this.resetea_horas_admin()
  }
  
  rol(){
    const { rol, sucursal, usuario} = this._security.usuarioRol()
    this._rol = rol
    this._sucursal = sucursal
    this._usuario = usuario
    this.filtro_sucursal = sucursal
    // this.vigila_hijo()
    this.primer_comprobacion_resultados_multiple()
  }
  comprobacion_resultados_multiple(campo){
    const objecto_recuperdado = this._publicos.revision_cache(campo)
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actuales[campo], objecto_recuperdado);
  }
  primer_comprobacion_resultados_multiple(){
    this.campo_vigilar.forEach(campo_vigila=>{
      this.asiganacion_resultados_multiples(campo_vigila)
    })
    this.segundo_llamado_multiple()
  }
  segundo_llamado_multiple(){
    setInterval(()=>{
      this.campo_vigilar.forEach(campo_vigila=>{
        if (!this.comprobacion_resultados_multiple(campo_vigila)) {
          console.log(`recuperando data ${campo_vigila}`);
          this.objecto_actuales[campo_vigila] = this._publicos.crear_new_object(this._publicos.revision_cache(campo_vigila))
          this.asiganacion_resultados_multiples(this.campo_vigilar)
        }
      })
    },1500)
  }
  asiganacion_resultados_multiples(campo_vigila){
    this.objecto_actuales[campo_vigila] = this._publicos.revision_cache(campo_vigila)
    this.genera_resultados()
  }
  genera_resultados(){
    const historial_gastos_diarios = this._publicos.revision_cache('historial_gastos_diarios')
    const historial_gastos_operacion = this._publicos.revision_cache('historial_gastos_operacion')
    const historial_gastos_orden = this._publicos.revision_cache('historial_gastos_orden')

    const objetoFiltradohistorial_gastos_diarios = this._publicos.filtrarObjetoPorPropiedad(historial_gastos_diarios, 'sucursal', this.filtro_sucursal);
    const objetoFiltradohistorial_gastos_operacion = this._publicos.filtrarObjetoPorPropiedad(historial_gastos_operacion, 'sucursal', this.filtro_sucursal);
    const objetoFiltradohistorial_gastos_orden = this._publicos.filtrarObjetoPorPropiedad(historial_gastos_orden, 'sucursal', this.filtro_sucursal);

    // console.log('===><===');
    
    // console.log(objetoFiltradohistorial_gastos_diarios);
    // console.log(objetoFiltradohistorial_gastos_operacion);
    // console.log(objetoFiltradohistorial_gastos_orden);
    const {start, end }= this.fecha_formateadas

    // console.log({start, end });
    

    //  const arreglo_historial_gastos_diarios = this._publicos.crearArreglo2(objetoFiltradohistorial_gastos_diarios)
    //  const arreglo_historial_gastos_operacion = this._publicos.crearArreglo2(objetoFiltradohistorial_gastos_operacion)
    //  const arreglo_historial_gastos_orden = this._publicos.crearArreglo2(objetoFiltradohistorial_gastos_orden)

    //  console.log(arreglo_historial_gastos_diarios);
    //  console.log(arreglo_historial_gastos_operacion);
    //  console.log(arreglo_historial_gastos_orden);

     const objeto_todas = this._publicos.crear_new_object({
        ...objetoFiltradohistorial_gastos_diarios,
        ...objetoFiltradohistorial_gastos_operacion,
        ...objetoFiltradohistorial_gastos_orden
      })

      // console.log(objeto_todas);
      

      const objeto_filtrado_fecha_operacion = this._publicos.filtrarObjetoPorPropiedad_fecha(objeto_todas, start, end)

      const data_completa = this._publicos.arregla_data_completa(objeto_filtrado_fecha_operacion)
      // console.log(data_completa);
      
      const arreglo_Actual = this._publicos.crearArreglo2(data_completa)
      
      const campos = [
        'concepto',
        'fecha_recibido',
        'metodo',
        'monto',
        'rol',
        'status',
        'sucursal',
        'tipo',
        'usuario',
      ]
    let arreglo = []
    this.gastos_diarios_table = (!this.gastos_diarios_table.length) 
    ? arreglo_Actual
    :  this._publicos.actualizarArregloExistente(this.gastos_diarios_table, arreglo_Actual, campos )

    const nuevos = this._publicos.asigna_data_reporte_gastos(arreglo_Actual)
    arreglo = (!arreglo.length) 
    ? arreglo_Actual
    :  this._publicos.actualizarArregloExistente(nuevos, arreglo_Actual, campos )


    // console.log(arreglo);

    this.dataSource.data = arreglo
    
    this.newPagination()

    const hoy = this._publicos.verificarFechasIgualesHoy(start, end)

      const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(arreglo_Actual)
      const {restante} = reporte;

      this.reporte = reporte;

      // console.log(objeto_filtrado_fecha_operacion);

      if (hoy && this.filtro_sucursal !== 'Todas' && restante >0) {
        const filtro_fechas_diarios = this._publicos.filtrarObjetoPorPropiedad_fecha(objetoFiltradohistorial_gastos_diarios, start, end)
        const bruto = this._publicos.crearArreglo2(filtro_fechas_diarios)
        this.registro_sobrante_hoy({
          start, restante, bruto,
          filtro_sucursal: this.filtro_sucursal
        })
      }
      
     
    
  }

  genera_excel(){
    const enviar_totales_orden = []

    const historial_gastos_orden = this._publicos.revision_cache('historial_gastos_orden')
    const nuevas_ = [...this.dataSource.data]
    if (nuevas_.length) {
      const aplicadas = nuevas_.map((os_especifica:any)=>{
        const {tipo, id_os, no_os, descripcion} = this._publicos.crear_new_object(os_especifica)
        if (tipo === 'orden') {
          const reporte = {total:0, subtotal:0, iva:0}
          const pertenecientes_orden = this._publicos.crearArreglo2(this._publicos.filtrarObjetoPorPropiedad(historial_gastos_orden,'id_os',id_os))
          pertenecientes_orden.forEach(element => {
            reporte.total += element.monto
          });
          if (reporte.total >0 ) {
            enviar_totales_orden.push({
                no_os,
                descripcion, 
                total_gastado: reporte.total,
              })
              os_especifica.total_gastado = reporte.total
          }
        }
        
        return os_especifica
      })
      
      function calculos_facturas_notas(arreglo){
        let total_facturas =0, total_notas = 0
        let nuevos = [...arreglo]
        let filtrados_aprobados = nuevos.filter(s=>s.status)
        filtrados_aprobados.forEach(co=>{
          const {monto, facturaRemision} = co
          if (facturaRemision === 'factura') {
            total_facturas += parseFloat(monto)
          }else{
            total_notas += parseFloat(monto)
          }
        })
        return {total_facturas, total_notas}
      }
      // this.dataSource.data, this.reporte, enviar_totales_orden
      const {total_facturas, total_notas} = calculos_facturas_notas(aplicadas)
      this._export.generaReporteGastosExcel({
        arreglo: aplicadas,
        data_reporte_general: this.reporte,
        total_factura: total_facturas, 
        total_notas: total_notas, 
        restante_dia: total_facturas + total_notas
      })
    }else{
      this._publicos.mensajeSwal('ningun registro a exportar',0)
    }

    

  }
  






  vigila_calendario(){
    this.fechas_filtro.valueChanges.subscribe(({start:start_, end: end_})=>{
      if (start_ && start_['_d'] && end_ && end_['_d'] ) {
        if (end_['_d'] >= start_['_d']) {
          this.resetea_horas_admin()
        }
      }
    })
  }
  resetea_horas_admin(){
    const {start, end } = this.fechas_filtro.value

    this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
    this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(end),this.hora_end)

    this.genera_resultados()
  }

  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }
  async registro_sobrante_hoy(data){
    console.log('registro_sobrante_hoy');
    
    const {start, restante, bruto, filtro_sucursal} = data
    let nuevos_bruto = [...bruto]
    const simular_fecha = this._publicos.sumarRestarDiasFecha(start, 1)
    let updates = {}
    
    const save = {
      sucursal: filtro_sucursal,
      concepto:  'Sobrante dia anterior',
      monto:     restante,      
      metodo:    1,
      status:    true,
      tipo:      'sobrante',
      fecha_recibido: this._publicos.retorna_fechas_hora({fechaString: simular_fecha}).toString_completa
    }

    if(restante !== 0){
      if (this._publicos.esDomingo(simular_fecha)) {
        const fecha_lunes = this._publicos.sumarRestarDiasFecha(simular_fecha, 1)
        save.fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: fecha_lunes.toString()}).toString_completa
      }
      const nueva_fecha_maniana = this._publicos.sumarRestarDiasFecha(new Date(), 1)
      const clave_fecha = genera_clave_diario(nueva_fecha_maniana, filtro_sucursal)
      const clave_encontrada = nuevos_bruto.find(c=>c.id === clave_fecha)
      let valorNoDuplicado
      if (clave_encontrada) {
        updates[`historial_gastos_diarios/${clave_fecha}/monto`] = restante
        updates[`historial_gastos_diarios/${clave_fecha}/status`] = true
      }else{
        const claves_encontradas = await this._automaticos.consulta_ruta('claves_clientes')
        valorNoDuplicado = await [...new Set([...claves_encontradas, clave_fecha])];
        updates[`historial_gastos_diarios/${clave_fecha}`] = save
        updates['claves_historial_gastos_diarios'] = valorNoDuplicado

      }
      update(ref(db), updates).then(()=>{
        console.log(`se actualizo ${clave_fecha}`);
        this._security.guarda_informacion({nombre:'claves_historial_gastos_diarios', data: valorNoDuplicado})
      })
      .catch(err=>{
        console.log(err);
      })
      // console.log(updates);
    }





    function genera_clave_diario(fecha, sucursal){
      const clave_sobrante_fecha = formatearFecha(new Date(fecha), false)

      const sucursales = {}
      sucursales['-N2gkVg1RtSLxK3rTMYc'] = 'Polanco'
      sucursales['-N2gkzuYrS4XDFgYciId'] = 'Toreo'
      sucursales['-N2glF34lV3Gj0bQyEWK'] = 'Culhuacán'
      sucursales['-N2glQ18dLQuzwOv3Qe3'] = 'Circuito'
      sucursales['-N2glf8hot49dUJYj5WP'] = 'Coapa'
      sucursales['-NN8uAwBU_9ZWQTP3FP_'] = 'lomas'

      const nombre_sucu = sucursales[sucursal].slice(0,2).toUpperCase()
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
        updates[`${ruta}/habilitado_por_usuario`] = this._usuario
        updates[`${ruta}/habilitado_por_rol`] = this._rol
      } if (accion === 'eliminar') {
        updates[`${ruta}/status`] = false
        updates[`${ruta}/inhabilitado_por_usuario`] = this._usuario
        updates[`${ruta}/inhabilitado_por_rol`] = this._rol
      } else if (accion === 'modificar' && monto_caja > 0) {
          updates[`${ruta}/status`] = true
          updates[`${ruta}/monto`] = parseInt(monto_caja)
          updates[`${ruta}/modificado_por_usuario`] = this._usuario
          updates[`${ruta}/modificado_por_rol`] = this._rol
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
  data_deposito(event){
    if (event) this._publicos.cerrar_modal('modal-deposito')
  }
}