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


}
