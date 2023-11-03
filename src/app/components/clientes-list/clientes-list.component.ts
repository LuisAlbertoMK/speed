import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges} from '@angular/core';

import { child, get, getDatabase, onValue, ref, set, update,push, onChildChanged } from "firebase/database"
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
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
  // sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]
  
  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  // listaClientes_arr = []
  
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
    this.automaticos()
  }

  
  rol(){
    
    const { rol, sucursal } = this._security.usuarioRol()
    
    this._rol = rol
    this._sucursal = sucursal
    
    this.asignacion_resultados()
    this.segundo_llamado()
  }
  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.revision_cache('clientes')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }

  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.revision_cache('clientes')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asignacion_resultados()
      }
    },500)
  }
  
  asignacion_resultados(){
    this.objecto_actual = this._publicos.revision_cache('clientes')
    const clientes_para_tabla = this._publicos.transformaDataCliente(this.objecto_actual)
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

      this.clientes_arr = this.clientes_arr.length ? this._publicos.actualizarArregloExistente(this.clientes_arr, data_recuperda_arr, campos) : data_recuperda_arr;
  }
 
  async listaEmpresas(){
    this.empresas_alls = []
  }

  automaticos(){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    )
  }
  private _filter(value: string): string[] {
    let resultados = []
    if (value['nombre']) {
      this.dataCliente.emit( value )
    }else{
      const filterValue = value.toLowerCase();
      const resultadosPorNombre = this.clientes_arr.filter(option => option['fullname'].toLowerCase().includes(filterValue));
      resultados.push(...resultadosPorNombre);
    
      // Si no se encontraron resultados por 'fullname', intentar filtrar por 'no_cliente'
      if (resultadosPorNombre.length === 0) {
        const resultadosPorNoCliente = this.clientes_arr.filter(option => option['no_cliente'].toLowerCase().includes(filterValue));
        resultados.push(...resultadosPorNoCliente);
      }
    
      // Si aún no se encontraron resultados, filtrar por 'correo'
      if (resultados.length === 0) {
        const filtrados = this.clientes_arr.filter(c => c.correo);
        const resultadosPorCorreo = filtrados.filter(option => option['correo'].toLowerCase().includes(filterValue));
        resultados.push(...resultadosPorCorreo);
      }
    }
    return resultados
  }
  displayFn(user: any): any {
    return user && `${user['nombre']} ${user['apellidos']}` ? `${user['nombre']} ${user['apellidos']}` : '';
  }

}
