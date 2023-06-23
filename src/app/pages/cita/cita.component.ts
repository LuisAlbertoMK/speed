import { Component, OnInit,Inject } from '@angular/core';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"

import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CitasService } from 'src/app/services/citas.service';
import { Router } from '@angular/router';

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
  private _citas: CitasService,private router: Router) { }
  editar:boolean = false
  camposVehiculo:any[] = [...this._vehiculos.camposVehiculo_]
  colores_citas = [...this._citas.colores_citas]
  opciones_menu = []
  menus= [ 'concretada','noConfirmada','confirmada','sinConfirmarDomicilio','cancelada' ]
  comentario:string
  enrutamiento = {vehiculo:'', cliente:'', anterior:''}
   ngOnInit(): void {
     this.info = this.data?.info
    this.editar = this.data?.editar
    this.opcionesMenu()
  }
  opcionesMenu(){
    const filter = this.menus.filter(f=>f !== this.info.status)
    this.opciones_menu = filter
  }
  citaAccion(status){
    if (this.info) {
      const mensaje = this.colores_citas.find(c=>c.valor === status).mensaje
      this._publicos.mensaje_pregunta(`Desea que la cita sea ${mensaje}`).then(({respuesta})=>{
        if (respuesta) {
          const updates = {[`${this.info.ruta}/status`] : status}
            update(ref(db), updates).then(()=>{
              this._publicos.mensajeSwal(`Cita ${mensaje}`)
              const {mensaje: newmensaje}= this.colores_citas.find(c=>c.valor === status)
              this.info.status = status
              this.info.mensajeStatus = newmensaje
              this.opcionesMenu()
            })
            .catch(err=>{
              this._publicos.mensajeSwalError(`Error al cambiar el status de la cita`)
            })
        }
      })
    }
  }
  nuevoComentario(){
    if (String(this.comentario).length > 10 && this.info.id) {
      this._publicos.mensaje_pregunta('Registrar comentario de cita').then(({respuesta})=>{
        if (respuesta) {
          const updates = {[`${this.info.ruta}/comentarios/${this._publicos.generaClave()}`]: {comentario: this.comentario}}
          // console.log(updates);
          update(ref(db), updates).then(()=>{
            this.info.comentarios.push(Object({comentario: this.comentario}))
            this.comentario = null
          })
          .catch(err=>{
            this._publicos.mensajeSwalError(`Error al registrar un comentario`)
          })
        }
      })
    }else{
      this._publicos.swalToastError(`El comentario no es valido`)
    }
  }
  irPagina(){
    const Params =this._publicos.nuevaRecuperacionData(this.info, ['cliente','vehiculo','cotizacion','ruta','id'])
    this.router.navigate([`/ServiciosConfirmar`], { 
          queryParams: 
          { 
            anterior: 'citas',
            tipo: 'cita',
            ...Params
          }
        });
  }

}
