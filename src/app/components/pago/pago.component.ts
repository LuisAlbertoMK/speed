import { Component, OnInit, Input, Output,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

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

  minDate: Date;
  maxDate: Date;

  miniColumnas:number=100
  formPago:FormGroup
  selected: Date | null;
  informacionFaltante:string
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService, private _sucursales: SucursalesService) {
      this.showPagoHide = new EventEmitter()
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear , 0, 1);
      this.maxDate = new Date(currentYear , 11, 31);
    }
    ROL:string; SUCURSAL:string
    
    sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]

    metodospago = [
      {metodo:'1', show:'Efectivo'},
      {metodo:'2', show:'Cheque'},
      {metodo:'3', show:'Tarjeta'},
      {metodo:'4', show:'OpenPay'},
      {metodo:'5', show:'Clip / mercadoPago'},
      {metodo:'6', show:'Terminal BBVA'},
      {metodo:'7', show:'Terminal BANAMEX'}
    ]

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
    tiempoReal:boolean = true

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
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    // this.listaOrdenes()
  }
  listaOrdenes(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {

        const recepciones = this._publicos.crearArreglo2(snapshot.val())        
        function filtrarOrdenes(recepciones, sucursal) {
          const rcp = recepciones
            .filter(recep => {
              const status = recep.status;
              // return (status !== 'cancelado' && status !== 'espera');
              return (status !== 'cancelado');
            })
            .map(recep => {
              return {
                id: recep.id,
                no_os: recep.no_os,
                fecha: recep.fecha_recibido,
                hora: recep.hora_recibido,
                sucursal: recep.sucursal.id,
                status: recep.status
              };
            });
            
            return (sucursal === 'Todas') ? rcp : rcp.filter(os => os.sucursal === sucursal);
        }
        this.ordenes = filtrarOrdenes(recepciones, this.SUCURSAL);

      }
      
    })
  }


  crearFormPago(){
    let sucursal = '';
    (this.SUCURSAL ==='Todas') ? sucursal = '': sucursal= this.SUCURSAL
    this.formPago = this.fb.group({
      no_os:['',[Validators.required]],
      monto:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      metodo:['',[Validators.required]],
      concepto:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      fecha:[null,[Validators.required]],
      sucursal: [sucursal,[Validators.required]],
      rol: [this.ROL, [Validators.required]],
    })
  }
  validaCampo(campo: string){
    return this.formPago.get(campo).invalid && this.formPago.get(campo).touched
  }

  validaInformacion(){
    const camposNecesarios = ['no_os','monto','metodo','concepto','fecha','sucursal']
    if (this.SUCURSAL !=='Todas') {
      const fecha = this._publicos.retorna_fechas_hora({fechaString: new Date().toString()}).fecha_hora_actual
      this.formPago.controls['fecha'].setValue(fecha)
    }
    const info_pago = this._publicos.recuperaDatos(this.formPago)
    
    const {ok, faltante_s}= this._publicos.realizavalidaciones_new(info_pago,camposNecesarios)
    return {ok, faltante_s}
  }
  registroPago(){
    const {ok, faltante_s} = this.validaInformacion()
    this.informacionFaltante = faltante_s
    if(!ok) {this._publicos.swalToast('Llenar datos de formulario',0); return} 
    this.informacionFaltante = null
    // const info = this.formPago.value
    const info = this._publicos.recuperaDatos(this.formPago)

    const dataSave = {
        concepto:        info.concepto,
        fecha_registro:  info.fecha,
        metodo:          info.metodo,
        monto:           info.monto,
        status:          true,
        sucursal:        info.sucursal,
        tipo:            'pago'
      }
    const updates = { [`recepciones/${info.no_os}/HistorialPagos/${this._publicos.generaClave()}`]: dataSave };
    // console.log(dataSave.hora_registro);
    // console.table(dataSave);
    this._publicos.mensaje_pregunta(`Registrar pago?`).then(({respuesta})=>{
      if (respuesta) {
        update(ref(db), updates).then(()=>{
          this._publicos.swalToast('Registro de gasto correcto',1,'top-start')
          this.formPago.reset()
        })
        .catch(error=>{
          this._publicos.swalToast('Error al regisrar gasto',0,'top-start')
        })
      }
    })
    
   
    
  }
  changeInfo(id: any){
    if(!id) {
      this.formPago.controls['sucursal'].setValue('')
    }else{
      const data = this.ordenes.find(os=>os['id'] === id)
      this.formPago.controls['sucursal'].setValue(data.sucursal)
    } 
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      const date = new Date(event.value)
      // if (date instanceof Date) {
      //   const fechaSave = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
      //   this.formPago.controls['fecha'].setValue( fechaSave)
      // }else{
      //   this.formPago.controls['fecha'].setValue('')
      // }
      if (date > this.minDate && date <=this.maxDate) {
        // console.log('valida');
        const fecha_formato = this._publicos.retorna_fechas_hora({fechaString:date.toString()})
        this.formPago.controls['fecha'].setValue( fecha_formato.toString_completa )
      }else{
        // console.log('verificar');
        this.formPago.controls['fecha'].setValue( null )
        // this.fecha_new = null
      }
  }
  cancela(){
    this.showPagoHide.emit( {show: false})
  }
}
