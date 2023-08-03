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
      {valor:'1',nombre:'servicio'},
      {valor:'2',nombre:'garantia'},
      {valor:'3',nombre:'retorno'},
      {valor:'4',nombre:'venta'},
      {valor:'5',nombre:'preventivo'},
      {valor:'6',nombre:'correctivo'},
      {valor:'7',nombre:'rescate vial'}
    ]
    sucursales_array = [...this._sucursales.lista_en_duro_sucursales]
    camposGuardar = [ 'checkList','observaciones','cliente','detalles','diasEntrega','fecha_promesa','formaPago','iva','margen','reporte','servicios','sucursal','vehiculo','pathPDF', 'status', 'diasSucursal','fecha_recibido','notifico','servicio', 'tecnico','showNameTecnico','no_os','personalizados']

    infoConfirmar=
        {
          cliente:'', data_cliente:{}, vehiculo:'', data_vehiculo:{},sucursal:'', data_sucursal:{}, reporte:{}, no_os:'', dataFacturacion: {},observaciones:'',
          checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:'1', margen: 25, personalizados: [],
          detalles:[],diasEntrega: 0, fecha_promesa: '', firma_cliente:null, pathPDF:'', status:null, diasSucursal:0,
          fecha_recibido:'', notifico:true,servicio:'1', tecnico:'', showNameTecnico: '', descuento:0
        }
        servicio_editar = {
          cliente:null, data_cliente:null, vehiculo:null, data_vehiculo:null,sucursal:null, data_sucursal:null, reporte:null, no_os:null, 
          dataFacturacion: {},observaciones:null, id:null,
          checkList:[], vehiculos:[], servicios:[], iva:true, formaPago:'1', margen: 25, personalizados: [],
          detalles:[],diasEntrega: 0, fecha_promesa: '', firma_cliente:null, pathPDF:null, status:null, diasSucursal:0,
          fecha_recibido:null, notifico:true,servicio:'1', tecnico:null, showNameTecnico: '', descuento:0, historial_pagos:[], historial_gastos:[]
        }
//TODO aqui las nuevas funciones

consulta_recepcion_sucursal(busqueda_ruta): Promise<any> {
  return new Promise((resolve, reject) => {
    const {ruta} = busqueda_ruta
    const starCountRef = ref(db, `${ruta}`);
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        const principal = snapshot.val()
          // snapshot.forEach((childSnapshot) => {
          //   const childKey = childSnapshot.key;
          //   const childData = childSnapshot.val();
          //   // console.log(childKey);
          //   // console.log(childData);

          //   Object.entries(childData).forEach(async ([key, entri_])=>{
          //     const reporte = this.reporte_general(entri_)
          //     childData[key].reporte = reporte
          //     const nueva:any = entri_
          //     const {sucursal, cliente, vehiculo} = nueva
          //     const data_cliente:any =  await this._clientes.consulta_cliente_new({sucursal, cliente})
          //     const data_vehiculo =  await this._vehiculos.consulta_vehiculo({ sucursal, cliente, vehiculo });
          //     const data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
          //     childData[key].data_cliente = data_cliente
          //     childData[key].data_vehiculo = data_vehiculo
          //     childData[key].data_sucursal = data_sucursal
          //   })

          //   principal[childKey] = {...childData}
            
          // })
          resolve(snapshot.val());
      } else {
        resolve({});
      }
    },{
      onlyOnce: true
    });
  });
}
consulta_recepcion_new(busqueda_ruta): Promise<any> {
  return new Promise((resolve, reject) => {
    const starCountRef = ref(db, `${busqueda_ruta}`);
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data_cotizcion = snapshot.val()
        data_cotizcion.data_cliente = await this.getInfo_cliente(data_cotizcion)
        data_cotizcion.data_vehiculo = await this.getInfo_vehiculo(data_cotizcion)
        resolve(data_cotizcion);
      } else {
        resolve({});
      }
    },{
      onlyOnce: true
    });
  });
}
async getInfo_cliente(data){
  return await this._clientes.consulta_cliente_new(data)
}
async getInfo_vehiculo(data){
  return await this._vehiculos.consulta_vehiculo_new(data)
}

consulta_recepciones(data): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const { vehiculos, ruta} = data
    const starCountRef = ref(db, `${ruta}`);
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        const recepciones = this._publicos.crearArreglo2(snapshot.val())
        const data_recepciones = recepciones.map(c=>{
          const info_v  = vehiculos.find(v=>v.id === c.vehiculo)
          c.data_vehiculo = info_v
          c.placas = info_v.placas
          return c
        })
        resolve(data_recepciones);
      } else {
        resolve([]);
      }
    },{
      onlyOnce: true
    });
  });
}
//TODO aqui las nuevas funciones

claves_recepciones(busqueda): Promise<any[]> {
  return new Promise((resolve, reject) => {
    get(child(dbRef, busqueda)).then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        let claves = []
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          // console.log({childKey, childData});
          Object.entries(childData).forEach(([key, entrie])=>{
            const entrie_:any = entrie
            function ubicar(arreglo:any[]){
              let nombres_ = arreglo?.map(({nombre})=>{return nombre})
              return String(nombres_.join(', ')).toLowerCase()
            }
            const servicios_a = (entrie_['servicios'] ) ? entrie_['servicios'] : []
            const sucursal = entrie_['sucursal']
            claves.push({key, sucursal ,descripcion: ubicar(servicios_a) ,no_os: entrie_['no_os'], cliente: entrie_['cliente'], status_orden: entrie_['status'], vehiculo: entrie_['vehiculo']})
          })
        })
        resolve(claves);
      } else {
        resolve([]);
      }
    })
  });
}
historial_pagos(data): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const { sucursal, cliente, id } = data
    const starCountRef = ref(db, `historial_pagos_orden/${sucursal}/${cliente}/${id}`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        resolve(this._publicos.crearArreglo2(snapshot.val()));
      } else {
        resolve([]);
      }
    })
  });
}

consulta_recepciones_new(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    get(child(dbRef, `recepciones`)).then((snapshot) => {
      if (snapshot.exists()) {
        resolve([]);
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
  async generateOSNumber(data, rol: string) {
    const date = new Date();
    const anio = date.getFullYear().toString().slice(-2);
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const {sucursal, cliente}= data
    const nameSucursal = this.sucursales_array.find(s=>s.id === sucursal).sucursal
    const nombreSucursal = nameSucursal.slice(0, 2).toUpperCase();
    const nuevoRol = rol.slice(0, 2).toUpperCase();
  
    let cuantas = 0;
    await get(child(dbRef, `recepciones/${sucursal}/${cliente}`)).then((snapshot) => {
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

  reporte_general(data){
    const {servicios} = data
    const elementos_ = [...servicios] || []
    const reporte = {mo:0, refacciones:0, refacciones_v:0, sobrescrito_mo:0, sobrescrito_refacciones:0,precio:0, ub:0, paquetes:0, paquetes_sobresrito:0}
    elementos_.map(element=>{
        const {tipo, costo, precio, aprobado, total, cantidad } = element
        if (aprobado) {
            let mul
            switch (tipo) {
                case 'MO':
                case 'mo':
                    reporte.mo +=  total 
                    if (costo>0 ) {
                        reporte.sobrescrito_mo += total
                    }
                break;
                case 'refaccion':
                    reporte.refacciones +=  precio
                    reporte.refacciones_v +=  total
                    if (costo>0 ) { reporte.sobrescrito_refacciones += total }
                break;
                case 'paquete':
                    const { reporte:reporte_interno } = element
                    reporte.paquetes += reporte_interno.precio
                    if (costo>0 ) { reporte.paquetes_sobresrito += reporte_interno.precio }
                    const ca = [
                        'mo',
                        'precio',
                        'refacciones',
                        'refacciones_v',
                        'sobrescrito_mo',
                        'sobrescrito_refacciones',
                    ]
                    
                    ca.forEach(c=>{
                        reporte[c] +=  reporte_interno[c]
                    })

                break;
            }
        }
    })
    const {mo,  refacciones_v, paquetes} = reporte
    const precio__ = mo + refacciones_v
    reporte.precio = precio__
    reporte.ub = 100 - ((refacciones_v * 100) / precio__ )
    return reporte
  }
  


}
