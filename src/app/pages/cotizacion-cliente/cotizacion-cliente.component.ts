import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CamposSystemService } from 'src/app/services/campos-system.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CotizacionService } from 'src/app/services/cotizacion.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';


//creacion de pdf
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs

//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import { animate, state, style, transition, trigger } from '@angular/animations';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { PdfService } from 'src/app/services/pdf.service';
import { UploadPDFService } from 'src/app/services/upload-pdf.service';
import Swal from 'sweetalert2';
import { EmailsService } from 'src/app/services/emails.service';

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

  constructor(
    private _security:EncriptadoService, private _publicos:ServiciosPublicosService, private router: Router,
    private _campos: CamposSystemService, private rutaActiva: ActivatedRoute, private _clientes: ClientesService,
    private _cotizacion: CotizacionService, private _vehiculos: VehiculosService, private _formBuilder: FormBuilder,
    private _cotizaciones: CotizacionesService, private _servicios: ServiciosService, private _sucursales: SucursalesService,
    private _pdf: PdfService, private _uploadPDF: UploadPDFService, private _email: EmailsService,
    ) { }
  rol_:string
  sucursal_:string
  paquete: string     =  this._campos.paquete
  refaccion: string   =  this._campos.refaccion
  mo: string          =  this._campos.mo
  miniColumnas:number =  this._campos.miniColumnas

  infoCotizacion   =  this._cotizacion.infoCotizacion
  formasPago       =  [ ...this._cotizaciones.formasPago ]

  servicios        =  [ ...this._servicios.servicios ]
  promociones      =  [ ...this._campos.promociones ]

  sucursales_array = [ ...this._sucursales.lista_en_duro_sucursales ]

  extra:string
  modelo:string

  formPlus: FormGroup
  checksBox = this._formBuilder.group({
    iva: true,
    detalles: false
  });

  idPaqueteEditar: number = -1
  
  faltante_s:string

  dataSource = new MatTableDataSource(); //elementos
   elementos = ['nombre','cantidad','sobrescrito','precio','total']; //elementos
   columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
   expandedElement: any | null; //elementos
   @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
   @ViewChild('elements') sort: MatSort //elementos

  
  enrutamiento
  salvando:boolean = false
  ngOnInit(): void {
    this.rol()
    this.crearFormPlus()
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
  rol(){
    
    const { rol, sucursal , uid, usuario} = this._security.usuarioRol()

    // console.log(uid);
    // console.log(usuario);

    this.rol_ = rol
    this.sucursal_ = sucursal
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
      // this.cargaDataCliente_new()
      // console.log(params);
      
    });
    this.acciones()
  }
  regresar(){
    this.router.navigate([`/${this.enrutamiento.anterior}`], { 
      queryParams: this.enrutamiento
    });
  }
  async acciones(){
    const {cliente, sucursal, vehiculo, cotizacion, recepcion} =this.enrutamiento

    const data_cliente  = await this._clientes.consulta_Cliente(cliente)
    if (cliente) this.infoCotizacion.cliente = cliente
    this.infoCotizacion.data_cliente = data_cliente
    if (vehiculo) {
      this.infoCotizacion.vehiculo = vehiculo
      this.extra = vehiculo
    }
    if (cotizacion) {
      const data_cotizacion  = await this._cotizaciones.consulta_cotizacion_unica(cotizacion)
      const recuperda = this._cotizaciones.recupera_data_cotizacion(data_cotizacion)
      
      Object.keys(recuperda).forEach(campo=>{
        this.infoCotizacion[campo] = recuperda[campo]
        if (campo === 'vehiculo') this.extra = recuperda[campo]
      })
    }else if(recepcion){
      const data_recepcion  = await this._servicios.consulta_recepcion_unica(recepcion)
      const recuperda = this._cotizaciones.recupera_data_cotizacion(data_recepcion)
      Object.keys(recuperda).forEach(campo=>{
        this.infoCotizacion[campo] = recuperda[campo]
        if (campo === 'vehiculo') this.extra = recuperda[campo]
      })
    }

    const data_sucursal = this.sucursales_array.find(s=>s.id === this.infoCotizacion.sucursal)
    this.infoCotizacion.data_sucursal = data_sucursal

    this.vigila_vehiculos_cliente()
    this.realizaOperaciones()
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

  vehiculo_ghange(valor){
    // console.log(valor);
    this.extra = valor
    this.vigila_vehiculos_cliente()
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
    

    this.asignar_nuevos_elementos(nuevos)
  }
  asignar_index(arreglo:any[]):any[] {
    const { formaPago } = this.infoCotizacion
    let nuevos_ = [...arreglo]
    if (!nuevos_.length) return []
      return nuevos_.map((e, index)=>{
        e.index = index
        e.aprobado = true
        if (e.tipo === 'paquete') {
          const elementos:any = e.elementos
          const nuevos_elementos = elementos.map(nu=>{
            nu.aprobado = true
            return nu
          })
          const reporte = this._publicos.genera_reporte({elementos: nuevos_elementos, margen:0, iva:0, descuento:0, formaPago})
          const {total, refaccion, mo} = reporte
          e.reporte = reporte
          e.precio = refaccion + mo
          e.total = total
        }
        return e
      })
  }

  realizaOperaciones(){
    const { elementos, margen, iva, descuento, formaPago} = this.infoCotizacion

    const nuevos_elementos_index = this.asignar_index(elementos)

    const reporte = this._publicos.genera_reporte({elementos: nuevos_elementos_index, margen, iva, descuento, formaPago})
    
    this.infoCotizacion.reporte = reporte
    this.infoCotizacion.elementos = nuevos_elementos_index
    this.dataSource.data = nuevos_elementos_index
    this.newPagination()
  }
  async continuarCotizacion(){
    this.salvando = true
    const obligatorios = ['sucursal','cliente','vehiculo','elementos','servicio', 'margen','formaPago']
    // const opcionales = ['promocion','descuento','nota','iva']
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(this.infoCotizacion,obligatorios )

    this.faltante_s = faltante_s
    if (!ok) {
      this.salvando = false
      return
    }
    const {promocion, descuento, nota} = this._publicos.recuperaDatos(this.formPlus)

    this.infoCotizacion.descuento = descuento
    this.infoCotizacion.nota = nota
    this.infoCotizacion.promocion = promocion

    const correos = this._publicos.dataCorreo(this.infoCotizacion.data_sucursal,this.infoCotizacion.data_cliente)
    const {sucursal, cliente, data_sucursal, data_cliente} = this.infoCotizacion
    await this._cotizaciones.generaNombreCotizacion(this.rol_, {sucursal, cliente, data_sucursal, data_cliente}).then(ans=>{
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
        allowOutsideClick:false

      }).then((result) => {
        // si se confirma previsualizacion genera pdf en nueva ventana del navegador
        if (result.isConfirmed) {
          pdfDocGenerator.open()
          this.salvando = false
        } else if (result.isDenied) {
          this.salvando = true
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
                  const otros = this._publicos.purifica_informacion(infoSave)
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
                    this.infoCotizacion = this._cotizacion.infoCotizacion
                    this.formPlus.reset({
                      servicio: 1,
                      margen: 25,
                      formaPago: '1'
                    })
                    this.salvando = false
                    this.router.navigateByUrl('/miPerfil')
                  })
                  .catch((error) => {
                    this.salvando = false
                    this._publicos.swalToast('Error al guardar la cotizacion', 0, 'top-start')
                  });
                }
              },200)
            })
            .catch(err=>{
              console.log(err.error());
              this.salvando = false
            })
          })
        } else if(result.dismiss){
          this.salvando = false
        }
      })
    })
  }
  ///TODO acciones que no cambian
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }

}
