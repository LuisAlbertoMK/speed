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

  ngOnInit(): void {
    this.rol()
    this.listaEmpresas()
    this.automaticos()
  }

  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal
  }
  async listaEmpresas(){
    const empresas = await this._clientes.consulta_empresas_new()
    this.empresas_alls = empresas
    this.listarClientes()
  }
  listarClientes(){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
      this._clientes.consulta_clientes_new().then((clientes)=>{
        clientes.map(c=>{
          c.showSucursal  = this.sucursales_array.find(s=>s.id === c.sucursal).sucursal
          if(c.empresa) {
            const {empresa: em} = this.empresas_alls[c.sucursal][c.empresa]
            c.empresaShow  = em
          }
        })
        // console.log('aqui desde la lista de clientes');
        
        this.listaClientes_arr = (this.SUCURSAL === 'Todas') ? clientes : clientes.filter(c=>c.sucursal === this.SUCURSAL)
      })
    })
  }

  clienteSeleccionado(data){
    if (data.id) {
      this.dataCliente.emit( Object({cliente: data, status: true}) )
    }else{
      this.dataCliente.emit( Object({status: false}))
    }
  }
  clientesInfo(infoCliente){
    if (infoCliente.registro) {
      this.dataCliente.emit( infoCliente.cliente )
    }else{
      this.dataCliente.emit( {error:true} )
    }    
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
      // const nuevos = this.lista_arr_mo.concat(this.lista_arr_refacciones)
      // const ordenado = this._publicos.ordernarPorCampo(nuevos,'nombre')
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
    // return info && `${info['nombre']}` ? `${info['nombre']}` : '';

    return user && `${user['nombre']} ${user['apellidos']}` ? `${user['nombre']} ${user['apellidos']}` : '';
  }

}
