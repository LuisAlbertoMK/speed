import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { child, get, getDatabase, onValue, ref, set, push, update } from 'firebase/database';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CitasService } from 'src/app/services/citas.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-registra-cita',
  templateUrl: './registra-cita.component.html',
  styleUrls: ['./registra-cita.component.css']
})
export class RegistraCitaComponent implements OnInit,AfterViewInit, OnChanges {
  @Input() nuevaCita:boolean = false
  @Input() info_cita 
  @Input() id_cita
  miniColumnas:number = 100
  ROL:String
  SUCURSAL:string
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  clientes_arr=[]
  sucursales_arr = []
  arr_vehiculos = []
  horariosDisponibles = []
  // horarios_ocupados = []
  horarios_show = []
  citaForm: FormGroup;
  infoCita = {id:null,sucursal:'', sucursalShow:'', cliente:'', fullname:'', vehiculo:'',servicio:'',servicioShow:'', placas: '', dia:'', horario:'', correo:''}
  camposInfoCita = [...this._citas.camposInfoCita]
  faltente:string
  citasCampos = [ 'sucursal','cliente','vehiculo','servicio','dia','horario']
  confirmar:boolean = false
  
  startProceso:boolean = false

  ///

  tiempoLimite: number = 300;
  tiempoRestante: number = this.tiempoLimite;
  temporizador

  camposServicios = [...this._publicos.camposServicios()]
  constructor(private _security:EncriptadoService, private _sucursales: SucursalesService, private _clientes: ClientesService,
    private _publicos: ServiciosPublicosService,private formBuilder: FormBuilder, private _citas: CitasService) { }
  ngOnInit(): void {
    this.rol()
    this.creaFormCitas()
    this.automaticos()
  }
  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    let nuevaCita, id_cita, mensaje 
    if (changes['nuevaCita']) {  nuevaCita = changes['nuevaCita'].currentValue }
    if (changes['id_cita']) {  id_cita = changes['id_cita'].currentValue }
    // console.log(nuevaCita);
    // console.log(id_cita);
    this.detenerTemporizador()
    if (nuevaCita) {
      mensaje = 'Tienes 5 minutos para registrar tu cita'
      // this.comeinzaCita(mensaje)
      this._publicos.mensajeSwal(mensaje)
      this.iniciarTemporizador()
    }else{
      if(id_cita && id_cita !== ''){
        mensaje = 'Tienes 5 minutos para ediatr informacion de la cita'
        // console.log(this.info_cita);
        
        
        this._clientes.consulta_cliente_new(this.info_cita.cliente).then((cliente:any)=>{
          this.infoCita.correo = cliente.correo
          this.infoCita.fullname = cliente.fullname
          this.infoCita.cliente = this.info_cita.cliente
          this.infoCita.sucursal = this.info_cita.sucursal
          this.infoCita.vehiculo = this.info_cita.vehiculo
          this.infoCita.servicio = this.info_cita.servicio
          this.infoCita.servicioShow = this.camposServicios.find(s=>s.valor === this.info_cita.servicio).nombre
          this.infoCita.sucursalShow = this.sucursales_arr.find(s=>s.id === this.info_cita.sucursal).sucursal
          this.arr_vehiculos = cliente.vehiculos
          this.infoCita.id = id_cita
          this.infoCita.placas = cliente.vehiculos.find(v=>v.id === this.info_cita.vehiculo).placas
          this.citaForm.reset({
            id: id_cita,
            cliente: this.info_cita.cliente,
            sucursal: this.info_cita.sucursal,
            vehiculo: this.info_cita.vehiculo,
            servicio: this.info_cita.servicio,
            dia: '' ,
            horario: '',
          })
          // this.comeinzaCita(mensaje)
          this._publicos.mensajeSwal(mensaje)
          this.iniciarTemporizador()
        })
        
      }
    }
  }
  comeinzaCita(mensaje){
    this._publicos.mensaje_pregunta(mensaje).then(({respuesta})=>{
      if (respuesta) {
        this.startProceso = true
        setTimeout(()=>{
          this.iniciarTemporizador()
        },1000)
      }
    })
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this._sucursales.consultaSucursales_new().then((sucursales) => {
      this.sucursales_arr = sucursales
      this.ListadoClientes(this.SUCURSAL)
      const sucursal = (this.SUCURSAL === 'Todas') ? false:  true
      if (sucursal) {
        const fecha = this._publicos.formatearFecha(new Date(), false)
        this.horariosSucursal()
      }
    }).catch((error) => {
      // Manejar el error si ocurre
    });
  }
  horariosSucursal(){
    if (this.SUCURSAL === '-N2glF34lV3Gj0bQyEWK') {
      this._citas.consulta_horarios_sucursal_new(this.SUCURSAL).then((horarios)=>{
        this.horariosDisponibles = horarios
      })
    }else{
      
      this._citas.consulta_horarios_sucursal_new('otras').then((horarios)=>{
        this.horariosDisponibles = horarios
        console.log(horarios);
      })
    }
    
  }

  reintentar(){
    // this._publicos.mensaje_pregunta('Tienes 5 minutos para registrar la cita deseas continuar').then(({respuesta})=>{
    //   if (respuesta) {
    //     this.startProceso = true
    //     setTimeout(()=>{
    //       this.iniciarTemporizador(this.tiempoLimite, false); //tiempo en segundos
    //     },1000)
    //   }else{

    //   }
    // })
  }
  cancelaCita(){
    this.detenerTemporizador()
    this.confirmar = false
    this.startProceso = false
    const sucursal = (this.SUCURSAL === 'Todas') ? '':  this.SUCURSAL
    this.myControl.setValue(null)
    this.citaForm.reset({sucursal})
    this.info_cita = null
    this.nuevaCita = false
  }
 
 
  iniciarTemporizador() {
    this.temporizador = setInterval(()=>{
      this.actualizarTemporizador(this.tiempoRestante)
    }, 1000);
  }
  detenerTemporizador() {
    const elementoTemporizador = document.getElementById('temporizador')
    elementoTemporizador.textContent = `00:00`;
    clearInterval(this.temporizador);
  }
  reiniciarTemporizador() {
    this.detenerTemporizador();
    this.tiempoRestante = this.tiempoLimite;
    this.actualizarTemporizador(this.tiempoRestante);
  }
  actualizarTemporizador(tiempoTotal) {
    const elementoTemporizador = document.getElementById('temporizador')
    this.tiempoRestante = tiempoTotal;
    const minutos = Math.floor(this.tiempoRestante / 60);
    const segundos = this.tiempoRestante % 60;
    elementoTemporizador.textContent = `${formatoDosDigitos(minutos)}:${formatoDosDigitos(segundos)}`;
    if (this.tiempoRestante === 0) clearInterval(this.temporizador);
    this.tiempoRestante--;
    function formatoDosDigitos(numero) {
      return numero < 10 ? `0${numero}` : numero;
    }
    if (this.tiempoRestante < 0){
      this.detenerTemporizador();
      this._publicos.mensajeSwalError('expiro el tiempo re registro de cita')
    }
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
    let data = []
    const filterValue:string = String(value).toLowerCase();
    data = this.clientes_arr.filter(option => String(option.fullname).toLowerCase().includes(filterValue))
    if (!data.length ) data = this.clientes_arr.filter(option => String(option.correo).toLowerCase().includes(filterValue))
    return data
  }
  displayFn(user: any): string {
    return user && user.fullname ? user.fullname : '';
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
      this.infoCita.correo = cliente.correo
    }
    // this.arr_vehiculos = cl
    
  }
 
  creaFormCitas(){
    const sucursal = (this.SUCURSAL === 'Todas') ? '':  this.SUCURSAL
    // const muestra = (this.info_cita['id']) ? this.info_cita['id'] : null
    
    this.citaForm = this.formBuilder.group({
      id:[''],
      dia: ['', Validators.required],
      cliente: ['', Validators.required],
      sucursal: [sucursal, Validators.required],
      horario: ['', Validators.required],
      vehiculo: ['', Validators.required],
      servicio: ['', Validators.required]
    });
    this.vigilaDia()
  }
  vigilaDia(){
    this.citaForm.get('dia').valueChanges.subscribe((dia: string) => {
      if (dia) {
        const info_form = this.citaForm.value
        const fecha_gem = this._publicos.convertirFecha(dia)
        const {mes,anio}  = this._publicos.conveirtefecha_2(fecha_gem);
        const fechaLimite = this._publicos.resetearHoras_horas(fecha_gem,'08:30:00')
        const fechaLimite2 = this._publicos.resetearHoras_horas(fecha_gem,'18:30:00')
        if (info_form.sucursal && info_form.sucursal !== '') {
          const bu = fecha_gem
            .toLocaleDateString('es-ES', { weekday: 'long' }).slice(0,3).toLowerCase()

          this._citas.consulta_cita_existe_new( anio, mes,info_form.sucursal).then((citas)=>{
            const fechas_proximas = citas.filter(c => c.fecha_compara >= fechaLimite && c.fecha_compara <= fechaLimite2);
            const horarios_ocupados = fechas_proximas .filter(cita => !cita.confirmada)
                                                      .map(cita => cita.horario);
            this.horarios_show = []
              if (bu === 'sáb') {
                
                if (info_form.sucursal !== '-N2glF34lV3Gj0bQyEWK' ) {
                  
                  console.log(info_form.sucursal);
        
                  this._citas.consulta_horarios_sucursal_new('otras').then((horarios)=>{
                    console.log(horarios);
                    console.log(horarios_ocupados);
                    
                    this.horarios_show = this._publicos.obtenerDiferencias(horarios['sabado'], horarios_ocupados)
                  })
                }else{
                  let h = this.horariosDisponibles['sabado']
                  this.horarios_show = this._publicos.obtenerDiferencias(h, horarios_ocupados)
                }
              }else{
                this._citas.consulta_horarios_sucursal_new('otras').then((horarios)=>{
                  this.horariosDisponibles = horarios
                  const h = this.horariosDisponibles['lunesViernes']
                  this.horarios_show = this._publicos.obtenerDiferencias(h, horarios_ocupados)
                })
              }
          })
        }
      }
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
    // data.dia = this._publicos.formatearFecha(data.dia['_d'],true)
    // console.log(data);
    if(ok){
      this.infoCita.cliente = data.cliente
      this.infoCita.vehiculo = data.vehiculo
      this.infoCita.sucursal = data.sucursal
      this.infoCita.servicio = data.servicio
      this.infoCita.servicioShow = this.camposServicios.find(s=>s.valor === this.infoCita.servicio).nombre
      this.infoCita.dia = data.dia
      // this.infoCita.correo = this.clientes_arr.find(c=>c.id === data.cliente).correo
      this.infoCita.horario = data.horario
      this.infoCita.sucursalShow = this.sucursales_arr.find(s=>s.id === data.sucursal).sucursal
      this.infoCita.placas = this.arr_vehiculos.find(v=>v.id === data.vehiculo).placas
      this.infoCita.fullname = this.clientes_arr.find(c=>c.id === data.cliente).fullname
      this.confirmar = true
      
    }
  }
  ConfirmaCita(){
    let nuevos = ['sucursal','sucursalShow','cliente','fullname','vehiculo','servicio','servicioShow','placas','dia','horario','correo']
    if(this.id_cita){ nuevos = [...nuevos,'id'] }
    const validaciones_data = this._publicos.nuevaRecuperacionData(this.infoCita,nuevos)
    const { faltante_s, ok} = this._publicos.realizaValidaciones(nuevos,validaciones_data)
    this.faltente = faltante_s
    if (ok) {
      this._publicos.mensaje_pregunta('Registra cita').then(({respuesta})=>{
        if (respuesta) {
          // `Citas/anio/mes/sucursal/cita`
          
          const mi_fecha= this._publicos.convertirFecha(validaciones_data.dia);
          const {dia, mes,anio}  = this._publicos.conveirtefecha_2(mi_fecha);
          const fechaSave = `Citas/${anio}/${mes}/${validaciones_data.sucursal}/cita`
          // console.log(fechaSave);

          //TODO verificar apartir de este punto
          const recuperada = this._publicos.nuevaRecuperacionData(this.infoCita,nuevos)
            recuperada.confirmada = false
            recuperada.asistencia = false
            recuperada.recordatorio = false
            const envia_f =this._publicos.convertirFecha(recuperada.dia)
            const fecha_formato = this._publicos.formatearFecha(envia_f, false)
            
            //comprobar si ya tiene una cita
            this._citas.consulta_cita_existe_new_2(anio,mes,validaciones_data.sucursal,dia,validaciones_data.vehiculo).then((citas)=>{
              let existeCita = false;
                for (const c of citas) {
                  if (c.vehiculo === recuperada.vehiculo && c.dia === recuperada.dia) {
                    existeCita = true;
                    break;
                  }
                }
              if (existeCita) {
                if (this.id_cita) {                  
                  let updates = {[`Citas/${anio}/${mes}/${validaciones_data.sucursal}/${recuperada.id}`]: recuperada}
                  // let updates = {[`Citas/${recuperada.sucursal}/${fecha_formato}/${recuperada.id}`]: recuperada}
                  this._publicos.mensaje_pregunta('Cambiar fecha y hora de cita').then(({respuesta})=>{
                    if(respuesta){
                      update(ref(db), updates).then(()=>{
                        this.confirmar = false
                        this._publicos.mensajeSwal('Registro de cita correcto')
                        this.cancelaCita()
                      }) 
                    }else{
                      this._publicos.mensajeSwalError('se cancelaron los cambios')
                      this.confirmar = false
                    }
                  })
                }else{
                  this.confirmar = false
                  this._publicos.mensajeSwalError(`El vehiculo con placas ${this.infoCita.placas} ya cuenta con cita registrada`, false, 'verifica la información')
                }
                
              }else{
                const clave = this._publicos.generaClave()
                let updates = {[`Citas/${anio}/${mes}/${recuperada.sucursal}/${clave}`]: recuperada}
                // let updates = {[`Citas/${recuperada.sucursal}/${fecha_formato}/${clave}`]: recuperada}
                if(recuperada.id){
                  updates = {[`Citas/${anio}/${mes}/${recuperada.sucursal}/${recuperada.id}`]: recuperada}
                  // updates = {[`Citas/${recuperada.sucursal}/${fecha_formato}/${recuperada.id}`]: recuperada}
                }
                  update(ref(db), updates).then(()=>{
                    this.confirmar = false
                    this._publicos.mensajeSwal('Registro de cita correcto')
                    this.cancelaCita()
                  })            
              }
            })
          
        }
      })
    }
  }
  myFilter = (d: Date | null): boolean => {
    // console.log(d);
    const fecha = new Date(d)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (fecha < yesterday) {
      return null
    }else{
      const day = fecha.getDay()
      return day !== 0;
    }
    // Prevent Saturday and Sunday from being selected.
  };
  addEvent( event: MatDatepickerInputEvent<Date>) {
    const {value} = event
    if (value) {
      const envia =this._publicos.reseteaHoras(value['_d'])
      this.infoCita.dia = this._publicos.formatearFecha(envia,true)
      this.citaForm.controls['dia'].setValue(this.infoCita.dia)
    }else{
      this.infoCita.dia = null
      this.citaForm.controls['dia'].setValue(null)
    }
    
    
    // console.log(this.citaForm.value);
    
  }
  cancela(){
    // const control = this.citaForm.get('dia').disabled;
    // if (control) {
    //   this.citaForm.controls['dia'].setValue( this.citaForm.get('dia').value )
    // }
    // this.confirmar = false
    // console.log(this.citaForm.value);
  }
}
