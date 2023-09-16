import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';


const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {

  

  constructor(private _publicos: ServiciosPublicosService, private _security:EncriptadoService, private _clientes: ClientesService,
    private _sucursales: SucursalesService) {
    this.dataCliente = new EventEmitter()
  }
  sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]
  
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  listaClientes_arr = []
  
  @Output() dataCliente : EventEmitter<any>
  @Input() sucursal :string

  ROL:string; SUCURSAL:string
  empresas_alls= {}

  clientes_arr=[]

  ngOnInit(): void {
    this.rol()
    this.listarClientes()
    this.listaEmpresas()
    this.vigila()
    this.obtenerListaClientes()
    this.automaticos()
  }

  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
  }
  vigila(){
    this.myControl.valueChanges.subscribe(cliente=>{
      if (cliente instanceof Object) {
        this.dataCliente.emit( cliente ) 
      }
    })
  }
  async listaEmpresas(){
    const empresas = await this._clientes.consulta_empresas_new()
    this.empresas_alls = empresas
    
  }
  async listarClientes(){
    // const busqueda = (this.SUCURSAL === 'Todas') ? 'clientes' : `clientes/${this.SUCURSAL}`
    // const clientes = await this._clientes.consulta_clientes_new(busqueda,this.SUCURSAL)
    // this.listaClientes_arr = clientes

    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {

        const todas = this._publicos.crearArreglo2(snapshot.val())

        if (this.SUCURSAL === 'Todas') {
          this.listaClientes_arr = todas
        }else{
          this.listaClientes_arr = todas.filter(cliente => cliente.sucursal === this.SUCURSAL)
        }

      } else {
        console.log("No data available");
      }
    })
  }


  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }
  private _filter(value: string): string[] {
    let data = []
    if (value['nombre']) {
      
    }else{
      const filterValue = value.toLowerCase();
      let resultados = []
      resultados = this.listaClientes_arr.filter(option => option['nombre'].toLowerCase().includes(filterValue));
      if (!resultados.length) {
        let filtrados = this.listaClientes_arr.filter(c=>c.correo)
        resultados = filtrados.filter(option => option['correo'].toLowerCase().includes(filterValue));
      }
      data = resultados
    }
    return data
  }
  displayFn(user: any): any {
    return user && `${user['nombre']} ${user['apellidos']}` ? `${user['nombre']} ${user['apellidos']}` : '';
  }

  //TODO
  async obtenerListaClientes() {

    // const starCountRef = ref(db, `clientes`)
    // onValue(starCountRef, async (snapshot) => {
    //   if (snapshot.exists()) {
    //     const arreglo_sucursal = (this.SUCURSAL === 'Todas') ? this.sucursales_array.map(s => s.id) : [this.SUCURSAL];
    //     const arreglo_rutas_clientes = this.crea_lista_rutas_por_sucursal({ arreglo_sucursal });
    
    //     const finales_clientes = await this.obtenerClientesDeRutas(arreglo_rutas_clientes);
  
    //     // console.log(finales_clientes);
    //     const campos_cliente = [
    //       'apellidos',
    //       'correo',
    //       'id',
    //       'no_cliente',
    //       'nombre',
    //       'sucursal',
    //       'telefono_movil',
    //       'tipo',
    //       'sucursalShow',
    //       'fullname',
    //     ]
  
  
    //     this.clientes_arr  = (!this.clientes_arr.length) 
    //     ?  finales_clientes 
    //     :  this._publicos.actualizarArregloExistente(this.clientes_arr, finales_clientes,campos_cliente);
      
    //   } 
    // })    
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
}
