import { Component, Input, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-cliente-tarjeta',
  templateUrl: './cliente-tarjeta.component.html',
  styleUrls: ['./cliente-tarjeta.component.css']
})
export class ClienteTarjetaComponent implements OnInit {

  constructor(private _clientes: ClientesService,) { }

  @Input() cliente:any = null

  camposCliente    =  [ ...this._clientes.camposCliente_show ]
  ngOnInit(): void {
  }

}
