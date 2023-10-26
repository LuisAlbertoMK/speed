import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';


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

  // camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  camposCliente     =   [ ...this._clientes.camposCliente_show  ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_  ]
  // formasPago        =   [ ...this._cotizaciones.formasPago  ]

  paquete: string     =   this._campos.paquete
  refaccion: string   =   this._campos.refaccion
  mo: string          =   this._campos.mo
  miniColumnas:number =   this._campos.miniColumnas



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
  _sucursal:string
  _rol:string
  _uid:string

  objecto_actual:any ={}

  cotizaciones_arr= []
  collapse_maximos_class:string = 'collapse'
  collapse_maximo_b:boolean = false
  collapse_minimas_b:boolean = false
  ngOnInit(): void {
    this.rol()
  }

  rol(){

    const {rol, usuario, sucursal, uid} = this._security.usuarioRol()
    
    this._sucursal = sucursal
    this._rol = rol
    // if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
    if (uid) {
      this._uid = uid
      this.primer_comprobacion_resultados()
    }
  }
  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('cotizaciones')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }
  primer_comprobacion_resultados(){
    this.asiganacion_resultados()
    this.segundo_llamado()
  }
  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.nueva_revision_cache('cotizaciones')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asiganacion_resultados()
      }
    },1500)
  }
  asiganacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('cotizaciones')

    const {data_cliente, cotizaciones_arr, recepciones_arr, vehiculos_arr} = this._publicos.data_relacionada_id_cliente(this._uid)

    const campos_recpciones = [
      'checkList','detalles','diasEntrega','diasSucursal','elementos','fecha_promesa','fecha_recibido','formaPago','iva','margen','no_os','notifico','pathPDF','servicio','status','reporte','historial_gastos_orden','historial_pagos_orden'
    ]
    this.objecto_actual = objecto_recuperdado

    this.cotizaciones_arr = (!this.cotizaciones_arr.length)  ? cotizaciones_arr :
    this._publicos.actualizarArregloExistente(this.cotizaciones_arr,cotizaciones_arr,campos_recpciones)

    // console.log(cotizaciones_arr);

    if (cotizaciones_arr.length) {
      const promedios_ticket = this._publicos.ticket_promedio(cotizaciones_arr)
      Object.keys(promedios_ticket).forEach(c=>{
        this.valores_promedios[c] = promedios_ticket[c]
      })
  
      const {maximos, minimos} = this._publicos.obtenerMaximoMinimoYSimilitudes(cotizaciones_arr)

      this.tabla_maximos.forEach(element => {
        const {valor} = element
        this.valores_tabla_maximos[valor] = maximos[valor]
      });
      this.tabla_minimos.forEach(element => {
        const {valor} = element
        this.valores_tabla_minimos[valor] = minimos[valor]
      })
    }
    
  }



  consulta_info_cliente(id_cliente:string){

    console.log(id_cliente);
    
    const {data_cliente, cotizaciones_arr, recepciones_arr, vehiculos_arr} = this._publicos.data_relacionada_id_cliente(id_cliente)
    // this.data_cliente = data_cliente
    this.cotizaciones_arr = cotizaciones_arr
    const promedios_ticket = this._publicos.ticket_promedio(cotizaciones_arr)
    Object.keys(promedios_ticket).forEach(c=>{
      this.valores_promedios[c] = promedios_ticket[c]
    })

    const resultados_comparados = this._publicos.obtenerMaximoMinimoYSimilitudes(cotizaciones_arr)

    // console.log(resultados_comparados);

    this.tabla_maximos.forEach(element => {
      const {valor} = element
      this.valores_tabla_maximos[valor] = resultados_comparados[0][valor]
    });
    this.tabla_minimos.forEach(element => {
      const {valor} = element
      this.valores_tabla_minimos[valor] = resultados_comparados[1][valor]
    });
    
    // this.recepciones_arr = recepciones_arr
    // this.vehiculos_arr = vehiculos_arr
  }
}