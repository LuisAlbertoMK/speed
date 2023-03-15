import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import Swal from 'sweetalert2';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { SucursalesService } from '../../services/sucursales.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  @Input() dataRecepcion:any = null
  @Output() showPagoHide : EventEmitter<any>

  

  miniColumnas:number=100
  formPago:FormGroup
  selected: Date | null;
  informacionFaltante:string
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService, private _sucursales: SucursalesService) {
      this.showPagoHide = new EventEmitter()
    }
  metodospago = [
    {metodo:1, show:'Efectivo'},
    {metodo:2, show:'Cheque'},
    {metodo:3, show:'Tarjeta'},
    {metodo:4, show:'Transferencia'},
  ]
  usuario:string
  rol:string
  validaciones= [
    {valor: 'no_os', show:'O.S'},
    {valor: 'monto', show:'Monto'},
    {valor: 'metodo', show:'Metodo'},
    {valor: 'concepto', show:'Concepto'},
    {valor: 'referencia', show:'Referencia'},
    {valor: 'fecha', show:'Fecha de pago'},
    {valor: 'fecha_registro', show:'Fecha de registro'},
    {valor: 'hora_registro', show:'Hora de registro'},
    {valor: 'sucursal', show:'Sucursal'},
    {valor: 'usuario', show:'Usuario'},
    {valor: 'rol', show:'ROL'}
  ]
  Sucursales= []
  sucursal:string
  ordenes = []
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
    this.formPago = this.fb.group({
      no_os:['',[Validators.required]],
      monto:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      metodo:['',[Validators.required]],
      concepto:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      referencia:['',[Validators.minLength(5), Validators.maxLength(250)]],
      fecha:[this.selected,[Validators.required]],
      sucursal: [sucursal,[Validators.required]],
      usuario: [this.usuario, [Validators.required]],
      rol: [this.rol, [Validators.required]],
    })
  }
  validaCampo(campo: string){
    return this.formPago.get(campo).invalid && this.formPago.get(campo).touched
  }

  async validaInformacion(){
    const answer = {valido: false, dataSave:{}, faltante:''}
    const pagoData = this.formPago.value
    const getFecha = await this._publicos.getFechaHora()
    if (this.dataRecepcion) {
      pagoData['no_os'] = this.dataRecepcion['id']
      pagoData['sucursal'] = this.dataRecepcion['sucursal']
    }
    const dataSave = {
      no_os: pagoData['no_os'],monto: pagoData['monto'],metodo: parseInt(pagoData['metodo']),
      concepto: pagoData['concepto'],fecha_registro: getFecha.fecha,
      hora_registro: getFecha.hora,sucursal: pagoData['sucursal'],usuario: pagoData['usuario'],
      rol: pagoData['rol'],tipo:'pago',status: true
    };
    let fecha = this.selected, date = null;
    dataSave['fecha'] = '';
    (fecha) ? date = new Date(this.selected): '';
      if (date instanceof Date) {
        const fechaSave = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        dataSave['fecha'] = fechaSave
      }
    (String(pagoData['referencia']).length >0 )? dataSave['referencia'] = pagoData['referencia'] : ''
    answer.dataSave = dataSave
    let invcalidos = []
    const mapdataSave = Object.keys(dataSave)
    await mapdataSave.forEach(v=>{
        if (!dataSave[v]) {
          this.validaciones.forEach(val=>{
            if (val['valor'] === v) {
              invcalidos.push(val['show'])
            }
          })
        }
    })
    if (!invcalidos.length) answer.valido = true 
    answer.faltante = invcalidos.join(', ')
    return answer
  }
  registroPago(){
    this.validaInformacion().then(({valido,dataSave,faltante})=>{
      this.informacionFaltante = ''
      if (!valido) {
        this.informacionFaltante = faltante
        return Object.values( this.formPago.controls ).forEach( control => {
          if ( control instanceof FormGroup ) {
            Object.values( control.controls ).forEach( control => control.markAsTouched() );
          } else {
            control.markAsTouched();
          }
        });
      }else{
        
        Swal.fire({
          title: 'Guardar pago?',
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          denyButtonText: `Don't save`,
          cancelButtonText:'Cancelar'
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            const updates = {}
            const newPostKey = push(child(ref(db), 'posts')).key
            const campos = ['concepto','fecha','fecha_registro','hora_registro','metodo','monto','rol','status','tipo','sucursal']
            const recuperados = this._publicos.nuevaRecuperacionData(dataSave,campos)
            updates[`recepciones/${dataSave['no_os']}/HistorialPagos/${newPostKey}`] = recuperados;
            update(ref(db), updates).then(()=>{
              this.formPago.reset({
                no_os: '',  usuario: this.usuario,  sucursal: this.sucursal,
                referencia: '',  rol: this.rol
              })
              this.selected = null
              this._publicos.mensaje('registro pago correto',1)
            })
          } else if (result.isDenied) {
            // Swal.fire('Changes are not saved', '', 'info')
          }
        })
      }
    })
  }
  changeInfo(id: any){
    if(!id) {
      this.formPago.controls['sucursal'].setValue('')
    }else{
      const data = this.ordenes.find(os=>os['id'] === id)
      this.formPago.controls['sucursal'].setValue(data['sucursal'])
    } 
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      const date = new Date(event.value)
      if (date instanceof Date) {
        const fechaSave = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        this.formPago.controls['fecha'].setValue( fechaSave)
      }else{
        this.formPago.controls['fecha'].setValue('')
      }
  }
  nuevoevento(){
    console.log('aqui');
    
  }
  cancela(){
    this.showPagoHide.emit( {show: false})
  }
}
