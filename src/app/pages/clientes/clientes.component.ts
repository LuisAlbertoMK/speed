import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import Swal from 'sweetalert2';


const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {nombre: string}
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ClientesComponent implements AfterViewInit, OnInit {
  miniColumnas:number = 100
  
  displayedColumnsClientes: string[] = ['no_cliente', 'fullname','tipo', 'correo','opciones']; //clientes
  columnsToDisplayWithExpand = [...this.displayedColumnsClientes, 'expand'];
  dataSourceClientes = new MatTableDataSource(); //clientes
  expandedElement: any | null; //clientes
  @ViewChild('clientesPaginator') paginatorClientes: MatPaginator //clientes
  @ViewChild('clientes') sortClientes: MatSort //clientes

  clickedRows = new Set<any>() //todas las tablas


  //verificar si existe informacion de cliente
  datCliente:any
  cliente:string = null

  vehiculo:string = null

  ROL:String
  SUCURSAL:string

  clientes_arr=[]
  constructor(private _publicos:ServiciosPublicosService, private _security:EncriptadoService){}

  ngOnInit() {
    this.rol()
    this.ListadoClientes()
  }
  ngAfterViewInit(): void {  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
  }

  ListadoClientes(){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {  
        const clientes = this._publicos.crearArreglo2(snapshot.val())
        clientes.map(c=>{
          c['fullname'] = `${c.nombre} ${c.apellidos}`
          const vehiculos = (c['vehiculos']) ? this._publicos.crearArreglo2(c['vehiculos']) : []
          c.vehiculos = vehiculos
        })
        this.clientes_arr = clientes
        // console.log(clientes);
        
        
        this.newPagination('clientes')
      }else{
        this.dataSourceClientes.data = []
        this.newPagination('clientes')
      } 
    })
  }
  

  cargaDataCliente(cliente:any){
    this.datCliente = null
    // this.vehiculo = null
    if (cliente) {
      setTimeout(() => {
        this.datCliente = cliente
      } , 200);
    }
  }
  clientesInfo(info:any){
    if (info['registro']) {
      this._publicos.mensajeCorrecto('registro de cliente correcto')
    }else if(info['actualizacion']){
      this._publicos.mensajeCorrecto('actualizacion de cliente correcto')
    }
  }
  vehiculoInfo(info:any){
    if (info['registro']) {
      this._publicos.mensajeCorrecto('Accion correcra')
    }else{
      this._publicos.mensajeIncorrecto('Accion no realizada')
    }
  }
  cargaDataVehiculo(data:any,quien:string){
    // console.log(data);
    this.cliente = null
    this.vehiculo = null
    if (quien === 'cliente') {
      
      // console.log('id de cliente');
      if (data['id']) {
        setTimeout(() => {
          this.cliente = data['id']
        } , 300);
      }
    }
    if (quien === 'vehiculo') {
      
      // console.log('id de vehiculo');
      if (data['id']) {
        setTimeout(() => {
         
          // Swal.fire('','','info')
          this._publicos.mensajeOK('Se cargo la información',2000)
          // Swal.isLoading()
          this.vehiculo = data
          // Swal.close()
        } , 300);
      }
    }
    
  }
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceClientes.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceClientes.paginator) {
      this.dataSourceClientes.paginator.firstPage();
    }
  }
  newPagination(data:string){
    setTimeout(() => {
    if (data==='clientes') {
      this.dataSourceClientes.data = this.clientes_arr
      this.dataSourceClientes.paginator = this.paginatorClientes;
      this.dataSourceClientes.sort = this.sortClientes
    }
    }, 300)
  }

}


