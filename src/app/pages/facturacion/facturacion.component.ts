import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { environment } from 'src/environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { Stripe } from '@stripe/stripe-js';
import { ServerService } from 'src/app/services/server.service';
@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  private stripePromise: Promise<Stripe>;
  constructor(private _publicos:ServiciosPublicosService, private _security:EncriptadoService, private _sucursales: SucursalesService,
    private router: Router, private _serve: ServerService) { 
      this.stripePromise = loadStripe(environment.clave_publica);
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
    // const stripe = await this.stripePromise;
    // console.log(stripe);
    
    // Utiliza el objeto 'stripe' para interactuar con la API de Stripe
    // Ejemplo: stripe.redirectToCheckout({ ... });
    // this._serve.sendInvoice('mkoromini94@gmail.com').then((asn)=>{
    //   console.log(asn);
      
    // })
    
  }

}
