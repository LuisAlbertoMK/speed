import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { CamposSystemService } from 'src/app/services/campos-system.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

@Component({
  selector: 'app-template-tabla-cotizaciones',
  templateUrl: './template-tabla-cotizaciones.component.html',
  styleUrls: ['./template-tabla-cotizaciones.component.css'],
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
export class TemplateTablaCotizacionesComponent implements OnInit,OnChanges {

  constructor(private router: Router, private _campos: CamposSystemService, private _security:EncriptadoService, 
    private _exporter_excel: ExporterService, private _sucursales: SucursalesService, private _publicos: ServiciosPublicosService) { }
  @Input() cotizaciones_arr:any[]
  @Input() muestra_desgloce:boolean = false
  @Input() export:boolean = false
  @Input() filtro:boolean = false 
  
  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
   cotizaciones = ['no_cotizacion','fullname','placas','fecha_recibido']; //cotizaciones
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; //cotizaciones
   expandedElement: any | null; //cotizaciones
   @ViewChild('cotizacionesPaginator') paginator: MatPaginator //cotizaciones
   @ViewChild('cotizaciones') sort: MatSort //cotizaciones
   
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
  _rol:string
  _sucursal:string
  filtro_sucursal:string
  ngOnInit(): void {
    this.roles()
  }
  roles(){
    const { rol, sucursal } = this._security.usuarioRol()
    this._rol = rol
    this._sucursal = sucursal
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['cotizaciones_arr']) {
      const nuevoValor = changes['cotizaciones_arr'].currentValue;
      const valorAnterior = changes['cotizaciones_arr'].previousValue;
      // console.log({nuevoValor, valorAnterior});
        // this.obtener_total_cotizaciones()
        this.asignacion_calculos()
    }
  }

  asignacion_calculos(){
    console.log(this.cotizaciones_arr);

    // console.log(suma_reportes(this.cotizaciones_arr));
    this.reporte_totales = suma_reportes(this.cotizaciones_arr)


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
    this.dataSource.data = this.cotizaciones_arr
    this.newPagination()
  }
  exportar(){
    if (this.dataSource.data.length) {
      this._exporter_excel.exportToExcelCotizaciones(this.dataSource.data,'exportacion')
    }else{
      this._publicos.swalToast(`Sin datos para la exportacion`,0)
    }
  }


  irPagina(pagina, data){
    const {cliente, sucursal, id: idCotizacion, tipo, vehiculo } = data
    let queryParams = {}
    
    if (this._rol === 'cliente') {
      if (pagina === 'cotizacionNueva' && !tipo) {
        pagina = 'cotizacion-new-cliente'
        queryParams = { anterior:'miPerfil',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion',vehiculo} 
      }
    }else if(this._rol !=='cliente'){
      if (pagina === 'cotizacionNueva' && !tipo) {
        queryParams = { anterior:'historial-vehiculo', cotizacion: idCotizacion} 
      }else if (pagina === 'cotizacionNueva' && tipo) {
        queryParams = { anterior:'historial-vehiculo', tipo, vehiculo} 
      }else if (pagina === 'ServiciosConfirmar' && !tipo) {
        queryParams = { anterior:'historial-vehiculo', cotizacion: idCotizacion} 
      }else if (pagina === 'ServiciosConfirmar' && tipo) {
        queryParams = { anterior:'historial-vehiculo', tipo, vehiculo}
      }
    }    
    this.router.navigate([`/${pagina}`], { queryParams });
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
    
    const nuevas = [...this.cotizaciones_arr]
    const ordenar = (this.filtro_sucursal === 'Todas') ? nuevas : this._publicos.filtra_campo(nuevas,'sucursal',this.filtro_sucursal)
    const resultados = this._publicos.ordenamiento_fechas(ordenar,'fecha_recibido',false)

    this.dataSource.data = resultados
    this.newPagination()
  }

}
