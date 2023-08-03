import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tarjeta-faltantes',
  templateUrl: './tarjeta-faltantes.component.html',
  styleUrls: ['./tarjeta-faltantes.component.css']
})
export class TarjetaFaltantesComponent implements OnInit {

  constructor() { }
  @Input() faltante_s:string
  ngOnInit(): void {
  }

}
