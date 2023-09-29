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
    console.log(this._rol)
    console.log(this._sucursal)
    const clientes = await this._publicos.revisar_cache('clientes')
    const clientes_arr = this._publicos.crearArreglo2(clientes)
    const clientes_trasnform = this._publicos.transformaDataCliente(clientes_arr)
    
    const ordenar = (this._sucursal === 'Todas') ? clientes_trasnform : this._publicos.filtra_campo(clientes_trasnform,'sucursal',this._sucursal)
    setTimeout(() => {
      this.clientes_arr = this._publicos.ordenamiento_fechas_x_campo(ordenar,'fullname',true)
    }, 1000);
  }
  async vigila_hijo(){
    const clientes = await this._publicos.revisar_cache('clientes')
    const clientes_arr = await this._publicos.crearArreglo2(clientes)
    const nueva_data_clientes = JSON.parse(JSON.stringify(clientes));
      const unicosdos = [clientes_arr[0], clientes_arr[1]]
      unicosdos.forEach(cliente=>{
        const {id:id_cliente} = cliente
        const commentsRef = ref(db, `clientes/${id_cliente}` );
        onChildChanged(commentsRef, (data) => {
          const key = data.key
          const valor = data.val()
          if (nueva_data_clientes[id_cliente]) {
            nueva_data_clientes[id_cliente][key] = valor
            this._security.guarda_informacion({nombre:'clientes', data: nueva_data_clientes })
            this.lista_clientes()
          }
        });
      })
      this.lista_clientes()
  }
}


