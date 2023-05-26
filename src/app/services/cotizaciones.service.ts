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

  constructor(
    private _publicos: ServiciosPublicosService,private _clientes: ClientesService,private _vehiculos: VehiculosService,
    private _sucursales: SucursalesService, private _servicios:ServiciosService
  ) { }
  
}