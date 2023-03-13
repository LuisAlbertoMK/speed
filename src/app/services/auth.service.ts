import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';
import { UsuarioModel } from '../models/usuario.model'
import * as CryptoJS from 'crypto-js';  
import { environment } from 'src/environments/environment';
import { EncriptadoService } from './encriptado.service';

const fire = environment
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userToken:string= ''
  decPassword:string = 'SpeedProSecureCondifidential' 
  constructor(private http: HttpClient, private router:Router, private _security:EncriptadoService) {
    this.leerToken()
   }

  login(usuario: UsuarioModel){
    const authData={
      ...usuario,
      returnSecureToken: true
    }
    return this.http.post(`${fire.usuarios}/accounts:signInWithPassword?key=${fire.firebaseConfig.apiKey}`,authData)
    .pipe(map( resp=>{      
      this.guardarToken(resp['idToken'])
      return resp
    }))
  }

  GeneraTokenUsuario(usuario: UsuarioModel){
    const authData={
      ...usuario,
      returnSecureToken: true
    }
    return this.http.post(`${fire.usuarios}/accounts:signInWithPassword?key=${fire.firebaseConfig.apiKey}`,authData)
    .pipe(map( resp=>{      
      this.tokenUsuarioTemporal(resp['idToken'])
      return resp
    }))
  }
  borrarTokenTemporal(){
    localStorage.removeItem('tokenTemporal')
  }

  logout(accion:string){
    // localStorage.removeItem('token')
    // localStorage.removeItem('expira')
    // localStorage.removeItem('sesion')
    // localStorage.removeItem('status')
    // localStorage.removeItem('tipoUsuario')
    // localStorage.removeItem('usuario')
    // localStorage.removeItem('sucursal')    
    // localStorage.removeItem('status_mon')    
    // localStorage.removeItem('sucursal_mon')    
    // localStorage.removeItem('email_mon')    
    // localStorage.removeItem('password_mon')
    // if (accion==='password') {
    //   localStorage.removeItem('password')
    // }
    // if (accion==='email') {
    //   localStorage.removeItem('email')
    //   localStorage.removeItem('password')
    // }
    localStorage.removeItem('dataSecurity')
    window.location.href = '/home'
  }
  nuevoUsuario(usuario: UsuarioModel){
    const authData={
      ...usuario,
      returnSecureToken: true
    }
    return this.http.post(`${fire.usuarios}/accounts:signUp?key=${fire.firebaseConfig.apiKey}`,authData)
    .pipe(map( resp=>{     
      // console.log(resp);
       
      this.guardarToken(resp['idToken'])
      return resp
    }))
  }
  private guardarToken(idToken:string){
    // this.userToken = idToken
    // localStorage.setItem('token',idToken)
    let hoy = new Date()
    hoy.setSeconds(3600)
    localStorage.setItem('expira',hoy.getTime().toString())
  }
  nuevo_exp(){
    let hoy = new Date()
    hoy.setSeconds(3600)
    localStorage.setItem('expira',hoy.getTime().toString())
  }
  private tokenUsuarioTemporal(idToken:string){
    localStorage.setItem('tokenTemporal',idToken)
  }
  leerToken(){
    // if (localStorage.getItem('token')) {
    //   this.userToken = localStorage.getItem('token')
    // }else{
    //   this.userToken = ''
    // }
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'));
      (variableX['accessToken'])? this.userToken = variableX['accessToken']: this.userToken = '';
    }else{
      this.userToken = ''
    }
    return this.userToken
  }
  estaAutenticado():boolean{
    // if (localStorage.getItem('dataSecurity')) {
    //   const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    //   const camposDec  = Object.keys(variableX)
    //   let existe={sesion:false,accessToken:false}
    //   if(variableX['usuario']){
    //     for (let index = 0; index < camposDec.length; index++) {
    //       const element = camposDec[index];
    //       (variableX['sesion'])? existe.sesion = true: '';
    //       (variableX['accessToken'])? existe.accessToken = true: '';
    //       // console.log(element, `${this._security.servicioDecrypt(variableX[element])}`);
    //     }
    //     if (existe.sesion && existe.accessToken) {
    //       console.log('existe informacion');
          
    //     }else{
    //       window.location.href = '/loginv1'          
    //     }
    //   }
    // }

    if (this.userToken.length < 2) {
      return false
    }
    const expira = Number(localStorage.getItem('expira'))
    const expiraDate = new Date()
    expiraDate.setTime(expira)
    if (expiraDate > new Date()) {
      return true
    }else{
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    // console.log(variableX['sesion']);
    // console.log(this._security.servicioDecrypt(variableX['rol']));
    
      if (variableX['sesion']) {
        // if (localStorage.getItem('email') && localStorage.getItem('password') ) {
        //   let email = CryptoJS.AES.decrypt(localStorage.getItem('email').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8); 
        //   let password = CryptoJS.AES.decrypt(localStorage.getItem('password').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8)
        //   const dataUsuer = {
        //     email,
        //     password,
        //     nombre: ''
        //   }
        //   this.login(dataUsuer)
        // }
        return true
      }else{
        return false
      }
      // return false
    }
  }
}
