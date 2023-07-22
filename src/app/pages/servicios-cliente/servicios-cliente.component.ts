import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from '../../services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
@Component({
  selector: 'app-servicios-cliente',
  templateUrl: './servicios-cliente.component.html',
  styleUrls: ['./servicios-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ServiciosClienteComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, 
    private _clientes: ClientesService, private _sucursales: SucursalesService, private _campos: CamposSystemService,
    private _vehiculos: VehiculosService, private _servicios: ServiciosService, private _cotizaciones: CotizacionesService) { }

  rol_cliente:string = 'cliente'

  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_  ]

  paquete: string     =   this._campos.paquete
  refaccion: string   =   this._campos.refaccion
  mo: string          =   this._campos.mo
  miniColumnas:number =   this._campos.miniColumnas

  ///elementos de la tabla de vehiculos
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['id','no_os','searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('recepcionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('recepciones') sort: MatSort //elementos

  recepciones_clinete = []

  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const { rol, sucursal, uid} = this._security.usuarioRol()

    if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
  }
  obtenerInformacion_cliente(cliente:string){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, async (snapshot) => {
      const servicios = await this._servicios.consulta_recepciones_new()
      // console.log(servicios);
      const servicios_filter = servicios.filter(s=>s.cliente.id === cliente)
      // console.log(servicios_filter);
      servicios_filter.forEach((s,index)=>{
        s['index'] = index + 1
      })

      //
      if (!this.recepciones_clinete.length) {
        this.recepciones_clinete = servicios_filter;
        // this.cargandoInformacion = false
      } else {
        this.recepciones_clinete = this._publicos.actualizarArregloExistente(this.recepciones_clinete,servicios_filter,[...this._servicios.campos_servicios_hard])
        // this.cargandoInformacion = false
      }
      this.dataSource.data = this.recepciones_clinete
      this.newPagination()
      
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }
}
