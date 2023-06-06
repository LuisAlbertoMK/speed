
import { Component, OnInit, ViewChild, forwardRef, Inject } from '@angular/core';

import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { CitasService } from 'src/app/services/citas.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import Swal from 'sweetalert2';
import 'moment/locale/es';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar, FullCalendarComponent } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils'
// import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
//animaciones
import 'animate.css';

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css'; // needs additional webpack config!
import { child, get, getDatabase, onValue, ref, set, push, update } from 'firebase/database';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { Observable } from 'rxjs';
const db = getDatabase()
const dbRef = ref(getDatabase());
import esLocale from '@fullcalendar/core/locales/es';
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
  nuevaCita: boolean = false
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
  lista_citas_dia = [
    
  ]
  lista_citas_proximas = []
  citas_mes_all = []
  filtro_citas_mes_all = []
  formateada = ''
  id_cita = null
  info_cita = null
  mostrarVentana: boolean = false;
  
  sucursalCalendario = 'Todas'
  // calendario
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      right: 'dayGridMonth,timeGridDay,listWeek'
    },
    
    views: {
      listWeek: {
        buttonText: 'Lista Semanal'
      },
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      // week: 'Semana',
      day: 'Dia',
    },
    
    // locale: esLocale,
    // locales: [esLocale],
    locale:'es',
    initialView: 'dayGridMonth',
    initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  
  currentEvents: EventApi[] = [];
  
  constructor(private formBuilder: FormBuilder, private _publicos: ServiciosPublicosService, private _citas: CitasService,
    private _security:EncriptadoService, private _sucursales: SucursalesService, private _clientes: ClientesService) { }
  
     
  
  ngOnInit(): void {
    this.rol()
    this.creaFormCitas()
    this.automaticos()
    
    
  }
  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    
    const fechaInicial_dia = this._publicos.resetearHoras_horas(new Date(selectInfo['start']), '08:30:00')
    const fechafinal_dia = this._publicos.resetearHoras_horas(new Date(selectInfo['start']), '18:30:00')

    const citasDiaSelect =this.citas_mes_all.filter(c=>
      c.fecha_compara >= fechaInicial_dia && c.fecha_compara <= fechafinal_dia
    )
    this.filtro_citas_mes_all = this._publicos.ordenarData(citasDiaSelect,'horario',true)  
    

    // const title = prompt('Please enter a new title for your event');
    // const calendarApi = selectInfo.view.calendar;

    // calendarApi.unselect(); // clear date selection

    // if (title) {
    //   calendarApi.addEvent({
    //     id: createEventId(),
    //     title,
    //     start: selectInfo.startStr,
    //     end: selectInfo.endStr,
    //     allDay: selectInfo.allDay
    //   });
    // }
  }

  handleEventClick(clickInfo: EventClickArg) {
    // console.log(clickInfo.event);
    // const {dia, mes,anio}  = this._publicos.conveirtefecha_2(clickInfo.event.start);
    // console.log(dia);
    // console.log(mes);
    // console.log(anio);
    // console.log(clickInfo.event.id);
    const id = clickInfo.event.id
    // console.log(clickInfo);
    if (id) {
      const info_ = this.citas_mes_all.find(c=>c.id === id)
      console.log(info_);
      this.info_cita = info_
    }else{
      this.info_cita = null
    }
    
    
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this._sucursales.consultaSucursales_new().then((sucursales) => {
      this.sucursales_arr = sucursales
      this.ListadoClientes(this.SUCURSAL)
      this.sucursalCalendario = this.SUCURSAL
      // this.obtenerCitasMes(this.sucursalCalendario)
      this.vigilaCitas()
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
  vigilaCitas(){
    const {dia, mes,anio}  = this._publicos.conveirtefecha_2(new Date());
    const starCountRef = ref(db, `Citas/${anio}/${mes}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.obtenerCitasMes(this.sucursalCalendario)
      }
    })
  }
  async obtenerCitasMes(sucursal){

    console.time('Execution Time');
        
    
    const {inicio, final} = this._publicos.getFirstAndLastDayOfCurrentMonth(new Date())
    const {dia, mes,anio}  = this._publicos.conveirtefecha_2(inicio);
    const fechaLimite = this._publicos.resetearHoras_horas(this._publicos.sumarRestarDiasFecha(new Date(),0),'08:30:00')
    const fechaLimite2 = this._publicos.resetearHoras_horas(this._publicos.sumarRestarDiasFecha(new Date(),0),'18:30:00')

    function formatoDosDigitos(numero) { return numero.toString().padStart(2, '0'); }

    let citasFinales = await this._citas.consulta_citas_mes_new(anio, mes,sucursal);
    if (sucursal === 'Todas') {
     const citas = await this._citas.consulta_citas_mes_todas_new(`Citas/${anio}/${mes}`);
      const claves_sucursales = this.sucursales_arr.map(s => s.id);
      claves_sucursales.forEach(c => {
        if (citas[c]) {
          const citas_new = this._publicos.crearArreglo2(citas[c]);
          citas_new.forEach(cit => {
            
            const mi_fecha_1 = this._publicos.convertirFecha(cit.dia);
            const mi_fecha = this._publicos.conveirtefecha_2(mi_fecha_1);
            (cit.title)? null : cit.title = `${cit.placas.toUpperCase()} ${cit.dia} ${cit.horario}`;
            (cit.ruta)? null : cit.ruta = `Citas/${anio}/${mes}/${c}/${cit.id}`
            cit.start = `${mi_fecha.anio}-${formatoDosDigitos(mi_fecha.mes)}-${formatoDosDigitos(mi_fecha.dia)} ${cit.horario}`;
            citasFinales.push(cit);
          });
        }
      });
    }
    this.citas_mes_all = citasFinales;
    const fechas_proximas = citasFinales.filter(c => c.fecha_compara >= fechaLimite && c.fecha_compara <= fechaLimite2);
    this.lista_citas_proximas = this._publicos.ordenarData(fechas_proximas, 'horario', true);
    this.calendarOptions.events = citasFinales;
    console.timeEnd('Execution Time');

  }
  
  obetnerCitasDelDia_2(formateada){
    
    if (this.SUCURSAL !== 'Todas') {
      this._citas.consulta_citas_new(this.SUCURSAL,formateada).then((citas)=>{
        console.log(citas);
        citas.forEach(c=>{
          c.asistenciaShow = (c.asistencia) ? 'SI' : 'NO'
          c.recordatorioShow = (c.recordatorio) ? 'SI' : 'NO'
          c.confirmadaShow = (c.confirmada) ? 'SI' : 'NO'
          // c.id: doc.id,
          // c.title = `${c.placas} ${c.fullname} ${c.dia} ${c.horario}`
          c.title = `${c.placas.toUpperCase()} ${c.dia} ${c.horario}`
          const mi_fecha_1 = this._publicos.convertirFecha(c.dia)
          console.log(this._publicos.formatearFecha(mi_fecha_1,true,'-'));
          const mi_fecha = this._publicos.conveirtefecha_2(mi_fecha_1)
          c.start = `${mi_fecha.anio}-${formatoDosDigitos(mi_fecha.mes)}-${formatoDosDigitos(mi_fecha.dia)}`
        })
        function formatoDosDigitos(numero) {
          return numero < 10 ? `0${numero}` : numero;
        }
        this.calendarOptions.events = citas
        this.lista_citas_dia = citas
      })
    }
  }
  obetnerCitasDelDia(day){
    const { nu , index } = day
    if (nu === 'dom' || !index) return
    // this.isClicked = true
    const fecha = new Date(this.numeroAnio, this.numeroMes - 1, index)
    const formateada = this._publicos.formatearFecha(fecha, false)
    this.formateada = this._publicos.formatearFecha(fecha, true)
    if (this.SUCURSAL !== 'Todas') {
      this._citas.consulta_citas_new(this.SUCURSAL,formateada).then((citas)=>{
        console.log(citas);
        citas.forEach(c=>{
          c.asistenciaShow = (c.asistencia) ? 'SI' : 'NO'
          c.recordatorioShow = (c.recordatorio) ? 'SI' : 'NO'
          c.confirmadaShow = (c.confirmada) ? 'SI' : 'NO'
          // c.id: doc.id,
          // c.title = `${c.placas} ${c.fullname} ${c.dia} ${c.horario}`
          c.title = `${c.placas.toUpperCase()} ${c.dia} ${c.horario}`
          const fecha_con = this._publicos.convertirFecha(c.dia)
          const fecha_formato = this._publicos.formatearFecha(fecha_con, true)
          c.start = '2023-06-06'
        })
        console.log(citas);
        // 2023-06-06
        this.calendarOptions.events = citas
        this.lista_citas_dia = citas
      })
    }
  }
  
  activarClick(){
    console.log('aqui');
  }
  desactivarClick(){

  }
  eliminaCita(data){
    if (data.id) {
      this._publicos.mensaje_pregunta(`Desea cancelar la cita`).then(({respuesta})=>{
        if (respuesta) {
          const updates = {[`${data.ruta}`] : null}
          // console.log(updates);
          update(ref(db), updates).then(()=>{
            this._publicos.mensajeSwalError('Cita cancelada')
          })
        }
      })
    }
  }
  reagendarCita(data){
    // if (data.id) {
    //   this._publicos.mensaje_pregunta(`Desea cancelar la cita`).then(({respuesta})=>{
    //     if (respuesta) {
    //       const fecha = this._publicos.convertirFecha(data.dia)
    //       const formateada = this._publicos.formatearFecha(fecha, false)
    //       const updates = {[`Citas/${data.sucursal}/${formateada}/${data.id}`] : null}
    //       // console.log(updates);
    //       update(ref(db), updates).then(()=>{
    //         this._publicos.mensajeSwalError('Cita cancelada')
    //       })
    //     }
    //   })
    // }
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
    const data = this.citaForm.value
    const recuperada = this._publicos.nuevaRecuperacionData(data,this.citasCampos)
    const necesarios = [ ...this.citasCampos]
    const { faltante_s, ok} = this._publicos.realizaValidaciones(necesarios,recuperada)
    if (ok) {
      console.log('registra la cita ahora si');
    }
  }
}

/// funciones

