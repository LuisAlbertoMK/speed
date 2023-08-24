import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

@Component({
  selector: 'app-reporte-desgloce-tarjeta',
  templateUrl: './reporte-desgloce-tarjeta.component.html',
  styleUrls: ['./reporte-desgloce-tarjeta.component.css']
})
export class ReporteDesgloceTarjetaComponent implements OnInit, OnChanges {

  constructor(private _cotizaciones: CotizacionesService, private _security:EncriptadoService) { }

  camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce ]
  camposDesgloce_cliente   =  [ ...this._cotizaciones.camposDesgloce_cliente ]

  campos_usados = []

  @Input() reporte:any = null
  @Input() title:string 
  @Input() muestra_normal:boolean = false
  color_n: boolean
  rol_:string
  
  ngOnInit(): void {

    const { rol } = this._security.usuarioRol()

    this.rol_ = rol

    this.campos_usados = (rol ==='cliente') ? this.camposDesgloce_cliente :  this.camposDesgloce
    
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

}
