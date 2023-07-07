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
      this.guardarToken(resp['idToken'])
      return resp
    }))
  }
  private guardarToken(idToken:string){
    // this.userToken = idToken
    let hoy = new Date()
    hoy.setSeconds(3300)
    localStorage.setItem('expira',hoy.getTime().toString())
    localStorage.setItem('token',idToken)
  }
  nuevo_exp(){
    let hoy = new Date()
    hoy.setSeconds(3300)
    localStorage.setItem('expira',hoy.getTime().toString())
  }
  private tokenUsuarioTemporal(idToken:string){
    localStorage.setItem('tokenTemporal',idToken)
  }
  leerToken(){
    const { accessToken } = this._security.usuarioRol();
    this.userToken = (accessToken) ? accessToken: ''
    return this.userToken
  }
  estaAutenticado():boolean{
    if (this.userToken.length < 2) {
      return false
    }
    const expira = Number(localStorage.getItem('expira'))
    const expiraDate = new Date()
    expiraDate.setTime(expira)
    if (expiraDate > new Date()) {
      return true
    }else{
      const { sesion } = this._security.usuarioRol()
      if (sesion) {
        this.refresacarToken()
        return true
      }else{
        return false
      }
    }

  }
  refresacarToken(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))

    const { refreshToken: refresh_token } = this._security.usuarioRol()

    this.http.post(`https://securetoken.googleapis.com/v1/token?key=${fire.firebaseConfig.apiKey}`,'',
    {
      params: {
        grant_type:'refresh_token',
        refresh_token
      }
    },
    ).subscribe(ans=>{
      localStorage.setItem(variableX['accessToken'],this._security.servicioEncriptado(ans['access_token']))
      localStorage.setItem(variableX['refresh_token'],this._security.servicioEncriptado(ans['refresh_token']))
      this.guardarToken(ans['id_token'])
    })
    
  }
}
