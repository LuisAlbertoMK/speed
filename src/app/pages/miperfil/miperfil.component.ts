import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';



import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { Router } from '@angular/router';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { getAuth,onAuthStateChanged  } from "firebase/auth";
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
const auth = getAuth();
@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MiperfilComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, private _clientes: ClientesService,
    private _servicios: ServiciosService, private _reporte_gastos: ReporteGastosService,
    private _sucursales: SucursalesService, private _vehiculos: VehiculosService, private router: Router, private _cotizaciones: CotizacionesService,) { }
  rol_cliente:string = 'cliente'
  info_cliente = {}
  info_cliente_editar = {}
  camposCliente_show  = [ ...this._clientes.camposCliente_show ]
  sucursales_arr      = [ ...this._sucursales.lista_en_duro_sucursales ]
  formasPago       =  [ ...this._cotizaciones.formasPago ]

  misVehiculos = []

  ///elementos de la tabla de vehiculos
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','placas','marca','modelo','anio','categoria','engomado','color','cilindros']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  editar:boolean = false
  cargando:boolean = true
  uid: string =  null
  SUCURSAL:string
  data_cliente:any
  vehiculos_arr:any[] = []

  cotizaciones_arr:any = []
  recepciones_arr:any[] =[]

  ngOnInit(): void {
    this.rol()
    this.verifica()
    
  }
  rol(){
    const {rol, usuario, sucursal, uid} = this._security.usuarioRol()
    // console.log(uid);
    
    this.SUCURSAL = sucursal
    if (rol === this.rol_cliente && uid) {
      this.vigila(uid)
      this.uid = uid
    }else{
      this.uid = null
    }
  }
  async vigila(id){
   
    // const sucursal = this.SUCURSAL
    const cliente = id

    const data_cliente  = await this._clientes.consulta_Cliente(id)
    // console.log(data_cliente);
    
    const starCountRef_vehiculos = ref(db, `vehiculos`)
    onValue(starCountRef_vehiculos, async (snapshot) => {
      if (snapshot.exists()) {
        const vehiculos_arr =  this._publicos.crearArreglo2( await this._vehiculos.consulta_vehiculos_())
        const vehiculos_filtrados = this._publicos.filtra_informacion(vehiculos_arr,'cliente',cliente)
        this.vehiculos_arr = vehiculos_filtrados
      } else {
        // console.log("No data available");
        this.vehiculos_arr = []
      }
    })

    const starCountRef_cotizacionesRealizadas = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef_cotizacionesRealizadas, async (snapshot) => {
      if (snapshot.exists()) {
        const _cotizaciones = this._publicos.crearArreglo2( await this._cotizaciones.consulta__cotizaciones())
        const cotizaciones_filtrados = this._publicos.filtra_informacion(_cotizaciones,'cliente',cliente)
        const ordenadas = this._publicos.ordenamiento_fechas(cotizaciones_filtrados,'fecha_recibido', false)
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
      } else {
        // console.log("No data available");
        this.cotizaciones_arr = []
      }
    })

    const starCountRef_recepciones = ref(db, `recepciones`)
    onValue(starCountRef_recepciones, async (snapshot) => {
      if (snapshot.exists()) {

        const _orden = this._publicos.crearArreglo2( await this._reporte_gastos.consulta_orden())
        // console.log(_orden);
        const _pagos = this._publicos.crearArreglo2( await this._servicios.consulta_pagos())
      
        const recepciones = this._publicos.crearArreglo2( await this._servicios.consulta_recepciones_())
        const recepciones_filtrados = this._publicos.filtra_informacion(recepciones,'cliente',cliente)
        .map(recepcion=>{
          
          const {elementos, margen, iva, descuento, formaPago, id} = recepcion
          const reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
          recepcion.reporte = reporte
          recepcion.historial_gastos_orden = this._publicos.filtra_informacion(_orden,'id_os',id)
          recepcion.historial_pagos_orden = this._publicos.filtra_informacion(_pagos,'id_os',id)
          return recepcion
        })
        const ordenadas = this._publicos.ordenamiento_fechas(recepciones_filtrados,'fecha_recibido', false)

        const campos_recepciones = [
          'checkList',
          'detalles',
          'diasEntrega',
          'diasSucursal',
          'elementos',
          'fecha_promesa',
          'fecha_recibido',
          'formaPago',
          'iva',
          'margen',
          'fullname',
          'no_os',
          'notifico',
          'pathPDF',
          'servicio',
          'status',
          'reporte',
          'historial_gastos_orden',
          'historial_pagos_orden',
        ]
        this.recepciones_arr = (!this.recepciones_arr.length)  ? ordenadas :
        this._publicos.actualizarArregloExistente(this.recepciones_arr,ordenadas,campos_recepciones)
        // this.recepciones_arr = recepciones_filtrados
      } else {
        // console.log("No data available");
        this.recepciones_arr = []
      }
    })

    this.data_cliente = data_cliente
    
    // this.vigila_vehiculos_cliente()
    
  }
  async vigila_vehiculos_cliente(){

    // this.uid
    // this.SUCURSAL
    const sucursal = this.SUCURSAL
    const cliente = this.uid

    const data_cliente  = await this._clientes.consulta_cliente_new({sucursal, cliente})
    
    const starCountRef_vehiculos = ref(db, `vehiculos/${sucursal}/${cliente}`)
    onValue(starCountRef_vehiculos, async (snapshot) => {
      if (snapshot.exists()) {
        // let vehiculos= this._publicos.crearArreglo2(snapshot.val())
        const vehiculos_arr = await this._vehiculos.consulta_vehiculos({sucursal, cliente})
        this.vehiculos_arr = vehiculos_arr
      } else {
        this.vehiculos_arr = []
      }
    })
    const starCountRef_cotizaciones = ref(db, `cotizacionesRealizadas/${sucursal}/${cliente}`)
    onValue(starCountRef_cotizaciones, async (snapshot) => {
      if (snapshot.exists()) {
        const ruta_cotizaciones   =  `cotizacionesRealizadas/${sucursal}/${cliente}`
        const todas_cotizaciones = await this._cotizaciones.conslta_cotizaciones_cliente({ruta: ruta_cotizaciones})
        const filtro_cotizaciones = todas_cotizaciones.map(cot=>{
          cot.data_cliente = this._clientes.formatea_info_cliente_2(data_cliente)
          cot.data_sucursal = this.sucursales_arr.find(s=>s.id === sucursal)
          
          const data_vehiculo = this.vehiculos_arr.find(v=>v.id === cot.vehiculo)
          cot.data_vehiculo = data_vehiculo
          const {placas}= data_vehiculo
          cot.placas = placas || '------'
          // const {reporte, elementos} = this.calcularTotales(cot);
          // cot.reporte = reporte
          // cot.elementos = elementos
          return cot
        })
        this.cotizaciones_arr = filtro_cotizaciones
      } else {
        this.cotizaciones_arr = []
      }
    })

    const starCountRef_recepciones = ref(db, `recepciones/${sucursal}/${cliente}`)
    onValue(starCountRef_recepciones, async (snapshot) => {
      if (snapshot.exists()) {
        const ruta_recepciones    =  `recepciones/${sucursal}/${cliente}`
        const todas_recepciones  = await this._servicios.conslta_recepciones_cliente({ruta: ruta_recepciones})
        const filtro_recepciones = todas_recepciones.map(cot=>{
          cot.data_cliente = this._clientes.formatea_info_cliente_2(data_cliente)
          cot.data_sucursal = this.sucursales_arr.find(s=>s.id === sucursal)
          
          const data_vehiculo = this.vehiculos_arr.find(v=>v.id === cot.vehiculo)
          cot.data_vehiculo = data_vehiculo
          const {placas}= data_vehiculo
          cot.placas = placas || '------'
          // const {reporte, elementos} = this.calcularTotales(cot);
          // cot.reporte = reporte
          // cot.elementos = elementos
          return cot
        })
        this.recepciones_arr = filtro_recepciones
      }else{
        this.recepciones_arr = []
      }

    })

   



  }
  async obtenerInformacion_cliente(id:string){
    const cliente:any = await this._clientes.consulta_cliente_new(id);
    this.info_cliente = cliente
    this.misVehiculos = cliente['vehiculos']
    
    this.dataSource.data = this.misVehiculos
    this.newPagination()
    this.cargando = false
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
  clientesInfo(info:any){
    const {cliente, status} = info
    if(!info.CerrarModal){
      if (status) {
        this._publicos.mensajeCorrecto('registro de cliente correcto', 1)
        this.editar = false
      }else{
        this._publicos.mensajeSwal('Ocurrio un error',0)
      }
    }else{
      this.editar = false
    }
    
  }
  irPagina(pagina,vehiculo){
    const { uid } = this._security.usuarioRol()
    let queryParams = {}
    
    if (pagina === 'historialCliente-vehiculo')  queryParams = { anterior:'miPerfil', cliente: uid,vehiculo }

    if (pagina) this.router.navigate([`/${pagina}`], {  queryParams });
  }
  verifica(){
    onAuthStateChanged(auth, (user) => {
      if(user){
          // this.rol()
      }else{
        console.log('sin logeo');
      }
    })
  }

}