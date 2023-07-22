import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-data-facturacion-cliente',
  templateUrl: './data-facturacion-cliente.component.html',
  styleUrls: ['./data-facturacion-cliente.component.css']
})
export class DataFacturacionClienteComponent implements OnInit {

  miniColumnas:number = 100

  @Input() clienteID:any = null

  @Output() dataEmit : EventEmitter<any>
  
  formFacturacion: FormGroup
  faltantes:String
  // rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z\d]{0,2}$/;
  rfcPattern = /^(?!^(\d{10})$)^([A-ZÑ&]{3,4})(\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[A-Z\d]{2}\d{1}$/;

  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, private _security:EncriptadoService) { 
    this.dataEmit = new EventEmitter()
  }

  ngOnInit(): void {
    this.crearFormFacturacion()
  }
  crearFormFacturacion(){
    // let clieID  = null
    // if (this.clienteID) clieID = this.clienteID
    this.formFacturacion = this.fb.group({
      cliente:['',[Validators.required]],
      razon:['',[Validators.required,Validators.minLength(6)]],
      // rfc:['',[Validators.required,Validators.pattern("^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$")]],
      rfc:['',[Validators.required,Validators.minLength(13),Validators.maxLength(14),Validators.pattern(this.rfcPattern)]],
    })
  }
  validaCampo(campo: string){
    return this.formFacturacion.get(campo).invalid && this.formFacturacion.get(campo).touched
  }
  async validaciones(){
    const answer = {ok: true, faltantes:[]}
    const campos = Object.keys(this.formFacturacion.value)
    if (this.clienteID) {
      this.formFacturacion.controls['cliente'].setValue(this.clienteID)
    }
    const data = this.formFacturacion.value
    let faltantes = []
    campos.forEach((c)=>{
      if (!data[c]) {
        faltantes.push(c)
        answer.ok = false
      }
    })
    answer.faltantes = faltantes
    return answer
  }
  Validar(){
    this.validaciones().then(({ok,faltantes})=>{
      if (ok) {
        this.faltantes = null
      }else{
        this.faltantes = faltantes.join(', ')
      }
    })
  }
  guardaDataFacturacion(){
    this.validaciones().then(({ok,faltantes})=>{
      if (ok) {
        const updates = {}
        // this._publicos
        const dataForm = this.formFacturacion.value
        const tempData = { razon: dataForm.razon, rfc: dataForm.rfc }
        
        updates[`clientes/${dataForm['cliente']}/dataFacturacion/unica`] = tempData
        console.log(updates);
        this.faltantes = null
        update(ref(db), updates).then(()=>{
          this.resetForm()
          this.dataEmit.emit( {ok: true})
          this._publicos.mensajeSwal('Registro correcto!',1)
        })
        .catch(err=>{
          this.dataEmit.emit( {ok: true})
          this._publicos.mensajeSwal('Fallo el registro de información',0)
        })
        
      }else{
        this.faltantes = faltantes.join(', ')
      }
    })
  }
  resetForm(){
    this.formFacturacion.reset(
      {
        cliente: this.clienteID
      }
    )
  }
}
