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
      this.showHideForm = new EventEmitter()
    }

    sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]

    miniColumnas:number=100
    selected: Date | null;
    informacionFaltante:string
  
    formDeposito:FormGroup
  
    @Input() dataRecepcion:any = null
    @Output() showHideForm : EventEmitter<any>

    metodospago = [
      {metodo:1, show:'Efectivo'},
      {metodo:2, show:'Cheque'},
      {metodo:3, show:'Tarjeta'},
      {metodo:4, show:'OpenPay'},
      {metodo:5, show:'Clip / mercadoPago'},
      {metodo:6, show:'Terminal BBVA'},
      {metodo:7, show:'Terminal BANAMEX'}
    ]
    sucursal:string
    ordenes = []
    usuario:string
    rol:string
    myFilter = (d: Date | null): boolean => {
      const fecha = new Date(d)
      const day = fecha.getDay()
      return day !== 0;
    };
  ngOnInit(): void {
    this.listaOrdenes()
    this.infoDATA()
    this.crearFormPago()
  }
  listaOrdenes(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let recepciones_arra = []
        const recepciones = this._publicos.crearArreglo2(snapshot.val())
        const recep_1 = recepciones.filter(r=>r['status'] !== 'cancelado')
        const recep_2 = recep_1.filter(r=>r['status'] !== 'entregado')
        const ordenados = this._publicos.ordernarPorCampo(recep_2,'no_os')
        ordenados.forEach((recep)=>{
          const tempData = {
            id: recep['id'], no_os: recep['no_os'], sucursal: recep['sucursal']
          }
          recepciones_arra.push(tempData)
        })
        this.ordenes = recepciones_arra
      }
    })
  }

  infoDATA(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    if (variableX['sucursal']) {
      this.usuario = this._security.servicioDecrypt(variableX['usuario'])
      this.sucursal = this._security.servicioDecrypt(variableX['sucursal'])
      this.rol = this._security.servicioDecrypt(variableX['rol'])
    }
  }
  crearFormPago(){
    let sucursal = '';
    (this.sucursal ==='Todas') ? sucursal = '': sucursal= this.sucursal
    this.formDeposito = this.fb.group({
      monto:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      concepto:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      sucursal: [sucursal,[Validators.required]],
      usuario: [this.usuario, [Validators.required]],
      rol: [this.rol, [Validators.required]],
    })
  }
  validaCampo(campo: string){
    return this.formDeposito.get(campo).invalid && this.formDeposito.get(campo).touched
  }
  //registrar el deposito para la sucursal
  validaInformacion(){
    const campos = ['usuario','sucursal','rol','concepto','monto']
    const gastoData = this._publicos.recuperaDatos(this.formDeposito)
        
    const {ok, faltante_s}= this._publicos.realizavalidaciones_new(gastoData,campos)
    return {ok, faltante_s}
  }
  registroDeposito(){

    const campos = ['usuario','sucursal','rol','concepto','monto']
    const deposito_data = this._publicos.recuperaDatos(this.formDeposito)
    const { ok, faltante_s }= this._publicos.realizavalidaciones_new(deposito_data,campos)
    this.informacionFaltante = faltante_s
    
    if(!ok) {this._publicos.swalToast('Llenar datos de formulario',0, 'top-start'); return} 

      this._publicos.mensaje_pregunta('Realizar deposito').then(({respuesta})=>{
        if (respuesta) {
          const updates = {};
          const fecha_formato = this._publicos.retorna_fechas_hora()
          const infoSave = {
            fecha_registro: fecha_formato.fecha_hora_actual,
            sucursal: deposito_data['sucursal'],
            rol: deposito_data['rol'],
            usuario: deposito_data['usuario'],
            concepto: deposito_data['concepto'],
            monto: deposito_data['monto'],
            metodo:1,
            status:true,
            tipo:'deposito'
          }
          const clave = this._publicos.generaClave()
          // const claveDia = getTime2.fechaNumeros
          updates[`gastosDiarios/${deposito_data['sucursal']}/${this._publicos.formatearFecha(new Date(), false)}/${clave}`] = infoSave
          this._publicos.mensaje_pregunta(`Registrar deposito?`).then(({respuesta})=>{
            if (respuesta) {
              update(ref(db), updates).then(()=>{
                this.resetForm()
                this._publicos.mensajeSwal('Deposito realizado correctamente', 1)
                this.showHideForm.emit( {show: false})
              })
              .catch(err=>{
                console.log(err);
              })
            }
          })
          
          
        }
      })
    
  }

  //emitir cancelar
  cancela(){
    this.resetForm()
    this.showHideForm.emit( {show: false})
  }
  resetForm(){
    let sucursal = '';
    (this.sucursal ==='Todas') ? sucursal = '': sucursal= this.sucursal
    this.formDeposito.reset({
      monto:'',
      concepto:'',
      sucursal: sucursal,
      usuario: this.usuario,
      rol: this.rol
    })
  }
}
