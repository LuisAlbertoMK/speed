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

  miniColumnas:number = 100

  ROL:string =''; SUCURSAL:string ='';
  
  paquetes:any[]=[]; refaccionesMarcas:any[]=[]; refacciones:any[]=[]; MO:any[]=[]

  dataRecepcion:any={data:{iva:true,formaPago:1,servicio:1,margen:25,descuento:0,promocion:'ninguna'},
  elementos_originales:[],elementos:[],cliente:[],vehiculo:[],sucursal:[],detalles:[],checkList:[],vehiculos:[]}

  camposCliente=['nombre','correo','correo_sec','telefono_fijo','telefono_movil','tipo','empresa']
  camposVehiculo=['placas','marca','modelo','anio','categoria','cilindros','engomado','color','transmision','no_motor','vinChasis','marcaMotor']

  camposRecMO:any =['id','precio','nombre','costo','tipo','descripcion','status','cantidad']
  camposRecRefaccion:any =[...this.camposRecMO,'marca','modelo']
    
  desgloce:any=[{nombre: 'Costo de refacción', valor:'refacciones1'},{nombre: 'precio de venta refacción', valor:'refacciones2'},
                      {nombre: 'MO', valor:'totalMO'},{nombre:'Sobrescrito', valor:'sobrescrito'},{nombre:'Descuento', valor:'descuento'}]
  desgloce_iva:any=[{nombre: 'subtotal', valor:'subtotal'},{nombre: 'IVA', valor:'IVA'},{nombre: 'total', valor:'total'}]
  IVA:boolean = true; seleccionarTodo:boolean =true;

  SinDetalles:boolean = false; kilometraje:number =0; diasEntrega:number = null
  
  fotografias:boolean = false; detallesPersonalizado:boolean = true

  progreso:number = 0

  imgFirma:Blob = null; disableFirma:boolean = false
  isLinear = false;
  vehiculosDetalles:any =[]

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','nombre','cantidad','sobrescrito','precio','normal','flotilla']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos
  
  dataSourcePaquetes = new MatTableDataSource(); //paquetes
  paquetesColumns = ['nombre','precio','normal','flotilla']; //paquetes
  columnsToDisplayWithExpandpaquetes= [...this.paquetesColumns, 'opciones', 'expand']; //paquetes

  @ViewChild('PaquetesPaginator') paginatorPaquetes: MatPaginator //paquetes
  @ViewChild('Paquetes') sortPaquetes: MatSort //paquetes

  @ViewChild('firmaDigital',{static:true}) signatureElement:any; SignaturePad:any;

  tipo:string = null

  myControl = new FormControl(''); //control de elementos para agregar a recepcion
  filteredOptions: Observable<string[]>; //control de elementos para agregar a recepcion

  myControlCotizacionesAUTO = new FormControl(''); //control de cotizaciones de vehiculo
  filteredOptionsCotizacionesAUTO: Observable<string[]>; //control de cotizaciones de vehiculo

  myControlClientes = new FormControl(''); //control de cotizaciones de clientes
  filteredOptionsClientes: Observable<string[]>; //control de cotizaciones de clientes

  formaVehiculoManual:FormGroup;
  existenPlacas:boolean = false; listaArrayAnios:any[]=[]; marcas:any[]=[];arrayModelos:any[]=[]; colores:any=[]
  engomados=['amarillo','azul','rojo','rosa','verde']

  formElemento: FormGroup;

  formCliente: FormGroup;
  tipoCli:string = 'particular'
  telfono_valido:boolean = true; correoExistente:boolean = false; nombreEmpresaValido:boolean = true; tipoClienteValido:boolean = false
  

  marcaSelect:string = null
  guardarEnCatalogo:boolean = true;
  showFormElemento:boolean = false; showPaquetes:boolean = false; paquetesListos:boolean = false
  modeloFiltro:boolean = true

  cotizacionesAUTO:any[]=[]
  margen:number = 25;
  clientes:any[]=[]; ListavehiculosCliente:any[]=[]
  mensajeError:string = null

  colorPluma:string = '444BF2'
  blobDetallesPersonalizado:Blob = null
  contieneIMG:boolean = false

  
  elementosPaquete:any[]=[]

  servicios=[
    {valor:1,nombre:'servicio'},
    {valor:2,nombre:'garantia'},
    {valor:3,nombre:'retorno'},
    {valor:4,nombre:'venta'},
    {valor:5,nombre:'preventivo'},
    {valor:6,nombre:'correctivo'},
    {valor:7,nombre:'rescate vial'}
  ]

  formasPAgo=[
    {id:"1",pago:'contado'},
    {id:"2",pago:'3 meses',interes:4.49,numero:'3'},
    {id:"3",pago:'6 meses',interes:6.99,numero:'6'},
    {id:"4",pago:'9 meses',interes:9.90,numero:'9'},
    {id:"5",pago:'12 meses',interes:11.95,numero:'12'},
    {id:"6",pago:'18 meses',interes:17.70,numero:'18'},
    {id:"7",pago:'24 meses',interes:24.,numero:'24'}
  ]
  categorias:any[]=[];
  // dropZOne

  listaTecnicos=[]
  //dropzone
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter()
  estaSobreElemento:boolean = false
  archivos: FileItem[]=[]
  files: File[] = []
  archTemp:any
  nombre:string
  nombreSucursal:string=''
  imagenSucursal:string=''
  contadImagenesUpload=0
  disableBtnGuardarIMG:boolean = false


  detalles_rayar=[
    'Capo',
    'Paragolpes_frontal',
    'Paragolpes_posterior',
    'Techo',
    'espejo_derecho',
    'espejo_izquierdo',
    'faros_frontales',
    'faros_posteriores',
    'parabrisas_posterior',
    'paragolpes_frontal',
    'paragolpes_posterior',
    'puerta_lateral_derecha_1',
    'puerta_lateral_derecha_2',
    'puerta_lateral_izquierda_1',
    'puerta_lateral_izquierda_2',
    'puerta_posterior',
    'tirador_lateral_derecha_1',
    'tirador_lateral_derecha_2',
    'tirador_lateral_izquierda_1',
    'tirador_lateral_izquierda_2',
    'tirador_posterior',
  ]

  detallesFaltantes = ''
  onSelect(event) {
    // if(this.files.length>0){
    //   this.files=[]
    //   this.archivos=[]
    // }
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
  @HostListener('dragover',['$event'])

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


  context!: CanvasRenderingContext2D;
  @ViewChild('videoContainer', { static: false }) videoContainer!: ElementRef;
  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef;

  stream:any

  sizeScreen = {w:0,h:0}
  foto_tomada = null

  cameraStart:boolean = false
  nombres_cameras = []
  camera_select:string = null

  camaraTrasera:boolean = true

  listaEmpresas = []
  formaEmpresa: FormGroup;
  observaciones: FormGroup;

  sucursales= []
  cotizaciones = []
  camaraVuelta = true


  datCliente:any

  cliente:string = null

  vehiculo:string = null

  valida:boolean = true
  cuales:string = ''
  dataImagen:any;

  pasosFaltantes = {servicios: false, checkList: false, firmaCliente: false, entrega: false}

  recorridoPasos = ['servicios', 'checkList', 'firmaCliente', 'entrega']

  empresaList = []
  constructor(
    private router: Router, private rutaActiva: ActivatedRoute, private _formBuilder: FormBuilder, private _clientes:ClientesService,
    private _uploadfirma: UploadFirmaService,private _mail:EmailsService, private fb: FormBuilder, private _publicos:ServiciosPublicosService,
    private _sucursales: SucursalesService, private _vehiculos: VehiculosService,
    private _servicios: ServiciosService, private _catalogos:CatalogosService, private _uploadFiles: UploadFileService,
    private _usuarios: UsuariosService,  private _security:EncriptadoService,
    private _cotizaciones: CotizacionService, private _pdfRecepcion: PdfRecepcionService,
    private _pdf: UploadPDFService, private _empresas: EmpresasService) { }
    
  ngOnInit(): void {
    this._empresas.listaempresas().then(({contenido,data})=>{
      this.empresaList = data
    })
    // this.listaClientes()
    this.crearFormObservaciones()
    this.listaSucursales()
    this.listaMarcas_refacciones()
    this.listarPaquetes()
    // this.crearFormElemento()
    this.listarRefacciones()
    this.listarMO()
    this.ListapartesVehiculo()
    this.ListaCheckList()
    this.autocompletar()
    this.comenzar()
    this.listadoTecnicos()
    this.consultaMarcas()
    this.colores_autos()
    
    // this.generaNombreRecepcion()
    this.filtro_date()
    // this.lista_cameras()
    this.getBase64ImageFromURL('../../../assets/logoSpeedPro/Logo-Speedpro.png').then((val:any)=>{
      this.dataImagen = val
    })
  }
  
  async getBase64ImageFromURL(url:any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  crearFormObservaciones(){
    this.observaciones = this.fb.group({
      observaciones:['',[]]
    })
  }

  listaSucursales(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this._sucursales.consultaSucursales().then(({contenido,data})=>{
      if (contenido) {
        this.sucursales = data
        this.Listaclientes()
      }
    })
  }
  async Listaclientes(){
    const starCountRefClientes = ref(db, `clientes`)
    await onValue(starCountRefClientes, (snapshot) => {
      this._clientes.ListaClientes().then(async ({existe,clientes})=>{
        if (existe) {       
          // console.log(this.sucursales);
          clientes.map(cli=>{
            this.sucursales.map(s=>{
              if(cli['sucursal'] !== s['id']) return
              cli['infoSucursal'] = s
            })
            console.log(cli['id']);
            if (cli['empresa']) {
              let empresa = this.empresaList.find(d=>d['id'] === cli['empresa'])
              console.log(empresa);
              if (empresa) {
                cli['empresaShow'] = empresa['empresa']
              }else{
                cli['empresaShow'] = ' '
              }
            }else{
              cli['empresaShow'] = ' '
            }
            
            console.log( `Empresa cliente : ${cli['empresaShow']}`);
            
          })
          let clientes_nuevos = [];
          (this.SUCURSAL !== 'Todas')? clientes_nuevos = clientes.filter(o=>o.sucursal === this.SUCURSAL): clientes_nuevos  = clientes;
          clientes_nuevos.map(async(c)=>{
            if (!c['vehiculos']){ c['vehiculos'] = []; return }
            const arreglo_vehiculos = await  this._publicos.crearArreglo2(c['vehiculos'])
            c['vehiculos'] = arreglo_vehiculos
          })
          this.clientes = clientes_nuevos
          await this.ListaCotizaciones()
          if(this.clientes.length){
            setTimeout(() => {
              this.rol()
            }, 100);
          } 
        }else{
          this.clientes = []
        }
      })
    })
  }
  async ListaCotizaciones(){
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, async (snapshot) => {
      await this._cotizaciones.cotizacionesFull().
      then(({contenido,cotizaciones})=>{
        // console.log(cotizaciones);
        if (contenido) {
          // console.log(this.clientes);
          cotizaciones.map(cot=>{
              this.clientes.map(cli=>{
                if(cot['cliente'] !== cli['id']) return
                cot['infoCliente'] = cli
              })
          })
          if (this.SUCURSAL === 'Todas') {
            this.cotizaciones = cotizaciones
          }else{
            this.cotizaciones = cotizaciones.filter(c=>c['sucursal'] === this.SUCURSAL)
          }
        }
      })
    })
    
  }
  async rol(){
    
    
    if (this.SUCURSAL !== 'Todas') {

      // console.log(this.SUCURSAL);
      // this.formCliente.controls['sucursal'].setValue(this.SUCURSAL)
      this._clientes.getEmpresasSucursal(this.SUCURSAL).then(({contenido,data})=>{
        if (contenido) {
          this.listaEmpresas = this._publicos.ordernarPorCampo(data,'empresa')
        }
      })
      this.dataRecepcion.sucursal = await this.infoRuta(`sucursales/${this.SUCURSAL}`)
      this.dataRecepcion.data['sucursal'] = this.SUCURSAL
    }
    const ID = this.rutaActiva.snapshot.params['ID']
    const tipo = this.rutaActiva.snapshot.params['tipo']
    // console.log(ID);
    // console.log(tipo);
    if (tipo === 'cotizacion') {
      this.cotizaciones.map((cot)=>{
        if(cot['id']!== ID) return
        const elementos = cot['elementos']
        elementos.map(ele=>{
          // console.log(ele);
          if (ele['costo']>0) {
            ele['flotilla'] =  ele['costo']
          }else{
            if (ele['tipo'] === 'paquete') {
              const desgloce = this._publicos.costodePaquete(ele['elementos'], cot['margen'])
              ele['flotilla'] =  desgloce.flotilla
              ele['desgloce'] =  desgloce
            }else{
              // console.log(ele['precio'] * ele['cantidad']);
              ele['flotilla'] =  ele['precio'] * ele['cantidad']
            }
          }
          ele['aprobado'] = true
          ele['showStatus'] = 'Aprobado'  
          ele['status'] = 'aprobado' 
        })
        this.dataRecepcion.elementos = elementos
        this.realizarOperaciones()
        this.clientes.map(clie=>{
          if(clie['id'] !== cot['cliente']) return
          this.dataRecepcion.cliente = clie
          this.dataRecepcion.data['cliente'] = clie['id']
          this.dataRecepcion.vehiculos = clie['vehiculos']
          this.dataRecepcion.sucursal = clie['infoSucursal']
          this.dataRecepcion.data['sucursal'] = clie['sucursal']
          
          const vehiculos = clie['vehiculos']
          vehiculos.map(v=>{
            if(v['id'] !== cot['vehiculo']) return
              this.dataRecepcion.data['vehiculo'] = v['id']
              this.dataRecepcion.vehiculo = v
          })
        })
        this.validaciones()
      })
    }else if(tipo === 'cliente'){
      this.clientes.map(clie=>{
        if (clie['id'] !== ID) return
        this.dataRecepcion.cliente = clie
        this.dataRecepcion['data'].cliente = ID
        const vehiculos = clie['vehiculos']
        this.dataRecepcion.vehiculos = vehiculos
        this.dataRecepcion.sucursal = clie['infoSucursal']
        this.dataRecepcion.data['sucursal'] = clie['sucursal']
      })
    }else if(tipo==='vehiculo'){
      this.clientes.map(clie=>{
        const vehiculos = clie['vehiculos']
        vehiculos.map(v=>{
          if(v['id'] !== ID) return
          this.dataRecepcion.vehiculos = vehiculos
          this.dataRecepcion.cliente = clie
          this.dataRecepcion['data'].cliente = clie['id']
          this.dataRecepcion['data'].vehiculo = ID
          this.dataRecepcion.vehiculo = v
        })
        this.dataRecepcion.sucursal = clie['infoSucursal']
        this.dataRecepcion.data['sucursal'] = clie['sucursal']
      })
    }
  }

  AutoSeleccionado(id:any){
    if(!id) {
      this.dataRecepcion.data['vehiculo'] = ''
      this.dataRecepcion.vehiculo = null
      this.validaciones()
      return
    }
      const vehiculos = this.dataRecepcion.vehiculos
      vehiculos.map(v=>{
        if(v['id'] !== id) return
          this.dataRecepcion.data['vehiculo'] = v['id']
          this.dataRecepcion.vehiculo = v
          this.validaciones()
      })
  }

  filtro_date(){
    
  }
  litaSucursales(){
    const starCountRef = ref(db, `sucursales`)
        onValue(starCountRef, (snapshot) => {

        this._sucursales.consultaSucursales().then(({contenido,data})=>{
          // this.miarreglo =[]
          if (contenido) {
            // console.log(data);
          //   this.miarreglo = data.map(o=>{
          //     return {
          //       id:o['id'],
          //       nombre:o['sucursal'],
          //       checado: true
          //     }

          //   })
          //   const tempData={
          //   id:'Todas',
          //   nombre:'Todas',
          //   checado: true
          // }
          // this.miarreglo.push(tempData)
          this.sucursales = data
        }
        // this.newChecados = this.miarreglo
        })
        })
  }
  crearFormularioLlenadoManual(){
    this.formaVehiculoManual = this.fb.group({
      cliente:['',[]],
      placas:['',[Validators.required,Validators.minLength(6),Validators.maxLength(7)]],
      vinChasis:[''],
      marca:['',[Validators.required]],
      modelo:['',[Validators.required]],
      categoria:['',[Validators.required]],
      anio:['',[Validators.required]],
      cilindros:['',[Validators.required]],
      no_motor:[''],
      color:['',[Validators.required]],
      engomado:['',[Validators.required]],
      marcaMotor:['',[]],
      transmision:['',[Validators.required]]
    })
  }
  consultaMarcas(){
    this._vehiculos.consultaMarcasNew().then((ans:any)=>{
      this.marcas = ans
    })
  }
  colores_autos(){
    this._vehiculos.coloresAutos().then((ans:any)=>{
      this.colores = ans
    })
  }
  crearFormularioCliente(){
    this.formCliente = this.fb.group({
      id:['',[]],
      no_cliente:['',[Validators.required]],
      nombre:['',[Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      apellidos:['',[Validators.required,Validators.minLength(3), Validators.maxLength(30)]],
      correo:['',[Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      correo_sec:['',[Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      telefono_fijo:['',[Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^[0-9]+$")]],
      telefono_movil:['',[Validators.required,Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^[0-9]+$")]],
      tipo:['particular',[Validators.required]],
      sucursal:['',[Validators.required]],
      empresa:['',[]]
    })
  } 
  ngAfterViewInit() {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  
  async infoRuta(ruta:string){
    ///la ruta es dinamica de acuerdo con la variable recibida
    let info = []
    await get(child(dbRef, `${ruta}`)).then((snapshot) => {
      if (snapshot.exists()) {
        let ans = {...snapshot.val()}
        const cadena = ruta
        const arreglo =cadena.split('/')
        if (arreglo[0]==='clientes'){
          ans.fullname = `${ans.nombre} ${ans.apellidos}`
          info = ans
        }else{
          info = ans
        }
      }
    }).catch((error) => {
      console.error(error);
    });
    return info
  }
  listadoTecnicos(){
    this._usuarios.listatecnicos().then(({contenido,data})=>{
      if(contenido){
        const tecnicos = data
        if (this.SUCURSAL!=='Todas') {
          const filtro = tecnicos.filter(o=>o.sucursal=== this.SUCURSAL)
          this.listaTecnicos = filtro
        }else{
          this.listaTecnicos = tecnicos
        }
      }
      
    })
  }
  registraTecnico(dataTecnico){
    this.dataRecepcion.data['tecnico'] = dataTecnico.id
    this.dataRecepcion.tecnico = dataTecnico.usuario
    // const updates = {};
    // updates[`/recepciones/${idRecepcion}/tecnico`] = dataTecnico.id;
    // update(ref(db), updates)
    // .then(()=>{
    //   this._publicos.mensajeCorrecto('Se registro tecnico de la recepcion')
    // })
    // .catch((error) => {
    //   this._publicos.mensajeIncorrecto('Ocurrio un error' + error)
    // });
  }
 
  //CONSULTA DE VEHICULOS DE CLIENTE
  async listaClientes(){

    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
        this._clientes.ListaClientes().then(({existe,clientes})=>{
          if (existe) {
            if (this.SUCURSAL !== 'Todas' ) {
              this.clientes = clientes.filter(o=>o.sucursal === this.SUCURSAL)
            }else{
              this.clientes = clientes
            }
          }
        })
    })
  }
  async cargaDataCliente(){
    const value = this.myControlClientes.value
    if(!value['id']) return
    this.dataRecepcion.vehiculos = value['vehiculos']
    this.dataRecepcion.data['cliente'] = value['id']
    this.dataRecepcion.cliente = value
    this.dataRecepcion.sucursal = value['infoSucursal']
    this.dataRecepcion.data['sucursal'] = value['sucursal']
    this.dataRecepcion.vehiculo= null
    this.validaciones()
  }
  vehiculosCliente(){
    const starCountRef = ref(db, `vehiculos`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        if (this.dataRecepcion.data['cliente']) {
          // console.log('consulta vehiculos de cliente');
          this._vehiculos.vehiculos(this.dataRecepcion.data['cliente']).then(({informacion,arreglo})=>{{
            if (informacion) {
              this.dataRecepcion['vehiculos'] = arreglo
            }else{
              this.dataRecepcion['vehiculos'] =[]
            }
          }})
        }
      }
    })
  }
  //CONSULTA DE VEHICULOS DE CLIENTE
  // ACCIONES DE VEHICULOS
 
  // ACCIONES DE VEHICULOS 
  listaMarcas_refacciones(){
    const starCountRef = ref(db, `marcas_refacciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.refaccionesMarcas= this._publicos.crearArreglo2(snapshot.val())        
      } else {
        this.refaccionesMarcas = []
        this.marcaSelect = null
      }
    })
  }
  listarPaquetes(){
   
    const starCountRef = ref(db, `paquetes`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        // this.paquetesListos = false
        const paquetes:any[] = await this._catalogos.listaPaquetes()
        for (let index = 0; index < paquetes.length; index++) {
          const element = paquetes[index];
          if (element.elementos) {
            const elementos:any[] = element.elementos
            for (let index = 0; index < elementos.length; index++) {
              const ele = elementos[index];
              let ruta = '';
              if (ele.catalogo) {
                (ele.tipo === 'MO') ? ruta= `manos_obra/${ele.IDreferencia}`:ruta=`refacciones/${ele.IDreferencia}`
              const infoelemento = await this._catalogos.infoElemento(ruta)
              const camposElemento = ['nombre','precio','descripcion']
              for (let indcam = 0; indcam < camposElemento.length; indcam++) {
                const campEle = camposElemento[indcam];
                elementos[index][campEle] = infoelemento[campEle]
              }
              }
            };
            const info = await this._publicos.costodePaquete(element.elementos,this.margen);
            const camposPaquete = ['totalMO','UB','refacciones1','refacciones2','flotilla','precio']
            for (let indcampos = 0; indcampos < camposPaquete.length; indcampos++) {
              const element = camposPaquete[indcampos];
              paquetes[index][element] = info[element]
            }
            paquetes[index].elementos = element.elementos
          }
          }
          if (paquetes.length) {
            const filter = paquetes.filter(o=>o.elementos)
            this.paquetes = paquetes
            this.paquetesListos = false
          }else{
            this.paquetesListos = true
          }
      }
    })
  }
  filtrarPaquetes(cuales:string){
    let muestraPaquetes = []
    switch (cuales) {
      case 'modelo':
        this.modeloFiltro = false
        muestraPaquetes = this.paquetes.filter(o=>o['modelo']=== this.dataRecepcion.vehiculo['modelo'])
        break;
      case 'todos':
        this.modeloFiltro = true
        muestraPaquetes = this.paquetes
        break;
      default:
        break;
    }
    this.colocaPaquetes(muestraPaquetes)
  }
  colocaPaquetes(arreglo:any[]){
    this.dataSourcePaquetes.data = arreglo
    this.newPagination('paquetes')
  }
  colocarpaquete(data:any){
    (!data.elementos) ?data['elementos'] = [] :''
    const dataNew = {...data, enCatalogo:true, cantidad:1,aprobado:true,tipo:'paquete'}
    this.dataRecepcion.elementos.push(dataNew)
    this.realizarOperaciones()
  }
  async mensajeMarca(){
    // this.mostrarPaquetes = false
    const { value: nombrePaquete } = await Swal.fire({
      title: 'Ingresa nombre de marca',
      input: 'text',
      // inputLabel: 'paquete',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value:any) => {
        const caracteresMinimos:number = String(value).length
        if (!value || caracteresMinimos<4) {
          return 'Necesitas escribir nombre de paquete con 3 caracteres minimos'
        }else{
          return null
        }
      }
    })
    if (nombrePaquete) {
      const newPostKey = push(child(ref(db), 'posts')).key
      set(ref(db, `marcas_refacciones/${newPostKey}`), {marca:nombrePaquete} )
          .then(() => {
            this.marcaSelect = newPostKey
          })
          .catch((error) => {
            // The write failed...
          });
      // this.colocarpaquete([{nombre:nombrePaquete,id:newPostKey}])
    }
  }
  crearFormElemento(){
    this.formElemento = this.fb.group({
      paquete:['',[]],
      id:['',[]],
      nombre:['',[Validators.required,Validators.minLength(3), Validators.maxLength(50)]],
      cantidad:['1',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      precio:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      costo:['0',[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(0)]],
      marca:['',[]],
      status:['',[]],
      tipo:['refaccion',[Validators.required]],
      descripcion:['',[]]
    })
  }
  colocarElemento(){
    if (this.formElemento.valid) {
      const infoRecibida = this.formElemento.value
      let camposRecupera = []
      let tipo = '';
      (infoRecibida.tipo)? tipo = infoRecibida.tipo : tipo = 'refaccion';
      (tipo === 'MO') ? camposRecupera = this.camposRecMO : camposRecupera = this.camposRecRefaccion
      const camposForm:any[] = Object.keys(this.formElemento.controls)      
      let saveInfo = {}
      for (let indecamp = 0; indecamp < camposRecupera.length; indecamp++) {
        const recupera = camposRecupera[indecamp];
        for (let indform = 0; indform < camposForm.length; indform++) {
          const formcampo = camposForm[indform];
          if (formcampo === recupera) {
            if (recupera === 'costo') {
              let costo = 0;
              (infoRecibida[recupera]<0 || infoRecibida[recupera] === undefined)? '': costo = infoRecibida[recupera]
              saveInfo[recupera] = costo
              this.formElemento.controls[recupera].setValue(costo)
            }else{
              saveInfo[formcampo] = infoRecibida[formcampo]
              this.formElemento.controls[recupera].setValue(infoRecibida[recupera])
            }
          }
        }
      }
      const newPostKey = push(child(ref(db), 'posts')).key
      if (infoRecibida['id'] && !this.guardarEnCatalogo) {
        //existe en catalogo no agregar
        // console.log(`ans 1 --> ID: ${infoRecibida['id']} - enCatalogo: ${!this.guardarEnCatalogo}`);
        saveInfo['enCatalogo'] = true
      }else if (!infoRecibida['id'] && !this.guardarEnCatalogo) {
        //No existen catalogo y no guaradar
        // console.log(`ans 2 --> ID: ${infoRecibida['id']} - enCatalogo: ${this.guardarEnCatalogo}`);
        saveInfo['id'] = newPostKey
        saveInfo['status'] = false
        saveInfo['enCatalogo'] = false
      }else if (!infoRecibida['id'] && this.guardarEnCatalogo) {
        //BO existe en catalogo y guardar
        // console.log(`ans 3 --> ID: ${infoRecibida['id']} - enCatalogo: ${this.guardarEnCatalogo}`);
        (saveInfo['marca']) ? '': saveInfo['marca'] = '';
        (saveInfo['descripcion']) ? '': saveInfo['descripcion'] = ''
        saveInfo['status'] = true
        saveInfo['id'] = newPostKey
        let ruta='';
        (saveInfo['tipo'] === 'MO')? ruta = `manos_obra/${saveInfo['id']}`: ruta = `refacciones/${saveInfo['id']}`
        const saveInfor1 = {...saveInfo}
        delete saveInfor1['costo']
        let saveInfoFinal = saveInfor1
        
        this._catalogos.saveElemento(ruta,saveInfoFinal).then((ans:any)=>{
            if (ans.resp) {
              saveInfo['enCatalogo'] = true
            }else{
              this._publicos.mensajeIncorrecto(ans.mensaje)
            }
          })
      }
      saveInfo['aprobado'] = true
      this.dataRecepcion.elementos.push(saveInfo)
      this.myControl.setValue(null)
      this.realizarOperaciones()
    }
  }
  async verificaInforElemento(donde:string){
    const value = this.myControl.value
    if (donde === 'subelemento') {
      // this.editarPaquete = true
      // this.elementoAgregar = false
    }else{
      // this.editarPaquete = false
      // this.elementoAgregar = true
    }
    if (!value) { 
      this.infoElemento({nombre:value,'costo':0,precio:0,tipo:'refaccion'})
       }else{
      const proceder = await this._publicos.isObject(value)

      if(proceder){
        this.infoElemento(value)        
      }else{
        this.infoElemento({nombre:value,'costo':0,precio:0,tipo:'refaccion'})
        this.guardarEnCatalogo = true
      }
    }
  }
  infoElemento(info:any){
    const infoRecibida = {...info,cantidad:1}    
    let camposRecupera = [], tipo = '';
    (info.tipo)? tipo = info.tipo : tipo = 'refaccion';
    (info.marca)? this.marcaSelect = info.marca : this.marcaSelect = null;
    (tipo === 'MO') ? camposRecupera = this.camposRecMO : camposRecupera = this.camposRecRefaccion
    const camposForm:any[] = Object.keys(this.formElemento.controls)
    let saveInfo = {}    
    for (let indecamp = 0; indecamp < camposRecupera.length; indecamp++) {
      const recupera = camposRecupera[indecamp];
      for (let indform = 0; indform < camposForm.length; indform++) {
        const formcampo = camposForm[indform];
        if (formcampo === recupera) {
          if (recupera === 'costo') {
            let costo = 0;
            (infoRecibida[recupera]<0 || infoRecibida[recupera] === undefined)? '': costo = infoRecibida[recupera]
            saveInfo[recupera] = costo
            this.formElemento.controls[recupera].setValue(costo)
          }else{
            saveInfo[recupera] = infoRecibida[recupera]
            this.formElemento.controls[recupera].setValue(infoRecibida[recupera])
          }
        }
      }
    }
    this.guardarEnCatalogo = false
  }
  muestraPaquetes(valor:boolean){
    this.showPaquetes = valor
    this.showFormElemento = false
    this.filtrarPaquetes('modelo')
  }
  muestraFormElemento(valor:boolean){
    this.showFormElemento = valor
    this.showPaquetes = false
    // this.formElemento.reset()
    this.myControl.setValue(null)
  }
  listarRefacciones(){
    const starCountRef = ref(db, `refacciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._catalogos.listaRefacciones().then((refacciones:[])=>{
          this.refacciones = refacciones          
        })     
      }
    })
  }
  listarMO(){
    const starCountRef = ref(db, `manos_obra`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this._catalogos.listaMO().then((MO:[])=>{
          this.MO = MO
        })     
      }
    })
  }
  accionesRealiza(index:number,val:any){
    this.dataRecepcion.elementos[index].aprobado = val._checked 
    if (val._checked) {  
      this.dataRecepcion.elementos[index].showStatus = 'Aprobado'  
      this.dataRecepcion.elementos[index].status = 'aprobado'  
    }else{
      this.dataRecepcion.elementos[index].showStatus = 'No aprobado'
      this.dataRecepcion.elementos[index].status = 'noAprobado'  

    }
     
    // console.log(this.dataRecepcion.elementos);
    this.revisarAvance()
    this.realizarOperaciones()
  }
  eliminaElemento(index:number){
    Swal.fire({
      title: 'Desea eliminar elemento de recepción?',
      // showDenyButton: true,
      showCancelButton:   true,
      confirmButtonText: 'Eliminar',
      cancelButtonText:  'Cancelar'
      // denyButtonText: `Don't save`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.dataRecepcion.elementos[index] = null
        const nuevos  = this.dataRecepcion.elementos.filter(o=>o !== null)
        this.dataRecepcion.elementos = nuevos
        this.realizarOperaciones()
        this._publicos.mensajeCorrecto('elemento eliminado')
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })
    
  }
  muestraDetallespaquete(data:any){
    // console.log(data);
    this.elementosPaquete = data.elementos
    // console.log(this.elementosPaquete);
    
  }
  restaurarOriginales(){
    if (JSON.stringify(this.dataRecepcion.elementos) === JSON.stringify(this.dataRecepcion.elementos_originales)) {
      this._publicos.mensajeIncorrecto('No hay ningún cambio no es necesaria esta acción')
    }else{
      Swal.fire({
      title: 'Desea cargar los elementos originales de la cotización?',
      html:`<strong class='text-danger'>ADVERTENCIA: No podrá revertir esta acción</strong>`,
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: `CANCELAR`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.dataRecepcion.elementos = []
        this.dataRecepcion.elementos = [...this.dataRecepcion.elementos_originales]
        this.realizarOperaciones()
      }
    })
    }
    
  }
  seleccionarAlls(){
    for (let index = 0; index < this.dataRecepcion.elementos.length; index++) {
      this.dataRecepcion.elementos[index].aprobado = this.seleccionarTodo
    }
    this.revisarAvance()
    this.realizarOperaciones()
  }
  cambiarIva(){
    this.dataRecepcion.data['iva'] = this.IVA
    this.realizarOperaciones()
  }
  cambiarMargen(margen:any){
    let marge = parseInt(margen)
    if (marge) {
      if(marge<25 || marge>100){
        marge = 25
        this.margen = 25
        this.dataRecepcion.data['margen'] = marge
        this.realizarOperaciones()
      }else{
        this.dataRecepcion.data['margen'] = marge
        this.realizarOperaciones()
      }
    }
    
  }
  realizarOperaciones(){
    const dataCotizacion = this.dataRecepcion.elementos    
    const margen =  this.dataRecepcion.data['margen']
    let mo=0, refacciones1 =0,refacciones2=0,totalImportante=0
    for (let index = 0; index < dataCotizacion.length; index++) {
      const element = dataCotizacion[index];
      if (element.aprobado) {
        const cantidad = element.cantidad
        if (element.tipo === 'paquete') {
          
            if (element.costo>0) {
              totalImportante = totalImportante + (cantidad * element.costo)
            }else{
              const Subelementos = element.elementos
              if (element.elementos) {
                const infoPaquete = this._publicos.costodePaquete(Subelementos,margen)
                mo = mo + infoPaquete.mo
                refacciones1 = refacciones1 + infoPaquete.refacciones1
                refacciones2 = refacciones2 + infoPaquete.refacciones2
                dataCotizacion[index].subtotal = infoPaquete.flotilla
              }
            }       
          
        }else if (element.tipo === 'MO') {
          if (element.costo>0) {
            const operacion = cantidad * element.costo
            totalImportante = totalImportante + operacion
            dataCotizacion[index].subtotal = operacion
          }else{
            const operacion = element.precio * cantidad
            mo = mo + operacion
            dataCotizacion[index].subtotal = operacion
          }
        }else if (element.tipo === 'refaccion') {
          if (element.costo>0) {
            // console.log('aqui');
            
            
            const operacion = cantidad * element.costo
            totalImportante = totalImportante + operacion
            dataCotizacion[index].subtotal = operacion
          }else{
            const operacion = element.precio * cantidad
            refacciones1 = refacciones1 + operacion
            const opera2 =  operacion * (1 + (margen / 100))
            refacciones2 = refacciones2 + opera2
            
            
            dataCotizacion[index].subtotal = operacion
          }              
        }  
      }
    }
    // console.log(mo);
    // console.log(refacciones2);
    // console.log(totalImportante);
    const opera = refacciones2 + mo +totalImportante
    this.dataRecepcion.data.totalMO = mo
    this.dataRecepcion.data.sobrescrito = totalImportante
    this.dataRecepcion.data['refacciones1'] = refacciones1
    this.dataRecepcion.data['refacciones2'] = refacciones2
    if (this.IVA) {
      const nuevo = opera * 1.16
      const ivaNuevo  = opera * .16
      this.dataRecepcion.data.subtotal =  opera
      this.dataRecepcion.data.IVA =  ivaNuevo
      this.dataRecepcion.data.total =  nuevo
    }else{  
      this.dataRecepcion.data.total =  opera
    }
    // this.verificarInformacion()
  }
  revisarDeatllesNinguno(){
    for (let index = 0; index < this.dataRecepcion.detalles.length; index++) {
       this.dataRecepcion.detalles[index].checado = false;
    }
  }
  revisarDeatlles(index:number,val:any){
    this.dataRecepcion.detalles[index].checado = val._checked
  }
  cambiarSattus(index:number, val:any){
    this.dataRecepcion.checkList[index].status = val.value
    // this.verificarInformacion()
    this.revisarAvance()
  }
  obtenerFecha(fecha:any){
    // console.log(fecha);
    const timeRequest = this._publicos.getFechaHora()
    // console.log(timeRequest);
    const dias = this._publicos.restaFechas(timeRequest.fecha , fecha)
    if (dias < 0) {
      this.diasEntrega = null
      this.dataRecepcion.data['fechaPromesa'] = null
      this.dataRecepcion.data['showfecha'] = null
      this._publicos.mensajeIncorrecto('Seleccione otra fecha de entrega')
    }else{
      this.diasEntrega = dias
      this.dataRecepcion.data['fechaPromesa'] = fecha
      this.dataRecepcion.data['showfecha'] = this._publicos.obtenerFechaCompleta(fecha)
      this.revisarAvance()
    }
    // this.verificarInformacion()
  }
  limpiarFirma(){
    this.SignaturePad.clear()
    this.imgFirma = null
    this.revisarAvance()
    // this.verificarInformacion()
  }
  firmar(){
    const u = this.SignaturePad.toDataURL()
    if (!this.SignaturePad.isEmpty()) {
       this.descargar(u).then((ans:any)=>{
          this.imgFirma = ans
          // this.verificarInformacion()
          // this._publicos.mensajeCorrecto('Tenemos el blob')
          this.revisarAvance()
      })
    }else{
      this.imgFirma = null
      this._publicos.mensajeIncorrecto('La firma no puede estar vacia!!')
      this.revisarAvance()
      // this.verificarInformacion()
    }
    
    
  }
  subirFirma(){
    this._uploadfirma.upload(this.imgFirma,'nuevo','recepcion1p','recepcion').then((ans:any)=>{
        console.log(ans);
    })
  }
  async descargar(dataURL:any){
    let blobGet:Blob
    if (navigator.userAgent.indexOf('safari')>-1 && navigator.userAgent.indexOf('Chrome')===-1) {
      window.open(dataURL)
    }else{
      blobGet = this.UrltoBlob(dataURL)
    }
    return blobGet
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

  ListapartesVehiculo(){
    // console.log(this.detalles_rayar);
    const urlimg = '../../../assets/imagenes_detalles'
    let nuevoArreglo = []
    let arraynew = []
    for (let index = 0; index < this.detalles_rayar.length; index++) {
      const element = this.detalles_rayar[index];
      const split = element.split('_')
      const mostrar = split.join(' ')
      const foto = `${urlimg}/${element.toLowerCase()}.jpg`
      const temp2 = {
        id: element,
        checado: false,
        index,
      }
      const temp1 = {
        id: element,
        foto,
        mostrar
      }
      arraynew.push(temp1)
      nuevoArreglo.push(temp2)
    }
    this.vehiculosDetalles = arraynew
    this.dataRecepcion.detalles = nuevoArreglo
    // this.verificarInformacion()
  }
  ListaCheckList(){
    this._vehiculos.checklist().then((ans:any)=>{
      let nuevos = []
      for (let index = 0; index < ans.length; index++) {
        const element = ans[index];
        const campos = Object.keys(element)
        let opciones =[], arreglo={id:'',opciones:[],status:null,mostrar:''}
        for (let ind = 0; ind < campos.length; ind++) {
          const campo = campos[ind];
          if (campo !== 'id') {
            opciones.push(element[campo])
          }else{
            arreglo.id = element[campo]
          }
        }
        // if (element['id'] === 'nivel_gasolina') {
        //   arreglo.status = 'lleno'
        // }else{
          // arreglo.status = 'si'
        // }
        const mos = element['id'].split('_')
        arreglo.mostrar = mos.join(' ')
        
        arreglo.opciones = opciones
        nuevos.push(arreglo)
      }
      this.dataRecepcion.checkList = nuevos
      // console.log(nuevos);
      
    })
  }
  autocompletar(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','elementos')),
    );
    this.filteredOptionsCotizacionesAUTO = this.myControlCotizacionesAUTO.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','auto')),
    );
    this.filteredOptionsClientes = this.myControlClientes.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','clientes')),
    );
  }
  private _filter(value: string,donde:string): string[] {
    const filterValue =String( value).toLowerCase();
    let data =[]
    switch (donde) {
      case 'elementos':
        const ambos = this.MO.concat(this.refacciones)
        const filtrados = ambos.filter(option => option['nombre'].toLowerCase().includes(filterValue));
        data = this._publicos.ordernarPorCampo(filtrados,'nombre')
        break;
        case 'auto':
          const filtrad = this.cotizacionesAUTO.filter(option => option['no_cotizacion'].toLowerCase().includes(filterValue));
          data = this._publicos.ordernarPorCampo(filtrad,'no_cotizacion')
          break;
        case 'clientes':
          const filtra = this.clientes.filter(option => option['no_cliente'].toLowerCase().includes(filterValue));
          data = this._publicos.ordernarPorCampo(filtra,'no_cliente')
          if(!filtra.length){
            const filtra2 = this.clientes.filter(option => option['fullname'].toLowerCase().includes(filterValue));
            data = this._publicos.ordernarPorCampo(filtra2,'fullname')
          }
          break;
      default:
        break;
    }
    return data
  }
  displayFn(elementos: any): string {
    return elementos && elementos.nombre ? elementos.nombre : '';
  }
  displayFnAUTO(elementos: any): string {
    return elementos && elementos.no_cotizacion ? elementos.no_cotizacion : '';
  }
  displayFnClientes(elementos: any): string {
    return elementos && elementos.no_cliente ? elementos.no_cliente : '';
  }
  RealizaRecepcion(){  


    let  detalles = []

    if(!this.SinDetalles) delete this.dataRecepcion.data['detalles']

    if (this.dataRecepcion.data['detalles']) detalles = this.dataRecepcion.data['detalles']

    if(!this.archivos.length && !detalles.length ){
      this._publicos.mensaje_pregunta('Continuar recepcion sin ningun tipo de detalle?').then(({respuesta})=>{
          if (!respuesta) return
          this.continua_respuesta([])
      })
    }else{
      this.continua_respuesta(this.archivos)
    }
  }

  async continua_respuesta(archivos:any[]){
      // console.log(archivos);
      const camposDataRecupera = ['cliente','fechaPromesa','iva','margen','no_os','sucursal','vehiculo','aprobado','formaPago','servicio']

      const newPostKey = push(child(ref(db), 'posts')).key
      await this._publicos.recuperaDataArreglo(camposDataRecupera,this.dataRecepcion.data).then((ans)=>{
        const infoSucursal = this.dataRecepcion.sucursal['sucursal']
        this._servicios.no_OS(infoSucursal,'GE').then(async (answer:string)=>{
          let infoSave = {...ans}        
          // infoSave = ans
          infoSave['no_os'] = answer
          const timeRequest = this._publicos.getFechaHora()
          infoSave['fecha_recibido'] = timeRequest.fecha
          infoSave['hora_recibido'] = timeRequest.hora
          infoSave['status'] = 'recibido'
          infoSave['checkList'] = this.dataRecepcion.checkList;
          (!this.SinDetalles) ?  delete this.dataRecepcion.data['detalles'] : infoSave['detalles'] = this.dataRecepcion.detalles
          infoSave['servicios'] = this.dataRecepcion.elementos
          infoSave['servicios_original'] = this.dataRecepcion.elementos

          if (archivos.length) {
            await this._uploadfirma.upload(this.imgFirma,newPostKey,answer,'recepcion').then((ansFirma:any)=>{
              const inter = setInterval(async () => {
                if (ansFirma['ruta']) {
                  infoSave['firmaCliente'] = ansFirma.ruta
                  // this.realizarRecepcion(newPostKey,infoSave)
                  clearInterval(inter); 
                  
                  if (this.fotografias && this.detallesPersonalizado) {
                                  
                  }else if(this.fotografias && !this.detallesPersonalizado){
                    const f = this.archivos
                    this.archivos = f.filter(o=>o.nombreArchivo !== 'detallesPersonalizado.png')
                  }else if(!this.fotografias && this.detallesPersonalizado){
                    const f = this.archivos
                    this.archivos = f.filter(o=>o.nombreArchivo === 'detallesPersonalizado.png')
                  }else if(!this.fotografias && !this.detallesPersonalizado){
                    this.archivos = []
                    this.files = []
                  }
                  await this._uploadFiles.guardarFotografias(this.archivos,infoSave['no_os'])
                  this.thisver(newPostKey,infoSave)
                }
              }, 500);            
            }) 
          }else{
            await this._uploadfirma.upload(this.imgFirma,newPostKey,answer,'recepcion').then((ansFirma:any)=>{
              const inter = setInterval(async () => {
                if (ansFirma['ruta']) {
                  infoSave['firmaCliente'] = ansFirma.ruta
                  clearInterval(inter); 
                  this.thisver(newPostKey,infoSave)
                }
                
              },500)
            })
            
          }
        })
      })
     
  }
  async returnUrl(){
    let detallesPersonalizados = []
    for (let index = 0; index < this.archivos.length ; index++) {
      const foto = this.archivos[index];
      if (foto.url) {
            // b.textContent = String(Swal.getTimerLeft())
            // clearInterval(intervalo1)
            const data = await {campo:foto.nombreArchivo, url:foto.url}
            detallesPersonalizados.push(data)
            // b.textContent = `${contador}`
          }
    }
    return detallesPersonalizados
  }
  async thisver(newPostKey:string,infoSav:any){
    // console.log(infoSav);
    if (this.archivos.length) {
      let timerInterval
    Swal.fire({
      title: 'Espere porfavor!',
      // html: 'I will close in <b></b> milliseconds.',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(async () => {
          // b.textContent = String(Swal.getTimerLeft())
          // setTimeout(async ()=>{
            const urlSS:any[] = await this.returnUrl()
            infoSav['detallesPersonalizados'] = urlSS
          // },1200)
        }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // console.log('I was closed by the timer')
        // console.log(infoSav);
        this.realizarRecepcion(newPostKey,infoSav)
      }
    })
    }else{
      this.realizarRecepcion(newPostKey,infoSav)
    }
  }
  async subirFotografias(newPostKey:string){
    let subidas = false
    const ruta = `recepciones/fotografiasDetalles/${newPostKey}/`
    await this._uploadFiles.guardarFotografias(this.archivos,ruta)
    let contadorImagenes = this.archivos.length
    let intervaloFotografias = setInterval(()=>{
      let contadorSubidos = 0
        for (let index = 0; index < this.archivos.length; index++) {
          const element = this.archivos[index];
          if (element.progreso >=100) {
            contadorSubidos++
          }
          if (contadorSubidos === contadorImagenes) {
            clearInterval(intervaloFotografias)
            // console.log('todas las imagenes se subieron correctamente');
            subidas = true
          }
        }
    },500)

    return subidas
    
  }

  realizarRecepcion(newPostKey:string,data:any){
    // VERIFICAR QUE LA INFORMACION 
    
    // console.log(data);
    


    const camposVerificar = ['checkList','cliente','fechaPromesa','fecha_recibido','hora_recibido','iva',
    'margen','no_os','servicios','servicios_original','status','sucursal','formaPago','servicio',
    'vehiculo','firmaCliente']
    const camposRecibidos = Object.keys(data)
    
    
    if(data['tecnico']) camposVerificar.push('tecnico')
    
    camposRecibidos.sort()
        camposVerificar.sort()
        let contadorNoexisten:number = 0, contadorCorrectos:number = 0, arregloNOexisten=[], arregloExisten=[]
        for (let camposVerifica = 0; camposVerifica < camposVerificar.length; camposVerifica++) {
          const verifica = camposVerificar[camposVerifica];
          if (!data[verifica] && verifica!=='tecnico') {
            contadorNoexisten++
            arregloNOexisten.push(verifica)
          }else{
            contadorCorrectos++
            arregloExisten.push(verifica)
          }
        }
        
        if (camposVerificar.length === contadorCorrectos) {
          this.mensajeError = null
          let serviciosLista = []
          for (let index = 0; index < this.dataRecepcion.elementos.length; index++) {
            const element = this.dataRecepcion.elementos[index];
            serviciosLista.push(element.nombre)
          }
          const arregloString = serviciosLista.join(', ')
          let desgloce ={}
        
          
            let desgloceMin:any[] = []
    
            if (this.IVA) {
              let desglocse=[{nombre: 'Refacciones', valor:'refacciones2'},
              {nombre: 'MO', valor:'totalMO'},{nombre: 'Subtotal', valor:'subtotal'},{nombre: 'IVA', valor:'IVA'},
              {nombre: 'Total', valor:'total'}]
              for (let index = 0; index < desglocse.length; index++) {
                const element = desglocse[index];
                desgloceMin.push(`${element.nombre}: ${this._publicos.redondeado(this.dataRecepcion.data[element.valor])} <br>`)
              }
            }else{
              let desglocse=[{nombre: 'Refacciones', valor:'refacciones2'},{nombre: 'MO', valor:'totalMO'},{nombre: 'Total', valor:'total'}]
              for (let index = 0; index < desglocse.length; index++) {
                const element = desglocse[index];
                desgloceMin.push(`${element.nombre}: ${this._publicos.redondeado(this.dataRecepcion.data[element.valor])} <br>`)
              }
            }
            this.gurdarFinal(newPostKey,data,arregloString,desgloceMin.join(' '))
          
          
        }else{
          this._publicos.mensajeIncorrecto(`Falta información`)
          const texto = arregloNOexisten.join(', ')      
          this.mensajeError = texto
        }
    
  }

  validaciones(){
    const answer = {valida: true,faltantes:[]}
    // console.log(this.dataRecepcion);

    const camposRequwridos =['cliente','data','detalles','elementos','sucursal','vehiculo','checkList']

    if (!this.dataRecepcion['cliente']['correo']) {
      answer.faltantes.push('Correo de cliente')
    }
    camposRequwridos.forEach((campo)=>{
      if (!this.dataRecepcion[campo]) {
        answer.faltantes.push(campo)
      }
    })
    // this.dataRecepcion['cliente']['correo'] = null
    if (answer.faltantes.length) answer.valida = false
    
    if (answer.faltantes.length) {
      this.detallesFaltantes = answer.faltantes.join(', ')
    }else{
      
      this.detallesFaltantes = null
    }

    // this.progreso = 100
     this.revisarAvance()
    
    return answer
  }

  revisarAvance(){
    //verificar los pasos que no estan completos y que se requieren
    //ademas de obtener el porcentaje de avance
    this.pasosFaltantes = {servicios: true, checkList: true, firmaCliente: true, entrega: true}

    let avance = 0;    const porcentaje =100/5

    const servicios = this.dataRecepcion['elementos'].filter(o=>o['aprobado']);

    (servicios.length) ?  avance += porcentaje : this.pasosFaltantes.servicios = false;
    
    const elementos = this.dataRecepcion.checkList.filter(o=>!o.status);
    
    (!elementos.length && this.kilometraje>0) ?  avance += porcentaje : this.pasosFaltantes.checkList = false;

    (this.diasEntrega !== null) ? avance += porcentaje : this.pasosFaltantes.entrega = false;

    (this.imgFirma !== null) ? avance += porcentaje : this.pasosFaltantes.firmaCliente = false;


    (this.SinDetalles) ? avance += porcentaje : avance += porcentaje

    this.progreso = avance

  }
  gurdarFinal(newPostKey:string,data:any,arregloString:string,desgloce:any){
    // console.log(data);
    
    let correos:any[] =[]
    correos.push(this.dataRecepcion.sucursal['correo']);    
    (this.dataRecepcion.cliente['correo'])? correos.push(this.dataRecepcion.cliente['correo']):'';
    (this.dataRecepcion.cliente['correo_sec'])? correos.push(this.dataRecepcion.cliente['correo_sec']):''
    const dataMail = {
      correos,
      no_os: data['no_os'],
      cliente: this.dataRecepcion.cliente,
      vehiculo: this.dataRecepcion.vehiculo,
      arregloString,
      desgloce
    }    
    data['notifico'] = true

    
    
    
    
    
    
    const campos = ['apellidos','correo','correo_sec','fullname','id','no_cliente','nombre','sucursal','telefono_fijo','telefono_movil','tipo']
    const cliente = this._publicos.recuperaData(campos,this.dataRecepcion['cliente'])
    if (!cliente['empresa']) {
      cliente['empresa'] =''
    }
    // console.log(this.dataRecepcion);

    let obs = ''
    if (this.observaciones.controls['observaciones'].value) {
      obs = this.observaciones.controls['observaciones'].value
    }
    const infoPdf = {
      checkList: this.dataRecepcion['checkList'],
      cliente,
      no_os:data['no_os'],
      observaciones: obs,
      fecha: this._publicos.getFechaHora().fecha,
      detalles: this.dataRecepcion['detalles'],
      elementos: this.dataRecepcion['elementos'],
      imagenBase64: this.dataImagen,
      sucursal: this.dataRecepcion['sucursal'],
      vehiculo: this.dataRecepcion['vehiculo'],
    }

    let timerInterval
    Swal.fire({
      title: 'Espere por favor..',
      html: 'Se esta realizando procedimiento',
      timer: 10000,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
        const b = Swal.getHtmlContainer().querySelector('b')
        timerInterval = setInterval(() => {
          // b.textContent = String(Swal.getTimerLeft())
        }, 100)
      },
      willClose: () => {
        // clearInterval(timerInterval)
      }
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        // console.log('I was closed by the timer')
      }
    })
    console.log(infoPdf);

    return
    
    // console.log(infoPdf);
    this._pdfRecepcion.pdf(infoPdf).then((ans:any)=>{
      const pdfDocGenerator = pdfMake.createPdf(ans);
      // pdfMake.createPdf(ans).open();
      dataMail['filename'] = `${infoPdf['no_os']}.pdf`,



      pdfDocGenerator.getBlob(async (blob) => {
       this._pdf.uploadRecepcion(blob, dataMail['filename']).then((asn)=>{
         let intervalo = setInterval(()=>{
          // console.log(asn);
          if (asn.ruta) {
            clearInterval(intervalo)
            // console.log(asn.ruta);
            dataMail['pathPDF'] = asn.ruta
            const updates = {};
            updates[`recepciones/${newPostKey}`] = data;
            update(ref(db), updates).then(()=>{
              pdfMake.createPdf(ans).download(dataMail['filename']);
              this._mail.EmailRecepcion(dataMail)
              clearInterval(timerInterval)
              this.router.navigateByUrl('/servicios')
              this._publicos.mensajeCorrecto('recepcion realizada')
            });
          }
        },100)
        
       })
        // console.log(rutaPDF);
        
        // this._mail.EmailRecepcion(dataMail).then(()=>{
            
        // })
      })
    })
    
    // console.log(dataMail);
    // this._mail.EmailRecepcion(dataMail).then(()=>{
    //   set(ref(db, `recepciones/${newPostKey}`), data )
    //     .then(() => {
    //       this.dataRecepcion={data:{},elementos:[],cliente:[],vehiculo:[],sucursal:[],detalles:[],checkList:[]}
    //       this.realizarOperaciones()
    //       this.archivos = []
    //       this.disableBtnGuardarIMG = false
    //       this._publicos.mensajeCorrecto('Nueva OS registrada')
    //       this.router.navigateByUrl('/servicios')
    //     })
    //     .catch((error) => {
    //       // The write failed...
    //     });
    // })
  
  }
  applyFilter(event: Event, table:string) {
    const filterValue = (event.target as HTMLInputElement).value;
      if (table==='elementos') {
          this.dataSource.filter = filterValue.trim().toLowerCase();
          if (this.dataSource.paginator){
            this.paginator.firstPage()
          }
      }else if (table==='paquetes'){
        this.dataSourcePaquetes.filter = filterValue.trim().toLowerCase();
        if (this.dataSourcePaquetes.paginator){
          this.dataSourcePaquetes.paginator.firstPage()
        }
      }
  }

  clientesInfo(info:any){
    if (info['registro']) {
      const cliente = this.clientes.find(c=>c['id'] === info['cliente']['id'])
      this.myControlClientes.setValue('')
      setTimeout(()=>{
        this.myControlClientes.setValue(cliente)
        let vehiculosX = cliente['vehiculos']
        const veh = vehiculosX.find(v=>v['id'] === this.dataRecepcion['data']['vehiculo']);
        this.dataRecepcion['vehiculo'] = veh 
      },100)
    }
}
vehiculoInfo(info:any){
  if (info['registro']) {
    this.clientes.map(c=>{
      if(!c['vehiculos'].length) return
     const vehiculos:any[] = c['vehiculos']
     vehiculos.map(v=>{
         if(v['id'] === info['vehiculo'].id){
           this.dataRecepcion.vehiculos = c['vehiculos']
           this._publicos.recuperaDataArreglo(this.camposCliente,c).then(async (recuperada)=>{
             this.myControlClientes.setValue(recuperada)
             if(this.SUCURSAL === 'Todas') this.dataRecepcion.data['sucursal'] = recuperada['sucursal']
             this.dataRecepcion.vehiculos = vehiculos
             this.dataRecepcion.data.cliente = info['vehiculo']['cliente']
             this.dataRecepcion.cliente = recuperada
             this.dataRecepcion.data.vehiculo = info['vehiculo']['cliente']

             let vehiculosX = c['vehiculos']
             const veh = vehiculosX.find(v=>v['id'] === this.dataRecepcion['data']['vehiculo']);
              (veh) ? this.dataRecepcion['vehiculo'] = veh : this.dataRecepcion['vehiculo'] = null
           })
       }
     })
   })
  }else{
    this._publicos.mensajeIncorrecto('Accion no realizada')
    this.dataRecepcion.data.vehiculo = null
    this.dataRecepcion.vehiculo = null
  }

}
// CANVAS
comenzar(){
  setTimeout(() => {
    if (this.detallesPersonalizado) {
      this.principal()
    }
  }, 500);
}
  async principal(){
    // const mainCanvas = document.getElementById("")
    this.limpiarCanvas()
    this.disableBtnGuardarIMG = false
    this.contieneIMG = false
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
      context.strokeStyle =`#${this.colorPluma}`
      context.lineCap = "round"
      context.lineJoin = "round"
      context.lineTo(cursorX, cursorY)
      context.stroke()
      initialX = cursorX
      initialY = cursorY
    }
    const mouseDown =(evt)=>{      
      this.contieneIMG = true
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
      this.contieneIMG = true
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
          context.strokeStyle =`#${this.colorPluma}`
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
    // const mainCanvas = <HTMLCanvasElement> document.getElementById('main-canvas');
    
    // const context = mainCanvas.getContext("2d")
    // context.clearRect(0,0,700,500);
 }
 async guardarImagenCanvas(){
  this.disableBtnGuardarIMG = true
  this.blobDetallesPersonalizado = null
  await html2canvas(document.querySelector("#main-canvas")).then(async(canvas) => {
    const datURL = await canvas.toDataURL()
    const blob = this.UrltoBlob(datURL)
    
    const file = new File([blob], `detallesPersonalizado.png.png`,{
      type: blob.type,
    })
    this.files.push(file)

    this.blobDetallesPersonalizado = blob
    this.archTemp={
      archivo:blob,
      nombreArchivo:'detallesPersonalizado.png',
      estaSubiendo:false,
      progreso:0
    }
    this.nombre= 'detallesPersonalizado'
    this.archivos.push(this.archTemp)
    this._publicos.mensajeCorrecto('imagen generada')
    
    
  });
 }
 changePluma(color:string){
    this.colorPluma = color
 }
 
// CANVAS
  limpiarArchivos(){
    this.archivos = []

  }
  newPagination(data:string){
    setTimeout(() => {
    if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }else if (data==='paquetes') {
      this.dataSourcePaquetes.paginator = this.paginatorPaquetes;
      this.dataSourcePaquetes.sort = this.sortPaquetes
    }
    }, 500)
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

  clienteSelect(){
    
    this.cliente = null
    setTimeout(()=>{
      if (this.dataRecepcion['cliente']) {
        this.cliente = this.dataRecepcion['cliente']
      }
    },300)
  }
  
}
