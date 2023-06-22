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
  camposCotizaciones = ['id','searchName','searchPlacas','reporte','formaPago','cliente','elementos','fecha','hora','iva','margen','nota','no_ctoizacion','servicio','vencimiento','vehiculo','pagoName']

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
  
}