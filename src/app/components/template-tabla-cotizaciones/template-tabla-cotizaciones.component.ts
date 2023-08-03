import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { CamposSystemService } from 'src/app/services/campos-system.service';

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

  constructor(private router: Router, private _campos: CamposSystemService) { }
  @Input() cotizaciones_arr:any[]
  @Input() muestra_desgloce:boolean = false

  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
   cotizaciones = ['no_cotizacion','fullname','placas']; //cotizaciones
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; //cotizaciones
   expandedElement: any | null; //cotizaciones
   @ViewChild('cotizacionesPaginator') paginator: MatPaginator //cotizaciones
   @ViewChild('cotizaciones') sort: MatSort //cotizaciones
   
   formasPago = [...this._campos.formasPago]

  reporte_totales = {
    mo:0,
    refacciones:0,
    refacciones_v:0,
    subtotal:0,
    iva:0,
    descuento:0,
    total:0,
    meses:0,
    ub:0,
  }
  campos_reporte_show = [
    {valor: 'mo', show:'mo'},
    {valor: 'refacciones', show:'refacciones'},
    {valor: 'refacciones_v', show:'refacciones venta'},
    {valor: 'subtotal', show:'subtotal'},
    {valor: 'iva', show:'iva'},
    {valor: 'descuento', show:'descuento'},
    {valor: 'total', show:'total'},
    {valor: 'meses', show:'meses'},
  ]
  miniColumnas:number = 100
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['cotizaciones_arr']) {
      const nuevoValor = changes['cotizaciones_arr'].currentValue;
      const valorAnterior = changes['cotizaciones_arr'].previousValue;
      // console.log({nuevoValor, valorAnterior});
        this.obtener_total_cotizaciones()
    }
  }

  irPagina(pagina, data){
    console.log(data);
    const {cliente, sucursal, id: idCotizacion, tipo } = data
    // console.log(this.enrutamiento);
    let queryParams = {}
    if (pagina === 'cotizacionNueva' && !tipo) {
      queryParams = { anterior:'historial-vehiculo',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion'} 
    }else if (pagina === 'cotizacionNueva' && tipo) {
      queryParams = { anterior:'historial-vehiculo', tipo} 
    }else if (pagina === 'ServiciosConfirmar' && !tipo) {
      queryParams = { anterior:'historial-vehiculo',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion'} 
    }else if (pagina === 'ServiciosConfirmar' && tipo) {
      queryParams = { anterior:'historial-vehiculo', tipo}
    }
    console.log(queryParams);
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  obtener_total_cotizaciones(){

    const reporte_totales = {
      mo:0,
      refacciones:0,
    }
    let margen_ = 0

    const nuevas = [...this.cotizaciones_arr]
    nuevas.map(g=>{
      margen_ += g.margen
      const  {reporte, servicios} = this.calcularTotales(g)
      Object.keys(reporte_totales).forEach(campo=>{
        reporte_totales[campo] += reporte[campo]
      })
      g.elementos = servicios
      g.reporte = reporte
      // nueva_utilidad_suma += reporte.ub
    })
    this.dataSource.data = nuevas
    this.newPagination()
    this.cotizaciones_arr = nuevas

    const nuevo_margen = margen_ / nuevas.length

    let subtotal = reporte_totales.mo + reporte_totales.refacciones
    const margen = 1 + (nuevo_margen / 100)
    
    
    
    let nueva_utilidad_operacion = (subtotal - reporte_totales.refacciones) * (100 / subtotal)

    this.reporte_totales.mo = reporte_totales.mo
    this.reporte_totales.refacciones = reporte_totales.refacciones
    this.reporte_totales.refacciones_v = reporte_totales.refacciones * margen
    this.reporte_totales.subtotal = subtotal
    let total = reporte_totales.mo +  this.reporte_totales.refacciones_v
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
  calcularTotales(data) {
    const {margen: new_margen, formaPago, elementos: servicios_, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0}
    // let refacciones_new = 0
    const servicios = [...servicios_] 
    
    const margen = 1 + (new_margen / 100)
    servicios.map(ele=>{
      const {cantidad, costo} = ele
      if (ele.tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          reporte.mo += mo
          reporte.refacciones += refacciones
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
          // refacciones_new += operacion
          reporte.refacciones += operacion
        }
        ele.subtotal = operacion
        ele.total = operacion * margen
      }
      return ele
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

}
