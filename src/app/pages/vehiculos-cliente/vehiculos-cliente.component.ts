import { Component, OnInit } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

@Component({
  selector: 'app-vehiculos-cliente',
  templateUrl: './vehiculos-cliente.component.html',
  styleUrls: ['./vehiculos-cliente.component.css']
})
export class VehiculosClienteComponent implements OnInit {

  constructor(private _publicos: ServiciosPublicosService, private _security: EncriptadoService) { }
  _sucursal:string
  _rol:string
  _uid:string

  objecto_actual:any ={}

  vehiculos_arr:any[] = []
  data_cliente:any ={} 
  ngOnInit(): void {
    this.rol()
  }
  rol(){

    const {rol, usuario, sucursal, uid} = this._security.usuarioRol()

    this._sucursal = sucursal
    this._rol = rol
    // if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
    if (uid) {
      this._uid = uid
      this.asiganacion_resultados()
      this.segundo_llamado()
    }
    const clientes = this._publicos.revision_cache('clientes')
    if (clientes[this._uid]) {
      this.data_cliente = clientes[this._uid]
    }
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
        this.asiganacion_resultados()
      }
    },1500)
  }
  asiganacion_resultados(){
    // const objecto_recuperdado = this._publicos.revision_cache('vehiculos')
    const { vehiculos_arr} = this._publicos.data_relacionada_id_cliente(this._uid)

    const campo_vehiculo = [
      'cliente',
      'placas',
      'vinChasis',
      'marca',
      'modelo',
      'categoria',
      'anio',
      'cilindros',
      'no_motor',
      'color',
      'engomado',
      'marcaMotor',
      'transmision',
    ]

    this.objecto_actual = this._publicos.revision_cache('vehiculos')
    this.vehiculos_arr = (!this.vehiculos_arr.length)  ? vehiculos_arr :
    this._publicos.actualizarArregloExistente(this.vehiculos_arr,vehiculos_arr,campo_vehiculo)

  }

   
  vehiculo_registrado(event){
    if (event) {
      this.asiganacion_resultados()
    }
 }

}
