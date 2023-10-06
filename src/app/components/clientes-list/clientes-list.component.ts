import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { child, get, getDatabase, onValue, ref, set, update,push, onChildChanged } from "firebase/database"
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
  @Input() tituloshow :boolean = true

  _rol:string; _sucursal:string
  empresas_alls= {}
  clientes_arr:any =[]
  objecto_actual:any ={}
  ngOnInit(): void {
    this.rol()
    this.listaEmpresas()
    this.vigila()
    this.automaticos()
  }
  
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()
    
    this._rol = rol
    this._sucursal = sucursal
    
    this.primer_comprobacion_resultados()

  }
  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('clientes')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }
  primer_comprobacion_resultados(){
    this.asiganacion_resultados()
    this.segundo_llamado()
  }
  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.nueva_revision_cache('clientes')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asiganacion_resultados()
      }
    },1500)
  }
  
  asiganacion_resultados(){
    const objecto_recuperdado = this._publicos.nueva_revision_cache('clientes')
    const clientes_para_tabla = this._publicos.transformaDataCliente(objecto_recuperdado)
    const objetoFiltrado = this._publicos.filtrarObjetoPorPropiedad(clientes_para_tabla, 'sucursal', this._sucursal);
    const data_recuperda_arr = this._publicos.crearArreglo2(objetoFiltrado)

    const campos = [
      'apellidos',
      'correo_sec',
      'correo',
      'fullname',
      'no_cliente',
      'nombre',
      'sucursal',
      'sucursalShow',
      'telefono_movil',
      'tipo'
    ]
    this.objecto_actual = objecto_recuperdado

    this.clientes_arr = (!this.clientes_arr.length) 
    ? data_recuperda_arr
    :  this._publicos.actualizarArregloExistente(this.clientes_arr, data_recuperda_arr, campos )

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
      
      resultados = this.clientes_arr.filter(option => option['fullname'].toLowerCase().includes(filterValue));
      if (!resultados.length) {
        resultados = this.clientes_arr.filter(option => option['no_cliente'].toLowerCase().includes(filterValue));
      }
      if (!resultados.length) {
        let filtrados = this.clientes_arr.filter(c=>c.correo)
        resultados = filtrados.filter(option => option['correo'].toLowerCase().includes(filterValue));
      }
     
      data = resultados
    }
    return data
  }
  displayFn(user: any): any {
    return user && `${user['nombre']} ${user['apellidos']}` ? `${user['nombre']} ${user['apellidos']}` : '';
  }

}
