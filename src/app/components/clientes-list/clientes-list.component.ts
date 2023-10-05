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

  clientes_arr=[]

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

    this.vigila_hijo()

  }
  async vigila_hijo(){
    this.lista_clientes()
    // this.simular_observacion_informacion_firebase_nombre({ruta_observacion: 'clientes', nombre:'claves_clientes'})
  }
  async simular_observacion_informacion_firebase_nombre(data){
    const {ruta_observacion, nombre} = data
    console.log({ruta_observacion, nombre});
    
    const claves_nombre:any[] = await this._publicos.revisar_cache(nombre)

    console.log(claves_nombre);
    
    const resultados = await this._publicos.revisar_cache2(ruta_observacion)

    console.log(resultados);
    
    claves_nombre.forEach(clave => {
      const commentsRef = ref(db, `${ruta_observacion}/${clave}`);
      // console.log(`${ruta_observacion}/${clave}`);
      
      onChildChanged(commentsRef, (data) => {
        const key = data.key
        const valor =  data.val()
        console.log(key);
        // console.log(resultados[clave]);
        
        // resultados[clave][key] = valor
        if (resultados[clave]) {
          // console.log(resultados[clave]);
          const nueva_data = this._publicos.crear_new_object(resultados[clave])
            nueva_data[key] = valor
            resultados[clave] = nueva_data
            // console.log(clave);
            console.log(nueva_data);
            this._security.guarda_informacion({nombre: ruta_observacion, data: resultados})
        }
        
        
        
      });
    });

    
  }
  async lista_clientes(){
    // console.log('revisando cambios');

    const clientes = await this._publicos.revisar_cache2('clientes')
    
    const clientes_arr = this._publicos.crearArreglo2(clientes)


    const clientes_trasnform = this._publicos.transformaDataCliente(clientes_arr)
    
    const ordenar = (this._sucursal === 'Todas') ? clientes_trasnform : this._publicos.filtra_campo(clientes_trasnform,'sucursal',this._sucursal)

    
    this.listaClientes_arr = this._publicos.ordenamiento_fechas_x_campo(ordenar,'id',true)

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
      resultados = this.listaClientes_arr.filter(option => option['fullname'].toLowerCase().includes(filterValue));
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

}
