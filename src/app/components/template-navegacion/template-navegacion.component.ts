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
  enrutamiento = {cliente:'', sucursal:'', recepcion:'', tipo:'', anterior:'', vehiculo:'',
  cotizacion:''}
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
    }
    this.donde = this._publicos.reemplaza_strig_navegacion(donde)
    
    
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
    if (this.donde_pura === 'historial-vehiculo') {
      this.enrutamiento.anterior = 'historial-cliente'
    } else if (this.donde_pura === 'historial-cliente') {
      this.enrutamiento.anterior = 'clientes'
    }else if (this.donde_pura === 'clientes') {
      this.enrutamiento.anterior = null
      this.donde = null
    }
    this.router.navigate([`/${this.enrutamiento['anterior']}`], { 
      queryParams: this.enrutamiento
    });
  }
}
