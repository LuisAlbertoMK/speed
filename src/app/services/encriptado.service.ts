import { Injectable } from '@angular/core';

import * as CryptoJS from 'crypto-js'; 

@Injectable({
  providedIn: 'root'
})
export class EncriptadoService {
  cadenaEncriptamiento:string =  'SpeedProSecureCondifidential';  


  constructor() { }
  servicioEncriptado_objetc(data:any){
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.cadenaEncriptamiento);
    // return CryptoJS.AES.encrypt(objeto, this.cadenaEncriptamiento).toString() 
  }
  servicioDecrypt_object(data){
    var bytes  = CryptoJS.AES.decrypt(data.toString(), this.cadenaEncriptamiento);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  guarda_informacion(data_gif){
    const {nombre, data} = data_gif
    const encriptado_sucursales = this.servicioEncriptado_objetc(data)
    localStorage.setItem(`${nombre}`, encriptado_sucursales)
  }


  servicioEncriptado(cadena: string){
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
