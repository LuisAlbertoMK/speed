import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { child, get, getDatabase, onValue, push, ref, update } from "firebase/database";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { map, startWith } from 'rxjs/operators';
pdfMake.vfs = pdfFonts.pdfMake.vfs
//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';


import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { PdfService } from 'src/app/services/pdf.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import Swal from 'sweetalert2';
import { ClientesService } from '../../services/clientes.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { EmailsService } from '../../services/emails.service';
import { UploadPDFService } from '../../services/upload-pdf.service';
import { VehiculosService } from '../../services/vehiculos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {nombre: string, apellidos:string}
@Component({
  selector: 'app-cotizacion-new',
  templateUrl: './cotizacion-new.component.html',
  styleUrls: ['./cotizacion-new.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CotizacionNewComponent implements OnInit,AfterViewInit {
  miniColumnas:number = 100
  ROL:string=null;SUCURSAL:string=null; cotizaciones:any[]=[];

  meses:number = 0
camposDesgloce = [
  {show:'MO', valor:'mo'},
  {show:'costo de refaccion', valor:'refacciones_1'},
  {show:'precio de venta refaccion', valor:'refacciones_2'},
  {show:'sobrescrito MO', valor:'sobrescrito_mo'},
  {show:'sobrescrito refacciones', valor:'sobrescrito_refaccion'},
  {show:'sobrescrito paquetes', valor:'sobrescrito_paquetes'},
  {show:'iva', valor:'iva'},
  {show:'subtotal', valor:'subtotal'},
  {show:'total', valor:'total'},
  // {show:`meses ${this.meses}`, valor:'meses'},
]

  infoCotizacion:any={cliente:{},vehiculo:{},elementos:[],sucursal:{},
                      data:{iva:true,formaPago:1,servicio:1,margen:25,descuento:0,promocion:'ninguna'},
                      reporte:{...this.camposDesgloce['valor']},
                      nota:'',descripcion:''
                    }
  informacionValidad:boolean = false

  detalles:boolean = false

  margen:number = 25; iva:boolean = true; clientes:any=[]; paquetes:any[]=[];paquetesListos:boolean = true
  refacciones:any[]=[]; refaccionesMarcas:any[]=[]; marcaSelect:string = null
  manos_obra:any[]=[]; refaccionesListo:boolean = true; manos_obraListo:boolean = true
  elementosConjunto:any[]=[]; elementoAgregar:boolean = false; guardarEnCatalogo:boolean = true;
  indexPaquete:number = null; editarPaquete:boolean = false; mostrarPaquetes:boolean = false; descuento:number =0

  formaPago:number = 1; formaPago1:boolean = false

  deshabilitarButtonGuardarCotizacion:boolean = false

  promociones=['ninguna','facebook','cartelera','instagram','radio']; promocion:string = 'ninguna'
  servicios=[
    {valor:1,nombre:'servicio'},
    {valor:2,nombre:'garantia'},
    {valor:3,nombre:'retorno'},
    {valor:4,nombre:'venta'},
    {valor:5,nombre:'preventivo'},
    {valor:6,nombre:'correctivo'},
    {valor:7,nombre:'rescate vial'}
  ]

  paquetesSinElementosShow:string = ''

  formasPAgo=[
    {id:1,pago:'contado',interes:0,numero:0},
    {id:2,pago:'3 meses',interes:4.49,numero:3},
    {id:3,pago:'6 meses',interes:6.99,numero:6},
    {id:4,pago:'9 meses',interes:9.90,numero:9},
    {id:5,pago:'12 meses',interes:11.95,numero:12},
    {id:6,pago:'18 meses',interes:17.70,numero:18},
    {id:7,pago:'24 meses',interes:24.,numero:24}
  ]
  dataImagen:any;


  formElemento: FormGroup;
  formCliente: FormGroup;
  tipoCli:string = 'particular'
  telfono_valido:boolean = true; correoExistente:boolean = false; nombreEmpresaValido:boolean = true; tipoClienteValido:boolean = false

  formaVehiculoManual:FormGroup;
  existenPlacas:boolean = false; listaArrayAnios:any[]=[]; marcas:any[]=[];arrayModelos:any[]=[]; colores:any=[]
  engomados=['amarillo','azul','rojo','rosa','verde']

  sucursales:any[]=[]; modelo:boolean = true


  camposCliente=['no_cliente','nombre','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','empresa','sucursal']
  camposVehiculo=['placas','marca','modelo','anio','categoria','cilindros','engomado','color','transmision','no_motor','vinChasis','marcaMotor']

  desgloceSINIVA:any=[ {nombre: 'Refacciones Adquisición', valor:'totalRefacciones1'},{nombre: 'Refacciones Venta', valor:'totalRefacciones2'},{nombre: 'MO', valor:'totalMO'},{nombre:'Sobrescrito', valor:'sobrescrito'},{nombre:'Descuento', valor:'descuento'}]
  desgloceIVA:any=[ ...this.desgloceSINIVA,{nombre: 'subtotal', valor:'subtotal'},{nombre: 'IVA', valor:'IVA'}]
  precios:any=['flotilla','normal']
  // autocomplete
  myControl = new FormControl(''); //cotizaciones
  filteredOptions: Observable<string[]>; //cotizaciones
  myControlClientes = new FormControl(''); //clientes
  filteredOptionsClientes: Observable<string[]>; //clientes
  myControlElemento = new FormControl(''); //elementos
  filteredOptionsElemento: Observable<string[]>; //elementos
  // autocomplete

  // tabla
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','nombre','cantidad','sobrescrito','precio','normal','flotilla']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  dataSourcePaquetes = new MatTableDataSource(); //paquetes
  paquetesColumns = ['nombre','precio','normal','flotilla']; //paquetes
  columnsToDisplayWithExpandpaquetes = [...this.paquetesColumns,'opciones', 'expand']; //paquetes
  @ViewChild('PaquetesPaginator') paginatorPaquetes: MatPaginator //paquetes
  @ViewChild('Paquetes') sortPaquetes: MatSort //paquetes


  clickedRows = new Set<any>() //todas las tablas
  // tabla
  // archivoSubido
  @Input() mostrar2: boolean;
  @Output() archivoSubido = new Output()
  listaEmpresas = []
  Sucursales = []



  datCliente:any

  cliente:string = null

  vehiculo:string = null

  valida:boolean = false
  cuales:string = null
  empresas=[]
  ordenamiento : boolean = true

  reporte = {
    iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
    subtotal:0, total:0, ub:0, meses:0, descuento:0
  }

  

  camposReporte = [
    {valor:'refacciones_a',show:'Refacciones costo'},
    {valor:'mo',show:'Mano de obra'},
    {valor:'refacciones_v',show:'Refacciones precio'},
    {valor:'sobrescrito_mo',show:'Precio sobrescrito MO'},
    {valor:'sobrescrito_refaccion',show:'Precio sobrescrito Refacciones'},
    {valor:'sobrescrito_paquetes',show:'Precio sobrescrito paquetes'},
    {valor:'iva',show:'iva'},
    {valor:'subtotal',show:'subtotal'},
    {valor:'total',show:'Total'},
  ]
  
  constructor(private _mail:EmailsService, private fb: FormBuilder, private router: Router,
              private rutaActiva: ActivatedRoute,private _uploadPDF: UploadPDFService,
              private _cotizaciones: CotizacionService, private _sucursales: SucursalesService,
              private _publicos:ServiciosPublicosService, private _clientes:ClientesService,
              private _vehiculos:VehiculosService, private _catalogos:CatalogosService,
              private _pdf:PdfService,private _email:EmailsService, private _security:EncriptadoService
              ) { }
  async ngOnInit() {
    this.primero()
    this.listaMO()
    this.listaRefacciones()
    // this.listaMarcas_refacciones()
    this.consultaMarcas()
    // this.colores_autos()
    // this.crearFormElemento()
    this.listaSucursales()
    // this.Listaclientes()

    this.listaPaquetes()
    this.autoComplete()
    this.realizarOperaciones()
    this.getBase64ImageFromURL('../../../assets/logoSpeedPro/Logo-Speedpro.png').then((val:any)=>{
      this.dataImagen = val
    })
    this.listadoEmpresas()
    
  }
  ngAfterViewInit(): void {

  }
  primero(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
          this.ROL = this._security.servicioDecrypt(variableX['rol'])
          this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal']);
          // this.rol()
  }
  listadoEmpresas(){
    const starCountRef = ref(db, `empresas`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        // this.empresas= this._publicos.crearArreglo2(snapshot.val())

        const clavesSucursal = Object.keys(snapshot.val())
        const empresas = snapshot.val()
        // console.log(clavesSucursal);
        let empresasnew = []
        // console.log(empresas);
        
        await clavesSucursal.map(async(su)=>{
            // const nu = this._publicos.crearArreglo2(empresas[su])
            // console.log(empresas[su]);
            const nu = this._publicos.crearArreglo2(empresas[su])
            // console.log(nu.length);
            
            nu.map(o=>{
              o['sucursal'] = su
              empresasnew.push(o)
            }) 
        });
        (this.SUCURSAL === 'Todas') ? this.empresas = empresasnew : this.empresas = empresasnew.filter(e=>e['sucursal'] === this.SUCURSAL)
      } 
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
                let elementos = []
                if(cot['elementos']) elementos = cot['elementos']
                elementos.map((subelement)=>{
                  let nuevosElementos = []
                  if (subelement['costo'] > 0 ) {
                    subelement['normal']  =  (subelement['cantidad'] * subelement['costo']) * 1.30
                  }else{
                    if(subelement['elementos'] ) nuevosElementos = subelement['elementos']
                    const infoInterno = this._publicos.costodePaquete(nuevosElementos,this.margen);
                    // subelement['_desgloce'] = infoInterno
                    subelement['normal']  = infoInterno['flotilla'] * 1.30
                  }
                  
                })
              })
          })
          // console.log(cotizaciones);
          
          if (this.SUCURSAL === 'Todas') {
            this.cotizaciones = cotizaciones
          }else{
            this.cotizaciones = cotizaciones.filter(c=>c['sucursal'] === this.SUCURSAL)
          }
        }
      })
    })
    
  }
  listaSucursales(){
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
          clientes.map(async(c)=>{
            if (!c['vehiculos']){ c['vehiculos'] = []; }
            const arreglo_vehiculos = await  this._publicos.crearArreglo2(c['vehiculos'])
            c['vehiculos'] = arreglo_vehiculos
            this.sucursales.map(s=>{   
              if (c['sucursal'] === s['id']) {
                c['infoSucursal'] = s
              }
            })
          })
          let clientes_nuevos = [];
          (this.SUCURSAL !== 'Todas')? clientes_nuevos = clientes.filter(o=>o.sucursal === this.SUCURSAL): clientes_nuevos  = clientes;
         
          this.clientes = clientes_nuevos
          await this.ListaCotizaciones()
          if(this.clientes.length){
            setTimeout(() => {
              this.rol()
            }, 500);
          } 
        }else{
          this.clientes = []
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
      this.infoCotizacion.sucursal = await this.infoRuta(`sucursales/${this.SUCURSAL}`)
      this.infoCotizacion.data['sucursal'] = this.SUCURSAL
    }


    const ID = this.rutaActiva.snapshot.params['ID']
    const tipo = this.rutaActiva.snapshot.params['tipo']
    // console.log(ID);
    // console.log(tipo);
    // setTimeout(() => {
      if (tipo === 'cliente') {
        this.clientes.map(c=>{
          if (ID === c['id']) {
            this._publicos.recuperaDataArreglo(this.camposCliente,c).then(async (recuperada)=>{
              this.myControlClientes.setValue(recuperada)
              this.infoCotizacion.data.cliente = ID
              this.infoCotizacion.data.sucursal = recuperada['sucursal']
              this.infoCotizacion.cliente = recuperada
              this.infoCotizacion.vehiculos = c['vehiculos']
            })
          }
        })
    }else if(tipo === 'vehiculo'){
      this.clientes.map(c=>{
         if(!c['vehiculos'].length) return
        const vehiculos:any[] = c['vehiculos']
        vehiculos.map(v=>{
            if(v['id'] === ID){
              this.infoCotizacion.vehiculos = c['vehiculos']
              this._publicos.recuperaDataArreglo(this.camposCliente,c).then(async (recuperada)=>{
                this.myControlClientes.setValue(recuperada)
                if(this.SUCURSAL === 'Todas') this.infoCotizacion.data['sucursal'] = recuperada['sucursal']
                this.infoCotizacion.vehiculos = vehiculos
                this.infoCotizacion.data.cliente = c['id']
                this.infoCotizacion.cliente = recuperada
                this.infoCotizacion.data.vehiculo =ID
                this.infoCotizacion.vehiculo  = v
              })
          }
        })
      })
    }else if (tipo === 'cotizacion') {
      this.cotizaciones.map(cot=>{
        if(cot['id']!== ID) return
        const info_cotizacion = cot
        if (!info_cotizacion['id']) return
          
          // this.dataSource.data =
          // console.log(info_cotizacion.elementos);
          // console.log(this.manos_obra);
          // console.log(this.refacciones);
          
          const unidos = this.manos_obra.concat(this.refacciones)
          // console.log(unidos);
          

          const elementos = (info_cotizacion.elementos) ? info_cotizacion.elementos : []  

          elementos.map(e=>{
            if(e['tipo'] === 'paquete'){
              const elementos_internos = (e['elementos']) ? e['elementos'] : []
              elementos_internos.map(e=>{
                if(e['catalogo'] || e['enCatalogo']){
                  const info = unidos.find(u=>u['id'] === e['IDreferencia'])
                  const camposNuevos = ['id','nombre','precio','status','tipo']
                  camposNuevos.forEach(c=>{
                    (!info[c]) ? e[c] = '' : e[c] = info[c]
                  })
                }
                e['tipo'] = String(e['tipo']).toLowerCase()
                e['costo'] = 0
                e['aprobado'] = true
              })
            }
          
          })         

          this.infoCotizacion.elementos = info_cotizacion.elementos

          this.newPagination('elementos')
          
          const campData = Object.keys(info_cotizacion)
          const camp = ['iva','margen','promocion','servicio','descuento','formaPago','nota','descripcion']
          camp.map(campo=>{
            this.infoCotizacion.data[campo]  =  info_cotizacion[campo]
          })
          this.iva = this.infoCotizacion.data['iva']
          this.margen = this.infoCotizacion.data['margen']
          this.formaPago = this.infoCotizacion.data['formaPago']
          this.realizarOperaciones()
          this.clientes.map(c=>{
            if(info_cotizacion['cliente'] !== c['id']) return
              this._publicos.recuperaDataArreglo(this.camposCliente,c).then(async (recuperada)=>{
                this.myControlClientes.setValue(recuperada)
                this.infoCotizacion.data.cliente = info_cotizacion['cliente']
                this.infoCotizacion.data.sucursal = info_cotizacion['sucursal']
                this.infoCotizacion.cliente = recuperada
                if(!c['vehiculos'].length)return
                this.infoCotizacion.vehiculos = c['vehiculos']
                c['vehiculos'].map(v=>{
                  if(v['id'] !== info_cotizacion['vehiculo']) return
                  this.infoCotizacion.data.vehiculo = info_cotizacion['vehiculo']
                  this.infoCotizacion.vehiculo = v
                })
              })
          })
      })
     }else if(tipo === 'new'){

    }
    // console.log(tipo);

    // },100)


  }
  
  filtroPaquetes(cuales:string){
    let data = []
    const existentes = this.paquetes
    const nuevos = [...existentes]
    if (cuales === 'alls') {
      data = nuevos
      this.modelo = false
    }else{
      this.modelo = true
      if (this.infoCotizacion.vehiculo['modelo']) {
        const filtro = nuevos.filter(o=>o.modelo === this.infoCotizacion.vehiculo['modelo'])
        data = filtro
      }else{
        data = []
      }
    }
    this.colocaInfoPaquetes(data)
  }
  
  listaMO(){
    const starCountRef = ref(db, `manos_obra`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        const manos_obra = await this._catalogos.listadoManos_obra()
        if (manos_obra.length) {
          for (let index = 0; index < manos_obra.length; index++) {
            const element = manos_obra[index];
            manos_obra[index].tipo = 'MO';
            (manos_obra[index].descripcion)? '': manos_obra[index].descripcion = ''
          }
          this.manos_obra = manos_obra
            this.manos_obraListo = false
        }else{
            this.manos_obraListo = true
        }
      }
    })
  }
  listaRefacciones(){
    const starCountRef = ref(db, `refacciones`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        const refacciones:any[] = await this._catalogos.listadoRefacciones()
        if (refacciones.length) {
          for (let index = 0; index < refacciones.length; index++) {
            const element = refacciones[index];
            refacciones[index].tipo = 'refaccion';
            (refacciones[index].descripcion)? '': refacciones[index].descripcion = ''
          }
          this.refacciones = refacciones
          this.refaccionesListo = false
        }else{
          this.refaccionesListo = true
        }
      }
    })
  }
  listaPaquetes(){
    const starCountRef = ref(db, `paquetes`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        // this.paquetes = paquetes
        //     this.paquetesListos = false
        // console.log('manos de obra',this.manos_obra);
        // console.log('refacciones',this.refacciones);
        await this.listaMO()
        await this.listaRefacciones()
        const concatenados = this.manos_obra.concat(this.refacciones)
        // console.log(concatenados);
        
        const paquetes:any[] = await this._catalogos.listaPaquetes()
        // console.log(paquetes);
        paquetes.map((p)=>{
          // console.log(p['id'])
          let elements = []
          if(p['elementos']) elements = p['elementos']
          elements.map((subelement)=>{
            concatenados.forEach(g=>{
              if (subelement['IDreferencia'] === g['id']) {
                subelement['nombre'] = g['nombre']
                subelement['descripcion'] = g['descripcion']
                subelement['status'] = g['status']
                if (!subelement['precio']) subelement['precio'] = g['precio']
              }
            })
          })
          p['_desgloce'] = this._publicos.costodePaquete(elements,this.margen);
          // console.log(p);
        })
       

        if (paquetes.length) {
          this.paquetes = paquetes
          this.paquetesListos = false
        }else{
          this.paquetesListos = true
        }
        
      }
    })
  }
  colocaInfoPaquetes(data:any){
    this.dataSourcePaquetes.data = data
    this.newPagination('paquetes')
  }
  getCotizaciones(accion:string){
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, (snapshot) => {
      this._cotizaciones.cotizaciones().then(async (ans:any[])=>{
        let cotizaciones =[];
        (this.SUCURSAL !== 'Todas')? cotizaciones= ans.filter(o=>o.sucursal === this.SUCURSAL): cotizaciones = ans;
        for (let index = 0; index < cotizaciones.length; index++) {
          const element = cotizaciones[index], cliente = `clientes/${element.cliente}`,
          vehiculo = `vehiculos/${element.vehiculo}`, sucursal:string = `sucursales/${element.sucursal}`
          const infCLiente = await  this.infoRuta(cliente)
          const vehiculos = await this._vehiculos.vehiculos(element.cliente)
          // const vehiculos = await this._vehiculos.vehiculos(element.cliente)
          // cotizaciones[index].vehiculos = vehiculos;
          const temp = {...infCLiente,vehiculos,id:element.cliente}
          cotizaciones[index].Info_cliente = temp
          cotizaciones[index].Info_vehiculo = await  this.infoRuta(vehiculo);
          (this.SUCURSAL === 'Todas') ? cotizaciones[index].Info_sucursal = await this.infoRuta(sucursal): cotizaciones[index].Info_sucursal = await this.infoRuta(`sucursales/${this.SUCURSAL}`)

          if (accion!=='new' && accion === element.id) {
            // console.log(element);
            this.myControl.setValue(element)
          }
        }
        this.cotizaciones = cotizaciones
      })
    })
  }
  limpiar(que:string){
    if (que === 'elementos') {
      this.infoCotizacion.elementos = []
      this.realizarOperaciones()
      this.infoCotizacion.desgloce = {totalRefacciones1:0,totalRefacciones2:0,totalMO:0,sobrescrito:0, flotilla:0,flotillaMeses:0}
    }else if (que === 'all') {

      this.infoCotizacion = {cliente:{},vehiculo:{},elementos:[],sucursal:{},
                      data:{iva:true,formaPago:1,servicio:1,margen:25,descuento:0,promocion:'ninguna'},
                      desgloce:{totalRefacciones1:0,totalRefacciones2:0,totalMO:0,sobrescrito:0, flotilla:0,flotillaMeses:0},
                      nota:'',descripcion:''
                    }
      this.myControlClientes.setValue('')
      this.myControl.setValue('')
      this.myControlElemento.setValue('')
      this.realizarOperaciones()
    }
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
  autoComplete(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','cotizaciones')),
    );
    this.filteredOptionsClientes = this.myControlClientes.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','clientes')),
    );
    this.filteredOptionsElemento = this.myControlElemento.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '','elementos')),
    );
  }
  private _filter(value: any[],donde:string): string[] {
    const valor = String(value).toLowerCase();
    let data =[], ordenando =[]
    if (donde==='cotizaciones') {
      data= this.cotizaciones.filter(o => o.no_cotizacion.toLowerCase().includes(valor))      
      if (data.length===0) { data= this.cotizaciones.filter(o => o['infoCliente']['fullname'].toLowerCase().includes(valor)) }
      this.cotizaciones.map((c)=>{
        if(!c['infoCliente'].correo) c['infoCliente'].correo = ''
      })
      if (data.length===0) { data= this.cotizaciones.filter(o => o.infoCliente['correo'].toLowerCase().includes(valor)) }
      if (data.length===0) { 
        this.cotizaciones.map((o)=>{
          const vehiculos = o.infoCliente['vehiculos']
          vehiculos.forEach(v => {
            if (v['id'] === o['vehiculo']) o['placas'] = v['placas']
          });
        })
        data= this.cotizaciones.filter(o => o['placas'].toLowerCase().includes(valor))
       }

      ordenando =  this._publicos.ordernarPorCampo(data,'no_cotizacion')
    }else if (donde==='clientes') {
      data= this.clientes.filter(o => o.no_cliente.toLowerCase().includes(valor))
      if (data.length===0) { data= this.clientes.filter(o => o.nombre.toLowerCase().includes(valor)) }
      this.clientes.map((c)=>{
        if(!c['correo']) c['correo'] = ''
      })
      if (data.length===0) { data= this.clientes.filter(o => o.correo.toLowerCase().includes(valor)) }
      ordenando =  this._publicos.ordernarPorCampo(data,'no_cliente')
    }else if (donde==='elementos') {
      if (!this.refaccionesListo && !this.manos_obraListo) {
        this.elementosConjunto = this.manos_obra.concat(this.refacciones)
        data= this.elementosConjunto.filter(o => o.nombre.toLowerCase().includes(valor))
        ordenando =  this._publicos.ordernarPorCampo(data,'nombre')
      }else{
        data =[]
      }
    }
    return ordenando
  }
  displayFn(info: any): any {
    return info && `${info.no_cotizacion}` ? `${info.no_cotizacion}` : '';
  }
  displayCliente(info: any): any {
    return info && `${info.no_cliente}` ? `${info.no_cliente}` : '';
  }
  displayElemento(info: any): any {
    return info && `${info.nombre} - ${info.tipo}` ? `${info.nombre} - ${info.tipo}` : '';
  }
  async vericarInfoCotizacion(){
    const info_cotizacion = this.myControl.value
    if (!info_cotizacion['id']) return
          this.infoCotizacion.elementos = info_cotizacion.elementos
          // this.dataSource.data =
          this.newPagination('elementos')
          
          const campData = Object.keys(info_cotizacion)
          const camp = ['iva','margen','promocion','servicio','descuento','formaPago','nota','descripcion']
          camp.map(campo=>{
            this.infoCotizacion.data[campo]  =  info_cotizacion[campo]
          })
          this.iva = this.infoCotizacion.data['iva']
          this.margen = this.infoCotizacion.data['margen']
          this.formaPago = this.infoCotizacion.data['formaPago']
          this.realizarOperaciones()
          this.clientes.map(c=>{
            if(info_cotizacion['cliente'] !== c['id']) return
              this._publicos.recuperaDataArreglo(this.camposCliente,c).then(async (recuperada)=>{
                this.myControlClientes.setValue(recuperada)
                this.infoCotizacion.data.cliente = info_cotizacion['cliente']
                this.infoCotizacion.data.sucursal = info_cotizacion['sucursal']
                this.infoCotizacion.cliente = recuperada
                if(!c['vehiculos'].length){
                  this.infoCotizacion.vehiculos = []
                }else{
                  this.infoCotizacion.vehiculos = c['vehiculos']
                  c['vehiculos'].map(v=>{
                    if(v['id'] !== info_cotizacion['vehiculo']) return
                    this.infoCotizacion.data.vehiculo = info_cotizacion['vehiculo']
                    this.infoCotizacion.vehiculo = v
                  })
                }
              })
          })
  }

  realizarOperaciones(){
    const margen = (1 + (this.margen/100))
    const elementos:any[] = this.infoCotizacion.elementos
    const reporte = {
      iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
      subtotal:0, total:0, ub:0, meses:0, descuento:0
    }
    elementos.map((e,index)=>{
      e['index'] = index
      const pre = e.costo >0 ? e.costo : e.precio;
      const operacion =  e.tipo === "refaccion" ? e.cantidad * pre : e.cantidad * pre;
      if (e.costo > 0) {
        if (e.tipo === 'refaccion') {
          reporte.sobrescrito_refaccion += operacion;
        } else if (e.tipo === "MO") {
          reporte.sobrescrito_mo += operacion;
        }else {
          reporte.sobrescrito_paquetes += operacion;
          const info = this.reportePaquete(e.elementos,margen)
          e['reporte_interno'] = info
          e['precio'] = info.total
        }
      }else{
        if (e.tipo === 'refaccion') {
          reporte.refacciones_a += operacion;
        } else if (e.tipo === "MO") {
          reporte.mo += operacion;
        }else {
          const info = this.reportePaquete(e.elementos,margen)
          e['reporte_interno'] = info;
          e['precio'] = info.total;

          reporte.mo += info.mo;
          reporte.refacciones_a += info.refacciones;
          reporte.sobrescrito_mo += info.sobrescrito_mo;
          reporte.sobrescrito_refaccion += info.sobrescrito_refaccion;
          // console.log('costo normal',info);
        }
      }
    })
    
    reporte.refacciones_v = (reporte.refacciones_a * margen)

    const suma = reporte.mo + reporte.refacciones_v + reporte.sobrescrito_mo + reporte.sobrescrito_paquetes + reporte.sobrescrito_refaccion

    reporte.subtotal = suma;

    (this.iva) ? reporte.total = suma * 1.16 : reporte.total = suma;

    if (this.iva) reporte.iva = suma * .16 ;
    
    reporte.ub = (reporte.total - reporte.refacciones_v)*100/reporte.total

    const enCaso_meses = this.formasPAgo.find(f=>Number(f['id']) === Number(this.formaPago))
    // console.log(enCaso_meses);
    if (Number(enCaso_meses['id']) === 1) {
      reporte.descuento = this.descuento
      reporte.total -= reporte.descuento
    }else{
      reporte.descuento = 0
      const operacion = reporte.total * (1 + (enCaso_meses['interes'] / 100))
      reporte.meses = operacion;
      (enCaso_meses['numero']>0) ? this.meses = enCaso_meses['numero'] : this.meses = 0
    }
    
    this.reporte = {...reporte}
    // console.log(elementos);
    // console.log(reporte);
    this.infoCotizacion['reporte'] = this.reporte

    this.realizarInfo(elementos)
    // console.log(this.infoCotizacion);
    
    
  }

  reportePaquete(elementos:any[],margen:number){
    const reporte_interno = { mo: 0, refacciones: 0, sobrescrito_mo: 0, sobrescrito_refaccion: 0 };
    elementos.forEach((e_interno) => {
      const pre_interno = e_interno.costo > 0 ? e_interno.costo : e_interno.precio;
      const operacion_interno = e_interno.tipo === 'refaccion' ? e_interno.cantidad * pre_interno : e_interno.cantidad * pre_interno;
      if (e_interno.costo > 0) {
        (e_interno.tipo === 'refaccion') ? reporte_interno.sobrescrito_refaccion += operacion_interno : reporte_interno.sobrescrito_mo += operacion_interno;
      }else{
        (e_interno.tipo === 'refaccion') ? reporte_interno.refacciones += operacion_interno : reporte_interno.mo += operacion_interno;
      }
    })
    const suma = reporte_interno.mo + (reporte_interno.refacciones * margen) + reporte_interno.sobrescrito_mo + reporte_interno.sobrescrito_refaccion
    return  {...reporte_interno, total: suma}
  }
  async comprobarInfoCliente(){
    const valor = this.myControlClientes.value;
    if(!valor['id']){
      this.infoCotizacion.cliente = null
      this.infoCotizacion.data.cliente = null
      this.infoCotizacion.data.vehiculo = null
      this.infoCotizacion.vehiculo  = null
    }else{
      this._publicos.recuperaDataArreglo(this.camposCliente,valor).then(async (recuperada)=>{
        let nueva = {...recuperada}
        const infoSucursal = await this.sucursales.find(o=>o['id'] === valor['sucursal'])
        nueva['sucursal'] = infoSucursal
        this.myControlClientes.setValue(recuperada)
        this.infoCotizacion.vehiculos = valor['vehiculos']
        this.infoCotizacion.data.vehiculo = null
        this.infoCotizacion.data['sucursal'] = recuperada['sucursal']
        this.infoCotizacion.sucursal = infoSucursal
        this.infoCotizacion.vehiculo  = null
        this.infoCotizacion.cliente = recuperada
        this.infoCotizacion.data.cliente = valor['id']
      })
    }
  }
  seleccionaAuto(id_vehiculo: string){
    if (!id_vehiculo) return
    this.infoCotizacion.vehiculos.map(v=>{
      if (v['id'] === id_vehiculo) {
        this.infoCotizacion.data.vehiculo = id_vehiculo
        this.infoCotizacion.vehiculo  = v
      }
    })
  }
  async realizarInfo(elementos:any[]){
    let paquetesSinElementos = []
    // console.log(elementos);
    
    this.dataSource.data = elementos
    this.newPagination('elementos')
    const todos = this.infoCotizacion.elementos
    for (let index = 0; index < todos.length; index++) {
      const elements = todos[index];
      if (elements.tipo === 'paquete' && elements.elementos) {
        const elementosPaquete = elements.elementos
        if (!elementosPaquete.length) {
          paquetesSinElementos.push(`nombre: ${elements.nombre} (Index ${index + 1})`)
        }
      }
    }
    this.paquetesSinElementosShow = paquetesSinElementos.join(', ')
  }

  async mensajePaquete(){
    this.mostrarPaquetes = false
    const { value: nombrePaquete } = await Swal.fire({
      title: 'Ingresa nombre de paquete',
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
      this.colocarpaquete([{nombre:nombrePaquete,id:newPostKey}])
    }
  }
  colocarpaquete(info:any){
    const camposRecupera=['cilindros','marca','modelo','elementos','nombre','status']
    if (!info.length) {
      const camposOption = Object.keys(info)
      let data = {tipo:'paquete',cantidad:1,costo:0,enCatalogo:true}
      for (let index = 0; index < camposOption.length; index++) {
        const element = String(camposOption[index]).toLowerCase()
        for (let camposR = 0; camposR < camposRecupera.length; camposR++) {
          const recuperado = String(camposRecupera[camposR]).toLowerCase()
            if (element === recuperado ) {
            (!info[element])? data[element]='' : data[element]=info[element]
            }
        }
      }
      if (data['elementos']) {
        const elementos = data['elementos']
        for (let index = 0; index < elementos.length; index++) {
          elementos[index].costo = 0
        }
      }else{
        data['elementos'] = []
      }
      this.infoCotizacion.elementos.push(data)
      this.mostrarPaquetes = false

    }else{
      const data = {tipo:'paquete',cantidad:1,costo:0,elementos:[],enCatalogo:false}
      data['nombre'] = info[0].nombre
      data['id'] = info[0].id
      this.infoCotizacion.elementos.push(data)
    }
    this.realizarOperaciones()
    this._publicos.mensajeCorrecto('Se agrego paquete a cotización')

  }
  agregarelementopaquete(elementoAgregar:boolean,indexPadre:number){
    this.myControlElemento.setValue('')
    this.mostrarPaquetes = false
    this.editarPaquete = true
    this.elementoAgregar = false
    this.indexPaquete = indexPadre
    this.resetFormElemento()
  }
  muestraFormElemento(elementoAgregar:boolean){
    this.myControlElemento.setValue('')
    this.mostrarPaquetes = false
    this.elementoAgregar = true
    this.editarPaquete = false
    this.indexPaquete = null
    this.resetFormElemento()
  }
  resetFormElemento(){
    this.formElemento.reset({tipo:'reffacion',precio:0,costo:0,cantidad:1,marca:''})
  }
  cancelarAgregarElemento(){
    this.mostrarPaquetes = false
    this.elementoAgregar = false
    this.editarPaquete = false
    this.indexPaquete = null
  }
  eliminaElemento(index:number){
    const elementos:any[] = this.infoCotizacion.elementos
    elementos[index] = null
    this.infoCotizacion.elementos = elementos.filter(e=>e)
    this.realizarOperaciones()
  }
  cambiaCantidad(event: Event,index:number){
    const elementos:any[]=this.infoCotizacion.elementos
    elementos[index].cantidad = Number((event.target as HTMLInputElement).value);
    this.infoCotizacion.elementos = elementos
    this.realizarOperaciones()
  }
  cambiarSobrescrito(event: Event,index:number){
    const elementos:any[] = this.infoCotizacion.elementos
    elementos[index].costo = Number((event.target as HTMLInputElement).value);
    this.infoCotizacion.elementos = elementos
    this.realizarOperaciones()
  }
  cambiaCantidadSubrelemento(event: Event,indexPadre:number,indexHijo:number){
    const cantidad:number = Number((event.target as HTMLInputElement).value);
    this.infoCotizacion.elementos[indexPadre].elementos[indexHijo].cantidad = cantidad
    this.realizarOperaciones()
  }
  cambiaCosto(event: Event,indexPadre:number,indexHijo:number){
    const costo:number = Number((event.target as HTMLInputElement).value);
    this.infoCotizacion.elementos[indexPadre].elementos[indexHijo].costo = costo
    this.realizarOperaciones()
  }
  cambiaPrecioSubrelemento(event: Event,indexPadre:number,indexHijo:number){
    const costo:number = Number((event.target as HTMLInputElement).value);
    this.infoCotizacion.elementos[indexPadre].elementos[indexHijo].costo = costo
    this.realizarOperaciones()
  }
  EliminaSubrelemento(indexPadre:number,indexHijo:number){
    let arregloOriginal = this.infoCotizacion.elementos[indexPadre].elementos
    let arregloCopia = [...arregloOriginal];
    arregloCopia[indexHijo]= null
    const nuevoArreglo = arregloCopia.filter(o=>o!==null)
    this.infoCotizacion.elementos[indexPadre].elementos = nuevoArreglo
    this.realizarOperaciones()
  }
  SeleccionarServicio(event: Event){
    const servicio:string = (event.target as HTMLInputElement).value;
    this.infoCotizacion.data.servicio = servicio.toLowerCase()
  }
  actualizaMargen(event: Event){
    const margen:string = (event.target as HTMLInputElement).value;
    this.infoCotizacion.data.margen = margen.toLowerCase()
  }
  actualizaPromocion(event: Event){
    const promocion:string = (event.target as HTMLInputElement).value;
    this.infoCotizacion.data.promocion = promocion.toLowerCase()
  }
  actualizaDescripcion(event: Event){
    const descripcion:string = (event.target as HTMLTextAreaElement).value;
    this.infoCotizacion.data.descripcion = descripcion.toLowerCase()
  }
  actualizaNota(event: Event){
    const nota:string = (event.target as HTMLTextAreaElement).value;

    this.infoCotizacion.data.nota = String(nota).toLowerCase()
  }
  verificarTipoPago(){
    this.infoCotizacion.data.formaPago = this.formaPago
    this.descuento = 0
  }
  async verificaInforElemento(donde:string){
    const value = this.myControlElemento.value
    if (donde === 'subelemento') {
      this.editarPaquete = true
      this.elementoAgregar = false
    }else{
      this.editarPaquete = false
      this.elementoAgregar = true
    }
    if (!value) {    }else{
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
    // console.log(info);
    const infoRecibida = info
    let camposRecupera = []
    const camposRecMO:any =['id','precio','nombre','costo','tipo','descripcion','status']
    const camposRecRefaccion:any =['id','precio','nombre','costo','tipo','marca','modelo','descripcion','status']
    let tipo = '';
    (info.tipo)? tipo = info.tipo : tipo = 'refaccion';
    (info.marca)? this.marcaSelect = info.marca : this.marcaSelect = null;
    (tipo === 'MO') ? camposRecupera = camposRecMO : camposRecupera = camposRecRefaccion
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
  showPaquetes(valor:boolean){
    this.mostrarPaquetes = valor
    this.elementoAgregar = false
    this.editarPaquete = false
  }
  colocarElemento(){
    if (this.formElemento.valid) {
      const infoRecibida = this.formElemento.value
      let camposRecupera = []

      const camposRecMO:any =['id','precio','nombre','costo','cantidad','tipo','descripcion','status']
      const camposRecRefaccion:any =['id','precio','nombre','costo','cantidad','tipo','marca','modelo','descripcion','status']
      let tipo = '';
      (infoRecibida.tipo)? tipo = infoRecibida.tipo : tipo = 'refaccion';
      (tipo === 'MO') ? camposRecupera = camposRecMO : camposRecupera = camposRecRefaccion
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
      // console.log(`ID: ${infoRecibida['id']} - enCatalogo: ${this.guardarEnCatalogo}`);
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
        this._catalogos.saveElemento(ruta,saveInfo).then((ans:any)=>{
            if (ans.resp) {
              saveInfo['enCatalogo'] = true
            }else{
              // this._publicos.mensajeIncorrecto(ans.mensaje)
            }
          })

      }
      if (this.indexPaquete>=0 && this.indexPaquete!==null && this.editarPaquete) {
        let elementos = this.infoCotizacion.elementos[this.indexPaquete].elementos
        let nuevo = [...elementos]
        nuevo.push(saveInfo)
        this.infoCotizacion.elementos[this.indexPaquete].elementos = nuevo
      }else{
        this.infoCotizacion.elementos.push(saveInfo)
      }

      this.indexPaquete = null
      this.editarPaquete = false
      this.elementoAgregar = false
      this.realizarOperaciones()
      this._publicos.mensajeCorrecto('Elemento añadido')
    }else{
      this._publicos.mensajeIncorrecto('Verificar información de formulario')
    }
  }

  mensajeMarca(){

  }
  async guardarCotizacion(){
    // return
    
    
    this.validarInformacion().then(({valida,faltantes,data})=>{
      this.valida = valida
      if(!valida) {
        const cu = faltantes.join(', ')
        this.cuales = cu
      }else{
        // Swal.isLoading()
   
        if (this.SUCURSAL === 'Todas') {
          this.sucursales.map(s=>{
            if (this.infoCotizacion.data['sucursal'] !== s['id']) return
            this.infoCotizacion.sucursal = s
          })
        }
        const campos_fechas = ['fecha','hora','vencimiento']
        const campos =['FormaPago','no_cotizacion','pdf']
        const infoCotizacion = {
          ...data
        }
        const fecha_get = this._publicos.getFechaHora()
        campos_fechas.map(f=>{
          infoCotizacion[f] = fecha_get[f]
        })

        this._cotizaciones.generaNombreCotizacion(this.infoCotizacion.sucursal['sucursal'], this.ROL).then(async (no_cotizacion)=>{
          // console.log(no_cotizacion);
          infoCotizacion['no_cotizacion'] = no_cotizacion
          infoCotizacion['formaPago'] = this.formaPago

          if(!infoCotizacion['formaPago']) infoCotizacion['formaPago'] = 1
          if(!infoCotizacion['margen']) infoCotizacion['margen'] = 25
          if(!infoCotizacion['iva']) infoCotizacion['iva'] = true
          ///OBTENER LA INFORMACION PARA EL PDF
          // console.log('OBTENER LA INFORMACION PARA EL PDF');
          const elementos = this.infoCotizacion.elementos
          let ele2 = []
          elementos.map(e=>{
            // console.log(e);
            if (e['tipo'] === 'paquete') {
              ele2.push({tipo: e['tipo'] ,elemento: e['nombre'], flotilla: e['flotilla'], elementos: e['elementos']})
            }else{
              ele2.push({tipo: e['tipo'] ,elemento: e['nombre'], flotilla: e['flotilla']})
            }
          })
          const joinSucursal = this.infoCotizacion.sucursal
          const claves = ['sucursal','direccion','telefono','correo']
          let sucursal = ''
          claves.map(s=>{
            sucursal = sucursal + joinSucursal[s] + ', '
          })
          // console.log(sucursal);
          const vehiculo = this.infoCotizacion.vehiculo
          const cliente = this.infoCotizacion.cliente
          
          const reporte = this.infoCotizacion['reporte']
          
          const vencimiento = infoCotizacion['vencimiento']
          if(!vehiculo['no_motor']) vehiculo['no_motor'] =''
          if(!cliente['empresa']) cliente['empresa'] = ''
          cliente['fullname'] = `${cliente['nombre']} ${cliente['apellidos']}`

          if (cliente['empresa']) {
            await this.empresas.map(e=>{
              if (e['id'] === cliente['empresa']) {
               cliente['empresa'] = e['empresa']
              }
            })
          }
          
          let infoPago = {}
          this.formasPAgo.map(f=>{
            if (f.id != this.formaPago) return
            infoPago['formaPago'] = f.id
            infoPago['nombre'] = f['pago']
          })
          const tempPDF = {
            sucursal,
            vehiculo,
            cliente,
            reporte,
            vencimiento,
            elementos,
            infoCotizacion,
            formaPago: infoPago
          }
          
          this._pdf.pdf(this.dataImagen,tempPDF,this.detalles).then(async (ans:any)=>{
            const pdfDocGenerator = pdfMake.createPdf(ans);
            pdfDocGenerator.getBlob(async (blob) => {
              // pdfMake.createPdf(ans).download(no_cotizacion);
              
              await this._uploadPDF.upload(blob,no_cotizacion).then((answer:any)=>{
                const intervalo = setInterval(() => {
                    if(answer['ruta']){
                      clearInterval(intervalo)
                      // console.log('continuar: ', answer['ruta']);
                      infoCotizacion['pdf'] = answer['ruta']
                      const newPostKey = push(child(ref(db), 'posts')).key
                      // console.log(infoCotizacion)
                     
                      let correos= []
                      if (this.infoCotizacion.sucursal['correo']) correos.push(this.infoCotizacion.sucursal['correo'])
                      if (this.infoCotizacion.cliente['correo']) correos.push(this.infoCotizacion.cliente['correo'])
                      if (this.infoCotizacion.cliente['correo_sec']) correos.push(this.infoCotizacion.cliente['correo_sec'])

                      const conceptos = []
                      infoCotizacion['elementos'].map(e=>{
                        conceptos.push(e['nombre'])
                      })
                      const dataCorreo = {
                        correos,
                        cliente: this.infoCotizacion.cliente,
                        sucursal: this.infoCotizacion.sucursal,
                        vehiculo: this.infoCotizacion.vehiculo,
                        conceptos: conceptos.join(', '),
                        data: infoCotizacion
                      }
                      Swal.fire({
                        title: 'Opciones de cotización',
                        html:`<strong class='text-danger'>Se recomienda visualizar pdf antes de enviar</strong>`,
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Previsualizar PDF cotizacion',
                        denyButtonText: `Guardar y enviar correo`,
                        cancelButtonText:`cancelar`
              
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                          pdfMake.createPdf(ans).open();
                        } else if (result.isDenied) {
                          const updates = {};
                          updates['cotizacionesRealizadas/' + newPostKey] = infoCotizacion;
                          
                        
                          update(ref(db), updates)
                          .then(() => {
                            pdfMake.createPdf(ans).download(no_cotizacion);
                            this._email.EmailCotizacion(dataCorreo)
                            this._publicos.mensajeCorrecto('Cotizacion realizada')
                            this.router.navigateByUrl('/cotizacion')
                          })
                          .catch((error) => {
                            // The write failed...
                          });
                          // set(ref(db, `cotizacionesRealizadas/${newPostKey}`), infoCotizacion )
                          // .then(() => {
                          //   pdfMake.createPdf(ans).download(no_cotizacion);
                          //   console.log(dataCorreo);
                            
                          //   this._email.EmailCotizacion(dataCorreo)
                          //   this._publicos.mensajeCorrecto('Cotizacion realizada')
                          //   this.router.navigateByUrl('/cotizacion')
                          // })
                          // .catch((error) => {
                          //   // The write failed...
                          // });
                        }
                      })
                      
                      
                     
                    }
                }, 200);
                // console.log(answerUpload);
              })
            })
          })
          // console.log(tempPDF);
          
          
          
        }).catch(error=>{
          console.log(error);
          
        })
        ///primero gemnerar el pdf y despues preguntar
        
      }
    })






  }
  validaAntes(){
    this.validarInformacion().then(({valida,faltantes,data})=>{
      this.valida = valida
      if(!valida) {
        const cu = faltantes.join(', ')
        this.cuales = cu
      }
    })
  }

  ordenarElementos(campo:string){
    // console.log(campo);
    // console.log(this.dataSource.data);
    let info =  []
    info = [...this.dataSource.data]
    
    // console.log(this.ordenamiento);
    

    if (this.ordenamiento) {
      info.sort(function (a, b) {
        if (a[campo] > b[campo]) { return 1; }
        if (a[campo] < b[campo]) { return -1; }
        return 0;
      })
    }else{
      info.sort(function (a, b) {
        if (a[campo] < b[campo]) { return 1; }
        if (a[campo] > b[campo]) { return -1; }
        return 0;
      })
    }
    

    // console.log(info);

    this.dataSource.data = info
    this.newPagination('elementos')
    
    
  }

  async validarInformacion(){
    const answer = {valida: true,faltantes:[],data:{}}
    let importantes = []
    const elementoss: any[] = this.infoCotizacion.elementos

    const camposEscenciales = ['iva','servicio','margen','cliente','vehiculo','formaPago','sucursal']
    const camposOpcionales = ['descuento','descripcion','nota','cliente','vehiculo','formaPago']

    camposEscenciales.map(es=>{
      if (!this.infoCotizacion.data[es]) importantes.push(es)
      if (this.infoCotizacion.data[es]) answer.data[es] = this.infoCotizacion.data[es]
    })
    if(!elementoss.length) importantes.push('elementos')
    if(elementoss.length) answer.data['elementos'] = elementoss

    camposOpcionales.map(o=>{
      if (this.infoCotizacion.data[o]) answer.data[o] = this.infoCotizacion.data[o]
    })


    if (importantes.length) {
      answer.valida = false
      answer.faltantes = importantes
    }
    return answer
  }
 

  // para guardar informacion de cliente

clientesInfo(info:any){
    if (info['registro']) {
      // this.showFormCliente = !info['oculta']
      this.myControlClientes.setValue(info['cliente'])
      this._publicos.mensajeCorrecto('registro de cliente correcto')
    }else if(info['actualizacion']){
      this.myControlClientes.setValue('')
      this._publicos.mensajeCorrecto('actualizacion de cliente correcto')
    }
}
vehiculoInfo(info:any){
  if (info['registro']) {
    this.clientes.map(c=>{
      if(!c['vehiculos'].length) return
     const vehiculos:any[] = c['vehiculos']
     vehiculos.map(v=>{
         if(v['id'] === info['vehiculo'].id){
           this.infoCotizacion.vehiculos = c['vehiculos']
           this._publicos.recuperaDataArreglo(this.camposCliente,c).then(async (recuperada)=>{
             this.myControlClientes.setValue(recuperada)
             if(this.SUCURSAL === 'Todas') this.infoCotizacion.data['sucursal'] = recuperada['sucursal']
             this.infoCotizacion.vehiculos = vehiculos
             this.infoCotizacion.data.cliente = info['vehiculo']['cliente']
             this.infoCotizacion.cliente = recuperada
             this.infoCotizacion.data.vehiculo = info['vehiculo']['cliente']
             this.infoCotizacion.vehiculo  = v
             setTimeout(() => {
              this.seleccionaAuto(v['id'])
               this._publicos.mensajeCorrecto('Accion correcra')
             }, 150);
           })
       }
     })
   })
  }else{
    this._publicos.mensajeIncorrecto('Accion no realizada')
    this.infoCotizacion.data.vehiculo = null
    this.infoCotizacion.vehiculo = null
  }

}



  //para guardar vehiculo nuevo


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
}
