import { Component,HostListener, OnInit, ViewChild, Output,EventEmitter,AfterViewInit, ElementRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, onValue, ref, set, get, child, push,update } from 'firebase/database';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import SignaturePad from 'signature_pad';
import { UploadFirmaService } from 'src/app/services/upload-firma.service';

import Swal from 'sweetalert2';
import {map, startWith} from 'rxjs/operators';
import { EmailsService } from 'src/app/services/emails.service';
import { Observable } from 'rxjs';

import {animate, state, style, transition, trigger} from '@angular/animations';


import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { ClientesService } from '../../services/clientes.service';
import { SucursalesService } from '../../services/sucursales.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { ServiciosService } from '../../services/servicios.service';
import { CatalogosService } from '../../services/catalogos.service';

import { FileItem } from 'src/app/models/FileItem.model';
import html2canvas from 'html2canvas';
import { UploadFileService } from '../../services/upload-file.service';
import { UsuariosService } from '../../services/usuarios.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';

import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";

import { UploadPDFService } from '../../services/upload-pdf.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { file } from 'pdfkit';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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

  @HostListener('dragover',['$event'])
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter()
  miniColumnas:number = 100

  ROL:string =''; SUCURSAL:string ='';

  //TODO: aqui la informacion que es nueva
  infoConfirmar=
  {cliente:{}, vehiculo:{},sucursal:{}, reporte:{},
  checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:1, margen: 25,
  detalles:[],diasEntrega: null }    
  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    // {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    // {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    // {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
    {valor:'sobrescrito', show:'sobrescrito'},
    {valor:'descuento', show:'descuento'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'iva', show:'iva'},
    {valor:'total', show:'total'},
    {valor:'meses', show:'meses'},
  ]
  camposCliente=[
    {valor: 'no_cliente', show:'# Cliente'},
    {valor: 'nombre', show:'Nombre'},
    {valor: 'apellidos', show:'Apellidos'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'},
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    {valor: 'sucursal', show:'Sucursal'}
  ]
  camposVehiculo=[
    {valor: 'placas', show:'Placas'},
    {valor: 'marca', show:'marca'},
    {valor: 'modelo', show:'modelo'},
    {valor: 'anio', show:'añio'},
    {valor: 'categoria', show:'categoria'},
    {valor: 'cilindros', show:'cilindros'},
    {valor: 'engomado', show:'engomado'},
    {valor: 'color', show:'color'},
    {valor: 'transmision', show:'transmision'},
    {valor: 'no_motor', show:'No. Motor'},
    {valor: 'vinChasis', show:'vinChasis'},
    {valor: 'marcaMotor', show:'marcaMotor'}
  ]
  formasPago=[
    {id:'1',pago:'contado',interes:0,numero:0},
    {id:'2',pago:'3 meses',interes:4.49,numero:3},
    {id:'3',pago:'6 meses',interes:6.99,numero:6},
    {id:'4',pago:'9 meses',interes:9.90,numero:9},
    {id:'5',pago:'12 meses',interes:11.95,numero:12},
    {id:'6',pago:'18 meses',interes:17.70,numero:18},
    {id:'7',pago:'24 meses',interes:24.,numero:24}
  ]
  detalles_rayar=[
    {valor:'capo', show:'capo',status:false},
    {valor:'paragolpes_frontal', show:'paragolpes frontal',status:false},
    {valor:'paragolpes_posterior', show:'paragolpes posterior',status:false},
    {valor:'techo', show:'techo',status:false},
    {valor:'espejo_derecho', show:'espejo derecho',status:false},
    {valor:'espejo_izquierdo', show:'espejo izquierdo',status:false},
    {valor:'faros_frontales', show:'faros frontales',status:false},
    {valor:'faros_posteriores', show:'faros posteriores',status:false},
    {valor:'parabrisas_posterior', show:'parabrisas posterior',status:false},
    {valor:'paragolpes_frontal', show:'paragolpes frontal',status:false},
    {valor:'paragolpes_posterior', show:'paragolpes posterior',status:false},
    {valor:'puerta_lateral_derecha_1', show:'puerta lateral derecha 1',status:false},
    {valor:'puerta_lateral_derecha_2', show:'puerta lateral derecha 2',status:false},
    {valor:'puerta_lateral_izquierda_1', show:'puerta lateral izquierda 1',status:false},
    {valor:'puerta_lateral_izquierda_2', show:'puerta lateral izquierda 2',status:false},
    {valor:'puerta_posterior', show:'puerta posterior',status:false},
    {valor:'tirador_lateral_derecha_1', show:'tirador lateral derecha 1',status:false},
    {valor:'tirador_lateral_derecha_2', show:'tirador lateral derecha 2',status:false},
    {valor:'tirador_lateral_izquierda_1', show:'tirador lateral izquierda 1',status:false},
    {valor:'tirador_lateral_izquierda_2', show:'tirador lateral izquierda 2',status:false},
    {valor:'tirador_posterior', show:'tirador posterior',status:false}
  ]
  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

  sinDetalles: boolean = true
  kilometraje:number =1234; diasEntrega:number = null

  coloresPluma= [
    {show:'Negro', color:'#010101'},
    {show:'Azul', color:'#444BF2'},
    {show:'Amarillo', color:'#C9D612'},
    {show:'Naranja', color:'#FFA30A'},
    {show:'Rojo', color:'#F30F05'},
    {show:'Verde', color:'#3DD400'},
  ]
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
  checkList = [
    {valor:"antena",show:'antena', opciones: [ "si","no","dañado"],status:''},
    {valor:"birlo_seguridad",show:'birlo seguridad', opciones: [ "si","no","dañado"],status:''},
    {valor:"bocinas",show:'bocinas', opciones: [ "si","no","dañado"],status:''},
    {valor:"botones_interiores",show:'botones interiores', opciones: [ "si","no","dañado"],status:''},
    {valor:"boxina_claxon",show:'boxina claxon', opciones: [ "si","no","dañado"],status:''},
    {valor:"calefaccion",show:'calefaccion', opciones: [ "si","no","dañado"],status:''},
    {valor:"cenicero",show:'cenicero', opciones: [ "si","no","dañado"],status:''},
    {valor:"cristales",show:'cristales', opciones: [ "si","no","dañado"],status:''},
    {valor:"encendedor",show:'encendedor', opciones: [ "si","no","dañado"],status:''},
    {valor:"espejo_retorvisor",show:'espejo retrovisor', opciones: [ "si","no","dañado"],status:''},
    {valor:"espejos_laterales",show:'espejos laterales', opciones: [ "si","no","dañado"],status:''},
    {valor:"estuche_herramientas",show:'estuche herramientas', opciones: [ "si","no","dañado"],status:''},
    {valor:"extintor",show:'extintor', opciones: [ "si","no","dañado"],status:''},
    {valor:"gato",show:'gato', opciones: [ "si","no","dañado"],status:''},
    {valor:"golpes_y_carroceria",show:'golpes y carroceria', opciones: [ "si","no","dañado"],status:''},
    {valor:"instrumentos_tablero",show:'instrumentos tablero', opciones: [ "si","no","dañado"],status:''},
    {valor:"interiores",show:'interiores', opciones: [ "si","no","dañado"],status:''},
    {valor:"limpiadores",show:'limpiadores', opciones: [ "si","no","dañado"],status:''},
    {valor:"llanta_refaccion",show:'llanta refaccion', opciones: [ "si","no","dañado"],status:''},
    {valor:"llave_cruz",show:'llave cruz', opciones: [ "si","no","dañado"],status:''},
    {valor:"llega_en_grua",show:'llega en grua', opciones: [ "si","no"],"luces": [ "si","no","dañado"],status:''},
    {valor:"maneral_gato",show:'maneral gato', opciones: [ "si","no","dañado"],status:''},
    {valor:"manijas_interiores",show:'manijas interiores', opciones: [ "si","no","dañado"],status:''},
    {valor:"molduras_completas",show:'molduras completas', opciones: [ "si","no","dañado"],status:''},
    {valor:"nivel_gasolina",show:'nivel gasolina', opciones: [ "vacio","1/4","1/2", "3/4", "lleno"],status:''},
    {valor:"radio",show:'radio', opciones: [ "si","no","dañado"],status:''},
    {valor:"tapetes",show:'tapetes', opciones: [ "si","no","dañado"],status:''},
    {valor:"tapon_combustible",show:'tapon combustible', opciones: [ "si","no","dañado"],status:''},
    {valor:"tapones_llantas",show:'tapones llantas', opciones: [ "si","no","dañado"],status:''},
    {valor:"tapones_motor",show:'tapones motor', opciones: [ "si","no","dañado"],status:''},
    {valor:"tarjeta_de_circulacion",show:'tarjeta de circulacion', opciones: [ "si","no"],status:''},
    {valor:"testigos_en_tablero",show:'testigos en tablero', opciones: [ "si","no"],status:''},
    {valor:"triangulos_seguridad",show:'triangulos seguridad', opciones: [ "si","no","dañado"],status:''}
    
  ]
  rangeFechaEntrega = new FormGroup({
    start: new FormControl(new Date),
    end: new FormControl(new Date),
  });
  fechas_get = {start: new Date(), end: new Date()}

  validaciones: string = null
  //TODO: aqui la informacion que es nueva


  constructor(
    private router: Router, private rutaActiva: ActivatedRoute, private _formBuilder: FormBuilder, private _clientes:ClientesService,
    private _uploadfirma: UploadFirmaService,private _mail:EmailsService, private fb: FormBuilder, private _publicos:ServiciosPublicosService,
    private _sucursales: SucursalesService, private _vehiculos: VehiculosService,
    private _servicios: ServiciosService, private _catalogos:CatalogosService, private _uploadFiles: UploadFileService,
    private _usuarios: UsuariosService,  private _security:EncriptadoService,
    private _cotizaciones: CotizacionService, private _pdfRecepcion: PdfRecepcionService,
    private _pdf: UploadPDFService, private _empresas: EmpresasService) { }
    
  ngOnInit(): void {
    this.listaSucursales()
  }
  ngAfterViewInit() {
    // this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  
  

  crearFormObservaciones(){
    // this.observaciones = this.fb.group({
    //   observaciones:['',[]]
    // })
  }

  listaSucursales(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    this.rol()
  }
  
  async rol(){
    
    const ID = this.rutaActiva.snapshot.params['ID']
    const tipo = this.rutaActiva.snapshot.params['tipo']
    console.log(ID);
    console.log(tipo);

    if(tipo === 'cotizacion'){
      const starCountRef = ref(db, `cotizacionesRealizadas/${ID}`)
      onValue(starCountRef, async (snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          const {cliente, vehiculo, elementos, reporte,  iva, formaPago, margen_get} = snapshot.val()
          const infoCotizacion = snapshot.val()
          let vehiculos = []
          await get(child(dbRef, `clientes/${cliente.id}/vehiculos`)).then((snapVehiculos) => {
            if (snapVehiculos.exists()) {
              vehiculos = this._publicos.crearArreglo2(snapVehiculos.val())
            }
          })

          this.infoConfirmar.cliente = cliente
          this.infoConfirmar.vehiculo = vehiculo
          this.infoConfirmar.vehiculos = vehiculos
          this.infoConfirmar.servicios = elementos
          this.infoConfirmar.formaPago = formaPago
          this.infoConfirmar.margen = margen_get
          this.infoConfirmar.reporte = reporte

          this.infoConfirmar.detalles = this.detalles_rayar
          this.infoConfirmar.checkList = this.checkList


          this.infoConfirmar.iva = iva
          
        }
      }, {
          onlyOnce: true
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
    const dias =this._publicos.calcularDiasEntrega(hoy,startI)
    this.infoConfirmar.diasEntrega = dias
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
  async guardarImagenCanvas(){
    // this.disableBtnGuardarIMG = true
    // this.blobDetallesPersonalizado = null
    await html2canvas(document.querySelector("#main-canvas")).then(async(canvas) => {
      const datURL = await canvas.toDataURL()
      const blob = this.UrltoBlob(datURL)
      
      const file = new File([blob], `detallesPersonalizado.png`,{
        type: blob.type,
      })
      // this.blobDetallesPersonalizado = blob
      this.archTemp={
        archivo:blob,
        nombreArchivo:'detallesPersonalizado',
        estaSubiendo:false,
        progreso:0
      }
      this.nombre= 'detallesPersonalizado'
      //primero verificar si existe
      let existe = false
      this.archivos.forEach((a)=>{
        if (a['nombreArchivo'] === 'detallesPersonalizado' || a['nombreArchivo'] === 'detallesPersonalizado.png') existe = true
      })
      
      if (existe) {
        this.archivos.forEach((a,index)=>{
          if (a['nombreArchivo'] === 'detallesPersonalizado' || a['nombreArchivo'] === 'detallesPersonalizado.png') this.archivos[index] = this.archTemp
        })
        this.files.forEach((a,index)=>{
          if (a['name'] === 'detallesPersonalizado.png') this.files[index] = file
        })
      }else{
        this.archivos.push(this.archTemp)
        this.files.push(file)
      }
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
   const da =  [...this.archivos] 
   let da2 = [...da]
    this.archivos = da2.filter(o=>o.nombreArchivo ==='detallesPersonalizado.png')

    
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
  //realizar acciones con la informacion de la recepcion
  realizaValidaciones(){
    const {cliente, vehiculo,sucursal, reporte, checkList, servicios, iva, formaPago, margen, detalles, diasEntrega} = this.infoConfirmar
    // cliente:{}, vehiculo:{},sucursal:{}, reporte:{},
    // checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:1, margen: 25,
    // detalles:[],diasEntrega: null

    let faltantes = []

    //verificar si existenservicios aprobados

  const serviciosValidos = servicios.filter(s=>s.aprobado)
  const checkListValidos = checkList.filter(s=>s.status !== '')
    
  // console.log(serviciosValidos);
  // console.log(servicios);
  // console.log(checkListValidos);
  // console.log(checkList);
  


    if (!cliente['id'])  faltantes.push('Cliente') 
    if (!cliente['correo'])  faltantes.push('correo de cliente') 
    if (!vehiculo['id'])  faltantes.push('vehiculo') 
    if (!sucursal['id'])  faltantes.push('sucursal') 
    if (!reporte)  faltantes.push('reporte') 
    if (!serviciosValidos.length)  faltantes.push('servicios') 
    if (checkListValidos.length !== checkList.length)  faltantes.push('checkList') 
    if (!iva)  faltantes.push('iva') 
    // if (!formaPago)  faltantes.push('formaPago') 
    // if (!margen)  faltantes.push('margen') 
    if (diasEntrega >=0 )  faltantes.push('Dia de entrega') 
    // console.log(faltantes);

    this.validaciones = faltantes.join(', ')
    
  }
}
