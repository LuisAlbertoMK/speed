import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { animate, state, style, transition, trigger } from '@angular/animations';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';



@Component({
  selector: 'app-cotizaciones-cliente',
  templateUrl: './cotizaciones-cliente.component.html',
  styleUrls: ['./cotizaciones-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CotizacionesClienteComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, 
    private _vehiculos: VehiculosService, private _servicios: ServiciosService, private _campos: CamposSystemService,
    private _clientes: ClientesService, private _sucursales: SucursalesService, private _cotizaciones: CotizacionesService) { }
  rol_cliente:string = 'cliente'

  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  camposCliente     =   [ ...this._clientes.camposCliente_show  ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_  ]
  formasPago        =   [ ...this._cotizaciones.formasPago  ]

  paquete: string   =   this._campos.paquete
  refaccion: string =   this._campos.refaccion
  mo: string        =   this._campos.mo


  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','no_cotizacion','searchName','searchPlacas']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos


  cotizaciones_Existentes = []

  ngOnInit(): void {
    this.rol()
  }
  rol(){

    const { rol, sucursal, uid } = this._security.usuarioRol()

    if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
  }

  obtenerInformacion_cliente(cliente:string){
    // console.log('obtener las cotizaciones del cliente');
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, async (snapshot) => {
        const cotizaciones = await this._cotizaciones.consulta_cotizaciones_new()
        // console.log(cotizaciones);
        const cotizaiones_filter = cotizaciones.filter(c=>c.cliente.id === cliente)
        cotizaiones_filter.map((c,index)=>{
          c['index'] = index + 1
        })
        if (!this.cotizaciones_Existentes.length) {
          this.cotizaciones_Existentes = cotizaiones_filter;
          // this.cargandoInformacion = false
        } else {
          this.cotizaciones_Existentes = this._publicos.actualizarArregloExistente(this.cotizaciones_Existentes,cotizaciones,[...this._cotizaciones.camposCotizaciones])
          // this.cargandoInformacion = false
        }
        this.dataSource.data = this.cotizaciones_Existentes
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
