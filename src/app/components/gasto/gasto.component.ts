import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  selector: 'app-gasto',
  templateUrl: './gasto.component.html',
  styleUrls: ['./gasto.component.css']
})
export class GastoComponent implements OnInit {


  @Input() dataRecepcion:any = null

  @Output() showGastoHide : EventEmitter<any>



  miniColumnas:number=100
  formGasto:FormGroup
  selected: Date | null;
  informacionFaltante:string
  constructor(private fb: FormBuilder, private _publicos: ServiciosPublicosService, 
    private _security:EncriptadoService, private _sucursales: SucursalesService) {
      this.showGastoHide = new EventEmitter()
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
  {valor: 'tipo', show:'Tipo de gasto'},
  {valor: 'monto', show:'Monto'},
  {valor: 'metodo', show:'Metodo'},
  {valor: 'concepto', show:'Concepto'},
  {valor: 'referencia', show:'Referencia'},
  {valor: 'fecha', show:'Fecha de pago'},
  {valor: 'fecha_registro', show:'Fecha de registro'},
  {valor: 'hora_registro', show:'Hora de registro'},
  {valor: 'sucursal', show:'Sucursal'},
  {valor: 'usuario', show:'Usuario'},
  {valor: 'rol', show:'ROL'},
  
  ]
  Sucursales= []
  sucursal:string
  ordenes = []
  muestraLista:boolean = false
  fechaIIII:Date = new Date(2000,0,1) 
  ngOnInit(): void {
    this.listaOrdenes()
    this.listaSucursales()
    this.infoDATA()
    this.crearFormGasto()
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
            id: recep['id'], no_os: recep['no_os'], fecha: recep['fecha_recibido'], 
            hora: recep['hora_recibido'], sucursal: recep.sucursal['id']
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
  crearFormGasto(){
    let sucursal = '';
    (this.sucursal ==='Todas') ? sucursal = '': sucursal= this.sucursal
    this.formGasto = this.fb.group({
      tipo:['gasto',[Validators.required]],
      no_os:['',[]],
      monto:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      metodo:['',[Validators.required]],
      concepto:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      referencia:['',[Validators.required,Validators.minLength(5), Validators.maxLength(250)]],
      fecha:[this.selected,[Validators.required]],
      sucursal: [sucursal,[Validators.required]],
      usuario: [this.usuario, [Validators.required]],
      gasto_tipo:['',[]],
      facturaRemision:['',[]],
      rol: [this.rol, [Validators.required]],
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
      
    }else{
      this.fechaIIII = new Date(2000,0,1) 
      this.muestraLista = false
      let nuevos = []
      nuevos = this.validaciones.filter(v=>v['valor'] !=='no_os')
      this.validaciones= nuevos.filter(v=>v['valor'] !=='gasto_tipo')
    }
  }
  fechaInicio(id:string){
    if (this.muestraLista && id) {
      const fechainicio = this.ordenes.find(os=>os['id'] === id)
      const aqui2 = fechainicio['fecha'].split('/')
      this.formGasto.controls['sucursal'].setValue(fechainicio['sucursal'])
      this.fechaIIII= new Date(aqui2[2],aqui2[1] - 1,aqui2[0]) 
    }else{
      this.formGasto.controls['sucursal'].setValue('')

    }
  }
  myFilter = (d: Date | null): boolean => {
    let fecha = new Date(d)
    let yesterday = new Date(this.fechaIIII)
    // yesterday.setDate(yesterday.getDate() - 1)
    // console.log('HOY ==> ',fecha);
    // console.log('YESTERDAY ==> ',yesterday);
    if (fecha < yesterday) {
      return null
    }else{
      const day = fecha.getDay()
      return day !== 0;
    }
  };
  async validaInformacion(){
    const answer = {valido: false, dataSave:{}, faltante:''}
    const pagoData = this.formGasto.value

    const getFecha = await this._publicos.getFechaHora()
    const dataSave = {
      tipo: pagoData['tipo'],  monto: pagoData['monto'],
      metodo: parseInt(pagoData['metodo']),no_os:pagoData['no_os'], concepto: pagoData['concepto'],  fecha: pagoData['fecha'],
      fecha_registro: getFecha.fecha,  hora_registro: getFecha.hora,  sucursal: pagoData['sucursal'],
      usuario: pagoData['usuario'],  referencia: pagoData['referencia'],  rol: pagoData['rol'],
      status: true,gasto_tipo: pagoData['gasto_tipo']
    };
    let fecha = this.selected, date = null;
    dataSave['fecha'] = '';
    (fecha) ? date = new Date(this.selected): '';
      if (date instanceof Date) {
        const fechaSave = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
        dataSave['fecha'] = fechaSave
      }

      if (this.dataRecepcion) {
        this.muestraLista = true
        const inf = this.dataRecepcion
        dataSave['tipo'] = 'orden'
        dataSave['no_os'] = inf['id']
        dataSave['sucursal'] = inf['sucursal']
      }
      if (dataSave['tipo'] === 'orden') {
        let nu =this.validaciones.filter(v=>v['valor']!=='gasto_tipo')
        nu.push({show:'gasto_tipo',valor:'gasto_tipo'})
        this.validaciones = nu
      }else{
        let nu =this.validaciones.filter(v=>v['valor']!=='gasto_tipo')
        this.validaciones = nu
      }
      
    (String(pagoData['referencia']).length >0 )? dataSave['referencia'] = pagoData['referencia'] : ''
    answer.dataSave = dataSave

    let invcalidos = []
    const mapdataSave = Object.keys(dataSave)
    await mapdataSave.map(v=>{
        if (!dataSave[v]) {
          this.validaciones.map(val=>{
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
  registroGasto(){
    this.validaInformacion().then(({valido,dataSave,faltante})=>{
      this.informacionFaltante = ''
      if (!valido) {
        this.informacionFaltante = faltante
        return Object.values( this.formGasto.controls ).forEach( control => {
          if ( control instanceof FormGroup ) {
            Object.values( control.controls ).forEach( control => control.markAsTouched() );
          } else {
            control.markAsTouched();
          }
        });
      }else{
        // console.log(dataSave);
        Swal.fire({
          title: 'Guardar Gasto?',
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
            const campos = ['concepto','fecha','fecha_registro','referencia','hora_registro','metodo','monto','rol','status','tipo','sucursal'];
            let camposR = [...campos];
            
            if(this.muestraLista) {
              camposR.push('gasto_tipo','no_os'); campos.push('gasto_tipo')
            }else{
              if (this.dataRecepcion) {
                dataSave['tipo'] = 'orden'
              }else{
                dataSave['tipo'] = 'operacion'
              }
            }  
            const dataPrimary = this._publicos.nuevaRecuperacionData(dataSave,camposR)
            const dataSaveFinal = this._publicos.nuevaRecuperacionData(dataPrimary,campos)
            
            if(this.muestraLista) {
              updates[`recepciones/${dataPrimary['no_os']}/HistorialGastos/${newPostKey}`] = dataSaveFinal;
            }else{
              updates[`HistorialGastosOperacion/${newPostKey}`] = dataSaveFinal;
            }
            // console.log(updates);
            
            update(ref(db), updates).then(()=>{
              this.formGasto.reset({
                tipo: '',  no_os: '',  usuario: this.usuario,
                sucursal: this.sucursal, referencia: '', rol: this.rol
              })
              this._publicos.mensaje('registro gasto correto',1)
            }).catch(error =>{

            })
          } else if (result.isDenied) {
            // Swal.fire('Changes are not saved', '', 'info')
          }
        })
      }
    })
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
