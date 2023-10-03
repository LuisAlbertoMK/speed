import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { getDatabase, onValue, ref, set, update } from 'firebase/database';
import { Observable } from 'rxjs';
import { CitasService } from 'src/app/services/citas.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

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

    data_cliente:any
    data_vehiculo:any
    data_cita
    extra:string
    faltante_s:string

    cotizacionesRealizadas:any[]=[]


    horarios =  this._citas.horarios_citas
  ngOnInit(): void {
    this.rol()
    this.creaFormCitas()
    // this.automaticos()
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
  async infoCliente(cliente){
    if (cliente) {
      console.log(cliente);
      this.data_cliente = cliente
      
      const {id, sucursal, correo} = cliente
      this.citaForm.get('sucursal').setValue(sucursal)
      this.citaForm.get('cliente').setValue(id)
      this.citaForm.get('correo').setValue(correo)
    }
    this.vigila_vehiculos_cliente()
  }
  async vigila_vehiculos_cliente(){
    const {id: id_cliente} = this.data_cliente
    const vehiculos_object = await this._publicos.revisar_cache('vehiculos')
    const vehiculos_arr = this._publicos.crearArreglo2(vehiculos_object)
    const vehiculos_cliente = this._publicos.filtra_campo(vehiculos_arr,'cliente',id_cliente)
    this.arr_vehiculos = vehiculos_cliente
    if (this.extra) {
      this.citaForm.get('vehiculo').setValue(this.extra)
      this.data_vehiculo = this.arr_vehiculos.find(v=>v.id === this.extra)
    }
  }
  vehiculo(IDVehiculo){
    this.extra = IDVehiculo
    this.vigila_vehiculos_cliente()
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
      id_cotizacion: ['', Validators.required],
      recoleccion: [false, Validators.required],
      direccion: ['', [Validators.required, Validators.pattern(urlRegex)]],
    });

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
    this.citaForm.get('cotizacion_utiliza').valueChanges.subscribe(async (cotizacion_utiliza: string) => {
      // console.log(cotizacion_utiliza);
      const cliente = this.citaForm.get('cliente').value;
      console.log(cliente);
      
      if (cotizacion_utiliza && cliente) {
          const cotizacionesRealizadas = await this._publicos.revisar_cache('cotizacionesRealizadas')
          const arreglo_cotizaciones = this._publicos.crearArreglo2(cotizacionesRealizadas)
          const filtro_cotizaciones_cliente = this._publicos.filtra_informacion(arreglo_cotizaciones,'cliente',cliente)
          const ordenedas = this._publicos.ordenamiento_fechas_x_campo(filtro_cotizaciones_cliente,'no_cotizacion',false)
          console.log(ordenedas);
          this.cotizacionesRealizadas = ordenedas
      }else{
        this.cotizacionesRealizadas = []
      }
    })
    this.citaForm.get('cliente').valueChanges.subscribe(async (cliente: string) => {
      const cotizacion_utiliza = this.citaForm.get('cotizacion_utiliza').value;
      if (cotizacion_utiliza && cliente) {
        const cotizacionesRealizadas = await this._publicos.revisar_cache('cotizacionesRealizadas')
          const arreglo_cotizaciones = this._publicos.crearArreglo2(cotizacionesRealizadas)
          const filtro_cotizaciones_cliente = this._publicos.filtra_informacion(arreglo_cotizaciones,'cliente',cliente)
          const ordenedas = this._publicos.ordenamiento_fechas_x_campo(filtro_cotizaciones_cliente,'no_cotizacion',false)
          console.log(ordenedas);
          this.cotizacionesRealizadas = ordenedas
      }else{
        this.cotizacionesRealizadas = []
      }
    })
    // this.myControl.valueChanges.subscribe(dia=>{
    //   console.log(dia);
    // })

  }
  async addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    // console.log(event.value);
    const date = event.value
    if (date && date['_d']) {
      const saber_dia = new Date(date['_d'])
      console.log(this.horarios);
      console.log(saber_dia.getDay())
      const numeroDia = saber_dia.getDay()
      const sucursal = this.citaForm.get('sucursal').value;

      const cita_search  = this.ruta_guardar_cita(new Date(saber_dia))
      console.log(cita_search);
  
      const citas_dia = `Citas/${cita_search}/${sucursal}/${this._publicos.generaClave()}`

      // const dbRef = ref(getDatabase());
      const citas_dia_ans = await this._citas.consulta_citas_dia(`Citas/${citas_dia}`)
      // console.log(citas_dia_ans);
      // const arreglo_citas_dias_ans = this._publicos.crearArreglo2(citas_dia_ans)
      // console.log(arreglo_citas_dias_ans);
      
      const arreglo_citas_dias_ans = [
        "09:00",
        "09:10",
        "09:20",
        "09:30",
        "09:40",
        "09:50",
        "12:20",
        "12:30",
        "12:40",
        "12:50",
        "13:00",
        "13:10",
        "13:20",
        "13:30",
        "13:40",
        "13:50",
        "14:00",
        "17:10",
        "17:30",
        "17:40",
        "17:50",
        "18:00",
        "18:20"
    ]
    let horarios_libres = []
      if (sucursal && sucursal==='-N2glF34lV3Gj0bQyEWK') {
        if (numeroDia <=5 ) {
          horarios_libres = this.horarios[sucursal]['lunesViernes']
        }else{
          horarios_libres = this.horarios[sucursal]['sabado']
        }
      }else if (sucursal && sucursal !=='-N2glF34lV3Gj0bQyEWK') {
        if (numeroDia <=5 ) {
          horarios_libres = this.horarios[sucursal]['lunesViernes']
        }else{
          horarios_libres = this.horarios[sucursal]['sabado']
        }
      }

      const diferencias = encontrarDiferencias(arreglo_citas_dias_ans, horarios_libres)
      
      this.horarios_show = diferencias
      

      function encontrarDiferencias(arr1, arr2) {
        const set1 = new Set(arr1);
        const set2 = new Set(arr2);
      
        const diferencias1 = [...arr1.filter((item) => !set2.has(item))];
        const diferencias2 = [...arr2.filter((item) => !set1.has(item))];
      
        return [...diferencias1, ...diferencias2];
      }

      // const sucursal = this.citaForm.get('cliente').value;
      
    }
  }
  validarCampo(campo: string){
    return this.citaForm.get(campo).invalid && this.citaForm.get(campo).touched
  }
  guardarCita() {

    const info_get = this._publicos.getRawValue(this.citaForm)
    const campos= [
      'cliente',
      'vehiculo',
      'correo',
      'dia',
      'horario',
      'servicio',
      'comentario',
      'sucursal',
    ]

    // 'cotizacion_utiliza',
    // 'recoleccion',
    const campos_obligatorios= [
      ...campos,
      'id_cotizacion',
      'direccion',
      'sucursal',
    ]
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(info_get,campos )

    console.log(info_get);

    // const updates = {};
    //   updates[`Citas/${cita_search}/${this._publicos.generaClave()}`] = {
    //     username: 'aaaa',
    //     email: 'email',
    //     profile_picture : 'imageUrl'
    //   };
    //   update(ref(db), updates).then(()=>{
    //     console.log('finalizo');
    //   })
    //   .catch(err=>{
    //     console.log(err);
    //   })

    // const fecha = formatearFecha(new Date(), false)
    const fecha_ruta = this.ruta_guardar_cita(new Date())
    // console.log(fecha);
    console.log(fecha_ruta);

    
    
    // function formatearFecha(fecha_get,simbolo:boolean,symbol?) {
    //   let fecha = new Date(fecha_get)
    //   const dia = fecha.getDate().toString().padStart(2, '0');
    //   const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    //   const anio = fecha.getFullYear().toString();
    //   if(!symbol) symbol= '/'
    //   return (simbolo) ? `${dia}${symbol}${mes}${symbol}${anio}` : `${dia}${mes}${anio}`;
    // }
   

    this.faltante_s = faltante_s
    if (!ok) return

    return

    }
  
  ConfirmaCita(){
   
    
  }
  ruta_guardar_cita(fecha_get) {
    let fecha = new Date(fecha_get)
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear().toString();
    
    return `${anio}/${mes}/${dia}`
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
  
  
}
