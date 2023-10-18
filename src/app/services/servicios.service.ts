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
    valor_asiganado = 'si'
    checkList = [
      {valor:"antena",show:'antena', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"birlo_seguridad",show:'birlo seguridad', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"bocinas",show:'bocinas', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"botones_interiores",show:'botones interiores', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"boxina_claxon",show:'boxina claxon', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"calefaccion",show:'calefaccion', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"cenicero",show:'cenicero', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"cristales",show:'cristales', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"encendedor",show:'encendedor', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"espejo_retorvisor",show:'espejo retrovisor', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"espejos_laterales",show:'espejos laterales', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"estuche_herramientas",show:'estuche herramientas', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"extintor",show:'extintor', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"gato",show:'gato', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"golpes_y_carroceria",show:'golpes y carroceria', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"instrumentos_tablero",show:'instrumentos tablero', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"interiores",show:'interiores', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"limpiadores",show:'limpiadores', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"llanta_refaccion",show:'llanta refaccion', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"llave_cruz",show:'llave cruz', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"luces",show:'Luces', opciones: ["si","no","dañado"],status:this.valor_asiganado},
      {valor:"maneral_gato",show:'maneral gato', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"manijas_interiores",show:'manijas interiores', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"molduras_completas",show:'molduras completas', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"radio",show:'radio', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"tapetes",show:'tapetes', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"tapon_combustible",show:'tapon combustible', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"tapones_llantas",show:'tapones llantas', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"tapones_motor",show:'tapones motor', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"triangulos_seguridad",show:'triangulos seguridad', opciones: [ "si","no","dañado"],status:this.valor_asiganado},
      {valor:"tarjeta_de_circulacion",show:'tarjeta de circulacion', opciones: [ "si","no"],status:this.valor_asiganado},
      {valor:"llega_en_grua",show:'llega en grua', opciones: [ "si","no"],status:this.valor_asiganado},
      {valor:"testigos_en_tablero",show:'testigos en tablero', opciones: [ "si","no"],status:this.valor_asiganado},
      {valor:"nivel_gasolina",show:'nivel gasolina', opciones: [ "vacio","1/4","1/2", "3/4", "lleno"],status:this.valor_asiganado}
      
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
    camposGuardar = [ 'checkList','observaciones','cliente','detalles','diasEntrega','fecha_promesa','formaPago','iva','margen','elementos','sucursal','vehiculo','pathPDF', 'status', 'diasSucursal','fecha_recibido','notifico','servicio', 'tecnico','showNameTecnico','no_os','personalizados']

    infoConfirmar=
        {
          cliente:'', data_cliente:{}, vehiculo:'', data_vehiculo:{},sucursal:'', data_sucursal:{}, reporte:{}, no_os:'', dataFacturacion: {},observaciones:'',
          checkList:[], vehiculos:[], elementos:[], iva:true, formaPago:'1', margen: 25, personalizados: [],
          detalles:[],diasEntrega: 0, fecha_promesa: '', firma_cliente:null, pathPDF:'', status:null, diasSucursal:0,
          fecha_recibido:'', notifico:true,servicio:'1', tecnico:'', showNameTecnico: '', descuento:0
        }
      
//TODO aqui las nuevas funciones

  
  diasSucursal(f1:any,f2:any){
    
    var aFecha1 = f1.split('/');
     var aFecha2 = f2.split('/');
     var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
     var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
     var dif = fFecha2 - fFecha1;
     var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
     return dias;
  }

  purifica_checklist(checkList){
    const nuevo_check = [...checkList]
    const XD = nuevo_check.map(c=>{
      const {status, valor, show} = c
      let a = {status, valor}
      return a
    })
    return XD
  }
  purifica_detalles(detalles){
    const nuevos_detalles = [...detalles]
    const XD = nuevos_detalles.map(c=>{
      const {status, valor, show} = c
      let a = {status, valor}
      return a
    })
    return XD
  }
  


}
