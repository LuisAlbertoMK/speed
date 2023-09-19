import { Component, OnInit, Input, Output,EventEmitter, SimpleChanges, OnChanges} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { SucursalesService } from '../../services/sucursales.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit, OnChanges {

  @Input() dataRecepcion:any = null
  @Output() showPagoHide : EventEmitter<any>

  @Input() id_os:any


  minDate: Date;
  maxDate: Date;

  miniColumnas:number=100
  formPago:FormGroup
  selected: Date | null;
  faltante_s:string
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, private _servicios: ServiciosService,
    private _security:EncriptadoService, private _sucursales: SucursalesService, private _reporte_gastos: ReporteGastosService) {
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


    claves_ordenes= []

    fecha_recibido = new FormGroup({
      start: new FormControl(new Date())
    });

    data_pendiente
    myFilter = (d: Date | null): boolean => {
      const fecha = new Date(d)
      const day = fecha.getDay()
      return day !== 0;
    };
  ngOnInit(): void {
    this.rol()
    this.crearFormPago()    
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['id_os']) {
      const nuevoValor = changes['id_os'].currentValue;
      const valorAnterior = changes['id_os'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      const {id} = nuevoValor

      if (nuevoValor && id) {
        if (!this.formPago) {
          const temp = {
            ...nuevoValor,
            tipo: 'orden'
          }
          this.data_pendiente = temp
        }
      }else if(nuevoValor === valorAnterior && id){
        const temp = {
          ...nuevoValor,
          tipo: 'orden'
        }
        this.data_pendiente = temp
      }
    }
  }
  carga_data_gasto(data){
    const {id, sucursal} = data
    this.formPago.reset({
      no_os: id,
      monto: 0,
      metodo: '1',
      concepto: '',
      sucursal,
      rol: this.ROL,
    })
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
  }
  
  crearFormPago(){
    let sucursal = '';
    (this.SUCURSAL ==='Todas') ? sucursal = '': sucursal= this.SUCURSAL
    this.formPago = this.fb.group({
      no_os:['',[Validators.required]],
      id_os:['',[Validators.required]],
      monto:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      metodo:['',[Validators.required]],
      concepto:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      fecha_recibido:[null,[Validators.required]],
      sucursal: [sucursal,[Validators.required]],
      rol: [this.ROL, [Validators.required]],
    })
    this.vigila()
    
  }
  vigila(){
    // if (this.SUCURSAL !== 'Todas')  this.formPago.get('sucursal').disable()

    if (this.SUCURSAL !== 'Todas')  this.muestra_claves_recepciones()

    this.formPago.get('sucursal').valueChanges.subscribe(async (sucursal: string) => {
      if (sucursal) {
        this.muestra_claves_recepciones()
      }
    })
    this.formPago.get('id_os').valueChanges.subscribe(async (id_os: string) => {
      if (id_os) {
        const no_os = this.claves_ordenes.find(clave => clave.id === id_os)
          if (no_os) {
            this.formPago.get('no_os').setValue(no_os.no_os)
          }else{
            this.formPago.get('no_os').setValue('')
          }
      }
    })
    this.fecha_recibido.get('start').valueChanges.subscribe((start:Date)=>{
      if (start) {
        const fecha_re = this._publicos.retorna_fechas_hora({fechaString: start['_d']}).toString_completa
        this.formPago.get('fecha_recibido').setValue(fecha_re)
      }
    })

    if (this.data_pendiente) {
      this.carga_data_gasto(this.data_pendiente)
      this.data_pendiente = null
    }
  }
  
  // async muestra_claves_recepciones(){
  //   const {tipo, sucursal} = this._publicos.recuperaDatos(this.formPago)
  //   this.claves_ordenes = await this._servicios.claves_recepciones(`recepciones/${sucursal}`)
  // }
  async muestra_claves_recepciones(){
    const {tipo, sucursal} = this._publicos.recuperaDatos(this.formPago)
    // this.muestraLista = (tipo === 'orden') ? true : false
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const todas = this._publicos.crearArreglo2(snapshot.val());
        const filtradas = todas.filter(recep=>recep.sucursal === sucursal)
        const claves_show = solo_claves(filtradas)
        this.claves_ordenes  = solo_claves(filtradas)
        function solo_claves(arreglo){
          let nuevos = [...arreglo]
          return nuevos.map(n=>{
            const {id, no_os} = n
            return {id, no_os}
          })
        }
        
      } else {
        console.log("No data available");
      }
    })
  }
  validaCampo(campo: string){
    return this.formPago.get(campo).invalid && this.formPago.get(campo).touched
  }

  async registroPago(){
    const info_get = this._publicos.recuperaDatos(this.formPago)
 
    
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(info_get, ['id_os','no_os','monto','metodo','concepto','sucursal'])
    this.faltante_s = faltante_s
    if(!ok) {this._publicos.swalToast('Llenar datos de formulario',0); return} 

    // const {sucursal, cliente, key:id, no_os} = this.claves_ordenes.find(os=>os.key === info_get.no_os)
   
    const nueva_fecha:string = (info_get.fecha_recibido) 
    ? info_get.fecha_recibido 
    : this._publicos.retorna_fechas_hora({fechaString: new Date().toString()}).toString_completa

    const fecha_muestra = this.transform_fecha(nueva_fecha, true)

    const {respuesta} = await this._publicos.mensaje_pregunta(`Realizar pago de orden ${info_get.no_os}`,true,`Fecha ${fecha_muestra}` )

    if (!respuesta) return

    const clave_ = this._publicos.generaClave()

   const ruta =  `historial_pagos_orden/${clave_}` 
  
   info_get.fecha_recibido = nueva_fecha
  //  info_get.cliente = cliente
  //  info_get.numero_os = id

   const updates = {[ruta]: info_get }

    update(ref(db), updates).then(()=>{
      this._publicos.swalToast(`Registro de pago correcto!!`, 1)
      this.reseteaForm()
    })
    .catch(err=>{
      console.log(err);
    })  
  }
  async reseteaForm(){
    if (this.id_os && this.id_os['id']) {
      this.carga_data_gasto(this.id_os)
    }else{
      const sucursal = (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL
      this.formPago.reset({sucursal, tipo:'operacion'})
    }
  }

  cancela(){
    this.showPagoHide.emit( {show: false})
  }
  transform_fecha(fecha: string, incluirHora: boolean = false, ...args: unknown[]): string {
    if(!fecha) return ''
    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDate();
    const mes = fechaObj.getMonth() + 1; // Los meses en JavaScript son base 0, por eso se suma 1
    const anio = fechaObj.getFullYear();
    const hora = fechaObj.getHours();
    const minutos = fechaObj.getMinutes();
    let fechaFormateada = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${anio}`;

    if (incluirHora) {
      fechaFormateada += ` ${hora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
    }
    return fechaFormateada;
  }
}
