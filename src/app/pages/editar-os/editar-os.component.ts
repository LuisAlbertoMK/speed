import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class EditarOsComponent implements OnInit, OnDestroy {

  constructor(
    private rutaActiva: ActivatedRoute, private _security:EncriptadoService, private _servicios: ServiciosService,
    private _clientes: ClientesService, private _vehiculos: VehiculosService, private _sucursales: SucursalesService,
    private _cotizaciones: CotizacionesService, private _formBuilder: FormBuilder, private _publicos: ServiciosPublicosService,
    private _usuarios: UsuariosService, private router: Router
    ) { }

  enrutamiento = {cliente:'', sucursal:'', cotizacion:'', tipo:'', anterior:'', vehiculo:'', recepcion:''}
  
  ngOnInit(): void {
    this.rol()
  }
  async ngOnDestroy(){
    const { sonIguales, diferencias } = this.compararObjetos(this.data_editar, this.temporal)
    if (!sonIguales) {
      const { respuesta } = await this._publicos.mensaje_pregunta(`Remplazar información?`,true,`${diferencias}`)
      if (respuesta) {
        const campos_update = ['elementos','margen','status','tecnico','formaPago', 'fecha_recibido','fecha_entregado']
        let updates = {}
        const {sucursal, cliente, vehiculo, id} = this.data_editar
        
        const nueva_data = JSON.parse(JSON.stringify(this.data_editar));
        // console.log(nueva_data);
        
        const data_purifica = this.purifica_informacion(nueva_data)
        // console.log(data_purifica);
        nueva_data.elementos = data_purifica


        campos_update.forEach(campo=>{
          updates[`recepciones/${sucursal}/${cliente}/${id}/${campo}`] = nueva_data[campo]
        })
        // console.log(updates);

        update(ref(db), updates).then(()=>{
          // console.log('finalizo');
          this._publicos.swalToast(`Actualización correcta!!`,1)
        })
        .catch(err=>{
          console.log(err);
        })
        
        
        
      }else{
        this._publicos.swalToast(`Se cancelo`,0)
      }
    }
  }
  sucursales_array  =   [ ...this._sucursales.lista_en_duro_sucursales]
  formasPago        =   [ ...this._cotizaciones.formasPago ]
  statusOS             = [ ...this._servicios.statusOS ]

  dataSource = new MatTableDataSource(); //elementos
  //  'clienteShow'
   cotizaciones = ['nombre','aprobado','cantidad','precio','costo','total']; 
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
    formaPago:'1',
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
    reporte:{}
  }
  temporal 

  checksBox = this._formBuilder.group({
    iva: true,
    detalles: false,
    descuento:0,
    margen:25,
    formaPago:'1',
    status:''
  });

  faltante_s:string 

 
  async rol(){
    const { rol, sucursal } = this._security.usuarioRol()

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
      allowOutsideClick:false
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

      // data_recepcion.elementos = temp.map(e=>e.aprobado = true)
      const campos = [
        'cliente',
        'descuento',
        'elementos',
        'fecha_promesa',
        'fecha_recibido',
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
      ]
      campos.forEach(campo=>{
        this.data_editar[campo] = data_recepcion[campo]
      })
    }
    Swal.close()
    this.data_editar.data_cliente = data_cliente
    this.data_editar.data_vehiculo = data_vehiculo
    this.data_editar.data_sucursal = data_sucursal
    
    const {reporte, _servicios} = this.calcularTotales(this.data_editar)
    this.data_editar.reporte = reporte
    this.data_editar.elementos = _servicios
    this.checksBox.get('margen').setValue(this.data_editar.margen)
    
    this.temporal = JSON.parse(JSON.stringify(this.data_editar));
  
    this.realizaOperaciones()
  }
  vigila(){
    this.checksBox.get('iva').valueChanges.subscribe((iva: boolean) => {
      this.data_editar.iva = iva
      this.realizaOperaciones()
    })
    // this.checksBox.get('detalles').valueChanges.subscribe((detalles: boolean) => {
    //   this.data_editar.showDetalles = detalles
    // })
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
    this.checksBox.get('formaPago').valueChanges.subscribe((formaPago: string) => {
      this.data_editar.formaPago = formaPago
      this.realizaOperaciones()
    })
    this.checksBox.get('status').valueChanges.subscribe((status: string) => {
      this.data_editar.status = status
      this.actualiza_Servicios(status)
    })
    // this.checksBox.get('servicio').valueChanges.subscribe((servicio: string) => {
    //   this.infoCotizacion.servicio = servicio
    // })
  }
  async actualiza_Servicios(status){
    const {respuesta } = await this._publicos.mensaje_pregunta(`Cambiar status de orden ${status}`,true, `Este cambio de status general afecta a los servicios de la orden`)
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
        const actual_entregado_terminado  = this._publicos.retorna_fechas_hora({fechaString: new Date()}).fecha_hora_actual
        this.data_editar.fecha_entregado = actual_entregado_terminado
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
    this.realizaOperaciones()
  }
  async dataTecnico(event){
    // console.log(event);
    const {id, usuario} = event
    if (id) {
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
    const campos_comparar = ['elementos','reporte','servicio','margen','iva','descuento','status','tecnico','formaPago']

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
    const campos = [
      'cliente','sucursal','vehiculo','elementos','servicio','margen','status','tecnico','formaPago'
    ]
    const {ok, faltante_s} = this._publicos.realizavalidaciones_new(this.data_editar, campos)

    this.faltante_s = faltante_s
    if (!ok) return

    // console.log(this.data_editar); 

    const { sonIguales, diferencias } = this.compararObjetos(this.data_editar, this.temporal)
    // console.log({ sonIguales, diferencias });

    if (!sonIguales) {
      const { respuesta } = await this._publicos.mensaje_pregunta(`Remplazar información?`,true,`${diferencias}`)
      if (respuesta) {
        const campos_update = ['elementos','margen','status','tecnico','formaPago', 'fecha_recibido','fecha_entregado']
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
        // console.log(updates);

        update(ref(db), updates).then(()=>{
          // console.log('finalizo');
          this._publicos.swalToast(`Actualización correcta!!`,1)
        })
        .catch(err=>{
          console.log(err);
        })
        
        
        
      }else{
        this._publicos.swalToast(`Se cancelo`,0)
      }
    }else{
      this._publicos.swalToast(`No hubo cambios encontrados`,1)
    }
    
  }

  newPagination(){
   
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
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
