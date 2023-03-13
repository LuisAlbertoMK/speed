import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged,signOut  } from "firebase/auth";

import { child, get, getDatabase, onValue, ref, set, update } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());
const auth = getAuth();

import * as CryptoJS from 'crypto-js';  
import Swal from 'sweetalert2';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModel } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-loginv1',
  templateUrl: './loginv1.component.html',
  styleUrls: ['./loginv1.component.css']
})
export class Loginv1Component implements OnInit {

  formularioLogin: FormGroup;
  informacionAuth={auth:false,UID:'',data:{}}
  recordarme = true
  userToken:string = ''
  usuario: UsuarioModel = new UsuarioModel()

  encPassword:string =  'SpeedProSecureCondifidential';  
  
  apuntadores = {usuario: true, password: true}

  showPassword = false
  
  intentos = 0

  constructor(private fb: FormBuilder,private _publicos:ServiciosPublicosService, private _security:EncriptadoService,private _auth:AuthService) { }

  ngOnInit(): void {
    this.crearFormularioLogin()
    this.leerToken()
    // dataSecurity
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      const camposDec  = Object.keys(variableX)
      if(variableX['usuario']){
        for (let index = 0; index < camposDec.length; index++) {
          const element = camposDec[index];
          // console.log(element, `${this._security.servicioDecrypt(variableX[element])}`);
        }
      }
      // this.recordarme = true
    }
    if (localStorage.getItem('email')  ) {
      Swal.fire({
        title: 'Continuar sesion?',
        text: "Ingresar con correo y contraseña encontrados!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuario.email = this._security.servicioDecrypt(localStorage.getItem('email'))
          this.usuario.password = this._security.servicioDecrypt(localStorage.getItem('password'))
          this.formularioLogin.reset({
            email: this.usuario.email,
            password: this.usuario.password
          })
          // this._publicos.mensajeCorrecto('Iniciando sesión')
          this.Login()
        }
      })
      
      
    }
    this.recordarme = true
  }
  crearFormularioLogin(){
    this.formularioLogin = this.fb.group({
      email:['',[Validators.required]],
      password:['',[Validators.required]],
    })
  }
  Login(){

    if (this.intentos <=3) {
      
    const formularioLogin = this.formularioLogin.value
    signInWithEmailAndPassword(auth, formularioLogin['email'], formularioLogin['password'])
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // console.log(user);
        this.obternerInformacion()

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        this.intentos ++
      // console.log(errorCode);
      
        switch (error.code) {
          case 'auth/user-not-found':
            // this._publicos.mensajeIncorrecto('UsuarioCorreo incorrecto')
            this.apuntadores.usuario = false
            this.apuntadores.password = true
            break;
          case 'auth/wrong-password':
            // this._publicos.mensajeIncorrecto('error de contraseña')
            this.apuntadores.usuario = true
            this.apuntadores.password = false
            break;
        
          default:
            // this.apuntadores.usuario = false
            break;
        }
        // console.log(errorCode);
        // console.log(errorMessage);
        
      });
    }else{
      this._publicos.mensajeIncorrecto('Contactar con administrador')
    }
  }
  logout(){
    signOut(auth).then(() => {
      // this.obternerInformacion()
      localStorage.removeItem('dataSecurity')
      // this.leerToken()
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      
    });
  }

  showsPassword(aqui){
    this.showPassword = aqui
    const  text_pass = document.getElementById('password')
    let tipo = 'password';
    (aqui) ? tipo = 'text' : tipo = 'password'
    text_pass.setAttribute('type',tipo)
  }


  obternerInformacion(){
    onAuthStateChanged(auth, (data:any) => {
      if (data) {
        const uid = data.uid;
        const accessToken = data.accessToken;
        this.informacionAuth.data['accessToken'] = accessToken
        this.informacionAuth.data['uid'] = uid
        this.informacionAuth.auth = true
        
        const formularioLogin = this.formularioLogin.value
        get(child(dbRef, `usuarios`)).then((snapshot) => {
          if (snapshot.exists()) {
            const usuarios =this._publicos.crearArreglo2(snapshot.val())
            const existeUsuario = usuarios.find(o=>o.correo.trim() === formularioLogin['email'])
             if (existeUsuario['id']) {
              // console.log(existeUsuario);
              const variableX = {
                email: this._security.servicioEncriptado(existeUsuario['correo']),
                password: this._security.servicioEncriptado(existeUsuario['password']),
                rol: this._security.servicioEncriptado(existeUsuario['rol']),
                sucursal: this._security.servicioEncriptado(existeUsuario['sucursal']),
                status: existeUsuario['status'],
                uid: this._security.servicioEncriptado(uid),
                accessToken: this._security.servicioEncriptado(accessToken),
                sesion: true,
                usuario: this._security.servicioEncriptado(existeUsuario['id']),
                alias: this._security.servicioEncriptado(existeUsuario['usuario']),
              }
              localStorage.setItem('dataSecurity',JSON.stringify(variableX))
              if (this.recordarme) {
                localStorage.setItem('email',this._security.servicioEncriptado(existeUsuario['correo']))
                localStorage.setItem('password',this._security.servicioEncriptado(existeUsuario['password']))
              }

              this._auth.nuevo_exp()
              let timerInterval
              Swal.fire({
                title: 'Accesando espere ...',
                // html: 'I will close in <b></b> milliseconds.',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading()
                  const b = Swal.getHtmlContainer().querySelector('b')
                  timerInterval = setInterval(() => {
                    // b.textContent = String(Swal.getTimerLeft())
                  }, 100)
                },
                willClose: () => {
                  clearInterval(timerInterval)
                }
              }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                  // console.log('I was closed by the timer')
                  window.location.href = '/inicio'
                }
              })
             }else{
              // console.log('no existe informacion de usuario'); 
              this._publicos.mensajeIncorrecto('No se puede acceder no existe informacion de usuario')           
             }
          } else {
            console.log("No data available");
          }
        }).catch((error) => {
          console.error(error);
        });
    
      } else {
          this.informacionAuth.auth = false
          this.informacionAuth.data['uid'] = ''
      }
    });
  }
  leerToken(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      const camposDec  = Object.keys(variableX)
      let existe={sesion:false,accessToken:false}
      if(variableX['usuario']){
        for (let index = 0; index < camposDec.length; index++) {
          const element = camposDec[index];
          (variableX['sesion'])? existe.sesion = true: '';
          (variableX['accessToken'])? existe.accessToken = true: '';
          // console.log(element, `${this._security.servicioDecrypt(variableX[element])}`);
        }
        if (existe.sesion && existe.accessToken) {
          window.location.href = '/inicio'
        }else{
          // window.location.href = '/loginv1'          
        }
      }
    }
    
    // if (localStorage.getItem('sesion') && localStorage.getItem('token')) {
    //       window.location.href = '/inicio'
    // }
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
  
}
