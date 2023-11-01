import { Location } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

@Component({
  selector: 'app-template-navegacion',
  templateUrl: './template-navegacion.component.html',
  styleUrls: ['./template-navegacion.component.css']
})
export class TemplateNavegacionComponent implements OnInit,OnChanges {

  constructor(private rutaActiva: ActivatedRoute, private router: Router, private location: Location,
    private _publicos: ServiciosPublicosService
    ) { }

  enrutamiento:any

  donde:string
  donde_pura:string
  donde_show:string
  ngOnInit(): void {
    this.obtener_rutas_navegacion()
  }
  ngOnChanges(changes: SimpleChanges) {
    
  }

  obtener_rutas_navegacion(){
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = JSON.parse(JSON.stringify(params))
    });
    this.donde = this._publicos.extraerParteDeURL()
    // console.log(show_donde(this.donde));
    this.donde_show = show_donde(this.donde)
    

    function show_donde(cadena){
      return cadena.replace('-',' ')
    }
  }
  regresar(){
    const query_params =
    Object.keys(this.enrutamiento)
    .filter(param => param !=='anterior')
    .reduce((acc, param) => {
      acc[param] = this.enrutamiento[param];
      return acc;
    }, {});
    const {anterior} = this._publicos.crear_new_object( this.enrutamiento )

    const queryParams = (queryParams_verifica(anterior)) ?  {}: query_params


    const cliente = this.obtener_querys(anterior)
    
    if (cliente) {
      query_params['cliente'] = cliente
      query_params['anterior'] = 'clientes'
      delete  queryParams['vehiculo']
    }
    this.router.navigate([`/${anterior}`], { 
      queryParams
    });

    function queryParams_verifica(ruta_regresar){
      const rutas_sin_queryParams = [
        'inicio',
        'catalogos',
        'citas',
        'clientes',
        'configuracion',
        'cotizacion',
        'cotizacionNueva',
        'sucursales',
        'servicios',
        'usuarios',
        'reporteGastos',
        'registraProblemas',
        'eliminarEmpresa',
        'administracion',
        'corte',
        'vehiculos',
      ]
      return rutas_sin_queryParams.includes(ruta_regresar)
    }    
  }
  obtener_querys(ruta_regresar){
    const rutas_busqueda_params = [
      'historial-cliente'
    ]

    const ruta_valida = rutas_busqueda_params.includes(ruta_regresar)

    const {vehiculo} = this.enrutamiento
    let cliente_id:string = ''
    if (ruta_valida) {
      if (vehiculo) {
        const vehiculos = this._publicos.nueva_revision_cache('vehiculos')
        const data_vehiculo = this._publicos.crear_new_object(vehiculos[vehiculo])
        const {cliente} = data_vehiculo
        cliente_id = cliente
      }
      return cliente_id
    }else{
      return null
    }

    
    
  }
}
