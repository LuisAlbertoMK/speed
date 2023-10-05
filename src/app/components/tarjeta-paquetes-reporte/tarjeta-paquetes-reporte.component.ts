import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tarjeta-paquetes-reporte',
  templateUrl: './tarjeta-paquetes-reporte.component.html',
  styleUrls: ['./tarjeta-paquetes-reporte.component.css']
})
export class TarjetaPaquetesReporteComponent implements OnInit, OnChanges {
  @Input() reporte:any = null

  
  camposDesgloce = [
    {valor:'mo', show:'mo'},
    {valor:'refaccion', show:'refacciones compra'},
    {valor:'refaccionVenta', show:'refacciones venta'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'total', show:'total'},
  ]
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['reporte']) {
      const nuevoValor = changes['reporte'].currentValue;
      const valorAnterior = changes['reporte'].previousValue;
        // console.log('cambio informacion de reporte paquetes');
        
    }
  }

}
