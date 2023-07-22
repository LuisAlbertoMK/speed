import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()

@Component({
  selector: 'app-edita-elemento',
  templateUrl: './edita-elemento.component.html',
  styleUrls: ['./edita-elemento.component.css']
})
export class EditaElementoComponent implements OnInit,OnChanges  {

  @Input() elemento_get: any;
  
  constructor(private fb: FormBuilder, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _publicos: ServiciosPublicosService) {  }

  form_element: FormGroup;
  
  info_get
  faltante_s = null

  ngOnInit(): void {
    // console.log(this.elemento_get);
     this.creaFormulario_editar()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['elemento_get']) {
      const nuevoValor = changes['elemento_get'].currentValue;
      const valorAnterior = changes['elemento_get'].previousValue;
      
      // Realiza acciones basadas en el cambio de valor
      // console.log('Nuevo valor:', nuevoValor);
      // console.log('Valor anterior:', valorAnterior);
      // console.log(this.elemento_get);
      if (nuevoValor)  {
        this.info_get = nuevoValor
        console.log(nuevoValor);
        
        // this.creaFormulario_editar(nuevoValor)
      }
    }
  }

  creaFormulario_editar(){
    this.form_element = this.fb.group({
      id:[this.data.id, [Validators.required]],
      descripcion:[this.data.descripcion, [Validators.required]],
      nombre:[this.data.nombre, [Validators.required]],
      tipo:[this.data.tipo, [Validators.required]],
    })
  }
  validarCampo(campo: string){
    return this.form_element.get(campo).invalid && this.form_element.get(campo).touched
  }
  guardaInfo(){
    const info = this.form_element.value
    const {ok, faltante_s } = this._publicos.realizavalidaciones_new(info,['id','nombre','descripcion','tipo'])
    this.faltante_s = faltante_s
    if (ok) {

      const updates = {}

      const nombre =  String(info.nombre).toLowerCase()
      const descripcion =  String(info.descripcion).toLowerCase()

      if (info.tipo === 'mo') {

        updates[`manos_obra/${info.id}/nombre`] = nombre
        updates[`manos_obra/${info.id}/descripcion`] = descripcion

      }else if (info.tipo === 'refaccion'){

        updates[`refacciones/${info.id}/nombre`] = nombre
        updates[`refacciones/${info.id}/descripcion`] = descripcion
      }
      this._publicos.mensaje_pregunta(`Actualizar información de elmento`,true, `<strong> ${nombre} </strong>`).then(({respuesta})=>{
        if (respuesta) {
          // console.log(updates);
          update(ref(db), updates).then(()=>{
            this._publicos.swalToast('actualización correcta!!',1)
          })
          .catch(err=>{
            this._publicos.swalToast('erro al actualizar!!',0)
          })
        }
      })
    }
  }
}
