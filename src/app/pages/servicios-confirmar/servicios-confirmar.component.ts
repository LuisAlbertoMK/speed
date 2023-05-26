import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { child, get, getDatabase, onValue, ref, update } from 'firebase/database';
import SignaturePad from 'signature_pad';
import { UploadFirmaService } from 'src/app/services/upload-firma.service';

import { EmailsService } from 'src/app/services/emails.service';
import Swal from 'sweetalert2';

import { animate, state, style, transition, trigger } from '@angular/animations';


import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { CatalogosService } from '../../services/catalogos.service';
import { ClientesService } from '../../services/clientes.service';
import { ServiciosService } from '../../services/servicios.service';
import { SucursalesService } from '../../services/sucursales.service';
import { VehiculosService } from '../../services/vehiculos.service';

import html2canvas from 'html2canvas';
import { FileItem } from 'src/app/models/FileItem.model';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';
import { UploadFileService } from '../../services/upload-file.service';
import { UsuariosService } from '../../services/usuarios.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { EmpresasService } from 'src/app/services/empresas.service';
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

  @HostListener('dragover',['$event'])
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter()
  miniColumnas:number = 100
  numeroDias: number = null
  ROL:string =''; SUCURSAL:string ='';
  listaSucursales_arr =[]
  //TODO: aqui la informacion que es nueva
  infoConfirmar=
  {
    cliente:{}, vehiculo:{},sucursal:{}, reporte:{}, no_os:null, dataFacturacion: null,observaciones:null,
    checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:1, margen: 25, personalizados: [],
    detalles:[],diasEntrega: this.numeroDias, fecha_promesa: null, firma_cliente:null, pathPDF:'', status:null, diasSucursal:0,
    fecha_recibido:null, hora_recibido:null, notifico:true,servicio:null, tecnico:null, showNameTecnico: null
  }    
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
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    {valor: 'showSucursal', show:'Sucursal'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'}
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
    {valor:"antena",show:'antena', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"birlo_seguridad",show:'birlo seguridad', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"bocinas",show:'bocinas', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"botones_interiores",show:'botones interiores', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"boxina_claxon",show:'boxina claxon', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"calefaccion",show:'calefaccion', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"cenicero",show:'cenicero', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"cristales",show:'cristales', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"encendedor",show:'encendedor', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"espejo_retorvisor",show:'espejo retrovisor', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"espejos_laterales",show:'espejos laterales', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"estuche_herramientas",show:'estuche herramientas', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"extintor",show:'extintor', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"gato",show:'gato', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"golpes_y_carroceria",show:'golpes y carroceria', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"instrumentos_tablero",show:'instrumentos tablero', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"interiores",show:'interiores', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"limpiadores",show:'limpiadores', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"llanta_refaccion",show:'llanta refaccion', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"llave_cruz",show:'llave cruz', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"luces",show:'Luces', opciones: ["si","no","dañado"],status:'si'},
    {valor:"maneral_gato",show:'maneral gato', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"manijas_interiores",show:'manijas interiores', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"molduras_completas",show:'molduras completas', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"radio",show:'radio', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"tapetes",show:'tapetes', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"tapon_combustible",show:'tapon combustible', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"tapones_llantas",show:'tapones llantas', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"tapones_motor",show:'tapones motor', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"triangulos_seguridad",show:'triangulos seguridad', opciones: [ "si","no","dañado"],status:'si'},
    {valor:"tarjeta_de_circulacion",show:'tarjeta de circulacion', opciones: [ "si","no"],status:'si'},
    {valor:"llega_en_grua",show:'llega en grua', opciones: [ "si","no"],status:'si'},
    {valor:"testigos_en_tablero",show:'testigos en tablero', opciones: [ "si","no"],status:'si'},
    {valor:"nivel_gasolina",show:'nivel gasolina', opciones: [ "vacio","1/4","1/2", "3/4", "lleno"],status:'1/4'}
    
  ]
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
    this.camposGuardar = [...this._publicos.camposGuardar()]
  }
  ngAfterViewInit() {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
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
    
    this._sucursales.consultaSucursales_new().then((sucursales) => {
      this.listaSucursales_arr = sucursales
      this.rol()
    }).catch((error) => {
      // Manejar el error si ocurre
    });
  }
  
  async rol(){
    Swal.fire({
      title:'Cargando',
      html:'Espere porfavor...',
      showConfirmButton:false,
      allowOutsideClick:false
    })
    Swal.isLoading()
    const ID = this.rutaActiva.snapshot.params['ID']
    const tipo = this.rutaActiva.snapshot.params['tipo']
    const extra = this.rutaActiva.snapshot.params['extra']
    // console.log(ID);
    // console.log(tipo);
    this.infoConfirmar.checkList = this.checkList
    this.infoConfirmar.detalles = this.detalles_rayar
    if(tipo === 'cotizacion'){
      
      const starCountRef = ref(db, `cotizacionesRealizadas/${ID}`)
      onValue(starCountRef, async (snapshot) => {
        if (snapshot.exists()) {
          
          const {cliente, vehiculo, servicio ,elementos, sucursal, iva, formaPago, margen_get} = snapshot.val()
          // const infoCotizacion = snapshot.val()
          let vehiculos = []
          await get(child(dbRef, `clientes/${cliente.id}/vehiculos`)).then((snapVehiculos) => {
            if (snapVehiculos.exists()) {
              vehiculos = this._publicos.crearArreglo2(snapVehiculos.val())
            }
          })
          const infoSU =  this.listaSucursales_arr.find(s=>s.id === cliente.sucursal)
          cliente.showSucursal = infoSU.sucursal

          this.infoConfirmar.cliente = cliente
          this.infoConfirmar.vehiculo = vehiculo
          this.infoConfirmar.vehiculos = vehiculos
          this.infoConfirmar.servicios = elementos
          this.infoConfirmar.formaPago = formaPago
          this.infoConfirmar.margen = margen_get
          this.infoConfirmar.sucursal = sucursal
          
          if(cliente.dataFacturacion){
            this.infoConfirmar.dataFacturacion = cliente.dataFacturacion.unica
          }else{
            this.infoConfirmar.dataFacturacion = null
          }
          
          this.infoConfirmar.servicio = servicio
          this.infoConfirmar.iva = iva
          this.extra = vehiculo.id
          this.infoConfirmar.reporte = this._publicos.realizarOperaciones_2(this.infoConfirmar).reporte
          // this.infoConfirmar.servicios = 
          // console.log(this._publicos.realizarOperaciones_2(this.infoConfirmar).ocupados);
          // console.log(this._publicos.realizarOperaciones_2(this.infoConfirmar).reporte);
          this.infoConfirmar.cliente = cliente
          this.infoConfirmar.vehiculos = cliente.vehiculos
          this.realizaOperaciones()
          Swal.close()
          
        }
      }, {
          onlyOnce: true
        })
    }
    if(tipo === 'cliente' || tipo === 'vehiculo'){
      const starCountRef = ref(db, `clientes/${ID}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          // let vehiculos= this._publicos.crearArreglo2(snapshot.val())
          const cliente = snapshot.val();
          const vehiculos = (cliente.vehiculos) ? this._publicos.crearArreglo2(cliente.vehiculos) : []
          if(cliente.dataFacturacion){
            this.infoConfirmar.dataFacturacion = cliente.dataFacturacion.unica
          }else{
            this.infoConfirmar.dataFacturacion = null
          }
          const infoSU =  this.listaSucursales_arr.find(s=>s.id === cliente.sucursal)
          cliente.showSucursal = infoSU.sucursal

          if (extra) {
            this.extra = extra
            this.infoConfirmar.vehiculo = vehiculos.find(v=>v.id === extra)
          }
          // console.log(cliente);
          
          this.infoConfirmar.sucursal = infoSU
          this.infoConfirmar.cliente = cliente
          this.infoConfirmar.vehiculos = vehiculos
          Swal.close()
        }
      }, {
          onlyOnce: true
        })
    }
    if(tipo === 'new') Swal.close()

    // if(tipo === 'vehiculo'){

    //   Swal.close()
    // }
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
  elementoInfo( event){
    this.infoConfirmar.servicios.push(event)
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
          this.infoConfirmar.sucursal = this.listaSucursales_arr.find(s=>s.id === event.sucursal)
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
cargaDataVehiculo(data:any,quien:string){
  // console.log(data);
  this.cliente = null
  this.vehiculoData = null
  if (quien === 'cliente') {
    
    // console.log('id de cliente');
    if (data['id']) {
      setTimeout(() => {
        this.cliente = data['id']
      } , 300);
    }
  }
  if (quien === 'vehiculo') {
    
    // console.log('id de vehiculo');
    if (data['id']) {
      setTimeout(() => {
       
        // Swal.fire('','','info')
        this._publicos.mensajeOK('Se cargo la información',2000)
        // Swal.isLoading()
        this.vehiculoData = data
        // Swal.close()
      } , 300);
    }
  }
  
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
    this.infoConfirmar.observaciones = this.observaciones
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
        Swal.fire({
          title: 'Opciones de recepcion',
          html:`<strong class='text-danger'>Se recomienda visualizar pdf antes de enviar</strong>`,
          showDenyButton: true,
          showCancelButton: false,
          confirmButtonText: 'Previsualizar PDF cotizacion',
          denyButtonText: `Guardar y enviar correo`,
          cancelButtonText:`cancelar`
  
        }).then((result) => {
          // si se confirma previsualizacion genera pdf en nueva ventana del navegador
          if (result.isConfirmed) {
            
            pdfDocGenerator.open()
            // console.log(this.infoConfirmar.personalizados);
          } else if (result.isDenied) {
            
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
                    this.infoConfirmar.fecha_recibido = this._publicos.getFechaHora().fecha
                    this.infoConfirmar.hora_recibido = this._publicos.getFechaHora().hora
                    this.infoConfirmar.notifico = true
                    this.infoConfirmar.servicio = 1
                    
                    updates[`recepciones/${this._publicos.generaClave()}`] = this._publicos.nuevaRecuperacionData(this.infoConfirmar,this.camposGuardar)
                    console.log(updates);
                    this._mail.EmailRecepcion(dataMail)

                    update(ref(db), updates).then(()=>{
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
