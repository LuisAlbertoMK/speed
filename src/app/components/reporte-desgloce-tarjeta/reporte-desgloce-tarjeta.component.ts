import { Component, Input, OnInit } from '@angular/core';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';

@Component({
  selector: 'app-reporte-desgloce-tarjeta',
  templateUrl: './reporte-desgloce-tarjeta.component.html',
  styleUrls: ['./reporte-desgloce-tarjeta.component.css']
})
export class ReporteDesgloceTarjetaComponent implements OnInit {

  constructor(private _cotizaciones: CotizacionesService,) { }

  camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce ]

  @Input() reporte:any = null
  @Input() title:string 
  @Input() muestra_normal:boolean = false
  color_n: boolean

  ngOnInit(): void {
    // const tema_selecciondo = JSON.parse(localStorage.getItem('tema'))
    // this.color_n = tema_selecciondo.valor
  }

}
