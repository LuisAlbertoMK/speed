import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';


import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onChildAdded, onChildChanged, onValue, push, ref, set, update } from "firebase/database";
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CamposSystemService } from 'src/app/services/campos-system.service';
// import { setInterval } from 'timers';


const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {nombre: string}



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ClientesComponent implements AfterViewInit, OnInit {
  constructor(private _publicos:ServiciosPublicosService, private _security:EncriptadoService, private _sucursales: SucursalesService,
    private _clientes: ClientesService, private router: Router, private _auth: AuthService,private _campos: CamposSystemService,
    ){}
    _rol:string; _sucursal:string;
  
    clientes_arr:any =[]
    objecto_actual:any ={}
  ngOnInit() {
    this.rol()
  }
  ngAfterViewInit(): void {  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    console.log(this._security.usuarioRol());
    
    this._rol = rol
    this._sucursal = sucursal
    this.primer_comprobacion_resultados()
  }
  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('clientes')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }
  primer_comprobacion_resultados(){
    this.asiganacion_resultados()
    this.segundo_llamado()
  }
  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.nueva_revision_cache('clientes')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asiganacion_resultados()
      }
    },1500)
  }
  
  asiganacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('clientes')
    console.log(objecto_recuperdado);
    
    const clientes_para_tabla = this._publicos.transformaDataCliente(objecto_recuperdado)
    const objetoFiltrado = this._publicos.filtrarObjetoPorPropiedad(clientes_para_tabla, 'sucursal', this._sucursal);
    const data_recuperda_arr = this._publicos.crearArreglo2(objetoFiltrado)

    const campos = [
      'apellidos',
      'correo_sec',
      'correo',
      'fullname',
      'no_cliente',
      'nombre',
      'sucursal',
      'sucursalShow',
      'telefono_movil',
      'tipo'
    ]
    this.objecto_actual = objecto_recuperdado

    this.clientes_arr = (!this.clientes_arr.length) 
    ? data_recuperda_arr
    :  this._publicos.actualizarArregloExistente(this.clientes_arr, data_recuperda_arr, campos )

  }
  
}


