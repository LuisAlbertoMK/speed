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
import Swal from 'sweetalert2';

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

    cotizaciones:any[]=[]

    hora_start = '00:00:01';
    hora_end = '23:59:59';
  
    horarios =  this._citas.horarios_citas

    faltantes_horarios:string
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
      // console.log(cliente);
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
    const vehiculos_object = await this._publicos.nueva_revision_cache('vehiculos')
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
      // dia: ['', Validators.required],
      cliente: ['', Validators.required],
      correo:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      sucursal: [sucursal, Validators.required],
      horario: ['', Validators.required],
      fecha: ['', [Validators.required]],
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
    
  }
  vigilaDia(){
    this.citaForm.get('fecha').valueChanges.subscribe((fecha: string) => {
      this.obtenerCitas_horarios()
    })
    this.citaForm.get('vehiculo').valueChanges.subscribe((vehiculo: string) => {
      this.obtenerCitas_horarios()
    })
    this.citaForm.get('servicio').valueChanges.subscribe((servicio: string) => {
      this.obtenerCitas_horarios()
    })
    // this.citaForm.get('horario').valueChanges.subscribe((horario: string) => {
    //   if (horario) {
        
    //   }
    // })
    this.citaForm.get('cotizacion_utiliza').valueChanges.subscribe(async (cotizacion_utiliza: string) => {
      // console.log(cotizacion_utiliza);
      const cliente = this.citaForm.get('cliente').value;
      console.log(cliente);
      
      if (cotizacion_utiliza && cliente) {
          const cotizaciones = this._publicos.nueva_revision_cache('cotizaciones')
          const arreglo_cotizaciones = this._publicos.crearArreglo2(cotizaciones)
          const filtro_cotizaciones_cliente = this._publicos.filtra_informacion(arreglo_cotizaciones,'cliente',cliente)
          const ordenedas = this._publicos.ordenamiento_fechas_x_campo(filtro_cotizaciones_cliente,'no_cotizacion',false)
          console.log(ordenedas);
          this.cotizaciones = ordenedas
      }else{
        this.cotizaciones = []
      }
    })
    this.citaForm.get('cliente').valueChanges.subscribe(async (cliente: string) => {
      this.obtenerCitas_horarios()
      const cotizacion_utiliza = this.citaForm.get('cotizacion_utiliza').value;
      if (cotizacion_utiliza && cliente) {
        const cotizaciones = this._publicos.nueva_revision_cache('cotizaciones')
          // const arreglo_cotizaciones = this._publicos.crearArreglo2(cotizaciones)
          const filtro_cotizaciones_cliente = this._publicos.filtrarObjetoPorPropiedad(cotizaciones,'cliente',cliente)
          const ordenedas = this._publicos.ordenamiento_fechas_x_campo(filtro_cotizaciones_cliente,'no_cotizacion',false)
          // console.log(ordenedas);
          this.cotizaciones = ordenedas
      }else{
        this.cotizaciones = []
      }
    })
    // this.myControl.valueChanges.subscribe(dia=>{
    //   console.log(dia);
    // })

  }
  obtenerCitas_horarios(){
    const data_form = this._publicos.getRawValue(this.citaForm)
    const {fecha, hora, sucursal, cliente, servicio, vehiculo} = data_form

    const citas = this._publicos.nueva_revision_cache('citas')
    const seleccionado = this._publicos.resetearHoras(new Date(fecha))
    console.log(citas);
    
    const apuntadores = ['cliente','sucursal','vehiculo', 'servicio','fecha']

    const {faltante_s} =this._publicos.realizavalidaciones_new(data_form, apuntadores)

    this.faltantes_horarios = faltante_s
    
    if (vehiculo && sucursal && servicio) {

      // const data_vehiculo = this.arr_vehiculos.find(v=>v.id === vehiculo)
      // const { placas } = data_vehiculo
      const filtrado_placas = this._publicos.filtrarObjetoPorPropiedad(citas, 'vehiculo', vehiculo)

      const nueva_fe = new Date(this._publicos.crear_new_object(seleccionado))

      const start = this._publicos.resetearHoras_horas(nueva_fe,this.hora_start)
      const end = this._publicos.resetearHoras_horas(seleccionado,this.hora_end)
      
      const filtrado_fechas = this._publicos.filtrarObjetoPorPropiedad_fecha(filtrado_placas, start, end)
      
      if (this._publicos.tiene_data(filtrado_fechas)) {
        this._publicos.mensajeSwal('El vehiculo ya cuenta cin cita',0,false, 'selecciona otro dia para tu cita!!')
      }else{
        const donde = (this._publicos.dia_string(fecha) === 'sáb') ? 'sabado' : 'lunesViernes'
        const nueva_sucursal = (sucursal === '-N2glF34lV3Gj0bQyEWK') ? '-N2glF34lV3Gj0bQyEWK' : 'otras'
        // const horarios_ocupados = ['09:10','10:00','11:50','15:20','16:40','17:50']
        const horarios_ocupados = this.regresa_horarios(this._publicos.crearArreglo(filtrado_fechas))
        
        const horariosValidos = [...new Set(this.horarios[nueva_sucursal][donde])]
        const horas_quitar = (servicio === '5') ? 3.5 : 2
          
        const limiteHoras = `${horariosValidos[ horariosValidos.length - 1 ]}:00`

        const limite_hoy = this._publicos.resetearHoras_horas(seleccionado,limiteHoras)

        const limite_permitido = this._publicos.obtenerHoraDeFecha(this._publicos.restarHorasAFecha(limite_hoy, horas_quitar))

        const limitePermitidoHora = this.parse_hora(seleccionado,limite_permitido)

        const mus = horariosValidos.filter(horario => this.parse_hora(seleccionado,horario) <= limitePermitidoHora);
        this.horarios_show = this._publicos.obtener_diferencias(mus, horarios_ocupados)
      }

    }
  }
  parse_hora(fecha?,hora?) {
    const fechaActual = (fecha) ?  new Date(fecha): new Date();
    let [horas, minutos, segundos] = hora ? hora.split(':') : [fechaActual.getHours(), fechaActual.getMinutes(), 0];
    
    return new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate(), horas, minutos, 0);
  }
  regresa_horarios(arreglo){
    let fechas = []
    arreglo.forEach(cita=>{
      const {fecha} = cita
      fechas.push(this.obtenerHoraCompleta(fecha))
    })
    return [...new Set(fechas)]
  }
  obtenerHoraCompleta(fecha) {
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    
    return `${horas}:${minutos}:${segundos}`;
  }
  async addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const start = this._publicos.crear_new_object(event.value)
    const  fecha = this._publicos.retorna_fechas_hora({fechaString: start.toString()}).toString
    this.citaForm.get('fecha').setValue(fecha)
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
    const recuperda = this._publicos.nuevaRecuperacionData(info_get,campos)

    this.faltante_s = faltante_s
    if (!ok) return

    
    const updates = {}
    // const data_cliente = this._publicos.crear_new_object( this.data_cliente )
    // updates[`Citas/${this._publicos.generaClave()}`] = recuperda
    console.log(updates);
    console.log();
    
    Swal.fire({
      title: 'Confirmar cita',
      html:`Desea confirmar el registro de cita?`,
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
      // cancelButtonText:`Cancelar`,
      allowOutsideClick: false,
      cancelButtonColor: '#5a5952'
    }).then((result) => {
      // si se confirma previsualizacion genera pdf en nueva ventana del navegador
      if (result.isConfirmed) {
        const updates = {}
        const clave = this._publicos.generaClave()
        updates[`citas/${clave}`] = this.purifica_data_cita(recuperda)
        const claves_encontradas = this._publicos.nueva_revision_cache('claves_citas')
        const valorNoDuplicado = [...new Set([...this._publicos.crearArreglo(claves_encontradas), clave])];
        updates['claves_citas'] = valorNoDuplicado
           update(ref(db), updates).then(()=>{
            this.citaForm.reset()
            this.inicioDetenerCita(false)
            this._publicos.mensajeSwal('se registro cita correctamente',1)
            this._security.guarda_informacion({nombre:'claves_citas', data: valorNoDuplicado})
          })
          .catch(err=>{
            console.log(err);
          })
        
      } else if (result.isDenied) {

      }
    })
    
    
    
      // update(ref(db), updates).then(()=>{
      //   this.citaForm.reset()
      //   this.inicioDetenerCita(false)
      //   this._publicos.mensajeSwal('se registro cita correctamente',1)
      // })
      // .catch(err=>{
      //   console.log(err);
      // })
  }
  purifica_data_cita(recuperda){

    const data_form = this._publicos.getRawValue(this.citaForm)
    const {fecha, horario, sucursal, cliente, servicio, vehiculo, comentario, id_cotizacion, recoleccion, direccion} = data_form

    const fechaa = this._publicos.resetearHoras_horas(new Date(fecha), `${horario}:00`) 

    const temp = {
      sucursal,
      cliente,
      servicio,
      vehiculo,
      comentario,
      fecha_recibido: this._publicos.retorna_fechas_hora({fechaString: fechaa.toString()}).toString
    }
    if (id_cotizacion) temp['id_cotizacion'] = id_cotizacion
    if (recoleccion) {
      temp['recoleccion'] = recoleccion; 
      temp['direccion'] = direccion
    }
    
    return temp
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
