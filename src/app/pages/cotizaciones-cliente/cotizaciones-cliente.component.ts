import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { animate, state, style, transition, trigger } from '@angular/animations';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';

import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-cotizaciones-cliente',
  templateUrl: './cotizaciones-cliente.component.html',
  styleUrls: ['./cotizaciones-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CotizacionesClienteComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, 
    private _vehiculos: VehiculosService, private _servicios: ServiciosService, private _campos: CamposSystemService,
    private _clientes: ClientesService, private _sucursales: SucursalesService, private _cotizaciones: CotizacionesService) { }
  rol_cliente:string = 'cliente'

  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  camposCliente     =   [ ...this._clientes.camposCliente_show  ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_  ]
  formasPago        =   [ ...this._cotizaciones.formasPago  ]

  paquete: string     =   this._campos.paquete
  refaccion: string   =   this._campos.refaccion
  mo: string          =   this._campos.mo
  miniColumnas:number =   this._campos.miniColumnas

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','no_cotizacion','fullname','placas']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos


  cotizaciones_Existentes = []


  ///grafica de datos
  single = []
  view_comparativa: [number, number] = [500, 200];
  clonado_busqueda = []
  infoSelect_busqueda = {value: 0, name:'--------',contador: 0,arreglo:[]}
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme:Color = {
    group: ScaleType.Ordinal, 
    selectable: true, 
    name: 'Customer Usage', 
    domain: ['#3574FA', '#FF8623', '#a8385d', '#5ca04a']
  };
  tabla_promedios = [
    {valor:'servicios_totales', show:'Total de cotizaciones'},
    {valor:'ticketGeneral', show:'Ticket general'},
    {valor:'ticketPromedio', show:'Ticket promedio'},
  ]
  valores_promedios = {servicios_totales: 0, ticketGeneral:0, ticketPromedio:0}
  tabla_maximos  = [
    {valor:'maximo', show:'Inversion mas alta', },
    {valor:'contadorMaximo', show:'contador altas', },
    {valor:'similitudesMaximo', show:'cotizaciones maximas'},
  ]
   valores_tabla_maximos = { maximo: 0,contadorMaximo: 0,similitudesMaximo: '' }
  tabla_minimos = [
    {valor:'minimo', show:'Inversion mas baja'},
    {valor:'contadorMinimo', show:'contador bajas'},
    {valor:'similitudesMinimo', show:'cotizaciones minimas'},
  ]
  valores_tabla_minimos = { minimo: 0,contadorMinimo: 0,similitudesMinimo: '' }
  SUCURSAL:string
  cotizaciones_arr= []
  collapse_maximos_class:string = 'collapse'
  collapse_maximo_b:boolean = false
  collapse_minimas_b:boolean = false
  ngOnInit(): void {
    this.rol()
  }

  rol(){

    // const { rol,  uid } = this._security.usuarioRol()
    const {rol, usuario, sucursal, uid} = this._security.usuarioRol()
    this.SUCURSAL = sucursal
    if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
    
  }
  asing_muestra(valor, cual:string) {
    setTimeout(()=>{
      if (cual==='maximas') {
        this.collapse_maximo_b = valor
      }else{
        this.collapse_minimas_b = valor
      }
    },200)
  }

  async obtenerInformacion_cliente(id:string){

    const sucursal = this.SUCURSAL
    const cliente = id

    const starCountRef_cotizacionesRealizadas = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef_cotizacionesRealizadas, async (snapshot) => {
      if (snapshot.exists()) {
        const _cotizaciones = this._publicos.crearArreglo2( await this._cotizaciones.consulta__cotizaciones())
        const cotizaciones_filtrados = this._publicos.filtra_informacion(_cotizaciones,'cliente',cliente)
        // this.cotizaciones_arr = cotizaciones_filtrados
        const nuevas_cot  = [...cotizaciones_filtrados].map(cot=>{
          const {elementos, margen, iva, descuento, formaPago} = cot
          const reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
          cot.reporte = reporte
          return cot
        })
        const ordenadas = this._publicos.ordenamiento_fechas(nuevas_cot,'fecha_recibido', false)
        const campos_cotizacion_recupera = [
          'fullname',
          'elementos',
          'fecha_recibido',
          'formaPago',
          'iva',
          'margen',
          'pdf',
          'servicio',
          'sucursal',
          'vehiculo',
          'reporte',
        ]
        this.cotizaciones_arr = (!this.cotizaciones_arr.length)  ? ordenadas :
        this._publicos.actualizarArregloExistente(this.cotizaciones_arr,ordenadas,campos_cotizacion_recupera)
        const aqui = this._publicos.ticket_promedio(nuevas_cot)
        
        Object.keys(aqui).forEach(c=>{
          this.valores_promedios[c] = aqui[c]
        })
        
        const enviar = this._cotizaciones.conveirte_comparar(nuevas_cot)
        const resultados_comparados = this._cotizaciones.obtenerMaximoMinimoYSimilitudes(enviar)

        this.tabla_maximos.forEach(element => {
          const {valor} = element
          this.valores_tabla_maximos[valor] = resultados_comparados[0][valor]
        });
        this.tabla_minimos.forEach(element => {
          const {valor} = element
          this.valores_tabla_minimos[valor] = resultados_comparados[1][valor]
        });

      } else {
        // console.log("No data available");
        this.cotizaciones_arr = []
      }
    })
/*

    const data_cliente  = await this._clientes.consulta_cliente_new({sucursal, cliente})
    const vehiculos_arr = await this._vehiculos.consulta_vehiculos({sucursal, cliente})

    const ruta_cotizaciones   =  `cotizacionesRealizadas`
    
    const todas_cotizaciones = await this._cotizaciones.conslta_cotizaciones_cliente({ruta: ruta_cotizaciones})

    const filtro_cotizaciones = todas_cotizaciones.map(cot=>{
      const data_cliente_formateada = this._clientes.formatea_info_cliente_2(data_cliente)
      // cot.data_sucursal = this.sucursales_arr.find(s=>s.id === sucursal)
      cot.data_cliente = data_cliente_formateada
      cot.fullname = data_cliente_formateada.fullname
      const data_vehiculo = vehiculos_arr.find(v=>v.id === cot.vehiculo)
      cot.data_vehiculo = data_vehiculo
      const {placas}= data_vehiculo
      cot.placas = placas || '------'
      const {reporte, elementos} = this.calcularTotales(cot);
      cot.reporte = reporte
      cot.elementos = elementos
      return cot
    })
    

    if (!this.cotizaciones_arr.length) {
      this.cotizaciones_arr = filtro_cotizaciones;
      // this.cargandoInformacion = false
    } else {
      this.cotizaciones_arr = this._publicos.actualizarArregloExistente(this.cotizaciones_arr,filtro_cotizaciones,[...this._cotizaciones.camposCotizaciones])
      // this.cargandoInformacion = false
    }

    const aqui = this._publicos.obtener_ticketPromedioFinal(this.cotizaciones_arr)
    const tickets = this._publicos.obtenerValorMaximoMinimo(this.cotizaciones_arr)

    Object.keys(aqui).forEach(c=>{
      this.valores_promedios[c] = aqui[c]
    })
    Object.keys(tickets).forEach(c=>{
      const maxKeys = Object.keys(this.valores_tabla_maximos);
      const minKeys = Object.keys(this.valores_tabla_minimos);

      if (maxKeys.includes(c)) {
        this.valores_tabla_maximos[c] = c !== 'arreglo_maximo' ? tickets[c] : tickets[c].join(', ');
      }
      if (minKeys.includes(c)) {
        this.valores_tabla_minimos[c] = c !== 'arreglo_minimo' ? tickets[c] : tickets[c].join(', ');
      }
    })

      */
    this.dataSource.data = this.cotizaciones_arr
    this.newPagination()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }

  calcularTotales(data) {
    const {margen: new_margen, formaPago, elementos: servicios_, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0}
    const elementos = (servicios_) ? [...servicios_] : []
    const margen = 1 + (new_margen / 100)
    elementos.map(ele=>{
      const {cantidad, costo} = ele
      if (ele.tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          reporte.mo += mo
          reporte.refacciones += refacciones
          reporte.refacciones_v += refacciones * margen
        }
        ele.precio = mo + (refacciones * margen)
        ele.total = (mo + (refacciones * margen)) * cantidad
        if (costo > 0 ) ele.total = costo * cantidad 
      }else if (ele.tipo === 'mo') {
        const operacion = this.mano_refaccion(ele)
        if (ele.aprobado) {
          reporte.mo += operacion
        }
        ele.subtotal = operacion
        ele.total = operacion
      }else if (ele.tipo === 'refaccion') {
        const operacion = this.mano_refaccion(ele)
        if (ele.aprobado) {
          reporte.refacciones += operacion
          reporte.refacciones_v += operacion * margen
        }
        ele.subtotal = operacion
        ele.total = operacion * margen
      }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0
    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))
    const {mo, refacciones_v, refacciones} = reporte

    let nuevo_total = mo + refacciones_v

    let total_iva = _iva ? nuevo_total * 1.16 : nuevo_total;

    let iva =  _iva ? nuevo_total * .16 : 0;

    let total_meses = (enCaso_meses.id === '1') ? 0 : total_iva * (1 + (enCaso_meses.interes / 100))
    let newTotal = (enCaso_meses.id === '1') ?  total_iva -= descuento : total_iva
    let descuentoshow = (enCaso_meses.id === '1') ? descuento : 0

    reporte.descuento = descuentoshow
    reporte.iva = iva
    reporte.subtotal = nuevo_total
    reporte.total = newTotal
    reporte.meses = total_meses
    // console.log(reporte);
    // (reporteGeneral.subtotal - cstoCOmpra) *100/reporteGeneral.subtotal
    reporte.ub = (nuevo_total - refacciones) * (100 / nuevo_total)
    return {reporte, elementos}
    
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
