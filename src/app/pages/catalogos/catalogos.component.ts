import { Component, OnInit,OnDestroy, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ManoObra } from 'src/app/models/ManoObra.model';
import { Paquete } from 'src/app/models/paquete.model';
import { PaqueteContiene } from 'src/app/models/paqueteContiene.model';
import { Refacciones } from 'src/app/models/refacciones.model';
import { tipoJson } from 'src/app/models/tipoJson.model';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2'
import { AutomaticosService } from 'src/app/services/automaticos.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database"
import {animate, state, style, transition, trigger} from '@angular/animations';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class CatalogosComponent implements  OnDestroy, OnInit  {
  
  listaPaquetes = []
  // @Input() modelo:string
  // @Output() infoPaquete : EventEmitter<any>
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

  constructor(private fb: FormBuilder, private _catalogos: CatalogosService,
  private _vehiculos: VehiculosService, private _automaticos: AutomaticosService, private _publicos: ServiciosPublicosService) {     }

  ngOnInit() {
    this.consultaMO()
  }
  ngOnDestroy(): void {
    
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
        console.log(this.listaPaquetes_arr);
        
        // this.listaPaquetes_arr = paquetes.filter(p=>p['elementos'].length);
        // (this.modelo) ? this.aplicaFiltro(true) : this.aplicaFiltro(false)
        this.aplicaFiltro(false)
      } else {
        this.newPagination('paquetes')
      }
    })
  }
  aplicaFiltro(filtro:boolean){
    let data = this.listaPaquetes_arr;
    // if (filtro && this.modelo) {
    //   data = data.filter((paquete) => paquete.modelo === this.modelo);
    // }
    this.dataSourcePaquetes.data = data;
    this.newPagination('paquetes')
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
