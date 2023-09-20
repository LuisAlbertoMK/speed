import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tarjeta-historial-gastos',
  templateUrl: './tarjeta-historial-gastos.component.html',
  styleUrls: ['./tarjeta-historial-gastos.component.css']
})
export class TarjetaHistorialGastosComponent implements OnInit,OnChanges  {

  constructor() { }
  @Input() historial_gastos:any[]
  total_gastos:number = 0
  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['historial_gastos']) {
      const nuevoValor = changes['historial_gastos'].currentValue;
      const valorAnterior = changes['historial_gastos'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      this.sumatorias()
    }
  }
  sumatorias(){
    const reporte = {total: 0}
    console.log(this.historial_gastos);
    
    const operaciones = [...this.historial_gastos]
    operaciones.forEach(pago=>{
      const {monto} = pago
      reporte.total += monto
    })
    this.total_gastos = reporte.total
  }

}
