import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Router } from '@angular/router';
import { CamposSystemService } from '../../services/campos-system.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';


@Component({
  selector: 'app-template-tabla-recepciones',
  templateUrl: './template-tabla-recepciones.component.html',
  styleUrls: ['./template-tabla-recepciones.component.css'],
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
export class TemplateTablaRecepcionesComponent implements OnInit,OnChanges {

  constructor(private router: Router, private _campos: CamposSystemService, private _security:EncriptadoService) { }
  @Input() recepciones_arr:any[] = []
  @Input() muestra_desgloce:boolean = false
  @Input() muestra_cliente:boolean = false
  @Input() reales:boolean = false
  

  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
   cotizaciones = ['no_cotizacion','fullname','placas','fecha_recibido','fecha_entregado']; //cotizaciones
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; //cotizaciones
   expandedElement: any | null; //cotizaciones
   @ViewChild('recepcionesPaginator') paginator: MatPaginator //cotizaciones
   @ViewChild('recepciones') sort: MatSort //cotizaciones
   
   formasPago = [...this._campos.formasPago]

  reporte_totales = {
    mo:0,
    refaccion:0,
    refaccionVenta:0,
    subtotal:0,
    iva:0,
    descuento:0,
    total:0,
    meses:0,
    ub:0,
  }
  campos_reporte_show = [
    {valor: 'mo', show:'mo'},
    {valor: 'refaccion', show:'refacciones'},
    {valor: 'refaccionVenta', show:'refacciones venta'},
    {valor: 'subtotal', show:'subtotal'},
    {valor: 'iva', show:'iva'},
    {valor: 'descuento', show:'descuento'},
    {valor: 'total', show:'total'},
    {valor: 'meses', show:'meses'},
  ]
  miniColumnas:number = 100


  servicio_editar
  contador_resultados:number = 0

  rol_:string
  ngOnInit(): void {
    this.roles()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['recepciones_arr']) {
      const nuevoValor = changes['recepciones_arr'].currentValue;
      const valorAnterior = changes['recepciones_arr'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      // console.log(this.recepciones_arr);
      this.contador_resultados = this.recepciones_arr.length
        this.obtener_total_cotizaciones()
    }
  } 
  roles(){
    const { rol, sucursal } = this._security.usuarioRol()
    this.rol_ = rol
  }
  irPagina(pagina, data, nueva?){
    const {cliente, sucursal, id: idCotizacion, tipo, vehiculo } = data
    console.log(data);
    
    let queryParams = {}

    if (this.rol_ === 'cliente') {
      if (pagina === 'cotizacionNueva' && !tipo) {
        pagina = 'cotizacion-new-cliente'
        queryParams = { anterior:'miPerfil',cliente, sucursal, recepcion: idCotizacion, tipo:'cotizacion',vehiculo} 
      }
    }else if(this.rol_ !=='cliente'){
      if (pagina ==='cotizacionNueva') {
        queryParams = { cliente, sucursal, recepcion: idCotizacion, tipo:'recepcion', vehiculo} 
      } else if(pagina === 'ServiciosConfirmar'){
        queryParams = { cliente, sucursal, recepcion: idCotizacion, tipo:'recepcion', vehiculo} 
      } else if(pagina === 'editar-os'){
        queryParams = { cliente, sucursal, recepcion: idCotizacion, tipo:'recepcion', vehiculo} 
      }
    }

    const ruta_Actual= this.router.url

    const ruta = ruta_Actual.split('/')

    const ruta_anterior = ruta[1].split('?')

    queryParams['anterior'] = ruta_anterior[0]
    
    
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  obtener_total_cotizaciones(){

    const reporte_totales = {
      mo:0,
      refacciones:0,
    }
    let margen_ = 0

    const nuevas = [...this.recepciones_arr]

    this.recepciones_arr = nuevas
    this.dataSource.data = nuevas
    this.newPagination()

    const nuevo_margen = margen_ / nuevas.length

    let subtotal = reporte_totales.mo + reporte_totales.refacciones

    const margen = 1 + (nuevo_margen / 100)
    
    let nueva_utilidad_operacion = (subtotal - reporte_totales.refacciones) * (100 / subtotal)

    this.reporte_totales.mo = reporte_totales.mo
    this.reporte_totales.refaccion = reporte_totales.refacciones
    this.reporte_totales.refaccionVenta = reporte_totales.refacciones * margen
    this.reporte_totales.subtotal = subtotal
    let total = reporte_totales.mo +  this.reporte_totales.refaccionVenta
    this.reporte_totales.total = total
    this.reporte_totales.ub = nueva_utilidad_operacion

  }
  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }





}
