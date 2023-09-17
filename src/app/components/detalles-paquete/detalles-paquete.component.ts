import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-detalles-paquete',
  templateUrl: './detalles-paquete.component.html',
  styleUrls: ['./detalles-paquete.component.css']
})
export class DetallesPaqueteComponent implements OnInit, OnChanges {

  @Input() paquete:any
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['paquete']) {
      const nuevoValor = changes['paquete'].currentValue;
      const valorAnterior = changes['paquete'].previousValue;
      // console.log({nuevoValor, valorAnterior});
      // console.log(nuevoValor);
      // console.log(nuevoValor);
      
      
    }
  }
}
