import { AfterViewInit, Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';  
import { child, get, getDatabase, ref } from 'firebase/database';
///autenticacion de usuarios
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment.prod';
// const app = initializeApp(environment.firebaseConfig);


const dbRef = ref(getDatabase());
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit,OnInit {
  //cifrar contraseña 
  encPassword:string =  'SpeedProSecureCondifidential';  
  decPassword:string = 'SpeedProSecureCondifidential' 
  conversionEncryptOutputCorreo: string;
  conversionEncryptOutputPassword: string;
   
  conversionDecryptOutputEmail:string; 
  conversionDecryptOutputPassword:string; 

  bloquea:boolean = false
  recordarme = true
  hide = true
  usuario: UsuarioModel = new UsuarioModel()
  userToken:string = ''
  validandoInfo:boolean = false
  acceso:boolean = false
  constructor(private _auth:AuthService, private router: Router,private _usuarios: UsuariosService) { }

  ngOnInit(): void {
    this.leerToken()
    if (localStorage.getItem('email') && localStorage.getItem('password')) {
      this.conversionDecryptOutputEmail = CryptoJS.AES.decrypt(localStorage.getItem('email').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8); 
      this.conversionDecryptOutputPassword = CryptoJS.AES.decrypt(localStorage.getItem('password').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8); 
      this.usuario.email =  this.conversionDecryptOutputEmail
      this.usuario.password = this.conversionDecryptOutputPassword
      this.recordarme = true
    }
    if (localStorage.getItem('email') ) {
      this.conversionDecryptOutputEmail = CryptoJS.AES.decrypt(localStorage.getItem('email').trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8); 
      this.usuario.email =  this.conversionDecryptOutputEmail
      this.recordarme = true
    }
  }
  ngAfterViewInit() {
    this.estaAutenticado()
  }
  login(form: NgForm){
    
    if (form.invalid) { return}
    this.validandoInfo = true
    this._auth.login(this.usuario).subscribe(
      (resp:any)=>{
        // console.log(resp)
        this.conversionEncryptOutputCorreo = CryptoJS.AES.encrypt(this.usuario.email.trim(), this.encPassword.trim()).toString()
        this.conversionEncryptOutputPassword = CryptoJS.AES.encrypt(this.usuario.password.trim(), this.encPassword.trim()).toString()
        get(child(dbRef, `usuarios`)).then((snapshot) => {
          if (snapshot.exists()) {
            let usuarios =this.crearArreglo2(snapshot.val())
            usuarios.forEach(usuario => {
              if (((usuario.correo).toLowerCase()  === (resp.email).toLowerCase()) && usuario.status ) {
                localStorage.setItem('email',this.conversionEncryptOutputCorreo)
                localStorage.setItem('password',this.conversionEncryptOutputPassword)
                // localStorage.setItem('tipoUsuario',CryptoJS.AES.encrypt(usuario.rol.trim(), this.encPassword.trim()).toString())
                localStorage.setItem('tipoUsuario',usuario.rol)
                localStorage.setItem('sesion','true')
                localStorage.setItem('sucursal',usuario.sucursal)
                localStorage.setItem('status',usuario.status)
                localStorage.setItem('usuario',usuario.id)
                localStorage.setItem('alias',usuario.usuario)
                this.acceso = true
                this.bloquea = true
                this.mensajeCorrecto('Accesando espere ...')
                this.accesa()
              }
              if (((usuario.correo).toLowerCase()  === resp.email) && !usuario.status ) {
                this.mensajeIncorrecto(`Usuario inhabilitado <strong> contactar al administrador</strong>`)
                this.bloquea = false
              }
            })
          } else {
            // console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        })
      },
      (err)=>{
        // console.log(err);
        this.bloquea = false
        this.mensajeIncorrecto('Error de autenticación!')
      }
    )
    
  }
  accesa(){
    setTimeout(() => {
      if (this.acceso) {
        window.location.href = '/inicio'
        // this.router.navigateByUrl('/inicio')
      }
    }, 1100)
  }
  leerToken(){
    if (localStorage.getItem('sesion') && localStorage.getItem('token')) {
          window.location.href = '/inicio'
    }
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
      return false
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
  mensajeCorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'success',
      title: mensaje
    })
  }
  mensajeIncorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    
    Toast.fire({
      icon: 'error',
      title: mensaje
    })
  }
}
