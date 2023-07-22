import { Component, OnInit,Inject } from '@angular/core';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"

import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CitasService } from 'src/app/services/citas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { EmailsService } from 'src/app/services/emails.service';

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
  private _citas: CitasService,private router: Router, private _sucursales: SucursalesService, private _cliente: ClientesService, private _email: EmailsService) { }
  editar:boolean = false
  camposVehiculo:any[]   = [...this._vehiculos.camposVehiculo_]
  colores_citas          = [...this._citas.colores_citas]
  opciones_menu          = []
  menus= [ 'concretada','noConfirmada','confirmada','sinConfirmarDomicilio','cancelada' ]
  comentario:string
  enrutamiento = {vehiculo:'', cliente:'', anterior:''}
  motivoForm = new FormGroup({
    motivo: new FormControl('', Validators.required)
  });
  lista_sucursale_arr = [...this._sucursales.lista_en_duro_sucursales]
   ngOnInit(): void {
     this.info = this.data?.info
     console.log(this.info);
    this.editar = this.data?.editar
    this.opcionesMenu()
  }
  opcionesMenu(){
    const filter = this.colores_citas.filter(f=>f.valor !== this.info.status)
    this.opciones_menu = filter
  }
  citaAccion(status){
    if (this.info) {
      const mensaje = this.colores_citas.find(c=>c.valor === status).mensaje
      this._publicos.mensaje_pregunta(`Desea que la cita sea ${mensaje}`).then(({respuesta})=>{
        if (respuesta) {
          const updates = {[`${this.info.ruta}/status`] : status}
            update(ref(db), updates).then(async ()=>{
              this._publicos.mensajeSwal(`Cita ${mensaje}`, 1)
              const {mensaje: newmensaje}= this.colores_citas.find(c=>c.valor === status)
              this.info.status = status
              this.info.mensajeStatus = newmensaje
              this.opcionesMenu()
              const sucursal_Info = this.lista_sucursale_arr.find(s=>s.id === this.info.sucursal)
              const dataCliente:any = await this._cliente.consulta_cliente_new(this.info.cliente)
              // console.log(updates);
              const correos = this._publicos.dataCorreo(sucursal_Info, dataCliente)

              this._email.cancelaRecoleccion({
                correos,
                fullname: dataCliente.fullname,
                dia: `${this.info.dia} ${this.info.horario}`,
                placas: this.info.placas,
                motivo: `${mensaje}`,
                subject: 'Su cita cambio su status'
              })
            })
            .catch(err=>{
              this._publicos.mensajeSwal(`Error al cambiar el status de la cita`,0)
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
            this._publicos.mensajeSwal(`Error al registrar un comentario`,0)
          })
        }
      })
    }else{
      this._publicos.mensajeSwal(`El comentario no es valido`,0)
    }
  }
  aceptarRecoleccion(){
    // const mensaje  = (false) ? 'Aceptar recoleccion a domicilio?' : 'Negar recoleccion a domicilio?'
    const mensaje = 'Aceptar recoleccion a domicilio?' 
    this._publicos.mensaje_pregunta(mensaje).then(async ({respuesta})=>{
      if (respuesta) {
        const updates = {[`${this.info.ruta}/recoleccion}`]: true}
        const sucursal_Info = this.lista_sucursale_arr.find(s=>s.id === this.info.sucursal)
        const dataCliente:any = await this._cliente.consulta_cliente_new(this.info.cliente)
        // console.log(updates);
        const correos = this._publicos.dataCorreo(sucursal_Info, dataCliente)
        update(ref(db), updates).then(()=>{
          this.info.recoleccion = true
          this._email.cancelaRecoleccion({
            correos,
            fullname: dataCliente.fullname,
            dia: `${this.info.dia} ${this.info.horario}`,
            placas: this.info.placas,
            motivo: 'ha sido confirmada',
            subject: 'Confirmación de cita'
          })
        })
        .catch(err=>{
          this._publicos.mensajeSwal(`ocurrio un error`,0)
        })
      }
    })
    
    
  }

  async negarRecoleccion() {
    const { value, isConfirmed } = await Swal.fire({
      title: 'Sin recolección a domicilio',
      input: 'textarea',
      inputLabel: 'Ingresa el motivo de rechazo',
      inputPlaceholder: 'Motivo',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      inputValidator: (value) => {
        if (!value && value.length < 10) {
          return 'Debe ingresar un motivo';
        }else{
          return ''
        }
      }
    });
  
    if (isConfirmed) {
      this.motivoForm.patchValue({ motivo: value });
      // Aquí puedes realizar cualquier acción adicional con el motivo, como asignarlo a una variable
      const motivoRecuperado = this.motivoForm.value.motivo;
      const updates = {[`${this.info.ruta}/recoleccion}`]: false}
      const sucursal_Info = this.lista_sucursale_arr.find(s=>s.id === this.info.sucursal)
      const dataCliente:any = await this._cliente.consulta_cliente_new(this.info.cliente)

      const correos = this._publicos.dataCorreo(sucursal_Info, dataCliente)
      // console.log(correos);
      update(ref(db), updates).then(()=>{
        this.info.recoleccion = false
        if (correos.length >= 2) {
          this._email.cancelaRecoleccion({
            correos,
            fullname: dataCliente.fullname,
            dia: `${this.info.dia} ${this.info.horario}`,
            placas: this.info.placas,
            motivo: `no habra recoleccion motivo ${motivoRecuperado}`,
            subject: 'No recoleccion a domicilio'
          })
        }
      })
      .catch(err=>{
        this._publicos.mensajeSwal(`ocurrio un error`, 0)
      })
    }
  }
  
  
  irPagina(){
    const Params =this._publicos.nuevaRecuperacionData(this.info, ['cliente','vehiculo','cotizacion','ruta','id'])
    const queryParams = { anterior: 'citas', tipo: 'cita', ...Params}
    this.router.navigate([`/ServiciosConfirmar`], { queryParams });
  }

}
