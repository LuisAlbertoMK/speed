
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
  //  'clienteShow'
   cotizaciones = ['nombre','cantidad','total']; 
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; 
   expandedElement: any | null; 
   @ViewChild('elementos') sort: MatSort 
   @ViewChild('elementosPaginator') paginator: MatPaginator

   formasPago        =   [ ...this._cotizaciones.formasPago ]

   elementos_internos= []

  ngOnInit(): void {
    // this.realizaOperaciones()
    this.rol()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()
    console.log(this._security.usuarioRol());
    if (rol === 'cliente') {
    }else{
      this.cotizaciones = ['nombre','cantidad','precio','costo','total']
    }
  }
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['elementos']) {
      const nuevoValor = changes['elementos'].currentValue;
      const valorAnterior = changes['elementos'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      // console.log('hubo cambio en al informacion de los elementos');
      
      this.asigancion_elementos()
    }
  }
  asigancion_elementos(){
    this.elementos_internos = ([...new Set([...this.elementos])])
    this.dataSource.data = this.elementos
    this.newPagination()
  }

  elementos_internos_actuales(){
    this.elementos_Actuales.emit( this.elementos_internos )
  }
  editar_cantidad_elemento(donde:string, elemento_data ,valor){
    const nueva_cantidad = parseFloat(valor)
    const { index:index_editar } = elemento_data

    let nuevos = [...this.elementos_internos]
    nuevos[index_editar][donde] = nueva_cantidad
    // this.asignar_nuevos_elementos(nuevos)
    this.elementos_internos = nuevos
    this.elementos_internos_actuales()
  }
  eliminaElemento(data){
    const { index:index_elimina } = data
    let nuevos = [...this.elementos_internos]
    nuevos = nuevos.filter((elemento, index) => index !== index_elimina);
    this.elementos_internos = nuevos
    this.elementos_internos_actuales()
  }
  

  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }

}
