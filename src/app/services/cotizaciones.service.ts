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