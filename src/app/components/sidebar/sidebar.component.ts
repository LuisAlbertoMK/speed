import { Component, OnInit } from '@angular/core';

import { getDatabase, onValue, ref, set } from "firebase/database"
import { EncriptadoService } from 'src/app/services/encriptado.service';
import Swal from 'sweetalert2';
const db = getDatabase()
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  ocultar:boolean= false
  ROL:string = ''
  SUCURSAL:string=''
  TIPO_USUARIO:string=''
  nombreSucursalMuestra:string =''
  mostrarAdministracion:boolean = false
  constructor(private _security:EncriptadoService) { }

  ngOnInit(): void {
    this.rol()
    this.NombreSucursal()
  }
  ocultarBarra(barraSH:boolean){
  this.ocultar=!barraSH
  }
  
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    this.TIPO_USUARIO = this._security.servicioDecrypt(variableX['alias'])
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    // this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    if (this.ROL==='SuperSU') {
      this.mostrarAdministracion = true
    }
  }
  NombreSucursal(){
    if (this.SUCURSAL!=='Todas') {
      const starCountRef = ref(db, 'sucursales')
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val()
        let temp = this.crearArreglo2(data)
        temp.forEach(sucursal => {
          if (sucursal.id === this.SUCURSAL) {
            this.nombreSucursalMuestra = sucursal.sucursal
          }
        });
      })
    }
  }
  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
      const arraypush: any = arrayObj[key]
      arraypush.id=key
      arrayGet.push(arraypush)
    })
    return arrayGet
  }
}
