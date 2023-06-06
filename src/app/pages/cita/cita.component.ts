import { Component, OnInit,Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.css']
})
export class CitaComponent implements OnInit {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private _publicos: ServiciosPublicosService) { }
  editar:boolean = false
  ngOnInit(): void {
  }

  eliminar(){
    if (this.data) {
      this._publicos.mensaje_pregunta('Desea cancelar la cita').then(({respuesta})=>{
        if (respuesta) {
          const updates = {[`${this.data.ruta}`] : null}
            update(ref(db), updates).then(()=>{
              this._publicos.mensajeSwalError('Cita cancelada')
              this.data  = null
            })
        }
      })
    }
    
  }

}
