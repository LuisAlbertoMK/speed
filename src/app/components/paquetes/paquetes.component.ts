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
  @Output() infoPaquete : EventEmitter<any>
  miniColumnas:number = 100

  // tabla
  dataSourcePaquetes = new MatTableDataSource(); //paquetes
  paquetes = ['index','nombre','modelo','marca','precio']; //paquetes
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
    this.consultaMO()
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

  consultaMO(){
    const starCountRef = ref(db, `manos_obra`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const mo= this._publicos.crearArreglo2(snapshot.val())
        mo.map(r=>{ r['tipo'] = 'mo' })
        this.listaMO = mo
        this.refacciones()
      } else {
        this.refacciones()
      }
    })
  }
  refacciones(){
    const starCountRef = ref(db, `refacciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const refacciones= this._publicos.crearArreglo2(snapshot.val())
        refacciones.map(r=>{ r['tipo'] = 'refaccion' })
        this.listaRefacciones = refacciones
        this.consultaPaquetes()
      } else {
        this.consultaPaquetes()
      }
    })
  }


  consultaPaquetes(){
    const unidos = this.listaMO.concat(this.listaRefacciones)
    // const aqui = unidos.filter(u=>u['id']  === '-NE2JJZu_LtUYJXSBola')
    // console.log(unidos);
    
    const starCountRef = ref(db, `paquetes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const paquetes= this._publicos.crearArreglo2(snapshot.val())
            for (const [index, p] of paquetes.entries()) {
              const {elementos, reporte} = this._publicos.reportePaquete(p.elementos, 1.25);
              const elementosActualizados = elementos.map((e) => {
                if (e.catalogo || e.enCatalogo) {
                  const info = unidos.find((u) => u.id === e.IDreferencia) ?? {};
                  const camposNuevos = ['id', 'nombre', 'tipo'];
          
                  camposNuevos.forEach((c) => {
                    e[c] = info[c] ?? '';
                  });
                }
                return e;
              });
          
              paquetes[index] = {
                ...p,
                index,
                elementos: elementosActualizados,
                reporte,
                precio: reporte.total,
                total: reporte.total,
                tipo: 'paquete',
                aprobado: true,
                cantidad: 1,
                costo: 0,
              };
            }
        this.listaPaquetes_arr = paquetes.filter((p) => p.elementos.length);
        // this.listaPaquetes_arr = paquetes.filter(p=>p['elementos'].length);
        // (this.modelo) ? this.aplicaFiltro(true) : this.aplicaFiltro(false)
        this.aplicaFiltro()
      } else {
        this.newPagination('paquetes')
      }
    })
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
