
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

import 'bootstrap/dist/css/bootstrap.css';
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
      initialEvents: [], // alternatively, use the `events` setting to fetch from a feed
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
  ngOnInit(): void {
    this.rol()
  }
  //obtener informacion basica para consulta de informacion de cualquier indele y permisos de usuario
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    this.vigilaCitas()
    this.vigilaCalendario()
  }
  handleDateClick(arg) {
    // alert('date click! ' + arg.dateStr)
    // this.calendarOptions.initialDate = arg.dateStr
    // this.calendarOptions.now = arg.dateStr
    // this.calendarOptions.allDayContent = arg.dateStr
    // console.log(arg);
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
    
    const fechaInicial_dia = this._publicos.resetearHoras_horas(new Date(selectInfo['start']), '08:30:00')
    const fechafinal_dia = this._publicos.resetearHoras_horas(new Date(selectInfo['start']), '18:30:00')

    const citasDiaSelect =this.citas_mes_all.filter(c=>
      c.fecha_compara >= fechaInicial_dia && c.fecha_compara <= fechafinal_dia
    )
    const fecha_muestra = this._publicos.convierte_fechaString_personalizada(fechaInicial_dia).string_fecha
    this.fecha_muestra = fecha_muestra
    
    this.filtro_citas_mes_all = this._publicos.ordenarData(citasDiaSelect,'horario',true)
    // this.calendarOptions.initialDate = new Date('06/24/2023')
    // this.calendarOptions.now = new Date(selectInfo['start'])
    
    
  }
//cuando selecciona un evento de calendario
  handleEventClick(clickInfo: EventClickArg) {
    const id = clickInfo.event.id
    if (id) {

      // (click)="infoCitaUnica = cita; openBottomSheet()"
      const info_ = this.citas_mes_all.find(c=>c.id === id)
      // this.infoCita = info_
      this.infoCitaUnica = info_
      // console.log(info_);
      
      setTimeout(()=>{ this.openBottomSheet(false) },100)
      // const dialogRef: MatDialogRef<CitaComponent> = this.dialog.open(CitaComponent, {
      //   width: 'vh(100%)',
      //   data: info_ // Puedes pasar datos del evento al cuadro de diálogo
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   // Lógica a realizar después de cerrar el cuadro de diálogo
      //   // console.log('Cuadro de diálogo cerrado');
      // });
    }
  }
//ecento cambio de informacion en los eventos asiganados al calendario
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }
  
  //verificar si cambia la informacion de las citas
  vigilaCitas(){
    const {mes,anio}  = this._publicos.conveirtefecha_2(new Date());
    const starCountRef = ref(db, `Citas/${anio}/${mes}`)
    onValue(starCountRef, (snapshot) => {
      setTimeout(()=>{
        this.addEvent(this.range.controls['start'].value, this.range.controls['end'].value)
      },500)
    })
  }
  //elimina la cita recibiendo la informacion de la cita
  eliminaCita(data){
    if (data.id) {
      this._publicos.mensaje_pregunta(`Desea cancelar la cita`).then(({respuesta})=>{
        if (respuesta) {
          const updates = {[`${data.ruta}`] : null}
          // console.log(updates);
          update(ref(db), updates).then(()=>{
            this._publicos.mensajeSwal('Cita cancelada', 1)
          })
        }
      })
    }
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
vigilaCalendario(){
  this.range.valueChanges.subscribe(({start, end}) => {
    if (start && end) {
      this.addEvent(start, end)
    }
  })
}
  //evento de cuando cambia la fecha de busqueda en caso de no existe dia busca en todo el mes actual
  async addEvent(start, end) {
    
  }
  reseteaHoras(){
    this.addEvent(null,null)
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


