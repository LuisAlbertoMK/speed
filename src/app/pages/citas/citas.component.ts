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



//animaciones
import 'animate.css';

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css'; // needs additional webpack config!
import bootstrapPlugin from '@fullcalendar/bootstrap';
import { child, get, getDatabase, onValue, ref, set, push } from 'firebase/database';
import { EmailsService } from 'src/app/services/emails.service';
import { url } from 'inspector';
import { EncriptadoService } from 'src/app/services/encriptado.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  //formualrio citas de mes
  formaCitasMes: FormGroup
  //declaracion   de formulario
  formaCita: FormGroup
  //lista de clientes 
  clientes:any[]=[]
  // lista vehiculos
  vehiculos:any[]=[]
  //lista de horarios
  horarios:any=[]
  horariosMuestra:any=[]
  horariosOcupados=[]
  //fecha
  fecha:any
  fechaCompleta:string
  //listar sucursales
  listaSucursales:any[]=[]
  ///sucursal elejida
  IDSucursal:string = ''
  /// array de dias de la semana
  dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  ///esperar informacion
  carga:boolean = true
  //calendar
  //lista de citas del mes
  listaArrayCitas:any[]=[]
  //arregloGuardarCitas
  guardarCitaArray:any=[]
  //caldendar
  public events: any[];
  public options: any;
  //covertir 
  eventGuid:number = 0;
  ///placas
  placas:string = ''
  //lista vehiculos
  vehiculosnew:any[]=[]
  //fecha de inicio en el mes actual
  fechaCarga = new Date()
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today
  meses=['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  listaEventos:string = ''
  //rol
  ROL: string = ''
  SUCURSAL:string=''
  //
  tiempooReal:any=[]
  tiemporRealSuperSU = []
  guardarRefrecencias=[]
  newData = []

    ///mostrar ocultar formularios 
    Busqueda:boolean=true
    Registro:boolean= false
  //filtro solo activos
  clientesActivos =[]
  @ViewChild('calendar') calendarComponent: FullCalendarComponent

  //consukta incial de fechas
  fecha_today:string
  hora_today:string
  //informacion de cliente seleccionado
  dataClien:any=[]
  dataVehiculo:any=[]
  currentEvents: EventApi[] = [];

  horariosDia:any=[]
  ocupados:any =[]
  constructor(private _clientes: ClientesService, private _vehiculos: VehiculosService,private fb: FormBuilder,
     private _citas: CitasService, private _automaticos: AutomaticosService, private _sucursal : SucursalesService, 
     private _emails: EmailsService, private _adapter: DateAdapter<any>,private _security:EncriptadoService,
     @Inject(MAT_DATE_LOCALE) private _locale: string) { }
  
     
  
     ngOnInit(): void {
      this.rol()
      this.listaClientes()
      this.listarVehiculos()
      this.crearFormularioCita()
      // this.citasMes()
      this.automaticos()
      this.listarSucursales()
      this.crearFormularioCitasMes()
      this.revisa()
      this.busquedasMes()
      this.vigilarCitasDelDia()
      
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    }
    vigilarCitasDelDia(){
      if (this.SUCURSAL === 'Todas') {
        
      }else{
        const starCountRef = ref(db, `citas/${this.SUCURSAL}`)
        onValue(starCountRef, (snapshot) => {
	        console.log('mis citas');
          console.log(this.crearArreglo2(snapshot.val()));
          
        })
      }
    }
    busquedasMes(){
      this.getFechaHora()
      let divider = this.fecha_today.split("/")
      
      let fecha = new Date()
      var dias:number = new Date(fecha.getFullYear(), Number(divider[1]), 0).getDate()
    
     if (this.SUCURSAL === 'Todas') {
      //no hacer nada a menos que se solicite
     }else{
      
       
          for (let index = 1; index <= dias; index++) {
            let getFecha = index+''+Number(divider[1])+''+fecha.getFullYear()
            this._citas.citasDia(this.SUCURSAL,getFecha).subscribe(
              (citas:any)=>{         
                this.listaArrayCitas = citas
                this.listaArrayCitas.forEach((resp:any)=>{
                  let cadena = resp.fecha;
                  let separ:number = cadena.split("/")
                  let hora = resp.hora
                  let sepHora:number = hora.split(":")
                  let informacion:string = ''
                  let clienteNewID:string = ''
                   this.clientes.forEach((cliente:any)=>{
                    if (resp.cliente === cliente.id) {
                      informacion = cliente.nombre
                      clienteNewID = cliente.id
                    }         
                  })
                  // console.log(clienteNewID);
                  
                  
                  
                  this.guardarCitaArray.push(
                    {
                     title          : `${informacion}`,
                       start          : new Date(separ[2], separ[1]-1, separ[0], sepHora[0], sepHora[1]),
                       // end            : new Date(separ[2], separ[1]-1, separ[0], sepHora[0], sepHora[1]+10),
                       allDay         : false,
                       backgroundColor: '#00a65a', //Success (green)
                       borderColor    : '#00a65a' //Success (green)
                    }
                   )
                   
                })
               
                
              },
              (err)=>{ console.log(err)},
              ()=>{ }
            )
          }
     }


     
    }

    intercambioFormularios(busqueda:boolean,registro:boolean){
      this.Busqueda = busqueda
      this.Registro = registro
    }
  //mostrar calendario
  
  calendarVisible = true;
  calendarApi: Calendar;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      right:''
    },
    plugins: [ bootstrapPlugin ],
    themeSystem: 'bootstrap',
    // locale: esLocale,
    initialView: 'dayGridMonth',
    // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    
    // eventContent: this.listaEventos
    // views: {
    //   dayGridMonth: { // name of view
    //     titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
    //     // other view-specific options here
    //   }
    // }
    // select: this.handleDateSelect.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    // eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  }
  
  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }


 

 



  createEventId() {
    return String(this.eventGuid++);
  }
  ///
  
  crearFormularioCita(){
    this.formaCita = this.fb.group({
        cliente:['',[Validators.required]],
        vehiculo:['',[Validators.required]],
        fecha:['',[Validators.required]],
        hora:['',[Validators.required]],
    })
  }
  crearFormularioCitasMes(){
    this.formaCitasMes = this.fb.group({
        sucursal:['',[Validators.required]],
        mes:['',[Validators.required]]
    })
  }
  listarSucursales(){
    if (this.SUCURSAL==='Todas') {
      const starCountRef = ref(db, 'sucursales')
        onValue(starCountRef, (snapshot) => {
      	  const data = snapshot.val()
      		this.listaSucursales = this.crearArreglo2(data)
        })
    }else{
      const starCountRef = ref(db, `sucursales/${this.SUCURSAL}`)
        onValue(starCountRef, (snapshot) => {
      	  this.listaSucursales = snapshot.val()        
        })
    }
  }
  listaClientes(){
      const newReal = ref(db, `clientes`)
      onValue(newReal, (newSnapshot) => {
        
        
        if (this.SUCURSAL === 'Todas') {
          this.tiempooReal = this.crearArreglo2(newSnapshot.val())
        } else {
          let arreglo = this.crearArreglo2(newSnapshot.val())
          this.tiempooReal = arreglo.filter(filtro=>filtro.sucursal === this.SUCURSAL)
        }
        
          // this.filtroActivo()
      })
    
  }
  newListadoSuperSU(){
    let arraySucursales=[]
    this.tiempooReal =[]
    get(child(dbRef, `sucursales`)).then((snpSucursales) => {
      if (snpSucursales.exists()) {
        let sucursales = this.crearArreglo2(snpSucursales.val())
        sucursales.forEach(sucursal => {
          get(child(dbRef, `clientes/${sucursal.id}`)).then((snpClientes) => {
            if (snpClientes.exists()) {
              let clientes = this.crearArreglo2(snpClientes.val())
              clientes.forEach(cliente => {
                const datTemp = {
                  ...cliente,
                  fullname: cliente.nombre + ' ' + cliente.apellidos
                }
                this.tiempooReal.push(datTemp)
              });
            } else {
              // console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          })
        });
      } else {
        // console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  filtroActivo(){
    let greaterTen = []
    this.clientesActivos=[]
    greaterTen = this.tiempooReal.filter(activo => activo.status === true)
    this.clientesActivos = greaterTen
  }
  listarVehiculos(){
    this._vehiculos.listaGenaralVehiculos().subscribe(
      (vehiculos:any)=>{ 
        this.vehiculosnew = vehiculos
      },
      (err)=>{ console.log(err)},
      ()=>{ }
    )
  }
  automaticos(){
    //this._automaticos.registroModelos().subscribe()
  }
  vehiculosCliente(){
    let clienteGet = this.formaCita.controls['cliente'].value
    if (clienteGet==='' || clienteGet === null) {
      this.dataClien = []
    }else{
      this.tiempooReal.forEach(cliente => {
        if (clienteGet === cliente.id) {
         this.dataClien = cliente
         this.formaCita.controls['fecha'].setValue(null)
         this.horariosMuestra = []
        }
      });
      this.vehiculos = []
      get(child(dbRef, `vehiculos/${clienteGet}`)).then((snpVehiculos) => {
        if (snpVehiculos.exists()) {
          this.vehiculos = this.crearArreglo2(snpVehiculos.val())
        } else {
          // Swal.fire('Error!','El cliente no cuenta con vehículos','error')
        }
      }).catch((error) => {
        console.error(error);
      })
    }
  }
  validarCampo(campo: string){
    return this.formaCita.get(campo).invalid && this.formaCita.get(campo).touched
  }
  validarCampoCitasMes(campo: string){
    return this.formaCitasMes.get(campo).invalid && this.formaCitasMes.get(campo).touched
  }
  
  BusquedasCitas(busqueda:string){
    let busca:boolean = true
    this.formaCitasMes.controls['sucursal'].value ? '' : busca = false
    this.formaCitasMes.controls['mes'].value ? '' : busca = false
    if (this.SUCURSAL !== 'Todas') {
      busca= true
    }
  if (busca) {
   
    this.listaArrayCitas=[]
    this.guardarCitaArray=[]
    let fecha = new Date()
    var dias:number = new Date(fecha.getFullYear(), fecha.getMonth()+1, 0).getDate()
    let mes: number = this.formaCitasMes.controls['mes'].value
    //  console.log(mes);
     
    var year = fecha.getFullYear()
    let calendarApi = this.calendarComponent.getApi(); 
    let goFecha:Date =new Date(year+'-'+mes+'-'+25)
    calendarApi.gotoDate(goFecha)
    calendarApi.removeAllEvents()
    this.calendarOptions.initialEvents = this.guardarCitaArray
     
    for (let index = 1; index <= dias; index++) {
      let getFecha = index+''+mes+''+year
      // console.log(getFecha);
      get(child(dbRef, `citas/${this.formaCitasMes.controls['sucursal'].value}/${getFecha}`)).then((snapshot) => {
        if (snapshot.exists()) {
          let citasObt =this.crearArreglo2(snapshot.val())
            citasObt.forEach(obtCita => {
              this.listaArrayCitas.push(obtCita)
              // console.log(obtCita.fecha);
              let cadena = obtCita.fecha;
              let separ:number = cadena.split("/")
              let hora = obtCita.hora
              let sepHora:number = hora.split(":")
              this.guardarCitaArray.push(
                        {
                         title          : `Cita`,
                           start          : new Date(separ[2], separ[1]-1, separ[0], sepHora[0], sepHora[1]),
                           // end            : new Date(separ[2], separ[1]-1, separ[0], sepHora[0], sepHora[1]+10),
                           allDay         : false,
                           backgroundColor: '#00a65a', //Success (green)
                           borderColor    : '#00a65a', //Success (green),
                          //  url: 'http:google.com'
                        })
            })
        } else {
        
        }
      })
      }
    
  }

  }
  infoVehiculo(){
    let vehiculoGet = this.formaCita.controls['vehiculo'].value
    let clienteGet = this.formaCita.controls['cliente'].value
    const starCountRef = ref(db, `vehiculos/${clienteGet}/${vehiculoGet}`)
        onValue(starCountRef, (snapshot) => {
	        // let arreglo= this.crearArreglo2(snapshot.val())
          this.dataVehiculo = snapshot.val()
          this.formaCita.controls['fecha'].setValue(null)
          this.horariosMuestra =[]
        })
  }
  guaradCita(){
    if (this.formaCita.invalid) {
      return Object.values(this.formaCita.controls).forEach(control => {
        control.markAsTouched()
        Swal.fire('Error!','Llenar todos los campos','error')
      })
    }else{
      // console.log(this.dataClien);
      
      let mifecha =this.formaCita.controls['fecha'].value
      let client = this.formaCita.controls['cliente'].value
      let vehi = this.formaCita.controls['vehiculo'].value
      this.fechaCompleta = this.fecha._i.date + '/'+ (this.fecha._i.month +1 ) + '/'+ this.fecha._i.year
      let fecha_registro = mifecha._i.date + '' + (mifecha._i.month +1 ) + ''+ mifecha._i.year
      const tempData ={
        ...this.formaCita.value,
        recordatorio: false,
        fecha: this.fechaCompleta,
        asistencia:false
      }
// console.log(`citas/${this.dataClien.id}/${fecha_registro}/${vehi}`);
      get(child(dbRef, `citas/${this.dataClien.sucursal}/${fecha_registro}/${vehi}`)).then((snapshot) => {
        if (snapshot.exists()) {
          let dataTemporal = snapshot.val()
          Swal.fire({
                    title: '<strong>Hay una cita registrada de este vehículo</strong>',
                    icon: 'info',
                    html:
                      `
                      <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Fecha</th>
                          <th scope="col">Hora</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">1</th>
                          <td>${dataTemporal.fecha}</td>
                          <td>${dataTemporal.hora}</td>
                        </tr>
                      </tbody>
                    </table>
                      `,
                    showCloseButton: true,
                    focusConfirm: false,
                    confirmButtonText:
                      '<i class="fa fa-thumbs-up"></i> OK!',
                  })         
        } else {
          set(ref(db, `citas/${this.dataClien.sucursal}/${fecha_registro}/${vehi}`), tempData )
          .then(() => {
            this.mensajeCorrecto('registro de cita correcto')
            this.formaCita.reset({fecha:false ,hora:[]})
            this.horariosMuestra = []
          })
          .catch((error) => {
            // The write failed...
            console.log(error);
          });
        }
      }).catch((error) => {
        console.error(error);
      });

      // console.log(`citas/${this.dataClien.sucursal}/${fecha_registro}/${client}`);
      
      
      // let contador = 0
      // this.horariosOcupados.forEach(ocupado => {
      //   if (ocupado === this.formaCita.controls['hora'].value) {
      //     contador= contador +1
      //   }else{
          
      //   }
      // })
      // if (contador>0) {
      //   Swal.fire('Error!','Este horario ya esta ocupadoa','error')
      // }else{
      //   let mifecha = this.formaCita.controls['fecha'].value
      //   let conteto: number = 0
      //   let dataTemporal:any = []
      //   this._citas.verificaCitasDia(fecha_registro,this.dataClien.sucursal).subscribe(
      //   (citasDia:any)=>{          
      //     citasDia.forEach(citasDelDia => {
      //       if(this.formaCita.controls['vehiculo'].value === citasDelDia.vehiculo){
      //         conteto = conteto +1
      //         dataTemporal = citasDelDia
      //       }
      //     })
      //     if (conteto>0) {
      //       Swal.fire({
      //         title: '<strong>Hay una cita registrada de este vehículo</strong>',
      //         icon: 'info',
      //         html:
      //           `
      //           <table class="table">
      //           <thead>
      //             <tr>
      //               <th scope="col">#</th>
      //               <th scope="col">Fecha</th>
      //               <th scope="col">Hora</th>
      //             </tr>
      //           </thead>
      //           <tbody>
      //             <tr>
      //               <th scope="row">1</th>
      //               <td>${dataTemporal.fecha}</td>
      //               <td>${dataTemporal.hora}</td>
      //             </tr>
      //           </tbody>
      //         </table>
      //           `,
      //         showCloseButton: true,
      //         focusConfirm: false,
      //         confirmButtonText:
      //           '<i class="fa fa-thumbs-up"></i> OK!',
      //       })
      //     }else{
            
      //       const tempData = {
      //         ...this.formaCita.value,
      //         fecha: this.fechaCompleta,
      //         recordatorio:false
      //       }
      //       const newPostKey = push(child(ref(db), 'posts')).key
            
      //       set(ref(db, `citas/${this.dataClien.sucursal}/${fecha_registro}/${newPostKey}`), tempData )
      //       .then(() => {
              
      //         // let sucursal = this.formaCita.controls['sucursal'].value
      //         const tempEmail ={
      //           from:'desarrollospeed03@gmail.com',
      //           email: this.dataClien.correo,
      //           subject: 'Registro de cita SpeedPro',
      //           mensaje: `
      //           <div style="margin-top: 20px; box-shadow: 0px 10px 10px black;">
      //             <div style="width: 100%; height:50%; margin: auto 0;padding:1.5em 1.5em; ">
      //                 <div style=" background-color: #F0F5F8;display:flex; justify-content: center;align-items: center;text-align: center;">
      //                   <img
      //                     src="https://firebasestorage.googleapis.com/v0/b/speedpro-3a4e1.appspot.com/o/logos%2FlogoSpeedBig.png?alt=media&token=bebffe87-3000-4317-b322-67adef4a971b"
      //                     alt="" class=" img-thumbnail" style="width: 100%; height:300px;">
      //                 </div>
      //               <br><br>
      //               <div style="text-align:start">
      //                 <h2 style="text-transform: uppercase; font-size: 2.3em; background-color: #0B70AE; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
      //                 Cita <strong>SpeedPro</strong></h2>
      //               </div>
      //               <div style=" text-align: justify">
      //                   <p style="font-size: 2em; background-color: #962F91; color:white; font-family: Verdana;margin: 0;padding: 1em 0.5em;">
      //                   Notificación de cita de vehículo, Registro de cita.
      //                   </p>
      //                 <!-- <p>SpeedPro tiene una comunidad que se alegra de tenerte con nosotros!!</p> -->
                
      //                 <p style="font-size: 1.5em; background-color: lavender; color:black;margin: 0;padding: 1em 1em;">
      //                   Estimado ${this.dataClien.fullname} se registro cita del vehiculo  ${this.dataVehiculo.marca}, ${this.dataVehiculo.categoria} 
      //                   con placas ${this.dataVehiculo.placas}, modelo  ${this.dataVehiculo.modelo}, color  ${this.dataVehiculo.color},  
      //                   el día ${this.fecha_today} ${this.hora_today}.
      //                 </p>
      //                 <p style="text-align:center">Para más información, sigue el enlace con el botón de abajo</p>
      //               </div>
                
      //               <div style="text-align: center">
      //                   <a href="https://www.google.com/" target="_blank" style="text-decoration:none;background-color: #0d6efd; color:white; font-size:2em; border:2px; border-color:black; border-radius: 8px;margin: 0;padding: .5em 0.5em;" class="btn btn-primary">SpeedPro</a>
      //               </div>
      //             </div>
      //           </div>`
      //         }
      //         // this._emails.EmailCambioStatus(tempEmail).subscribe(
      //         //   (ans:any)=>{
      //         //        Swal.fire('Exito','Registro de cita correcto','success')
      //         //       this.formaCita.reset({
      //         //         cliente:'',
      //         //           vehiculo:'',
      //         //           sucursal:'',
      //         //           hora:'',
      //         //           fecha: mifecha
      //         //       })
      //         //   },
      //         //   (err)=>{ },
      //         //   ()=>{ },
      //         // )
             
      //         // this.horarios=[]
      //           this.citasMes()
      //           this.carga = true
                
                
                
              
      //       })
      //       .catch((error) => {
      //         // The write failed...
      //       });
      //       // this._citas.guardarCita(fecha_registro,this.formaCita.value, this.fechaCompleta).subscribe(
      //       //   (guardaCIta:any)=>{ 
      //       //     //console.log(guardaCIta)
      //       //   },
      //       //   (err)=>{ console.log(err)},
      //       //   ()=>{
      //       //     this.formaCita.reset({
      //       //       cliente:'',
      //       //       vehiculo:'',
      //       //       sucursal:'',
      //       //       hora:'',
      //       //       fecha: mifecha
      //       //     })
      //       //     this.horarios=[]
      //       //     this.citasMes()
      //       //     this.carga = true
      //       //     Swal.fire('Exito!','Se registro cita','success')
      //       //    }
      //       // )
      //     }
      //     }
      //   ,
      //   (err)=>{ console.log(err)},
      //   ()=>{ }
      // )
      // }

    }
    
    
  
  }
  getHorariosDiaDisponibles(){
    if (this.dataClien.length === 0) {
      // Swal.fire('Error!','Selecciona un cliente para poder continuar','error')
    }else{
      this.IDSucursal = this.dataClien.sucursal
      
      // console.log('aqui');
      
      this.fecha =this.formaCita.controls['fecha'].value
      // console.log(this.fecha);
      if(this.fecha!==null){
        if (this.fecha._isValid) {
          this.carga = true
          this.horarios=[]
          let fecha_registro = this.fecha._i.date + '' + (this.fecha._i.month +1 ) + ''+ this.fecha._i.year
          this.fechaCompleta = this.fecha._i.date + '/'+ (this.fecha._i.month +1 ) + '/'+ this.fecha._i.year
          let dia:number = this.fecha._d.getDay()
          let diaSemana:string = this.dias[dia]
          this.citasdelMes(fecha_registro)
          
          
          if (diaSemana === 'sábado') {
          diaSemana = 'sabado'
          }
          if (diaSemana!=='domingo') {
            let ruta = ''
            if (diaSemana === 'sabado' && this.dataClien.sucursal === "-N2glF34lV3Gj0bQyEWK" ) {
              ruta =  `horarios/-N2glF34lV3Gj0bQyEWK/sabado`
            }
            if (diaSemana === 'sabado' && this.dataClien.sucursal !== "-N2glF34lV3Gj0bQyEWK" ) {
              ruta =  `horarios/otras/sabado`
            }
            if (diaSemana !== 'sabado' && this.dataClien.sucursal === "-N2glF34lV3Gj0bQyEWK" ) {
              ruta =  `horarios/-N2glF34lV3Gj0bQyEWK/lunesViernes`
            }
            if (diaSemana !== 'sabado' && this.dataClien.sucursal !== "-N2glF34lV3Gj0bQyEWK" ) {
              ruta =  `horarios/otras/lunesViernes`
            }
            
            // console.log(fecha_registro)
            this.ocupados = []
            get(child(dbRef, ruta)).then((snapshot) => {
              if (snapshot.exists()) {
                let horaRIOS = this.crearArreglo(snapshot.val())
                // console.log(horaRIOS);
                horaRIOS.forEach(element => {
                  const temp ={
                    hora: element,
                    ocupado:false
                  }
                  this.horarios.push(temp)
                  
                })
                get(child(dbRef, `citas/${this.dataClien.sucursal}/${fecha_registro}`)).then((snapOcupados) => {
                  if (snapOcupados.exists()) {
                    this.ocupados = this.crearArreglo(snapOcupados.val())
                    this.ocupados.forEach(ocupado => {
                          for (let index = 0; index < this.horarios.length; index++) {
                            if (ocupado.hora === this.horarios[index].hora) {
                              this.horarios[index].ocupado = true
                            }
                          }
                        
                    })
                    this.horariosMuestra = this.horarios.filter(filtro => filtro.ocupado === false)
                  } else {
                    // console.log("No data available")
                    this.horariosMuestra = this.horarios
                  }
                }).catch((error) => {
                  console.error(error);
                });
                
              } else {
                console.log("No data available");
              }
            }).catch((error) => {
              console.error(error);
            });
            
            
          }else{
            this.mensajeIncorrecto('Día no hábil')
          }
          
        }else{
         // console.log('fehca no validad')
          // this.carga = true
        }
      }else{
        this.horariosMuestra =[]
      }
      
    }
    
    
  }
  verificarHorarios(){
    console.log('aqui');
    
  }

  citasMes(){
    this.guardarCitaArray=[]
    let fecha = new Date()
    var dias:number = new Date(fecha.getFullYear(), fecha.getMonth()+1, 0).getDate()
    let mes: number = fecha.getMonth()+1
    var year = fecha.getFullYear()
    for (let index = 1; index <= dias; index++) {
    let getFecha = index+''+mes+''+year
    
    this._citas.citasDia('-N2glF34lV3Gj0bQyEWK',getFecha).subscribe(
      (citas:any)=>{         
        this.listaArrayCitas = citas
        this.listaArrayCitas.forEach((resp:any)=>{
          let cadena = resp.fecha;
          let separ:number = cadena.split("/")
          let hora = resp.hora
          let sepHora:number = hora.split(":")
          let informacion:string = ''
          let clienteNewID:string = ''
           this.clientes.forEach((cliente:any)=>{
            if (resp.cliente === cliente.id) {
              informacion = cliente.nombre
              clienteNewID = cliente.id
            }         
          })
          // console.log(clienteNewID);
          
          
          
          this.guardarCitaArray.push(
            {
             title          : `${informacion}`,
               start          : new Date(separ[2], separ[1]-1, separ[0], sepHora[0], sepHora[1]),
               // end            : new Date(separ[2], separ[1]-1, separ[0], sepHora[0], sepHora[1]+10),
               allDay         : false,
               backgroundColor: '#00a65a', //Success (green)
               borderColor    : '#00a65a' //Success (green)
            }
           )
        })
        setTimeout(()=>{
          this.calendarOptions.events = this.guardarCitaArray
        },100)
        
      },
      (err)=>{ console.log(err)},
      ()=>{ }
    )
      
      
    }
    
  }
  citasdelMes(fecha:string){
    this.guardarCitaArray=[]
    this._citas.citasDia(this.IDSucursal,fecha).subscribe(
      (citas:any)=>{ 
        this.listaArrayCitas = citas
        this.listaArrayCitas.forEach((resp:any)=>{
          let cadena = resp.fecha;
          let separ:number = cadena.split("/")
          let hora = resp.hora
          let sepHora:number = hora.split(":")
          let informacion:string = ''
          this.clientes.forEach((cliente:any)=>{
            if (resp.cliente === cliente.id) {
              informacion = cliente.nombre
            }            
          })
          this.guardarCitaArray.push(
           {
            title          : informacion,
              start          : new Date(separ[2], separ[1]-1, separ[0], sepHora[0], sepHora[1]),
              // end            : new Date(separ[2], separ[1]-1, separ[0], sepHora[0], sepHora[1]+10),
              allDay         : false,
              backgroundColor: '#00a65a', //Success (green)
              borderColor    : '#00a65a' //Success (green)
           }
          )
        })
      },
      (err)=>{ console.log(err)},
      ()=>{ }
    )
  }
  ordenar(array:any){
    array.sort(function (a, b) {
      if (a.hora > b.hora) {
        return 1;
      }
      if (a.hora < b.hora) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }
  ordenar2(array:any){
    array.sort(function(a, b) {
      return a - b});
  }

  agregarMuestra(){
    for (let index = 0; index < this.horarios.length; index++) {
      const horario:string = this.horarios[index]
      for (let indice = 0; indice < this.horariosOcupados.length; indice++) {
        const ocupado:string = this.horariosOcupados[indice];
        if (horario === ocupado) {
          this.horarios.splice(index, 1, 'vacio')
        }
      } 
    }
  }
  condicion(){

    this.horarios.forEach((horario:string) => {
      if (horario!== 'vacio') {
        this.horariosMuestra.push(horario)
      }
    })
    this.carga = false
  }
  public revisa(){
      setInterval(()=>{
        if (this.guardarCitaArray.length!==0) {
          this.calendarOptions.events = this.guardarCitaArray
        }
    },1000)
  }
  mensajeCorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: mensaje
    })
  }
  mensajeIncorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: mensaje
    })
  }

  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }
  private crearArreglo(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      //arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }
   getFechaHora(){
    let date: Date = new Date()
    this.fecha_today=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    this.hora_today=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
    
  }
}

/// funciones

