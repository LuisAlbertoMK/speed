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
  
  infoCotizacion   =  this._cotizacion.infoCotizacion

  camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce ]
  camposCliente    =  [ ...this._clientes.camposCliente_show ]
  camposVehiculo   =  [ ...this._vehiculos.camposVehiculo_ ]
  formasPago       =  [ ...this._cotizaciones.formasPago ]
  servicios        =  [ ...this._servicios.servicios ]
  promociones      =  [ ...this._campos.promociones ]
  sucursales_array = [ ...this._sucursales.lista_en_duro_sucursales ]
  
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
  idPaqueteEditar: number
  idPaqueteEditarBoolean: boolean = false

  modeloVehiculo:string = null

  elementosPrueba = []

  enrutamiento = {cliente:'', sucursal:'', cotizacion:'', tipo:'', anterior:'', vehiculo:''}
  faltante_s:string


  data_cliente = {}
  ngOnInit() {
    this.rol()
    this.crearFormPlus()
    // this.verificaCmabiis()
    // this.infoCotizacion.elementos = this.elementosPrueba
    this.realizaOperaciones()
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

    const {cliente, sucursal, cotizacion, tipo, anterior, vehiculo } = this.enrutamiento

    let  cliente_info = {},  vehiculos_cliente = [], info_vehiculo = {}, info_elementos = [], info_servicio = '1', info_margen =25, info_iva= true
    let info_vehiculo_ = vehiculo, info_descuento =0 
    let info_formaPago = '1'
    this.infoCotizacion = this._cotizacion.infoCotizacion
    if (tipo === 'cliente' || tipo === 'vehiculo') {
      cliente_info  = await this._clientes.consulta_cliente_new({sucursal, cliente})

    } else if (tipo === 'nueva') {
      // console.log('muestra todo');
    } else if (tipo === 'cotizacion') {
      const busqueda_ruta = `cotizacionesRealizadas/${sucursal}/${cliente}/${cotizacion}`
      const info_cotizacion = await  this._cotizaciones.consulta_cotizacion_new(busqueda_ruta)
      const {data_cliente, data_vehiculo, elementos, servicio, margen, iva, formaPago, vehiculo: vv_, descuento} = info_cotizacion

      cliente_info = data_cliente
      info_vehiculo = data_vehiculo
      info_elementos = elementos
      info_servicio = servicio
      info_margen = margen
      info_iva = iva
      info_formaPago = String(formaPago)
      info_vehiculo_ = vv_
      info_descuento = descuento

    }
   
    function verificaInfo_vehiculo(data_vehiculo){
      let nueva_data = data_vehiculo
      if (nueva_data.id) {
        const campos= ['cilindros','anio','color','no_motor','marcaMotor','marca']
        campos.forEach(campo=>{
          nueva_data[campo] = (nueva_data[campo]) ? nueva_data[campo] : ''
        })
      }
      return nueva_data
    }
    this.extra = info_vehiculo_
    this.infoCotizacion.data_cliente = cliente_info
    this.infoCotizacion.cliente = cliente
    this.infoCotizacion.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
    this.infoCotizacion.sucursal = sucursal
    this.infoCotizacion.elementos = info_elementos
    this.infoCotizacion.margen = info_margen
    this.infoCotizacion.iva = info_iva
    this.infoCotizacion.servicio = info_servicio
    this.infoCotizacion.formaPago = info_formaPago
    this.infoCotizacion.descuento = info_descuento
    
    this.consulta_vehiculos()
    this.realizaOperaciones()
    
    // if (this.extra) {
    //   setTimeout(()=>{
    //     this.verificarInfoVehiculos()
    //   },400)
    // }
    
  }
  verificarInfoVehiculos(){
    if (this.infoCotizacion.cliente && this.extra ) {
      this.infoCotizacion.data_vehiculo = this.infoCotizacion.vehiculos.find(v=>v.id === this.extra)
      this._publicos.cerrar_modal('modal-vehiculo')
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
      nota:['',[]]
    })
  }
  validaCampo(campo: string){
    return this.formPlus.get(campo).invalid && this.formPlus.get(campo).touched
  }
  // primer hay que saber que tipo de usuario es en cada modulo para sus permisos, filtros, etc ademas de la SUCURSAL
  
  regresar(){
    this.router.navigate([`/${this.enrutamiento.anterior}`], { 
      queryParams: {}
    });
  }
  
  // REEMPLAZAR REFRIGERANTE Y PURGAR SISTEMA DE ENFRIAMIENTO
  //aqui la informacion del clienyte
  async infoCliente(info:any){
    // console.log(info);
    const {cliente} = info

    if (cliente) {
      const {data_sucursal, id, sucursal} = cliente
      this.infoCotizacion.data_cliente = cliente
      this.infoCotizacion.cliente = id
      this.infoCotizacion.sucursal = sucursal
      this.infoCotizacion.data_sucursal = data_sucursal
      this.infoCotizacion.vehiculos = await this._vehiculos.consulta_vehiculos({sucursal, cliente: id}) 
      this.extra = null
      this.infoCotizacion.data_vehiculo = {}
      this.infoCotizacion.vehiculo = null
      // 
      // this.infoCotizacion.vehiculos =  await this._vehiculos.consulta_vehiculos(cliente)
    }
    this.realizaOperaciones()
  }

  async consulta_vehiculos(){
    const {sucursal, cliente} = this.infoCotizacion
    this.infoCotizacion.vehiculos = await this._vehiculos.consulta_vehiculos({sucursal, cliente}) 
    if (this.infoCotizacion.cliente && this.extra ) {
      this.verificarInfoVehiculos()
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
  async clientesInfo(info:any){
    
    const {cliente, status} = info
    if(!info.CerrarModal){
      if (status) {
        const infonew:any= await this._clientes.consulta_cliente_new(cliente.id)
          this.infoCotizacion.cliente = infonew
          this.infoCotizacion.vehiculos = infonew.vehiculos
          this.infoCotizacion.data_sucursal = this.sucursales_array.find(s=>s['id'] === infonew.sucursal)
          
        // }
        if (this.extra && cliente.vehiculos) {
          this.infoCotizacion.vehiculo = cliente.vehiculos.find(v=>v.id === this.extra)
        }else{
          this.infoCotizacion.vehiculo = null
        }
        this.realizaOperaciones()
        this._publicos.swalToast('Se registro cliente', 1)
      }else{
        this._publicos.mensaje('Intenta nuevamente',0)
      }
    }else{
      
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
  
  vehiculoInfo(nuevo_id:any){
    if (nuevo_id) {
      this.consulta_vehiculos()
      this.extra =  nuevo_id
      setTimeout(()=>{ this.verificarInfoVehiculos() }, 500)
    }else{
      this._publicos.mensajeCorrecto('Accion no realizada', 0)
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
    const originalArray = event.elementos;
    const copiedArray = originalArray.slice();
    const tempDate =  {...event, elementos: copiedArray }    
    this.infoCotizacion.elementos.push(tempDate)
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
      let nuevaCnatidad = Number(cantidad)
      if (nuevaCnatidad<0) nuevaCnatidad = 1
      this.infoCotizacion.elementos[data.index].cantidad = nuevaCnatidad
    }else if (donde ==='costo') {
      let nuevaCnatidad2 = Number(cantidad)
      if (nuevaCnatidad2<0) nuevaCnatidad2 = 0
      this.infoCotizacion.elementos[data.index].costo = nuevaCnatidad2
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
    
    this.infoCotizacion.formaPago  = (this.formPlus) ? this.formPlus.controls['formaPago'].value : '1'
    this.infoCotizacion.iva = this.checksBox.controls['iva'].value
    const {reporte,ocupados} = this._publicos.realizarOperaciones_2(this.infoCotizacion)
    this.infoCotizacion.elementos = ocupados
    this.infoCotizacion.reporte = reporte
    this.dataSource.data = ocupados
    this.newPagination()
  }
  //verificamos que existe el vehiculo seleccionado y que este tenga un id de lo contrario colocamos la informacion en null
  vehiculo(IDVehiculo){
      this.modeloVehiculo = null
      this.infoCotizacion.vehiculo = null
      this.infoCotizacion.data_vehiculo = null
    const vehiculo = this.infoCotizacion.vehiculos.find(v=>v.id === IDVehiculo)
    if (vehiculo) {
      this.extra = IDVehiculo
      this.infoCotizacion.data_vehiculo = vehiculo
      this.infoCotizacion.vehiculo = IDVehiculo
    }
  }
  async continuarCotizacion(){
    const obligatorios = ['sucursal','cliente','vehiculo','elementos','servicio', 'margen','formaPago']
    const opcionales = ['promocion','descuento','nota','iva']
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(this.infoCotizacion,obligatorios )

    // console.log( {ok, faltante_s} );
    this.faltante_s = faltante_s
    if (!ok) return
    const {promocion, descuento, nota} = this._publicos.recuperaDatos(this.formPlus)

    this.infoCotizacion.descuento = descuento
    this.infoCotizacion.nota = nota
    this.infoCotizacion.promocion = promocion

    const correos = this._publicos.dataCorreo(this.infoCotizacion.data_sucursal,this.infoCotizacion.data_cliente)
    const {sucursal, cliente, data_sucursal} = this.infoCotizacion
    await this._cotizaciones.generaNombreCotizacion(this.ROL, {sucursal, cliente, data_sucursal}).then(ans=>{
      this.infoCotizacion.no_cotizacion = ans
    })
    //realizamos un string con el nombre de los elementos de la ctoizacion solo enviamos el array de los elementos
    const filtro_conceptos = this._publicos.obtenerNombresElementos(this.infoCotizacion.elementos)
    // asiganamos la datatemporal la cual sirve para correo, pdf
    
    // this.infoCotizacion.no_cotizacion = 'sadsgfhjh'
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

    const actual  = this._publicos.retorna_fechas_hora({fechaString: new Date()}).fecha_hora_actual
    const sumar = new Date(actual)
    this.infoCotizacion.fecha_recibido = actual
    const nueva = this._publicos.sumarRestarDiasFecha(sumar, 20)
    this.infoCotizacion.vencimiento = this._publicos.retorna_fechas_hora({fechaString: nueva.toString()}).toString
    
    // en caso de que el cliente no tenga nombre de empresa asiganamos un string vacio
    // console.log(this.infoCotizacion);
    

    // console.log('antes de todo revisar los paquetes no guardados ');
    //primero se filtra la informacion a solo paquetes
    const filter = this.infoCotizacion.elementos.filter(e=>e.tipo === 'paquete')
    // console.log('los paquetes que no estan en catalogo son: ',filter);
    //despues filtramos los paquetes que  no tengan id
    const filtroNotID = filter.filter(f=>!f.id)
    // console.log('los paquetes que no tienen id son: ',filtroNotID);

    //los paquees que no han sido registrados se guardan automaticamente 
    filtroNotID.forEach(p=>{
      const campos = ['elementos','nombre','tipo','cilindros','marca','modelo']
      const recuperada = {
        ...this._publicos.nuevaRecuperacionData(p,campos),
        cilindros: this.infoCotizacion.data_vehiculo['cilindros'],
        marca: this.infoCotizacion.data_vehiculo['marca'],
        modelo: this.infoCotizacion.data_vehiculo['modelo'],
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
                  this.infoCotizacion.pdf = answer['ruta']
                  //limpiamos el intervalo ya que tenemos la ruta y realizamos depuracion de informacion
                  clearInterval(intervalo)
                  const updates = {};
                  const campos = ['cliente','elementos','fecha_recibido','formaPago','iva','margen','no_cotizacion',
                                  'nota','reporte','servicio','sucursal','vehiculo','vencimiento','pdf'
                ]
                //asigamos solo los campos que queremos recuperaer
                
                  const infoSave = this._publicos.nuevaRecuperacionData(this.infoCotizacion,campos)
                  const {sucursal, cliente} = this.infoCotizacion
                  updates[`cotizacionesRealizadas/${sucursal}/${cliente}/${this._publicos.generaClave()}`] = infoSave;
                  // console.log(infoSave);
                  // console.log(updates);
                  
                  // hacemos la llamada al registro de la cotizacion
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
                    this.infoCotizacion = this._cotizacion.infoCotizacion
                    this.formPlus.reset({
                      servicio: 1,
                      margen: 25,
                      formaPago: '1'
                    })
                    //redireccionamos a cotizaciones disponibles
                    this.router.navigateByUrl('/cotizacion')
                  })
                  .catch((error) => {
                    // The write failed...
                    this._publicos.swalToast('Error al guardar la cotizacion', 0, 'top-start')
                  });
                }
              },200)
            })
          })
        }
      })
    })
  }
  accionesExtra(campo:string, valor){
   
    const acciones = {
      descuento: (valor) => {
        this.infoCotizacion.descuento = valor;
      },
      margen: (valor) => {
        this.infoCotizacion.margen = (Number(valor) < 25 || Number(valor) > 100) ? 25 : Number(valor);
        this.formPlus.controls['margen'].setValue(this.infoCotizacion.margen);
      }
    };
    if (campo in acciones) {
      acciones[campo](valor);
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
