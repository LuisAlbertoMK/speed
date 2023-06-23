import { Component, OnInit,Inject } from '@angular/core';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"

import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CitasService } from 'src/app/services/citas.service';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css']
})
export class CitaComponent implements OnInit {
  info: any
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _publicos: ServiciosPublicosService, private _vehiculos:VehiculosService,
  private _citas: CitasService) { }
  editar:boolean = false
  camposVehiculo:any[] = [...this._vehiculos.camposVehiculo_]
  colores_citas = [...this._citas.colores_citas]
  opciones_menu = []
   ngOnInit(): void {
    // console.log(this.data);
    this.info = this.data?.info
    this.editar = this.data?.editar
    this.opcionesMenu()
  }
  opcionesMenu(){
    const menus= [
      'concretada',
      'noConfirmada',
      'confirmada',
      'sinConfirmarDomicilio',
      'cancelada',
    ]
    const filter = menus.filter(f=>f !== this.info.status)
    // this.opciones_menu = filter.filter(f => f !== 'concretada' && f !== 'cancelada');
    this.opciones_menu = filter
    // console.log(this.opciones_menu);
    
  }
  citaAccion(status){
    if (this.info) {
      const mensaje = this.colores_citas.find(c=>c.valor === status).mensaje
      this._publicos.mensaje_pregunta(`Desea que la cita sea ${mensaje}`).then(({respuesta})=>{
        if (respuesta) {
          const updates = {[`${this.info.ruta}/status`] : status}
          // console.log(updates);
          
            update(ref(db), updates).then(()=>{
              this._publicos.mensajeSwal(`Cita ${mensaje}`)
              // this.data  = null
              // console.log();
              const {mensaje: newmensaje}= this.colores_citas.find(c=>c.valor === status)
              this.info.status = status
              this.info.mensajeStatus = newmensaje
              const menus= [
                'concretada',
                'noConfirmada',
                'confirmada',
                'sinConfirmarDomicilio',
                'cancelada',
              ]
              const filter = menus.filter(f=>f !== this.info.status)
              // this.opciones_menu = filter.filter(f => f !== 'concretada' && f !== 'cancelada');
              this.opciones_menu = filter
            })
            .catch(err=>{
              this._publicos.mensajeSwalError(`Error al cambiar el status de la cita`)
            })
        }
      })
    }
  }

}
