import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sucursal-tarjeta',
  templateUrl: './sucursal-tarjeta.component.html',
  styleUrls: ['./sucursal-tarjeta.component.css']
})
export class SucursalTarjetaComponent implements OnInit {

  constructor() { }
  @Input() sucursal
  @Input() title
  ngOnInit(): void {
  }

}
