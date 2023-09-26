import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-template-navegacion',
  templateUrl: './template-navegacion.component.html',
  styleUrls: ['./template-navegacion.component.css']
})
export class TemplateNavegacionComponent implements OnInit,OnChanges {

  constructor(private rutaActiva: ActivatedRoute, private router: Router, private location: Location,
    private _publicos: ServiciosPublicosService
    ) { }

  // enrutamiento:any = {anterior:''}
  enrutamiento = {cliente:'', sucursal:'', recepcion:'', tipo:'', anterior:'', vehiculo:'', cotizacion:''}
  // enrutamiento: BehaviorSubject<any> = new BehaviorSubject<any>({
  //   cliente: '',
  //   sucursal: '',
  //   recepcion: '',
  //   tipo: '',
  //   anterior: '',
  //   vehiculo: '',
  //   cotizacion: ''
  // });
  donde:string
  donde_pura:string
  ngOnInit(): void {
    this.obtener_rutas_navegacion()
  }
  ngOnChanges(changes: SimpleChanges) {
    
  }

  obtener_rutas_navegacion(){

    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = JSON.parse(JSON.stringify(params))
    });
    // console.log(this.router.url);
    // console.log(extraerParteDeURL(this.router.));
    const urlActual = this.location.path()
    const urlCompleta = window.location.href;

    const donde = extraerParteDeURL(urlCompleta)
  
    this.donde_pura = donde
    
    if (this.donde_pura === 'historial-vehiculo') {
      this.enrutamiento.anterior = 'historial-cliente'
    } else if (this.donde_pura === 'historial-cliente') {
      this.enrutamiento.anterior = 'clientes'
    }else if (this.donde_pura === 'clientes' || this.donde_pura === 'cotizacion') {
      this.enrutamiento.anterior = null
      this.donde = null
    }else if(this.donde_pura === 'cotizacion-new-cliente'){
      this.enrutamiento.anterior = 'miPerfil'
    }
    this.donde = this._publicos.reemplaza_strig_navegacion(donde)
    // console.log(this.enrutamiento);
    
    
    function extraerParteDeURL(url) {
      // Utilizamos el objeto URL para analizar la URL
      const parsedURL = new URL(url);
      
      // Extraemos la ruta (path) de la URL
      const path = parsedURL.pathname;
      
      // Dividimos la ruta en partes separadas por '/'
      const partesDeRuta = path.split('/').filter(part => part); // Eliminamos segmentos vacíos
      
      // Devolvemos la última parte de la ruta (que suele ser la más relevante)
      return partesDeRuta.pop();
    }
  }
  regresar(){

    let ruta = 'inicio'
    if (this.donde_pura === 'historial-vehiculo') {
      ruta = 'historial-cliente'
    } else if (this.donde_pura === 'historial-cliente') {
      ruta = 'clientes'
    }else if (this.donde_pura === 'clientes') {
      ruta = null
      this.donde = null
    }else if (this.donde_pura === 'cotizacion-new-cliente') {
      ruta= 'miPerfil'
      this.enrutamiento = {cliente:null, sucursal:null, recepcion:null, tipo:null, anterior:null, vehiculo:null, cotizacion:null}
    }else if (this.donde_pura === 'cotizacionNueva') {
      // console.log('en cotizacionNueva');
      ruta = this.enrutamiento.anterior
      this.enrutamiento = {cliente:null, sucursal:null, recepcion:null, tipo:null, anterior:null, vehiculo:null, cotizacion:null}
    }

    // console.log(ruta);
    
    this.router.navigate([`/${ruta}`], { 
      queryParams: this.enrutamiento
    });
  }
}
