import { Injectable } from '@angular/core';
import { ServiciosPublicosService } from './servicios-publicos.service';

import { child, get, getDatabase, onValue, ref, set } from "firebase/database"
import { ClientesService } from './clientes.service';
import { VehiculosService } from './vehiculos.service';
import { SucursalesService } from './sucursales.service';
import { ServiciosService } from './servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {
  camposCotizaciones = ['id','searchName','searchPlacas','reporte','formaPago','cliente','elementos','fecha','hora','iva','margen','nota','no_ctoizacion','servicio','vencimiento','vehiculo','pagoName','sucursalShow']

  camposReporte = [ 'descuento','iva','meses','mo','refacciones_a','refacciones_v','sobrescrito','sobrescrito_mo','sobrescrito_paquetes','sobrescrito_refaccion','subtotal','total']

  camposReporte_show = [
    {valor:'descuento', show:'descuento'},
    {valor:'iva', show:'iva'},
    {valor:'meses', show:'meses'},
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones compra'},
    {valor:'refacciones_v', show:'refacciones'},
    {valor:'sobrescrito', show:'sobrescrito'},
    {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    // {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    // {valor:'sobrescrito_paquetes', show:'sobrescrito paquetes'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'total', show:'total'},
    // {valor:' ub', show:'ub'},
  ]
  camposReporte_show2 = {
    mo: 0,
    // refacciones_a: 0,
    refacciones_v: 0,
    sobrescrito: 0,
    // sobrescrito_mo: 0,
    // sobrescrito_refaccion: 0,
    // sobrescrito_paquetes: 0,
    meses: 0,
    descuento: 0,
    iva: 0,
    subtotal: 0,
    total: 0,
  }

  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
    {valor:'sobrescrito', show:'sobrescrito'},
    {valor:'descuento', show:'descuento'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'iva', show:'iva'},
    {valor:'total', show:'total'},
    {valor:'meses', show:'meses'},
  ]
  camposVehiculo=[
    {valor: 'placas', show:'Placas'},
    {valor: 'marca', show:'marca'},
    {valor: 'modelo', show:'modelo'},
    {valor: 'anio', show:'añio'},
    {valor: 'categoria', show:'categoria'},
    {valor: 'cilindros', show:'cilindros'},
    {valor: 'engomado', show:'engomado'},
    {valor: 'color', show:'color'},
    {valor: 'transmision', show:'transmision'},
    {valor: 'no_motor', show:'No. Motor'},
    {valor: 'vinChasis', show:'vinChasis'},
    {valor: 'marcaMotor', show:'marcaMotor'}
  ]
  camposCliente=[
    {valor: 'no_cliente', show:'# Cliente'},
    {valor: 'nombre', show:'Nombre'},
    {valor: 'apellidos', show:'Apellidos'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'},
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    {valor: 'sucursal', show:'Sucursal'}
  ]
  formasPago=[
    {id:'1',pago:'contado',interes:0,numero:0},
    {id:'2',pago:'3 meses',interes:4.49,numero:3},
    {id:'3',pago:'6 meses',interes:6.99,numero:6},
    {id:'4',pago:'9 meses',interes:9.90,numero:9},
    {id:'5',pago:'12 meses',interes:11.95,numero:12},
    {id:'6',pago:'18 meses',interes:17.70,numero:18},
    {id:'7',pago:'24 meses',interes:24.,numero:24}
  ]
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
  reporteGeneral = {
    iva:0, mo:0, refacciones_a:0,refacciones_v:0, sobrescrito_mo:0,sobrescrito_refaccion:0, sobrescrito_paquetes:0, 
    subtotal:0, total:0, ub:0, meses:0, descuento:0,sobrescrito:0
  }

  lista_en_duro_sucursales = [...this._sucursales.lista_en_duro_sucursales]
  constructor(
    private _publicos: ServiciosPublicosService,private _clientes: ClientesService,private _vehiculos: VehiculosService,
    private _sucursales: SucursalesService, private _servicios:ServiciosService
  ) { }

  consulta_cotizaciones_new(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      get(child(dbRef, `cotizacionesRealizadas`)).then((snapshot) => {
        if (snapshot.exists()) {
          const cotizaciones = this._publicos.crearArreglo2(snapshot.val());
          cotizaciones.map(c=>{
            c.fullname = `${c.cliente.nombre} ${c.cliente.apellidos}` 
            c.searchPlacas = `${c.vehiculo.placas}` 
          })
          resolve(cotizaciones);
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
          const recepciones = this._publicos.crearArreglo2(snapshot.val());
          recepciones.map(c=>{
            c.fullname = `${c.cliente.nombre} ${c.cliente.apellidos}` 
            c.searchPlacas = `${c.vehiculo.placas}` 
          })
          resolve(recepciones);
        } else {
          resolve([]);
        }
      })
    });
  }
  consulta_cotizaciones(data): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const {ruta, data_cliente, vehiculos} = data
      const starCountRef = ref(db, `${ruta}`);
      onValue(starCountRef, async (snapshot) => {
        if (snapshot.exists()) {
          const cotizaciones = this._publicos.crearArreglo2(snapshot.val()).map(c=>{
            c.data_cliente = data_cliente
            c.data_vehehiculo = vehiculos.find(v=>v.id === c.vehiculo)
          })
          // data_cotizcion.data_cliente = await this.getInfo_cliente(data_cotizcion)
          // data_cotizcion.data_vehiculo = await this.getInfo_vehiculo(data_cotizcion)
          
          const data_cotizcion = cotizaciones
          resolve(data_cotizcion);
        } else {
          resolve([]);
        }
      },{
        onlyOnce: true
      });
    });
  }
  consulta_cotizacion_new(busqueda_ruta): Promise<any> {
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
  async generaNombreCotizacion(rol:string, data){
    const  {sucursal, cliente, data_sucursal} = data
    const date: Date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const nombreSucursal:string = data_sucursal.sucursal.slice(0,2).toUpperCase()
    const nuevoRol:string = rol.slice(0,2).toUpperCase()
    const cotizacionesSnapshot = await get(child(dbRef, `cotizacionesRealizadas/${sucursal}/${cliente}`));
    const cotizacionesArray = cotizacionesSnapshot.exists() ? this._publicos.crearArreglo2(cotizacionesSnapshot.val()) : []
    const secuencia = (cotizacionesArray.length + 1).toString().padStart(5, '0')
    return `${nombreSucursal}${month}${year}${nuevoRol}${secuencia}`
}
  
}