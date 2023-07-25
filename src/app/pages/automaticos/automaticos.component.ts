import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, update } from 'firebase/database';
import { AutomaticosService } from '../../services/automaticos.service';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from '../../services/encriptado.service';

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const db = getDatabase()
const dbRef = ref(getDatabase());

import {BD} from './ayuda';

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
  arr_sucursal = [...this._sucursales.lista_en_duro_sucursales]
  ngOnInit(): void {
    this.rol()
    this.realizaOperacionesClientes()
  }
  rol(){
    const { rol, sucursal, usuario } = this._security.usuarioRol()
  }
  realizaOperacionesClientes(){
    const lista_sucursal = {
      '-N2gkVg1RtSLxK3rTMYc':{},
      '-N2gkzuYrS4XDFgYciId':{},
      '-N2glF34lV3Gj0bQyEWK':{},
      '-N2glQ18dLQuzwOv3Qe3':{},
      '-N2glf8hot49dUJYj5WP':{},
      '-NN8uAwBU_9ZWQTP3FP_':{}
    }
    let nueva_data_clientes = {
      '-N2gkVg1RtSLxK3rTMYc':{},
      '-N2gkzuYrS4XDFgYciId':{},
      '-N2glF34lV3Gj0bQyEWK':{},
      '-N2glQ18dLQuzwOv3Qe3':{},
      '-N2glf8hot49dUJYj5WP':{},
      '-NN8uAwBU_9ZWQTP3FP_':{}
    }
    let nueva_data_vehiculos = {
      '-N2gkVg1RtSLxK3rTMYc':{},
      '-N2gkzuYrS4XDFgYciId':{},
      '-N2glF34lV3Gj0bQyEWK':{},
      '-N2glQ18dLQuzwOv3Qe3':{},
      '-N2glf8hot49dUJYj5WP':{},
      '-NN8uAwBU_9ZWQTP3FP_':{}
    }
    let nueva_data_cotizaciones = {
      '-N2gkVg1RtSLxK3rTMYc':{},
      '-N2gkzuYrS4XDFgYciId':{},
      '-N2glF34lV3Gj0bQyEWK':{},
      '-N2glQ18dLQuzwOv3Qe3':{},
      '-N2glf8hot49dUJYj5WP':{},
      '-NN8uAwBU_9ZWQTP3FP_':{}
    }
    let nueva_data_recepciones = {
      '-N2gkVg1RtSLxK3rTMYc':{},
      '-N2gkzuYrS4XDFgYciId':{},
      '-N2glF34lV3Gj0bQyEWK':{},
      '-N2glQ18dLQuzwOv3Qe3':{},
      '-N2glf8hot49dUJYj5WP':{},
      '-NN8uAwBU_9ZWQTP3FP_':{},
    }
    let nuevas_empresas = {
      '-N2gkVg1RtSLxK3rTMYc':{},
      '-N2gkzuYrS4XDFgYciId':{},
      '-N2glF34lV3Gj0bQyEWK':{},
      '-N2glQ18dLQuzwOv3Qe3':{},
      '-N2glf8hot49dUJYj5WP':{},
      '-NN8uAwBU_9ZWQTP3FP_':{},
    }
    // console.log(data_ocupada);
    const array_placas = []
    
    const campos_recupera = [ 'apellidos','correo','correo_sec','id','no_cliente','nombre','sucursal','telefono_fijo','telefono_movil','tipo' ]
    const campos_vehiculos = ['anio','categoria','cilindros','cliente','color','engomado','id','marca','marcaMotor','modelo','no_motor','placas','status','transmision','vinChasis' ]


    const {clientes, vehiculos} = BD
    console.log({clientes, vehiculos});

    let vehiculos_cliente = []
    Object.entries(vehiculos).forEach(([key, entrie])=>{
      // console.log(key);
      // console.log(entrie);
      const {cliente} = entrie
      const bkup_vehiculo = this._publicos.nuevaRecuperacionData(entrie, campos_vehiculos)
      vehiculos_cliente.push(bkup_vehiculo)
    })
    // console.log(vehiculos_cliente);
    let nuevos_v = {}
    Object.entries(clientes).forEach(([key, entrie])=>{
      // console.log(key);
        const nuevis = vehiculos_cliente.filter(v=>v.cliente === key)
        let vehiculos__ = {}
        nuevis.forEach((v,index)=>{
          const {id} = v
          vehiculos__[id] = v
        })

        if (entrie['vehiculos']) {
          const nuevis = this._publicos.crearArreglo2(entrie['vehiculos'])
         
          nuevis.forEach((v,index)=>{
            const {id} = v
            vehiculos__[id] = v
          })
        }

        

        nuevos_v[key] = vehiculos__

        Object.keys(nuevos_v).forEach(g=>{
          if (entrie.sucursal === nueva_data_vehiculos[entrie.sucursal]) {
            
          }
      })
    })

    
    console.log(nuevos_v);

    
    
    const updates = {}
    

    
  }
    
}