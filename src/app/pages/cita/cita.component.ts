import { Component, OnInit,Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"

import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css']
})
export class CitaComponent implements OnInit {
  info: any
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _publicos: ServiciosPublicosService) { }
  editar:boolean = false
  ngOnInit(): void {
    // console.log(this.data);
    this.info = this.data?.info
    this.editar = this.data?.editar
  }

  eliminar(){
    if (this.info) {
      this._publicos.mensaje_pregunta('Desea cancelar la cita').then(({respuesta})=>{
        if (respuesta) {
          const updates = {[`${this.info.ruta}`] : null}
            update(ref(db), updates).then(()=>{
              this._publicos.mensajeSwalError('Cita cancelada')
              // this.data  = null
            })
        }
      })
    }
    
  }

}
