import { Component, OnInit } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';

@Component({
  selector: 'app-eliminar-empresa',
  templateUrl: './eliminar-empresa.component.html',
  styleUrls: ['./eliminar-empresa.component.css']
})
export class EliminarEmpresaComponent implements OnInit {
  
  constructor(private _security:EncriptadoService) { }

  _rol:string; _sucursal:string


  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this._rol = rol
    this._sucursal = sucursal
  }

}
