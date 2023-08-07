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

  

  recepciones_arr= []
  SUCURSAL:string

  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const { rol, sucursal, uid} = this._security.usuarioRol()
    this.SUCURSAL = sucursal

    if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
  }
  async obtenerInformacion_cliente(id:string){
    const sucursal = this.SUCURSAL
    const cliente = id


    const data_cliente  = await this._clientes.consulta_cliente_new({sucursal, cliente})
    const vehiculos_arr = await this._vehiculos.consulta_vehiculos({sucursal, cliente})

    const ruta_recepciones    =  `recepciones/${sucursal}/${cliente}`

    const todas_recepciones  = await this._servicios.conslta_recepciones_cliente({ruta: ruta_recepciones})

    const filtro_recepciones = todas_recepciones.map(cot=>{
      cot.data_cliente = this._clientes.formatea_info_cliente_2(data_cliente)
      // cot.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
      
      const data_vehiculo = vehiculos_arr.find(v=>v.id === cot.vehiculo)
      cot.data_vehiculo = data_vehiculo
      const {placas}= data_vehiculo
      cot.placas = placas || '------'
      return cot
    })

    
    if (!this.recepciones_arr.length) {
      this.recepciones_arr = filtro_recepciones;
      // this.cargandoInformacion = false
    } else {
      this.recepciones_arr = this._publicos.actualizarArregloExistente(this.recepciones_arr,filtro_recepciones,[...this._cotizaciones.camposCotizaciones])
      // this.cargandoInformacion = false
    }
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
