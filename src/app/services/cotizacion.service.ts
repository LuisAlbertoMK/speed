import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from "../../environments/environment";
const urlServer = environment.firebaseConfig.databaseURL
import { ServiciosPublicosService } from './servicios-publicos.service';

import { child, get, getDatabase, onValue, ref, set } from "firebase/database"
import { ClientesService } from './clientes.service';
import { VehiculosService } from './vehiculos.service';
import { SucursalesService } from './sucursales.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  
  constructor(private http: HttpClient,private _publicos: ServiciosPublicosService, private _clientes: ClientesService,
              private _vehiculos: VehiculosService, private _sucursales:SucursalesService) { }
  formasPago=[
    {id:'1',pago:'contado',interes:0,numero:0},
    {id:'2',pago:'3 meses',interes:4.49,numero:3},
    {id:'3',pago:'6 meses',interes:6.99,numero:6},
    {id:'4',pago:'9 meses',interes:9.90,numero:9},
    {id:'5',pago:'12 meses',interes:11.95,numero:12},
    {id:'6',pago:'18 meses',interes:17.70,numero:18},
    {id:'7',pago:'24 meses',interes:24.,numero:24}
  ]
   camposCotizaciones = ['id','searchName','searchPlacas','reporte','formaPago','cliente','elementos','fecha','hora','iva','margen','nota','no_ctoizacion','servicio','vencimiento','vehiculo','pagoName','']
   sucursales_array = [ ...this._sucursales.lista_en_duro_sucursales]

   infoCotizacion = {
    cliente:'', data_cliente:{},vehiculo:'', data_vehiculo:{},vehiculos:[],elementos:[],sucursal:'',reporte:null, iva:true, formaPago: '1', descuento: 0, margen: 25,promocion:'',fecha_recibido:'', no_cotizacion:null, vencimiento:'', nota:null, servicio: '1', pdf:null, data_sucursal: {}, showDetalles:false, kms:0
  }
  consulta_cotizaciones_new(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, 'cotizacionesRealizadas');
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const cotizaciones = this._publicos.crearArreglo2(snapshot.val())
          cotizaciones.forEach((cotizacion, index)=> {
            cotizacion.formaPago = cotizacion.formaPago || '1';
            cotizacion.index = index
            cotizacion.sucursalShow = this.sucursales_array.find(s=>s.id === cotizacion.cliente.sucursal).sucursal
            cotizacion.cliente.sucursalShow = cotizacion.sucursalShow 
            cotizacion.margen = (cotizacion.margen) ? cotizacion.margen : 25
            cotizacion.pagoName = this.formasPago.find(f => f.id === String(cotizacion.formaPago)).pago;
            cotizacion.searchName = `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellidos}`;
            cotizacion.searchPlacas = `${cotizacion.vehiculo.placas}`;
            cotizacion.reporte = this._publicos.realizarOperaciones_2(cotizacion).reporte
            cotizacion.fechaCompara = this._publicos.construyeFechaString(cotizacion.fecha,cotizacion.hora)
          });
          resolve(cotizaciones);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_cotizacion_new(cotizacion): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db,`cotizacionesRealizadas/${cotizacion}` );
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const cotizacion = snapshot.val()
            cotizacion.cliente.fullname = `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellidos}`
            cotizacion.formaPago = cotizacion.formaPago || '1';
            cotizacion.margen = (cotizacion.margen) ? cotizacion.margen : 25
            cotizacion.pagoName = this.formasPago.find(f => f.id === String(cotizacion.formaPago)).pago;
            cotizacion.searchName = `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellidos}`;
            cotizacion.searchPlacas = `${cotizacion.vehiculo.placas}`;
            // cotizacion.reporte = this._publicos.realizarOperaciones_2(cotizacion).reporte
          resolve(cotizacion);
        } else {
          resolve([]);
        }
      });
    });
  }
}
