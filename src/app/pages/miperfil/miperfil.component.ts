import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';



import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { Router } from '@angular/router';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { getAuth,onAuthStateChanged  } from "firebase/auth";
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
const auth = getAuth();
@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MiperfilComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, private _clientes: ClientesService,
    private _servicios: ServiciosService, private _reporte_gastos: ReporteGastosService,
    private _sucursales: SucursalesService, private _vehiculos: VehiculosService, private router: Router, private _cotizaciones: CotizacionesService,) { }
  rol_cliente:string = 'cliente'
  info_cliente = {}
  info_cliente_editar = {}
  camposCliente_show  = [ ...this._clientes.camposCliente_show ]
  sucursales_arr      = [ ...this._sucursales.lista_en_duro_sucursales ]
  // formasPago       =  [ ...this._cotizaciones.formasPago ]

  misVehiculos = []

  ///elementos de la tabla de vehiculos
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','placas','marca','modelo','anio','categoria','engomado','color','cilindros']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  editar:boolean = false
  cargando:boolean = true
  uid: string =  null
  _sucursal:string
  _rol:string
  data_cliente:any
  vehiculos_arr:any[] = []

  cotizaciones_arr:any = []
  recepciones_arr:any[] =[]

  ngOnInit(): void {
    this.rol()
    // this.verifica()
    
  }
  rol(){
    const {rol, usuario, sucursal, uid} = this._security.usuarioRol()
    
    this._sucursal = sucursal
    this._rol = rol
    if (uid) {
      this.consulta_info_cliente(uid)
    }
    
  }
  consulta_info_cliente(id_cliente:string){

    console.log(id_cliente);
    
    const {data_cliente, cotizaciones_arr, recepciones_arr, vehiculos_arr} = this._publicos.data_relacionada_id_cliente(id_cliente)
    this.data_cliente = data_cliente
    this.cotizaciones_arr = cotizaciones_arr
    this.recepciones_arr = recepciones_arr
    this.vehiculos_arr = vehiculos_arr
  }
}