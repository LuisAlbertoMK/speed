
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

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

  constructor(
    private _cotizaciones: CotizacionesService, private _security:EncriptadoService,
    private _publicos: ServiciosPublicosService) {
      this.elementos_Actuales = new EventEmitter()
    }

  @Input() data_editar
  @Input() elementos
  @Output() elementos_Actuales : EventEmitter<any>
    dataSource = new MatTableDataSource(); //elementos
    displayedColumns: string[] = ['nombre','cantidad','total'];
    // columnsToDisplay: string[] = this.displayedColumns.slice();
    columnsToDisplayWithExpand = [...this.displayedColumns, 'xcolumn', 'ycolumn']; 
    expandedElement: any | null; 
    @ViewChild('elementos') sort: MatSort 
    @ViewChild('elementosPaginator') paginator: MatPaginator

   formasPago        =   [ ...this._cotizaciones.formasPago ]

   miniColumnas:number = 100
   elementos_internos= []
  _rol:string
  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()
    // console.log(this._security.usuarioRol());
    this._rol = rol
    if (rol !== 'cliente') this.addColumn(['precio','costo'])
  }
  addColumn(arreglo:any[]){
    const ordenDeseado = ['nombre', 'cantidad','precio', 'costo', 'total','xcolumn','ycolumn'];

    const arrayOriginal = [...new Set([...this.columnsToDisplayWithExpand, ...arreglo])]

    const arrayOrdenado = ordenDeseado.filter(item => arrayOriginal.includes(item));

    this.columnsToDisplayWithExpand = arrayOrdenado
    
  }
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['elementos']) {
      const nuevoValor = changes['elementos'].currentValue;
      const valorAnterior = changes['elementos'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      // console.log('hubo cambio en al informacion de los elementos');
      // console.log(nuevoValor);
      this.newPagination()
      // this.asigancion_elementos()
    }
  }
  // asigancion_elementos(){
  //   const espera = this._publicos.crear_new_object([...new Set([...this.elementos])])
  //   this.elementos_internos = espera
  //   this.dataSource.data = this.elementos
  //   this.newPagination()
  // }
  

  
  editar_cantidad_elemento(donde:string, elemento_data ,valor){
    const nueva_cantidad = parseFloat(valor)
    const { index:index_editar } = elemento_data

    let nuevos = [...new Set([...this.elementos])]
    const elemento_edit = this._publicos.crear_new_object(nuevos[index_editar])
    elemento_edit[donde] = nueva_cantidad

    nuevos[index_editar]= {...elemento_edit}
    this.elementos_internos_actuales(nuevos)
  }
  editarSubelemento(donde:string, padre, hijo ,valor){
    const nueva_cantidad = parseFloat(valor)

    // console.log(donde, padre, hijo ,valor);
    const { index:index_editar } = padre
    const { index:index_hijo } = hijo
    

    let nuevos = [...new Set([...this.elementos])]
    const elemento_edit = this._publicos.crear_new_object(nuevos[index_editar])
    const {elementos} = elemento_edit
    
    
    const elemento_hijo = this._publicos.crear_new_object(elementos[index_hijo])

    elemento_hijo[donde] = nueva_cantidad
    elementos[index_hijo] = elemento_hijo

    nuevos[index_editar] = {...elemento_edit}
    
    this.elementos_internos_actuales(nuevos)
  }

  eliminaElemento(data){
    const { index:index_elimina } = data
    let nuevos = [... new Set([...this.elementos])]
    nuevos = nuevos.filter((elemento, index) => index !== index_elimina);
    this.elementos_internos = nuevos
    this.elementos_internos_actuales(nuevos)
  }
  elementos_internos_actuales(nuevos){
    // const filtro_paquetes = nuevos.filter(ele=>ele.tipo === 'paquete')
    // const filtro_elementos = nuevos.filter(ele=>ele.tipo === 'paquete')
    const nuevos_elementos = nuevos.map(elemento=>{
      if (elemento.tipo === 'paquete') {
        const {elementos} = elemento
        
        const reporte = this._publicos.sumatoria_reporte_paquete(elementos, 25);
        // console.log(reporte);
        const {subtotal} = reporte
        elemento.total = subtotal
        elemento.reporte = reporte
        elemento.elementos = sustitulle_infor(elementos)
      }
      return elemento
    })

    function sustitulle_infor(nuevos_elementos:any[]){
      nuevos_elementos.map(elemento=>{
        const {cantidad, tipo} = elemento
        const costoElemento = obtenerCostoValido(elemento)
        let subtotal =  cantidad * costoElemento;
        const total = (tipo === 'refaccion') ? subtotal * 1.25 : subtotal
        elemento.total = total
        return elemento
      })
      return nuevos_elementos
    }
    function obtenerCostoValido(elemento) {
      return elemento.costo > 0 ? elemento.costo : elemento.precio;
    }
      this.elementos_Actuales.emit( nuevos_elementos )
  }
  

  newPagination(){
    // setTimeout(() => {
      this.dataSource.data = this.elementos
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    // }, 500);
  }

}
