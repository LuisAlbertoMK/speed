import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js'; 

@Injectable({
  providedIn: 'root'
})
export class EncriptadoService {
  cadenaEncriptamiento:string =  'SpeedProSecureCondifidential';  


  constructor() { }

  servicioEncriptado(cadena:string){
    const encriptado:string =  CryptoJS.AES.encrypt(cadena.trim(), this.cadenaEncriptamiento.trim()).toString()
    return encriptado
  }
  servicioDecrypt(cadena:string){
    const cadenaDescryp:string = CryptoJS.AES.decrypt(cadena.trim(), this.cadenaEncriptamiento.trim()).toString(CryptoJS.enc.Utf8)
    return cadenaDescryp
  }
  usuarioRol(){
    if(localStorage.getItem('dataSecurity')){
      const { rol, usuario, sucursal, alias, accessToken, sesion, refresh_token} = JSON.parse(localStorage.getItem('dataSecurity'))
      const newrol = this.servicioDecrypt(rol)
      const newusuario = this.servicioDecrypt(usuario)
      const newalias = this.servicioDecrypt(alias)
      const newsucursal = this.servicioDecrypt(sucursal)
      const newrefresh_token = this.servicioDecrypt(refresh_token)
      
      return {
        rol: newrol, usuario: newusuario, 
        sucursal: newsucursal, alias: newalias, 
        accessToken,
        sesion,
        refresh_token: newrefresh_token
      }
    }else{
      return {
        rol: null, usuario: null, 
        sucursal: null, alias: null, 
        accessToken:null,
        sesion: false,
        refresh_token: null
      }
    }
    
  }
}
