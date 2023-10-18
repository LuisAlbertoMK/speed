import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-template-paquetes',
  templateUrl: './template-paquetes.component.html',
  styleUrls: ['./template-paquetes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TemplatePaquetesComponent implements OnInit,OnChanges {
  miniColumnas:number = 100
  dataSourcePaquetes = new MatTableDataSource(); //paquetes
  paquetes = ['nombre','modelo','marca','precio','costo']; //paquetes
  columnsToDisplayWithExpand = [...this.paquetes, 'opciones', 'expand']; //paquetes
  expandedElement: any | null; //paquetes
  @ViewChild('paquetesPaginator') paginator: MatPaginator //paquetes
  @ViewChild('paquetes') sort: MatSort //paquetes

  @Input() paquetes_arr:any[] = []
  
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['paquetes_arr']) {
      const nuevoValor = changes['paquetes_arr'].currentValue;
      const valorAnterior = changes['paquetes_arr'].previousValue;
      console.log({nuevoValor, valorAnterior});
      // console.log(nuevoValor);
      this.dataSourcePaquetes.data = nuevoValor
      this.newPagination()
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePaquetes.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePaquetes.paginator) {
      this.dataSourcePaquetes.paginator.firstPage();
    }
  }
  newPagination(){
    setTimeout(() => {
        this.dataSourcePaquetes.paginator = this.paginator
        this.dataSourcePaquetes.sort = this.sort
    }, 500);
  }

}
