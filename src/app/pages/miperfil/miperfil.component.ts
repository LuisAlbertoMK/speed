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
    private _servicios: ServiciosService,
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
    this.SUCURSAL = sucursal
    if (rol === this.rol_cliente && uid) {
      this.vigila(uid)
      this.uid = uid
    }else{
      this.uid = null
    }
  }
  async vigila(id){
   
    const sucursal = this.SUCURSAL
    const cliente = id

    const data_cliente  = await this._clientes.consulta_cliente_new({sucursal, cliente})

    const vehiculos_arr = await this._vehiculos.consulta_vehiculos({sucursal, cliente})

    const ruta_cotizaciones   =  `cotizacionesRealizadas/${sucursal}/${cliente}`
    const ruta_recepciones    =  `recepciones/${sucursal}/${cliente}`

    const todas_cotizaciones = await this._cotizaciones.conslta_cotizaciones_cliente({ruta: ruta_cotizaciones})
    const todas_recepciones  = await this._servicios.conslta_recepciones_cliente({ruta: ruta_recepciones})
    


    const filtro_cotizaciones = todas_cotizaciones.map(cot=>{
      cot.data_cliente = this._clientes.formatea_info_cliente_2(data_cliente)
      cot.data_sucursal = this.sucursales_arr.find(s=>s.id === sucursal)
      
      const data_vehiculo = vehiculos_arr.find(v=>v.id === cot.vehiculo)
      cot.data_vehiculo = data_vehiculo
      const {placas}= data_vehiculo
      cot.placas = placas || '------'
      const {reporte, elementos} = this.calcularTotales(cot);
      cot.reporte = reporte
      cot.elementos = elementos
      return cot
    })
    // console.log(filtro_cotizaciones);
    const filtro_recepciones = todas_recepciones.map(cot=>{
      cot.data_cliente = this._clientes.formatea_info_cliente_2(data_cliente)
      cot.data_sucursal = this.sucursales_arr.find(s=>s.id === sucursal)
      
      const data_vehiculo = vehiculos_arr.find(v=>v.id === cot.vehiculo)
      cot.data_vehiculo = data_vehiculo
      const {placas}= data_vehiculo
      cot.placas = placas || '------'
      const {reporte, elementos} = this.calcularTotales(cot);
      cot.reporte = reporte
      cot.elementos = elementos
      return cot
    })

    this.cotizaciones_arr = filtro_cotizaciones
    this.recepciones_arr = filtro_recepciones


    this.data_cliente = data_cliente
    this.vehiculos_arr = vehiculos_arr
    
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