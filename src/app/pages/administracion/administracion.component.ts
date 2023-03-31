import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { child, get, getDatabase, onValue, ref, push } from 'firebase/database';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import Swal from 'sweetalert2';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import { animate, state, style, transition, trigger } from '@angular/animations';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css'],
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
export class AdministracionComponent implements OnInit {
  ROL:string = ''; SUCURSAL:string = null
  fecha:string =''
  hora:string =''
  anio:number = 0
  mes:number = 0
  dia:number =0
  miniColumnas:number = 100
  @ViewChild('pag_servicios') paginator: MatPaginator;
  @ViewChild('tab_servicios') sort: MatSort;

  @ViewChild('pag_IE') paginatorIE: MatPaginator;
  @ViewChild('tab_IE') sortIE: MatSort;

  @ViewChild('pag_I') paginatorI: MatPaginator;
  @ViewChild('tab_I') sortI: MatSort;

  @ViewChild('pag_E') paginatorE: MatPaginator;
  @ViewChild('tab_E') sortE: MatSort;
  
  expandedElement: any | null;
  clickedRows = new Set<any>();

  dataSource = new MatTableDataSource();
  dataSourceIngresosEgresos = new MatTableDataSource();
  dataSourceIngresos = new MatTableDataSource();
  dataSourceEgresos = new MatTableDataSource();
  
  columnasRecepciones:string[]=['no_os','status','placas','fecha_recibido','fecha_entregado'];
  columnasRecepcionesExtended:string[]=[...this.columnasRecepciones,'expand'];
  
  columnasIE: string []= ['index','no_os','tipo','concepto','fecha','metodo','monto']
  columnasI: string []= [...this.columnasIE]
  columnasE: string []= [...this.columnasIE]

  totalAdmin:number = 0
  range = new FormGroup({
    start: new FormControl(Date),
    end: new FormControl(Date),
  });
  range2 = new FormGroup({
    start: new FormControl(Date),
    end: new FormControl(Date),
  });

  personalizado = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });

  fechamuestraStart:string = ''
  fechamuestraEnd:string = ''
  fechaSelect={valor:'hoy',show:'Hoy'}
  fechaSelect2={valor:'hoy',show:'Hoy'}
  busquedaStatus={valor:'fecha_compara_recibido', show:'Recibido'}
  sucursalSelect= {valor: 'Todas', show:'Todas'}
  sucursalSelect2= {valor: 'Todas', show:'Todas'}
  totalResultados:number = 0

  apartados: string[] = ['Servicios', 'Proceso', 'IVA', 'Cobrado','Costos','Ganancias','Costos operacion'];

  fechas_search = {inicio:null, final:null}
  servicios = []

  ordena:boolean = true;
  info_recepcion:any = {}
  formPago: FormGroup;
  formaGasto: FormGroup
  pagoTotal:boolean= false
  listaPagos = [
    {valor: 'total', muestra: 'Total servicio: '},
    {valor: 'subtotal', muestra: 'Subtotal servicio: '},
    {valor: 'pagado', muestra: 'Pagados: '},
    {valor: 'gastos', muestra: 'Gastos: '},
    {valor: 'utilidad', muestra: 'Utilidad sin IVA: '},
    {valor: 'utilidad_iva', muestra: 'Utilidad con IVA: '},
    {valor: 'debe', muestra: 'Restante por pagar'},
  ]
  MetodosPago = [
    {metodo:1, muestra:'Efectivo'},
    {metodo:2, muestra:'Cheque'},
    {metodo:3, muestra:'Tarjeta'},
    {metodo:4, muestra:'Transferencia'},
  ]
  camposDesgloce = [
    {show:'U.B', valor:'UB'},
    {show:'M.O', valor:'mo'},
    {show:'Costo de refaccion', valor:'refacciones_1'},
    {show:'Precio de venta refaccion', valor:'refacciones_2'},
    {show:'Sobrescrito MO', valor:'sobrescrito_mo'},
    {show:'Sobrescrito refacciones', valor:'sobrescrito_refaccion'},
    {show:'Sobrescrito paquetes', valor:'sobrescrito_paquetes'},
    {show:'I.V.A', valor:'iva'},
    {show:'Subtotal antes de I.V.A', valor:'subtotal'},
    {show:'Total', valor:'total'},
    // {show:`meses ${this.meses}`, valor:'meses'},
  ]
  desgloceAsigando = {}
  desgloce_serv = [
    {valor:'total_por_cobrar', muestra:'total por cobrar'}
  ]
  total_por_cobrar = 0; total_cobrar =0; cobrado =0;

  ingresos_egresos = {ingresos:0, egresos:0}
  imagenZoom:any

  sucursales:any[]=[];
  clientes:any=[];

  showFiller = false;

  showPago:boolean = false
  showGasto:boolean = false
  recepciones=[]
  dataHistorial = {Efectivo:0,Cheque:0,Tarjeta:0,Transferencia:0, subtotal: 0, total:0}
  ingresos=[]; egresos=[]
  ingresosEgresos =[]

  servTemp=[]

  filtrosfechas = [
    {valor:'hoy', show:'Hoy'},
    {valor:'ayer', show:'Ayer'},
    {valor:'ult_7Dias', show:'Últimos 7 dias'},
    {valor:'ult_30Dias', show:'Últimos 30 dias'},
    {valor:'ult_mes', show:'mes anterior'},
    {valor:'este_anio', show:'Este año'},
    {valor:'ult_anio', show:'Año anterior'},
    {valor:'personalizado', show:'Personalizado'},
  ]

  filtrofechaRE = [
    {valor:'fecha_compara_recibido',show:'Recibido'},
    {valor:'fecha_compara_entrega',show:'Entregado'},
  ]
  porMetodo_pago = { Efectivo:0,Cheque:0,Tarjeta:0,Transferencia:0 }
  porMetodo_gasto = { Efectivo:0,Cheque:0,Tarjeta:0,Transferencia:0 }
  porMetodo_PG = { Efectivo:0,Cheque:0,Tarjeta:0,Transferencia:0 }
  desgloce_final = { Efectivo:0,Cheque:0,Tarjeta:0,Transferencia:0,Total:0 }

  listaHistorialPG = []
  fechasRango = {inicio:'', final:''}
  fechaG = {inicio:null, final:null}

  camposReporte={servicios:0,ticket:0,tiempoEstancia:0,horas_totales:0,horas_servicios:0}
  camposReporte_arr=[
  {valor:'servicios', show:'servicios'},
  {valor:'ticket', show:'ticket'},
  {valor:'tiempoEstancia', show:'tiempo Estancia'},
  {valor:'horas_totales', show:'horas totales'},
  {valor:'horas_servicios', show:'horas servicios'}]
  total_GO =0

  deCual = ['dia','mes','anio']
  diasX = 'dia'
  constructor(
    private router:Router, private _security:EncriptadoService, private _publicos: ServiciosPublicosService,
    private _servicios: ServiciosService, private fb: FormBuilder,private _sucursales: SucursalesService,
    private _clientes:ClientesService, private _exporter : ExporterService
    ) {
      
    }
  ngOnInit(): void {
    
    this.rol()
    
    // this.registrosAdmin()
    this.crearFormPago()
    this.crearFormGastos()
    this.getFechaBalance()
    this.listaSucursales()
    

  }
  cambia(valor:boolean, cual:string){
    if(cual === 'pago'){
      this.showPago = valor
      this.showGasto = false
    }else{
      this.showPago = false
      this.showGasto = valor
    }
  }

  listaSucursales(){
    this._sucursales.consultaSucursales().then(({contenido,data})=>{
      if (contenido) {
        this.sucursales = data
        this.Listaclientes()
      }
    })
  }
  async Listaclientes(){
    const starCountRefClientes = ref(db, `clientes`)
    await onValue(starCountRefClientes, (snapshot) => {
      this._clientes.ListaClientes().then(async ({existe,clientes})=>{
        if (existe) {
          clientes.map(async(c)=>{
            if (!c['vehiculos']){ c['vehiculos'] = []; }
            const arreglo_vehiculos = await  this._publicos.crearArreglo2(c['vehiculos'])
            c['vehiculos'] = arreglo_vehiculos
            this.sucursales.map(s=>{   
              if (c['sucursal'] === s['id']) {
                c['infoSucursal'] = s
              }
            })
            
          })
          let clientes_nuevos = [];
          (this.SUCURSAL !== 'Todas')? clientes_nuevos = clientes.filter(o=>o.sucursal === this.SUCURSAL): clientes_nuevos  = clientes;
         
          this.clientes = clientes_nuevos
          await this.listaRecepciones()
          if(this.clientes.length){
            setTimeout(() => {
              this.rol()
            }, 100);
          } 
        }else{
          this.clientes = []
        }
      })
    })
  }
  async listaRecepciones(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, async (snapshot) => {
      await this._servicios.getRecepcionesnew().
      then(async ({valido,data})=>{
        // console.log(cotizaciones);
        if (valido) {
          await data.map(async(d)=>{
            // console.log(d['id']);
            
            if (d['HistorialGastos']) {
              // console.log(d['HistorialGastos']);
            }
            this.clientes.map(async (cli)=>{
              if(d['cliente'] === cli['id']) {
              if (cli['id'] === "-NMidpyPu8Cb9fVvE9GM") {
                console.log(cli['id']);
                
              }
                d['infoCliente'] = cli
                const vehiculos:any[] = cli['vehiculos']
                if (vehiculos) {
                  vehiculos.map(v=>{
                    if( d['vehiculo'] === v['id']) d['infoVehiculo'] = v
                  })
                }
                // // d['desgloce'] = {}
                // this._publicos.realizarOperaciones(d,'servicios').then((ans)=>{
                //   d['desgloce'] = ans
                // })
              }
            })
            d['infoSucursal'] = this.sucursales.find(o=>o['id'] === d['sucursal'])
            if (d['fecha_recibido']) {
              const aqui = d['fecha_recibido'].split('/')
              d['fecha_compara_recibido'] = new Date(aqui[2],aqui[1] - 1,aqui[0],0,0,0,0)
            }
            if (d['fecha_entregado']) {
              const aqui2 = d['fecha_entregado'].split('/')
              d['fecha_compara_entrega'] = new Date(aqui2[2],aqui2[1] - 1,aqui2[0],0,0,0,0) 
            }
            // this.clientes.map(c=>{
            //   const vehiculos = c['vehiculos']
            //   vehiculos.map(v=>{
            //     if (v['id'] === d['vehiculo']) d['infoVehiculo'] = v
            //   })
            // })
            d['desgloce'] = this._publicos.realizarOperacion(d,'servicios')
            const ser = d['servicios']
            ser.forEach((element,index) => {
              if (element['tipo'] === 'paquete' && element['aprobado']) {
                if (element['costo']>0) {
                  ser[index].precio = element['costo']
                }else{
                  const costo = this._publicos.costodePaquete( element['elementos'],d['margen'])
                  ser[index].precio = costo.flotilla
                }
              }
            });
          })
          this.servTemp = data
          // this.obtenerResultados()
          this.listadodePG()
        }
      })
    })
    ///     VER PORQUE N TOMA LOS RESULTADOS DE LAS RECEPIONES FILTRADAS
  }

nuevaRpor(){
  // console.log(this.servTemp);
  const gas_op =this.listaHistorialPG
  const ordenes = this.servTemp
  const ordenesEntregado = ordenes.filter(o=>o['status'] === 'entregado')
 
  let PG_Alls =[]
  ordenesEntregado.forEach((o)=>{
    if (o['HistorialPagos']) {
      const arreglo = this._publicos.crearArreglo2(o['HistorialPagos'])
      arreglo.forEach(a=>{
        const data = {
          ...a,
          id_orden: o['id'],
          no_os: o['no_os'],
          tipo:'pago',
          donde: 'HistorialPagos'
        }
        PG_Alls.push(data)
      })
    }
    if (o['HistorialGastos']) {
      const arreglo = this._publicos.crearArreglo2(o['HistorialGastos'])
      arreglo.forEach(a=>{
        const data = {
          ...a,
          id_orden: o['id'],
          no_os: o['no_os'],
          tipo:'gasto',
          donde: 'HistorialGastos'
        }
        PG_Alls.push(data)
      })
    }
  })
  gas_op.forEach((o)=>{
    const data = {
      ...o,
      donde: 'HistorialGastosOperacion'
    }
    PG_Alls.push(data)
  })
  PG_Alls.map(a=>{
    // console.log(a['id']);
    
    const fechaCompara_ = this._publicos.construyeFechaString(a['fecha'],a['hora'])
    // const fechaCompara_registro = this._publicos.construyeFechaString(a['fecha_registro'],a['hora_registro'])
    a['fechaCompara'] = fechaCompara_
    // a['fechaCompara_registro'] = fechaCompara_registro
    
  })
  // console.log(this.fechaSelect2);
  const {valor, show} = this.fechaSelect2
  // console.log(PG_Alls);
  let numero: number =0, tipo ='resta',donde='dia'
  let fechas
  switch (valor) {
    case 'hoy':
      donde= 'dia'
      numero=0
      fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
      break;
    case 'ayer':
      numero = 1
      donde = 'dia'
      fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
      break;
    case 'ult_7Dias':
      numero = 7
      donde = 'dia'
      fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
      break;
    case 'ult_30Dias':
      numero = 30
      donde = 'dia'
      fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
      break;
    case 'ult_mes':
      donde = 'mes'
      numero = 1
      fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
      break;
    case 'este_anio':
      numero = 0
      donde = 'anio'
      fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
      break;
    case 'ult_anio':
      donde = 'anio'
      numero = 1
      fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
      break;
    case 'personalizado':
      
      break;
  
    default:
      break;
  }

  
  console.log(fechas);
  
  let resultadosPG = []
  // PG_Alls.forEach((a)=>{
  //   if (a['fechaCompara' ] >= getTime1 && a['fechaCompara' ] <= getTime2) resultadosPG.push(a)
  // })

  // console.log(resultadosPG);
  
  
  
}

validaFecha(){
  


  const {start, end } = this.personalizado.value
  if (start && end) {
    if ((start['_d'] instanceof Date) && (end['_d'] instanceof Date)) {
      this.nuevaRpor()
    }
  }
}

  asignaSucursal2(data:any){
    this.sucursalSelect2.valor = data['id']
    this.sucursalSelect2.show = data['sucursal']
    this.obtenerResultadosPG()
  }
  asignaSucursal(data:any){
    this.sucursalSelect.valor = data['id']
    this.sucursalSelect.show = data['sucursal']
    // this.obtenerResultados()
  }
  aisgnaFecha(data:any){
    this.fechaSelect = data
    // this.obtenerResultados()
  }
  aisgnaFecha2(data:any){
    this.fechaSelect2 = data
    this.obtenerResultadosPG()
  }
  asignaBusqueda(data:any){
    this.busquedaStatus = data
    // this.obtenerResultados()
  }
  

obtenerResultadosPG(){


// variables constantes para ambos
  const fechaHoy = new Date(); fechaHoy.setHours(0,0,0,0)
  const criteriosPG = {inicio: fechaHoy, final : fechaHoy, tipo: 'recibido', resultadosAmbos: [], resultadosP:[], resultadosG:[]}
  const desglocePG = {Efectivo:0,Cheque:0,Tarjeta:0,Transferencia:0}
  const desgloceP = {...desglocePG}
  const desgloceG = {...desglocePG}
  let pagosPG=[], ingresos_arr=[], gastos_arr=[]
  const campos= ['Efectivo','Cheque','Tarjeta','Transferencia']

  const criteriosER = {inicio: fechaHoy, final : fechaHoy, tipo: 'recibido', resultados: [], desgloce:{} }
  let diasMes = 1, diasMesPG=1, anio =fechaHoy.getFullYear()
  let valor = 'ult_30Dias'
  switch (this.fechaSelect2.valor) {
    case 'ayer':
      criteriosPG.final = new Date(fechaHoy); criteriosPG.inicio.setDate(criteriosPG.final.getDate() - 1)
      criteriosPG.inicio.setHours(0,0,0,0)
    break;
    case 'ult_7Dias':
      criteriosPG.final = new Date(fechaHoy); criteriosPG.inicio.setDate(criteriosPG.final.getDate() - 7)
      criteriosPG.inicio.setHours(0,0,0,0)
    break;
    case 'ult_30Dias':
      criteriosPG.final = new Date(fechaHoy); criteriosPG.inicio.setDate(criteriosPG.final.getDate() - 30)
      criteriosPG.inicio.setHours(0,0,0,0)
    break;
    case 'ult_mes':
      criteriosPG.inicio.setMonth(fechaHoy.getMonth() -1 )
      diasMes = new Date(criteriosPG.inicio.getFullYear(), criteriosPG.inicio.getMonth(),0).getDate()
      criteriosPG.inicio = new Date(criteriosPG.inicio.getFullYear(), criteriosPG.inicio.getMonth(),1,0,0,0,0)
      criteriosPG.final = new Date(criteriosPG.inicio.getFullYear(), criteriosPG.inicio.getMonth(),diasMes,0,0,0,0)
    break;
    case 'este_anio':
      criteriosPG.inicio = new Date(anio,0,1); criteriosPG.final = new Date(anio,11,31)
    break;
    case 'ult_anio':
      anio =fechaHoy.getFullYear() - 1
      criteriosPG.inicio = new Date(anio,0,1); criteriosPG.final = new Date(anio,11,31)
    break;
    case 'personalizado':
      if (this.range2.controls['start'].value && this.range2.controls['end'].value) {
        criteriosPG.inicio = new Date(this.range2.value.start._d)
        criteriosPG.final = new Date(this.range2.value.end._d)
      }
    break;
    default:
      criteriosPG.inicio = fechaHoy; criteriosPG.final = fechaHoy
    break;
  }
  this.fechasRango.inicio = this._publicos.fechaNueva(criteriosPG.inicio)
  this.fechasRango.final = this._publicos.fechaNueva(criteriosPG.final)
  criteriosPG.tipo = 'fecha_compara_recibido'
  /// variables para obtener los servicios



  let filtro_servicios2 = this.servTemp;

  let resultados_servicios = []
  filtro_servicios2.forEach((a)=>{
    if (a[criteriosPG.tipo ] >= criteriosPG.inicio && a[criteriosPG.tipo ] <= criteriosPG.final) resultados_servicios.push(a)
  })
  let resultados2 =[]
  if (criteriosER.tipo.toLowerCase() !=='cancelado') {
    resultados2 = resultados_servicios.filter(o=>o['status'] !== 'cancelado')
  }else{
    resultados2 = resultados_servicios.filter(o=>o['status'] === 'entregado')
  }
  const realizar:any[] = resultados2;


  let otros = [];
  (this.sucursalSelect2.valor === 'Todas') ? otros = resultados2 : otros = resultados2.filter(g=>g['sucursal'] === this.sucursalSelect2.valor)



  const desgloce = {
    UB:0,mo:0,refacciones_1:0,refacciones_2:0,sobrescrito_mo:0,sobrescrito_refaccion:0,sobrescrito_paquetes:0,
    iva:0,subtotal:0,total:0}


    otros.forEach(r=>{
      const desglo = r['desgloce']
        if (r['desgloce']) {
          this.camposDesgloce.map(des=>{
            const valor = des.valor
            if (desglo[valor]) desgloce[valor] = desgloce[valor] + desglo[valor]
          })
        }
      })

      desgloce['UB'] = desgloce['UB'] / otros.length
      
      desgloce['UBC'] =  desgloce['total'] * (desgloce['UB'] / 100)
      // desgloce['CPR'] =  desgloce['total'] * ((                                                           100 - desgloce['UB']) / 100)
      criteriosER.desgloce = desgloce
      if(!this.recepciones.length){
        this.recepciones = otros
      }else{
        if (otros.length > this.recepciones.length) {
          const inicio = this.recepciones.length
          for (let index = inicio; index < otros.length; index++) {
            const cotizacion = otros[index]
            this.recepciones.push(cotizacion)
          }
        }else if(otros.length < this.recepciones.length){
          // console.log('aqui');
          this.recepciones  = otros
        }else if(otros.length == this.recepciones.length){
          const camposRecupera = ['infoCliente','infoVehiculo','iva','desgloce','fecha_recibido','hora_recibido',
          'status','tecnico','diasSucursal']
          this.recepciones.map((cot,index)=>{
            if (JSON.stringify(this.recepciones[index]) === JSON.stringify(otros[index])) return
            camposRecupera.map(cam=>{
            if (otros[index][cam]) {
              cot[cam] = otros[index][cam]
            }
            })
          })
        }
      }
      // console.log(otros);
      

      this.dataSource.data = otros
    // console.log(realizar);
    
    this.desgloceAsigando = criteriosER.desgloce
    this.newPagination('recepciones')


    





  ///variables para PG



  otros.forEach(pg=>{

    if (pg['HistorialPagos']) {
      const HP = this._publicos.crearArreglo2(pg['HistorialPagos'])
      HP.forEach((p)=>{
        const aqui = p['fecha'].split('/')
        p['fecha_compara'] = new Date(aqui[2],aqui[1] - 1,aqui[0],0,0,0,0)
        const {muestra} = this.MetodosPago.find(m=>m['metodo'] === p['metodo'])
        p['metodoShow'] = muestra
        const info = { ...p, sucursal: pg['sucursal'], usuario:'',tipo:'pago', tipoShow:'Pago' , id:0, rol:'', no_os: pg['no_os'] }
        // ingresos_arr.push(info)   
        pagosPG.push(info)
      })
    }
    if (pg['HistorialGastos']) {
      const HG =  this._publicos.crearArreglo2(pg['HistorialGastos']) 
      HG.forEach((p)=>{
        const aqui = p['fecha'].split('/')
        p['fecha_compara'] = new Date(aqui[2],aqui[1] - 1,aqui[0],0,0,0,0)
        const {muestra} = this.MetodosPago.find(m=>m['metodo'] === p['metodo'])
        p['metodoShow'] = muestra
        
        const info = { ...p, sucursal: pg['sucursal'], usuario:'', tipo:'orden',tipoShow:'Gasto de '+ 'orden', id:0, rol:'' , no_os: pg['no_os']}
        // gastos_arr.push(info)   metodo
        pagosPG.push(info)
      })
    }
  })

  
  
  let nuevo = []

  // console.log('---Listado');
  this.listaHistorialPG.forEach(o=>{  pagosPG.push(o)  })
  // if(this.sucursalSelect2.valor !== 'Todas') nuevo = this.listaHistorialPG.filter(o=>o['sucursal'] === this.sucursalSelect2.valor)

  
  

  let resultados_recepciones = []
 
  
  
  pagosPG.forEach((a)=>{    
    if (a['fecha_compara'] >= criteriosPG.inicio && a['fecha_compara'] <= criteriosPG.final) resultados_recepciones.push(a)
  })


  // console.log(resultados_recepciones);
  
  let filtrados_Sucursal =[]
  if (this.sucursalSelect2.valor === 'Todas') {
    filtrados_Sucursal = pagosPG
  }else{
    filtrados_Sucursal = pagosPG.filter(a=>a['sucursal'] === this.sucursalSelect2.valor)
  }
  
  // resultados_recepciones.forEach((pg)=>{
  //   this.MetodosPago.forEach((f)=> {  if(f.metodo == pg['metodo']) desglocePG[f.muestra] = desglocePG[f.muestra] + pg['monto'] })
  // })
  
  // console.log(this.MetodosPago);
  // console.log(resultados_recepciones);
  
  
  let pagos = resultados_recepciones.filter(p=>p['tipo'] ==='pago')
  let gastos = resultados_recepciones.filter(p=>p['tipo'] ==='orden')
  let operacion = resultados_recepciones.filter(p=>p['tipo'] ==='operacion')
  const desgloce_pagos = {Cheque: 0,Efectivo: 0, Tarjeta: 0,Transferencia: 0}
  const desgloce_gastos= {Cheque: 0,Efectivo: 0, Tarjeta: 0,Transferencia: 0}
  const desgloce_operacion= {Cheque: 0,Efectivo: 0, Tarjeta: 0,Transferencia: 0}
  const desgloce_final= {Cheque: 0,Efectivo: 0, Tarjeta: 0,Transferencia: 0, Total:0}

  pagos.forEach((pg)=>{
    this.MetodosPago.forEach((f)=> {  if(f.metodo == pg['metodo']) desgloce_pagos[f.muestra] = desgloce_pagos[f.muestra] + pg['monto'] })
  })
  gastos.forEach((pg)=>{
    this.MetodosPago.forEach((f)=> {  if(f.metodo == pg['metodo']) desgloce_gastos[f.muestra] = desgloce_gastos[f.muestra] + pg['monto'] })
  })
  operacion.forEach((pg)=>{
    this.MetodosPago.forEach((f)=> {  if(f.metodo == pg['metodo']) desgloce_operacion[f.muestra] = desgloce_operacion[f.muestra] + pg['monto'] })
  })
  // console.log(operacion);
  
  
  desgloce_final.Efectivo= desgloce_pagos.Efectivo - ( desgloce_gastos.Efectivo + desgloce_operacion.Efectivo)
  desgloce_final.Cheque= desgloce_pagos.Cheque - ( desgloce_gastos.Cheque + desgloce_operacion.Cheque)
  desgloce_final.Tarjeta= desgloce_pagos.Tarjeta - ( desgloce_gastos.Tarjeta + desgloce_operacion.Tarjeta)
  desgloce_final.Transferencia= desgloce_pagos.Transferencia - ( desgloce_gastos.Transferencia + desgloce_operacion.Transferencia)
  

  desgloce_final.Total = desgloce_final.Efectivo + desgloce_final.Cheque + desgloce_final.Tarjeta + desgloce_final.Transferencia
  // this.porMetodo_gasto.Tarjeta = desgloce_gastos.Tarjeta
  // console.log('desgloce_pagos--> ',desgloce_pagos);
  // console.log('desgloce_gastos--> ',desgloce_gastos);
  // console.log('desgloce_operacion--> ',desgloce_operacion);
  // console.log('desgloce_final--> ',desgloce_final);


  // console.log(this.MetodosPago);
  
  this.MetodosPago.forEach(met=>{
    this.porMetodo_pago[met.muestra] = desgloce_pagos[met.muestra]
    this.porMetodo_gasto[met.muestra] = ( desgloce_gastos[met.muestra] + desgloce_operacion[met.muestra])
    this.dataHistorial[met.muestra] = desgloce_final[met.muestra]
  })
  this.desgloce_final = desgloce_final

  // this.porMetodo_pago.Efectivo = desgloce_pagos.Efectivo
  // this.porMetodo_gasto.Efectivo = desgloce_gastos.Efectivo
  // this.dataHistorial.Efectivo = desgloce_final.Efectivo
  

  
  
  



  this.dataSourceIngresosEgresos.data = resultados_recepciones
  this.dataSourceIngresos.data = criteriosPG.resultadosP
  this.dataSourceEgresos.data = criteriosPG.resultadosG
  // this.dataSourceIngresosEgresos.data = resultados_recepciones
  this.newPagination('IE')
  this.newPagination('I')
  this.newPagination('E')
  
}

  crearFormPago(){
    this.formPago = this.fb.group({
      padre:['',[Validators.required]],
      metodo:['1',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      concepto:['',[Validators.required,Validators.minLength(3), Validators.maxLength(100)]],
      referencia:['',[Validators.minLength(3), Validators.maxLength(100)]],
      monto:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
    })
  }
  validarCampoPago(campo: string){
    return this.formPago.get(campo).invalid && this.formPago.get(campo).touched
  }
  async AsiganacionIndexPadre(data){
    this.info_recepcion = this.servicios.find(o=>o['id'] === data['id'])
    
    const _pagos = await this._servicios.realizarPagos(this.info_recepcion)
    this.info_recepcion['_pagos'] = _pagos
    this.formPago.controls['padre'].setValue(data['id'])
    this.formaGasto.controls['padre'].setValue(data['id'])

  }
  llenar(){
    // console.log(this.pagoTotal);
    if (this.pagoTotal) {
      // console.log(this.info_recepcion);
      const data = this._servicios.realizarPagos(this.info_recepcion)
      let HistorialPagos =  []
      // console.log(data);
      this.formPago.controls['padre'].setValue(this.info_recepcion['id'])
      // this.formaGasto.controls['padre'].setValue(this.info_recepcion['id'])
      this.info_recepcion['HistorialPagos'] ? HistorialPagos =  this.info_recepcion['HistorialPagos'] : HistorialPagos = []
      if (HistorialPagos.length>0) {
        const restante = data.debe
        this.formPago.controls['monto'].setValue( restante)
        this.formPago.controls['concepto'].setValue( 'liquidacion de pago')
      }else{
        this.formPago.controls['monto'].setValue( this.info_recepcion['desgloce'].total)
        this.formPago.controls['concepto'].setValue( 'Pago completo')
      }
    }else{
      this.formPago.controls['monto'].setValue( 0 )
      this.formPago.controls['concepto'].setValue(null)
    }
  }
  RegistraPago(){
    const valoresPago = this.formPago.value
    
    let HistorialPagos = []
    if (valoresPago['padre']) {
      const fechaGet = this._publicos.getFechaHora()
      
      this.info_recepcion['HistorialPagos'] ? HistorialPagos =  this.info_recepcion['HistorialPagos'] : HistorialPagos = []
      
      const tempData = {
        fecha: fechaGet.fecha,
        hora: fechaGet.hora,
        metodo: valoresPago['metodo'],
        monto: valoresPago['monto'],
        concepto: valoresPago['concepto'],
        status: true
      };
      
      
      if (valoresPago['monto'] > this.info_recepcion['desgloce'].total) return

      (valoresPago['referencia']) ? tempData['referencia'] = valoresPago['referencia'] : null
      let pagado = 0
      for (let index = 0; index < HistorialPagos.length; index++) {
        const element = HistorialPagos[index];
        if (element['status']) {
          pagado += element['monto']
        }
      }
      if (this.pagoTotal) {
        if (HistorialPagos.length>0) {
          const restante = this.info_recepcion['_pagos'].total - pagado
          tempData.concepto = 'liquidacion de pago'
          tempData.monto = restante
          HistorialPagos.push(tempData)
        }else{
          HistorialPagos =  []
          tempData['monto'] = this.info_recepcion['desgloce'].total
          tempData['concepto']  = `Pago completo`;
    
          (valoresPago['referencia']) ? tempData['referencia'] = valoresPago['referencia'] : null
  
          HistorialPagos.push(tempData)
        }
      }else{
        HistorialPagos.push(tempData)
      }
      // console.log(HistorialPagos);
      this._servicios.actualizahistorialPagos(valoresPago['padre'],HistorialPagos).then(async ({registroOK})=>{
        if (registroOK) {
          const _pagos = await this._servicios.realizarPagos(this.info_recepcion)
          this.info_recepcion['_pagos'] = _pagos
          this.pagoTotal = false
          this.limpiaFormualrio(valoresPago['padre'])
          this._publicos.mensajeCorrecto('Se agrego el pago')
        }
      })
    }
  }
  eliminarPago(index){
    // console.log(index);
    this._publicos.mensaje_pregunta('eliminar pago').then(({respuesta})=>{
      if (respuesta) {
        const pagos = this.info_recepcion['HistorialPagos']
        const borrar = false
        let HistorialPagos = []
        const id =  this.info_recepcion['id']
        if (id) {
          pagos[index].status = false
          HistorialPagos = pagos
        }
        
        // if (borrar) {
        //   pagos[index].status = false
        //   HistorialPagos = pagos.filter(o=>o['status'])
        // }else{
          pagos[index].status = false
          HistorialPagos = pagos
        // }
        // console.log(HistorialPagos);
        this._servicios.actualizahistorialPagos(id,HistorialPagos).then(async ({registroOK})=>{
          if (registroOK) {
            const _pagos = await this._servicios.realizarPagos(this.info_recepcion)
            this.info_recepcion['_pagos'] = _pagos
            // this.pagoTotal = false
            // this.limpiaFormualrio(id)
            this._publicos.mensajeCorrecto('Se cancelo el pago')
          }
        })
        
      }
    })
    
  }
  limpiaFormualrio(padre){
    this.formPago.reset({padre,metodo:1,concepto: null, referecnia:null, monto:0 })
  }

  crearFormGastos(){
    this.formaGasto = this.fb.group({
      padre:['',[Validators.required]],
      metodo:['1',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      concepto:['',[Validators.required,Validators.minLength(3), Validators.maxLength(100)]],
      referencia:['',[Validators.required,Validators.minLength(3), Validators.maxLength(100)]],
      monto:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
    })
  }
  validarCampoGasto(campo: string){
    return this.formaGasto.get(campo).invalid && this.formaGasto.get(campo).touched
  }
  RegistraGasto(){
    const valoresGastos = this.formaGasto.value
    const fechaGet = this._publicos.getFechaHora()
    const tempData = {
      metodo: valoresGastos['metodo'],
      concepto: valoresGastos['concepto'],
      referencia: valoresGastos['referencia'],
      monto: valoresGastos['monto'],
      fecha: fechaGet.fecha,
      hora: fechaGet.hora,
      status: true
    }
    let HistorialGastos =[]
    if (valoresGastos['padre']) {
      this.info_recepcion['HistorialGastos'] ? HistorialGastos =  this.info_recepcion['HistorialGastos'] : HistorialGastos = []
    }
    HistorialGastos.push(tempData)
    const id = valoresGastos['padre']
    this._servicios.actualizahistorialGastos(id,HistorialGastos).then(async ({registroOK})=>{
      if (registroOK) {
        this.limpiaFormualrioGasto(id)
        const _pagos = await this._servicios.realizarPagos(this.info_recepcion)
        this.info_recepcion['_pagos'] = _pagos
        this._publicos.mensajeCorrecto('Registro de gasto correcto')
      }else{
        this._publicos.mensajeIncorrecto('No se pudo registrar gasto')
      }
    })
  }
  limpiaFormualrioGasto(padre){
    this.formaGasto.reset({padre,metodo:1,concepto: null, referecnia:null, monto:0 })
  }
  eliminarGasto(index){
    this._publicos.mensaje_pregunta('eliminar pago').then(({respuesta})=>{
      if (respuesta) {
        const id =  this.info_recepcion['id']
        let gastos = []
        if (!id) return
        gastos = this.info_recepcion['HistorialGastos']
        gastos[index].status = false
        // console.log(gastos);
        this._servicios.actualizahistorialGastos(id,gastos).then(async ({registroOK})=>{
          if (registroOK) {
            const _pagos = await this._servicios.realizarPagos(this.info_recepcion)
            this.info_recepcion['_pagos'] = _pagos
            this._publicos.mensajeCorrecto('Se cancelo el pago')
          }else{
            this._publicos.mensajeIncorrecto('Problema al elimiar gasto')
          }
        })
      }
    })
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    // if (this.ROL!=='SuperSU') {
    //   this.router.navigateByUrl('/incio')
    // }
    if (this.SUCURSAL==='Todas') {
      
    }else{
      this.sucursalSelect2.show = ''
      this.sucursalSelect2.valor = this.SUCURSAL

    }
  }
  async listadodePG(){
    const starCountRef = ref(db, `HistorialGastosOperacion`)
    await onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        // let arreglo= this.crearArreglo2(snapshot.val())
        // console.log(this._publicos.crearArreglo2(snapshot.val()));
        let nuevos = this._publicos.crearArreglo2(snapshot.val())
        // const info = snapshot.val()
        // Object.keys(info).forEach(a => {
        //   const aqui = info[a]['fecha'].split('/')
        //   info[a]['fecha_compara'] = new Date(aqui[2],aqui[1] - 1,aqui[0],0,0,0,0)
        //   nuevos[a] = info[a]
        // });
        nuevos.forEach(pg=>{
          const aqui = pg['fecha'].split('/')
          pg['fecha_compara'] = new Date(aqui[2],aqui[1] - 1,aqui[0],0,0,0,0)
          pg['tipo'] = pg['tipo']
          pg['tipoShow'] = `Gasto de operacion`
          pg['no_os'] =''
          const {muestra} = this.MetodosPago.find(m=>m['metodo'] === pg['metodo'])
          pg['metodoShow'] = muestra
        })


        this.listaHistorialPG = nuevos
        this.obtenerResultadosPG()
      } else {
        this.obtenerResultadosPG()
        console.log("No data available");
      }
    })
  }
  getFechaBalance(){
    
  const timeGet = this._publicos.getFechaHora()
  const fecha = timeGet.fecha.split('/')
  const f1 = new Date(Number(fecha[2]),Number(fecha[1])-1,Number(fecha[0]))
  let f2 = new Date(Number(fecha[2]),Number(fecha[1])-1,1)

  if (f2.getDay()===0) {
    // console.log('tomar lunes y no domingo');
    f2 = new Date(Number(fecha[2]),Number(fecha[1])-1,2)
  }
  this.fechas_search.inicio =  `${f2.getDate()}/${f2.getMonth() + 1}/${f2.getFullYear()}`
  this.fechas_search.final =   `${f1.getDate()}/${f1.getMonth() + 1}/${f1.getFullYear()}`
  
  
    // this.getFechaHora()
    // const starCountRef = ref(db, `administracion`)
    //     onValue(starCountRef, (snapshot) => {
    //       this.verifica('end',this.rangoSelecccionado)
    //     })
  }
  

  ampliarImg(urlImagen){
    // console.log(urlImagen);
    this.imagenZoom = urlImagen
  }
  async ordenamiento(campo:string,ordena:boolean){
    const asnOrder = await this._publicos.ordenamiento(this.dataSource.data,campo,ordena)
    this.dataSource.data =  asnOrder
    // this.newPagination('recepciones')
    // this.ordena = ordena
    // return this.servicios
  }
  isSticky(columna:string) {
    return (columna).indexOf(columna) !== -1;
  }
  newPagination(tabla:string) {
    setTimeout(() => {
        if (tabla === 'recepciones') {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          this.geeraReportes()
          this.TotalGastosOperacion()
        }
        if (tabla === 'IE') {
          this.dataSourceIngresosEgresos.paginator = this.paginatorIE;
          this.dataSourceIngresosEgresos.sort = this.sortIE;
        }
        if (tabla === 'I') {
          this.dataSourceIngresos.paginator = this.paginatorI;
          this.dataSourceIngresos.sort = this.sortI;
        }
        if (tabla === 'E') {
          this.dataSourceEgresos.paginator = this.paginatorE;
          this.dataSourceEgresos.sort = this.sortE;
        }
      
    }, 800);
  }
  generaExcel(){
    // console.log(this.dataSource.data);
    // console.log(this.fechaG);
    
    // console.log(this.listaHistorialPG);
    const aplica = this.listaHistorialPG
    let gastos = 0
    aplica.forEach((g)=>{
      if (g['fecha_compara'] >= this.fechaG.inicio && g['fecha_compara'] <= this.fechaG.final) gastos+= g['monto']
    })
    // console.log(gastos);
    const nf = this._publicos.getFechaHora(this.fechaG.inicio).fecha
    const nf2 = this._publicos.getFechaHora(this.fechaG.final).fecha
    const nuevaFecha = [],nuevaFecha2 = []
    const ini = nf.split('/')
    const fin = nf2.split('/')
    
    if (Number(ini[0])<10) { nuevaFecha[0] = `0${ini[0]}` }else { nuevaFecha[0] = ini[0]}
    if (Number(ini[1])<10) { nuevaFecha[1] = `0${ini[1]}` }else { nuevaFecha[1] = ini[1]}
    nuevaFecha[2] = ini[2]
    if (Number(fin[0])<10) { nuevaFecha2[0] = `0${fin[0]}` }else { nuevaFecha2[0] = fin[0]}
    if (Number(fin[1])<10) { nuevaFecha2[1] = `0${fin[1]}` }else { nuevaFecha2[1] = fin[1]}
    nuevaFecha2[2] = fin[2]
    const fechaR = `${nuevaFecha.join('/')} - ${nuevaFecha2.join('/')}`
    // console.log(fechaR);
    
    if (this.dataSource.data.length) {
      this._exporter.generaReportenew(this.dataSource.data, fechaR,gastos)
    }
  }

  geeraReportes(){
    const reporte = this._publicos.generaCamposReporte(this.dataSource.data, this.busquedaStatus.show)
    this.camposReporte.tiempoEstancia = reporte.tiempoEstancia
    this.camposReporte.ticket = reporte.ticket
    this.camposReporte.horas_totales = reporte.horas_totales
    this.camposReporte.horas_servicios = reporte.horas_estancia
    this.camposReporte.servicios = this.dataSource.data.length
  }

  TotalGastosOperacion(){
    // console.log(this.listaHistorialPG);
    let total_GO =0
    this.listaHistorialPG.forEach(go=>{
      total_GO+= go['monto']
    })
    this.total_GO = total_GO
    
  }
}
