import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ServiciosService } from '../../services/servicios.service';
@Component({
  selector: 'app-servicios-cliente',
  templateUrl: './servicios-cliente.component.html',
  styleUrls: ['./servicios-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ServiciosClienteComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, private _clientes: ClientesService, private _sucursales: SucursalesService, private _vehiculos: VehiculosService, private _servicios: ServiciosService) { }

  rol_cliente:string = 'cliente'
  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

  miniColumnas:number = 100

  ///elementos de la tabla de vehiculos
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['id','no_os','searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  recepciones_clinete = []

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
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, async (snapshot) => {
      const servicios = await this._servicios.consulta_recepciones_new()
      // console.log(servicios);
      const servicios_filter = servicios.filter(s=>s.cliente.id === cliente)
      // console.log(servicios_filter);
      servicios_filter.forEach((s,index)=>{
        s['index'] = index + 1
      })

      //
      if (!this.recepciones_clinete.length) {
        this.recepciones_clinete = servicios_filter;
        // this.cargandoInformacion = false
      } else {
        this.recepciones_clinete = this._publicos.actualizarArregloExistente(this.recepciones_clinete,servicios_filter,[...this._servicios.campos_servicios_hard])
        // this.cargandoInformacion = false
      }
      this.dataSource.data = this.recepciones_clinete
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
