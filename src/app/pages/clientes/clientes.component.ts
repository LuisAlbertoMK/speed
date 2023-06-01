import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';


import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import Swal from 'sweetalert2';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';


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
  
  displayedColumnsClientes: string[] = ['no_cliente','sucursalShow', 'fullname','tipo', 'correo','opciones']; //clientes
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
  sucursales_arr=[]

  cargandoInformacion:boolean = true

  tipos_cliente= ['todos','flotilla','particular']
  constructor(private _publicos:ServiciosPublicosService, private _security:EncriptadoService, private _sucursales: SucursalesService,
    private _clientes: ClientesService, private router: Router){}

  ngOnInit() {
    this.rol()
    
  }
  ngAfterViewInit(): void {  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this._sucursales.consultaSucursales_new().then((sucursales) => {
      this.sucursales_arr = sucursales
      this.ListadoClientes()
    }).catch((error) => {
      // Manejar el error si ocurre
    });
  }
  irPagina(pagina, cliente, vehiculo?, cotizacion?){
    // /:ID/:tipo/:extra
    let params = {}
    if (pagina === 'historial-cliente') {
      params = { anterior:'clientes', cliente  } 
    } else if (pagina === 'cotizacionNueva') {
      params = { anterior:'clientes', cliente, tipo: 'cliente', vehiculo, cotizacion  } 
    } else if (pagina === 'ServiciosConfirmar') {
      params = { anterior:'clientes', cliente, tipo: 'nueva', vehiculo } 
    }
    this.router.navigate([`/${pagina}`], { 
      queryParams: params
    });
  }

  ListadoClientes(){
    this.cargandoInformacion = true
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, () => {
      this._clientes.consulta_clientes_new().then((clientes) => {
        const clientes_new = clientes
        clientes_new.map(c=>{
          c.sucursalShow = this.sucursales_arr.find(s=>s.id === c.sucursal).sucursal
        })
        const info = (this.SUCURSAL !=='Todas') ? clientes_new.filter(c=>c.sucursal === this.SUCURSAL) : clientes_new
        const camposRecu = [...this._publicos.camposCliente(),'vehiculos','fullname']
        let aqui = []
        if (!this.clientes_arr.length) {
          aqui = info;
        } else {
          aqui = this._publicos. actualizarArregloExistente(this.clientes_arr, info,camposRecu);
        }
        this.clientes_arr = aqui
        this.dataSourceClientes.data = aqui
        this.newPagination('clientes')
      }).catch((error) => {
        // Manejar el error si ocurre
        console.log(error);      
      });
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
    if (info) {
      this._publicos.mensajeCorrecto('Accion correcra')
    }else{
      this._publicos.mensajeIncorrecto('Accion no realizada')
    }
  }
 
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceClientes.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceClientes.paginator) {
      this.dataSourceClientes.paginator.firstPage();
    }
  }
  filtra_tipo_cliente(tipo:string){
    this.dataSourceClientes.data = (tipo === 'todos') ? this.clientes_arr : this.clientes_arr.filter(c=>c.tipo === tipo)
    this.newPagination('clientes')
  }
  newPagination(data:string){
    this.cargandoInformacion = false
    setTimeout(() => {
    if (data==='clientes') {
      this.dataSourceClientes.paginator = this.paginatorClientes;
      this.dataSourceClientes.sort = this.sortClientes
    }
    }, 100)
  }

}


