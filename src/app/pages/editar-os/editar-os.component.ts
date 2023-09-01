import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder } from '@angular/forms';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

import { child, get, getDatabase, onValue, push, ref, update, onChildAdded, onChildChanged, onChildRemoved, query, orderByChild, startAt, equalTo} from "firebase/database";
import Swal from 'sweetalert2';

import SignaturePad from 'signature_pad';
import { PdfRecepcionService } from 'src/app/services/pdf-recepcion.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { PdfEntregaService } from 'src/app/services/pdf-entrega.service';
import { UploadMetadata } from 'firebase/storage';
import { UploadPDFService } from 'src/app/services/upload-pdf.service';
import { ReporteGastosService } from 'src/app/services/reporte-gastos.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const db = getDatabase()
const dbRef = ref(getDatabase());

interface ServicioEditar {
  reporte: any;
  elementos: any[];
  iva: boolean;
  formaPago: string;
  margen: number;
  // pathPDF: any;
  status: string;
  servicio: string;
  tecnico: any;
  descuento: number;
}

@Component({
  selector: 'app-editar-os',
  templateUrl: './editar-os.component.html',
  styleUrls: ['./editar-os.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EditarOsComponent implements OnInit, OnDestroy,AfterViewInit {

  constructor(
    private rutaActiva: ActivatedRoute, private _security:EncriptadoService, private _servicios: ServiciosService,
    private _clientes: ClientesService, private _vehiculos: VehiculosService, private _sucursales: SucursalesService,
    private _cotizaciones: CotizacionesService, private _formBuilder: FormBuilder, private _publicos: ServiciosPublicosService,
    private _usuarios: UsuariosService, private router: Router, private _pdfRecepcion: PdfRecepcionService,
    private _pdf_entrega: PdfEntregaService, private _uploadPDF: UploadPDFService,
    private _reporte_gastos: ReporteGastosService,
    ) { }

  enrutamiento = {cliente:'', sucursal:'', cotizacion:'', tipo:'', anterior:'', vehiculo:'', recepcion:''}
  

  rol_:string

  @ViewChild('firmaDigital',{static:true}) signatureElement:any; SignaturePad:any;
  ngOnInit(): void {
    this.rol()
  }
  ngAfterViewInit() {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  async ngOnDestroy(){
    // const { sonIguales, diferencias } = this.compararObjetos(this.data_editar, this.temporal)
    // if (!sonIguales) {
    //   const { respuesta } = await this._publicos.mensaje_pregunta(`Remplazar información?`,true,`${diferencias}`)
    //   if (respuesta) {
    //     const campos_update = ['elementos','margen','status','tecnico','formaPago', 'fecha_recibido','fecha_entregado']
    //     let updates = {}
    //     const {sucursal, cliente, vehiculo, id} = this.data_editar
        
    //     const nueva_data = JSON.parse(JSON.stringify(this.data_editar));
    //     // console.log(nueva_data);
        
    //     const data_purifica = this.purifica_informacion(nueva_data)
    //     // console.log(data_purifica);
    //     nueva_data.elementos = data_purifica

        
    //     campos_update.forEach(campo=>{
    //       if (nueva_data[campo]) {
    //         updates[`recepciones/${sucursal}/${cliente}/${id}/${campo}`] = nueva_data[campo]
    //       }
    //     })
    //     // console.log(updates);

    //     update(ref(db), updates).then(()=>{
    //       // console.log('finalizo');
    //       this._publicos.swalToast(`Actualización correcta!!`,1)
    //     })
    //     .catch(err=>{
    //       console.log(err);
    //     })
        
        
        
    //   }else{
    //     this._publicos.swalToast(`Se cancelo`,0)
    //   }
    // }
  }


  sucursales_array  =   [ ...this._sucursales.lista_en_duro_sucursales]
  formasPago        =   [ ...this._cotizaciones.formasPago ]
  statusOS             = [ ...this._servicios.statusOS ]
  servicios_             = [ ...this._servicios.servicios ]

  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
   cotizaciones = ['nombre','aprobado','cantidad','precio','costo','subtotal','total']; 
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; 
   expandedElement: any | null; 
   @ViewChild('elementos') sort: MatSort 
   @ViewChild('elementosPaginator') paginator: MatPaginator

   miniColumnas:number = 100
   idPaqueteEditarBoolean: boolean = false
   idPaqueteEditar: number = -1

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
  data_editar  ={
    cliente:'',
    descuento:0,
    elementos:[],
    fecha_promesa:'',
    fecha_recibido:'',
    fecha_entregado:'',
    firma_cliente:'',
    formaPago:'1',
    observaciones:'',
    id:'',
    iva:true,
    margen:25,
    no_os:'',
    servicio:'1',
    status:'',
    sucursal:'',
    vehiculo:'',
    tecnico:'',
    data_cliente:{},
    data_vehiculo:{},
    data_sucursal:{},
    tecnicoShow: '',
    reporte:{},
    pdf_entrega:'',
    nivel_gasolina:'',
    showDetalles:false,
    formaPago_show:'',
    servicio_show:'',
    kilometraje:0,
    historial_pagos:[],
    historial_gastos:[]
  }
  temporal 

  checksBox = this._formBuilder.group({
    iva: true,
    detalles: false,
    descuento:0,
    margen:25,
    formaPago:'1',
    status:'',
    nivel_gasolina:'vacio',
    observaciones: '',
    kilometraje:0
  });

  faltante_s:string 

  campos_ocupados_editar = [
    'cliente','sucursal','vehiculo','elementos','servicio','margen','status','tecnico','formaPago'
  ]
  nivel_gasolina = [
    "vacio","1/4","1/2", "3/4", "lleno"
  ]

  informacionLista:boolean = false
 
  async rol(){
    const { rol, sucursal } = this._security.usuarioRol()
    this.rol_ = rol

    this.rutaActiva.queryParams.subscribe((params:any) => {
     this.enrutamiento = params
    //  console.log(params);
    //  this.acciones()
    this.nuevas()
     this.vigila()
    });
  }
  regresar(){
    this.router.navigate([`/${this.enrutamiento.anterior}`], { 
      queryParams: this.enrutamiento
    });
  }

  nuevas(){
    const {cliente, sucursal, recepcion } = this.enrutamiento

    const starCountRef = ref(db, `recepciones/${sucursal}/${cliente}/${recepcion}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.acciones()
      } 
    })
  }
  async acciones(){
    Swal.fire({
      icon: 'info',
      html:'cargando',
      allowOutsideClick:false,
      showConfirmButton:false
    } )
    const {cliente, sucursal, cotizacion, tipo, anterior, vehiculo, recepcion } = this.enrutamiento

    let  data_cliente = {},  vehiculos_arr = [], data_vehiculo = {}

    if (cliente) data_cliente  = await this._clientes.consulta_cliente_new({sucursal, cliente})
    if (cliente) vehiculos_arr = await this._vehiculos.consulta_vehiculos({cliente, sucursal})
    
    
    
    data_vehiculo = (vehiculo) ? vehiculos_arr.find(v=>v.id === vehiculo) :null 

    const data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)

    if (recepcion){
      const busqueda_ruta_recepcion = `recepciones/${sucursal}/${cliente}/${recepcion}`
      const data_recepcion = await this._servicios.consulta_recepcion_new({ruta: busqueda_ruta_recepcion})
      data_recepcion.descuento = (data_recepcion.descuento) ? data_recepcion.descuento : 0

      // const temp = [...data_recepcion.elementos]

      if (data_recepcion.tecnico) {
        // console.log('buscar informacion del tecnico actual');
        const data_tecnico = await this._usuarios.consulta_tecnico({ruta: data_recepcion.tecnico})
        // console.log(data_tecnico);
        this.data_editar.tecnicoShow = data_tecnico
      }
      let historial_pagos_arr = []
        
        const historial_pagos:any =  await this._servicios.historial_pagos({ sucursal, cliente, id: recepcion });
        // const historial_gastos = muestra_gastos_ordenes.filter(g=>g.numero_os === id)
        historial_pagos_arr = historial_pagos    
              // g.historial_gastos = historial_gastos

              
      // }


      const arreglo_sucursal = [data_recepcion.sucursal]

      const arreglo_fechas_busca = this.obtenerArregloFechas_gastos_diarios({ruta: 'historial_gastos_orden', arreglo_sucursal})
  
      const promesasConsultas_gastos_orden = arreglo_fechas_busca.map(async (f_search) => {
        const gastos_hoy_array: any[] = await this._reporte_gastos.gastos_hoy({ ruta: f_search});
        const promesasVehiculos = gastos_hoy_array
          .filter(g => g.tipo === 'orden')
          .map(async (g) => {
            const { sucursal, cliente, vehiculo } = g;
            // g.data_vehiculo = await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
          });
        await Promise.all(promesasVehiculos);
                return gastos_hoy_array;
        });
      const promesas_gastos_orden = await Promise.all(promesasConsultas_gastos_orden);
  
      const muestra_gastos_ordenes = promesas_gastos_orden.flat()
      
      // data_recepcion.elementos = temp.map(e=>e.aprobado = true)
      const campos = [
        'cliente',
        'descuento',
        'elementos',
        'fecha_promesa',
        'fecha_recibido',
        'observaciones',
        'formaPago',
        'id',
        'iva',
        'margen',
        'no_os',
        'servicio',
        'status',
        'tecnico',
        'sucursal',
        'vehiculo',
        'pdf_entrega'
      ]
      campos.forEach(campo=>{
        this.data_editar[campo] = data_recepcion[campo]
      })
      this.data_editar.historial_pagos = historial_pagos_arr

      this.data_editar.historial_gastos = muestra_gastos_ordenes.filter(g=>g.numero_os === recepcion)
      this.data_editar.formaPago_show = this.formasPago.find(f=>f.id === String(data_recepcion['formaPago'])).pago
      this.data_editar.servicio_show = this.servicios_.find(f=>f.valor === String(data_recepcion['servicio'])).nombre
    }
    Swal.close()
    this.data_editar.data_cliente = data_cliente
    this.data_editar.data_vehiculo = data_vehiculo
    this.data_editar.data_sucursal = data_sucursal
    
    const {reporte, _servicios} = this.calcularTotales(this.data_editar)
    this.data_editar.reporte = reporte
    this.data_editar.elementos = _servicios
    this.checksBox.get('margen').setValue(this.data_editar.margen)

    // console.log(this.data_editar);
    this.informacionLista = true;
    this.temporal = JSON.parse(JSON.stringify(this.data_editar));
  
    this.realizaOperaciones()
  }
  vigila(){
    this.checksBox.get('iva').valueChanges.subscribe((iva: boolean) => {
      this.data_editar.iva = iva
      this.realizaOperaciones()
    })
    this.checksBox.get('nivel_gasolina').valueChanges.subscribe((nivel_gasolina: string) => {
      this.data_editar.nivel_gasolina = nivel_gasolina
      this.realizaOperaciones()
    })
    this.checksBox.get('observaciones').valueChanges.subscribe((observaciones: string) => {
      this.data_editar.observaciones = observaciones
      this.realizaOperaciones()
    })
    this.checksBox.get('detalles').valueChanges.subscribe((detalles: boolean) => {
      this.data_editar.showDetalles = detalles
    })
    this.checksBox.get('descuento').valueChanges.subscribe((descuento: number) => {
      const nuevo_descuento = descuento < 0 ? 0 : descuento
      this.data_editar.descuento = nuevo_descuento
      this.realizaOperaciones()
    })
    this.checksBox.get('margen').valueChanges.subscribe((margen: number) => {
      const nuevo_margen = Math.min(Math.max(margen, 25), 100);
      this.data_editar.margen = nuevo_margen;
      this.realizaOperaciones();
    })
    this.checksBox.get('kilometraje').valueChanges.subscribe((kilometraje: number) => {
      const nuevo_kilometraje = Math.min(Math.max(kilometraje, 0), 900000000);
      this.data_editar.kilometraje = nuevo_kilometraje;
    })
    this.checksBox.get('formaPago').valueChanges.subscribe((formaPago: string) => {
      this.data_editar.formaPago = formaPago
      this.data_editar.formaPago_show = this.formasPago.find(f=>f.id === String(formaPago)).pago
      this.realizaOperaciones()
    })
    this.checksBox.get('status').valueChanges.subscribe((status: string) => {
      if (status  !== this.data_editar.status) {
        this.data_editar.status = status
        this.actualiza_Servicios(status)
      }
      if (status !== 'entregado') {
        this.limpiarFirma()
      }
    })
    // this.checksBox.get('servicio').valueChanges.subscribe((servicio: string) => {
    //   this.infoCotizacion.servicio = servicio
    // })
  }
  async actualiza_Servicios(status){
    let mensaje_coplemento = (status !== 'entregado') ? ', ademas eliminara el pdf antes creado; lo cual permite hacer aun cambios a la orden' : ''
    const {respuesta } = await this._publicos.mensaje_pregunta(`Cambiar status de orden a ${status}`,true, `Este cambio de status general afecta a los servicios de la orden${mensaje_coplemento}`)
    if (!respuesta) return
    // console.log(status);
    const elementos = [...this.data_editar.elementos]

    let new_status 
    switch (status) {
      case 'espera':
      case 'recibido':
      case 'autorizado':
        new_status = 'espera'
        const actual  = this._publicos.retorna_fechas_hora({fechaString: new Date()}).fecha_hora_actual
        this.data_editar.fecha_recibido = actual
        this.data_editar.fecha_entregado = null
        break;
      case 'terminado':
      case 'cancelado':
          new_status = status
      break;
      case 'entregado':
        new_status = status
        break;
    }
    elementos.forEach(s => {
          if (s.aprobado) {
            s.status = new_status
        }
    });

    this.data_editar.elementos = elementos
    this.data_editar.status = status

    if (status !== 'entregado') {
      const updates = {};
      const {sucursal, cliente, id} = this.data_editar
      if (sucursal && cliente && id) {
        const actual  = this._publicos.retorna_fechas_hora({fechaString: new Date()}).fecha_hora_actual
        // this.data_editar.fecha_recibido = actual
        updates[`recepciones/${sucursal}/${cliente}/${id}/status`] = status;
        updates[`recepciones/${sucursal}/${cliente}/${id}/fecha_recibido`] = actual;
        updates[`recepciones/${sucursal}/${cliente}/${id}/fecha_entregado`] = '';
        updates[`recepciones/${sucursal}/${cliente}/${id}/elementos`] = this.data_editar.elementos
        updates[`recepciones/${sucursal}/${cliente}/${id}/pdf_entrega`] = null
        update(ref(db), updates).then(()=>{
          // console.log('finalizo');
        })
        .catch(err=>{
          console.log(err);
        })
      }
    }
   
    this.realizaOperaciones()

  }

  async dataTecnico(event){
    // console.log(event);
    const {id, usuario} = event
    if (id && id !== this.data_editar.tecnico) {
      const { respuesta} = await this._publicos.mensaje_pregunta(`Cambiar tecnico?`,true,`El tecnico de la orden sera reemplazado`)
      // console.log(respuesta);
      if (respuesta) {
        this.data_editar.tecnico = id
        this.data_editar.tecnicoShow = usuario
      }
    }
  }
  
  agrega_principal(event){
    let nuevos = [...this.data_editar.elementos]
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
    let nuevos = [...this.data_editar.elementos]
    nuevos = nuevos.filter((elemento, index) => index !== index_elimina);
    this.asignar_nuevos_elementos(nuevos)
  }
  editar(donde:string , data , cantidad){
    let nueva_cantidad = parseFloat(cantidad)
    const { index:index_editar } = data   
    
    if (donde === 'cantidad') {
      nueva_cantidad = (nueva_cantidad <=0 ) ? 1 : nueva_cantidad
    }

    let nuevos = [...this.data_editar.elementos]
    nuevos[index_editar][donde] = nueva_cantidad
    this.asignar_nuevos_elementos(nuevos)
  }

  asignar_nuevos_elementos(nuevos:any[]){
    this.data_editar.elementos = nuevos
    this.realizaOperaciones()
  }
  realizaOperaciones(){
    const reporte_totales = {
      mo:0,
      refacciones:0,
    }

    const  {reporte, _servicios} = this.calcularTotales(this.data_editar)
      Object.keys(reporte_totales).forEach(campo=>{
        reporte_totales[campo] += reporte[campo]
      })
    this.data_editar.reporte = reporte
    this.data_editar.elementos = _servicios
    this.dataSource.data = _servicios
    this.newPagination()
  }

  compararObjetos(obj1: ServicioEditar, obj2: ServicioEditar): { sonIguales: boolean; diferencias: string } {
    const campos_comparar = ['elementos','reporte','servicio','margen','iva','descuento','status','tecnico','formaPago','observaciones']
    if (this.data_editar.status === 'entregado' && !this.data_editar.pdf_entrega) {
      campos_comparar.push('firma_cliente')
    }
    const diferencias: string[] = [];
    let sonIguales = true;
    for (const key of campos_comparar) {
      if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        sonIguales = false;
        diferencias.push(key);
      }
    }
    const otras_ = diferencias.join(', ')
    return { sonIguales, diferencias: otras_ };
  }

  async guardar_cambios(){


    // console.log(this.data_editar.historial_pagos);
    // this.data_editar.historial_pagos = []

    const {historial_pagos, status, reporte} = this.data_editar
    const { total } = JSON.parse(JSON.stringify(reporte));
    // console.log(total);
    
    let total_pagos = 0

    historial_pagos.forEach(p=>{
      const { monto } = p
      total_pagos+= monto
    })

    if (status === 'entregado' && total_pagos < total) {
      this._publicos.mensajeSwal('Error',0,true, `No se puede entregar, no hay ningún pago realizado o no se ha pagado el monto total de la orden de servicio`)
      return
    }
  
    
    

    if (!this.data_editar.pdf_entrega) {
      let campos = [...this.campos_ocupados_editar]
      let campos_update = ['elementos','margen','status','tecnico','formaPago', 'fecha_recibido','fecha_entregado','observaciones']
      if (this.data_editar.status === 'entregado' && !this.data_editar.pdf_entrega) {
        campos.push('firma_cliente')
        // campos_update.push('firma_cliente')
      }else{
        this.limpiarFirma()
      }
      const {ok, faltante_s} = this._publicos.realizavalidaciones_new(this.data_editar, campos)
  
      this.faltante_s = faltante_s
      
      if (!ok) return
  
      // console.log(this.data_editar); 
  
      const { sonIguales, diferencias } = this.compararObjetos(this.data_editar, this.temporal)
      // console.log({ sonIguales, diferencias });
  
      if (!sonIguales) {
        const { respuesta } = await this._publicos.mensaje_pregunta(`Remplazar información?`,true,`${diferencias}`)
        if (respuesta) {
  
          let updates = {}
          const {sucursal, cliente, vehiculo, id} = this.data_editar
          
          const nueva_data = JSON.parse(JSON.stringify(this.data_editar));
  
          const otros = this.purifica_informacion(nueva_data)
          const filtrados = otros.filter((element) => {
            if (element.tipo === "paquete") {
              return element.elementos.length > 0;
            }
            return true;
          });
  
          nueva_data.elementos = filtrados
  
          campos_update.forEach(campo=>{
            updates[`recepciones/${sucursal}/${cliente}/${id}/${campo}`] = nueva_data[campo]
          })
  
          if (this.data_editar.status === 'entregado' ) {
            //esperar a generar el pdf
      
            const actual  = this._publicos.retorna_fechas_hora({fechaString: new Date()}).fecha_hora_actual

            
              this.data_editar.fecha_entregado = actual
              this._pdf_entrega.pdf(this.data_editar).then((pdfReturn:any) => {
  
              const pdfDocGenerator = pdfMake.createPdf(pdfReturn);


              Swal.fire({
                title: 'Opciones de cotización',
                html:`<strong class='text-danger'>Se recomienda visualizar pdf antes de enviar</strong>`,
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Previsualizar PDF cotizacion',
                denyButtonText: `Guardar y enviar correo`,
                cancelButtonText:`cancelar`
        
              }).then((result) => {
                if (result.isConfirmed) {
                  pdfDocGenerator.open()
                } else if (result.isDenied) {
                  pdfDocGenerator.getBlob(async (blob) => {
                   
                    // async function tuFuncionPrincipal() {
                      try {
                       
                        const resultado = await this._uploadPDF.upload_pdf_entrega(blob,this.data_editar.no_os)
                    
                        // Esperar hasta que se tenga la ruta del archivo
                        while (!resultado.ruta) {
                          await new Promise(resolve => setTimeout(resolve, 100)); // Esperar 100ms antes de verificar nuevamente
                        }
                    
                        // Aquí puedes continuar con el código después de que se tenga la ruta
                        // console.log('Ruta del archivo:', resultado.ruta);
                        // this.data_editar.pdf_entrega = resultado.ruta
                        const actual  = this._publicos.retorna_fechas_hora({fechaString: new Date()}).fecha_hora_actual

                        updates[`recepciones/${sucursal}/${cliente}/${id}/pdf_entrega`] = resultado.ruta
                        updates[`recepciones/${sucursal}/${cliente}/${id}/fecha_entregado`] = actual
                        const fecha_limite_gastos = this._publicos.sumarRestarDiasFecha(actual,10)
                        updates[`recepciones/${sucursal}/${cliente}/${id}/fecha_limite_gastos`] = fecha_limite_gastos

                        update(ref(db), updates).then(()=>{
                          // console.log('finalizo');
                          this._publicos.swalToast(`Actualización correcta!!`,1)
                        })
                        .catch(err=>{
                          console.log(err);
                        })
                      } catch (error) {
                        console.error('Ocurrió un error:', error);
                      }                    
                  })
                }
              })
            })
          }else{
            updates[`recepciones/${sucursal}/${cliente}/${id}/pdf_entrega`] = null
            update(ref(db), updates).then(()=>{
              // console.log('finalizo');
              this._publicos.swalToast(`Actualización correcta!!`,1)
            })
            .catch(err=>{
              console.log(err);
            })
          }
        }else{
          this._publicos.swalToast(`Se cancelo`,0)
        }
      }else{
        this._publicos.swalToast(`No hubo cambios encontrados`,1)
      }
        
    }else{
      this._publicos.swalToast(`Ninguna accion realizada`,0, `Documento ya firmado para guardar los cambios cambia el status de la orden, se notificara con email a cliente`)
      console.log('existe firma no puede guarda ninguna modificacion');
    }
  }

  newPagination(){
   
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }

  ///acciones con la firma

  limpiarFirma(){
    this.SignaturePad.clear()
    this.data_editar.firma_cliente = null
  }
  firmar(){
    const u = this.SignaturePad.toDataURL()
    if (!this.SignaturePad.isEmpty()) {
      this.data_editar.firma_cliente = u
    }else{
      this.data_editar.firma_cliente = null
      this._publicos.swalToast('La firma no puede estar vacia',0)
    }
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
          ele.subtotal = mo + (refacciones * margen) * cantidad
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

  obtenerArregloFechas_gastos_diarios(data){
    const {ruta, arreglo_sucursal} = data
    const fecha_start = new Date('08-02-2023')
    const fecha_end = new Date()
    const diffTiempo = fecha_end.getTime() - fecha_start.getTime();
    const diffDias = Math.floor(diffTiempo / (1000 * 3600 * 24));
    let arreglo = []
    for (let i = 0; i <= diffDias; i++) {       
      const fecha_retorna = new Date(fecha_start.getTime() + i * 24 * 60 * 60 * 1000);
      if (!this._publicos.esDomingo(fecha_retorna)) {
        const Fecha_formateada = this._reporte_gastos.fecha_numeros_sin_Espacions(fecha_retorna)
        arreglo.push(Fecha_formateada)
      }
    }

    let Rutas = []
    arreglo_sucursal.forEach(s=>{
      arreglo.forEach(Fecha_formateada_=>{
        Rutas.push(`${ruta}/${s}/${Fecha_formateada_}`)
      })
    })
    return Rutas
  }

}
