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
}
