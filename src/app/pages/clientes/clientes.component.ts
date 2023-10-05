import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';


import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onChildChanged, onValue, push, ref, set, update } from "firebase/database";
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
    clientes_actual = []
  ngOnInit() {
    this.rol()
  }
  ngAfterViewInit(): void {  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal
    this.vigila_hijo()

  }
  async lista_clientes(){
    const clientes = await this._publicos.revisar_cache2('clientes')
    console.log(clientes);
    
    const clientes_arr = this._publicos.crearArreglo2(clientes)
    
    const clientes_trasnform = this._publicos.transformaDataCliente(clientes_arr)

    const ordenar = (this._sucursal === 'Todas') ? clientes_trasnform : this._publicos.filtra_campo(clientes_trasnform,'sucursal',this._sucursal)
    
    const campos_cliente = ['id','no_cliente','nombre','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','sucursal','empresa','usuario']
    setTimeout(() => {
      this.clientes_actual = this._publicos.ordenamiento_fechas_x_campo(ordenar,'id',true)
      this.clientes_arr = this._publicos.actualizarArregloExistente(this.clientes_actual,ordenar, campos_cliente)
    }, 1000);
  }
  async vigila_hijo(){
    this.lista_clientes()
    const commentsRef = ref(db, `clientes`);
      onChildChanged(commentsRef, (data) => {
        setTimeout(() => {
          this.lista_clientes()
        }, 500);
      })
  }
}


