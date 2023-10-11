import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Router } from '@angular/router';
import { CamposSystemService } from '../../services/campos-system.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';


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

  constructor(
    private router: Router, private _campos: CamposSystemService, private _security:EncriptadoService, 
    private _sucursales: SucursalesService, private _publicos: ServiciosPublicosService) { }
  @Input() recepciones_arr:any[] = []
  @Input() muestra_desgloce:boolean = false
  @Input() muestra_cliente:boolean = false
  @Input() reales:boolean = false
  @Input() filtro:boolean = false

  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
   cotizaciones = ['no_cotizacion','fullname','placas','fecha_recibido','fecha_entregado']; //cotizaciones
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; //cotizaciones
   expandedElement: any | null; //cotizaciones
   @ViewChild('recepcionesPaginator') paginator: MatPaginator //cotizaciones
   @ViewChild('recepciones') sort: MatSort //cotizaciones
   
   formasPago = [...this._campos.formasPago]
   sucursales_array = [...this._sucursales.lista_en_duro_sucursales]
   reporte_totales = {
    mo:0,
    refaccion:0,
    refaccionVenta:0,
    subtotal:0,
    iva:0,
    descuento:0,
    total:0,
    // meses:0,
    ub:0,
  }

  miniColumnas:number = 100

  // servicio_editar
  contador_resultados:number = 0

  _rol:string
  _sucursal:string

  filtro_sucursal:string
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
    this._rol = rol
    this._sucursal = sucursal
    
  }
  irPagina(pagina, data, nueva?){
    const {cliente, sucursal, id: idCotizacion, tipo, vehiculo } = data
    console.log(data);
    
    let queryParams = {}

    if (this._rol === 'cliente') {
      if (pagina === 'cotizacionNueva' && !tipo) {
        pagina = 'cotizacion-new-cliente'
        queryParams = { anterior:'miPerfil',cliente, sucursal, recepcion: idCotizacion, tipo:'cotizacion',vehiculo} 
      }
    }else if(this._rol !=='cliente'){
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

    this.reporte_totales = suma_reportes(this.recepciones_arr)
    function suma_reportes  (cotizaciones) {
      const sumas = {mo:0,refaccion: 0,refaccionVenta: 0,subtotal: 0,total: 0,iva: 0,ub: 0,descuento: 0}
      const campos = ['mo','refaccion','refaccionVenta','subtotal','total','iva','ub','descuento']
      let nuevas = [...cotizaciones]
      nuevas.forEach(coti=>{
        const {reporte} = coti
        campos.forEach(campo=>{
          sumas[campo] += parseInt(reporte[campo])
        })
      })
      sumas.ub = sumas.ub / nuevas.length
      return sumas
    }
    this.dataSource.data = this.recepciones_arr
    this.newPagination()
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

  filtra_informacion(){
    
    const nuevas = [...this.recepciones_arr]
    const ordenar = (this.filtro_sucursal === 'Todas') ? nuevas : this._publicos.filtra_campo(nuevas,'sucursal',this.filtro_sucursal)
    const resultados = this._publicos.ordenamiento_fechas(ordenar,'fecha_recibido',false)

    this.contador_resultados = resultados.length
    this.dataSource.data = resultados
    this.newPagination()
  }





}
