import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { child, get, getDatabase, onValue, ref, set, push, update } from 'firebase/database';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { MatDatepickerCancel, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CitasService } from 'src/app/services/citas.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-registra-cita',
  templateUrl: './registra-cita.component.html',
  styleUrls: ['./registra-cita.component.css']
})
export class RegistraCitaComponent implements OnInit,AfterViewInit, OnChanges, OnDestroy {
  
  constructor(private _security:EncriptadoService, private _sucursales: SucursalesService, private _clientes: ClientesService,
    private _publicos: ServiciosPublicosService,private formBuilder: FormBuilder, private _citas: CitasService, private _cotizacion : CotizacionService) { }

    ROL:string
    SUCURSAL:string

    camposInfoCita    =  [  ...this._citas.camposInfoCita  ]
    sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]

    @Input() nuevaCita:boolean = false
    @Input() info_cita 
    @Input() id_cita
    miniColumnas:number = 100
    
    myControl = new FormControl('');
    filteredOptions: Observable<string[]>;
    clientes_arr=[]
    todos_clientes = []
    arr_vehiculos = []
    horariosDisponibles = []
    // horarios_ocupados = []
    horarios_show = []
    citaForm: FormGroup;
    infoCita = {id:null,sucursal:'', sucursalShow:'', cliente:'', fullname:'', vehiculo:'',servicio:'',servicioShow:'', placas: '', dia:'', horario:'',comentarios:{}, correo:'',dataVehiculo:{},cotizacionShow: '', cotizacionCosto:0, direccion:''}
    
    faltente:string
    citasCampos = [ 'sucursal','cliente','correo','vehiculo','servicio','dia','horario','comentario']
    nuevos = ['sucursal','sucursalShow','cliente','correo','fullname','vehiculo','servicio','servicioShow','placas','dia','horario','comentario']
    confirmar:boolean = false
    startProceso:boolean = false
  
    ///
  
    tiempoLimite: number = 300;
    tiempoRestante: number = this.tiempoLimite;
    temporizador
  
    camposServicios = [
      {valor:'1',nombre:'servicio'},
      {valor:'2',nombre:'garantia'},
      // {valor:'3',nombre:'retorno'},
      // {valor:'4',nombre:'venta'},
      // {valor:'5',nombre:'preventivo'},
      // {valor:'6',nombre:'correctivo'},
      {valor:'7',nombre:'rescate vial'},
      {valor:'8',nombre:'frenos'},
      {valor:'9',nombre:'afinación'},
      {valor:'10',nombre:'cambio de aceite'},
      {valor:'11',nombre:'revisión general'},
      {valor:'12',nombre:'revisión de falla'},
      {valor:'13',nombre:'escaneo vehículo'},
    ]
  
    dateControl = new FormControl();
    ligarCotizacion: boolean = false
    listaCotizacionesShow = []
  
    arreglo_correos = []
    correo_viene_cliente: boolean = false
  ngOnInit(): void {
    this.rol()
    this.creaFormCitas()
    this.automaticos()
  }
  ngOnDestroy(){
    this.cancelaCita()
   }
  ngAfterViewInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    let nuevaCita, id_cita, mensaje
    
    if (changes['nuevaCita']) {  nuevaCita = changes['nuevaCita'].currentValue }
    if (changes['id_cita']) {  id_cita = changes['id_cita'].currentValue }

    // console.log(id_cita);
   
    // if (nuevaCita) {
    //   mensaje = 'Tienes 5 minutos para registrar tu cita'
    //   // this.comeinzaCita(mensaje)
    //   this._publicos.mensajeSwal(mensaje)
    //   this.iniciarTemporizador()
    // }else{
    //   if(id_cita && id_cita !== ''){
    //     mensaje = 'Tienes 5 minutos para ediatr informacion de la cita'
    //     // console.log(this.info_cita);
        
        
    //     this._clientes.consulta_cliente_new(this.info_cita.cliente).then((cliente:any)=>{
    //       this.infoCita.correo = cliente.correo
    //       this.infoCita.fullname = cliente.fullname
    //       this.infoCita.cliente = this.info_cita.cliente
    //       this.infoCita.sucursal = this.info_cita.sucursal
    //       this.infoCita.vehiculo = this.info_cita.vehiculo
    //       this.infoCita.servicio = this.info_cita.servicio
    //       this.infoCita.servicioShow = this.camposServicios.find(s=>s.valor === this.info_cita.servicio).nombre
    //       this.infoCita.sucursalShow = this.sucursales_arr.find(s=>s.id === this.info_cita.sucursal).sucursal
    //       this.arr_vehiculos = cliente.vehiculos
    //       this.infoCita.id = id_cita
    //       this.infoCita.placas = cliente.vehiculos.find(v=>v.id === this.info_cita.vehiculo).placas
    //       this.citaForm.reset({
    //         id: id_cita,
    //         cliente: this.info_cita.cliente,
    //         sucursal: this.info_cita.sucursal,
    //         vehiculo: this.info_cita.vehiculo,
    //         servicio: this.info_cita.servicio,
    //         dia: '' ,
    //         horario: '',
    //       })
    //       // this.comeinzaCita(mensaje)
    //       this._publicos.mensajeSwal(mensaje)
    //       this.iniciarTemporizador()
    //     })
        
    //   }
    // }
  }
  rol(){
   
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal;

    (this.SUCURSAL === 'Todas') ? false:  this.horariosSucursal()

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
    const sucursal = (this.SUCURSAL === 'Todas') ? '':  this.SUCURSAL
    this.nuevaCita = true
    this.myControl.setValue(null)
    this.citaForm.reset({sucursal})
    this.info_cita = null
    this.arr_vehiculos = []
  }
  inicioDetenerCita(start_stop: boolean){
    this.startProceso = start_stop
    this.reiniciarTemporizador();
    if (start_stop) {
      this.iniciarTemporizador()
    }else{
      this.cancelaCita()
    }
  }
  iniciarOtraCita(){
    this.cancelaCita()
    this.reiniciarTemporizador()
    this.startProceso = true
    this.iniciarTemporizador()
  }
 
  iniciarTemporizador() {
    this.temporizador = setInterval(()=>{
      this.actualizarTemporizador(this.tiempoRestante)
    }, 1000);
  }
  detenerTemporizador() {
    const elementoTemporizador = document.getElementById('temporizador')
    elementoTemporizador.textContent = `05:00`;
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
      this.inicioDetenerCita(false)
      this._publicos.mensajeSwal('expiro el tiempo', 0)
    }
  }
  ListadoClientes(sucursal){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, () => {
      this._clientes.consulta_clientes_new().then((clientes) => {
        let actu = [...clientes]
        this.arreglo_correos = actu.map(c=>{
          return c.correo
        })
        clientes.map(c=>{
          c.sucursalShow = this.sucursales_array.find(s=>s.id === c.sucursal)?.sucursal
        })
        const info = clientes //.filter(c=>c.correo)
        

        const camposRecu= [...this._clientes.camposCliente,,'vehiculos','fullname','sucursalShow']
        const aqui = (!this.clientes_arr.length) ? clientes : this._publicos.actualizarArregloExistente(this.clientes_arr, info,camposRecu);
        // console.log(aqui);
        this.clientes_arr = this._publicos.ordenarData(aqui,'fullname',true)

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
       const sucursal = this.citaForm.get('sucursal').value
       if (sucursal) {
        const busqueda = this.clientes_arr.filter(c=>c.sucursal === sucursal)
        data = busqueda.filter(option => String(option.fullname).toLowerCase().includes(filterValue))
        if (!data.length ) data = this.clientes_arr.filter(option => String(option.correo).toLowerCase().includes(filterValue))
      }
    return data
  }
  displayFn(user: any): string {
    return user && user.fullname ? user.fullname : '';
  }
 
 
  creaFormCitas(){
    const sucursal = (this.SUCURSAL === 'Todas') ? '':  this.SUCURSAL
    // const muestra = (this.info_cita['id']) ? this.info_cita['id'] : null
    const urlRegex = /^(https?:\/\/)?goo.gl\/maps\/.*$/;

    this.citaForm = this.formBuilder.group({
      id:[''],
      dia: ['', Validators.required],
      cliente: ['', Validators.required],
      correo:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      sucursal: [sucursal, Validators.required],
      horario: ['', Validators.required],
      vehiculo: ['', Validators.required],
      servicio: ['', Validators.required],
      comentario: ['', Validators.required],
      cotizacion_utiliza: [false, Validators.required],
      cotizacion: ['', Validators.required],
      recoleccion: [false, Validators.required],
      direccion: ['', [Validators.required, Validators.pattern(urlRegex)]],
    });



    if (this.SUCURSAL === 'Todas'){
      this.dateControl.disable();
      this.myControl.setValue(null)
      this.myControl.disable()
      // this.clienteSeleccionado(null)
      this.myControl.setValue(null)
      this.citaForm.controls['cliente'].setValue(null)
      this.citaForm.controls['cliente'].disable()
      this.citaForm.controls['vehiculo'].setValue(null)
      this.citaForm.controls['vehiculo'].disable()
    }
    this.citaForm.get('direccion').disable()
    this.citaForm.get('correo').disable()
    this.vigilaDia()
  }
  horarios_new (sucursal){
    if (sucursal === '-N2glF34lV3Gj0bQyEWK') {
      this._citas.consulta_horarios_sucursal_new(sucursal).then((horarios)=>{
        this.horariosDisponibles = horarios
      })
    }else{
      this._citas.consulta_horarios_sucursal_new('otras').then((horarios)=>{
        this.horariosDisponibles = horarios
      })
    }
  }
  vigilaDia(){
    this.citaForm.get('sucursal').valueChanges.subscribe((sucursal: string) => {
      if (sucursal) {
        this.dateControl.enable();
        this.myControl.enable()
        this.myControl.setValue(null)
        this.automaticos()
        this.citaForm.controls['cliente'].enable()
        this.horarios_new(sucursal)
        this.ListadoClientes(sucursal)
        
      }else{
        this.dateControl.setValue(null); 
        this.dateControl.disable();
        this.myControl.disable()
        // this.clienteSeleccionado(null)
        this.myControl.setValue(null)
        
      }
    })
    //TODO verificar que este seleccionada la sucursal, cliente y vehiculo
    this.citaForm.get('dia').valueChanges.subscribe((dia: string) => {
      const info_form = this.citaForm.value
      if (dia) {
        
        const fecha_gem = this._publicos.convertirFecha(dia)
        const {mes,anio}  = this._publicos.conveirtefecha_2(new Date(fecha_gem));
        
        const fechaLimite = this._publicos.resetearHoras_horas(new Date(fecha_gem),'08:30:00')
        const fechaLimite2 = this._publicos.resetearHoras_horas(new Date(fecha_gem),'18:30:00')
        
        if (info_form.sucursal && info_form.sucursal !== '') {
          const bu = fecha_gem
            .toLocaleDateString('es-ES', { weekday: 'long' }).slice(0,3).toLowerCase()

          this._citas.consulta_cita_existe_new( anio, mes,info_form.sucursal).then((citas)=>{

            const fechas_proximas = citas.filter(c => c.fecha_compara >= fechaLimite && c.fecha_compara <= fechaLimite2);
            const horarios_ocupados = fechas_proximas .filter(cita => !cita.confirmada)
                                                      .map(cita => cita.horario);
            const hora = `${new Date().getHours()}: ${new Date().getMinutes()}:00`
            const resetea1 = this._publicos.resetearHoras_horas(new Date(fecha_gem),hora)
            // console.log(this._publicos.obtenerDiferenciaHoras(resetea1, new Date() ));
            
            const horas_resta = 6
            const horarioRecibido = this._publicos.restarHoras(resetea1, horas_resta)

            //comparar si es el mismo dia 
            const hoyDIa = this._publicos.resetearHoras(new Date())
            const seleccionado = this._publicos.resetearHoras(new Date(fecha_gem))
            // console.log(hoyDIa);
            // console.log(seleccionado);

                       
            this.horarios_show = []
            if (hoyDIa.getTime() === seleccionado.getTime()) {
              // console.log('es el mismo dia traer horarios antes de ', horarioRecibido);
              const horarioInicial = `${horarioRecibido.getHours()}:${horarioRecibido.getMinutes()}`
              if (bu === 'sáb') {
                let h = this.horariosDisponibles['sabado']
                horarioRecibido.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const horariosValidos = h.filter(horario => horario >= horarioInicial);
                this.horarios_show = this._publicos.obtenerDiferencias(horariosValidos, horarios_ocupados)
              }else{
                this._citas.consulta_horarios_sucursal_new('otras').then((horarios)=>{
                  this.horariosDisponibles = horarios
                  const h = this.horariosDisponibles['lunesViernes']
                  horarioRecibido.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  const horariosValidos = h.filter(horario => horario >= horarioInicial);
                  this.horarios_show = this._publicos.obtenerDiferencias(horariosValidos, horarios_ocupados)
                })
              }
            }else{
              if (bu === 'sáb') {
                let h = this.horariosDisponibles['sabado']
                this.horarios_show = this._publicos.obtenerDiferencias(h, horarios_ocupados)
              }else{
                this._citas.consulta_horarios_sucursal_new('otras').then((horarios)=>{
                  this.horariosDisponibles = horarios
                  const h = this.horariosDisponibles['lunesViernes']
                  this.horarios_show = this._publicos.obtenerDiferencias(h, horarios_ocupados)
                })
              }
            }             
          })
        }
      }
    })
    this.citaForm.get('cliente').valueChanges.subscribe(async (cliente: string) => {
      if (cliente) {
        this.citaForm.controls['vehiculo'].enable()
      }else{
        this.citaForm.controls['vehiculo'].setValue(false)
        this.citaForm.controls['vehiculo'].disable()
      }
    })
    this.myControl.valueChanges.subscribe(cliente=>{
      if (!cliente) {
        // console.log('aqdfgdfh');
        
        this.citaForm.controls['vehiculo'].setValue(false)
        this.citaForm.controls['vehiculo'].disable()
        this.citaForm.controls['cliente'].setValue(null)
      }else{
        // console.log(cliente);
        if (cliente instanceof Object) {
          const campos = ['fullname','id','correo','sucursal','sucursalShow']
          campos.forEach(c=>{
            if (c === 'id') {
              this.infoCita.cliente = cliente[c]
            }else{
              this.infoCita[c] = cliente[c]
            }
          })
          this.arr_vehiculos = cliente.vehiculos
          this.citaForm.controls['cliente'].setValue(cliente.id)
          
          this.citaForm.controls['vehiculo'].enable()
          this.citaForm.controls['vehiculo'].setValue(null)
          if (!cliente.correo) {
            this.correo_viene_cliente = false
            this.citaForm.get('correo').enable()
            this.citaForm.get('correo').setValue('')
          }else{
            this.correo_viene_cliente = true
            this.citaForm.get('correo').disable()
            this.citaForm.get('correo').setValue(cliente.correo)
            this.infoCita.correo = cliente.correo
          }
        }else{
          this.arr_vehiculos = []
          this.citaForm.controls['cliente'].setValue(null)
          this.citaForm.controls['vehiculo'].disable()
          this.citaForm.controls['vehiculo'].setValue(null)
        }
      }
    })
    this.citaForm.get('correo').valueChanges.subscribe(async (correo: string) => {
      if (correo && !this.correo_viene_cliente) {
        // console.log('verifica con la lista de correos');
        const existe = this.arreglo_correos.find(c=>c === correo)
        // console.log(existe);
        if (existe) {
          this._publicos.swalToast('el correo ya se encuentra registrado',0)
          this.citaForm.get('correo').setValue('')
        }
        
      }
    })
    this.citaForm.get('vehiculo').valueChanges.subscribe(async (vehiculo: string) => {
      if (vehiculo) {
        this.citaForm.controls['cotizacion_utiliza'].enable()
      }else{
        this.citaForm.controls['cotizacion_utiliza'].setValue(false)
        this.citaForm.controls['cotizacion_utiliza'].disable()
      }
    })
    this.citaForm.get('cotizacion_utiliza').valueChanges.subscribe(async (cotizacion_utiliza: string) => {
      if (cotizacion_utiliza) {
        const cotizaciones = await this._cotizacion.consulta_cotizaciones_new()
        const vehiculo_utilizado = this.citaForm.get('vehiculo').value
        const cotizaciones_filter = cotizaciones.filter(cot=>cot.vehiculo.id === vehiculo_utilizado)
        const ordenadas = this._publicos.ordenarData(cotizaciones_filter,'fechaCompara', false)
        this.listaCotizacionesShow = cotizaciones_filter
      }else{
        this.citaForm.get('cotizacion').setValue(null)
        this.listaCotizacionesShow = []
      }
    })
    this.citaForm.get('cotizacion').valueChanges.subscribe(async (cotizacion: string) => {
      if (cotizacion) {
        
      }
    })
    this.citaForm.get('recoleccion').valueChanges.subscribe(async (recoleccion: string) => {
      if (recoleccion) {
        this.citaForm.get('direccion').enable()
        this.citaForm.get('direccion').setValue('')
      }else{
        this.citaForm.get('direccion').disable()
        this.citaForm.get('direccion').setValue('')
      }
    })
  }
  validarCampo(campo: string){
    return this.citaForm.get(campo).invalid && this.citaForm.get(campo).touched
  }
  guardarCita() {
    console.log(this.correo_viene_cliente);
    const clienete_correo = this.citaForm.get('correo').value
    const clientea = this.citaForm.get('cliente').value
    // const updates[`clientes/${clientea}/correo`] =  clienete_correo
    if (!this.correo_viene_cliente) {
      const updates = {[`clientes/${clientea}/correo`]: clienete_correo};
      update(ref(db), updates).then(()=>{
        this.infoCita.correo = clienete_correo
        this.correo_viene_cliente = true
      })
    }
    


    const data = this.citaForm.value
    const necesarios = [ ...this.citasCampos]
    const cotizacion_utiliza = this.citaForm.get('cotizacion_utiliza').value
    if(cotizacion_utiliza) necesarios.push('cotizacion')
    const recoleccion = this.citaForm.get('recoleccion').value
    if(recoleccion) necesarios.push('direccion')
    data['correo'] = this.citaForm.get('correo').value
    const { faltante_s, ok} = this._publicos.realizavalidaciones_new(data,necesarios)
    this.faltente = faltante_s
    // data.dia = this._publicos.formatearFecha(data.dia['_d'],true)
    console.log(faltante_s);
    ///TODO aqui esta el problema del correo
    if(ok){
      this.infoCita.cliente = data.cliente
      this.infoCita.vehiculo = data.vehiculo
      this.infoCita.sucursal = data.sucursal
      this.infoCita.servicio = data.servicio
      this.infoCita.servicioShow = this.camposServicios.find(s=>s.valor === this.infoCita.servicio).nombre
      this.infoCita.dia = data.dia
      this.infoCita.horario = data.horario
      
      this.infoCita.direccion = data.direccion
      this.infoCita.comentarios = {
        [this._publicos.generaClave()]: {comentario: data.comentario}
      }
      const dataVehiculo = this.arr_vehiculos.find(v=>v.id === data.vehiculo)
      this.infoCita.placas = dataVehiculo.placas
      this.infoCita.dataVehiculo = dataVehiculo
      this.confirmar = true
      // console.log(this.infoCita);
      const cotiza = this.citaForm.get('cotizacion').value
      if (cotiza) {
        // console.log(this.listaCotizacionesShow.find(c=>c.id === cotiza));
        const {reporte, no_cotizacion} = this.listaCotizacionesShow.find(c=>c.id === cotiza)
        this.infoCita.cotizacionShow = no_cotizacion
        this.infoCita.cotizacionCosto = reporte.total
      }else{
        this.infoCita.cotizacionShow = ''
        this.infoCita.cotizacionCosto = 0
      }
      
    }
  }
  ConfirmaCita(){
    let nuevos = ['dataVehiculo','sucursal','sucursalShow','cliente','correo','fullname','vehiculo','servicio','servicioShow','placas','dia','horario','comentarios']

    if(this.id_cita){ nuevos = [...nuevos,'id',''] }
    const cotizacion_utiliza = this.citaForm.get('cotizacion_utiliza').value
    if(cotizacion_utiliza) nuevos.push('cotizacion')
    const recoleccion = this.citaForm.get('recoleccion').value
    if(recoleccion) nuevos.push('direccion')
    const validaciones_data = this._publicos.nuevaRecuperacionData(this.infoCita,nuevos)
    const { faltante_s, ok} = this._publicos.realizavalidaciones_new(validaciones_data,nuevos)
    this.faltente = faltante_s
    
    const recuperada = this._publicos.nuevaRecuperacionData(this.infoCita,nuevos)

    const mi_fecha= this._publicos.convertirFecha(validaciones_data.dia);
    const {dia, mes,anio}  = this._publicos.conveirtefecha_2(mi_fecha);

    // verificar si el horario ya ha sido ocupado
    this._citas.consulta_cita_existe_new_2(anio,mes,validaciones_data.sucursal).then((citas)=>{
      let existe_horario = false
      for (const c of citas) {
        if (c.dia === recuperada.dia && c.horario === recuperada.horario) {
          existe_horario = true;
          break;
        }
      }
      if (existe_horario) {
        this.dateControl.setValue(null)
        this._publicos.mensajeSwal(`El horario ya ha sido ocupado`,0, false, 'Intenta nuevamente')
      }else{
        if (ok) {
          this._publicos.mensaje_pregunta('Registra cita').then(({respuesta})=>{
            if (respuesta) {

              //TODO verificar apartir de este punto
             
                recuperada.status = 'noConfirmada'
                recuperada.recordatorio = false
                // const envia_f =this._publicos.convertirFecha(recuperada.dia)
                // const fecha_formato = this._publicos.formatearFecha(envia_f, false)
                
                //comprobar si ya tiene una cita
                this._citas.consulta_cita_existe_new_2(anio,mes,validaciones_data.sucursal).then((citas)=>{
                  let existeCita = false
                    for (const c of citas) {
                      if (c.vehiculo === recuperada.vehiculo && c.dia === recuperada.dia && c.horario === recuperada.horario) {
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
                            this._publicos.mensajeSwal('Registro de cita correcto', 1)
                            this.cancelaCita()
                          }) 
                        }else{
                          this._publicos.mensajeSwal('se cancelaron los cambios',0)
                          this.confirmar = false
                        }
                      })
                    }else{
                      this.confirmar = false
                      this._publicos.mensajeSwal(`El vehiculo con placas ${this.infoCita.placas} ya cuenta con cita registrada`,0, false, 'verifica la información')
                    }
                  }else{
                    const clave = this._publicos.generaClave()
                    if(recoleccion) recuperada['recoleccion'] = true
                    let updates = {[`Citas/${anio}/${mes}/${recuperada.sucursal}/${clave}`]: recuperada}
                    // let updates = {[`Citas/${recuperada.sucursal}/${fecha_formato}/${clave}`]: recuperada}
                    if(recuperada.id){
                      updates = {[`Citas/${anio}/${mes}/${recuperada.sucursal}/${recuperada.id}`]: recuperada}
                      // updates = {[`Citas/${recuperada.sucursal}/${fecha_formato}/${recuperada.id}`]: recuperada}
                    }

                    // console.log(updates);
                    
                      update(ref(db), updates).then(()=>{
                        this.confirmar = false
                        this._publicos.mensajeSwal('Registro de cita correcto', 1)
                        this.cancelaCita()
                      })            
                  }
                })
              
            }
          })
        }
      }
    })
    
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
  };
  
  addEvent( event: MatDatepickerInputEvent<Date>) {
    const {value} = event
    const info_form = this.citaForm.value
    if (info_form.sucursal) {
      if (value) {
        const envia =this._publicos.resetearHoras(value['_d'])
        this.infoCita.dia = this._publicos.formatearFecha(envia,true)
        this.citaForm.controls['dia'].setValue(this.infoCita.dia)
      }else{
        this.infoCita.dia = null
        this.citaForm.controls['dia'].setValue(null)
      }
    }else{
      console.log('no hay sucursal seleccionda');
    }
  }
}
