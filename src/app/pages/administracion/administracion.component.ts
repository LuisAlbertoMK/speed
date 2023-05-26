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
    
    

  }
}
