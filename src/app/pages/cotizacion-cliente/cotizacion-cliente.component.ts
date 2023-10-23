import { Component, OnInit } from '@angular/core';
import { CamposSystemService } from 'src/app/services/campos-system.service';

import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';


//creacion de pdf
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs


import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';


import { animate, state, style, transition, trigger } from '@angular/animations';
import { PdfService } from 'src/app/services/pdf.service';
import Swal from 'sweetalert2'
import { UploadPDFService } from 'src/app/services/upload-pdf.service';
import { AutomaticosService } from 'src/app/services/automaticos.service';
import { EmailsService } from 'src/app/services/emails.service';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, ref, update } from 'firebase/database';

const db = getDatabase()
@Component({
  selector: 'app-cotizacion-cliente',
  templateUrl: './cotizacion-cliente.component.html',
  styleUrls: ['./cotizacion-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CotizacionClienteComponent implements OnInit {
  _sucursal:string
  _rol:string
  _uid:string

  objecto_actual:any ={}

  vehiculos_arr:any[] = []
  // data_cliente:any 
  infoCotizacion   = {
    cliente:'', data_cliente:{},vehiculo:'', data_vehiculo:{},vehiculos:[],elementos:[],sucursal:'',reporte:null, iva:true, formaPago: '1', descuento: 0, margen: 25,promocion:'',fecha_recibido:'', no_cotizacion:null, vencimiento:'', nota:null, servicio: '1', pdf:null, data_sucursal: {}, showDetalles:false, kms:0
  }
  extra:string
  modelo:string = null
  formPlus: FormGroup
  checksBox = this._formBuilder.group({
    iva: true,
    detalles: false
  });
  // servicios        =  [ ...this._servicios.servicios ]
  servicios        =  [ {valor:'5',nombre:'preventivo'} ]
  formasPago       =  [ ...this._cotizaciones.formasPago ]
  promociones      =  [ ...this._campos.promociones ]

  miniColumnas:number =  this._campos.miniColumnas
  paquete: string     =  this._campos.paquete
  refaccion: string   =  this._campos.refaccion
  mo: string          =  this._campos.mo

  idPaqueteEditar: number = -1

  faltante_s:string

  enProceso:boolean = false
  enrutamiento = {cliente:'', sucursal:'', cotizacion:'', tipo:'', anterior:'', vehiculo:'', recepcion:''}

  vehiculo_cache
  constructor(
    private _publicos: ServiciosPublicosService, private _security: EncriptadoService, private _formBuilder: FormBuilder,
    private _campos: CamposSystemService, private _cotizaciones: CotizacionesService, private _servicios: ServiciosService,
    private _pdf: PdfService, private _uploadPDF: UploadPDFService, private _automaticos: AutomaticosService, 
    private _email: EmailsService,  private router: Router, private rutaActiva: ActivatedRoute,
    ) { }
 
  ngOnInit(): void {
    this.crearFormPlus()
    this.rol()
  }
  rol(){

    const {rol, usuario, sucursal, uid} = this._security.usuarioRol()

    this._sucursal = sucursal
    this._rol = rol
    // if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid)
    if (uid) {
      this._uid = uid
      this.infoCotizacion.cliente = uid
      this.primer_comprobacion_resultados()
      this.rutaActiva.queryParams.subscribe((params:any) => {
        this.enrutamiento = params
        this.cargaDataCliente_new()
      });
    }

  }
  async cargaDataCliente_new(){

    const {cliente, sucursal, cotizacion, tipo, anterior, vehiculo, recepcion } = this.enrutamiento

    const clientes = this._publicos.nueva_revision_cache('clientes')
    const vehiculos = this._publicos.nueva_revision_cache('vehiculos')
    this.vehiculo_cache = this._publicos.nueva_revision_cache('vehiculos')
    if(vehiculo){
      const data_vehiculo = this._publicos.crear_new_object(vehiculos[vehiculo])
      const data_cliente_new = this._publicos.crear_new_object(clientes[data_vehiculo.cliente])
      data_cliente_new.id = data_vehiculo.cliente
      this.infoCotizacion.data_cliente = data_cliente_new
      this.infoCotizacion.cliente = data_vehiculo.cliente
      this.extra = vehiculo
      this.infoCotizacion.vehiculo = vehiculo
    }
    const {cliente: id_cliente} = this.infoCotizacion
    setTimeout(() => {
      if (id_cliente) {
        this.vigila_vehiculos_cliente()
      }
    }, 1000);

  }
  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('vehiculos')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }
  primer_comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('vehiculos')
    this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
    this.asiganacion_resultados()
    this.segundo_llamado()
  }
  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.nueva_revision_cache('vehiculos')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asiganacion_resultados()
      }
    },2000)
  }
  asiganacion_resultados(){
    
    const {data_cliente, cotizaciones_arr, recepciones_arr, vehiculos_arr} = this._publicos.data_relacionada_id_cliente(this._uid)
    this.infoCotizacion.data_cliente = data_cliente
    const campo_vehiculo = [
      'cliente',
      'placas',
      'vinChasis',
      'marca',
      'modelo',
      'categoria',
      'anio',
      'cilindros',
      'no_motor',
      'color',
      'engomado',
      'marcaMotor',
      'transmision',
    ]

    this.vehiculos_arr = (!this.vehiculos_arr.length)  ? vehiculos_arr :
    this._publicos.actualizarArregloExistente(this.vehiculos_arr,vehiculos_arr,campo_vehiculo)

    this.infoCotizacion.vehiculos = this.vehiculos_arr
    // console.log(vehiculos_arr);
    this.vigila_vehiculos_cliente()
  }

  vehiculo(IDVehiculo){
    this.extra = IDVehiculo
    this.infoCotizacion.vehiculo = IDVehiculo
    this.vigila_vehiculos_cliente()
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
  validaCampo(campo: string){
    return this.formPlus.get(campo).invalid && this.formPlus.get(campo).touched
  }

  crearFormPlus(){
    this.formPlus = this._formBuilder.group({
      servicio:[1,[Validators.required]],
      // margen:[this.infoCotizacion.margen,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      formaPago:['1',[Validators.required]],
      // promocion:['',[]],
      // descuento:['',[Validators.min(0)]],
      // kms:['',[Validators.min(0)]],
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
    // this.formPlus.get('descuento').valueChanges.subscribe((descuento: number) => {
    //   const nuevo_descuento = descuento < 0 ? 0 : descuento
    //   this.infoCotizacion.descuento = nuevo_descuento
    //   console.log('descuento');
    //   this.realizaOperaciones()
    // })
    // this.formPlus.get('kms').valueChanges.subscribe((kms: number) => {
    //   const nuevo_kms = kms < 0 ? 0 : kms
    //   this.infoCotizacion.kms = nuevo_kms
    // })
    this.formPlus.get('nota').valueChanges.subscribe((nota: string) => {
      const nuevo_nota = nota ? nota : ''
      this.infoCotizacion.nota = String(nuevo_nota).toLowerCase()
    })
    // this.formPlus.get('margen').valueChanges.subscribe((margen: number) => {
    //   const nuevo_margen = Math.min(Math.max(margen, 25), 100);
    //   this.infoCotizacion.margen = nuevo_margen
    //   console.log('nuevo_margen');
    //   this.realizaOperaciones()
    // })
    this.formPlus.get('formaPago').valueChanges.subscribe((formaPago: string) => {
      this.infoCotizacion.formaPago = formaPago
      console.log('formaPago');
      this.realizaOperaciones()
    })
    // this.formPlus.get('promocion').valueChanges.subscribe((promocion: string) => {
    //   this.infoCotizacion.promocion = promocion
    // })
    this.formPlus.get('servicio').valueChanges.subscribe((servicio: string) => {
      this.infoCotizacion.servicio = servicio
    })
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
  asignar_nuevos_elementos(nuevos:any[]){
    const paquetes = this._publicos.nueva_revision_cache('paquetes')
    const moRefacciones = this._publicos.nueva_revision_cache('moRefacciones')
    const paquetes_armados  = this._publicos.armar_paquetes({moRefacciones, paquetes})
    // console.log(paquetes_armados);
    
    let indexados = nuevos.map((elemento, index)=> {
      // console.log(elemento);
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
        if (paquetes_armados[id]) {
          const data_paquete = paquetes_armados[id]
          const {reporte} = data_paquete
          data_paquete.cantidad = (parseInt(cantidad) >= 1) ? parseInt(cantidad) : 1
          data_paquete.reporte = nuevo_reporte_paquete(reporte, data_paquete.cantidad)
          elemento = data_paquete
        }
      }
     
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

    this.infoCotizacion.elementos = indexados
    
    this.realizaOperaciones()
  }
  nuevos_elementos(event){
    this.asignar_nuevos_elementos([...new Set([...event])])
  }
  realizaOperaciones(){

    const { elementos, margen, iva, descuento, formaPago} = this.infoCotizacion
    const reporte = this._publicos.genera_reporte({elementos, margen, iva, descuento, formaPago})
    // console.log(reporte);
    
    this.infoCotizacion.reporte = reporte
    this.infoCotizacion.elementos = elementos

  }

  async continuarCotizacion(){
    // console.log('acciones guardar depurar etc');
    const {sucursal, cliente, data_sucursal, data_cliente} = this.infoCotizacion
    if (cliente && !sucursal && data_cliente) {
      const dat_cliente = this._publicos.crear_new_object(data_cliente)
      const sucursales = this._publicos.nueva_revision_cache('sucursales')
      const {sucursal: cliente_sucursal} = dat_cliente
      this.infoCotizacion.sucursal = cliente_sucursal
      this.infoCotizacion.data_sucursal = sucursales[cliente_sucursal]
    }
    this.enProceso = false

    const obligatorios = ['sucursal','cliente','vehiculo','elementos','servicio','formaPago']
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(this.infoCotizacion,obligatorios )
    this.faltante_s = faltante_s

    if (!ok) return

    this.enProceso = true

    const correos = this._publicos.dataCorreo(this.infoCotizacion.data_sucursal,this.infoCotizacion.data_cliente)

    // this.infoCotizacion.no_cotizacion = this.generaNombreCotizacion(this._rol, this.infoCotizacion)
    this.infoCotizacion.no_cotizacion = await  this.generaNombreCotizacion(this._rol, this.infoCotizacion)


    console.log(this.infoCotizacion.no_cotizacion);
    
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

    const data_savea = this.sanitiza_informacionCotizacion(this.infoCotizacion)
    console.log(data_savea);
    
    // return

    this._pdf.pdf(this.infoCotizacion).then((ansPDF)=>{
      const pdfDocGenerator = pdfMake.createPdf(ansPDF);

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
        if (result.isConfirmed) {
          pdfDocGenerator.open()
          this.enProceso = false
        } else if (result.isDenied) {
          pdfDocGenerator.getBlob(async (blob) => {
            
            // this.enProceso = false //quitar esta line al final
            try {
              const resultado = await this._uploadPDF.upload(blob,tempData.filename)
              while (!resultado.ruta) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Esperar 100ms antes de verificar nuevamente
              }
              const _ruta_pdf_entrega:string = String(resultado.ruta).trim()
              this.infoCotizacion.pdf = String(resultado.ruta).trim()
            
              const clave_ = this._publicos.generaClave()
              this.infoCotizacion['id'] = clave_
              this.infoCotizacion['pdf'] = _ruta_pdf_entrega
              this.infoCotizacion['por_cliente'] = true
              const data_save = this.sanitiza_informacionCotizacion(this.infoCotizacion)
              const updates = {};
              updates[`cotizaciones/${clave_}`] = data_save;
              const claves_encontradas = await this._automaticos.consulta_ruta('claves_cotizaciones')
              const valorNoDuplicado = await [...new Set([...claves_encontradas, clave_])];
              updates['claves_cotizaciones'] = valorNoDuplicado

              update(ref(db), updates)
                .then(() => {
                   // realizamos la descarga del pdf
                   pdfMake.createPdf(ansPDF).download(tempData.filename);
                   this._email.EmailCotizacion(tempData)
                   this._publicos.swalToast('Cotizacion realizada!!', 1, 'top-start')
                   this._security.guarda_informacion({nombre:'claves_cotizaciones', data: valorNoDuplicado})
                   const cotizaciones = this._publicos.nueva_revision_cache('cotizaciones')
                   cotizaciones[clave_] = data_save
                   this._security.guarda_informacion({nombre:'cotizaciones', data: cotizaciones})
                   
                  this.formPlus.reset({
                    servicio: 1,
                    margen: 25,
                    formaPago: '1'
                  })
                  this.infoCotizacion = {
                    cliente:'', data_cliente:{},vehiculo:'', data_vehiculo:{},vehiculos:[],elementos:[],sucursal:'',reporte:null, iva:true, formaPago: '1', descuento: 0, margen: 25,promocion:'',fecha_recibido:'', no_cotizacion:null, vencimiento:'', nota:null, servicio: '1', pdf:null, data_sucursal: {}, showDetalles:false, kms:0
                  }
                  this.realizaOperaciones()
                  this.router.navigateByUrl('/cotizacionesCliente')
                })
                .catch((error) => {
                  this.enProceso = false
                  this._publicos.swalToast('Error al guardar la cotizacion', 0, 'top-start')
                });
            }catch (error) {
              console.error('Ocurrió un error:', error);
            } 
          })
        }
      })
    })
    
  }
  sanitiza_informacionCotizacion(info_cotizacion){
    const nueva_data_cotizacion = this._publicos.crear_new_object(info_cotizacion)
    const elementos = nueva_data_cotizacion.elementos.map(elemento => this.sanitizar_elementos(elemento));

    const campos = [
      'cliente', 'fecha_recibido', 'formaPago', 'iva', 'margen', 'no_cotizacion', 'nota', 'servicio', 'sucursal', 'vehiculo', 'vencimiento', 'pdf','id', 'por_cliente'
    ];

    const nuevaInformacionCotizacion = campos.reduce((result, campo) => {
      if (nueva_data_cotizacion[campo] !== undefined && nueva_data_cotizacion[campo] !== null && nueva_data_cotizacion[campo] !== "") {
        result[campo] = nueva_data_cotizacion[campo];
      }
      return result;
    }, { elementos });

    return nuevaInformacionCotizacion;
  }

  sanitizar_elementos(elemento) {
    const { id, cantidad, costo, tipo } = this._publicos.crear_new_object(elemento);
    const nuevo_costo = this.retorna_costo_correcto(costo,'costo') // Aseguramos que el costo sea mayor o igual a cero
    // const nuevo_costo = Math.max(parseFloat(costo), 0); // Aseguramos que el costo sea mayor o igual a cero
    const nueva_cantidad = this.retorna_costo_correcto(cantidad,'cantidad') // Aseguramos que la cantidad sea mayor o igual a cero
    // const nueva_cantidad = Math.max(parseFloat(cantidad), 0); // Aseguramos que la cantidad sea mayor o igual a cero
    const temp = {
      id,
      cantidad: nueva_cantidad,
      tipo,
      aprobado: true
    }
    if (costo > 0) temp['costo'] = nuevo_costo
    return temp
  }
  retorna_costo_correcto(valor, cual:string):number{
    let nuevo_costo = 0
    switch (cual) {
      case 'cantidad':
        nuevo_costo = (parseFloat(valor) >=1) ? parseFloat(valor) : 1
        break;
      case 'costo':
        nuevo_costo = (parseFloat(valor) >=0) ? parseFloat(valor) : 0
        break;
    
      default:
        nuevo_costo = (parseFloat(valor) >=0) ? parseFloat(valor) : 0
        break;
    }
    return nuevo_costo
  }
  async generaNombreCotizacion(rol:string, data){
    const nueva_data = this._publicos.crear_new_object(data)
    const  {sucursal, data_cliente} = nueva_data
    const sucursales = this._publicos.nueva_revision_cache('sucursales')
    const date: Date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const nombreSucursal:string = sucursales[sucursal].sucursal.slice(0,2).toUpperCase()
    const nuevoRol:string = rol.slice(0,2).toUpperCase()
    // const no_cotizacion:any[]  = this._publicos.nueva_revision_cache('claves_cotizaciones')
    const no_cotizacion:any[]  = await this._automaticos.consulta_ruta('claves_cotizaciones')
    const secuencia = (no_cotizacion.length + 1).toString().padStart(4, '0')
    return `${nombreSucursal}${month}${year}${nuevoRol}${secuencia}`
  }
   
  vehiculo_registrado(event){
    if (event) {
     this.extra = event
     this.vigila_vehiculos_cliente()
   }
 }

}
