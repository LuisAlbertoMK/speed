import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { animate, state, style, transition, trigger } from '@angular/animations';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CamposSystemService } from '../../services/campos-system.service';

import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-cotizaciones-cliente',
  templateUrl: './cotizaciones-cliente.component.html',
  styleUrls: ['./cotizaciones-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CotizacionesClienteComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, 
    private _vehiculos: VehiculosService, private _servicios: ServiciosService, private _campos: CamposSystemService,
    private _clientes: ClientesService, private _sucursales: SucursalesService, private _cotizaciones: CotizacionesService) { }
  rol_cliente:string = 'cliente'

  camposDesgloce    =   [ ...this._cotizaciones.camposDesgloce  ]
  camposCliente     =   [ ...this._clientes.camposCliente_show  ]
  camposVehiculo    =   [ ...this._vehiculos.camposVehiculo_  ]
  formasPago        =   [ ...this._cotizaciones.formasPago  ]

  paquete: string     =   this._campos.paquete
  refaccion: string   =   this._campos.refaccion
  mo: string          =   this._campos.mo
  miniColumnas:number =   this._campos.miniColumnas

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','no_cotizacion','searchName','searchPlacas']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos


  cotizaciones_Existentes = []


  ///grafica de datos
  single = []
  view_comparativa: [number, number] = [500, 200];
  clonado_busqueda = []
  infoSelect_busqueda = {value: 0, name:'--------',contador: 0,arreglo:[]}
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme:Color = {
    group: ScaleType.Ordinal, 
    selectable: true, 
    name: 'Customer Usage', 
    domain: ['#3574FA', '#FF8623', '#a8385d', '#5ca04a']
  };
  tabla_promedios = [
    {valor:'servicios_totales', show:'Total de cotizaciones'},
    {valor:'ticketGeneral', show:'Ticket general'},
    {valor:'ticketPromedio', show:'Ticket promedio'},
  ]
  valores_promedios = {servicios_totales: 0, ticketGeneral:0, ticketPromedio:0}
  tabla_maximos  = [
    {valor:'maximo', show:'Inversion mas alta', },
    {valor:'contadorMaximo', show:'contador altas', },
    {valor:'no_maximo', show:'# cotizacion mas alta',},
    {valor:'arreglo_maximo', show:'cotizaciones maximas'},
  ]
   valores_tabla_maximos = { maximo: 0,contadorMaximo: 0,no_maximo: '',arreglo_maximo: '' }
  tabla_minimos = [
    {valor:'minimo', show:'Inversion mas baja'},
    {valor:'contadorMinimo', show:'contador bajas'},
    {valor:'no_minimo', show:'# cotizacion mas baja'},
    {valor:'arreglo_minimo', show:'cotizaciones minimas'},
  ]
  valores_tabla_minimos = { minimo: 0,contadorMinimo: 0, no_minimo: '',arreglo_minimo: '' }
  ngOnInit(): void {
    this.rol()
  }
  rol(){

    const { rol,  uid } = this._security.usuarioRol()

    if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
  }

  obtenerInformacion_cliente(cliente:string){
    // console.log('obtener las cotizaciones del cliente');
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, async (snapshot) => {
        const cotizaciones = await this._cotizaciones.consulta_cotizaciones_new()
        // console.log(cotizaciones);
        const cotizaiones_filter = cotizaciones.filter(c=>c.cliente.id === cliente)
        cotizaiones_filter.map((c,index)=>{
          c['index'] = index + 1
        })
        if (!this.cotizaciones_Existentes.length) {
          this.cotizaciones_Existentes = cotizaiones_filter;
          // this.cargandoInformacion = false
        } else {
          this.cotizaciones_Existentes = this._publicos.actualizarArregloExistente(this.cotizaciones_Existentes,cotizaciones,[...this._cotizaciones.camposCotizaciones])
          // this.cargandoInformacion = false
        }
        // console.log(this._publicos.obtener_ticketPromedioFinal(this.cotizaciones_Existentes))
        // clonar.push(Object({name: ' '+String(data_vehiculo.placas).toUpperCase(), value: ocupado, contador, arreglo, servicios_totales: servicios}))
        // let clonar = []
        // clonar.push(Object({name: '', value:7}))
        // this.single = [...clonar]
        const aqui = this._publicos.obtener_ticketPromedioFinal(this.cotizaciones_Existentes)
        const tickets = this._publicos.obtenerValorMaximoMinimo(this.cotizaciones_Existentes)
        
        Object.keys(aqui).forEach(c=>{
          this.valores_promedios[c] = aqui[c]
        })
        Object.keys(tickets).forEach(c=>{
          const maxKeys = Object.keys(this.valores_tabla_maximos);
          const minKeys = Object.keys(this.valores_tabla_minimos);

          if (maxKeys.includes(c)) {
            this.valores_tabla_maximos[c] = c !== 'arreglo_maximo' ? tickets[c] : tickets[c].join(', ');
          }
          if (minKeys.includes(c)) {
            this.valores_tabla_minimos[c] = c !== 'arreglo_minimo' ? tickets[c] : tickets[c].join(', ');
          }
        })

        // console.table(this.valores_tabla_maximos)
        // console.table(this.valores_tabla_minimos)
        // console.table(this.valores_promedios)
        

        // this.cotizaciones_count[0].value_number = aqui.servicios_totales
        // this.cotizaciones_count[1].value_number = aqui.ticketGeneral
        // this.cotizaciones_count[2].value_number = aqui.ticketPromedio
        // this.cotizaciones_count[3].value_number = maximo
        // this.cotizaciones_count[4].value_string = no_maximo
        // this.cotizaciones_count[5].value_number = contadorMaximo
        // this.cotizaciones_count[6].value_string = arreglo_maximo.join(', ')
        // this.cotizaciones_count[7].value_number = minimo
        // this.cotizaciones_count[8].value_string = no_minimo
        // this.cotizaciones_count[9].value_number = contadorMinimo
        // this.cotizaciones_count[10].value_string = arreglo_minimo.join(', ')

        this.dataSource.data = this.cotizaciones_Existentes
        this.newPagination()
        
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }

}
