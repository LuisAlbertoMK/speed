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


@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MiperfilComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, private _clientes: ClientesService, private _sucursales: SucursalesService, private _vehiculos: VehiculosService) { }
  rol_cliente:string = 'cliente'
  info_cliente = {}
  info_cliente_editar = {}
  camposCliente_show = [...this._clientes.camposCliente_show,
  {valor:'sucursalShow', show:'Sucursal'}]
  sucursales_arr = [...this._sucursales.lista_en_duro_sucursales]

  misVehiculos = []

  ///elementos de la tabla de vehiculos
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['index','placas','marca','modelo','anio','categoria','engomado','color','cilindros']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  editar:boolean = false

  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    const rol = this._security.servicioDecrypt(variableX['rol'])
    const ID_cliente = this._security.servicioDecrypt(variableX['usuario'])
    if (rol === this.rol_cliente && ID_cliente) this.obtenerInformacion_cliente(ID_cliente) 
  }
  obtenerInformacion_cliente(id:string){
    const starCountRef = ref(db, `clientes/${id}`)
    onValue(starCountRef, async (snapshot) => {
      const cliente:any = await this._clientes.consulta_cliente_new(id)
      const {vehiculos} = cliente
        cliente['sucursalShow'] = this.sucursales_arr.find(s=>s.id === cliente.sucursal).sucursal
        this.info_cliente = cliente
        vehiculos.map((v, index)=>{
          v['index'] = index +1
        })

        if (!this.misVehiculos.length) {
          this.misVehiculos = vehiculos;
          // this.cargandoInformacion = false
        } else {
          this.misVehiculos = this._publicos.actualizarArregloExistente(this.misVehiculos,vehiculos,[...this._vehiculos.camposVehiculo])
          // this.cargandoInformacion = false
        }    
        this.dataSource.data = this.misVehiculos
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
  clientesInfo(info:any){
    const {cliente, status} = info
    if(!info.CerrarModal){
      if (status) {
        this._publicos.mensajeCorrecto('registro de cliente correcto')
        this.editar = false
      }else{
        this._publicos.mensajeSwalError('Ocurrio un error')
      }
    }else{
      this.editar = false
    }
    
  }
}
