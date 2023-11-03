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
  objecto_actual:any ={}
  ngOnInit(): void {
    this.roles()
    this.asignacion_resultados()
    this.segundo_llamado()
  }
  roles(){
    const { rol, sucursal } = this._security.usuarioRol()
    this._rol = rol
    this._sucursal = sucursal
  }
  comprobacion_resultados(){
    const objecto_recuperdado = this._publicos.revision_cache('vehiculos')
    return this._publicos.sonObjetosIgualesConJSON(this.objecto_actual, objecto_recuperdado);
  }
  segundo_llamado(){
    setInterval(()=>{
      if (!this.comprobacion_resultados()) {
        console.log('recuperando data');
        const objecto_recuperdado = this._publicos.revision_cache('vehiculos')
        this.objecto_actual = this._publicos.crear_new_object(objecto_recuperdado)
        this.asignacion_resultados()
      }
    },500)
  }
  asignacion_resultados(){
    this.objecto_actual = this._publicos.revision_cache('vehiculos')
    const data_recuperda_arr = this._publicos.crearArreglo2(this.objecto_actual)

    const campos = [
      'anio',
      'categoria',
      'cilindros',
      'color',
      'engomado',
      'marca',
      'marcaMotor',
      'modelo',
      'no_motor',
      'placas',
      'transmision',
      'vinChasis'
    ]

    setTimeout(() => {
      this.vehiculos_arr = this.vehiculos_arr.length ? this._publicos.actualizarArregloExistente(this.vehiculos_arr, data_recuperda_arr, campos) : data_recuperda_arr;
    }, 100);
    

  }
  vehiculoInfo(info:any){
    // console.log(info);
  }

}
