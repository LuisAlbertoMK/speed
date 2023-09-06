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
  @Input() historial_gastos:any
  @Input() reales:boolean = false
  @Input() iva:boolean = false


  color_n: boolean
  rol_:string
  
  ngOnInit(): void {

    const { rol } = this._security.usuarioRol()

    this.rol_ = rol

    this.campos_usados = (rol ==='cliente') ? this.camposDesgloce_cliente :  this.camposDesgloce
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reporte']) {
      const nuevoValor = changes['reporte'].currentValue;
      const valorAnterior = changes['reporte'].previousValue;
      if (this.reales) {
        let refacciones = 0
        // if (this.historial_gastos.length) {
          this.historial_gastos.forEach(element => {
            refacciones += element.monto
          });
          this.reporte['refacciones_v'] = refacciones
          const {subtotal, iva, total, UB} = calcularTotales(this.reporte,this.iva)
          this.reporte['subtotal'] = subtotal
          this.reporte['iva'] = iva
          this.reporte['total'] = total
          this.reporte['ub'] = UB
        // }
        
        function calcularTotales(data, get_iva) {
          const {refacciones_v, mo, refacciones } = JSON.parse(JSON.stringify(data));
          const suma = refacciones_v + mo
            let subtotal = suma
            let iva_ = suma 
            let total = suma

            if (get_iva) {
              subtotal = suma
              iva_ = suma * .16
              total = suma * 1.16
            }
            const sin_margen = refacciones_v / 1.25
           const UB = (total - sin_margen) * (100 / total)
            return {subtotal, iva: iva_, total, UB}
        }
      }
      
    }
    
  }

}
