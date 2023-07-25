import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';


import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onValue, push, ref, set, update } from "firebase/database";
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CamposSystemService } from 'src/app/services/campos-system.service';


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
  constructor(private _publicos:ServiciosPublicosService, private _security:EncriptadoService, private _sucursales: SucursalesService,
    private _clientes: ClientesService, private router: Router, private _auth: AuthService,private _campos: CamposSystemService,){}
    ROL:string; SUCURSAL:string;
  
    sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]
    tipos_cliente     =  [ ...this._clientes.tipos_cliente ]
    
    miniColumnas:number =  this._campos.miniColumnas
    
    cargandoInformacion:boolean = true
    
    clientes_arr=[]

    displayedColumnsClientes: string[] = ['no_cliente','sucursalShow', 'fullname','tipo', 'correo','opciones']; //clientes
    // columnsToDisplayWithExpand = [...this.displayedColumnsClientes, 'expand'];
    columnsToDisplayWithExpand = [...this.displayedColumnsClientes];
    dataSourceClientes = new MatTableDataSource(); //clientes
    expandedElement: any | null; //clientes
    @ViewChild('clientesPaginator') paginatorClientes: MatPaginator //clientes
    @ViewChild('clientes') sortClientes: MatSort //clientes
  
    clickedRows = new Set<any>() //todas las tablas

    //verificar si existe informacion de cliente
    datCliente:any
    // cliente:string = null
    // vehiculo:string = null


    data_cliente= {}
  ngOnInit() {
    this.rol()
  }
  ngAfterViewInit(): void {  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    
    this.ListadoClientes()
  }
  irPagina(pagina, cliente){
    // /:ID/:tipo/:extra
    // console.log(cliente);
    const { id, sucursal } = cliente
    
    let queryParams = {}
    if (pagina === 'historial-cliente') {
      queryParams = { anterior:'clientes',  } 
    } else if (pagina === 'cotizacionNueva') {
      queryParams = { anterior:'clientes', cliente: id, sucursal, tipo: 'cliente'  } 
    } else if (pagina === 'ServiciosConfirmar') {
      queryParams = { anterior:'clientes',  tipo: 'nueva' } 
    }

    // console.log(queryParams);
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }

  ListadoClientes(){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        // console.time('Execution Time');
        const busqueda = (this.SUCURSAL === 'Todas') ? 'clientes' : `clientes/${this.SUCURSAL}`
        const clientes = await this._clientes.consulta_clientes__busqueda(busqueda, this.SUCURSAL)
        const camposRecu = [...this._clientes.camposCliente,'fullname']
        const nueva  = (!this.clientes_arr.length) ?  clientes :  this._publicos. actualizarArregloExistente(this.clientes_arr, clientes,camposRecu);
        this.clientes_arr = nueva
        this.dataSourceClientes.data = nueva
        this.newPagination('clientes')
        // console.timeEnd('Execution Time');
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
    // this.myModal.nativeElement.classList.remove('show');
    // this.myModal.nativeElement.classList.add('hide');

    
    
    
    const {cliente, status} = info
    if(!info.CerrarModal){
      if (status) {
        const closeButton = document.querySelector('[data-bs-dismiss="modal"]');
        if (closeButton) {
          closeButton.dispatchEvent(new Event('click'));
        }
        this._publicos.mensajeCorrecto('registro de cliente correcto',1)
      }else{
        this._publicos.mensajeSwal('Ocurrio un error', 0)
      }
    }else{

    }
    
  }
  vehiculoInfo(info:any){
    if (info) {
      this._publicos.mensajeCorrecto('Accion correcra',1)
    }else{
      this._publicos.mensajeCorrecto('Accion no realizada', 0)
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
  registraUsuario(data){
    if (data.correo) {
      const dataSave = {
        rol: 'cliente',
        status: true,
        correo: data.correo,
        password: this._publicos.generarCadenaAleatoria() || `${data.nombre}Xd1*(`,
        sucursal: data.sucursal,
        usuario: data.nombre
      }
      const otra = { email: data.correo, password: dataSave.password, nombre: data.nombre }
      const updates = { [`usuarios/${data.id}`]: dataSave, [`clientes/${data.id}/usuario`]:true };
       console.log(updates);
        this._auth.nuevoUsuario(otra).subscribe((token)=>{
          if (token) {
            update(ref(db), updates)
              .then(a=>{
                this._publicos.swalToast('Se registro usuario', 1)
              })
              .catch(err=>{
                this._publicos.swalToast('Error al registrar usuario', 0)
              })
          }else{
            this._publicos.swalToast('Error al generar token', 0)
          }
        })
    }else{
      this._publicos.swalToast('El cliente no tiene correo',0)
    }
  }

}


