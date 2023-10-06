import { Component, OnInit } from '@angular/core';
import { getDatabase, onChildChanged, onValue, ref } from 'firebase/database';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';


const db = getDatabase()
const dbRef = ref(getDatabase());


@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  constructor(private _publicos: ServiciosPublicosService, private _security:EncriptadoService) { }

  vehiculos_arr:any[]=[]
  _rol:string
  _sucursal:string
  ngOnInit(): void {
    this.roles()
    
  }
  roles(){
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal

    this.vigila_hijo()
  }
  async lista_vehiculos(){
    console.time('Execution Time');
    const clientes = await this._publicos.revisar_cache2('clientes')
    const vehiculos = await this._publicos.revisar_cache2('vehiculos')
    
    console.log(clientes)
    console.log(vehiculos)
       
    
    const nuevos_vehiculos = this._publicos.transformaDataVehiculo({clientes, vehiculos: this._publicos.crearArreglo2(vehiculos)})
    setTimeout(() => {
      this.vehiculos_arr = nuevos_vehiculos
    }, 1000);
    console.timeEnd('Execution Time');
  }
  
  async vigila_hijo(){
    this.lista_vehiculos()
    const commentsRef = ref(db, `vehiculos`);
      onChildChanged(commentsRef, (data) => {
        setTimeout(() => {
          this.lista_vehiculos()
        }, 500);
      })
  }

}
