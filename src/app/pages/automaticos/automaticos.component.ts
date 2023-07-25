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
   
    const array_placas = []
    
    const campos_recupera = [ 'apellidos','correo','correo_sec','id','no_cliente','nombre','sucursal','telefono_fijo','telefono_movil','tipo' ]
    const campos_vehiculos = ['anio','categoria','cilindros','cliente','color','engomado','id','marca','marcaMotor','modelo','no_motor','placas','status','transmision','vinChasis' ]


    const {clientes, vehiculos, cotizacionesRealizadas} = BD

    // let vehiculos_cliente = []
    // Object.entries(vehiculos).forEach(([key, entrie])=>{
    //   const {cliente} = entrie
    //   const bkup_vehiculo = this._publicos.nuevaRecuperacionData(entrie, campos_vehiculos)
    //   vehiculos_cliente.push(bkup_vehiculo)
    // })

    let updates = {}
    // Object.entries(clientes).forEach(([key, entrie])=>{
    //   const {sucursal} = entrie
    //     const nuevis = vehiculos_cliente.filter(v=>v.cliente === key)
    //     let vehiculos__ = {}
    //     nuevis.forEach((v,index)=>{
    //       const {id} = v
    //       vehiculos__[id] = v
    //     })
    //     if (entrie['vehiculos']) {
    //       const nuevis = this._publicos.crearArreglo2(entrie['vehiculos'])
         
    //       nuevis.forEach((v,index)=>{
    //         const {id} = v
    //         vehiculos__[id] = {...v, cliente: key, sucursal}
    //       })
    //     }
    //   })
     

      // console.log(cotizacionesRealizadas);
      
      // Object.entries(cotizacionesRealizadas).forEach(([key, entrie])=>{
      //   // console.log(entrie);
      //   const {cliente, sucursal, fecha, hora, vehiculo} = entrie
      //   const {id: idCliente, sucursal: idSucursal} = cliente
      //   const {id: idVehiculo} = vehiculo
      //   // const {id: idSucursal} = sucursal
      //   const fecha_n = this._publicos.convertirFecha(fecha)
      //   const fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: fecha_n, hora_recibida: hora }).toString
      //   const nnn= this._publicos.sumarRestarDiasFecha(new Date(fecha_recibido), 20)
      //   const vencimiento = this._publicos.retorna_fechas_hora({fechaString: new Date(nnn), hora_recibida: hora }).toString
      //   const nueva_entri = {...entrie, cliente: idCliente, sucursal: idSucursal, fecha_recibido, vehiculo: idVehiculo, vencimiento }
      //   delete nueva_entri.fecha
      //   delete nueva_entri.hora

      //   updates[`cotizacionesRealizadas/${idSucursal}/${idCliente}/${key}`] = nueva_entri
      // })
      // console.log(updates);
      const updates1 = {['cotizacionesRealizadas']: null}
    //  update(ref(db), updates).then(()=>{
    //     console.log('finalizo');
    //   })
    //   .catch(err=>{
    //     console.log(err);
    //   })

    
  }
    
}