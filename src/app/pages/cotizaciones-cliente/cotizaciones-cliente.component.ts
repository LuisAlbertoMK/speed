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

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, private _clientes: ClientesService, private _sucursales: SucursalesService, private _cotizaciones: CotizacionesService) { }
  rol_cliente:string = 'cliente'

  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'


  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','no_cotizacion','searchName','searchPlacas']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos



  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
    {valor:'sobrescrito', show:'sobrescrito'},
    {valor:'descuento', show:'descuento'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'iva', show:'iva'},
    {valor:'total', show:'total'},
    {valor:'meses', show:'meses'},
  ]
  camposCliente=[
    {valor: 'no_cliente', show:'# Cliente'},
    {valor: 'nombre', show:'Nombre'},
    {valor: 'apellidos', show:'Apellidos'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'},
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    {valor: 'sucursal', show:'Sucursal'}
  ]
  camposVehiculo=[
    {valor: 'placas', show:'Placas'},
    {valor: 'marca', show:'marca'},
    {valor: 'modelo', show:'modelo'},
    {valor: 'anio', show:'añio'},
    {valor: 'categoria', show:'categoria'},
    {valor: 'cilindros', show:'cilindros'},
    {valor: 'engomado', show:'engomado'},
    {valor: 'color', show:'color'},
    {valor: 'transmision', show:'transmision'},
    {valor: 'no_motor', show:'No. Motor'},
    {valor: 'vinChasis', show:'vinChasis'},
    {valor: 'marcaMotor', show:'marcaMotor'}
  ]
  formasPago=[
    {id:'1',pago:'contado',interes:0,numero:0},
    {id:'2',pago:'3 meses',interes:4.49,numero:3},
    {id:'3',pago:'6 meses',interes:6.99,numero:6},
    {id:'4',pago:'9 meses',interes:9.90,numero:9},
    {id:'5',pago:'12 meses',interes:11.95,numero:12},
    {id:'6',pago:'18 meses',interes:17.70,numero:18},
    {id:'7',pago:'24 meses',interes:24.,numero:24}
  ]

  cotizaciones_Existentes = []

  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    const rol = this._security.servicioDecrypt(variableX['rol'])
    const ID_cliente = this._security.servicioDecrypt(variableX['usuario'])
    if (rol === this.rol_cliente && ID_cliente) this.obtenerInformacion_cliente(ID_cliente) 
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
