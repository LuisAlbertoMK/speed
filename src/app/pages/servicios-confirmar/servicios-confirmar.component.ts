import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, ref, update } from 'firebase/database';
import SignaturePad from 'signature_pad';

import { EmailsService } from 'src/app/services/emails.service';
import Swal from 'sweetalert2';

import { animate, state, style, transition, trigger } from '@angular/animations';


import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { ClientesService } from '../../services/clientes.service';
import { ServiciosService } from '../../services/servicios.service';
import { SucursalesService } from '../../services/sucursales.service';

import html2canvas from 'html2canvas';
import { FileItem } from 'src/app/models/FileItem.model';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { UploadPDFService } from '../../services/upload-pdf.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-servicios-confirmar',
  templateUrl: './servicios-confirmar.component.html',
  styleUrls: ['./servicios-confirmar.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ServiciosConfirmarComponent implements OnInit, AfterViewInit {

  
  constructor(
    private router: Router, private rutaActiva: ActivatedRoute, 
    private _clientes:ClientesService, private _vehiculos: VehiculosService, private _cotizaciones: CotizacionesService,
    private _sucursales: SucursalesService, private _campos: CamposSystemService,
    private _mail:EmailsService, private _publicos:ServiciosPublicosService, 
    private _servicios: ServiciosService, private _security:EncriptadoService,private _pdfRecepcion: PdfRecepcionService,
    private _pdf: UploadPDFService, private _cotizacion: CotizacionService) { }


  @HostListener('dragover',['$event'])
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter()
  
  numeroDias: number = null
  _rol:string =''; _sucursal:string ='';
  // listaSucursales_arr =[]
  //TODO: aqui la informacion que es nueva

  sucursales_array  =   [ ...this._sucursales.lista_en_duro_sucursales]
  camposCliente     =   [ ...this._clientes.camposCliente_show ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_ ]
  // camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce ]
  // formasPago        =   [ ...this._cotizaciones.formasPago ]
  coloresPluma      =   [ ...this._campos.coloresPluma ]
  detalles_rayar    =   [...this._servicios.detalles_rayar]
  checkList         =   [...this._servicios.checkList]
  
  paquete: string = this._campos.paquete
  refaccion: string = this._campos.refaccion
  mo: string = this._campos.mo
  miniColumnas:number = this._campos.miniColumnas

  infoConfirmar= {
    cliente:'', data_cliente:{}, vehiculo:'', data_vehiculo:{},sucursal:'', data_sucursal:{}, reporte:{}, no_os:'', dataFacturacion: {},observaciones:'',
    checkList:[], vehiculos:[], elementos:[], iva:true, formaPago:'1', margen: 25, personalizados: [],
    detalles:[],diasEntrega: 0, fecha_promesa: '', firma_cliente:null, pathPDF:'', status:null, diasSucursal:0,
    fecha_recibido:'', notifico:true,servicio:'1', tecnico:'', showNameTecnico: '', descuento:0
  }

  sinDetalles: boolean = false
  kilometraje:number =0; diasEntrega:number = null

  
  colorPluma:string = '#010101'

  nombre:string //nombre de la imagen
  context!: CanvasRenderingContext2D;
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef;
  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef;
  //trabajar con los archivos en dropzone
  files: File[] = []
  archivos: FileItem[]=[]
  archTemp:any;

  //acciones con la camara
  cameraStart:boolean = false
  nombres_cameras = []
  camera_select:string = null
  camaraTrasera:boolean = true
  foto_tomada = null
  camaraVuelta = true
  stream:any
  fotografias:boolean = false;
  sizeScreen = {w:0,h:0}

  ///check list
  
  rangeFechaEntrega = new FormGroup({
    start: new FormControl(new Date),
    end: new FormControl(new Date),
  });
  fechas_get = {start: new Date(), end: new Date()}

  validaciones: string = null

   // tabla
   dataSource = new MatTableDataSource(); //elementos
   elementos = ['nombre','cantidad','sobrescrito','precio']; //elementos
   columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
   expandedElement: any | null; //elementos
   @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
   @ViewChild('elements') sort: MatSort //elementos

  @ViewChild('firmaDigital',{static:true}) signatureElement:any; SignaturePad:any;

  idPaqueteEditar: number
  idPaqueteEditarBoolean: boolean = false

  camposGuardar = [...this._servicios.camposGuardar]

  datCliente:any
  cliente:string = null

  extra:string
  modeloVehiculo:string = null
  vehiculoData:string = null

  clienteId:string = null
  observaciones:string = null
  //TODO: aqui la informacion que es nueva
  enrutamiento = {cliente:null, sucursal:null, cotizacion:null, tipo:null, anterior:null, vehiculo:null, recepcion:null, nueva:true}
  ParamsGet:any = {}
  
  faltante_s

  reporte_totales = {
    mo:0,
    refacciones:0,
    refacciones_v:0,
    subtotal:0,
    iva:0,
    descuento:0,
    total:0,
    meses:0,
    ub:0,
  }
  editar_cliente:boolean = true

  modelo:string
  ngOnInit(): void {
    this.rol()
    
  }
  ngAfterViewInit() {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  
  regresar(){
    this.router.navigate([`/${this.enrutamiento.anterior}`], { 
      queryParams: this.enrutamiento
    });
  }
  async rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal
    this.infoConfirmar.checkList = this.checkList
    this.infoConfirmar.detalles = this.detalles_rayar
    this.rutaActiva.queryParams.subscribe((params:any) => {
     this.enrutamiento = params
     this.acciones()
    });
    this.cambiaTodosCheckA(true)
  }
 

  async acciones(){
    console.log(this.enrutamiento);
    const {cotizacion, recepcion, cliente, vehiculo} = this.enrutamiento
    const vehiculos = await this._publicos.revisar_cache('vehiculos')
    const clientes = await this._publicos.revisar_cache('clientes')

    if (cotizacion) {
      const cotizaciones = await this._publicos.revisar_cache('cotizaciones')
      
      const campos_recupera_cotizacion = ["cliente","elementos","formaPago","iva","margen","servicio","sucursal","vehiculo","data_cliente","data_vehiculo","data_sucursal","reporte"]
      if(cotizaciones[cotizacion]){
        const cotizacion_completa = this._publicos.asigna_datos_cotizaciones(
          {bruto: [cotizaciones[cotizacion]], clientes, vehiculos}
        )
        console.log(cotizacion_completa);
        const data_cotizacion = this._publicos.crear_new_object(cotizacion_completa[0])
        // console.log(Object.keys(cotizacion_completa[0]));
        campos_recupera_cotizacion.forEach(campo=>{
          if (data_cotizacion[campo]) {
            this.infoConfirmar[campo] = data_cotizacion[campo]
          }
        })
        this.asignar_nuevos_elementos(data_cotizacion.elementos)
        this.extra = data_cotizacion.vehiculo
      }
    }else if(recepcion){
      const recepciones = await this._publicos.revisar_cache('recepciones')
      console.log(recepcion);
      if(recepciones[recepcion]){
        const campos_recupera_recepcion = ["cliente","elementos","formaPago","id","iva","margen","servicio","status","sucursal","vehiculo","data_cliente","data_vehiculo","data_sucursal"]
        const recepcion_completa = this._publicos.asigna_datos_cotizaciones(
          {bruto: [recepciones[recepcion]], clientes, vehiculos}
        )
        // console.log(Object.keys(recepcion_completa[0]));
        const data_cotizacion = this._publicos.crear_new_object(recepcion_completa[0])
        console.log(data_cotizacion);
        
        campos_recupera_recepcion.forEach(campo=>{
          if (data_cotizacion[campo]) {
            this.infoConfirmar[campo] = data_cotizacion[campo]
          }
        })
        this.asignar_nuevos_elementos(data_cotizacion.elementos)
        this.extra = data_cotizacion.vehiculo
      }
    }else if(cliente){
      // const clientes = await this._publicos.revisar_cache('clientes')
      this.infoConfirmar.cliente = cliente
      const data_cliente_new = this._publicos.crear_new_object(clientes[cliente])
      data_cliente_new.id = cliente
      this.infoConfirmar.data_cliente = data_cliente_new
      this.infoConfirmar.sucursal = data_cliente_new.sucursal
    }else if(vehiculo){
      // const clientes = await this._publicos.revisar_cache('clientes')
      // const vehiculos = await this._publicos.revisar_cache('vehiculos')
      const data_vehiculo = this._publicos.crear_new_object(vehiculos[vehiculo])
      const data_cliente_new = this._publicos.crear_new_object(clientes[data_vehiculo.cliente])
      data_cliente_new.id = data_vehiculo.cliente
      this.infoConfirmar.data_cliente = data_cliente_new
      this.infoConfirmar.cliente = data_vehiculo.cliente
      this.extra = vehiculo
      this.infoConfirmar.sucursal = data_cliente_new.sucursal
      this.infoConfirmar.vehiculo = vehiculo
    }
    this.realizaOperaciones()
    this.vigila_vehiculos_cliente()

  }

  async vigila_vehiculos_cliente(){
    const {cliente: id_cliente} = this.infoConfirmar
    const vehiculos_object = await this._publicos.revisar_cache('vehiculos')
    const vehiculos_arr = this._publicos.crearArreglo2(vehiculos_object)
    const vehiculos_cliente = this._publicos.filtra_campo(vehiculos_arr,'cliente',id_cliente)
    this.infoConfirmar.vehiculos = vehiculos_cliente
    if (this.extra) {
      this.infoConfirmar.data_vehiculo = this.infoConfirmar.vehiculos.find(v=>v.id === this.extra)
    }
  }

  verificarInfoVehiculos(){
      this.infoConfirmar.vehiculo = this.extra
      const info = this.infoConfirmar.vehiculos.find(v=>v.id === this.extra)
      this.infoConfirmar.data_vehiculo = (info) ? info : {}
      this._publicos.cerrar_modal('modal-vehiculo')
  }

  vehiculo(IDVehiculo){
    this.extra = IDVehiculo
    this.infoConfirmar.vehiculo = IDVehiculo
    this.vigila_vehiculos_cliente()
    if (!IDVehiculo) {
      this.modelo = null
    }
    
  } 

  vehiculo_registrado(event){
    if (event) {
     this.extra = event
     const { cliente, sucursal } = this.enrutamiento

     this.vigila_vehiculos_cliente()
   }
  }
  agrega_principal(event){
    let nuevos = [...this.infoConfirmar.elementos]
    const {id} = event
    if (id) {
      nuevos.push(event)
      this.asignar_nuevos_elementos(nuevos)
    }
  }
  eliminaElemento(data){
    const { index:index_elimina } = data
    let nuevos = [...this.infoConfirmar.elementos]
    nuevos = nuevos.filter((elemento, index) => index !== index_elimina);
    this.asignar_nuevos_elementos(nuevos)
  }
  editar(donde:string , data , cantidad){
    const nueva_cantidad = parseFloat(cantidad)
    const { index:index_editar } = data

    let nuevos = [...this.infoConfirmar.elementos]
    nuevos[index_editar][donde] = nueva_cantidad
    this.asignar_nuevos_elementos(nuevos)
  }
  editar_subelemento_paquete(donde:string ,data , item ,cantidad){
    const nueva_cantidad = parseFloat(cantidad)
    const { index:index_editar } = data
    const { index:index_editar_subelemento } = item
   
    let nuevos = [...this.infoConfirmar.elementos]
    let nuevos_internos = nuevos[index_editar].elementos

    nuevos_internos[index_editar_subelemento][donde] = nueva_cantidad

    nuevos[index_editar].elementos = nuevos_internos

    this.asignar_nuevos_elementos(nuevos)
  }

  eliminar_subelemento_paquete(data,item){

    const { index:index_editar } = data
    const { index:index_editar_subelemento } = item

    let nuevos = [...this.infoConfirmar.elementos]
    let nuevos_internos = nuevos[index_editar].elementos

    nuevos_internos = nuevos_internos.filter((elemento, index) => index !== index_editar_subelemento);

    nuevos[index_editar].elementos = nuevos_internos

    this.asignar_nuevos_elementos(nuevos)
  }

  asignar_nuevos_elementos(nuevos:any[]){
    let indexados = nuevos.map((elemento, index)=> {
      const {cantidad, precio, costo} = elemento
      elemento.total = cantidad * ( (costo>0) ? costo : precio)
      elemento.index = index
      return elemento
    })
    this.infoConfirmar.elementos = indexados
    this.realizaOperaciones()
  }
  cambiaAprobado(index, aprobado){
    setTimeout(() => {
      this.infoConfirmar.elementos[index].aprobado = aprobado
      this.infoConfirmar.reporte = this._publicos.realizarOperaciones_2(this.infoConfirmar).reporte
    }, 100);
  }
  cambiarCheck(index, status){
    setTimeout(() => {
      this.infoConfirmar.checkList[index].status = status
    }, 100)
  }
  cambiaTodosCheckA(status){
    setTimeout(() => {
      this.infoConfirmar.detalles.map(c=>{
        c.status = status
      })
    },100)
  }
 
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    const fecha = event.value
 
    const startI = this._publicos.resetearHoras(fecha['_d'])
    const hoy = this._publicos.resetearHoras(new Date())
    // const dias =
    const diasEntrega  = this._publicos.calcularDiasEntrega(hoy,startI)
    this.infoConfirmar.diasEntrega = diasEntrega
    const sumaDias = this._publicos.sumarRestarDiasFecha(new Date(), diasEntrega).toString()
    this.infoConfirmar.fecha_promesa = this._publicos.retorna_fechas_hora({fechaString: sumaDias}).toString_completa
  }

 


 


  realizaOperaciones(){
    const { elementos, margen, iva, descuento, formaPago} = this.infoConfirmar
    const reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})

    this.infoConfirmar.reporte = reporte
    this.infoConfirmar.elementos = elementos
    this.dataSource.data = elementos
    this.newPagination()

  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }

  ///cambiar status de check
  cambiarStatusCheckList(index, status){
    this.infoConfirmar.checkList[index].status = status
  }
  ///acciones con el canvas
  async principal(){
    // const mainCanvas = document.getElementById("")
    this.limpiarCanvas()
    // this.disableBtnGuardarIMG = false
    // this.contieneIMG = false
    const mainCanvas = <HTMLCanvasElement> document.getElementById('main-canvas');
    // console.log(mainCanvas);
    if (!mainCanvas) return
    
    const context = mainCanvas.getContext("2d")
    var miimagen = new Image()
    miimagen.src = '../../../assets/fondoVehiculo.png'
    context.drawImage(miimagen,0,0,w(),h())
    function w() {return mainCanvas.width;}
    function h() {return  mainCanvas.height;}
    miimagen.onload = function(){
      context.drawImage(miimagen,0,0,w(),h())
    }
    let initialX; let initialY; let initialTX; let initialTY; let points =[]
    const dibujar = (cursorX, cursorY)=>{
      context.beginPath()
      context.moveTo(initialX,initialY)
      context.lineWidth = 3
      context.strokeStyle =`${this.colorPluma}`
      context.lineCap = "round"
      context.lineJoin = "round"
      context.lineTo(cursorX, cursorY)
      context.stroke()
      initialX = cursorX
      initialY = cursorY
    }
    const mouseDown =(evt)=>{      
      // this.contieneIMG = true
      initialX = evt.offsetX
      initialY = evt.offsetY
      dibujar(initialX,initialY)
      mainCanvas.addEventListener("mousemove", mouseMoving);      
    }
    const mouseMoving = (evt)=>{
      dibujar(evt.offsetX, evt.offsetY)
    }
    
    const mouseUp = ()=>{
      mainCanvas.removeEventListener("mousemove",mouseMoving)
    }
    mainCanvas.addEventListener('mousedown',mouseDown)
    mainCanvas.addEventListener('mouseup',mouseUp)
    

    ///eventos de touch
    const touchDown =(evt)=>{ 
      // this.contieneIMG = true
      const rect =  mainCanvas.getBoundingClientRect()
      const prevPos = {
        x: evt.targetTouches[0].clientX - rect.left,
        y: evt.targetTouches[0].clientY - rect.top,
      }
      initialTX = prevPos.x
      initialTY = prevPos.y
      // dibujartouch(initialTX,initialTY)
      mainCanvas.addEventListener("touchmove", touchMoving);
    }
    const touchMoving = (evt)=>{
      const rect =  mainCanvas.getBoundingClientRect()
      const prevPos = {
        x: evt.targetTouches[0].clientX - rect.left,
        y: evt.targetTouches[0].clientY - rect.top,
      }
      initialTX = prevPos.x
      initialTY = prevPos.y
      // dibujartouch(initialTX, initialTY )
      writeSingle(prevPos)

    }
    const writeSingle = (prevPos, emit = true)=>{
      points.push(prevPos)
      if (points.length>3) {
        const prevPost = points[points.length  -1]
        const currentPos = points[points.length  -2]
        drawInCanvas(prevPos,currentPos)
      }
    }
    const drawInCanvas = (prevPos:any,currentPos:any)=>{
        if (!context) {
          return
        }
        context.beginPath()
        if(prevPos){
          context.moveTo(prevPos.x,prevPos.y)
          context.lineWidth = 3
          context.strokeStyle =`${this.colorPluma}`
          context.lineCap = "round"
          context.lineJoin = "round"
          context.lineTo(currentPos.x,currentPos.y)
          context.stroke()
        }
    }
    const touchUp = ()=>{    
      points =[]  
      mainCanvas.removeEventListener("touchmove",touchMoving)
    }
    mainCanvas.addEventListener('touchstart',touchDown)
    mainCanvas.addEventListener('touchend',touchUp)

  }
  limpiarCanvas() {
    const mainCanvas = <HTMLCanvasElement> document.getElementById('main-canvas');
    if (!mainCanvas) return
    const context = mainCanvas.getContext("2d")
    context.clearRect(0,0,700,500);
  }

  primeraAccion(){
    Swal.fire(
      {
        icon: 'info',
        title: 'Generando...',
        text: 'Espere porfavor',
        // footer: '<a href="">Why do I have this issue?</a>'
        allowOutsideClick: false,
        showConfirmButton: false
      }
    )
    Swal.isLoading()
    setTimeout(()=>{
      this.guardarImagenCanvas()
    },100)
  }
  guardarImagenCanvas(){
    html2canvas(document.querySelector("#main-canvas")).then((canvas) => {
      const datURL = canvas.toDataURL()
      const blob = this.UrltoBlob(datURL)
      
      const file = new File([blob], `detallespersonalizado.png`,{
        type: blob.type,
      })
      // this.blobDetallesPersonalizado = blob
      this.archTemp = {
        archivo: blob,
        nombreArchivo: 'detallespersonalizado.png',
        estaSubiendo: false,
        progreso: 0
      };
      
      this.nombre = 'detallespersonalizado.png';
      
      const existe = this.archivos.some(a => a.nombreArchivo === 'detallespersonalizado' || a.nombreArchivo === 'detallespersonalizado.png');
      
      if (existe) {
        const archIndex = this.archivos.findIndex(a => a.nombreArchivo === 'detallespersonalizado' || a.nombreArchivo === 'detallespersonalizado.png');
        this.archivos[archIndex] = this.archTemp;
      
        const fileIndex = this.files.findIndex(f => f.name === 'detallespersonalizado.png');
        this.files[fileIndex] = file;
      } else {
        this.archivos.push(this.archTemp);
        this.files.push(file);
      }
      Swal.close();
    });
   
   }
  ///accciones con el drop zone
  onSelect(event) {
    this.archivos =[]
    this.files.push(...event.addedFiles);
    for(const f of this.files) {
      this.archTemp={
        archivo:f,
        nombreArchivo:f.name,
        estaSubiendo:false,
        progreso:0
      }
      this.nombre=f.name
      this.archivos.push(this.archTemp)
    }
  }
  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1)
    this.archivos = []
    for(const f of this.files) {
      this.archTemp={
        archivo:f,
        nombreArchivo:f.name,
        estaSubiendo:false,
        progreso:0
      }
      this.nombre=f.name
      this.archivos.push(this.archTemp)
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

  public onDragEnter(event:any){
    this.mouseSobre.emit(true)
  }
  //acciones con la camara
  async getCamera(valor){
     
    const stream = this.videoContainer.nativeElement
 
    if(navigator.mediaDevices.getUserMedia){
      let nueva = {}
      this.camaraVuelta = valor
      if (this.camaraVuelta) {
        
        let op = {audio: false, video: { facingMode: {exact: "environment"} }}

        nueva = op
       
        // this.camaraTrasera = await navigator.mediaDevices.getUserMedia(nueva).then(o=>{ return true}).catch((a)=>{return false})
        await navigator.mediaDevices.getUserMedia(nueva)
        .then((str)=>{
          this.cameraStart = true
          stream.srcObject = str
          stream.play()
          this.stream = stream
        })
        .catch((error)=>{
                  // console.log(error);
            this.getCamera(false)

                  // this._publicos.mensajeIncorrecto('error de camara')
                  // camaraTrasera
              })
      }else{
        // if (!this.camaraTrasera) {
          nueva =  {audio: false, video: { facingMode: "user" }}
        // }
        await navigator.mediaDevices.getUserMedia(nueva)
        .then((str)=>{
          this.cameraStart = true
          stream.srcObject = str
          stream.play()
          this.stream = stream
        })
        .catch((error)=>{
          // console.log(error);
          this._publicos.mensajeCorrecto('error de camara', 0)
          // camaraTrasera
      })
      }
    }
  
  }
  async cameraOFF(){
    this.foto_tomada = ''
    this.cameraStart = false
    this.cancelarFoto()
  }
  sacarFoto(){
    const canvas = this.myCanvas.nativeElement
    const ctx = canvas.getContext('2d')
    ctx.drawImage(this.stream, 0,0,640,480);
    const dataURL = canvas.toDataURL("image/png");
    // console.log(dataURL);
    this.foto_tomada = dataURL
  }
  guardaImagen(){
    if (!this.foto_tomada) return
    const canvas = this.myCanvas.nativeElement
    const dataURL = canvas.toDataURL("image/png");
    const blob = this.UrltoBlob(dataURL)
    const name_1 = new Date().getTime()
    const file = new File([blob], `foto_${name_1}.png`,{
      type: blob.type,
    })
    this.files.push(file)
    this.foto_tomada = ''
    this.archivos = []
    for(const f of this.files) {
      this.archTemp={
        archivo:f,
        nombreArchivo:f.name,
        estaSubiendo:false,
        progreso:0
      }
      this.nombre=f.name
      this.archivos.push(this.archTemp)
    }
  
    setTimeout(() => {
      this.cancelarFoto()
      // this.getCamera()
    }, 200);
  }
  UrltoBlob(dataURL:any){    
    const partes = dataURL.split(';base64,')
    const contentType = partes[0].split(':')[1]
    const raw = window.atob(partes[1])
    const rawL = raw.length
    const array = new Uint8Array(rawL)
    for(let i=0; i<rawL;i++){
      array[i]= raw.charCodeAt(i)
    }    
    return new Blob([array],{type: contentType})
  }
  cancelarFoto(){
    // this.getCamera()

    if (!this.cameraStart) {
      const stream = this.videoContainer.nativeElement 
      stream.srcObject.getTracks()[0].stop()
      return
    }

    this.foto_tomada = ''
    setTimeout(() => {
      this.dimensiones()
    }, 200);
  }
  async dimensiones(){
    
    var panelIzquierda = document.getElementById("divCamera")
    // var rect = panelIzquierda.getBoundingClientRect();

    // const screen = await window.screen
    const size_max_w = 720
    const size_max_h = 600
    const size_min_w = 480
    const size_min_h = 320
    let ancho = size_min_w, alto = size_min_h

    // console.log(panelIzquierda.clientHeight)
    const ancho_contenedor = panelIzquierda.clientHeight
    if ( ancho_contenedor > size_min_w  && ancho_contenedor < size_max_w ) ancho = ancho_contenedor
    const alto_contenedor = panelIzquierda.offsetHeight
    if ( alto_contenedor > size_min_h  && alto_contenedor < size_max_h )  alto = alto_contenedor 
    // console.log('aqui');
    // console.log('ancho',ancho);
    // console.log('alto',alto);
    this.sizeScreen.h = alto 
    this.sizeScreen.w = ancho
    // console.log();
    
    this.getCamera(true)
  }
  lista_cameras(){
    this.fotografias = true
    this.nombres_cameras = []
    navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      // console.log(devices);
      const filterCameras = devices.filter(d=>d['kind'] === 'videoinput')
      if (filterCameras.length === 1) {
        const temp = {
          id: filterCameras[0].deviceId,
          label: filterCameras[0].label,
          kind: filterCameras[0].kind,
          type: 'InputDeviceInfo'
        }
        this.nombres_cameras.push(temp)
        this.camera_select = filterCameras[0].deviceId
        
      }
      devices.map(device=>{
        if (device.kind === 'videoinput') {
          const temp = {
            id: device.deviceId,
            label: device.label,
            kind: device.kind,
            type: 'InputDeviceInfo'
          }
          this.nombres_cameras.push(temp)
        }
      })
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
    });
  }
  //acciones con la firma
  limpiarFirma(){
    this.SignaturePad.clear()
    this.infoConfirmar.firma_cliente = null
  }
  firmar(){
    const u = this.SignaturePad.toDataURL()
    if (!this.SignaturePad.isEmpty()) {
      this.infoConfirmar.firma_cliente = u
    }else{
      this.infoConfirmar.firma_cliente = null
      this._publicos.swalToast('La firma no puede estar vacia',0)
    }
  }
  infoTecnico(event){
    if (!event) {
      this._publicos.swalToast('intenta de nuevo',0)
    }else{
      this._publicos.mensaje_pregunta('Seguro que es el tecnico de la o.s?').then(({respuesta})=>{
        if (respuesta) {
          this.infoConfirmar.tecnico = event.id
          this.infoConfirmar.showNameTecnico = event.usuario
        }
      })
    }
  }
  async infoCliente(cliente){

    // if (cliente) {
    //   const {id, sucursal} = cliente
    //   this.infoConfirmar.cliente = id
    //   this.infoConfirmar.data_cliente = cliente
    //   this.infoConfirmar.sucursal = sucursal
    //   this.infoConfirmar.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
    //   this.extra = null
    //   this.infoConfirmar.data_vehiculo = {}
    //   this.infoConfirmar.vehiculo = null
    //   // this.vigila_vehiculos_cliente()
    // }
    if (cliente) {
      const {id, sucursal} = cliente
      this.infoConfirmar.cliente = id
      this.infoConfirmar.data_cliente = cliente
      this.infoConfirmar.sucursal = sucursal
      this.infoConfirmar.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
      this.extra = null
      this.infoConfirmar.data_vehiculo = {}
      this.infoConfirmar.vehiculo = null
      this.vigila_vehiculos_cliente()
    }
  }
  async continuar(){

    


    // if (this.infoConfirmar.checkList) {
      const checklist_campos = this.infoConfirmar.checkList.some(item => {
        // Comprueba si 'status' no existe o es null o es una cadena vacía
        return !item.status || typeof item.status !== 'string' || item.status.trim() === '';
      });
      if (checklist_campos) {
        // console.log('Al menos un campo status está vacío o no es una cadena.');
        this._publicos.swalToast('el check list necesita ser revisado',0)
        return
      }

    if (!this.infoConfirmar.data_cliente['correo']) {
      this._publicos.swalToast(`El cliente debe tener correo para poder crear la O.S`, 0)
      return
    }
    const obligatorios = ['cliente','sucursal','elementos','vehiculo','margen','formaPago','firma_cliente','fecha_promesa','servicio']
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(this.infoConfirmar, obligatorios)
    
    this.faltante_s = faltante_s
    if (!ok) return

    const {cliente, sucursal, vehiculo} = this.infoConfirmar

    const recepciones:any[] = await this._publicos.revisar_cache('recepciones')//this._servicios.consulta_recepciones_cliente_satus({ruta: `recepciones`})
    const recepciones_existentes = this._publicos.crearArreglo2(recepciones)
    
    const verificacion = recepciones_existentes
    .filter(v=>v.vehiculo === vehiculo)
    .map(r=>{
      return r.status
    })
    const status_encontrado = verificacion.includes('entregado');
    console.log(status_encontrado);
    
    if (status_encontrado){
      this._publicos.mensajeSwal('El vehiculo cuenta con orden abierta ',0, true ,`Cerrar / modificar orden del vehiculo que se encuentra en la sucursal`)
      return
    } 
    
    this.infoConfirmar.personalizados = this.archivos
    this.infoConfirmar.personalizados = []
    let arregloPer = []
    
    this.archivos.forEach((a,index)=>{
      // console.log(descargar(a.archivo));
      const nuevonombre = a.nombreArchivo.split('.').slice(0, -1).join('')
      const asigando = nuevonombre.replace(/ /g, '').slice(0, 10)
      const aqui = `${asigando.toLowerCase()}${index}`
      var file    = a.archivo
      // var reader  = new FileReader();
      blobToBase64(file).then((ans)=>{
        arregloPer.push(Object({ nombre: aqui, data64: ans }))
      })
      function blobToBase64(blob) {
        return new Promise((resolve, _) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      }
    })

    this.infoConfirmar.personalizados = arregloPer
    this.infoConfirmar.observaciones = this.observaciones || ''
    this.infoConfirmar.fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: new Date()}).toString_completa
    

    this.infoConfirmar.data_vehiculo = this._vehiculos.verificaInfo_vehiculo(this.infoConfirmar.data_vehiculo)
    this._pdfRecepcion.obtenerImege(this.infoConfirmar).then((pdfReturn:any) => {
      const pdfDocGenerator = pdfMake.createPdf(pdfReturn);

      const {sucursal, cliente,vehiculo, elementos, reporte, data_sucursal, data_cliente, data_vehiculo} = this.infoConfirmar

      const nueva = {
        mo: reporte['mo'],
        refacciones: reporte['refacciones_v'],
        sobrescrito: reporte['sobrescrito'],
        subtotal: reporte['subtotal'],
        iva: reporte['iva'],
        total: reporte['total'],
      }
      this._servicios.generateOSNumber(this.infoConfirmar,this._rol).then((no_os)=>{
        const dataMail = {
          correos: this._publicos.dataCorreo(data_sucursal, data_cliente),
          no_os,
          filename : `${no_os}.pdf`,
          cliente: data_cliente,
          vehiculo:data_vehiculo,
          arregloString: this._publicos.obtenerNombresElementos(elementos),
          desgloce: this._publicos.construyeDesgloceEmail(nueva)
        }
        this.infoConfirmar.no_os = no_os
        // console.log(dataMail);
        // console.log(this.infoConfirmar);
        Swal.fire({
          title: 'Opciones de recepcion',
          html:`<strong class='text-danger'>Se recomienda visualizar pdf antes de enviar</strong>`,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Previsualizar PDF recepción',
          denyButtonText: `Guardar y enviar correo`,
          cancelButtonText:`cancelar`,
        }).then((result) => {
          // si se confirma previsualizacion genera pdf en nueva ventana del navegador
          if (result.isConfirmed) {
            
            pdfDocGenerator.open()
            // console.log(this.infoConfirmar.personalizados);
          } else if (result.isDenied) {
            Swal.fire({
              title: 'Espere por favor...',
              showConfirmButton: false,
              icon:'info',
              allowOutsideClick: false
            })
            
            Swal.isLoading()
            // console.log(this.infoConfirmar.personalizados);            
            // si presiono guardar y enviar obtenemos el blob del pdf para poder subirlo a firebasecloud
            pdfDocGenerator.getBlob(async (blob) => {
              //una vez tenemos el blob realizamos la peticion de subida del pdf
              this._pdf.uploadRecepcion(blob, dataMail.filename).then((ans)=>{
                let intervalo = setInterval(()=>{
                  // console.log(ans);
                  if (ans.ruta) {
                    clearInterval(intervalo)
                    this.infoConfirmar.pathPDF = ans.ruta
                    dataMail['pathPDF'] = ans.ruta
                    const updates = {}

                    this.infoConfirmar.status = 'recibido'
                    this.infoConfirmar.diasSucursal = 0
                    
                    this.infoConfirmar.notifico = true

                    const clave =this._publicos.generaClave()
                    let guardar_ = this._publicos.nuevaRecuperacionData(this.infoConfirmar,this.camposGuardar)
                    guardar_.id = clave
                    guardar_.fullname = fullname(this.infoConfirmar.data_cliente)
                    guardar_.placas = placas(this.infoConfirmar.data_vehiculo)
                    
                    function fullname(data_cliente){
                      const {nombre, apellidos} = data_cliente
                      return `${nombre} ${apellidos}`.toUpperCase()
                    }
                    function placas(data_vehiculo){
                      const {placas} = data_vehiculo
                      return `${placas}`.toUpperCase()
                    }
                    guardar_.checkList = this._servicios.purifica_checklist(this.infoConfirmar.checkList)
                    guardar_.detalles =  this._servicios.purifica_detalles(this.infoConfirmar.detalles)
                    updates[`recepciones/${clave}`] = guardar_

                    this._mail.EmailRecepcion(dataMail)
                    // if (this.ParamsGet.tipo === 'cita') {
                    //   updates[`${this.ParamsGet.ruta}/status`] = 'concretada'
                    // }
                    update(ref(db), updates).then(()=>{
                      pdfDocGenerator.download(`Recepcion_${this.infoConfirmar.no_os}`)
                      Swal.close()
                      this.files = []
                      this.archivos = []
                      this.nombre = null
                      this.numeroDias = 0
                      // this.infoConfirmar= this._servicios.infoConfirmar
                      this.infoConfirmar = JSON.parse(JSON.stringify(this._servicios.infoConfirmar));

                      this.infoConfirmar.elementos = []
                      this.limpiarFirma()
                      this.realizaOperaciones()
                      

                      this.router.navigateByUrl('/servicios')
                    })
                  }
                },100)
              })
            })
          }
        })
      })
    })
  }

  async clientesInfo(event){
    const {uid, sucursal} = event
    if (uid) {

      this.infoConfirmar.cliente = uid
      this.infoConfirmar.data_cliente = event
      this.infoConfirmar.sucursal = sucursal
      this.infoConfirmar.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
      
      this.extra = null
      this.infoConfirmar.data_vehiculo = {}
      this.infoConfirmar.vehiculo = null
      
    }
  }


}
