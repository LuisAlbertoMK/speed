import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { SucursalesService } from '../../services/sucursales.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { CamposSystemService } from 'src/app/services/campos-system.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-gasto',
  templateUrl: './gasto.component.html',
  styleUrls: ['./gasto.component.css']
})
export class GastoComponent implements OnInit {


  
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService,
    private _campos: CamposSystemService, 
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
  
    ROL:string; SUCURSAL:string
    
    miniColumnas:number=100
    formGasto:FormGroup
    selected: Date | null;
    informacionFaltante:string

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
 
  
  ngOnInit(): void {
    this.rol()
    this.crearFormGasto()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    console.log(sucursal);
   
    // this.listaOrdenes()
    
  }
  
 

  crearFormGasto(){
    const sucursal = (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL
    this.formGasto = this.fb.group({
      tipo:['gasto',[Validators.required]],
      no_os:['',[]],
      monto:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      metodo:['',[Validators.required]],
      concepto:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      referencia:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      fecha:['',[Validators.required]],
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
      console.log(tipo);
    })
    this.formGasto.get('sucursal').valueChanges.subscribe(async (sucursal: string) => {
      if (sucursal) {
        console.log(sucursal);
        
      }
    })

  }
  
  QueTipo(tipo){
    
    if (tipo === 'orden') {
      this.muestraLista = true

      this.validaciones.push({valor: 'no_os', show:'O.S'})
      this.validaciones.push({valor: 'gasto_tipo', show:'gasto_tipo'})
      this.formGasto.controls['no_os'].setValue('')
    }else{
      this.fechaIIII = new Date(2000,0,1) 
      this.muestraLista = false
      let nuevos = []
      nuevos = this.validaciones.filter(v=>v['valor'] !=='no_os')
      this.validaciones= nuevos.filter(v=>v['valor'] !=='gasto_tipo')
      this.formGasto.controls['no_os'].setValue('')
    }
  }
  fechaInicio(id:string){
    this.formGasto.controls['no_os'].setValue(id)
    if (this.muestraLista && id) {
      const fechainicio = this.ordenes.find(os=>os['id'] === id)
      const aqui2 = fechainicio['fecha'].split('/')
      // this.formGasto.controls['sucursal'].setValue(fechainicio['sucursal'])
      this.formGasto.controls['fecha'].setValue(fechainicio.fecha)
      this.formGasto.controls['sucursal'].setValue(fechainicio.sucursal)
      this.fechaIIII= new Date(aqui2[2],aqui2[1] - 1,aqui2[0])

    }else{
      this.formGasto.controls['no_os'].setValue('')
    }
  }
  myFilter = (d: Date | null): boolean => {
    const fecha = new Date(d)
    const day = fecha.getDay()
    return day !== 0;
  };
  validaInformacion(){
    const camposNecesariosOperacion = ['tipo','monto','metodo','concepto','fecha','sucursal','referencia','facturaRemision']
    const camposNecesariosOrden = ['tipo','no_os','monto','metodo','concepto','fecha','sucursal','referencia','gasto_tipo','facturaRemision']
    // console.log(gastoData);
    // console.log(this.SUCURSAL);
    if (this.SUCURSAL !=='Todas') {
      const fecha = this._publicos.retorna_fechas_hora({fechaString: new Date().toString()}).fecha_hora_actual
      this.formGasto.controls['fecha'].setValue(fecha)
    }
    const gastoData = this._publicos.recuperaDatos(this.formGasto)
    
    const revisar = (gastoData.tipo === 'gasto') ? camposNecesariosOperacion : camposNecesariosOrden
    const {ok, faltante_s}= this._publicos.realizavalidaciones_new(gastoData,revisar)
    return {ok, faltante_s}
  }
  registroGasto(){
    // this.validaInformacion()
    const {ok, faltante_s} = this.validaInformacion()
    this.informacionFaltante = faltante_s
    // const valido = false
    if (ok) {
      const gastoData = this.formGasto.value
      // const nueva = this._publicos.asignarHoraAFecha(gastoData.fecha,this._publicos.obtenerHoraActual())
      const updates = {}
      const infoSave = {
        concepto: gastoData.concepto,
        fecha_registro: gastoData.fecha,
        metodo: gastoData.metodo,
        monto: gastoData.monto,
        referencia: gastoData.referencia,
        status: true,
        sucursal: gastoData.sucursal,
        tipo: 'operacion',
        facturaRemision: gastoData.facturaRemision
      }
      if(gastoData.tipo === 'orden') {
        infoSave['tipo'] = 'orden'
        infoSave['gasto_tipo'] = gastoData.gasto_tipo
        // infoSave['facturaRemision'] = gastoData.facturaRemision
        updates[`recepciones/${gastoData.no_os}/HistorialGastos/${this._publicos.generaClave()}`] = infoSave;
      }else{
        updates[`HistorialGastosOperacion/${this._publicos.generaClave()}`] = infoSave;
      }
      // console.table(infoSave)
      const mensaaje = (gastoData.tipo === 'orden') ?  'orden' : 'operacion'
      this._publicos.mensaje_pregunta(`Registrar gasto de ${mensaaje}?`).then(({respuesta})=>{
        if (respuesta) {
          update(ref(db), updates).then(()=>{
            const sucursal = (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL
            this.formGasto.reset({sucursal})
            this
            this._publicos.swalToast('Registro correcto de '+ mensaaje,1)
          })
          .catch(error=>{
            this._publicos.swalToast('Error al registrar gasto',0)
          })
        }
      })
    }else{
      // this.informacionFaltante = faltante
      this._publicos.swalToast('LLenar datos de formulario',0,'top-start')
    }
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      const date = new Date(event.value)
     
      if (date >= this.minDate && date <=this.maxDate) {
        console.log('valida');
        // Fri Jul 14 2023 09:31:51 GMT-0600 (GMT-06:00)
        const fecha_formato = this._publicos.retorna_fechas_hora({fechaString:date.toString()})

        this.formGasto.controls['fecha'].setValue( fecha_formato.toString_completa )
        this.fecha_new = fecha_formato.fecha_recibida_hora_actual
        
      }else{
        console.log('verificar');
        this.formGasto.controls['fecha'].setValue( null )
        this.fecha_new = null
      }
      
  }
  resetea(){
    // this.fecha_new = new Date('1970-01-01T00:00:00.000Z')
    this.formGasto.controls['fecha'].setValue( '' )
  }
  cancela(){
    this.resetea()
    this.showGastoHide.emit( {show: false})
  }

}
