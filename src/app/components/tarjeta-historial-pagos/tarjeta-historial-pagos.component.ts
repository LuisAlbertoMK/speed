import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tarjeta-historial-pagos',
  templateUrl: './tarjeta-historial-pagos.component.html',
  styleUrls: ['./tarjeta-historial-pagos.component.css']
})
export class TarjetaHistorialPagosComponent implements OnInit,OnChanges  {

  constructor() { }
  @Input() historial_pagos:any[]
  total_pagos:number = 0
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['historial_pagos']) {
      const nuevoValor = changes['historial_pagos'].currentValue;
      const valorAnterior = changes['historial_pagos'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      this.sumatorias()
    }
  }
  sumatorias(){
    const reporte = {total: 0}
    const operaciones = [...this.historial_pagos]
    operaciones.forEach(pago=>{
      const {monto} = pago
      reporte.total += monto
    })
    this.total_pagos = reporte.total
  }

}
