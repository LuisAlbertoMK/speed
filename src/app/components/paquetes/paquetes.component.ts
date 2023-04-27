import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
export class PaquetesComponent implements OnInit {

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
  filtrar:boolean = true
  @ViewChild('paquetesPaginator') paginator: MatPaginator //paquetes
  @ViewChild('paquetes') sort: MatSort //paquetes

  
  constructor(private _publicos: ServiciosPublicosService) {
    this.infoPaquete = new EventEmitter()
   }

  ngOnInit(): void {
    this.consultaMO()
    // this.modelo = 'Fiesta'
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
    // console.log(aqui);
    
    const starCountRef = ref(db, `paquetes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const paquetes= this._publicos.crearArreglo2(snapshot.val())
        paquetes.map((p, index)=>{
          p['index'] = index
          const elementos_internos = (p['elementos']) ? p['elementos'] : []
          elementos_internos.map(e=>{
            if(e['catalogo'] || e['enCatalogo']){
              const info = unidos.find(u=>u['id'] === e['IDreferencia'])
              const camposNuevos = ['id','nombre','precio','status','tipo']
              camposNuevos.forEach(c=>{
                (!info[c]) ? e[c] = '' : e[c] = info[c]
              })
            }
            e['tipo'] = String(e['tipo']).toLowerCase()
            e['costo'] = 0
            e['aprobado'] = true
          })
          const reporte = this._publicos.reportePaquete(elementos_internos,25)
          p['elementos'] = elementos_internos
          p['reporte_interno'] = reporte
          p['precio'] = reporte['total']
          p['total'] = reporte['total']
          p['tipo'] = 'paquete'
          p['aprobado'] = true
          p['cantidad'] = 1
          p['costo'] = 0
          // p['total'] = reporte['total']
        })

        this.listaPaquetes_arr = paquetes.filter(p=>p['elementos'].length);
        // (this.modelo) ? this.aplicaFiltro(true) : this.aplicaFiltro(false)
        this.aplicaFiltro(false)
      } else {
        this.newPagination('paquetes')
      }
    })
  }
  aplicaFiltro(filtro:boolean){
    if (filtro) {
      if (this.modelo) {
        const filtroModelo = this.listaPaquetes_arr.filter(f=>f['modelo'] === this.modelo)
        this.dataSourcePaquetes.data = filtroModelo
      }else{
        this.dataSourcePaquetes.data = this.listaPaquetes_arr
      }
    }else{
      this.dataSourcePaquetes.data = this.listaPaquetes_arr
    }
    
    this.newPagination('paquetes')
  }
  dataElement(data:any){
    if (data['id']) {
      this.infoPaquete.emit(data)
      this._publicos.swalToastCenter('paquete agregado correcamente!')
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
