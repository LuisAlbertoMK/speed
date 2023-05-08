import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { EncriptadoService } from 'src/app/services/encriptado.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.component.html',
  styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {

  myControl = new FormControl('');
  filteredOptions: Observable<string[]>;
  listaClientes_arr = []
  
  @Output() dataCliente : EventEmitter<any>
  @Input() sucursal :string

  ROL:string; SUCURSAL:string
  listaSucursales_arr= []
  constructor(private _publicos: ServiciosPublicosService, private _security:EncriptadoService) {
    this.dataCliente = new EventEmitter()
  }

  ngOnInit(): void {
    this.rol()
    // this.listarClientes()
    this.listaSucursales()
    this.automaticos()
  }
  listaSucursales(){
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.listaSucursales_arr = this._publicos.crearArreglo2(snapshot.val())
        this.listarClientes()
      }
    }, {
        onlyOnce: true
      })
	
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal']);
  }
  listarClientes(){
    const starCountRef = ref(db, `clientes`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const clientes= this._publicos.crearArreglo2(snapshot.val())
        clientes.map(cliente=>{
          if (cliente['vehiculos']) cliente['vehiculos'] = this._publicos.crearArreglo2(cliente['vehiculos'])
          if (!cliente.correo) cliente.correo = ''
          const {sucursal} = this.listaSucursales_arr.find(s=>s.id === cliente.sucursal)
          cliente.showSucursal = sucursal
          if (cliente.dataFacturacion){
            cliente.dataFacturacion = cliente.dataFacturacion['unica']
          }
        })
        this.listaClientes_arr = (this.SUCURSAL === 'Todas') ? clientes : clientes.filter(c=>c.sucursal === this.SUCURSAL)
      }
    })
  }

  clienteSeleccionado(data){
    if (data.id) {
      this.dataCliente.emit( data )
    }else{
      this.dataCliente.emit( {error:true} )
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
        resultados = this.listaClientes_arr.filter(option => option['correo'].toLowerCase().includes(filterValue));
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
