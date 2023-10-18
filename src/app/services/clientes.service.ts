import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { map } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Directorio } from '../models/directorio.model';
import { Facturacion } from '../models/facturacion.model';
import { environment } from "../../environments/environment";
import { Credito } from '../models/credito.model';

import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { ServiciosPublicosService } from './servicios-publicos.service';
import { info } from 'console';
import { SucursalesService } from './sucursales.service';
import { EmailsService } from './emails.service';
import { VehiculosService } from './vehiculos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  telefonosInvalidos:any[]=['5555555555','1111111111','0000000000','7777777777','1234567890','0123456789'];
  camposCliente = ['id','no_cliente','nombre','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','sucursal','empresa','usuario']
  camposCliente_show=[
    {valor: 'no_cliente', show:'# Cliente'},
    // {valor: 'fullname', show:'Nombre'},
    {valor: 'nombre', show:'Nombre'},
    {valor: 'apellidos', show:'Apellidos'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'},
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    {valor: 'sucursalShow', show:'Sucursal'}
  ]
  camposSave= ['no_cliente','nombre','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','sucursal','empresa','empresaShow','sucursalShow']

  tipos_cliente= ['todos','flotilla','particular']
  sucursales_array = [...this._sucursales.lista_en_duro_sucursales]

  campos_cliente = ['no_cliente','nombre','apellidos','correo','tipo','sucursal','telefono_movil']
  campos_permitidos_Actualizar = ['nombre','apellidos','tipo','telefono_movil']
  campos_opcionales = ['correo_sec','telefono_fijo']
  campos_permitidos_new_register = [...this.campos_cliente,...this.campos_opcionales]
  campos_show_validaciones = [
    {valor: 'no_cliente', show:'# Cliente' },
    {valor: 'telefono_movil', show:'Tel. cel.' },
    {valor: 'telefono_fijo', show:'Tel. Fijo' },
    {valor: 'nombre', show:'Nombre' },
    {valor: 'apellidos', show:'Apellidos' },
    {valor: 'sucursal', show:'Sucursal' },
    {valor: 'tipo', show:'Tipo' },
    {valor: 'correo_sec', show:'Correo adicional' },
    {valor: 'empresa', show:'Empresa' },
    {valor: 'correo', show:'Correo' },
  ]

  constructor( private _sucursales: SucursalesService,
    ) { }
    consulta_usuario_new(usuario): Promise<object> {
      return new Promise((resolve, reject) => {
        const starCountRef = ref(db, `usuarios/${usuario}`);
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            resolve(snapshot.val());
          } else {
            resolve({});
          }
        });
      });
    }
}
