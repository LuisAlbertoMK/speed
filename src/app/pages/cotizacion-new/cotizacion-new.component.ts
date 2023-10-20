import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  getDatabase, ref, update} from "firebase/database";


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
import Swal from 'sweetalert2'
import { ClientesService } from '../../services/clientes.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { EmailsService } from '../../services/emails.service';
import { UploadPDFService } from '../../services/upload-pdf.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from '../../services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { AutomaticosService } from 'src/app/services/automaticos.service';
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
export class CotizacionNewComponent implements OnInit,AfterViewInit, OnChanges {
  
  constructor(
    private _automaticos:AutomaticosService, private _security:EncriptadoService, private rutaActiva: ActivatedRoute, 
    private _publicos: ServiciosPublicosService, private _formBuilder: FormBuilder, 
    private _email: EmailsService, private _pdf: PdfService, private _uploadPDF: UploadPDFService,
    private router: Router, private _sucursales: SucursalesService, private _clientes: ClientesService, 
    private _cotizacion: CotizacionService, private _cotizaciones: CotizacionesService, 
    private _vehiculos: VehiculosService, private _servicios: ServiciosService, private _campos: CamposSystemService) { }
    
  _rol:string; _sucursal:string
  
  infoCotizacion   = {
    cliente:'', data_cliente:{},vehiculo:'', data_vehiculo:{},vehiculos:[],elementos:[],sucursal:'',reporte:null, iva:true, formaPago: '1', descuento: 0, margen: 25,promocion:'',fecha_recibido:'', no_cotizacion:null, vencimiento:'', nota:null, servicio: '1', pdf:null, data_sucursal: {}, showDetalles:false, kms:0
  }

  // camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce ]
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

  vehiculos_arr= []
  vehiculo_cache 
  ngOnInit() {
    this.rol()
    this.crearFormPlus()
  }
  ngAfterViewInit(): void {
    // this.crearFormPlus()
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehiculos_arr']) {

      const nuevoValor = changes['vehiculos_arr'].currentValue;
      const valorAnterior = changes['vehiculos_arr'].previousValue;
      
      console.log(nuevoValor);
      console.log(valorAnterior);
      
    }
  }
  
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()
    
    

    this._rol = rol
    this._sucursal = sucursal
    
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
      // this.vigila_hijo()
      this.cargaDataCliente_new()
    });

    this.vehiculo_cache = this._publicos.nueva_revision_cache('vehiculos')
    
  }
  // vigila_hijo(){
  //   const rutas_vigila = [
  //     'clientes',
  //     'vehiculos',
  //     'recepciones',
  //     'historial_gastos_operacion',
  //     'historial_gastos_orden',
  //     'historial_pagos_orden'
  //   ]
  //   rutas_vigila.forEach(nombre=>{
  //     const starCountRef = ref(db, `${nombre}`)
  //     onValue(starCountRef, (snapshot) => {
  //       if (snapshot.exists()) {
  //         this.cargaDataCliente_new()
  //       }
  //     })
  //   })
    
  // }
  async cargaDataCliente_new(){

    const {cliente, sucursal, cotizacion, tipo, anterior, vehiculo, recepcion } = this.enrutamiento
    
    

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
      'data_cliente',
      'data_vehiculo',
      'data_sucursal',
      'promocion'
    ]

    const clientes = this._publicos.nueva_revision_cache('clientes')
    const vehiculos = this._publicos.nueva_revision_cache('vehiculos')

    if (recepcion){

      const recepciones_object = this._publicos.nueva_revision_cache('cotizaciones')
      
      const historial_gastos_orden = this._publicos.crearArreglo2(this._publicos.nueva_revision_cache('historial_gastos_orden'))
      const historial_pagos_orden = this._publicos.crearArreglo2(this._publicos.nueva_revision_cache('historial_pagos_orden'))

      const data_recepcion = recepciones_object[recepcion]
      
      const cotizaciones_arregladas = this._publicos.asigna_datos_recepcion({
        bruto: [data_recepcion], clientes, vehiculos,
        historial_gastos_orden,
        historial_pagos_orden
      })

      const nueva_data_recepcion = cotizaciones_arregladas[0]

      nueva_data_recepcion.descuento = (nueva_data_recepcion.descuento) ? nueva_data_recepcion.descuento : 0
      nueva_data_recepcion.nota = (nueva_data_recepcion.nota) ? nueva_data_recepcion.nota : ''
      nueva_data_recepcion.promocion = (nueva_data_recepcion.promocion) ? nueva_data_recepcion.promocion : 'ninguna'

      campos.forEach(campo=>{
        this.infoCotizacion[campo] = nueva_data_recepcion[campo]
      })
      this.extra = cotizaciones_arregladas[0].vehiculo
    }else if (cotizacion){
      const cotizaciones_object = this._publicos.nueva_revision_cache('cotizaciones')

      const data_cotizacion = cotizaciones_object[cotizacion]

      const cotizaciones_arregladas = this._publicos.nueva_asignacion_recepciones(data_cotizacion)
      
      const nueva_data_cotizacion = cotizaciones_arregladas[0]
      
      nueva_data_cotizacion.descuento = (nueva_data_cotizacion.descuento) ? nueva_data_cotizacion.descuento : 0
      nueva_data_cotizacion.nota = (nueva_data_cotizacion.nota) ? nueva_data_cotizacion.nota : ''
      nueva_data_cotizacion.promocion = (nueva_data_cotizacion.promocion) ? nueva_data_cotizacion.promocion : 'ninguna'
      
      campos.forEach(campo=>{
        this.infoCotizacion[campo] = nueva_data_cotizacion[campo]
      })
      this.extra = cotizaciones_arregladas[0].vehiculo
    } else if(cliente){
      
      this.infoCotizacion.cliente = cliente
      const data_cliente_new = this._publicos.crear_new_object(clientes[cliente])
      data_cliente_new.id = cliente
      this.infoCotizacion.data_cliente = data_cliente_new
    } else if(vehiculo){
      const data_vehiculo = this._publicos.crear_new_object(vehiculos[vehiculo])
      const data_cliente_new = this._publicos.crear_new_object(clientes[data_vehiculo.cliente])
      data_cliente_new.id = data_vehiculo.cliente
      this.infoCotizacion.data_cliente = data_cliente_new
      this.infoCotizacion.cliente = data_vehiculo.cliente
      this.extra = vehiculo
      this.infoCotizacion.vehiculo = vehiculo
    }

    this.asignar_nuevos_elementos(this.infoCotizacion.elementos)
    const {cliente: id_cliente} = this.infoCotizacion
    if (id_cliente) {
      this.vigila_vehiculos_cliente()
    }

  }
  vigila_vehiculos_cliente(){

    const {cliente: id_cliente} = this.infoCotizacion
    
    const vehiculos_cliente = this._publicos.filtrarObjetoPorPropiedad(this.vehiculo_cache,'cliente',id_cliente)

    if (Object.keys(vehiculos_cliente).length) {
      this.vehiculos_arr = this._publicos.crearArreglo2(vehiculos_cliente)

      if (this.extra) {
        const data_vehiculo = this.vehiculos_arr.find(v=>v.id === this.extra)
        this.infoCotizacion.data_vehiculo = data_vehiculo
        this.modelo = data_vehiculo.modelo
      }
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
      margen:[this.infoCotizacion.margen,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      formaPago:['1',[Validators.required]],
      promocion:['',[]],
      descuento:['',[Validators.min(0)]],
      kms:['',[Validators.min(0)]],
      nota:['',[]]
    })
    this.vigila()
  }
  vigila(){
    this.checksBox.get('iva').valueChanges.subscribe((iva: boolean) => {
      this.infoCotizacion.iva = iva
      console.log('iva');
      
      this.realizaOperaciones()
    })
    this.checksBox.get('detalles').valueChanges.subscribe((detalles: boolean) => {
      this.infoCotizacion.showDetalles = detalles
    })
    this.formPlus.get('descuento').valueChanges.subscribe((descuento: number) => {
      const nuevo_descuento = descuento < 0 ? 0 : descuento
      this.infoCotizacion.descuento = nuevo_descuento
      console.log('descuento');
      this.realizaOperaciones()
    })
    this.formPlus.get('kms').valueChanges.subscribe((kms: number) => {
      const nuevo_kms = kms < 0 ? 0 : kms
      this.infoCotizacion.kms = nuevo_kms
    })
    this.formPlus.get('nota').valueChanges.subscribe((nota: string) => {
      const nuevo_nota = nota ? nota : ''
      this.infoCotizacion.nota = String(nuevo_nota).toLowerCase()
    })
    this.formPlus.get('margen').valueChanges.subscribe((margen: number) => {
      const nuevo_margen = Math.min(Math.max(margen, 25), 100);
      this.infoCotizacion.margen = nuevo_margen
      console.log('nuevo_margen');
      this.realizaOperaciones()
    })
    this.formPlus.get('formaPago').valueChanges.subscribe((formaPago: string) => {
      this.infoCotizacion.formaPago = formaPago
      console.log('formaPago');
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
      const {id} = cliente
      this.infoCotizacion.cliente = id
      this.infoCotizacion.data_cliente = cliente
      // this.infoCotizacion.sucursal = sucursal
      // this.infoCotizacion.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
      this.extra = null
      this.infoCotizacion.data_vehiculo = {}
      this.infoCotizacion.vehiculo = null
      
      const {cliente: id_cliente} = this.infoCotizacion
      if (id_cliente) {
        this.vigila_vehiculos_cliente()
      }
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
    const actual_elemento = this._publicos.crear_new_object(event)
    // actual_elemento.costo = (parseFloat(actual_elemento.costo) > 0 ) ? actual_elemento.costo : 0
    if (id) {
      if (this.idPaqueteEditar >=0 ) {
          nuevos[this.idPaqueteEditar].elementos.push(actual_elemento)
          this.nuevos_elementos(nuevos)
      }else{
        nuevos.push(actual_elemento)
        this.nuevos_elementos(nuevos)
      }
    }
  }
  eliminaElemento(data){
    const { index:index_elimina } = data
    let nuevos = [...this.infoCotizacion.elementos]
    nuevos = nuevos.filter((elemento, index) => index !== index_elimina);
    this.nuevos_elementos(nuevos)
  }
  editar(donde:string , data , cantidad){
    const nueva_cantidad = parseFloat(cantidad)
    const { index:index_editar } = data

    let nuevos = [...this.infoCotizacion.elementos]
    nuevos[index_editar][donde] = nueva_cantidad
    this.nuevos_elementos(nuevos)
  }
  asignar_nuevos_elementos(nuevos:any[]){
    // const paquetes = this._publicos.nueva_revision_cache('paquetes')
    // const moRefacciones = this._publicos.nueva_revision_cache('moRefacciones')
    // const paquetes_armados  = this._publicos.armar_paquetes({moRefacciones, paquetes})
    // console.log(paquetes_armados);
    
    let indexados = nuevos.map((elemento, index)=> {
      // console.log(elemento);
      elemento.costo = (parseFloat(elemento.costo) > 0) ? elemento.costo :0
      elemento.cantidad = (parseFloat(elemento.cantidad) > 0) ? elemento.cantidad : 1
      const {costo, precio, cantidad, tipo, id} = elemento
      // console.log(id);
      
      const {margen} = this.infoCotizacion
      if (tipo === 'refaccion' ) {
        const margen_new = 1 +(margen / 100)
        const precioShow = (cantidad * ( (costo>0) ? costo : precio)) * margen_new
        elemento.total = precioShow
        elemento.precioShow = ( (costo>0) ? costo : precio) * margen_new
      }else if(tipo === 'mo') {
        elemento.total = (cantidad * ( (costo>0) ? costo : precio))
        elemento.precioShow = ( (costo>0) ? costo : precio)
      }else{
        // if (paquetes_armados[id]) {
        //   const data_paquete = paquetes_armados[id]
        //   const {reporte} = data_paquete
        //   data_paquete.cantidad = (parseInt(cantidad) >= 1) ? parseInt(cantidad) : 1
        //   data_paquete.reporte = nuevo_reporte_paquete(reporte, data_paquete.cantidad)
        //   elemento = data_paquete
        // }
      }

      elemento.costo = (parseFloat(elemento.costo) > 0) ? elemento.costo :0
      elemento.index = index
      return elemento
    })

    function nuevo_reporte_paquete(reporte_get, cantidad) {
      const reporte ={mo: 0,refaccion: 0,refaccionVenta: 0,subtotal: 0,total: 0,ub: 0, }
      Object.entries(reporte_get).forEach(([key, valor])=>{
        reporte[key] += parseInt(`${valor}`) * parseInt(cantidad)
      })
      return reporte
    }

    this.infoCotizacion.elementos = this._publicos.crear_new_object(indexados)
    
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

    this.nuevos_elementos(nuevos)
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

    this.nuevos_elementos(nuevos)
  }
  nuevos_elementos(event){
      const espera = this._publicos.crear_new_object([...new Set([...event])])
      this.asignar_nuevos_elementos(espera)
  }
  realizaOperaciones(){
    const { elementos, margen, iva, descuento, formaPago} = this.infoCotizacion
    
    
    const reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
    // console.log(reporte);
    
    this.infoCotizacion.reporte = reporte
    // this.infoCotizacion.elementos = elementos
    // this.dataSource.data = elementos
    // this.newPagination()

  }
  //verificamos que existe el vehiculo seleccionado y que este tenga un id de lo contrario colocamos la informacion en null
  vehiculo(IDVehiculo){
      this.extra = IDVehiculo
      this.infoCotizacion.vehiculo = IDVehiculo
      this.vigila_vehiculos_cliente()
  }
  async continuarCotizacion(){
    const {sucursal, cliente, data_sucursal, data_cliente} = this.infoCotizacion
    if (cliente && !sucursal && data_cliente) {
      const dat_cliente = this._publicos.crear_new_object(data_cliente)
      const sucursales = this._publicos.nueva_revision_cache('sucursales')
      // const {}
      const {sucursal: cliente_sucursal} = dat_cliente
      this.infoCotizacion.sucursal = cliente_sucursal
      this.infoCotizacion.data_sucursal = sucursales[cliente_sucursal]
    }

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

    
    
    
    // await this._cotizaciones.generaNombreCotizacion(this.ROL, {sucursal, cliente, data_sucursal, data_cliente}).then(ans=>{
    //   this.infoCotizacion.no_cotizacion = ans
    // })
    
    this.infoCotizacion.no_cotizacion = this.generaNombreCotizacion(this._rol, this.infoCotizacion)
   

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
            await this._uploadPDF.upload(blob,tempData.filename).then(async(answer:any)=>{
              //cuando se tenga la respuesta  de subida del pdf la ruta al mismo verificamos que efectivamente exista esta ruta
              const intervalo = setInterval(async () => {
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
                  infoSave.fullname = fullname(this.infoCotizacion.data_cliente)
                  infoSave.placas = placas(this.infoCotizacion.data_vehiculo)
                    
                  function fullname(data_cliente){
                      const {nombre, apellidos} = data_cliente
                      return `${nombre} ${apellidos}`.toUpperCase()
                  }
                  function placas(data_vehiculo){
                      const {placas} = data_vehiculo
                      return `${placas}`.toUpperCase()
                  }
                  const clave_ = this._publicos.generaClave()
                  updates[`cotizaciones/${clave_}`] = infoSave;

                  const claves_encontradas = await this._automaticos.consulta_ruta('claves_cotizaciones')
                  const valorNoDuplicado = await [...new Set([...claves_encontradas, clave_])];
                  updates['claves_cotizaciones'] = valorNoDuplicado

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
                    this._security.guarda_informacion({nombre:'claves_cotizaciones', data: valorNoDuplicado})
                    
                    this.infoCotizacion = {
                      cliente:'', data_cliente:{},vehiculo:'', data_vehiculo:{},vehiculos:[],elementos:[],sucursal:'',reporte:null, iva:true, formaPago: '1', descuento: 0, margen: 25,promocion:'',fecha_recibido:'', no_cotizacion:null, vencimiento:'', nota:null, servicio: '1', pdf:null, data_sucursal: {}, showDetalles:false, kms:0
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
      this.enProceso = false
    })
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
  generaNombreCotizacion(rol:string, data){
    const nueva_data = this._publicos.crear_new_object(data)
    const  {sucursal, data_cliente} = nueva_data
    const sucursales = this._publicos.nueva_revision_cache('sucursales')
    const date: Date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const nombreSucursal:string = sucursales[sucursal].sucursal.slice(0,2).toUpperCase()
    const nuevoRol:string = rol.slice(0,2).toUpperCase()
    const no_cotizacion:any[]  = this._publicos.nueva_revision_cache('claves_cotizaciones')
    const secuencia = (no_cotizacion.length + 1).toString().padStart(4, '0')
    return `${nombreSucursal}${month}${year}${nuevoRol}${secuencia}`
  }
  
}
