import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { child, get, getDatabase, onValue, push, ref, update, onChildAdded, onChildChanged, onChildRemoved} from "firebase/database";


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
  ROL:string; SUCURSAL:string
  
  infoCotizacion = {
    cliente:{},vehiculo:{},vehiculos:[],elementos:[],sucursal:{},reporte:{}, iva:true, formaPago: '1', descuento: 0, margen_get: 25,
    fecha: null, hora:null, no_cotizacion:null, vencimiento:null, nota:null, servicio: '1', descripcion: ''
  }

  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
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
    // {valor: 'sucursal', show:'Sucursal'}
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

   // tabla
   dataSource = new MatTableDataSource(); //elementos
   elementos = ['nombre','cantidad','sobrescrito','precio']; //elementos
   columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
   expandedElement: any | null; //elementos
   @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
   @ViewChild('elements') sort: MatSort //elementos

   paquete: string = 'paquete'
   refaccion: string = 'refaccion'
   mo: string = 'mo'

   checksBox = this._formBuilder.group({
    iva: true,
    detalles: false
  });

  formPlus: FormGroup

  servicios=[
    {valor:1,nombre:'servicio'},
    {valor:2,nombre:'garantia'},
    {valor:3,nombre:'retorno'},
    {valor:4,nombre:'venta'},
    {valor:5,nombre:'preventivo'},
    {valor:6,nombre:'correctivo'},
    {valor:7,nombre:'rescate vial'}
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

  promociones=['ninguna','facebook','cartelera','instagram','radio']; 

  sucursales=[]
  obligatorios:string
  opcionales:string
  extra:string
  tipo:string

  datCliente:any
  cliente:string = null

  vehiculoData:string = null
  idPaqueteEditar: number
  idPaqueteEditarBoolean: boolean = false

  modeloVehiculo:string = null
  constructor(
    private _security:EncriptadoService, private rutaActiva: ActivatedRoute, private _publicos: ServiciosPublicosService,
    private _formBuilder: FormBuilder, private _email: EmailsService, private _pdf: PdfService, private _uploadPDF: UploadPDFService,
    private router: Router) { }
  ngOnInit() {
    this.rol()
    this.crearFormPlus()
    // this.verificaCmabiis()
  }
  ngAfterViewInit(): void {
    // this.crearFormPlus()
  }
  verificarInfoVehiculos(){
    if (this.infoCotizacion.cliente['id']) {
      const starCountRef = ref(db, `clientes/${this.infoCotizacion.cliente['id']}/vehiculos`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          let vehiculos= this._publicos.crearArreglo2(snapshot.val())
          this.infoCotizacion.vehiculos = vehiculos
        }else{
          this.infoCotizacion.vehiculos = []
        }
      },{
          onlyOnce: true
      })
    } 
  }
  ///mensaje para poder agregar un paquete que no esta en el catalogo
  async mensajePaquete(){
    // this.mostrarPaquetes = false
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
      
      const tempData = {
        elementos: [],
        nombre: nombrePaquete,
        aprobado: true,
        // id: this._publicos.generaClave(),
        tipo: this.paquete,
        cantidad: 1,
        costo: 0
      }
      this.infoCotizacion.elementos.push(tempData)
      this.realizaOperaciones()
      // this.colocarpaquete([{nombre:nombrePaquete,id:newPostKey}])
    }
  }
  
  
  crearFormPlus(){
    this.formPlus = this._formBuilder.group({
      servicio:[1,[Validators.required]],
      margen_get:[this.infoCotizacion.margen_get,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      formaPago:['1',[Validators.required]],
      promocion:['',[]],
      descuento:['',[Validators.pattern("^[0-9]+$"),Validators.min(0)]],
      descripcion:[this.infoCotizacion.descripcion,[]],
      nota:['',[]]
    })
  }
  validaCampo(campo: string){
    return this.formPlus.get(campo).invalid && this.formPlus.get(campo).touched
  }
  // primer hay que saber que tipo de usuario es en cada modulo para sus permisos, filtros, etc ademas de la SUCURSAL
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal']);
    // Obtenemos una lista de las sucursales 
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        //cuando se tenga la lista de las sucursales creamos el arreglo de las mismas y asiganamos para su uso posterior
        this.sucursales = this._publicos.crearArreglo2(snapshot.val())
        // llamamos a la siguiente accion cuando se tiene la informacion de las sucursales
        this.accion()
      } 
    }, {
      onlyOnce: true
    })

  }
  accion(){
    //verificamos que tipo de cotizacion es cliente, cotizacion, vehiculo, nueva
    // con los parametros ID obtenemos el id de lo antes mencionado y con tipo cual sera la busqueda
    const ID = this.rutaActiva.snapshot.params['ID']
    const tipo = this.rutaActiva.snapshot.params['tipo']
    const extra = this.rutaActiva.snapshot.params['extra']
    // console.log(ID);
    // console.log(tipo);
    this.tipo = tipo
    // console.log(this.sucursales);
    
    //si el tipo es cliente y tiene su id buscamos la informacion especifica del cliente
    if (tipo ==='cliente' || tipo === 'vehiculo') {
      const starCountRef = ref(db, `clientes/${ID}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const cliente = snapshot.val()
          if (cliente['vehiculos']) cliente['vehiculos'] = this._publicos.crearArreglo2(cliente['vehiculos'])
          
          // asiganar toda la informacion para la cotizacion cliente, sucursal, vehiculos, etc
          cliente['fullname'] = `${cliente.nombre} ${cliente.apellidos}`
          this.infoCotizacion.sucursal = this.sucursales.find(s=>s['id'] === cliente['sucursal'])
          this.infoCotizacion.cliente = cliente
          this.infoCotizacion.vehiculos = cliente.vehiculos
          this.infoCotizacion.descripcion = ''
          this.infoCotizacion.nota = ''
            
          if (extra) {
            const ve= cliente.vehiculos.find(v=>v['id'] === extra)
            if(ve){
              this.infoCotizacion.vehiculo = ve
              this.extra = extra
              this.modeloVehiculo = ve['modelo']
            }
          }


          this.realizaOperaciones()
        }
      })
    } else if(tipo ==='cotizacion' ) {
      const starCountRef = ref(db, `cotizacionesRealizadas/${ID}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          // let arreglo= this.crearArreglo2(snapshot.val())
          const info = snapshot.val()
          this.infoCotizacion.cliente = info.cliente
          this.infoCotizacion.sucursal = this.sucursales.find(s=>s['id'] === info.cliente['sucursal'])
          this.infoCotizacion.vehiculo = info.vehiculo
          this.infoCotizacion.elementos = info.elementos
          this.infoCotizacion.iva = info.iva
          this.infoCotizacion.formaPago = info.formaPago
          this.infoCotizacion.nota = info.nota
          this.infoCotizacion.descripcion = info.descripcion
          this.infoCotizacion.servicio = info.servicio
          const startCliente = ref(db, `clientes/${info.cliente.id}/vehiculos`)
          onValue(startCliente, (snapshotCliente) => {
            if (snapshotCliente.exists()) {
                this.infoCotizacion.vehiculos = this._publicos.crearArreglo2(snapshotCliente.val())
              }
            })
          this.modeloVehiculo = info.vehiculo['modelo']
          this.extra = info.vehiculo.id
          this.realizaOperaciones()
        } 
      }, {
        onlyOnce: true
      })
    }else if(tipo ==='new' ) {
      //mostramos una lista de clientes y sus respectivos vehiculos
      // console.log('es nueva ');
      
    }
    
  }
  // REEMPLAZAR REFRIGERANTE Y PURGAR SISTEMA DE ENFRIAMIENTO
  //aqui la informacion del clienyte
  infoCliente(cliente){
    if (cliente.error) {
      this._publicos.mensajeNOT('Intenta nuevamente',3000)
    }else{
      this.infoCotizacion.vehiculo = null
      this.extra = null
      this.infoCotizacion.sucursal = this.sucursales.find(s=>s['id'] === cliente['sucursal'])
      this.infoCotizacion.cliente = cliente
      if ( cliente.vehiculos) {
        this.infoCotizacion.vehiculos = cliente.vehiculos
      }
      this.realizaOperaciones()
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
  //recibir la nueva data y consukta extra de info cliente
  clientesInfo(info:any){
    // console.log(info);
    const starCountRef = ref(db, `clientes/${info.cliente.id}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const cliente = snapshot.val()
          if (cliente['vehiculos']) cliente['vehiculos'] = this._publicos.crearArreglo2(cliente['vehiculos'])
          
          // asiganar toda la informacion para la cotizacion cliente, sucursal, vehiculos, etc
          cliente['fullname'] = `${cliente.nombre} ${cliente.apellidos}`
          this.infoCotizacion.sucursal = this.sucursales.find(s=>s['id'] === cliente['sucursal'])
          this.infoCotizacion.cliente = cliente
          this.infoCotizacion.vehiculos = cliente.vehiculos
          //si existe vehiculo seleccinado conservar
          if (this.extra) {
            this.infoCotizacion.vehiculo = cliente.vehiculos.find(v=>v.id === this.extra)
          }
          this.realizaOperaciones()
        }
      })
    // if (info['registro']) {
    //   // this.showFormCliente = !info['oculta']
    //   this._publicos.mensajeCorrecto('registro de cliente correcto')
    // }else if(info['actualizacion']){
    //   this._publicos.mensajeCorrecto('actualizacion de cliente correcto')
    // }
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
  vehiculoInfo(info:any){
    if (info['registro']) {
      this._publicos.mensajeCorrecto('Accion correcra')
      
      this.extra =  info.vehiculo.id
      this.infoCotizacion.vehiculos = []
      const starCountRef = ref(db, `clientes/${this.infoCotizacion.cliente['id']}/vehiculos`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          let vehiculos= this._publicos.crearArreglo2(snapshot.val())
          this.infoCotizacion.vehiculos = vehiculos
          const filtrov = vehiculos.find(v=>v.id === this.extra)
          this.infoCotizacion.vehiculo = filtrov
          this.modeloVehiculo = filtrov['modelo']
        }
      })
    }else{
      this._publicos.mensajeIncorrecto('Accion no realizada')
    }
  }
  // aqui agregamos la informacion del elemento que se agrega mediante el evento que se emite el evento trae toda la informacion
  // del elemento en cuestion lo colaocamos y realizamos operaciones
  elementoInfo( event){
    if (this.idPaqueteEditarBoolean) {
      this.infoCotizacion.elementos[this.idPaqueteEditar]['elementos'].push(event)
    }else{
      this.infoCotizacion.elementos.push(event)
    }
    this.realizaOperaciones()
  }
  //de la misma manera que elemento asiganamos la informacion del evento paquetes y realizamos operaciones
  infopaquete( event ){
    this.infoCotizacion.elementos.push(event)
    this.realizaOperaciones()
  }
  //para elelimianr un elemento primario solo ocupamos la data y se elimina mediente su index se hace la asiganacion a elemento null
  //  y posterirormente se hace el filtrado para su nueva asigancion de elementos de la cotizacion y realizamos operaciones
  eliminaElemento(data){
      let antiguos = []
      antiguos = [...this.infoCotizacion.elementos]
      antiguos[data.index] = null
      const filtrados = antiguos.filter(e=>e !==null)
      this.infoCotizacion.elementos = filtrados
      this.realizaOperaciones()
  }
  // para elelimianr un subelemento de paquete y solo paquete solo ocupamos la data y se elimina mediente su index del subelemento
  //  se hace la asiganacion a elemento null y posterirormente se hace el filtrado para su nueva asigancion de elementos de la cotizacion 
  // y realizamos operaciones
  eliminaSubElemento(data,item){
      let antiguos = []
      antiguos = [...this.infoCotizacion.elementos]
      antiguos[data.index].elementos[item.index] = null
      const filtradosInternos = antiguos[data.index].elementos.filter(e=>e !==null)
      antiguos[data.index].elementos = filtradosInternos
      this.infoCotizacion.elementos = antiguos
      this.realizaOperaciones()
  }
  // aqui editamos la informacion de elemento primario (cantidad, costo) de igual manera se basa en el index del elemento y realizamos operaciones
  editar(donde:string ,data,cantidad){
    if (donde ==='cantidad') {
      if (cantidad<=0) cantidad = 1
      this.infoCotizacion.elementos[data.index].cantidad = cantidad
    }else if (donde ==='costo') {
      if (cantidad<=0) cantidad = 0
      this.infoCotizacion.elementos[data.index].costo = cantidad
    }
    this.realizaOperaciones()
  }
  // aqui editamos la informacion de subelemento por index (cantidad, costo) de igual manera se basa en el index del elemento y subelemento
  //  y realizamos operaciones
  editarSubelemento(donde:string ,data,item,cantidad){
    if (donde ==='cantidad') {
      if (cantidad<=0) cantidad = 1
      this.infoCotizacion.elementos[data.index].elementos[item.index].cantidad = Number(cantidad)
    }else if (donde ==='costo') {
      if (cantidad<=0) cantidad = 0
      this.infoCotizacion.elementos[data.index].elementos[item.index].costo = Number(cantidad)
    }
    this.realizaOperaciones()
  }
  // aqui se realizan todas las operaciones mediante los elementos de la cotizacion obtenemos el reporte de cada elemento
  // y asiganamos a la informacion de reporte en infoCotizacion
  //ya que tenemos los elementos nuevos con caracteristicas nuevas los reemplzamos por los que se tenia anteriormente
  // realizamos la paginacion y asigancaion de resultados
  realizaOperaciones(){
    // const  { elementos, margen_get, iva, formaPago, descuento } = data

    if (this.formPlus) {
      this.infoCotizacion.formaPago =  this.formPlus.controls['formaPago'].value
    }else{
      this.infoCotizacion.formaPago = '1'
    }
    // console.log(this.infoCotizacion);
    
    this.infoCotizacion.iva = this.checksBox.controls['iva'].value
    this.infoCotizacion.reporte = this._publicos.realizarOperaciones_2(this.infoCotizacion).reporte
    this.infoCotizacion.elementos = this._publicos.realizarOperaciones_2(this.infoCotizacion).elementos
    this.dataSource.data = this.infoCotizacion.elementos
    // console.log(this.infoCotizacion.elementos);
    
    this.newPagination()
  }
  //verificamos que existe el vehiculo seleccionado y que este tenga un id de lo contrario colocamos la informacion en null
  vehiculo(IDVehiculo){
    if (IDVehiculo) {
      this.infoCotizacion.vehiculo = this.infoCotizacion.vehiculos.find(v=>v.id === IDVehiculo)
      // infoCotizacion.vehiculo['modelo']
      this.modeloVehiculo = this.infoCotizacion.vehiculo['modelo']
      this.extra = IDVehiculo
    }else{
      this.modeloVehiculo = null
      this.infoCotizacion.vehiculo = null
    }
  }
  //realizamos las valiudaciones para informar al cliente que campos son obligatorios y opcionales en caso de que no se contenga la informacion
  //necesaria para generar el pdf, subirlo y registrar cotizacion
  validaciones(){
    const obligatorios = ['sucursal','servicio', 'margen_get','formaPago']
    const opcionales = ['promocion','descuento','descripcion','nota','iva']
    let camposObligatorios = [], camposOpcionales =[]

    const valores_Form = this.formPlus.value
    const claves = Object.keys(valores_Form)
    claves.forEach(c=>{
      (valores_Form[c]) ? this.infoCotizacion[c] = valores_Form[c] : this.infoCotizacion[c] = null
    })
    obligatorios.forEach(c=>{
      if(!this.infoCotizacion[c]) camposObligatorios.push(c)
    })
    if (!this.infoCotizacion.cliente['id']) camposObligatorios.push('cliente')
    if (!this.infoCotizacion.vehiculo || !this.infoCotizacion.vehiculo['id']) camposObligatorios.push('vehiculo')

    if (!this.infoCotizacion.elementos.length)  camposObligatorios.push('elementos')
    opcionales.forEach(c=>{
      if(!this.infoCotizacion[c]) camposOpcionales.push(c)
    })
    // console.log(this.infoCotizacion);
    this.obligatorios = null
    this.opcionales = null
    this.obligatorios = camposObligatorios.join(', ')
    this.opcionales = camposOpcionales.join(', ')
    //verificamos si paso todas las pruebas continuar con el proceso de lo contrario mensaje de error
    if (camposObligatorios.length) {
      this._publicos.swalToastError('Falta informacion')
    }else{
      this.continuarCotizacion()
    }
  }
  //aqui realizamos la obtencion de la informacion para el pdf y registro de cotizacion
  async continuarCotizacion(){

    //pra el el envio de correos ocupamos correo de sucursal y cliente
    const correos = this._publicos.dataCorreo(this.infoCotizacion.sucursal,this.infoCotizacion.cliente)

    // construirPDF
    //asignamos la informacion de la sucursal para obtener el numero de cotizacion 
    const infoSucursal = this.infoCotizacion.sucursal
    await this._publicos.generaNombreCotizacion(infoSucursal['sucursal'], this.ROL).then(ans=>{
      this.infoCotizacion.no_cotizacion = ans
    })
    //realizamos un string con el nombre de los elementos de la ctoizacion solo enviamos el array de los elementos
    const filtro_conceptos = this._publicos.obtenerNombresElementos(this.infoCotizacion.elementos)
    // asiganamos la datatemporal la cual sirve para correo, pdf
    const tempData = {
      filename:  this.infoCotizacion.no_cotizacion,
      correos,
      pathPDF:'',
      filtro_conceptos,
      cliente: this.infoCotizacion.cliente,
      vehiculo: this.infoCotizacion.vehiculo,
    }
    //obtenemos la fecha, hora y fecha de vencimiento de la cotizacion asignamos a la informacion del pdf
    const getTime = this._publicos.getFechaHora()
    this.infoCotizacion.fecha = getTime.fecha
    this.infoCotizacion.hora = getTime.hora
    this.infoCotizacion.vencimiento = getTime.vencimiento
    // en caso de que el cliente no tenga nombre de empresa asiganamos un string vacio
    if(!this.infoCotizacion.cliente['empresa'])  this.infoCotizacion.cliente['empresa'] = ''
    // en caso de que no tenga nota asiganamos un string vacio
    if(!this.infoCotizacion.nota)  this.infoCotizacion.nota = ''

    // console.log('antes de todo revisar los paquetes no guardados ');
    //primero se filtra la informacion a solo paquetes
    const filter = this.infoCotizacion.elementos.filter(e=>e.tipo === 'paquete')
    // console.log('los paquetes que no estan en catalogo son: ',filter);
    //despues filtramos los paquetes que  no tengan id
    const filtroNotID = filter.filter(f=>!f.id)
    // console.log('los paquetes que no tienen id son: ',filtroNotID);


    //los paquees que no han sido registrados se guardan automaticamente 
    filtroNotID.forEach(p=>{
      const campos = ['elementos','nombre','tipo']
      const recuperada = {
        ...this._publicos.recuperaData(campos,p),
        cilindros: this.infoCotizacion.vehiculo['cilindros'],
        marca: this.infoCotizacion.vehiculo['marca'],
        modelo: this.infoCotizacion.vehiculo['modelo'],
        status: true,
        enCatalogo: true
      }

      const clave = `paquetes/${this._publicos.generaClave()}`;
      const updates = { [clave]: recuperada };
      
      update(ref(db), updates);
    })
    
    
   
    //hacemos el llamdo de la funcion para la creaciion del pdf    
    this._pdf.pdf(this.infoCotizacion,this.checksBox.controls['detalles'].value).then((ansPDF)=>{
      //cuando obtengamos la respuesta asignamos la misma a una variable para su uso de PDF
      const pdfDocGenerator = pdfMake.createPdf(ansPDF);
      //realizamos la pregnta previsualizar o guardar y enviar
      Swal.fire({
        title: 'Opciones de cotización',
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
        } else if (result.isDenied) {
          // si presiono guardar y enviar obtenemos el blob del pdf para poder subirlo a firebasecloud
          pdfDocGenerator.getBlob(async (blob) => {
            //una vez tenemos el blob realizamos la peticion de subida del pdf
            await this._uploadPDF.upload(blob,tempData.filename).then((answer:any)=>{
              //cuando se tenga la respuesta  de subida del pdf la ruta al mismo verificamos que efectivamente exista esta ruta
              const intervalo = setInterval(() => {
                if(answer['ruta']){
                  //limpiamos el intervalo ya que tenemos la ruta y realizamos depuracion de informacion
                  clearInterval(intervalo)
                  const updates = {};
                  const campos = ['cliente','elementos','fecha','formaPago','hora','iva','margen_get','no_cotizacion',
                                  'nota','reporte','servicio','sucursal','vehiculo','vencimiento'
                ]
                //asigamos solo los campos que queremos recuperaer
                  const infoSave = this._publicos.recuperaData(campos,this.infoCotizacion)
    
                  updates['cotizacionesRealizadas/' + this._publicos.generaClave()] = infoSave;
                  //hacemos la llamada al registro de la cotizacion
                  update(ref(db), updates)
                  .then(() => {
                    // realizamos la descarga del pdf
                    pdfMake.createPdf(ansPDF).download(tempData.filename);
                    // asignamos la ruta en el registro de la cotizacion
                    tempData.pathPDF = answer.ruta
                    //llamamos la funcion de envio de email
                    this._email.EmailCotizacion(tempData)
                    //mensaje de correcto aunque no se envie email
                    this._publicos.swalToast('Cotizacion realizada!!')
                    //limpiamos la informacion para nueva cotizacion
                    this.infoCotizacion = {
                      cliente:{},vehiculo:{},vehiculos:[],elementos:[],sucursal:{},reporte:{}, iva:true, formaPago: '1', descuento: 0, margen_get: 25,
                      fecha: null, hora:null, no_cotizacion:null, vencimiento:null, nota:null, servicio:'1', descripcion:null
                    }
                    //redireccionamos a cotizaciones disponibles
                    this.router.navigateByUrl('/cotizacion')
                  })
                  .catch((error) => {
                    // The write failed...
                    this._publicos.swalToastError('Error al guardar la cotizacion')
                  });
                }
              },200)
            })
          })
        }
      })
    })
        
    

    // filename
    // pathPDF
    // subject
    // tipo
    // emailAnexa
    // filtro_conceptos
    // const infoSucursal = this.infoCotizacion.sucursal
    // const filtro_conceptos = this._publicos.obtenerNombresElementos(this.infoCotizacion.elementos)
    // const tempData = {
    //   filename: this._publicos.generaNombreCotizacion(infoSucursal['sucursal'], this.ROL),
    //   correos,
    //   filtro_conceptos
    // }
    // this._email.EmailCotizacion(tempData)
  }
  accionesExtra(campo:string, valor){
    if(campo ==='descuento'){
      this.infoCotizacion.descuento = valor
    }else if(campo ==='margen'){
      this.infoCotizacion.margen_get = valor
    }
    this.realizaOperaciones()
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }


}
