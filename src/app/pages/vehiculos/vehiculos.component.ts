import { Component, OnInit } from '@angular/core';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  constructor(private _publicos: ServiciosPublicosService) { }

  vehiculos_arr:any[]=[]
  ngOnInit(): void {

    this.roles()
  }
  roles(){
    this.vehiculos_sucursal()
  }
  vehiculos_sucursal(){
    const clientes = this._publicos.revisar_cache('clientes')
    const vehiculos = this._publicos.revisar_cache('vehiculos')

    const nuevos_vehiculos = this._publicos.transformaDataVehiculo({clientes, vehiculos: this._publicos.crearArreglo2(vehiculos)})

   this.vehiculos_arr = nuevos_vehiculos
  }
  data_vehiculos(vehiculos, clientes){
    return  this._publicos.crearArreglo2(vehiculos)
    .map(vehiculo=>{
      const {cliente} = vehiculo
      
      vehiculo.data_cliente = clientes[cliente]
      return vehiculo
    })
  }

}
