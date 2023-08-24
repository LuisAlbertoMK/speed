import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';


import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { AuthService } from 'src/app/services/auth.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-template-clientes-tabla',
  templateUrl: './template-clientes-tabla.component.html',
  styleUrls: ['./template-clientes-tabla.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class TemplateClientesTablaComponent implements OnInit, OnChanges {
  
  @Input() clientes_arr:any[] = []

  miniColumnas:number = 120

  _rol:  string
  _sucursal: string
  
  constructor(private router: Router, private _clientes: ClientesService, private _security:EncriptadoService,
    private _sucursales: SucursalesService, private _publicos: ServiciosPublicosService,
    private _auth: AuthService
    
    ) { }

  sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]

  displayedColumnsClientes: string[] = ['no_cliente','sucursalShow', 'fullname','tipo', 'correo','opciones']; //clientes
    // columnsToDisplayWithExpand = [...this.displayedColumnsClientes, 'expand'];
  columnsToDisplayWithExpand = [...this.displayedColumnsClientes];
  dataSourceClientes = new MatTableDataSource(); //clientes
  expandedElement: any | null; //clientes
  @ViewChild('clientesPaginator') paginatorClientes: MatPaginator //clientes
  @ViewChild('clientes') sortClientes: MatSort //clientes
  
  clickedRows = new Set<any>() //todas las tablas
  
  data_cliente= {}

  filtro_tipo:string = 'todos'
  filtro_sucursal:string = 'Todas'

  tipos_cliente     =  [ ...this._clientes.tipos_cliente ]

  ngOnInit(): void {
    this.rol()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clientes_arr']) {
      const nuevoValor = changes['clientes_arr'].currentValue;
      const valorAnterior = changes['clientes_arr'].previousValue;
      // console.log({nuevoValor, valorAnterior});
        this.dataSourceClientes.data = this.clientes_arr
        this.newPagination()
    }
  }
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal
    
  }
  newPagination(){
    // setTimeout(() => {
      this.dataSourceClientes.paginator = this.paginatorClientes;
      this.dataSourceClientes.sort = this.sortClientes;
    // }, 500);
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
    
    this.newPagination()

  }
  clientesInfo(info:any){   
    // console.log(info);
    
  }
  vehiculoInfo(info:any){
    // console.log(info);
  }

  async registra_usuario_new(data){

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
      const updates = { [`usuarios/${data.id}`]: dataSave, [`clientes/${data.sucursal}/${data.id}/usuario`]:true };
       console.log(updates);
       const { respuesta } = await this._publicos.mensaje_pregunta(`Registro usuario`,true,`Registrar usuario con acceso a la plataforma`)

       if (!respuesta) return


        this._auth.nuevoUsuario(otra).subscribe((token:any)=>{
          if (token) {
            // console.log(token);
            updates[`clientes/${data.sucursal}/${data.id}/localId`] = token.localId
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

    // console.log(data);
    // const { respuesta } = await this._publicos.mensaje_pregunta(`Registro usuario`,true,`Registrar usuario con acceso a la plataforma`)
    // // const respuesta = this._publicos.mensaje_pregunta('mensaje',true,`Registrar usuario con acceso a la plataforma`)
    // console.log(respuesta);
    // if (!respuesta) return

    
    
  }

}
