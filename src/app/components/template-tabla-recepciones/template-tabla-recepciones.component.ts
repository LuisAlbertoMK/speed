import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Router } from '@angular/router';
import { CamposSystemService } from '../../services/campos-system.service';


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

  constructor(private router: Router, private _campos: CamposSystemService) { }
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


  servicio_editar
  contador_resultados:number = 0

  ngOnInit(): void {
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
  irPagina(pagina, data, nueva?){
    const {cliente, sucursal, id: idCotizacion, tipo, vehiculo } = data
 
    let queryParams = {}
    
    if (pagina ==='cotizacionNueva') {
      queryParams = { cliente, sucursal, recepcion: idCotizacion, tipo:'recepcion', vehiculo} 
    } else if(pagina === 'ServiciosConfirmar'){
      queryParams = { cliente, sucursal, recepcion: idCotizacion, tipo:'recepcion', vehiculo} 
    } else if(pagina === 'editar-os'){
      queryParams = { cliente, sucursal, recepcion: idCotizacion, tipo:'recepcion', vehiculo} 
    }

    // console.log(this.enrutamiento);
    // if (pagina === 'cotizacionNueva' && !tipo) {
    //   queryParams = { anterior:'historial-vehiculo',cliente, sucursal, recepcion: idCotizacion, tipo:'recepcion', vehiculo} 
    // }else if (pagina === 'cotizacionNueva' && tipo) {
    //   queryParams = { anterior:'historial-vehiculo', tipo, vehiculo} 
    // }else if (pagina === 'ServiciosConfirmar' && !tipo) {
    //   console.log('aqui');
      
    //   queryParams = { anterior:'historial-vehiculo',cliente, sucursal, recepcion: idCotizacion, tipo:'recepcion', vehiculo} 
    // }else if (pagina === 'ServiciosConfirmar' && tipo) {
    //   console.log('aqui');
      
    //   queryParams = { anterior:'historial-vehiculo', tipo, vehiculo}
    // }
    // console.log(this.router.url);
    const ruta_Actual= this.router.url

    const ruta = ruta_Actual.split('/')

    const ruta_anterior = ruta[1].split('?')

    queryParams['anterior'] = ruta_anterior[0]
    console.log(queryParams);
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  obtener_total_cotizaciones(){

    const reporte_totales = {
      mo:0,
      refacciones:0,
    }
    let margen_ = 0

    const nuevas = [...this.recepciones_arr]
    nuevas.map(g=>{
      margen_ += g.margen
      const  {reporte, _servicios} = this.calcularTotales(g)
      Object.keys(reporte_totales).forEach(campo=>{
        reporte_totales[campo] += reporte[campo]
      })
      g.servicios = _servicios
      g.reporte = reporte
    })
    this.recepciones_arr = nuevas
    this.dataSource.data = nuevas
    this.newPagination()

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
    const {margen: new_margen, formaPago, elementos, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0, costos:0}
    
    const _servicios = [...elementos] 
    
    const margen = 1 + (new_margen / 100)
    _servicios.map((ele, index) =>{
      const {cantidad, costo, tipo, precio} = ele
      ele.index = index
      if (tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          ele.precio = mo + (refacciones * margen)
          ele.subtotal = mo + (refacciones * margen) * cantidad
          ele.total = (mo + (refacciones * margen)) * cantidad
          if (costo > 0 ){
            ele.total = costo * cantidad
            reporte.costos += costo * cantidad
          }else{
            reporte.mo += mo
            reporte.refacciones += refacciones
          }
        }
      }else if (tipo === 'mo' || tipo === 'refaccion') {

        // const operacion = this.mano_refaccion(ele)
        const operacion = (costo>0) ? cantidad * costo : cantidad * precio 

        ele.subtotal = operacion
        
        if (ele.aprobado){
          if (costo > 0 ){
            reporte.costos += (tipo === 'refaccion') ? operacion * margen : operacion
          }else{
            const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
            reporte[donde] += operacion
          }
          ele.total = (tipo === 'refaccion') ? operacion * margen : operacion
        }
      }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0

    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))

    const {mo, refacciones} = reporte

    reporte.refacciones_v = refacciones * margen

    let nuevo_total = mo + reporte.refacciones_v + reporte.costos
    
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
    return {reporte, _servicios}
    
  }
  mano_refaccion({costo, precio, cantidad}){
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete(ele){
    const reporte = {mo:0, refacciones:0}
    const {elementos} = ele
    const nuevos_elementos = [...elementos]

    if (!nuevos_elementos.length) return reporte

    nuevos_elementos.forEach(ele=>{
      const {tipo} = ele
      const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
      const operacion = this.mano_refaccion(ele)
      reporte[donde] += operacion
    })
    return reporte
  }

}
