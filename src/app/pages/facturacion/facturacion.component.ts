import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { environment } from 'src/environments/environment';

import { ServerService } from 'src/app/services/server.service';
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
 
  constructor(private _publicos:ServiciosPublicosService, private _security:EncriptadoService, private _sucursales: SucursalesService,
    private router: Router, private _serve: ServerService) { 
     
    }

  ngOnInit(): void {
    this.rol
    this.redirectToCheckout()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()
    console.log({rol, sucursal});
    
  }
  async redirectToCheckout() {
   
    
  }

}
