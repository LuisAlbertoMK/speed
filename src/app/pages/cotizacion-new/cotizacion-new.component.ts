import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { child, get, getDatabase, onValue, push, ref, update, onChildAdded, onChildChanged, onChildRemoved, query, orderByChild, startAt, equalTo} from "firebase/database";


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs
//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';



import { ActivatedRoute, Router } from '@angular/router';

import { EncriptadoService } from 'src/app/services/encriptado.service';
import { PdfService } from 'src/app/services/pdf.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import Swal from 'sweetalert2';
import { ClientesService } from '../../services/clientes.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { EmailsService } from '../../services/emails.service';
import { UploadPDFService } from '../../services/upload-pdf.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from '../../services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';
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
  
  constructor(
    private _security:EncriptadoService, private rutaActiva: ActivatedRoute, private _publicos: ServiciosPublicosService,
    private _formBuilder: FormBuilder, private _email: EmailsService, private _pdf: PdfService, private _uploadPDF: UploadPDFService,
    private router: Router, private _sucursales: SucursalesService, private _clientes: ClientesService, private _cotizacion: CotizacionService,
    private _cotizaciones: CotizacionesService, private _vehiculos: VehiculosService, private _servicios: ServiciosService, private _campos: CamposSystemService) { }
    
  ROL:string; SUCURSAL:string
  
  infoCotizacion   = {
    cliente:'', data_cliente:{},vehiculo:'', data_vehiculo:{},vehiculos:[],elementos:[],sucursal:'',reporte:null, iva:true, formaPago: '1', descuento: 0, margen: 25,promocion:'',fecha_recibido:'', no_cotizacion:null, vencimiento:'', nota:null, servicio: '1', pdf:null, data_sucursal: {}, showDetalles:false
  }

  camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce ]
  camposCliente    =  [ ...this._clientes.camposCliente_show ]
  camposVehiculo   =  [ ...this._vehiculos.camposVehiculo_ ]
  formasPago       =  [ ...this._cotizaciones.formasPago ]
  servicios        =  [ ...this._servicios.servicios ]
  promociones      =  [ ...this._campos.promociones ]
  sucursales_array =  [ ...this._sucursales.lista_en_duro_sucursales ]
  
  paquete: string     =  this._campos.paquete
  refaccion: string   =  this._campos.refaccion
  mo: string          =  this._campos.mo
  miniColumnas:number =  this._campos.miniColumnas
   // tabla
   dataSource = new MatTableDataSource(); //elementos
   elementos = ['nombre','cantidad','sobrescrito','precio','total']; //elementos
   columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
   expandedElement: any | null; //elementos
   @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
   @ViewChild('elements') sort: MatSort //elementos


  checksBox = this._formBuilder.group({
    iva: true,
    detalles: false
  });

  formPlus: FormGroup

  // obligatorios:string
  // opcionales:string
  extra:string
  tipo:string

  datCliente:any
  cliente:string = null

  vehiculoData:string = null
  idPaqueteEditar: number = -1
  

  modeloVehiculo:string = null

  elementosPrueba = []

  enrutamiento = {cliente:'', sucursal:'', cotizacion:'', tipo:'', anterior:'', vehiculo:'', recepcion:''}
  faltante_s:string


  data_cliente = {}

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

  editar_cliente:boolean = false
  modelo:string

  enProceso:boolean = false
  ngOnInit() {
    this.rol()
    this.crearFormPlus()
  }
  ngAfterViewInit(): void {
    // this.crearFormPlus()
  }
  
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()
    
    

    this.ROL = rol
    this.SUCURSAL = sucursal
    
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
      this.cargaDataCliente_new()
    });
  }
  async cargaDataCliente_new(){

    const {cliente, sucursal, cotizacion, tipo, anterior, vehiculo, recepcion } = this.enrutamiento
    
    let  data_cliente:any = {},  vehiculos_arr = [], data_vehiculo = {}

    this.infoCotizacion = this._cotizacion.infoCotizacion
    // console.log(cliente);
    if (cliente) this.infoCotizacion.cliente = cliente
    
    if (cliente) {
      data_cliente  = await this._clientes.consulta_Cliente(cliente)
      data_cliente = this.nueva_data_cliente(data_cliente)
    }
  
    // if (cliente) vehiculos_arr = await this._vehiculos.consulta_vehiculos({cliente, sucursal})
    // data_vehiculo = (vehiculo) ? vehiculos_arr.find(v=>v.id === vehiculo) :null 

    // console.log(vehiculos_arr);
    
    

    const campos = [
      'cliente',
      'descuento',
      'elementos',
      'formaPago',
      'iva',
      'margen',
      'nota',
      'servicio',
      'sucursal',
      'vehiculo',
    ]

    if (recepcion){

      const busqueda_ruta_recepcion = `recepciones/${recepcion}`
      const data_recepcion = await this._servicios.consulta_recepcion_new({ruta: busqueda_ruta_recepcion})
      
      data_recepcion.descuento = (data_recepcion.descuento) ? data_recepcion.descuento : 0
      data_recepcion.nota = nota_valida(data_recepcion.nota)

      function nota_valida(nota){
        let nueva_nota = nota
        if (!nota || nota === undefined || nota === null) {
          nueva_nota = ''
        }
        return nueva_nota
      }

      campos.forEach(campo=>{
        this.infoCotizacion[campo] = data_recepcion[campo]
      })
      
    }
    if (cotizacion){
      const busqueda_ruta_recepcion = `cotizacionesRealizadas/${cotizacion}`
      
      const data_cotizacion = await this._cotizaciones.consulta_cotizacion_unica({ruta: busqueda_ruta_recepcion})

      data_cotizacion.descuento = (data_cotizacion.descuento) ? data_cotizacion.descuento : 0
      data_cotizacion.nota = (data_cotizacion.nota) ? data_cotizacion.nota : ''

      campos.forEach(campo=>{
        this.infoCotizacion[campo] = data_cotizacion[campo]
      })
      
    }

    this.extra = vehiculo

    this.infoCotizacion.data_cliente = data_cliente


    if (cliente) {
      this.infoCotizacion.sucursal = data_cliente.sucursal
      this.infoCotizacion.data_sucursal = this.sucursales_array.find(sucursal => sucursal.id === data_cliente.sucursal)
    }
    
    
    // const data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
    // this.infoCotizacion.data_sucursal = data_sucursal
    // this.infoCotizacion.sucursal = sucursal
    
    this.infoCotizacion.vehiculo = vehiculo

    this.realizaOperaciones()
    this.vigila_vehiculos_cliente()

  }
  async vigila_vehiculos_cliente(){

    const starCountRef = ref(db, `vehiculos`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const {cliente} = this.infoCotizacion 
        const vehiculos = this._publicos.crearArreglo2(snapshot.val())
        this.infoCotizacion.vehiculos = vehiculos.filter(vehiculo=>vehiculo.cliente === cliente)
        const data_vehiculo =  vehiculos.find(v=>v.id === this.extra)
        this.infoCotizacion.data_vehiculo  = data_vehiculo
        this.infoCotizacion.vehiculo  = this.extra
        if (data_vehiculo) {
          if (data_vehiculo.modelo) {
            this.modelo = data_vehiculo['modelo']
          }
        }
      } else {
        // console.log("No data available");
        this.infoCotizacion.vehiculos = []
        this.extra = null
        this.modelo = null
      }
    })
  
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
      margen:[this.infoCotizacion.margen,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      formaPago:['1',[Validators.required]],
      promocion:['',[]],
      descuento:['',[Validators.min(0)]],
      nota:['',[]]
    })
    this.vigila()
  }
  vigila(){
    this.checksBox.get('iva').valueChanges.subscribe((iva: boolean) => {
      this.infoCotizacion.iva = iva
      this.realizaOperaciones()
    })
    this.checksBox.get('detalles').valueChanges.subscribe((detalles: boolean) => {
      this.infoCotizacion.showDetalles = detalles
    })
    this.formPlus.get('descuento').valueChanges.subscribe((descuento: number) => {
      const nuevo_descuento = descuento < 0 ? 0 : descuento
      this.infoCotizacion.descuento = nuevo_descuento
      this.realizaOperaciones()
    })
    this.formPlus.get('nota').valueChanges.subscribe((nota: string) => {
      const nuevo_nota = nota ? nota : ''
      this.infoCotizacion.nota = String(nuevo_nota).toLowerCase()
    })
    this.formPlus.get('margen').valueChanges.subscribe((margen: number) => {
      const nuevo_margen = Math.min(Math.max(margen, 25), 100);
      this.infoCotizacion.margen = nuevo_margen
      this.realizaOperaciones()
    })
    this.formPlus.get('formaPago').valueChanges.subscribe((formaPago: string) => {
      this.infoCotizacion.formaPago = formaPago
      this.realizaOperaciones()
    })
    this.formPlus.get('promocion').valueChanges.subscribe((promocion: string) => {
      this.infoCotizacion.promocion = promocion
    })
    this.formPlus.get('servicio').valueChanges.subscribe((servicio: string) => {
      this.infoCotizacion.servicio = servicio
    })
  }
  validaCampo(campo: string){
    return this.formPlus.get(campo).invalid && this.formPlus.get(campo).touched
  }
  // primer hay que saber que tipo de usuario es en cada modulo para sus permisos, filtros, etc ademas de la SUCURSAL
  
  regresar(){
    this.router.navigate([`/${this.enrutamiento.anterior}`], { 
      queryParams: this.enrutamiento
    });
  }
  
  // REEMPLAZAR REFRIGERANTE Y PURGAR SISTEMA DE ENFRIAMIENTO
  //aqui la informacion del clienyte
  async infoCliente(cliente){

    if (cliente) {
      const {id, sucursal} = cliente
      this.infoCotizacion.cliente = id
      this.infoCotizacion.data_cliente = cliente
      this.infoCotizacion.sucursal = sucursal
      this.infoCotizacion.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
      this.extra = null
      this.infoCotizacion.data_vehiculo = {}
      this.infoCotizacion.vehiculo = null
      this.vigila_vehiculos_cliente()
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
  async clientesInfo(event){
    // console.log(event);
    const {uid, sucursal, id} = event
    if (id) {
      this.infoCotizacion.cliente = id
      this.infoCotizacion.data_cliente = event
      this.infoCotizacion.sucursal = sucursal
      this.infoCotizacion.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
      
      this.extra = null
      this.infoCotizacion.data_vehiculo = {}
      this.infoCotizacion.vehiculo = null
      this.vigila_vehiculos_cliente()
    }
    
  }
  cargaDataVehiculo(data: any, quien: string) {
    this.cliente = null;
    this.vehiculoData = null;
  
    if (quien === 'cliente' && data['id']) {
      setTimeout(() => {
        this.cliente = data['id'];
      }, 300);
    }
  
    if (quien === 'vehiculo' && data['id']) {
      setTimeout(() => {
        this._publicos.mensaje('Se cargó la información',1);
        this.vehiculoData = data;
      }, 300);
    }
  }
  
  vehiculo_registrado(event){
     if (event) {
      this.extra = event
      this.vigila_vehiculos_cliente()
    }
  }

  agrega_principal(event){
    let nuevos = [...this.infoCotizacion.elementos]
    const {id} = event
    if (id) {
      if (this.idPaqueteEditar >=0 ) {
          nuevos[this.idPaqueteEditar].elementos.push(event)
          this.asignar_nuevos_elementos(nuevos)
      }else{
        nuevos.push(event)
        this.asignar_nuevos_elementos(nuevos)
      }
    }
  }
  eliminaElemento(data){
    const { index:index_elimina } = data
    let nuevos = [...this.infoCotizacion.elementos]
    nuevos = nuevos.filter((elemento, index) => index !== index_elimina);
    this.asignar_nuevos_elementos(nuevos)
  }
  editar(donde:string , data , cantidad){
    const nueva_cantidad = parseFloat(cantidad)
    const { index:index_editar } = data

    let nuevos = [...this.infoCotizacion.elementos]
    nuevos[index_editar][donde] = nueva_cantidad
    this.asignar_nuevos_elementos(nuevos)
  }
  asignar_nuevos_elementos(nuevos:any[]){
    this.infoCotizacion.elementos = nuevos
    this.realizaOperaciones()
  }

  editar_subelemento_paquete(donde:string ,data , item ,cantidad){
    const nueva_cantidad = parseFloat(cantidad)
    const { index:index_editar } = data
    const { index:index_editar_subelemento } = item
   
    let nuevos = [...this.infoCotizacion.elementos]
    
    let nuevos_internos = nuevos[index_editar].elementos
    
    const internos_n = [...nuevos_internos]
  
    internos_n[index_editar_subelemento][donde] = nueva_cantidad
    
    nuevos[index_editar].elementos = internos_n

    this.asignar_nuevos_elementos(nuevos)
  }

  eliminar_subelemento_paquete(data,item){

    const { index:index_editar } = data
    const { index:index_editar_subelemento } = item

    let nuevos = [...this.infoCotizacion.elementos]
    let nuevos_internos = nuevos[index_editar].elementos

    const internos_n = [...nuevos_internos]

    const nuevos_ = internos_n.filter(elemento => elemento.index !== index_editar_subelemento);

    nuevos[index_editar].elementos = nuevos_
    
    // nuevos[index_editar].elementos = nuevos_

    this.asignar_nuevos_elementos(nuevos)
  }

  realizaOperaciones(){

    const reporte_totales = {
      mo:0,
      refacciones:0,
    }

    const  {reporte, _servicios} = this.calcularTotales(this.infoCotizacion)
      Object.keys(reporte_totales).forEach(campo=>{
        reporte_totales[campo] += reporte[campo]
      })

    const _servicios_ = JSON.parse(JSON.stringify(_servicios));

    this.infoCotizacion.reporte = reporte
    this.infoCotizacion.elementos = _servicios_
    this.dataSource.data = _servicios_
    this.newPagination()

  }
  //verificamos que existe el vehiculo seleccionado y que este tenga un id de lo contrario colocamos la informacion en null
  vehiculo(IDVehiculo){
      this.extra = IDVehiculo
      this.infoCotizacion.vehiculo = IDVehiculo
      this.vigila_vehiculos_cliente()
  }
  async continuarCotizacion(){
    this.enProceso = false
    const obligatorios = ['sucursal','cliente','vehiculo','elementos','servicio', 'margen','formaPago']
    // const opcionales = ['promocion','descuento','nota','iva']
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(this.infoCotizacion,obligatorios )
    // console.log(this.infoCotizacion);
    
    this.faltante_s = faltante_s
    if (!ok) return

    this.enProceso = true
    const {promocion, descuento, nota} = this._publicos.recuperaDatos(this.formPlus)

    this.infoCotizacion.descuento = descuento
    this.infoCotizacion.nota = nota
    this.infoCotizacion.promocion = promocion

    const correos = this._publicos.dataCorreo(this.infoCotizacion.data_sucursal,this.infoCotizacion.data_cliente)

    
    
    const {sucursal, cliente, data_sucursal, data_cliente} = this.infoCotizacion
    await this._cotizaciones.generaNombreCotizacion(this.ROL, {sucursal, cliente, data_sucursal, data_cliente}).then(ans=>{
      this.infoCotizacion.no_cotizacion = ans
    })

    const filtro_conceptos = this._publicos.obtenerNombresElementos(this.infoCotizacion.elementos)

    const tempData = {
      filename:  this.infoCotizacion.no_cotizacion,
      correos,
      pathPDF:'',
      filtro_conceptos,
      cliente: this.infoCotizacion.cliente,
      vehiculo: this.infoCotizacion.vehiculo,
    }


    const actual  = this._publicos.retorna_fechas_hora({fechaString: new Date()}).fecha_hora_actual
    const sumar = new Date(actual)
    this.infoCotizacion.fecha_recibido = actual
    const nueva = this._publicos.sumarRestarDiasFecha(sumar, 20)
    this.infoCotizacion.vencimiento = this._publicos.retorna_fechas_hora({fechaString: nueva.toString()}).toString
    
    const filter = this.infoCotizacion.elementos.filter(e=>e.tipo === 'paquete')

    const filtroNotID = filter.filter(f=>!f.id)
    const updates_paquetes = {  };

    this.infoCotizacion.data_vehiculo = this._vehiculos.verificaInfo_vehiculo(this.infoCotizacion.data_vehiculo)
    const {data_vehiculo} = this.infoCotizacion
    filtroNotID.forEach(p=>{
      const campos = ['elementos','nombre','tipo','cilindros','marca','modelo']
      const recuperada = {
        ...this._publicos.nuevaRecuperacionData(p,campos),
        cilindros: data_vehiculo['cilindros'],
        marca: data_vehiculo['marca'],
        modelo: data_vehiculo['modelo'],
        status: true,
        enCatalogo: true
      }
      const clave = `paquetes/${this._publicos.generaClave()}`;
      updates_paquetes[clave] = recuperada
    })   
    update(ref(db), updates_paquetes);
    Swal.fire({title:'espere...',icon: 'info', showConfirmButton: false, allowOutsideClick: false})
    Swal.isLoading()
    //hacemos el llamdo de la funcion para la creaciion del pdf    
    this._pdf.pdf(this.infoCotizacion).then((ansPDF)=>{
      //cuando obtengamos la respuesta asignamos la misma a una variable para su uso de PDF
      const pdfDocGenerator = pdfMake.createPdf(ansPDF);
      //realizamos la pregnta previsualizar o guardar y enviar
      Swal.fire({
        title: 'Opciones de cotización',
        html:`<strong class='text-danger'>Se recomienda visualizar pdf antes de enviar</strong>`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Previsualizar PDF cotizacion',
        denyButtonText: `Guardar y enviar correo`,
        cancelButtonText:`Cancelar`,
        allowOutsideClick: false,
        cancelButtonColor: '#5a5952'
      }).then((result) => {
        // si se confirma previsualizacion genera pdf en nueva ventana del navegador
        if (result.isConfirmed) {
          pdfDocGenerator.open()
          this.enProceso = false
        } else if (result.isDenied) {
          // si presiono guardar y enviar obtenemos el blob del pdf para poder subirlo a firebasecloud
          pdfDocGenerator.getBlob(async (blob) => {
            //una vez tenemos el blob realizamos la peticion de subida del pdf
            await this._uploadPDF.upload(blob,tempData.filename).then((answer:any)=>{
              //cuando se tenga la respuesta  de subida del pdf la ruta al mismo verificamos que efectivamente exista esta ruta
              const intervalo = setInterval(() => {
                if(answer['ruta']){
                  this.infoCotizacion.pdf = answer['ruta']
                  //limpiamos el intervalo ya que tenemos la ruta y realizamos depuracion de informacion
                  clearInterval(intervalo)
                  const updates = {};
                  const campos = ['cliente','elementos','fecha_recibido','formaPago','iva','margen','no_cotizacion',
                                  'nota','servicio','sucursal','vehiculo','vencimiento','pdf'
                ]
                //asigamos solo los campos que queremos recuperaer
                  const infoSave = this._publicos.nuevaRecuperacionData(this.infoCotizacion,campos)
                  // console.log(infoSave);
                  const {sucursal, cliente} = this.infoCotizacion
                  const otros = this.purifica_informacion(infoSave)
                  const filtrados = otros.filter((element) => {
                    if (element.tipo === "paquete") {
                      return element.elementos.length > 0;
                    }
                    return true;
                  });

                  infoSave['elementos'] = filtrados
                  
                  updates[`cotizacionesRealizadas/${this._publicos.generaClave()}`] = infoSave;
                
                  update(ref(db), updates)
                  .then(() => {
                    // realizamos la descarga del pdf
                    pdfMake.createPdf(ansPDF).download(tempData.filename);
                    // asignamos la ruta en el registro de la cotizacion
                    tempData.pathPDF = answer.ruta
                    //llamamos la funcion de envio de email
                    this._email.EmailCotizacion(tempData)
                    //mensaje de correcto aunque no se envie email
                    this._publicos.swalToast('Cotizacion realizada!!', 1, 'top-start')
                    //limpiamos la informacion para nueva cotizacion
                    
                    this.infoCotizacion = {
                      cliente:'', data_cliente:{},vehiculo:'', data_vehiculo:{},vehiculos:[],elementos:[],sucursal:'',reporte:null, iva:true, formaPago: '1', descuento: 0, margen: 25,promocion:'',fecha_recibido:'', no_cotizacion:null, vencimiento:'', nota:null, servicio: '1', pdf:null, data_sucursal: {}, showDetalles:false
                    }
                    this.formPlus.reset({
                      servicio: 1,
                      margen: 25,
                      formaPago: '1'
                    })
                    this.realizaOperaciones()
                    
                    this.router.navigateByUrl('/cotizacion')
                  })
                  .catch((error) => {
                    this._publicos.swalToast('Error al guardar la cotizacion', 0, 'top-start')
                  });
                }
              },200)
            })
          })
        } else if(result.isDismissed){
          this.enProceso = false
        }
      })
    }
    )
    .catch(err=>{
      Swal.close()
      this._publicos.mensajeSwal('algo salio mal',0)
    })
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }

  nueva_data_cliente(cliente){
    const nombres = [
      {clave: '-N2gkVg1RtSLxK3rTMYc',nombre:'Polanco'},
      {clave: '-N2gkzuYrS4XDFgYciId',nombre:'Toreo'},
      {clave: '-N2glF34lV3Gj0bQyEWK',nombre:'Culhuacán'},
      {clave: '-N2glQ18dLQuzwOv3Qe3',nombre:'Circuito'},
      {clave: '-N2glf8hot49dUJYj5WP',nombre:'Coapa'},
      {clave: '-NN8uAwBU_9ZWQTP3FP_',nombre:'lomas'},
    ]
    const {sucursal, nombre, apellidos} = cliente
    cliente.sucursalShow = nombres.find(s=>s.clave === sucursal).nombre
    cliente.fullname = `${nombre} ${apellidos}`
    return cliente
  }

  calcularTotales(data) {
    const {margen: new_margen, formaPago, elementos, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0, costos:0}
    
    // const servicios_ = (elementos) ? elementos 


    const _servicios = [...elementos] 
    
    const margen = 1 + (new_margen / 100)
    _servicios.map((ele, index) =>{
      const {cantidad, costo, tipo, precio} = ele
      ele.index = index
      if (tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          ele.precio = mo + (refacciones * margen)
          ele.total = (mo + (refacciones * margen)) * cantidad
          if (costo > 0 ){
            ele.total = costo * cantidad
            reporte.costos += costo * cantidad
          }else{
            reporte.mo += mo
            reporte.refacciones += refacciones
          }
        }
      }else if (tipo === 'mo' || tipo === 'refaccion') {

        // const operacion = this.mano_refaccion(ele)
        const operacion = (costo>0) ? cantidad * costo : cantidad * precio 

        ele.subtotal = operacion
        
        if (ele.aprobado){
          if (costo > 0 ){
            reporte.costos += (tipo === 'refaccion') ? operacion * margen : operacion
          }else{
            const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
            reporte[donde] += operacion
          }
          ele.total = (tipo === 'refaccion') ? operacion * margen : operacion
        }
      }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0

    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))

    const {mo, refacciones} = reporte

    reporte.refacciones_v = refacciones * margen

    let nuevo_total = mo + reporte.refacciones_v + reporte.costos
    
    let total_iva = _iva ? nuevo_total * 1.16 : nuevo_total;

    let iva =  _iva ? nuevo_total * .16 : 0;

    let total_meses = (enCaso_meses.id === '1') ? 0 : total_iva * (1 + (enCaso_meses.interes / 100))
    let newTotal = (enCaso_meses.id === '1') ?  total_iva -= descuento : total_iva
    let descuentoshow = (enCaso_meses.id === '1') ? descuento : 0

    reporte.descuento = descuentoshow
    reporte.iva = iva
    reporte.subtotal = nuevo_total
    reporte.total = newTotal
    reporte.meses = total_meses

    reporte.ub = (nuevo_total - refacciones) * (100 / nuevo_total)
    return {reporte, _servicios}
    
  }
  mano_refaccion({costo, precio, cantidad}){
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete({elementos}){
    const reporte = {mo:0, refacciones:0}
    const nuevos_elementos = [...elementos] 

    if (!nuevos_elementos.length) return reporte

    nuevos_elementos.forEach(ele=>{
      const {tipo} = ele
      const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
      const operacion = this.mano_refaccion(ele)
      reporte[donde] += operacion
    })
    return reporte
  }

  purifica_informacion(data){
    const nueva_ = JSON.parse(JSON.stringify(data));
    const {elementos} = nueva_
    const _elementos_purifica = (elementos) ? elementos : []
    const registra = _elementos_purifica.map(element => {
      const {tipo } = element
      const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
      const campos_refaccion = [ ...campos_mo, 'marca']
      const campos_paquete = [ 'aprobado', 'cantidad', 'cilindros', 'costo', 'elementos', 'enCatalogo', 'id', 'marca', 'modelo', 'nombre', 'status', 'tipo' ]
      let nueva 
      switch (tipo) {
        case 'paquete':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_paquete)
          const info_su = this.purifica_informacion_interna(nueva.elementos)
          // console.log(info_su);
          nueva.elementos = info_su
          
          break;
        case 'mo':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_mo)
          break;
        case 'refaccion':
          nueva = this._publicos.nuevaRecuperacionData(element,campos_refaccion)
          break;
      }

      //primera recuperacion 
      // console.log(nueva);
      return nueva
    });
    // console.log(registra);
    return registra
  }
  purifica_informacion_interna(elementos:any[]){
    const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
    const campos_refaccion = [ ...campos_mo, 'marca']

    const nuevos_elementos = elementos.map(e=>{
      const {tipo} = e
      e.nombre = String(e.nombre).toLowerCase()
      switch (tipo) {
        case 'mo':
        case 'MO':
          e.id = e.IDreferencia
          e.tipo = String(tipo).toLowerCase()
          
          return this._publicos.nuevaRecuperacionData(e,campos_mo)
        case 'refaccion':
          return this._publicos.nuevaRecuperacionData(e,campos_refaccion)
      }
    })

    return nuevos_elementos 

  }
}
