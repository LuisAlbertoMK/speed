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
  miniColumnas:number=100
  selected: Date | null;
  informacionFaltante:string

  formDeposito:FormGroup

  @Input() dataRecepcion:any = null
  @Output() showHideForm : EventEmitter<any>
  
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService, private _sucursales: SucursalesService) {
      this.showHideForm = new EventEmitter()
    }
    metodospago = [
      {metodo:1, show:'Efectivo'},
      {metodo:2, show:'Cheque'},
      {metodo:3, show:'Tarjeta'},
      {metodo:4, show:'OpenPay'},
      {metodo:5, show:'Clip / mercadoPago'},
      {metodo:6, show:'Terminal BBVA'},
      {metodo:7, show:'Terminal BANAMEX'}
    ]
    Sucursales= []
    sucursal:string
    ordenes = []
    usuario:string
    rol:string
  ngOnInit(): void {
    this.listaOrdenes()
    this.listaSucursales()
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
  listaSucursales(){
    this._sucursales.consultaSucursales().then(({contenido,data})=>{
      if (contenido) {
        this.Sucursales = data
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

  registroDeposito(){
    const infoFormulario = this.formDeposito.value
    const campos = ['usuario','sucursal','rol','concepto','monto']
    const {faltante_s, ok} = this._publicos.realizaValidaciones(campos,infoFormulario)
    this.informacionFaltante = null
    if (ok) {
      this._publicos.mensaje_pregunta('Realizar deposito').then(({respuesta})=>{
        if (respuesta) {
          // console.log('realiza deposito');
          // console.log('guardar en gastosDiarios');
          const getTime = this._publicos.convierte_fechaString_personalizada(new Date())
          const getTime2 = this._publicos.getFechaHora()
          const updates = {};
          const infoSave = {
            fecha: getTime.string_fecha,
            hora: getTime.stringHora,
            fechaCompara: getTime.fechaString,
            sucursal: infoFormulario['sucursal'],
            rol: infoFormulario['rol'],
            usuario: infoFormulario['usuario'],
            concepto: infoFormulario['concepto'],
            monto: infoFormulario['monto'],
            metodo:1,
            status:true,
            tipo:'deposito'
          }
          const clave = this._publicos.generaClave()
          // const claveDia = getTime2.fechaNumeros
          updates[`gastosDiarios/${infoFormulario['sucursal']}/${this._publicos.formatearFecha(new Date(), false)}/${clave}`] = infoSave
          update(ref(db), updates).then(()=>{
            this.resetForm()
            this._publicos.mensajeSwal('Deposito realizado correctamente')
            this.showHideForm.emit( {show: false})
          })
          
        }
      })
    }else{
      this.informacionFaltante = faltante_s
    }
    
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
