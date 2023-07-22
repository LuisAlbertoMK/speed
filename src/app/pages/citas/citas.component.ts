
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
    if (start && end) {
      const {_i: startValue} = start;
      const {_i: endValue} = end;

      const {year: year_start,month: moth_start  } = startValue
      const {year: year_end, month: moth_end } = endValue

      const fechaLimite = this._publicos.resetearHoras_horas(start['_d'],'08:30:00')
      const fechaLimite2 = this._publicos.resetearHoras_horas(end['_d'],'18:30:00')

      const muestra1 = this._publicos.convierte_fechaString_personalizada(fechaLimite).string_fecha
      const muestra2 = this._publicos.convierte_fechaString_personalizada(fechaLimite2).string_fecha
      this.rango_select = `${muestra1} - ${muestra2}`
      let citasFinales = []
      //si los años son iguales 
      if(year_start === year_end){
        //si los meses son iguales
        if (moth_start === moth_end) {
          //obtener la lista de las citas dependiendo del usuario
          citasFinales = (this.sucursalCalendario === 'Todas') ? 
            await this._citas.consulta_citas_mes_todas_new(year_start,moth_start +1) : 
            await this._citas.consulta_citas_mes_new(year_start, moth_start +1 , this.sucursalCalendario); 
        }else{
          //si la sucursal seleccionada es 'Todas' superUsuario y si los meses son diferentes
          if (this.sucursalCalendario === 'Todas') {
            for (let index = (moth_start + 1); index <= (moth_end + 1); index++) {
              //obtener la lista de las citas dependiendo del usuario
              const citas = await this._citas.consulta_citas_mes_todas_new(year_start,index);
              citas.forEach(cit => {
                citasFinales.push(cit)
              });
            }
          }else{
            //si la sucursal seleccionada es !'Todas' !superUsuario y si los meses son diferentes
            for (let index = (moth_start + 1); index <= (moth_end + 1); index++) {
              const citas_mes = await this._citas.consulta_citas_mes_new(year_start, index , this.sucursalCalendario)
              citas_mes.forEach(cit => {
                citasFinales.push(cit)
              });
            }
          }
        }
      }else{
        //si los años son diferentes
        if (this.sucursalCalendario === 'Todas') {
          //if la sucursal seleccionada es 'Todas'
          //en el siguiente ciclo for buscamos por año  inicial y año final
          for (let index_anio = year_start; index_anio <= year_end; index_anio++) {
            //asiganamos donde inicia la busqueda del mes y si es dirente del año inicial cambiamos al mes 1 en caso contrario elegimos el mes de la fecha seleccionada
            const dondeInicia = (year_start !== index_anio)? 1 : (moth_start + 1)
            //asiganamos donde finaliza la busqueda del mes y si es igual al año final cambiamos al mes final de la fecha seleccionada
            const dondeFinaliza = (year_end === index_anio)? (moth_end + 1) : 12
            //realiza el ciclo de los meses con las variables 'dondeInicia' - 'dondeFinaliza'
            for (let mes = dondeInicia; mes <= dondeFinaliza; mes++) {
              //obtener la lista de las citas dependiendo del usuario
              const citas = await this._citas.consulta_citas_mes_todas_new(index_anio,mes);
              //recorremos cada uno de los registro devueltos y asignar cada uno a citasFinales
              citas.forEach(cit => {
                citasFinales.push(cit)
              });
            }
          }
        }else{
           //if la sucursal seleccionada es !'Todas'
          for (let index_anio = year_start; index_anio <= year_end; index_anio++) {
            //asiganamos donde inicia la busqueda del mes y si es dirente del año inicial cambiamos al mes 1 en caso contrario elegimos el mes de la fecha seleccionada
            const dondeInicia = (year_start !== index_anio)? 1 : (moth_start + 1)
            //asiganamos donde finaliza la busqueda del mes y si es igual al año final cambiamos al mes final de la fecha seleccionada
            const dondeFinaliza = (year_end === index_anio)? (moth_end + 1) : 12
            //realiza el ciclo de los meses con las variables 'dondeInicia' - 'dondeFinaliza'
            for (let mes = dondeInicia; mes <= dondeFinaliza; mes++) {
              //obtener la lista de las citas dependiendo del usuario
              const citas_mes = await this._citas.consulta_citas_mes_new(index_anio, mes , this.sucursalCalendario)
              //recorremos cada uno de los registro devueltos y asignar cada uno a citasFinales
              citas_mes.forEach(cit => {
                citasFinales.push(cit)
              });
            }
          }
        }
      }
      // hacemos un filtrado de las fecha y hora con el horario de sucursales 
      const citas_fechas = citasFinales.filter(c => c.fecha_compara >= fechaLimite && c.fecha_compara <= fechaLimite2);
      // vaciamos los eventos del calendario en caso de que se quedara algun registro
      this.calendarOptions.events = [];
      ///asignamos los resultados de 'citasFinales' a citas del mes en caso de seleccionar un evento o dia del mes 
      this.citas_mes_all = citas_fechas;
      //asignamos las citas de hoy mediante Date y reseteo de horas dentro del horario
      const fecha_hoy = this._publicos.resetearHoras_horas(new Date(),'08:30:00')
      const fecha_hoy_2 = this._publicos.resetearHoras_horas(new Date(),'18:30:00')

      const proximas_hoy = citasFinales.filter(c => c.fecha_compara >= fecha_hoy && c.fecha_compara <= fecha_hoy_2);
      this.lista_citas_proximas = this._publicos.ordenarData(proximas_hoy, 'horario', true);
      //asignamos todos los resultados de 'citasFinales' a los eventos del calendario
      this.calendarOptions.events = citas_fechas;

    }else{
        //aqui  obtenemos todas las citas pertenecientes al mes actual sin importar el dia de la cita mediante el envio de la fecha del sistema
        const {inicio, final} = this._publicos.getFirstAndLastDayOfCurrentMonth(new Date())
        //obetnemos el numero del mes para la conculta de citas en base a la fecha 
        const {mes,anio}  = this._publicos.conveirtefecha_2(inicio);
        //asigamos los limites en fechas y establecemos los limites en base a los horarios generales de sucursales
        const fechaLimite = this._publicos.resetearHoras_horas(new Date(),'08:30:00')
        const fechaLimite2 = this._publicos.resetearHoras_horas(new Date(),'18:30:00')
        const lim_asistencia = this._publicos.resetearHoras_horas(inicio,'08:30:00')
        ///muestra titulo de tabs
        const muestra1 = this._publicos.convierte_fechaString_personalizada(fechaLimite).string_fecha
        const muestra2 = this._publicos.convierte_fechaString_personalizada(fechaLimite2).string_fecha
        this.rango_select = `${muestra1} - ${muestra2}`
        //obtener la lista de las citas dependiendo del usuario
        const citasFinales = (this.sucursalCalendario === 'Todas') ? 
        await this._citas.consulta_citas_mes_todas_new(anio,mes) : 
        await this._citas.consulta_citas_mes_new(anio, mes,this.sucursalCalendario);
        this.citas_mes_all = citasFinales;
        const updates = {}
        //obtener las citas que no cuentan con recordatorio
        const sinRecordatorio = citasFinales.filter(c=>!c.recordatorio)
        //obtener las citas las cuales no asistieron
        const sinAsistencia = citasFinales.filter(c => !c.asistencia && c.fecha_compara >= lim_asistencia && c.fecha_compara <= new Date());
        this.citas_no_asistencia = sinAsistencia
        //crear el arreglo para el nevio de correo de recordatorio para las citas las cuales no se ha enviado
        let ocupados = []
        //hacer el barrido de cada una las citas sin recordatorio
        sinRecordatorio.forEach(cita=>{
          const {sucursal, id, fecha_compara} = cita
          //obtener la diferencia de horas entre la fecha actual y la fecha  de registro
          const difencia_dias = this._citas.compararHorasEntreFechas(new Date(), fecha_compara)
          //enviar en caso de que las horas sean mayor a 24 horas
            if(!cita.recordatorio && difencia_dias > 24 ) {
              updates[`Citas/${anio}/${mes}/${sucursal}/${id}/recordatorio`] = true
              const correo_sucursal = this.sucursales_array.find(s=>s.id === cita.sucursal).correo
              const correos = [correo_sucursal,cita.correo]
              ocupados.push(
                Object({
                  correos: correos,
                  placas: String(cita.placas).toUpperCase(),
                  fullname: String(cita.fullname).toUpperCase(),
                  dia: cita.dia,
                  horario: cita.horario,
                })
              )
            }
        })
        //realizar la actualizacion de recordatorio de las citas
        update(ref(db), updates).then(ans=>{
          //enviar los correos para cada cliente
          ocupados.forEach(env=>{
            this._email.recordatorioCita(env)
          })
        });
        
        // hacemos un filtrado de las fecha y hora con el horario de sucursales 
        const fechas_proximas = citasFinales.filter(c => c.fecha_compara >= fechaLimite && c.fecha_compara <= fechaLimite2);
        //asignamos las citas de hoy 
        this.lista_citas_proximas = this._publicos.ordenarData(fechas_proximas, 'horario', true);
        //asignamos todos los resultados de 'citasFinales' a los eventos del calendario
        this.calendarOptions.events = citasFinales;
        
    }
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


