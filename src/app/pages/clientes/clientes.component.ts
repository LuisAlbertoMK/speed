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
    filtro_tipo:string = 'todos'
    filtro_sucursal:string = 'Todas'

    data_cliente= {}
  ngOnInit() {
    this.rol()
  }
  ngAfterViewInit(): void {  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
    this.obtenerListaClientes()
  }
  irPagina(pagina, cliente){
    // /:ID/:tipo/:extra
    // console.log(cliente);
    const { id, sucursal, tipo } = cliente
    
    let queryParams = {}
    if (pagina === 'historial-cliente') {
      queryParams = { anterior:'clientes', sucursal, cliente: id  } 
    } else if (pagina === 'cotizacionNueva') {
      queryParams = { anterior:'clientes', cliente: id, sucursal, tipo: 'cliente'  } 
    } else if (pagina === 'ServiciosConfirmar') {
      queryParams = { anterior:'clientes',  tipo:'cliente', cliente: id, sucursal, vehiculo:'' } 
    }

    // console.log(queryParams);
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  transformaDataCliente(data){
    const nuevos = [...data]
    const retornados = nuevos.map(cli=>{
      const {sucursal, nombre, apellidos } = cli
      cli.sucursalShow = this.sucursales_array.find(s=>s.id === sucursal).sucursal
      cli.fullname = `${String(nombre).toLowerCase()} ${String(apellidos).toLowerCase()}`
      return cli
    })
    return retornados
  }

  async obtenerClientesDeRutas(rutas) {
    const promesasClientes = rutas.map(async (ruta) => {
      const clientes = await this._clientes.consulta_clientes__busqueda({ ruta });
      return this.transformaDataCliente(clientes);
    });
  
    const promesasResueltasClientes = await Promise.all(promesasClientes);
    return promesasResueltasClientes.flat();
  }
  crea_lista_rutas_por_sucursal(data){
    const {arreglo_sucursal, } = data
    let Rutas_retorna = []
    arreglo_sucursal.forEach(sucursal=>{
      Rutas_retorna.push(`clientes/${sucursal}`)
    })
    return Rutas_retorna
  }
  async obtenerListaClientes() {

    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, async (snapshot) => {
      if (snapshot.exists()) {
        const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s => s.id) : [this.SUCURSAL];
        const arreglo_rutas_clientes = this.crea_lista_rutas_por_sucursal({ arreglo_sucursal });
    
        const finales_clientes = await this.obtenerClientesDeRutas(arreglo_rutas_clientes);
  
        // console.log(finales_clientes);
        const campos_cliente = [
          'apellidos',
          'correo',
          'id',
          'no_cliente',
          'nombre',
          'sucursal',
          'telefono_movil',
          'tipo',
          'sucursalShow',
          'fullname',
          'usuario',
          'localId'
        ]
  
  
        this.clientes_arr  = (!this.clientes_arr.length) 
        ?  finales_clientes 
        :  this._publicos.actualizarArregloExistente(this.clientes_arr, finales_clientes,campos_cliente);
  
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
    // console.log(info);
    
  }
  vehiculoInfo(info:any){
    // console.log(info);
  }
 
 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceClientes.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceClientes.paginator) {
      this.dataSourceClientes.paginator.firstPage();
    }
  }
  filtra_informacion(){
    
    let resultados_1 = (this.filtro_tipo === 'todos') ? this.clientes_arr : this.clientes_arr.filter(c=>c.tipo === this.filtro_tipo)
    this.dataSourceClientes.data = (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)

  }
  // filtra_sucursal(sucursal:string){   
  //   // console.log(this.filtra_tipo_cliente);
  //   // console.log(this.filtra_tipo_cliente);
  //   // this.dataSourceClientes.data = (sucursal === 'Todas') ? this.clientes_arr : this.clientes_arr.filter(c=>c.sucursal === sucursal)
  //   // this.newPagination('clientes')

  //   let resultados_1 = (this.filtro_tipo === 'todos') ? this.clientes_arr : this.clientes_arr.filter(c=>c.tipo === this.filtro_tipo)
  //   this.dataSourceClientes.data = (this.filtro_sucursal === 'Todas') ? resultados_1 : resultados_1.filter(c=>c.sucursal === this.filtro_sucursal)
  // }
  
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


