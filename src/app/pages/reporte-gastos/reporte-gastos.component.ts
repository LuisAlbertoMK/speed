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
    private _security:EncriptadoService,private _publicos: ServiciosPublicosService, 
    private _reporte_gastos: ReporteGastosService, private _sucursales: SucursalesService) { 
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
    {valor:'restante', show:'Sobrante op'},
  ]

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['sucursalShow','no_os','metodoShow','status','monto','tipo','fecha']; //elementos
  columnsToDisplayWithExpand = [...this.elementos,'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  sucursales_array = [...this._sucursales.lista_en_duro_sucursales]

  filtro_sucursal:string

  ngOnInit(): void {
    this.rol()
    this.vigila_calendario()
    this.resetea_horas_admin()
  }
  
  rol(){
    const { rol, sucursal, usuario} = this._security.usuarioRol()
    this._rol = rol
    this._sucursal = sucursal
    this._usuario = usuario
    this.filtro_sucursal = sucursal
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
  async resetea_horas_admin(){
    const {start, end } = this.fechas_filtro.value

    this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start),this.hora_start) 
    this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(end),this.hora_end)

    // const {start:start_, end: end_} = this.fecha_formateadas

    // const filtro_fechas = this._publicos.filtro_fechas(this.recepciones_arr_antes_filtro,'fecha_recibido',start_,end_)

    setTimeout(() => {
      // this.recepciones_arr = filtro_fechas
      this.listado_corte_ingresos()
    }, 1000);
    
  }
  async listado_corte_ingresos(){
    
    
    const recepciones_object = await this._publicos.revisar_cache('recepciones')

      const historial_gastos_orden = this._publicos.crearArreglo2(await this._publicos.revisar_cache('historial_gastos_orden'))

      const gastos_operacion_object = await this._publicos.revisar_cache('historial_gastos_operacion')
      const gastos_operacion_array = this._publicos.crearArreglo2(gastos_operacion_object)

      const historial_gastos_diarios_object = await this._publicos.revisar_cache('historial_gastos_diarios')
      const historial_gastos_diarios_array = this._publicos.crearArreglo2(historial_gastos_diarios_object)

      const {start:start_, end: end_} = this.fecha_formateadas
      
      const filtro_fechas_operacion= this._publicos.filtro_fechas(gastos_operacion_array,'fecha_recibido',start_,end_)
      // console.log(filtro_fechas_operacion);

      const filtro_fechas_diarios= this._publicos.filtro_fechas(historial_gastos_diarios_array,'fecha_recibido',start_,end_)
      // console.log(filtro_fechas_diarios);

      const filtro_fechas_orden= this._publicos.filtro_fechas(historial_gastos_orden,'fecha_recibido',start_,end_)
      // console.log(filtro_fechas_orden);
      
      const nuevos_diarios = [...filtro_fechas_operacion, ...filtro_fechas_diarios,...filtro_fechas_orden]
      const arreglar_nuevos_diarios = this._publicos.asigna_data_diarios({
        bruto: nuevos_diarios, recepciones: recepciones_object
      })
      const nuevos_diarios_ordenados = this._publicos.ordenamiento_fechas(arreglar_nuevos_diarios,'fecha_recibido', false)

      const _filtros_sucursal = 
      (this.filtro_sucursal === 'Todas') ? nuevos_diarios_ordenados 
      : this._publicos.filtra_campo(nuevos_diarios_ordenados, 'sucursal', this.filtro_sucursal)

      const hoy = this._publicos.verificarFechasIgualesHoy(start_, end_)

      const reporte = this._reporte_gastos.reporte_gastos_sucursal_unica(_filtros_sucursal)
      const {restante} = reporte;

      this.dataSource.data = _filtros_sucursal
      this.newPagination()

      if (hoy && this.filtro_sucursal !== 'Todas') {
        this.registro_sobrante_hoy({
          start: start_, restante, bruto: filtro_fechas_diarios,
          filtro_sucursal: this.filtro_sucursal
        })
      }
      this.reporte = reporte;
  }
  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }
  registro_sobrante_hoy(data){
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

      if (clave_encontrada) {
        updates[`historial_gastos_diarios/${clave_fecha}/monto`] = restante
        updates[`historial_gastos_diarios/${clave_fecha}/status`] = true
      }else{
        updates[`historial_gastos_diarios/${clave_fecha}`] = save
      }
      update(ref(db), updates).then(()=>{
        console.log(`se actualizo ${clave_fecha}`);
      })
      .catch(err=>{
        console.log(err);
      })
      console.log(updates);
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
}