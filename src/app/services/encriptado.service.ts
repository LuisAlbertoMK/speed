import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js'; 

@Injectable({
  providedIn: 'root'
})
export class EncriptadoService {
  cadenaEncriptamiento:string =  'SpeedProSecureCondifidential';  


  constructor() { }

  servicioEncriptado(cadena: string){
    // const encriptado:string =  
    return CryptoJS.AES.encrypt(cadena.trim(), this.cadenaEncriptamiento.trim()).toString() 
  }
  servicioDecrypt(cadena:string){
    const cadenaDescryp:string = CryptoJS.AES.decrypt(cadena.trim(), this.cadenaEncriptamiento.trim()).toString(CryptoJS.enc.Utf8)
    return cadenaDescryp
  }
  usuarioRol(){
    if(localStorage.getItem('dataSecurity')){
      const { rol, usuario, sucursal, accessToken, sesion, refreshToken, status,uid} = JSON.parse(localStorage.getItem('dataSecurity'))
      const newrol = this.servicioDecrypt(rol)
      const newusuario = this.servicioDecrypt(usuario)
      // const newalias = this.servicioDecrypt(alias)
      const newsucursal = this.servicioDecrypt(sucursal)
      const newrefresh_token = this.servicioDecrypt(refreshToken)
      const newuid = this.servicioDecrypt(uid)
      
      return {
        rol: newrol, usuario: newusuario,
        uid: newuid,
        sucursal: newsucursal, 
        accessToken,
        sesion,
        status,
        refreshToken: newrefresh_token
      }
    }else{
      return {
        rol: null, usuario: null,
        uid:'',
        sucursal: null, alias: null, 
        accessToken:null,
        sesion: false,
        status: false,
        refreshToken: null
      }
    }
    
  }
}
