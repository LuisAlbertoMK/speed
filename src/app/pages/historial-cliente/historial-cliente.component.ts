import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onValue, ref, set, push } from 'firebase/database';

const db = getDatabase()
const dbRef = ref(getDatabase());
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ClientesService } from '../../services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

@Component({
  selector: 'app-historial-cliente',
  templateUrl: './historial-cliente.component.html',
  styleUrls: ['./historial-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistorialClienteComponent implements OnInit {
  
  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private rutaActiva: ActivatedRoute,
    private router: Router, private _clientes: ClientesService, private _vehiculos: VehiculosService, private _cotizaciones: CotizacionesService,
    private _servicios: ServiciosService, private _campos: CamposSystemService, private _sucursales: SucursalesService) { }

    ROL:string; SUCURSAL:string
    data_cliente:any

    cotizaciones_arr:any[]=[]
    recepciones_arr:any[]=[]
    vehiculos_arr:any[]=[]
    

  async ngOnInit() {
    this.rol()
  }
  
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    this.rutaActiva.queryParams.subscribe((params:any) => {
      console.log(params);
      const data_enrutamiento = JSON.parse(JSON.stringify(params))
      const {cliente} = data_enrutamiento
      if (cliente) this.consulta_info_cliente(cliente)
      
    });
    
  }
 
  async consulta_info_cliente(id_cliente:string){
    const clientes = await this._publicos.revisar_cache('clientes')
    const data_cliente = clientes[id_cliente]

    this.data_cliente  = data_cliente

    const info = { [id_cliente]: data_cliente }

    const {cotizaciones_arr, recepciones_arr, vehiculos_arr} = this._publicos.buscar_data_realcionada_con_cliente(id_cliente,info)
   
    this.cotizaciones_arr = cotizaciones_arr
    this.recepciones_arr = recepciones_arr
    this.vehiculos_arr = vehiculos_arr
  }
}
