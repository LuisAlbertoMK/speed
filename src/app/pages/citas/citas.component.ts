import { Component, OnInit, ViewChild, forwardRef, Inject } from '@angular/core';

import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AutomaticosService } from 'src/app/services/automaticos.service';
import { CitasService } from 'src/app/services/citas.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import Swal from 'sweetalert2';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/es';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar, FullCalendarComponent } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils'
// import esLocale from '@fullcalendar/core/locales/es';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
//animaciones
import 'animate.css';

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css'; // needs additional webpack config!
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { child, get, getDatabase, onValue, ref, set, push } from 'firebase/database';
import { EmailsService } from 'src/app/services/emails.service';
import { url } from 'inspector';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { Observable } from 'rxjs';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  ROL:String
  SUCURSAL:string
  citaForm: FormGroup;
  dias_mes_arr = []
  dias2 = ["dom","lun","mar","mié","jue","vie","sáb"]
  
  personalizados_dias = ["lun","mar","mié","jue","vie","sáb","dom"]

  mesMuestra:string
  numeroMes =  new Date().getMonth() + 1
  numeroAnio =  new Date().getFullYear()
  fechaSelect: number 
  isClicked: boolean = false;
  clientes_arr=[]
  sucursales_arr=[]
  arr_vehiculos=[]

  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  faltente:string
  correo:string
  citasCampos = [ 'sucursal','cliente','vehiculo','dia','horario']
  infoCita = {sucursal:'', sucursalShow:'', cliente:'', fullname:'', vehiculo:'', placas: '', dia:'', horario:'', correo:''}
  camposInfoCita = [ 
    {valor: 'sucursalShow', show:'Sucursal'},
    {valor: 'fullname', show:'Cliente'},
    {valor: 'correo', show:'Correo'},
    {valor: 'placas', show:'placas'},
    {valor: 'dia', show:'dia cita'},
    {valor: 'horario', show:'Hora cita'},]
  constructor(private formBuilder: FormBuilder, private _publicos: ServiciosPublicosService, private _citas: CitasService,
    private _security:EncriptadoService, private _sucursales: SucursalesService, private _clientes: ClientesService,) { }
  
     
  
  ngOnInit(): void {
    this.rol()
    this.creaFormCitas()
    this.automaticos()
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this._sucursales.consultaSucursales_new().then((sucursales) => {
      this.sucursales_arr = sucursales
      this.ListadoClientes(this.SUCURSAL)
    }).catch((error) => {
      // Manejar el error si ocurre
    });
  }
  ListadoClientes(sucursal){
    // this.cargandoInformacion = true
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, () => {
      this._clientes.consulta_clientes_new().then((clientes) => {
        const clientes_new = clientes
        clientes_new.map(c=>{
          c.sucursalShow = this.sucursales_arr.find(s=>s.id === c.sucursal).sucursal
        })
        const info = (sucursal !=='Todas') ? clientes_new.filter(c=>c.sucursal === sucursal) : []
        const camposRecu = [...this._publicos.camposCliente(),'vehiculos','fullname']
        let aqui = []
        if (!this.clientes_arr.length) {
          aqui = info;
        } else {
          aqui = this._publicos. actualizarArregloExistente(this.clientes_arr, info,camposRecu);
        }
        this.clientes_arr = this._publicos.ordenarData(aqui,'fullname',true)
        this.myControl.setValue(null)
        this.citaForm.controls['cliente'].setValue(null)
        this.citaForm.controls['vehiculo'].setValue(null)
        // this.dataSourceClientes.data = aqui
        // this.newPagination('clientes')
      }).catch((error) => {
        // Manejar el error si ocurre
        console.log(error);      
      });
    })
  }
  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: string): string[] {
    const filterValue:string = String(value).toLowerCase();
    return this.clientes_arr.filter(option => String(option.fullname).toLowerCase().includes(filterValue));
  }
  displayFn(user: any): string {
    return user && user.fullname ? user.fullname : '';
  }

  creaFormCitas(){
    const sucursal = (this.SUCURSAL === 'Todas') ? '':  this.SUCURSAL
    this.citaForm = this.formBuilder.group({
      dia: ['', Validators.required],
      cliente: ['', Validators.required],
      sucursal: [sucursal, Validators.required],
      horario: ['', Validators.required],
      vehiculo: ['', Validators.required]
    });
    this.obtenerPrimerUltimoDiaMes(this.numeroAnio, this.numeroMes)
  }
  clienteSeleccionado(cliente){
    // console.log(cliente);
    this.citaForm.controls['cliente'].setValue(null)
    this.citaForm.controls['vehiculo'].setValue(null)
    // this.correo = null
    this.infoCita.correo = ''
    if (cliente) {
      this.citaForm.controls['cliente'].setValue(cliente.id)
      this.arr_vehiculos = cliente.vehiculos
    }
    // this.arr_vehiculos = cl
    
  }
  aumentaAnio(accion:string){
    if(accion === '+'){
      this.numeroAnio ++
    }else{
      this.numeroAnio --
    }
    this.obtenerPrimerUltimoDiaMes(this.numeroAnio,this.numeroMes)
  }
  aumentaNumeroMes(accion){
    if(accion === '+'){
      if (this.numeroMes === 12 ) {
        this.numeroAnio ++
        this.numeroMes = 1
      }else{
        this.numeroMes ++
      }
    }else{
      if (this.numeroMes === 1 ) {
        this.numeroAnio --
        this.numeroMes = 12
      }else{
        this.numeroMes --
      }
    }
    this.obtenerPrimerUltimoDiaMes(this.numeroAnio,this.numeroMes)
  }

  obtenerPrimerUltimoDiaMes(anio:number,numeroMes: number){
    this.dias_mes_arr =[]
    const {primerDia , ultimoDia, Mes}= this._publicos.obtenerPrimerUltimoDiaMes(numeroMes,anio)
    let nuevos = []
    this.mesMuestra = Mes
    for (let index =primerDia.getDate(); index <= ultimoDia.getDate(); index++) {
      const bu = new Date(anio,numeroMes -1, index)
        .toLocaleDateString('es-ES', { weekday: 'long' }).slice(0,3).toLowerCase()
      let nu 
      this.dias2.forEach(d=>{ if (d.toLowerCase() === bu.toLowerCase()) nu = d  })
      nuevos.push({index, nu})
    }
   
    const info = this._publicos.obtenerPrimerUltimoDiaMes(numeroMes,anio)

    const bu2 = this._publicos.sumarRestarDiasFecha(info.primerDia,0)
      .toLocaleDateString('es-ES', { weekday: 'long' }).slice(0,3).toLowerCase()

      let indesx =this.personalizados_dias.indexOf(bu2)
      
      if (bu2 === 'sáb') {
        indesx= 5
      } else if(bu2 === 'dom') { 
        indesx= 6
      }
    
    for (let index = 0; index <   indesx; index++) {
      this.dias_mes_arr.push({index:null,nu:null})
    }
    for (let index =0; index < nuevos.length; index++) {
      this.dias_mes_arr.push(Object(nuevos[index]))
    }

    this.dias_mes_arr.map(d=>{
      if (d.nu === 'dom') {
        d.clase = 'noValido'
      }else if(d.nu !== 'dom' && d.nu){
        d.clase = 'Valido'
      }else if(!d.nu){
        d.clase = 'nulo'
      }
    })
    
  }
  obetnerCitasDelDia(day){
    const { nu , index } = day
    if (nu === 'dom' || !index) return
    // this.isClicked = true
    const fecha = new Date(this.numeroAnio, this.numeroMes - 1, index)
    const formateada = this._publicos.formatearFecha(fecha, false)
    this._citas.consulta_citas_new('',formateada).then((citas)=>{
      console.log(citas);
    })
  }
  validarCampo(campo: string){
    return this.citaForm.get(campo).invalid && this.citaForm.get(campo).touched
  }

  guardarCita() {
    const data = this.citaForm.value
    const necesarios = [ ...this.citasCampos]
    const { faltante_s, ok} = this._publicos.realizaValidaciones(necesarios,data)
    this.faltente = faltante_s
    if(ok){
      this.infoCita.cliente = data.cliente
      this.infoCita.vehiculo = data.vehiculo
      this.infoCita.sucursal = data.sucursal
      this.infoCita.dia = data.dia
      this.infoCita.correo = this.clientes_arr.find(c=>c.id === data.cliente).correo
      this.infoCita.horario = data.horario
      this.infoCita.sucursalShow = this.sucursales_arr.find(s=>s.id === data.sucursal).sucursal
      this.infoCita.placas = this.arr_vehiculos.find(v=>v.id === data.vehiculo).placas
      this.infoCita.fullname = this.clientes_arr.find(c=>c.id === data.cliente).fullname
    }
  }
  ConfirmaCita(){
    const recuperada = this._publicos.nuevaRecuperacionData(this.infoCita,this.citasCampos)
    if (recuperada.cliente) {
      console.log('registra la cita ahora si');
      
    }
  }
}

/// funciones

