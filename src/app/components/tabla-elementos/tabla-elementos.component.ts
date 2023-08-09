
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';

@Component({
  selector: 'app-tabla-elementos',
  templateUrl: './tabla-elementos.component.html',
  styleUrls: ['./tabla-elementos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TablaElementosComponent implements OnInit, OnChanges {

  constructor(private _cotizaciones: CotizacionesService) { }

  @Input() data_editar

  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
   cotizaciones = ['nombre','cantidad','precio','costo','total']; 
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; 
   expandedElement: any | null; 
   @ViewChild('elementos') sort: MatSort 
   @ViewChild('elementosPaginator') paginator: MatPaginator

   formasPago        =   [ ...this._cotizaciones.formasPago ]

   

  ngOnInit(): void {
    this.realizaOperaciones()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data_editar']) {
      const nuevoValor = changes['data_editar'].currentValue;
      const valorAnterior = changes['data_editar'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      console.log(nuevoValor);
      // this.asigan_elementos_tabla(nuevoValor)
      if (nuevoValor !== valorAnterior) {
        this.realizaOperaciones()
        console.log('aqui');
      }else{
        console.log('aqui');
        
      }
      // this.sumatorias()
    }
  }
   

  newPagination(){
   
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }

  editar(donde:string , data , cantidad){
    const nueva_cantidad = parseFloat(cantidad)
    const { index:index_editar } = data
    console.log('aqui');
    

    let nuevos = [...this.data_editar.elementos]
    nuevos[index_editar][donde] = nueva_cantidad
    console.log(nuevos);
    
    // this.asignar_nuevos_elementos(nuevos)
  }

  asignar_nuevos_elementos(nuevos:any[]){
    this.data_editar.elementos = nuevos
    this.realizaOperaciones()
  }
  realizaOperaciones(){

    const reporte_totales = {
      mo:0,
      refacciones:0,
    }
    // console.log(this.data_editar);
    

    const  {reporte, _servicios} = this.calcularTotales(this.data_editar)
      Object.keys(reporte_totales).forEach(campo=>{
        reporte_totales[campo] += reporte[campo]
      })

      console.log({reporte, _servicios});
      
    // console.log(_servicios);
    // console.log(reporte);
      
    // this.reporte_totales = reporte
    // servicios.map((s, index)=>{
    //   s.index = index
    //   s.aprobado = true
    // })
    // this.infoCotizacion.reporte = reporte

    // this.infoCotizacion.elementos = servicios
    // this.dataSource.data = servicios
    // this.newPagination()
    this.dataSource.data = _servicios
    this.newPagination()
  }



  calcularTotales(data) {
    // console.log(data);
    
    const {margen: new_margen, formaPago, elementos, iva:_iva, descuento:descuento_} = this.data_editar
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0}
    
    // const servicios_ = (elementos) ? elementos 
    
    
    const _servicios = elementos
    
    
    
    const margen = 1 + (new_margen / 100)
    _servicios.map(ele=>{
      const {cantidad, costo, tipo} = ele
      if (tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          reporte.mo += mo
          reporte.refacciones += refacciones
        }
        ele.precio = mo + (refacciones * margen)
        ele.total = (mo + (refacciones * margen)) * cantidad
        if (costo > 0 ) ele.total = costo * cantidad 
        
      }else if (tipo === 'mo' || tipo === 'refaccion') {

        const operacion = this.mano_refaccion(ele)

        ele.subtotal = operacion
        ele.total = (tipo === 'refaccion') ? operacion * margen : operacion
        
        const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'

        if (ele.aprobado) reporte[donde] += operacion

      }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0

    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))

    const {mo, refacciones} = reporte

    reporte.refacciones_v = refacciones * margen

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
    return {reporte, _servicios}
    
  }
  mano_refaccion({costo, precio, cantidad}){
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete({elementos}){
    const reporte = {mo:0, refacciones:0}
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
