import { Component, OnInit } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  constructor(private _publicos: ServiciosPublicosService, private _security:EncriptadoService) { }

  vehiculos_arr:any[]=[]
  _rol:string
  _sucursal:string
  ngOnInit(): void {
    this.roles()
  }
  roles(){
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal

    this.vehiculos_sucursal()
  }
  async vehiculos_sucursal(){
    const clientes = await this._publicos.revisar_cache('clientes')
    const vehiculos = await this._publicos.revisar_cache('vehiculos')

    const nuevos_vehiculos = this._publicos.transformaDataVehiculo({clientes, vehiculos: this._publicos.crearArreglo2(vehiculos)})
    setTimeout(() => {
      this.vehiculos_arr = nuevos_vehiculos
    }, 1000);
  }
  

}
