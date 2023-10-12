import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrls: ['./paquetes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PaquetesComponent implements OnInit, OnChanges {

  listaPaquetes = []
  @Input() modelo:string
  @Input() btnfiltro:boolean = true
  @Output() infoPaquete : EventEmitter<any>
  miniColumnas:number = 100

  // tabla
  dataSourcePaquetes = new MatTableDataSource(); //paquetes
  paquetes = ['nombre','modelo','marca','precio','costo']; //paquetes
  columnsToDisplayWithExpand = [...this.paquetes, 'opciones', 'expand']; //paquetes
  expandedElement: any | null; //paquetes
  listaRefacciones= []
  listaMO =  []
  listaPaquetes_arr=[]
  modelo_temp:string
  @ViewChild('paquetesPaginator') paginator: MatPaginator //paquetes
  @ViewChild('paquetes') sort: MatSort //paquetes

  
  constructor(private _publicos: ServiciosPublicosService) {
    this.infoPaquete = new EventEmitter()
   }

  ngOnInit(): void {
    // this.consultaMO()
    // this.modelo = 'Fiesta'
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['modelo']) {
      const nuevoValor = changes['modelo'].currentValue;
      const valorAnterior = changes['modelo'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      // console.log(nuevoValor);
      if (nuevoValor) {
        this.modelo_temp = nuevoValor
      }else{
        this.modelo_temp = null
      }
      this.aplicaFiltro()
      
    }
  }

  


  consultaPaquetes(){
    const paquetes = this._publicos.nueva_revision_cache('paquetes')
    console.log(paquetes);
    
  }
  
  aplicaFiltro(){
    let data = (this.modelo_temp) ? this.listaPaquetes_arr.filter((paquete) => paquete.modelo === this.modelo) : this.listaPaquetes_arr
    this.dataSourcePaquetes.data = data;
    this.newPagination('paquetes')
  }

  dataElement(data:any){
    if (data['id']) {
      this.infoPaquete.emit(data)
      this._publicos.swalToast('paquete agregado correcamente!', 1, 'top-start')
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePaquetes.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePaquetes.paginator) {
      this.dataSourcePaquetes.paginator.firstPage();
    }
  }
  newPagination(tabla:String){
    setTimeout(() => {
      if (tabla === 'paquetes') {
        
        this.dataSourcePaquetes.paginator = this.paginator
        this.dataSourcePaquetes.sort = this.sort
      }
    }, 500);
  }
}
