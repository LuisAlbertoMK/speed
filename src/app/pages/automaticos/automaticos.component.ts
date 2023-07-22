import { Component, OnInit } from '@angular/core';
import { child, get, getDatabase, onDisconnect, onValue, push, ref, set, update } from 'firebase/database';
import { AutomaticosService } from '../../services/automaticos.service';

import * as CryptoJS from 'crypto-js';  
import { EncriptadoService } from '../../services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';


import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const db = getDatabase()
const dbRef = ref(getDatabase());
import { Color, ScaleType } from '@swimlane/ngx-charts';

import { data_ocupada, data_vehiculos } from './ayuda';

@Component({
  selector: 'app-automaticos',
  templateUrl: './automaticos.component.html',
  styleUrls: ['./automaticos.component.css']
})
export class AutomaticosComponent implements OnInit {
  
  constructor(private _automaticos: AutomaticosService, private _encript: EncriptadoService, private _publicos: ServiciosPublicosService,
    private _security:EncriptadoService, public _router: Router, public _location: Location,private _pdfRecepcion: PdfRecepcionService,
    private _sucursales: SucursalesService, private _clientes: ClientesService, private _vehiculos: VehiculosService,
    ) {   }
  
  ngOnInit(): void {
    this.rol()
    this.realizaOperacionesClientes()
  }
  rol(){
    const { rol, sucursal, usuario } = this._security.usuarioRol()
  }
  realizaOperacionesClientes(){
    let nueva_data_clientes = {}
    let nueva_data_vehiculos = {}
    // console.log(data_ocupada);

    
    const campos_recupera = [ 'apellidos','correo','correo_sec','id','no_cliente','nombre','sucursal','telefono_fijo','telefono_movil','tipo' ]
    const campos_vehiculos = ['anio','categoria','cilindros','cliente','color','engomado','id','marca','marcaMotor','modelo','no_motor','placas','status','transmision','vinChasis' ]
    Object.keys(data_ocupada).forEach(d=>{
        const recupera = this._publicos.nuevaRecuperacionData(data_ocupada[d], campos_recupera)
        const {vehiculos} = data_ocupada[d]
        if (vehiculos) {
            Object.keys(vehiculos).forEach(v=>{
                const recupera = this._publicos.nuevaRecuperacionData(vehiculos[v], campos_vehiculos)
                nueva_data_vehiculos[v] = {...recupera, cliente: v}
            }) 
        }
        nueva_data_clientes[d] = recupera
    })
    
    Object.keys(data_vehiculos).forEach(d=>{
        const recupera = this._publicos.nuevaRecuperacionData(data_vehiculos[d], campos_vehiculos)
        nueva_data_vehiculos[d] = recupera
    })

    console.log(nueva_data_clientes);
    console.log(nueva_data_vehiculos);
    
  }
    
}