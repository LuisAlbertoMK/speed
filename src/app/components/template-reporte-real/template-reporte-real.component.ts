import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

@Component({
  selector: 'app-template-reporte-real',
  templateUrl: './template-reporte-real.component.html',
  styleUrls: ['./template-reporte-real.component.css']
})
export class TemplateReporteRealComponent implements OnInit, OnChanges {
  
  @Input() reporte:any = null
  @Input() title:string 

  constructor(private _security:EncriptadoService, private _cotizaciones: CotizacionesService,) { }
  camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce_real ]
  rol_:string

  ngOnInit(): void {
    const { rol } = this._security.usuarioRol()

    this.rol_ = rol
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reporte']) {
      const nuevoValor = changes['reporte'].currentValue;
      const valorAnterior = changes['reporte'].previousValue;
      
    }
  }

}
