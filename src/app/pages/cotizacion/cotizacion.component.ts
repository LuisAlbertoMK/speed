import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { getDatabase, onValue, ref, set, push, get, child, limitToFirst } from 'firebase/database';
import { CotizacionService } from 'src/app/services/cotizacion.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {
  nombre: string;
}

export interface Item { id: string; name: string; }
import { animate, state, style, transition, trigger } from '@angular/animations';

import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ExporterService } from '../../services/exporter.service';

registerLocaleData(localeES, 'es');
@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
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
export class CotizacionComponent implements AfterViewInit, OnDestroy, OnInit {
  
  constructor(
    private _publicos: ServiciosPublicosService, private _security:EncriptadoService, private _campos: CamposSystemService,
    private router: Router, private _sucursales: SucursalesService, private _cotizacion: CotizacionService,
    private _servicios: ServiciosService, private _cotizaciones: CotizacionesService, private _clientes: ClientesService,
    private _vehiculos: VehiculosService, private rutaActiva: ActivatedRoute, private _exporter_excel: ExporterService
  ) {
    // this.itemsCollection = this.afs.collection<Item>('partesAuto');
    // this.items = this.itemsCollection.valueChanges()
   
  }
  
  ROL:string; SUCURSAL:string
  
  paquete: string     =  this._campos.paquete
  refaccion: string   =  this._campos.refaccion
  mo: string          =  this._campos.mo
  miniColumnas:number =  this._campos.miniColumnas

   // tabla
   dataSource = new MatTableDataSource(); //cotizaciones
   cotizaciones = ['no_cotizacion','fullname','placas']; //cotizaciones
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; //cotizaciones
   expandedElement: any | null; //cotizaciones
   @ViewChild('cotizacionesPaginator') paginator: MatPaginator //cotizaciones
   @ViewChild('cotizaciones') sort: MatSort //cotizaciones


  camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce ]
  camposCliente    =  [ ...this._clientes.camposCliente_show ]
  camposVehiculo   =  [ ...this._vehiculos.camposVehiculo_ ]
  formasPago       =  [ ...this._cotizaciones.formasPago ]
  sucursales_array =  [ ...this._sucursales.lista_en_duro_sucursales ]

  cotizacionesList=[]
  busqueda: string = null

  indexPosicionamiento:number = null
  cargandoInformacion:boolean = true
  temp_data_clientes = {}
  temp_data_vehiculos = {}
  enrutamiento = {cliente:'', sucursal:'', recepcion:'', tipo:'', anterior:'', vehiculo:''}

  filtro_sucursal:string
  contador_resultados:number = 0
  async ngOnInit() {
    // this.listaSucursales()
    this.rol();
    
  }
  ngAfterViewInit(): void { 
  }
  ngOnDestroy(): void {}
  rol() {
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal

    this.filtro_sucursal = sucursal
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
      // this.cargaDataCliente_new()
      this.accion()
    });
  }
  irPagina(pagina, data){
    // console.log(data);
    const {cliente, sucursal, id: idCotizacion, tipo, vehiculo } = data
    // console.log(this.enrutamiento);
    let queryParams = {}
    if (pagina === 'cotizacionNueva' && !tipo) {
      queryParams = { anterior:'cotizacion',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion',vehiculo} 
    }else if (pagina === 'cotizacionNueva' && tipo) {
      queryParams = { anterior:'cotizacion', tipo} 
    }else if (pagina === 'ServiciosConfirmar' && !tipo) {
      queryParams = { anterior:'cotizacion',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion',vehiculo} 
    }else if (pagina === 'ServiciosConfirmar' && tipo) {
      queryParams = { anterior:'cotizacion', tipo}
    }
    // console.log(queryParams);
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  accion(){
    // this.cargandoInformacion = true

    const starCountRef = ref(db, "cotizacionesRealizadas");

    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        console.time('Execution Time');
        this.cotizacionesList  = this._publicos.crearArreglo2(snapshot.val())
        this.filtra_informacion()
        console.timeEnd('Execution Time');
      } else {
        console.log("No existen cotizaciones realizadas.");
      }
    });
    

    function nueva_data_cliente(cliente:any){
      const sucursales = [
        {clave: '-N2gkVg1RtSLxK3rTMYc',nombre:'Polanco'},
        {clave: '-N2gkzuYrS4XDFgYciId',nombre:'Toreo'},
        {clave: '-N2glF34lV3Gj0bQyEWK',nombre:'Culhuacán'},
        {clave: '-N2glQ18dLQuzwOv3Qe3',nombre:'Circuito'},
        {clave: '-N2glf8hot49dUJYj5WP',nombre:'Coapa'},
        {clave: '-NN8uAwBU_9ZWQTP3FP_',nombre:'lomas'},
      ]
      const {sucursal, nombre, apellidos} = cliente
      cliente.sucursalShow = sucursales.find(s=>s.clave === sucursal).nombre
      cliente.fullname = `${nombre} ${apellidos}`
      return cliente
    }
  }
  crea_cotizaciones_sucursal(data){
    const {arreglo_sucursal, } = data
    let Rutas_retorna = []
    arreglo_sucursal.forEach(sucursal=>{
      Rutas_retorna.push(`cotizacionesRealizadas/${sucursal}`)
    })
    return Rutas_retorna
  }
  transformaData_cliente(data){
    const nuevos = [...data]
    // console.log(nuevos);
    const retornados = nuevos.map(cli=>{
      const {sucursal, nombre, apellidos } = cli
      cli.sucursalShow = this.sucursales_array.find(s=>s.id === sucursal).sucursal
      cli.fullname = `${String(nombre).toLowerCase()} ${String(apellidos).toLowerCase()}`
      return cli
    })
    return retornados
    
  }
  crea_lista_rutas_por_sucursal(data){
    const {arreglo_sucursal, } = data
    let Rutas_retorna = []
    arreglo_sucursal.forEach(sucursal=>{
      Rutas_retorna.push(`clientes/${sucursal}`)
    })
    return Rutas_retorna
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // localStorage.setItem('busquedaCotizaciones',filterValue.trim().toLowerCase())
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //paginacion de las cotizaciones
  newPagination(arreglo){
    setTimeout(() => {
      // arreglo.map((c,index)=>{
      //   c.index = index
      // })
      this.dataSource.data = arreglo
      this.cargandoInformacion = false
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }, 300)
  }

 

  filtra_informacion(){
    const resultados = (this.filtro_sucursal === 'Todas') ? this.cotizacionesList : this.cotizacionesList.filter(c=>c.sucursal === this.filtro_sucursal)
    this.contador_resultados = resultados.length
    this.newPagination(resultados)
  }
  exportar(){
    if (this.cotizacionesList.length) {
      console.log(this.dataSource.data);
      
      this._exporter_excel.exportToExcelCotizaciones(this.dataSource.data,'exportacion')
    }else{
      this._publicos.swalToast('ningun dato ...',0, 'top-start')
    }
  }

  calcularTotales(data) {
    const {margen: new_margen, formaPago, elementos: servicios_, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0}

    const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status"','subtotal','tipo','total']
    const campos_refaccion = [ ...campos_mo, 'marca']
    const campos_paquete = [ 'aprobado', 'cantidad', 'cilindros', 'costo', 'elementos', 'enCatalogo', 'id', 'marca', 'modelo', 'nombre', 'status', 'tipo','reporte' ]
    // let refacciones_new = 0
    const nuevos_elementos = (servicios_) ? servicios_ : []
    const servicios = [...nuevos_elementos] 
    let new_ele
    const margen = 1 + (new_margen / 100)
    servicios.map(ele=>{
      const {cantidad, costo} = ele
      if (ele.tipo === 'paquete') {
        ele.elementos = (ele.elementos) ? ele.elementos : []
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          reporte.mo += mo
          reporte.refacciones += refacciones
        }
        ele.costo = costo || 0
        ele.precio = mo + (refacciones * margen)
        ele.total = (mo + (refacciones * margen)) * cantidad
        if (costo > 0 ) ele.total = costo * cantidad
        ele.reporte = report
        const serviciosConIndices = ele.elementos.map((s, index) => {
          const servicioConIndice = { ...s };
          servicioConIndice.index = index;
          return servicioConIndice;
        })
        const nuevos_subelementos = this.remplaza_informacion_subelementos(serviciosConIndices, margen)
        ele.elementos = nuevos_subelementos

        new_ele = this._publicos.nuevaRecuperacionData(ele, campos_paquete)
      }else if (ele.tipo === 'mo') {
        const operacion = this.mano_refaccion(ele)
        if (ele.aprobado) {
          reporte.mo += operacion
        }
        ele.subtotal = operacion
        ele.total = operacion
        ele.costo = costo || 0
        new_ele = this._publicos.nuevaRecuperacionData(ele, campos_mo)
      }else if (ele.tipo === 'refaccion') {
        const operacion = this.mano_refaccion(ele)
        if (ele.aprobado) {
          // refacciones_new += operacion
          reporte.refacciones += operacion
        }
        ele.subtotal = operacion
        ele.total = operacion * margen
        ele.costo = costo || 0
        new_ele = this._publicos.nuevaRecuperacionData(ele, campos_refaccion)
      }
      return new_ele
    })
    let descuento = parseFloat(descuento_) || 0

    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))

    const {mo, refacciones} = reporte

    reporte.refacciones_v = reporte.refacciones * margen

    let nuevo_total = mo + reporte.refacciones_v
    
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

    reporte.ub = (nuevo_total - refacciones) * (100 / nuevo_total)
    return {reporte, servicios}
    
  }
  mano_refaccion(ele){
    const {costo, precio, cantidad} = ele
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete(data){    
    const {elementos} = data
    const reporte = {mo:0, refacciones:0}
    const nuevos_elementos = [...elementos]
    nuevos_elementos.forEach(ele=>{
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
  remplaza_informacion_subelementos(arreglo:any[], margen){
    const nuevos_subelementos = arreglo.map(elemento=>{
      const {tipo} = elemento
      let operacion = this.mano_refaccion(elemento)
      let subtotal = operacion, total = operacion
      const all = JSON.parse(JSON.stringify(elemento));
      
      if (tipo === 'refaccion') total = total * margen 
      const nueva_info = {...all,
        subtotal,
        total
      }     
      return nueva_info
    })
    return nuevos_subelementos
  }
  purifica_informacion(data){
    const nueva_ = JSON.parse(JSON.stringify(data));
    const {elementos} = nueva_
    const _elementos_purifica = (elementos) ? elementos : []
    const registra = _elementos_purifica.map(element => {
      const {tipo } = element
      const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
      const campos_refaccion = [ ...campos_mo, 'marca']
      const campos_paquete = [ 'aprobado', 'cantidad', 'cilindros', 'costo', 'elementos', 'enCatalogo', 'id', 'marca', 'modelo', 'nombre', 'status', 'tipo' ]
      let nueva 
      switch (tipo) {
        case 'paquete':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_paquete)
          const info_su = this.purifica_informacion_interna(nueva.elementos)
          // console.log(info_su);
          nueva.elementos = info_su
          
          break;
        case 'mo':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_mo)
          break;
        case 'refaccion':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_refaccion)
          break;
      }

      //primera recuperacion 
      // console.log(nueva);
      return nueva
    });
    // console.log(registra);
    return registra
  }
  purifica_informacion_interna(elementos:any[]){
    const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
    const campos_refaccion = [ ...campos_mo, 'marca']

    const nuevos_elementos = elementos.map(e=>{
      const {tipo} = e
      e.nombre = String(e.nombre).toLowerCase()
      switch (tipo) {
        case 'mo':
        case 'MO':
          e.id = e.IDreferencia
          e.tipo = String(tipo).toLowerCase()
          
          return this._publicos.nuevaRecuperacionData(e,campos_mo)
        case 'refaccion':
          return this._publicos.nuevaRecuperacionData(e,campos_refaccion)
      }
    })

    return nuevos_elementos 

  }
  
}
