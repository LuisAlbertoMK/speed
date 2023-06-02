import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
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
export class RegistraCitaComponent implements OnInit,AfterViewInit {
  @Input() RegistraCita:boolean 
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
  infoCita = {sucursal:'', sucursalShow:'', cliente:'', fullname:'', vehiculo:'', placas: '', dia:'', horario:'', correo:''}
  camposInfoCita = [ 
    {valor: 'sucursalShow', show:'Sucursal'},
    {valor: 'fullname', show:'Cliente'},
    {valor: 'correo', show:'Correo'},
    {valor: 'placas', show:'placas'},
    {valor: 'dia', show:'dia cita'},
    {valor: 'horario', show:'Hora cita'},]
  faltente:string
  citasCampos = [ 'sucursal','cliente','vehiculo','dia','horario']
  confirmar:boolean = false
  tiempoLimite: number = 300;
  startProceso:boolean = false

  constructor(private _security:EncriptadoService, private _sucursales: SucursalesService, private _clientes: ClientesService,
    private _publicos: ServiciosPublicosService,private formBuilder: FormBuilder, private _citas: CitasService) { }
  ngOnInit(): void {
    this.rol()
    this.creaFormCitas()
    this.automaticos()
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if(this.RegistraCita){
      this._publicos.mensaje_pregunta('Tienes 5 minutos para registrar la cita deseas continuar').then(({respuesta})=>{
        if (respuesta) {
          this.startProceso = true
          setTimeout(()=>{
            this.iniciarTemporizador(this.tiempoLimite); //tiempo en segundos
          },1000)
        }
      })
    }
    
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
      })
    }
  }

  reintentar(){
    this._publicos.mensaje_pregunta('Tienes 5 minutos para registrar la cita deseas continuar').then(({respuesta})=>{
      if (respuesta) {
        this.startProceso = true
        setTimeout(()=>{
          this.iniciarTemporizador(this.tiempoLimite); //tiempo en segundos
        },1000)
      }else{

      }
    })
  }
  cancelaCita(){
    this.confirmar = false
    this.startProceso = false
    const sucursal = (this.SUCURSAL === 'Todas') ? '':  this.SUCURSAL
    this.myControl.setValue(null)
    this.citaForm.reset({sucursal})
    
  }
 
  iniciarTemporizador(tiempoTotal) {
    let retorna = false
    const elementoTemporizador = document.getElementById('temporizador')
    let tiempoRestante = tiempoTotal;
    actualizarTemporizador();
    const temporizador = setInterval(actualizarTemporizador, 1000);
    const retornaa = setInterval(()=>{
      if (retorna) { 
        this.startProceso = false
        const sucursal = (this.SUCURSAL === 'Todas') ? '':  this.SUCURSAL
        this.citaForm.reset(sucursal)
        this._publicos.mensajeSwalError('expiro el tiempo re registro de cita')
        clearInterval(retornaa);
      }
    }, 1000);
    
    function actualizarTemporizador() {
      const minutos = Math.floor(tiempoRestante / 60);
      const segundos = tiempoRestante % 60;
      elementoTemporizador.textContent = `${formatoDosDigitos(minutos)}:${formatoDosDigitos(segundos)}`;
      if (tiempoRestante === 0) {
        retorna = true
        clearInterval(temporizador);
      }else{
        retorna = false
      }
      tiempoRestante--;
    }
    function formatoDosDigitos(numero) {
      return numero < 10 ? `0${numero}` : numero;
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
    this.citaForm = this.formBuilder.group({
      dia: ['', Validators.required],
      cliente: ['', Validators.required],
      sucursal: [sucursal, Validators.required],
      horario: ['', Validators.required],
      vehiculo: ['', Validators.required]
    });
    this.vigilaDia()
  }
  vigilaDia(){
    this.citaForm.get('dia').valueChanges.subscribe((dia: string) => {
      if (dia) {
        const info_form = this.citaForm.value

        if (info_form.sucursal) {
          const bu = new Date(this._publicos.convertirFecha(dia))
            .toLocaleDateString('es-ES', { weekday: 'long' }).slice(0,3).toLowerCase()
            
            const fecha_con = this._publicos.convertirFecha(dia)
            const fecha_formato = this._publicos.formatearFecha(fecha_con, false)
          this._citas.consulta_cita_existe_new(info_form.sucursal, fecha_formato).then((citas)=>{
            const horarios_ocupados = citas.map(c=>{
              return c.horario
            })
            this.horarios_show = []
              if (bu === 'sáb') {
                const h = this.horariosDisponibles['sabado']
                this.horarios_show = this._publicos.obtenerDiferencias(h, horarios_ocupados)
              }else{
                const h = this.horariosDisponibles['lunesViernes']
                this.horarios_show = this._publicos.obtenerDiferencias(h, horarios_ocupados)
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
    const data = this.citaForm.value
    const recuperada = this._publicos.nuevaRecuperacionData(data,this.citasCampos)
    const necesarios = [ ...this.citasCampos]
    const { faltante_s, ok} = this._publicos.realizaValidaciones(necesarios,recuperada)
    if (ok) {
      this._publicos.mensaje_pregunta('Registra cita').then(({respuesta})=>{
        if (respuesta) {
          const recuperada = this._publicos.nuevaRecuperacionData(this.infoCita,this.citasCampos)
          const envia_f =this._publicos.convertirFecha(recuperada.dia)
          const fecha_formato = this._publicos.formatearFecha(envia_f, false)
          const clave = this._publicos.generaClave()
          recuperada.asistencia = false
          recuperada.recordatorio = false
          //comprobar si ya tiene una cita
          this._citas.consulta_cita_existe_new(recuperada.sucursal, fecha_formato).then((citas)=>{
            const existeCita = citas.find(c=>c.vehiculo === recuperada.vehiculo)
            
            if (existeCita) {
              this._publicos.mensajeSwalError(`El vehiculo con placas ${this.infoCita.placas} ya cuenta con cita registrada`, false, 'verifica la información')
              this.confirmar = false
            }else{
                const updates = {[`Citas/${recuperada.sucursal}/${fecha_formato}/${clave}`]: recuperada}
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
