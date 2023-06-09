import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from "../../environments/environment";

const urlServer = environment.firebaseConfig.databaseURL

import { child, get, getDatabase, onValue, ref, set,update  } from "firebase/database"
import { ServiciosPublicosService } from './servicios-publicos.service';
import { ClientesService } from './clientes.service';
import { VehiculosService } from './vehiculos.service';
import { SucursalesService } from './sucursales.service';
import { CotizacionesService } from './cotizaciones.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http: HttpClient, private _publicos: ServiciosPublicosService, private _clientes: ClientesService, 
    private _vehiculos: VehiculosService, private _sucursales: SucursalesService) { }

    campos_servicios_hard = ['index','checkList','cliente','detalles','diasEntrega','diasSucursal','fecha_recibido','formaPago','hora_recibido','iva','hitorial_gastos','historial_pagos',
    'margen','sucursal','notificar','reporte','servicio','servicios','status','vehiculo','fecha_entregado','hora_entregado','tecnico','showNameTecnico']

    checkList = [
      {valor:"antena",show:'antena', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"birlo_seguridad",show:'birlo seguridad', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"bocinas",show:'bocinas', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"botones_interiores",show:'botones interiores', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"boxina_claxon",show:'boxina claxon', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"calefaccion",show:'calefaccion', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"cenicero",show:'cenicero', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"cristales",show:'cristales', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"encendedor",show:'encendedor', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"espejo_retorvisor",show:'espejo retrovisor', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"espejos_laterales",show:'espejos laterales', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"estuche_herramientas",show:'estuche herramientas', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"extintor",show:'extintor', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"gato",show:'gato', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"golpes_y_carroceria",show:'golpes y carroceria', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"instrumentos_tablero",show:'instrumentos tablero', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"interiores",show:'interiores', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"limpiadores",show:'limpiadores', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"llanta_refaccion",show:'llanta refaccion', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"llave_cruz",show:'llave cruz', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"luces",show:'Luces', opciones: ["si","no","dañado"],status:'si'},
      {valor:"maneral_gato",show:'maneral gato', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"manijas_interiores",show:'manijas interiores', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"molduras_completas",show:'molduras completas', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"radio",show:'radio', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"tapetes",show:'tapetes', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"tapon_combustible",show:'tapon combustible', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"tapones_llantas",show:'tapones llantas', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"tapones_motor",show:'tapones motor', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"triangulos_seguridad",show:'triangulos seguridad', opciones: [ "si","no","dañado"],status:'si'},
      {valor:"tarjeta_de_circulacion",show:'tarjeta de circulacion', opciones: [ "si","no"],status:'si'},
      {valor:"llega_en_grua",show:'llega en grua', opciones: [ "si","no"],status:'si'},
      {valor:"testigos_en_tablero",show:'testigos en tablero', opciones: [ "si","no"],status:'si'},
      {valor:"nivel_gasolina",show:'nivel gasolina', opciones: [ "vacio","1/4","1/2", "3/4", "lleno"],status:'1/4'}
      
    ]
    detalles_rayar=[
      {valor:'capo', show:'capo',status:false},
      {valor:'paragolpes_frontal', show:'paragolpes frontal',status:false},
      {valor:'paragolpes_posterior', show:'paragolpes posterior',status:false},
      {valor:'techo', show:'techo',status:false},
      {valor:'espejo_derecho', show:'espejo derecho',status:false},
      {valor:'espejo_izquierdo', show:'espejo izquierdo',status:false},
      {valor:'faros_frontales', show:'faros frontales',status:false},
      {valor:'faros_posteriores', show:'faros posteriores',status:false},
      {valor:'parabrisas_posterior', show:'parabrisas posterior',status:false},
      {valor:'paragolpes_frontal', show:'paragolpes frontal',status:false},
      {valor:'paragolpes_posterior', show:'paragolpes posterior',status:false},
      {valor:'puerta_lateral_derecha_1', show:'puerta lateral derecha 1',status:false},
      {valor:'puerta_lateral_derecha_2', show:'puerta lateral derecha 2',status:false},
      {valor:'puerta_lateral_izquierda_1', show:'puerta lateral izquierda 1',status:false},
      {valor:'puerta_lateral_izquierda_2', show:'puerta lateral izquierda 2',status:false},
      {valor:'puerta_posterior', show:'puerta posterior',status:false},
      {valor:'tirador_lateral_derecha_1', show:'tirador lateral derecha 1',status:false},
      {valor:'tirador_lateral_derecha_2', show:'tirador lateral derecha 2',status:false},
      {valor:'tirador_lateral_izquierda_1', show:'tirador lateral izquierda 1',status:false},
      {valor:'tirador_lateral_izquierda_2', show:'tirador lateral izquierda 2',status:false},
      {valor:'tirador_posterior', show:'tirador posterior',status:false}
    ]
    camposGastos = ['concepto','referencia','fecha_registro','gasto_tipo','metodoShow','monto']
    camposGastos_show = ['concepto','referencia','fecha registro','Tipo','Metodo','monto']
    camposPagos = ['concepto','fecha_registro','metodoShow','monto']
    camposPagos_show = ['concepto','fecha registro','metodo','monto']

    estatusServicioUnico = [
      {valor: 'aprobado'   , show: 'Aprobar'},
      {valor: 'Noaprobado'  , show: 'No Aprobado'},
      {valor: 'terminar'   , show: 'Terminado'},
      {valor: 'eliminado'  , show: 'Eliminar'},
      {valor: 'cancelado'  , show: 'Cancelado'}
    ]
    statusOS = [
      {valor: 'espera'   , show: 'Espera'},
      {valor: 'recibido'   , show: 'Recibido'},
      {valor: 'autorizado'  , show: 'Autorizado'},
      {valor: 'terminado'   , show: 'Terminado'},
      {valor: 'entregado'  , show: 'Entregado'},
      {valor: 'cancelado'  , show: 'Cancelado'}
    ]
    menuListaBusqueda_arr = [
      {valor:'hoy',show:'Hoy', dias: 0},
      {valor:'ayer',show:'Ayer', dias: -1},
      {valor:'ult7dias',show:'Últimos 7 días', dias:-7},
      {valor:'ult30dias',show:'Últimos 30 días', dias: -30},
      {valor:'esteMes',show:'Este mes', dias: 0},
      {valor:'ultMes',show:'Último mes', dias: 0},
      {valor:'esteAnio',show:'Este año', dias: 0},
      {valor:'ultAnio',show:'Último año', dias: 0},
      {valor:'personalizado',show:'Personalizado',dias: 0},
    ]
    camposEstancia = [
      {valor: 'servicios_totales', show:'Numero servicios'},
      {valor: 'ticket_total', show:'ticket total'},
      {valor: 'ticketPromedio', show:'ticket promedio'},
      {valor: 'diasSucursal_total', show:'dias Sucursal total'},
      {valor: 'diasSucursal', show:'dias Sucursal promedio'},
      {valor: 'horas_totales_totales', show:'horas totales'},
      {valor: 'horas_totales', show:'horas totales promedio'},
    ]
    reporteEstancias = {  servicios_totales:0, ticket_total:0, ticketPromedio:0, diasSucursal_total:0, diasSucursal:0, horas_totales_totales:0, horas_totales:0}
    metodospago = [ 
        {valor:'1', show:'Efectivo', ocupa:'Efectivo'},
        {valor:'2', show:'Cheque', ocupa:'Cheque'},
        {valor:'3', show:'Tarjeta', ocupa:'Tarjeta'},
        {valor:'4', show:'Transferencia', ocupa:'Transferencia'},
        {valor:'5', show:'Credito', ocupa:'credito'},
        // {valor:4, show:'OpenPay', ocupa:'OpenPay'},
        // {valor:5, show:'Clip / Mercado Pago', ocupa:'Clip'},
        {valor:'6', show:'Terminal BBVA', ocupa:'BBVA'},
        {valor:'7', show:'Terminal BANAMEX', ocupa:'BANAMEX'}
      
    ]
    servicios=[
      {valor:1,nombre:'servicio'},
      {valor:2,nombre:'garantia'},
      {valor:3,nombre:'retorno'},
      {valor:4,nombre:'venta'},
      {valor:5,nombre:'preventivo'},
      {valor:6,nombre:'correctivo'},
      {valor:7,nombre:'rescate vial'}
    ]
    sucursales_array = [...this._sucursales.lista_en_duro_sucursales]
//TODO aqui las nuevas funciones

consulta_recepciones_new(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    get(child(dbRef, `recepciones`)).then((snapshot) => {
      if (snapshot.exists()) {
        const recepciones = this._publicos.crearArreglo2(snapshot.val());
        recepciones.map(c=>{
          const getTime  = this._publicos.getFechaHora()
          const diasSucursal =  this._publicos.calcularDias(c.fecha_recibido, getTime.fecha)
          //asiganmos el fullname de cliente

          if (diasSucursal !== c.diasSucursal) {
            const updates = { [`recepciones/${c.id}/diasSucursal`]: diasSucursal };
            update(ref(db), updates) .then(() => {});
          }
          c.fullname = `${c.cliente.nombre} ${c.cliente.apellidos}`
          c.searchCliente = c.fullname
          c.sucursalShow = this.sucursales_array.find(s=>s.id === c.cliente.sucursal).sucursal
          c.cliente.sucursalShow = c.sucursalShow
          c.searchPlacas = `${c.vehiculo.placas}`
          c.fechaRecibido = this._publicos.convertirFecha(c.fecha_recibido)
          c.fechaEntregado = (c.fecha_entregado) ? this._publicos.convertirFecha(c.fecha_entregado) : null
          //convierte a arreglo si existen historiales de pagos y gastos
          c.HistorialPagos_ =  (c.HistorialPagos) ? this._publicos.crearArreglo2(c.HistorialPagos) : []
          c.HistorialGastos_ =  (c.HistorialGastos) ? this._publicos.crearArreglo2(c.HistorialGastos) : []
          
          const {pagos, gastos, totalPagos, totalGastos} = this.obtenerTotalesHistoriales(c.HistorialPagos_ ,c.HistorialGastos_)
          c.HistorialPagos_ = [...pagos]
          c.HistorialGastos_ = [...gastos]
          c.totalPagos = totalPagos
          c.totalGastos = totalGastos
          //convierte la fecha para su uso en filtro por fechas
          c.fecha_recibido_compara = this._publicos.construyeFechaString(c.fecha_recibido)
          if (c.fecha_entregado) {
            c.fecha_entrega_compara = this._publicos.construyeFechaString(c.fecha_entregado)
          }
          // c.fechaRecibido = `${c.fecha_recibido} ${c.hora_recibido}`
          // c.fechaEntregado = `${c.fecha_entregado} ${c.hora_entregado}`

          ///obtener el reporte 
          const {reporte, ocupados} = this._publicos.realizarOperaciones_2(c)
          c.reporte = reporte
          c.servicios = ocupados
        })
        resolve(recepciones);
      } else {
        resolve([]);
      }
    })
  });
}

obtenerTotalesHistoriales(pagos, gastos){
  let totalPagos=0, totalGastos = 0

  pagos.forEach(element => {
    element.tipoNuevo = 'pago'
    const { show } = this.metodospago.find(m => m.valor === String(element.metodo))
    element.metodoShow = show
    if(element.status) totalPagos += element.monto
  });
  gastos.forEach(element => {
    element.tipoNuevo = 'gasto'
    const { show } = this.metodospago.find(m => m.valor === String(element.metodo))
    element.metodoShow = show
    if(element.status) totalGastos += element.monto
  });
  return {pagos, gastos, totalPagos, totalGastos}
}
//TODO aqui las nuevas funciones



    ///
  async no_OS(infoSucursal: string,rol:string ){
    let no_OS = '', numero = 0, secuencia=''; let ceros = ''
    let mes = ''; let sucursal= '', nuevoRol:string ='', cuantas:number = 0

    const date: Date = new Date()
    const anio = String(date.getFullYear())
    let muestra = anio.slice(anio.length-2,anio.length)
    if((date.getMonth() +1)<10) { mes = `0${(date.getMonth() +1)}` }else{ mes=`${(date.getMonth() +1)}` }

    await get(child(dbRef, `recepciones`)).then((snapshot) => {
      if (snapshot.exists()) {
        const contador = this._publicos.crearArreglo2(snapshot.val())
        cuantas = contador.length
      } 
    }).catch((error) => {
      console.error(error);
    });
    const inicio = String(cuantas).length
    const final = 5
    for (let index = inicio; index < final ; index++) {
      ceros = `${ceros}0`
    }
    secuencia = `${ceros}${cuantas + 1}`
    const nombreSucursal:string = infoSucursal      
    sucursal = nombreSucursal.slice(0,2).toUpperCase() 
    const rolString:string = rol      
    nuevoRol = rolString.slice(0,2).toUpperCase()
    no_OS = `${sucursal}${mes}${muestra}${nuevoRol}${secuencia}` 
    return no_OS
  }
  async generateOSNumber(infoSucursal: string, rol: string) {
    const date = new Date();
    const anio = date.getFullYear().toString().slice(-2);
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const nombreSucursal = infoSucursal.slice(0, 2).toUpperCase();
    const nuevoRol = rol.slice(0, 2).toUpperCase();
  
    let cuantas = 0;
    await get(child(dbRef, 'recepciones')).then((snapshot) => {
      if (snapshot.exists()) {
        cuantas = this._publicos.crearArreglo2(snapshot.val()).length;
      }
    })
  
    const secuencia = (cuantas + 1).toString().padStart(5, '0');
    return `${nombreSucursal}${mes}${anio}${nuevoRol}${secuencia}`;
  }
  

  async getRecepcionUnica(ID:string){
    let answer ={informacion:false,data:{infoCliente:[],infoVehiculo:[]},error:''}
    await get(child(dbRef, `recepciones/${ID}`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        const info = snapshot.val()
        let nueva ={...info}
        await this._clientes.infoCliente(info.cliente).then(({informacion,info})=>{
          const tempData = {...info,fullname:`${info['nombre']} ${info['apellidos']}`}
          nueva.infoCliente = tempData          
        })
        await this._vehiculos.infoVehiculo(info.vehiculo).then(({contenido, vehiculo})=>{
          nueva.infoVehiculo = vehiculo
        })
        answer['data'] = nueva
        answer.informacion = true
      }
    }).catch((error) => {
      console.error(error);
      answer.error = error
    });
    return answer
  }
  async getRecepcionesnew(){
    let answer = {valido: false, data:[]}
    await get(child(dbRef, `recepciones`)).then(snapshot => {
      if (snapshot.exists()) {     
        answer.data = this._publicos.crearArreglo2(snapshot.val()) 
        answer.valido = true
      } 
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  realizarPagos(data){
    let answer = {total : data['desgloce'].total ,subtotal: data['desgloce'].subtotal,pagado:0, debe:0, gastos:0, utilidad_iva:0, utilidad:0, real_gastos_mo:0, real_gastos_refaccion:0,real_pagos_mo:0, real_pagos_refaccion:0, total_real_refacciones:0,total_real_mo:0,total_ul:0}
    
    let total_gastos = 0, pagado = 0
    let HistorialGastos = [], HistorialPagos = []
    if (data['HistorialGastos2']) HistorialGastos =  data['HistorialGastos2']
    // data['HistorialGastos'] ?  : HistorialGastos = []

    data['gastos_'].forEach(g=>{
      if (g['status']) {
        total_gastos += g['monto']
        if(g['gasto_tipo'] === 'refaccion'){
          answer.real_gastos_refaccion += g['monto']
        }else{
          answer.real_gastos_mo += g['monto']
        }
      }
    })

      // for (let index = 0; index < HistorialGastos.length; index++) {
      //   const element = HistorialGastos[index];
      //   if (element['status']) {
      //     total_gastos += element['monto']
      //     if(element['gasto_tipo'] === 'refaccion'){
      //       answer.real_gastos_refaccion += element['monto']
      //     }else{
      //       answer.real_gastos_mo += element['monto']
      //     }
      //   }
        
      // }
      
    
    if(data['HistorialGastos2'] ) HistorialPagos =  data['HistorialGastos2']
    data['pagos_'].forEach(p=>{
      if (p['status']) {
        answer.pagado += p['monto']
      }
    })
      // for (let index = 0; index < HistorialPagos.length; index++) {
      //   const element = HistorialPagos[index];
      //   if (element['status']) {
      //     pagado += element['monto']
      //     // if(element['gasto_tipo'] === 'refaccion'){
      //     //   answer.real_pagos_refaccion += element['monto']
      //     // }else{
      //     //   answer.real_pagos_mo += element['monto']
      //     // }
      //   }
      // }
      answer.total_real_refacciones =   answer.real_pagos_refaccion - answer.real_gastos_refaccion
      answer.total_real_mo =   answer.real_pagos_mo - answer.real_gastos_mo
      answer.debe = answer.total - pagado
      answer.pagado = pagado
      answer.gastos = total_gastos
      answer.utilidad = answer.subtotal - answer.gastos
      answer.utilidad_iva = answer.total - answer.gastos
      // answer.total_ul = (answer.real_gastos_refaccion + answer.real_gastos_mo )
    return answer 
  }
  
  async actualizahistorialPagos(padre,data){
    let answer = {registroOK:false}
    await set(ref(db, `recepciones/${padre}/HistorialPagos`), data )
        .then(async () => {
          // Data saved successfully!
          answer.registroOK = true
        })
        .catch((error) => {
          // The write failed...
          answer.registroOK = false
        });
    return answer
  }
  async actualizahistorialGastos(padre,data){
    let answer = {registroOK:false}
    await set(ref(db, `recepciones/${padre}/HistorialGastos`), data )
        .then(async () => {
          // Data saved successfully!
          answer.registroOK = true
        })
        .catch((error) => {
          // The write failed...
          answer.registroOK = false
        });
    return answer
  }
  diasSucursal(f1:any,f2:any){
    
    var aFecha1 = f1.split('/');
     var aFecha2 = f2.split('/');
     var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
     var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
     var dif = fFecha2 - fFecha1;
     var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
     return dias;
  }
  async realizarOperaciones(array:any[],margen:number, iva:boolean){
    // console.log(array);
    const dataCotizacion = array
    const dataReturn = {totalMO:0,sobrescrito:0,refacciones1:0,refacciones2:0, subtotal:0, IVA:0,total:0,UB:0}
    let mo=0, refacciones1 =0,refacciones2=0,totalImportante=0
    for (let index = 0; index < dataCotizacion.length; index++) {
          
      const element = dataCotizacion[index];

      if (element.aprobado) {
        const cantidad = element.cantidad
        if (element.tipo === 'paquete') {
          const Subelementos = element.elementos
   
          if (element.costo>0) {
            totalImportante = totalImportante + (cantidad * element.costo)
          }else{
            const infoPaquete = this._publicos.costodePaquete(Subelementos,margen)
            mo = mo + infoPaquete.mo
            refacciones1 = refacciones1 + infoPaquete.refacciones1
            refacciones2 = refacciones2 + infoPaquete.refacciones2
            dataCotizacion[index].precio = infoPaquete.flotilla
          }
          
        }else if (element.tipo === 'mo') {
          if (element.costo>0) {
            const operacion = cantidad * element.costo
            totalImportante = totalImportante + operacion
            dataCotizacion[index].precio = operacion
          }else{
            const operacion = element.precio * cantidad
            mo = mo + operacion
            dataCotizacion[index].precio = operacion
          }          
        }else if (element.tipo === 'refaccion') {
          if (element.costo>0) {            
            const operacion = cantidad * element.costo
            totalImportante = totalImportante + operacion
            dataCotizacion[index].precio = operacion
          }else{
            const operacion = element.precio * cantidad
            refacciones1 = refacciones1 + operacion
            // refacciones2 = refacciones2 + (operacion * (margen / 100) + 1)
            dataCotizacion[index].precio = operacion
          }              
        }  
      }
      // console.log('aqui');
      
    }
    // console.log(mo);
    

    const opera = refacciones1 * (1 + (margen/100)) + mo +totalImportante
    // console.log(opera);

    
    
    dataReturn['totalMO'] = mo
    dataReturn['sobrescrito'] = totalImportante
    dataReturn['refacciones1'] = refacciones1
    dataReturn['refacciones2'] = refacciones1 * (1 + (margen/100))
    const UB = ((opera - refacciones1)*100) / opera
    dataReturn.UB = Number(this._publicos.redondeado(UB))
    if (iva) {
      const nuevo = opera * 1.16
      const ivaNuevo  = opera * .16
      dataReturn['subtotal'] =  opera
      dataReturn['IVA'] =  ivaNuevo
      dataReturn['total'] =  nuevo
    }else{  
      dataReturn['total'] =  opera
    }
    return dataReturn
  }

  getRecepciones(cliente:string,vehiculo:string){
    return this.http.get(`${urlServer}/recepcion/${cliente}/${vehiculo}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getRecepcion(cliente:string,vehiculo:string,recepcion:string){
    return this.http.get(`${urlServer}/recepcion/${cliente}/${vehiculo}/${recepcion}.json`)
  }
  getStatusRecepcion(cliente:string,vehiculo:string, recepcion:string,recepcionStatus:string){
    return this.http.get(`${urlServer}/recepcionStatus/${cliente}/${vehiculo}/${recepcion}/${recepcionStatus}.json`)
  }
  actualizaStatus(sucursal:string,cliente:string,vehiculo:string, recepcion:string,dataRecepcion:any){
    const temp = {
      ...dataRecepcion
    }
    return this.http.put(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${vehiculo}/${recepcion}.json`,temp)
  }
  getRecepcionSucursalUnica(sucursal:string,cliente:string){
    return this.http.get(`${urlServer}/recepcion/${sucursal}/${cliente}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getRecepcionesSucursalUnica(sucursal:string,cliente:string, vehiculo:string){
    return this.http.get(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${vehiculo}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }



  private crearArreglo(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
    const arraypush: any = arrayObj[key]
    //arraypush.id=key
    arrayGet.push(arraypush)
    })
    return arrayGet
  }
  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
    const arraypush: any = arrayObj[key]
    arraypush.id=key
    arrayGet.push(arraypush)
    })
    return arrayGet
  }
}
