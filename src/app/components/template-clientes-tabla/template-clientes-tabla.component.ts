import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-clientes-tabla',
  templateUrl: './template-clientes-tabla.component.html',
  styleUrls: ['./template-clientes-tabla.component.css'],
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
export class TemplateClientesTablaComponent implements OnInit, OnChanges {
  
  @Input() clientes_arr:any[] = []

  miniColumnas:number = 120
  
  constructor(private router: Router) { }


  displayedColumnsClientes: string[] = ['no_cliente','sucursalShow', 'fullname','tipo', 'correo','opciones']; //clientes
    // columnsToDisplayWithExpand = [...this.displayedColumnsClientes, 'expand'];
    columnsToDisplayWithExpand = [...this.displayedColumnsClientes];
    dataSourceClientes = new MatTableDataSource(); //clientes
    expandedElement: any | null; //clientes
    @ViewChild('clientesPaginator') paginatorClientes: MatPaginator //clientes
    @ViewChild('clientes') sortClientes: MatSort //clientes
  
    clickedRows = new Set<any>() //todas las tablas
  
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clientes_arr']) {
      const nuevoValor = changes['clientes_arr'].currentValue;
      const valorAnterior = changes['clientes_arr'].previousValue;
      // console.log({nuevoValor, valorAnterior});
        this.dataSourceClientes.data = this.clientes_arr
        this.newPagination()
    }
  }
  newPagination(){
    // setTimeout(() => {
      this.dataSourceClientes.paginator = this.paginatorClientes;
      this.dataSourceClientes.sort = this.sortClientes;
    // }, 500);
  }

  irPagina(pagina, cliente){
    // /:ID/:tipo/:extra
    // console.log(cliente);
    const { id, sucursal, tipo } = cliente
    
    let queryParams = {}
    if (pagina === 'historial-cliente') {
      queryParams = { anterior:'clientes', sucursal, cliente: id  } 
    } else if (pagina === 'cotizacionNueva') {
      queryParams = { anterior:'clientes', cliente: id, sucursal, tipo: 'cliente'  } 
    } else if (pagina === 'ServiciosConfirmar') {
      queryParams = { anterior:'clientes',  tipo:'cliente', cliente: id, sucursal, vehiculo:'' } 
    }

    // console.log(queryParams);
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }

}
