import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { SucursalesService } from '../../services/sucursales.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { CamposSystemService } from 'src/app/services/campos-system.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-gasto',
  templateUrl: './gasto.component.html',
  styleUrls: ['./gasto.component.css']
})
export class GastoComponent implements OnInit, OnChanges {


  
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService,
    private _campos: CamposSystemService, private _servicios: ServiciosService, private _reporte_gastos: ReporteGastosService,
    private _security:EncriptadoService, private _sucursales: SucursalesService, private dateAdapter: DateAdapter<Date>) {
      this.showGastoHide = new EventEmitter()
      this.dateAdapter.getFirstDayOfWeek = () => 0;
      const currentYear = new Date().getFullYear();
      this.minDate = new Date(currentYear , 0, 1);
      this.maxDate = new Date(currentYear , 11, 31);
    }

    sucursales_array =  [...this._sucursales.lista_en_duro_sucursales  ]
    metodospago      =  [  ...this._campos.MetodosPago  ]

    @Input() dataRecepcion:any = null
    @Output() showGastoHide : EventEmitter<any>
    @Input() id_os:any
  
    ROL:string; SUCURSAL:string
    
    miniColumnas:number=100
    formGasto:FormGroup
    selected: Date | null;
    faltante_s:string

    validaciones= [
      {valor: 'tipo', show:'Tipo de gasto'},
      {valor: 'monto', show:'Monto'},
      {valor: 'metodo', show:'Metodo'},
      {valor: 'concepto', show:'Concepto'},
      {valor: 'referencia', show:'Referencia'},
      {valor: 'fecha', show:'Fecha de pago'},
      {valor: 'fecha_registro', show:'Fecha de registro'},
      {valor: 'hora_registro', show:'Hora de registro'},
      {valor: 'sucursal', show:'Sucursal'},
      {valor: 'rol', show:'ROL'},
    ]
        
    ordenes = []
    muestraLista:boolean = false
    fechaIIII:Date = new Date(2000,0,1) 
    tiempoReal:boolean = true
    fecha_new:string 

    minDate: Date;
    maxDate: Date;

   

    dateClass = (date: Date): string => {
      const day = new Date(date).getDay()
      // const day = fecha.getDay()
      if (day === 0) { // Si el día es domingo
        return 'disable-day'; // Aplica una clase CSS para desactivarlo
      }
      return '';
    };
 
    claves_ordenes = []
  data_pendiente
  ngOnInit(): void {
    this.rol()
    this.crearFormGasto()
  }
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['id_os']) {
      const nuevoValor = changes['id_os'].currentValue;
      const valorAnterior = changes['id_os'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      const {id} = nuevoValor

  
      if (nuevoValor && id) {
        if (!this.formGasto) {
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

    this.formGasto.reset({
      tipo: 'orden',
      numero_os: id,
      monto:0,
      metodo: '1',
      concepto:'',
      referencia:'',
      sucursal,
      gasto_tipo:'',
    })  
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()
    this.ROL = rol
    this.SUCURSAL = sucursal
  }
  crearFormGasto(){
    const sucursal = (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL
    this.formGasto = this.fb.group({
      tipo:['operacion',[Validators.required]],
      numero_os:['',[]],
      monto:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      metodo:['',[Validators.required]],
      concepto:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      referencia:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      fecha_recibido:['',[Validators.required]],
      sucursal: [sucursal,[Validators.required]],
      gasto_tipo:['',[]],
      facturaRemision:['',[]],
    })
    // this.resetea()
   
    this.vigila()
  }
  validaCampo(campo: string){
    return this.formGasto.get(campo).invalid && this.formGasto.get(campo).touched
  }

  vigila(){
    if (this.SUCURSAL !== 'Todas')  this.formGasto.get('sucursal').disable()
    this.formGasto.get('tipo').valueChanges.subscribe(async (tipo: string) => {
        this.muestra_claves_recepciones()
    })
    this.formGasto.get('sucursal').valueChanges.subscribe(async (sucursal: string) => {
      if (sucursal) {
        this.muestra_claves_recepciones()
      }
    })
    this.formGasto.get('tipo').valueChanges.subscribe(async (tipo: string) => {
      if (tipo) {
        // this.muestra_claves_recepciones()
      }
    })
    if (this.data_pendiente) {
      this.carga_data_gasto(this.data_pendiente)
      this.data_pendiente = null
    }
  }
  
  async muestra_claves_recepciones(){
    const {tipo, sucursal} = this._publicos.recuperaDatos(this.formGasto)
    this.muestraLista = (tipo === 'orden') ? true : false
    if (tipo === 'orden' && sucursal) {
        this.claves_ordenes = await this._servicios.claves_recepciones(`recepciones/${sucursal}`)
    }else{
      this.claves_ordenes = []
    }
  }

  myFilter = (d: Date | null): boolean => {
    const fecha = new Date(d)
    const day = fecha.getDay()
    return day !== 0;
  };

  registroGasto(){
    // this.validaInformacion()
    const info_get = this._publicos.recuperaDatos(this.formGasto)
    const campos_operacion = [
      'concepto',
      'facturaRemision',
      'metodo',
      'monto',
      'referencia',
      'sucursal',
      'tipo',
    ]
    const campos_orden = [
      ...campos_operacion,
      'gasto_tipo',
      'numero_os',
    ]

    const cuales_ = (info_get.tipo === 'orden') ? campos_orden : campos_operacion
    
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(info_get, cuales_)
    this.faltante_s = faltante_s

    if (!ok) return
    const recuperada = this._publicos.nuevaRecuperacionData(info_get, cuales_)
    const {sucursal, numero_os, fecha_recibido: fech_} = recuperada
    const data_orden =  this.claves_ordenes.find(f=>f.key === numero_os)
    
    if (info_get.tipo === 'orden'){
      recuperada.no_os = data_orden.no_os
      recuperada.status_orden = data_orden.status_orden
      recuperada.cliente = data_orden.cliente
      recuperada.vehiculo = data_orden.vehiculo
      recuperada.descripcion = data_orden.descripcion
    } 

    const nueva_fecha:string = (info_get.fecha_recibido) 
    ? info_get.fecha_recibido 
    : this._publicos.retorna_fechas_hora({fechaString: new Date().toString()}).toString_completa

    const fecha_muestra = this.transform_fecha(nueva_fecha, true)
    // console.log(recuperada);
    
    this._publicos.mensaje_pregunta('Realizar deposito de fecha '+ fecha_muestra).then(({respuesta})=>{
      if (respuesta) {

        const clave_ = this._publicos.generaClave()

        const solo_numeros_fecha_hoy = this._reporte_gastos.fecha_numeros_sin_Espacions(new Date(nueva_fecha))

        let ruta = (info_get.tipo === 'orden') ?
        `historial_gastos_orden/${sucursal}/${solo_numeros_fecha_hoy}/${clave_}` : 
        `historial_gastos_operacion/${sucursal}/${solo_numeros_fecha_hoy}/${clave_}`
        recuperada.status = true
        // console.log(ruta);
        recuperada.fecha_recibido = nueva_fecha
        
        const updates = {[ruta]: recuperada }
        update(ref(db), updates).then(()=>{
          const titulo = (info_get.tipo === 'orden') ? 'Orden' :'Operacion'
          this._publicos.swalToast(`Registro de gasto ${titulo}`, 1, 'top-start')
          this.reseteaForm()
        })
        .catch(err=>{
          console.log(err);
        })       
      }
    })
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      const date = new Date(event.value)
      if (date >= this.minDate && date <=this.maxDate) {
        const fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: date.toString()}).toString_completa
        this.formGasto.get('fecha_recibido').setValue(fecha_recibido)
      }
  }
  async reseteaForm(){
    if (this.id_os && this.id_os['id']) {
      this.formGasto.get('sucursal').setValue(this.id_os['sucursal'])
      await this.muestra_claves_recepciones()
      this.carga_data_gasto(this.id_os)
    }else{
      const sucursal = (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL
      this.formGasto.reset({sucursal, tipo:'operacion'})
    }
  }
  cancela(){
    this.reseteaForm()
    this.showGastoHide.emit( {show: false})
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
