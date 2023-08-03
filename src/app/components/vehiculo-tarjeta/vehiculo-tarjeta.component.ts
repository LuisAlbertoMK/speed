import { Component, Input, OnInit } from '@angular/core';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-vehiculo-tarjeta',
  templateUrl: './vehiculo-tarjeta.component.html',
  styleUrls: ['./vehiculo-tarjeta.component.css']
})
export class VehiculoTarjetaComponent implements OnInit {

  constructor(private _vehiculos: VehiculosService,) { }
  @Input() vehiculo:any = null
  camposVehiculo   =  [ ...this._vehiculos.camposVehiculo_ ]

  ngOnInit(): void {
  }

}
