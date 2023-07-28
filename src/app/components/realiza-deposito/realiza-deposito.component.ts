import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-realiza-deposito',
  templateUrl: './realiza-deposito.component.html',
  styleUrls: ['./realiza-deposito.component.css']
})
export class RealizaDepositoComponent implements OnInit {
 
  
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService, private _sucursales: SucursalesService) {
      this.data_deposito = new EventEmitter()
    }

    sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]

    miniColumnas:number=100

    faltante_s:string
  
    formDeposito:FormGroup

    @Output() data_deposito : EventEmitter<any>

   
    SUCURSAL:string
    ordenes = []
    usuario:string
    ROL:string
    myFilter = (d: Date | null): boolean => {
      const fecha = new Date(d)
      const day = fecha.getDay()
      return day !== 0;
    };
  ngOnInit(): void {

    this.rol()
    this.crearFormPago()

  }

  rol(){
    const { rol, sucursal, usuario } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    this.usuario = usuario
  }
  crearFormPago(){
    this.formDeposito = this.fb.group({
      monto:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      concepto:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      sucursal: [(this.SUCURSAL ==='Todas') ? '':  this.SUCURSAL,[Validators.required]],
      usuario: [this.usuario, [Validators.required]],
      rol: [this.ROL, [Validators.required]],
    })
  }
  validaCampo(campo: string){
    return this.formDeposito.get(campo).invalid && this.formDeposito.get(campo).touched
  }
  registroDeposito(){

    const campos = ['usuario','sucursal','rol','concepto','monto']
    const gastoData = this._publicos.recuperaDatos(this.formDeposito)
        
    const {ok, faltante_s}= this._publicos.realizavalidaciones_new(gastoData,campos)

    this.faltante_s = faltante_s
    if (!ok)  return


    const get_info = this._publicos.recuperaDatos(this.formDeposito)

    const guarda = {
      rol: get_info.rol,
      usuario: get_info.usuario,
      concepto: get_info.concepto,
      monto: get_info.monto,
      sucursal: get_info.sucursal,
      metodo:1,
      status:true,
      tipo:'deposito',
      fecha_recibido: this._publicos.retorna_fechas_hora().toString
    }
    this._publicos.mensaje_pregunta('Realizar deposito').then(({respuesta})=>{
      if (respuesta) {
        const nueva_clave = this._publicos.generaClave()
        const solo_numeros_fecha_hoy = this._publicos.solo_numeros_fecha_hoy()
        const updates = {[`historial_gastos_diarios/${get_info.sucursal}/${solo_numeros_fecha_hoy}/${nueva_clave}`]: guarda}
        update(ref(db), updates).then(()=>{
          this.resetForm()
          this._publicos.swalToast('Deposito realizado',1, 'top-start')
          this.data_deposito.emit(  true )
        })
        .catch(err=>{
          console.log(err);
          this._publicos.swalToast('Error al registrar deposito',0, 'top-start')
        })
      }
    })
  }
  cancela(){
    this.resetForm()
    // this.data_deposito.emit( {show: false})
  }
  resetForm(){
    this.formDeposito.reset({
      monto:'',
      concepto:'',
      sucursal: (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL,
      usuario: this.usuario,
      rol: this.ROL
    })
  }
}
