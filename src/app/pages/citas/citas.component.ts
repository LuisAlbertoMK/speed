
import { Component, OnInit, ViewChild, forwardRef, Inject } from '@angular/core';

import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { CitasService } from 'src/app/services/citas.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar, FullCalendarComponent } from '@fullcalendar/angular';

// import esLocale from '@fullcalendar/core/locales/es';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

//animaciones

import '@fortawesome/fontawesome-free/css/all.css'; // needs additional webpack config!
import { child, get, getDatabase, onValue, ref, set, push, update } from 'firebase/database';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());

import { CitaComponent } from '../cita/cita.component';
import { EmailsService } from 'src/app/services/emails.service';
import { ActivatedRoute } from '@angular/router';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CamposSystemService } from 'src/app/services/campos-system.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  

  
  constructor(private _publicos: ServiciosPublicosService, private _citas: CitasService, private _campos: CamposSystemService,
    private _security:EncriptadoService, private _sucursales: SucursalesService, public dialog: MatDialog,
    private _email: EmailsService, private rutaActiva: ActivatedRoute, private _bottomSheet: MatBottomSheet) { }
    ROL:string; SUCURSAL:string;

    camposInfoCita    =  [ ...this._citas.camposInfoCita ]
    sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]
    citasCampos       =  [ this._citas.citasCampos ]
    
    miniColumnas:number =  this._campos.miniColumnas
    
    enrutamiento = {vehiculo:'', cliente:'', anterior:''}
    
    citaForm: FormGroup;
    
    
    infoCita = {sucursal:'', sucursalShow:'', cliente:'', fullname:'', vehiculo:'', placas: '',servicio:'',servicioShow:'', dia:'', horario:'', correo:''}
    
  
    nuevaCita: boolean = false
    lista_citas_dia = []
    lista_citas_proximas = []
    citas_mes_all = []
    filtro_citas_mes_all = []
    id_cita = null
    info_cita = null
    
    sucursalCalendario = 'Todas'
    citas_no_asistencia = []
    // calendario
    calendarVisible = true;
    calendarOptions: CalendarOptions = {
      timeZone: 'local',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        right: 'dayGridMonth,timeGridDay,listWeek',
        
      },
      
      views: {
        listWeek: {
          buttonText: 'Lista Semanal'
        },
        
      },
      buttonText: {
        month: "Mes", week: "Semana", day: "Día", list: "Agenda", prev: "Prev", next: "Sig", today: "hoy",
        weekHeader: "Sm"
      },
      locale:'es',
      initialView: 'dayGridMonth',
      initialEvents: [
       
      ], // alternatively, use the `events` setting to fetch from a feed
      weekends: true,
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
      dateClick: this.handleDateClick.bind(this),
      /* you can update a remote database when these fire:
      eventAdd:
      eventChange:
      eventRemove:
      
      */
      
    };
    
    currentEvents: EventApi[] = [];
    range = new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
    });
  
    infoCitaUnica
  
    fecha_muestra:string = '' || 'dia seleccionado'
    rango_select: string = '' || 'rango seleccionado'
  
  
    panelOpenState = false;

    objecto_actual:any ={}
    objecto_actual_data:any ={}
    fecha_formateadas = {start:new Date(), end:new Date() }
    fecha_formateadas_unico_dia = {start:new Date(), end:new Date() }
    hora_start = '00:00:01';
    hora_end = '23:59:59';
  ngOnInit(): void {
    this.rol()
  }
  //obtener informacion basica para consulta de informacion de cualquier indele y permisos de usuario
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    
    // this.segundo_llamado()

    this.ROL = rol
    this.SUCURSAL = sucursal
    this.vigilaCalendario()
    this.asignacion_resultados()

  }
  contruye(citas){
    const camposServicios = [
      {valor:'1',nombre:'servicio'},
      {valor:'2',nombre:'garantia'},
      // {valor:'3',nombre:'retorno'},
      // {valor:'4',nombre:'venta'},
      {valor:'5',nombre:'preventivo'},
      // {valor:'6',nombre:'correctivo'},
      {valor:'7',nombre:'rescate vial'},
      {valor:'8',nombre:'frenos'},
      {valor:'9',nombre:'afinación'},
      {valor:'10',nombre:'cambio de aceite'},
      {valor:'11',nombre:'revisión general'},
      {valor:'12',nombre:'revisión de falla'},
      {valor:'13',nombre:'escaneo vehículo'},
    ]
    const nuevas_citas = {}
    const clientes = this._publicos.nueva_revision_cache('clientes')
    const vehiculos = this._publicos.nueva_revision_cache('vehiculos')
    const sucursales = this._publicos.nueva_revision_cache('sucursales')
    Object.keys(citas).forEach(cita=>{
      const {id, cliente, vehiculo, sucursal, servicio} = citas[cita]
      const data_cliente = clientes[cliente]
      const fullname = `${data_cliente.nombre} ${data_cliente.apellidos}`
      data_cliente.fullname = fullname
      const data_vehiculo = vehiculos[vehiculo]
      const data_sucursal = sucursales[sucursal]
      const servicio_show = camposServicios.find(ser=>ser.valor === servicio).nombre
      nuevas_citas[cita] = {...citas[cita], data_cliente, data_vehiculo, data_sucursal, servicio_show}
    })
    return nuevas_citas
  }
  asignacion_resultados(){
    this.objecto_actual = this._publicos.nueva_revision_cache('citas')
    const citas = this._publicos.nueva_revision_cache('citas')
    const citas_all_data = this.contruye(citas)
    this.objecto_actual_data = citas_all_data

    const {start, end} = this.fecha_formateadas

    const data_filtrada = this._publicos.filtrarObjetoPorPropiedad_fecha(citas_all_data,start, end)

    // this.lista_citas_proximas = []

    this.citas_hoy()

    const nuevas_citas = []
    Object.keys(data_filtrada).forEach(cita => {
 
      const {comentario,fecha_recibido} = data_filtrada[cita]
    
      const sdfghj = this._publicos.obtenerHoraDeFecha(this._publicos.sumarMinutosAFecha(new Date(fecha_recibido), 10 ) )
      const end = this._publicos.resetearHoras_horas(new Date(fecha_recibido), sdfghj)

      nuevas_citas.push({
        id: cita,
        title: comentario,
        startStr: new Date(fecha_recibido),
        endStr: new Date(end),
        start: this._publicos.convertirFecha_1(fecha_recibido), 
        end: this._publicos.convertirFecha_1(end),
        extendedProps: {
          lasol: 'XDDD'
        },
        description: comentario
      })
    });
    this.calendarOptions.events = nuevas_citas

  }
  handleDateClick(arg) {
    const { date } = arg
    if (date) {
      this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(date), this.hora_start)
      this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(date), this.hora_end)
      this.asignacion_resultados()
   }
  }
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }
  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }
//cuando selecciona un dia del calendario
  handleDateSelect(selectInfo: DateSelectArg) {
    const {start, end} = selectInfo
    if (start && end) {
       this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start), this.hora_start)
       this.fecha_formateadas.end = this._publicos.sumarRestarDiasFecha(this._publicos.resetearHoras_horas(new Date(end), this.hora_end), -1) 
       this.asignacion_resultados()

       this.fecha_formateadas_unico_dia.start = this._publicos.resetearHoras_horas(new Date(start), this.hora_start)
       this.fecha_formateadas_unico_dia.end = this._publicos.sumarRestarDiasFecha(this._publicos.resetearHoras_horas(new Date(end), this.hora_end), -1)

       this.citas_dia_seleccionado()
    }
  }
//cuando selecciona un evento de calendario
  handleEventClick(clickInfo: EventClickArg) {
    const id = clickInfo.event.id
    if (id) {
        if (this.objecto_actual_data[id]) {
          console.log(this.objecto_actual_data[id]);
        }
    }
  }
//ecento cambio de informacion en los eventos asiganados al calendario
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  

  //reagdendar cita recibiendo la informacion de la cita
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

  citas_hoy(){
    const fecha_hoy  = new Date()
    const nuevo_data = this._publicos.crear_new_object(fecha_hoy)
    const start_hoy = this._publicos.resetearHoras_horas(new Date(nuevo_data), this.hora_start)
    const end_hoy = this._publicos.resetearHoras_horas(new Date(nuevo_data), this.hora_end)

    const data_filtrada_hoy = this._publicos.filtrarObjetoPorPropiedad_fecha(this.objecto_actual_data, start_hoy, end_hoy)

    this.lista_citas_proximas = this._publicos.crearArreglo2(data_filtrada_hoy)
  }
  citas_dia_seleccionado(){
    const {start, end} = this.fecha_formateadas_unico_dia
    const nuevo_data = this._publicos.crear_new_object(start)
    const start_hoy = this._publicos.resetearHoras_horas(new Date(nuevo_data), this.hora_start)
    const end_hoy = this._publicos.resetearHoras_horas(new Date(nuevo_data), this.hora_end)

    const data_filtrada_hoy = this._publicos.filtrarObjetoPorPropiedad_fecha(this.objecto_actual_data, start_hoy, end_hoy)

    this.filtro_citas_mes_all = this._publicos.crearArreglo2(data_filtrada_hoy)
  }
vigilaCalendario(){
  this.range.valueChanges.subscribe(({start, end}) => {
    if (start && end) {
      // this.addEvent(start, end)
      this.fecha_formateadas.start = this._publicos.resetearHoras_horas(new Date(start), this.hora_start)
      this.fecha_formateadas.end = this._publicos.resetearHoras_horas(new Date(end), this.hora_end)
      this.asignacion_resultados()
    }
  })
}

  openBottomSheet(valor): void {
    const bottomSheetRef = this._bottomSheet.open(CitaComponent,{
      data: {info: this.infoCitaUnica, editar:valor} ,
    });
    // bottomSheetRef.afterDismissed().subscribe(() => {
    //   console.log('Bottom sheet has been dismissed.');
    // });
    
    // bottomSheetRef.dismiss();
  }
  openLink(event: MouseEvent): void {
    // this._bottomSheetRef.dismiss();
    // event.preventDefault();
  }
}


