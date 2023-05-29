import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import Swal from 'sweetalert2';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { SucursalesService } from '../../services/sucursales.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-gasto',
  templateUrl: './gasto.component.html',
  styleUrls: ['./gasto.component.css']
})
export class GastoComponent implements OnInit {


  @Input() dataRecepcion:any = null
  // @Input() sucursal:any = null

  @Output() showGastoHide : EventEmitter<any>

  ROL:string; SUCURSAL:string
  sucursales_arr=[]
  miniColumnas:number=100
  formGasto:FormGroup
  selected: Date | null;
  informacionFaltante:string
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService, private _sucursales: SucursalesService, private dateAdapter: DateAdapter<Date>) {
      this.showGastoHide = new EventEmitter()
      this.dateAdapter.getFirstDayOfWeek = () => 0;
    }
    dateClass = (date: Date): string => {
      const day = new Date(date).getDay()
      // const day = fecha.getDay()
      if (day === 0) { // Si el día es domingo
        return 'disable-day'; // Aplica una clase CSS para desactivarlo
      }
      return '';
    };
  metodospago = [
    {metodo:1, show:'Efectivo'},
    {metodo:2, show:'Cheque'},
    {metodo:3, show:'Tarjeta'},
    {metodo:4, show:'Transferencia'},
  ]
  
  

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
  Sucursales= []
  
  ordenes = []
  muestraLista:boolean = false
  fechaIIII:Date = new Date(2000,0,1) 
  tiempoReal:boolean = true
  
  ngOnInit(): void {
    this.rol()
    this.crearFormGasto()
  }
  rol(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      this.ROL = this._security.servicioDecrypt(variableX['rol'])
      this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

      this._sucursales.consultaSucursales_new().then((sucursales) => {
        this.sucursales_arr = sucursales
        this.listaOrdenes()
      }).catch((error) => {
        // Manejar el error si ocurre
      });
    }
  }
  listaOrdenes(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const recepciones = this._publicos.crearArreglo2(snapshot.val())
        // espera
        // recibido
        // autorizado
        // terminado
        // entregado
        // cancelado
        function filtrarOrdenes(recepciones, sucursal) {
          const rcp = recepciones
            .filter(recep => {
              const status = recep.status;
              // return (status !== 'entregado' && status !== 'cancelado' && status !== 'espera');
              return (status !== 'entregado' && status !== 'cancelado');
              // return status;
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
        // console.log(this.ordenes);
      }
    })
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
  }
  validaCampo(campo: string){
    return this.formGasto.get(campo).invalid && this.formGasto.get(campo).touched
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
    const answer = {valido: true, faltante:''}
    const camposNecesariosOperacion = ['tipo','monto','metodo','concepto','fecha','sucursal','referencia']
    const camposNecesariosOrden = ['tipo','no_os','monto','metodo','concepto','fecha','sucursal','referencia','gasto_tipo','facturaRemision']
    const gastoData = this.formGasto.value
    let faltantes = []
    const revisar = (gastoData.tipo === 'gasto') ? camposNecesariosOperacion : camposNecesariosOrden
    revisar.forEach(campo=>{
      if(!gastoData[campo]) {
        faltantes.push(campo)
        answer.valido = false
      }
    })
    answer.faltante = faltantes.join(', ')
    return answer
  }
  registroGasto(){
    const {valido, faltante} = this.validaInformacion()
    if (valido) {
      this.informacionFaltante = ''
      const gastoData = this.formGasto.value
      const updates = {}
      const infoSave = {
        concepto: gastoData.concepto,
        fecha_registro: gastoData.fecha,
        hora_registro: this._publicos.getFechaHora().hora,
        metodo: gastoData.metodo,
        monto: gastoData.monto,
        referencia: gastoData.referencia,
        status: true,
        sucursal: gastoData.sucursal,
        tipo: 'operacion'
      }
      if(gastoData.tipo === 'orden') {
        infoSave['tipo'] = 'orden'
        infoSave['gasto_tipo'] = gastoData.gasto_tipo
        infoSave['facturaRemision'] = gastoData.facturaRemision

        updates[`recepciones/${gastoData.no_os}/HistorialGastos/${this._publicos.generaClave()}`] = infoSave;
      }else{
        updates[`HistorialGastosOperacion/${this._publicos.generaClave()}`] = infoSave;
      }
      const mensaaje = (gastoData.tipo === 'orden') ?  'orden' : 'operacion'
      this._publicos.mensaje_pregunta(`Registrar gasto de ${mensaaje}?`).then(({respuesta})=>{
        if (respuesta) {
          update(ref(db), updates).then(()=>{
            const sucursal = (this.SUCURSAL ==='Todas') ? '': this.SUCURSAL
            this.formGasto.reset({sucursal})
            this._publicos.swalToast('Registro correcto de '+ mensaaje)
          })
          .catch(error=>{
            this._publicos.swalToastError('Error al registrar gasto')
          })
        }
      })
    }else{
      this.informacionFaltante = faltante
      this._publicos.swalToastError('LLenar datos de formulario')
    }
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      const date = new Date(event.value)
      if (date instanceof Date) {
        const fechaSave = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        this.formGasto.controls['fecha'].setValue( fechaSave)
      }
  }
  cancela(){
    this.showGastoHide.emit( {show: false})
  }

}
