import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { child, get, getDatabase, onValue, ref, update } from 'firebase/database';
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
import { UploadPDFService } from '../../services/upload-pdf.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { CamposSystemService } from '../../services/campos-system.service';
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
  ROL:string =''; SUCURSAL:string ='';
  // listaSucursales_arr =[]
  //TODO: aqui la informacion que es nueva

  sucursales_array  =   [ ...this._sucursales.lista_en_duro_sucursales]
  camposCliente     =   [ ...this._clientes.camposCliente_show ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_ ]
  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce ]
  formasPago        =   [ ...this._cotizaciones.formasPago ]
  coloresPluma      =   [ ...this._campos.coloresPluma ]
  detalles_rayar    =   [...this._servicios.detalles_rayar]
  checkList         =   [...this._servicios.checkList]
  
  paquete: string = this._campos.paquete
  refaccion: string = this._campos.refaccion
  mo: string = this._campos.mo
  miniColumnas:number = this._campos.miniColumnas

  infoConfirmar=
  {
    cliente:{}, vehiculo:{},sucursal:{}, reporte:{}, no_os:null, dataFacturacion: null,observaciones:null,
    checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:1, margen: 25, personalizados: [],
    detalles:[],diasEntrega: this.numeroDias, fecha_promesa: null, firma_cliente:null, pathPDF:'', status:null, diasSucursal:0,
    fecha_recibido:null, hora_recibido:null, notifico:true,servicio:null, tecnico:null, showNameTecnico: null
  }    
 
  
  

  sinDetalles: boolean = true
  kilometraje:number =1234; diasEntrega:number = null

  
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

  camposGuardar = []

  datCliente:any
  cliente:string = null

  extra:string
  modeloVehiculo:string = null
  vehiculoData:string = null

  clienteId:string = null
  observaciones:string = null
  //TODO: aqui la informacion que es nueva
  enrutamiento = {vehiculo:'', cliente:'', anterior:'', tipo:''}
  ParamsGet:any = {}
    
  ngOnInit(): void {
    // this.listaSucursales()

    this.camposGuardar = [...this._publicos.camposGuardar()]
    this.infoConfirmar.checkList = this.checkList
    this.infoConfirmar.detalles = this.detalles_rayar
    this.rol()
  }
  ngAfterViewInit() {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  
  regresar(){
    this.router.navigate([`/${this.enrutamiento.anterior}`], { 
      queryParams: { }
    });
  }
  async rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    
    this.rutaActiva.queryParams.subscribe(async params => {
     
      this.ParamsGet = params
      const anterior = params['anterior'];
      const tipo = params['tipo'];
      const cliente = params['cliente'];
      const vehiculo = params['vehiculo'];
      const id_rcepcion = params['recepcion']
      const id_cotizacion = params['cotizacion']

      this.enrutamiento.vehiculo = vehiculo
      this.enrutamiento.cliente = cliente
      this.enrutamiento.anterior = anterior
      this.enrutamiento.tipo = tipo
      // console.log(tipo);
      
      if (tipo === 'nueva') {
        this._clientes.consulta_cliente_new(cliente).then((cliente_get:any)=>{
          this.infoConfirmar.cliente = cliente_get
          this.infoConfirmar.vehiculos = cliente_get.vehiculos
          this.infoConfirmar.sucursal = this.sucursales_array.find(s=>s.id === cliente_get.sucursal)
          if (vehiculo) {
            this.extra = vehiculo
            this.infoConfirmar.vehiculo = cliente_get.vehiculos.find(v=>v.id === vehiculo)
          }
        
        })
      }else if(tipo === 'cotizacion'){
        this._cotizacion.consulta_cotizacion_new(id_cotizacion).then((cotizacion:any)=>{
          cotizacion.servicios = cotizacion.elementos
          const camposOcupadosCotizacion = ['cliente','vehiculo','sucursal','formaPago','iva','margen','nota','servicio','servicios']
          camposOcupadosCotizacion.forEach(c=>{
            this.infoConfirmar[c]= cotizacion[c]
          })
          this.enrutamiento.cliente = cotizacion.cliente.id
          this.extra = cotizacion.vehiculo.id
          this.consultaVehiculosCliente()
          
        })
      } else if (tipo === 'cita'){
        // console.log( console.log(params));
        const {cliente, vehiculo, cotizacion} = params;
        const clienteData:any = await this._clientes.consulta_cliente_new(cliente);
        this.infoConfirmar.cliente = clienteData
        this.infoConfirmar.vehiculos = clienteData.vehiculos
        this.extra = vehiculo
        this.infoConfirmar.vehiculo = clienteData.vehiculos.find(v=>v.id === vehiculo)
        this.infoConfirmar.sucursal = this.sucursales_array.find(s=>s.id === clienteData.sucursal)
        if(cotizacion){
          const cotizacionData: any = await this._cotizacion.consulta_cotizacion_new(cotizacion)
          this.infoConfirmar.servicios = cotizacionData.elementos
        }
      }
      this.realizaOperaciones()
    });
    
  }
  consultaVehiculosCliente(){
    if (this.infoConfirmar.cliente['id']) {
      this._clientes.consulta_cliente_new(this.enrutamiento.cliente).then((cliente:any)=>{
        this.infoConfirmar.vehiculos = cliente.vehiculos
      })
    }
  }

  cambiaAprobado(index, aprobado){
    setTimeout(() => {
      this.infoConfirmar.servicios[index].aprobado = aprobado
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
    // this.events.push(`${type}: ${event.value}`);
    // console.log(event.value);
    const fecha = event.value
 
    const startI = this._publicos.reseteaHoras(fecha['_d'])
    const hoy = this._publicos.reseteaHoras(new Date())
    // const dias =
    this.infoConfirmar.diasEntrega = this._publicos.calcularDiasEntrega(hoy,startI)
    this.infoConfirmar.fecha_promesa = this._publicos.convierte_fechaString_personalizada(fecha['_d']).fechaString
  }

  infopaquete( event ){
    const originalArray = event.elementos;
    const copiedArray = originalArray.slice();
    const tempDate =  {...event, elementos: copiedArray }    
    this.infoConfirmar.servicios.push(tempDate)
    this.realizaOperaciones()
  }
  elementoInfo( event ){
    this.infoConfirmar.servicios.push( event)
    this.realizaOperaciones()
  }
  editar(donde:string ,data,cantidad){
    if (donde === 'cantidad' && cantidad <= 0) cantidad = 1
    if (donde === 'costo' && cantidad <= 0) cantidad = 0

    this.infoConfirmar.servicios[data.index][donde] = Number(cantidad)
   
    this.realizaOperaciones()
  }
  eliminaElemento(data){
    this.infoConfirmar.servicios = this.infoConfirmar.servicios.filter((_, index) => index !== data.index);
    this.realizaOperaciones()
  }
  editarSubelemento(donde:string ,data,item,cantidad){

    const elementos = [...data.elementos]

    if (donde === 'cantidad' && cantidad <= 0) cantidad = 1
    if (donde === 'costo' && cantidad <= 0) cantidad = 0
    elementos[item.index][donde] = Number(cantidad)

    this.infoConfirmar.servicios[data.index].elementos = elementos

    this.realizaOperaciones()
  }
  eliminaSubElemento(data,item){
    const elementos = data.elementos.slice();
    elementos.splice(item.index, 1);
    this.infoConfirmar.servicios[data.index].elementos = elementos;
    this.realizaOperaciones()
  }

realizaOperaciones(){
  setTimeout(() => {
    const {reporte,ocupados} = this._publicos.realizarOperaciones_2(this.infoConfirmar)
    this.dataSource.data = ocupados
    this.infoConfirmar.servicios = ocupados
    this.infoConfirmar.reporte = reporte    
    this.newPagination()
  }, 100);
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
  // colorPlumaClick(color:String){
  //   this.colorPluma = `${color}`
  // }
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
    // this.disableBtnGuardarIMG = true
    // this.blobDetallesPersonalizado = null
    
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
    // console.log(this.files);
  //  const da =  [...this.archivos] 
  //  let da2 = [...da]
    // this.archivos = da2.filter(o=>o.nombreArchivo ==='detallesPersonalizado.png')
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
    // console.log(this.archivos);
    console.log(this.archivos);
    
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
  ///con el

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
          this._publicos.mensajeIncorrecto('error de camara')
          // camaraTrasera
      })
      }
    }
    

    //   if(navigator.mediaDevices.getUserMedia){
    //     // facingMode:'user'   para camara selfie
    //     // facingMode: { exact: "environment" }  para camara exterior
    //     // const unica = this.nombres_cameras.find(o=>o['id'] === this.camera_select)
    //     let nueva = {}
    //     let op = {audio: false, video: { facingMode: {exact: "environment"} }}

    //     nueva = op
       
    //     this.camaraTrasera = await navigator.mediaDevices.getUserMedia(nueva).then(o=>{ return true}).catch((a)=>{return false})
    //     // console.log(this.camaraTrasera);
    //     // this._publicos.mensajeCorrecto('boolean: '+this.camaraTrasera)
        
    //     if (!this.camaraTrasera) {
    //       nueva =  {audio: false, video: { facingMode: "user" }}
    //     } // op = { audio:false, video: { facingMode: "user" } }
    //     await navigator.mediaDevices.getUserMedia(nueva)
    //     .then((str)=>{
    //       this.cameraStart = true
    //       stream.srcObject = str
    //       stream.play()
    //       this.stream = stream
    //     })
    //     .catch((error)=>{
    //         // console.log(error);
    //         this._publicos.mensajeIncorrecto('error de camara')
    //         // camaraTrasera
    //     })
    // }
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
      this._publicos.swalToastError('La firma no puede estar vacia')
    }
  }
  infoTecnico(event){
    if (!event) {
      this._publicos.swalToastError('intenta de nuevo')
    }else{
      this._publicos.mensaje_pregunta('Seguro que es el tecnico de la o.s?').then(({respuesta})=>{
        if (respuesta) {
          this.infoConfirmar.tecnico = event.id
          this.infoConfirmar.showNameTecnico = event.usuario
        }
      })
    }
  }
  infoCliente(event){
    if (!event) {
      this._publicos.swalToastError('intenta de nuevo')
    }else{
      this._publicos.mensaje_pregunta('Seguro que es el cliente de la o.s?').then(({respuesta})=>{
        if (respuesta) {
          const camposCliente  = [ 'id' ,'no_cliente','nombre','showSucursal','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','empresa','sucursal']
          this.infoConfirmar.cliente = this._publicos.nuevaRecuperacionData(event,camposCliente)
          this.infoConfirmar.vehiculos = (event.vehiculos) ? event.vehiculos : []
          this.infoConfirmar.vehiculo = {}
          this.infoConfirmar.sucursal = this.sucursales_array.find(s=>s.id === event.sucursal)
          if(event.dataFacturacion){
            this.infoConfirmar.dataFacturacion = event.dataFacturacion
          }else{
            this.infoConfirmar.dataFacturacion = null
          }
          if(this.extra){
            this.infoConfirmar.vehiculo =  event.vehiculos.find(v=>v.id === this.extra)
          }
        }
      })
    }
  }
  //cargar la informacion del cliente para poder editar
  cargaDataCliente(cliente:any){
    this.datCliente = null
    // this.vehiculo = null
    if (cliente) {
      setTimeout(() => {
        this.datCliente = cliente
      } , 200);
    }
  }

vehiculoInfo(info:any){
  if (info['registro']) {
    this._publicos.mensajeCorrecto('Accion correcra')
    
    this.extra =  info.vehiculo.id
    this.infoConfirmar.vehiculos = []
    const starCountRef = ref(db, `clientes/${this.infoConfirmar.cliente['id']}/vehiculos`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let vehiculos= this._publicos.crearArreglo2(snapshot.val())
        this.infoConfirmar.vehiculos = vehiculos
        const filtrov = vehiculos.find(v=>v.id === this.extra)
        this.infoConfirmar.vehiculo = filtrov
        this.modeloVehiculo = filtrov['modelo']
      }
    })
  }else{
    this._publicos.mensajeIncorrecto('Accion no realizada')
  }
}
vehiculoInfonew(idVehiculo:string){
  console.log(idVehiculo);
  this.extra = idVehiculo
  this.infoConfirmar.vehiculo = this.infoConfirmar.vehiculos.find(v=>v.id === idVehiculo)
}

  
  //realizar acciones con la informacion de la recepcion
  realizaValidaciones(){
    
    const {cliente, vehiculo,sucursal, reporte, checkList, servicios,firma_cliente ,iva, formaPago, margen, detalles, fecha_promesa} = this.infoConfirmar

    let faltantes = []
    // const serviciosValidos = servicios.filter(s=>s.aprobado)
    // const checkListValidos = checkList.filter(s=>s.status !== '')
    
    if (!cliente['id'])  faltantes.push('Cliente') 
    if (!cliente['correo'])  faltantes.push('Correo de cliente') 
    if (!vehiculo['id'])  faltantes.push('Vehiculo') 
    if (!sucursal['id'])  faltantes.push('Sucursal') 
    if (!reporte)  faltantes.push('Reporte') 
    if (!servicios.some(s => s.aprobado)) faltantes.push('Servicios a realizar');
    if (checkList.some(s => s.status === '') || this.kilometraje <=0) faltantes.push('CheckList elementos de vehículo');
    if (!fecha_promesa) faltantes.push('Fecha entrega') 
    if (!firma_cliente) faltantes.push('Firma cliente') 

    this.validaciones = faltantes.length > 0 ? faltantes.join(', ') : null;

    if (!this.validaciones) {
      this.continuar()
    }else{
      this._publicos.swalToastError('LLenar toda informacion')
    }
  }
  continuar(){
    this.infoConfirmar.personalizados = this.archivos
    this.infoConfirmar.personalizados = []
    let arregloPer = []
    
    this.archivos.forEach((a,index)=>{
      // console.log(descargar(a.archivo));
      const nuevonombre = a.nombreArchivo.split('.').slice(0, -1).join('')
      const asigando = nuevonombre.replace(/ /g, '').slice(0, 10)
      const aqui = `${asigando.toLowerCase()}${index}`
      var file    = a.archivo
      var reader  = new FileReader();
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
    this.infoConfirmar.fecha_recibido = this._publicos.getFechaHora().fecha
    this.infoConfirmar.hora_recibido = this._publicos.getFechaHora().hora
    
    
    this._pdfRecepcion.obtenerImege(this.infoConfirmar).then((pdfReturn:any) => {
      const pdfDocGenerator = pdfMake.createPdf(pdfReturn);
      // pdfDocGenerator.open();
      
      const {sucursal, cliente,vehiculo, servicios, reporte} = this.infoConfirmar

      // console.log();
      const nueva = {
        mo: reporte['mo'],
        refacciones: reporte['refacciones_v'],
        sobrescrito: reporte['sobrescrito'],
        subtotal: reporte['subtotal'],
        iva: reporte['iva'],
        total: reporte['total'],
      }
      this._servicios.generateOSNumber(sucursal['sucursal'],this.ROL).then((no_os)=>{
        const dataMail = {
          correos: this._publicos.dataCorreo(sucursal, cliente),
          no_os,
          filename : `${no_os}.pdf`,
          cliente: cliente,
          vehiculo:vehiculo,
          arregloString: this._publicos.obtenerNombresElementos(servicios),
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
          confirmButtonText: 'Previsualizar PDF cotizacion',
          denyButtonText: `Guardar y enviar correo`,
          cancelButtonText:`cancelar`,
          allowOutsideClick: false
  
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
    //                 status:null, diasSucursal:0,
    // fecha_recibido:null, hora_recibido:null, notifico:true,servicio:null, tecnico:null, showNameTecnico: null
                    this.infoConfirmar.status = 'recibido'
                    this.infoConfirmar.diasSucursal = 0
                    
                    this.infoConfirmar.notifico = true
                    this.infoConfirmar.servicio = 1
                    updates[`recepciones/${this._publicos.generaClave()}`] = this._publicos.nuevaRecuperacionData(this.infoConfirmar,this.camposGuardar)
                    this._mail.EmailRecepcion(dataMail)
                    if (this.ParamsGet.tipo === 'cita') {
                      updates[`${this.ParamsGet.ruta}/status`] = 'concretada'
                    }
                    update(ref(db), updates).then(()=>{
                      pdfDocGenerator.download(`Recepcion_${this.infoConfirmar.no_os}`)
                      Swal.close()

                      this.files = []
                      this.archivos = []
                      this.nombre = null
                      this.numeroDias = null
                      this.infoConfirmar=
                      {
                        cliente:{}, vehiculo:{},sucursal:{}, reporte:{},no_os:null,dataFacturacion:{},observaciones:null,
                        checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:1, margen: 25, personalizados: [],
                        detalles:[],diasEntrega: this.numeroDias, fecha_promesa: null, firma_cliente:null, pathPDF:'', status:null, diasSucursal:0,
                        fecha_recibido:null, hora_recibido:null, notifico:true,servicio:null, tecnico:null, showNameTecnico: null
                      }
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
}
