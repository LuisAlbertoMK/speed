import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged,signOut, updateCurrentUser, updateProfile  } from "firebase/auth";

import { child, get, getDatabase, onValue, ref, set, update } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());
const auth = getAuth();


import Swal from 'sweetalert2';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { ClientesService } from '../../services/clientes.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

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

  
  
  apuntadores = {usuario: true, password: true}

  showPassword = false
  
  intentos = 0
  miniColumnas:number = 100

  constructor(private fb: FormBuilder,private _publicos:ServiciosPublicosService, 
    private _security:EncriptadoService,private _auth:AuthService,
    private _clientes: ClientesService, private _usuarios: UsuariosService
    ) { }

  ngOnInit(): void {
    this.crearFormularioLogin()
    this.leerToken()
    this.verificaLogeo()
  }
  crearFormularioLogin(){
    this.formularioLogin = this.fb.group({
      email:['',[Validators.required]],
      password:['',[Validators.required]],
    })
  }
  Login(){
    Swal.fire({
      title:'espere',
      allowOutsideClick:false,
      showConfirmButton: false
    })

    if (localStorage.getItem('dataSecurity')) {
      console.log('no hacer peticion firebase auth');
      console.log('redirigir a sesion home/inicio');
    }else{
      const {email, password} = this.formularioLogin.value
      signInWithEmailAndPassword(auth, email, password)
        .then(({user}) => {
          // console.log(user);
          Swal.close()
          localStorage.setItem('email',this._security.servicioEncriptado(email))
          localStorage.setItem('password',this._security.servicioEncriptado(password))
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.intentos ++
        // console.log(error);
        
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
            case 'auth/user-disabled':
              // this._publicos.mensajeIncorrecto('error de contraseña')
              // this.apuntadores.usuario = true
              // this.apuntadores.password = false
              break;
          
            default:
              // this.apuntadores.usuario = false
              break;
          }
          this._publicos.swalToast('Error de autenticacion',0)
          // console.log(errorCode);
          // console.log(errorMessage);
          
        });
    }

    
  }
  verificaLogeo(){
    onAuthStateChanged(auth, async (user) => {
      
      if(user){
        // console.log('esta logeado');
        // console.log(user);
        // user.providerData.forEach((profile) => {
        //   console.log("Sign-in provider: " + profile.providerId);
        //   console.log("  Provider-specific UID: " + profile.uid);
        //   console.log("  Name: " + profile.displayName);
        //   console.log("  Email: " + profile.email);
        //   console.log("  Photo URL: " + profile.photoURL);
        // });

        let dataSecurity = { sesion: true }

        const asiganaData_usuario = ['correo', 'password', 'rol', 'sucursal', 'usuario']
        const camposFirebase = ['uid','accessToken','refreshToken']

        const {email, password: newpass} = this.formularioLogin.value

        let usuario_econtrado = await this._clientes.consulta_usuario_new(user.uid)

        if (!usuario_econtrado['correo']) {
          // console.log('este usuario necesita otro tipo de busqueda');
          const usuarios = await this._usuarios.consulta_usuarios_correos()
          // console.log(usuarios);
          
          usuario_econtrado = usuarios.find(u=>String(u.correo).toLowerCase() === String(email).toLowerCase())
          // console.log(usuario_econtrado);
          
        }
        // console.log(usuario_econtrado);
        if (usuario_econtrado && usuario_econtrado['correo']) {
          dataSecurity['status'] = usuario_econtrado['status']
          asiganaData_usuario.forEach((c)=>{ dataSecurity[c] = this._security.servicioEncriptado(usuario_econtrado[c]) })
          camposFirebase.forEach((c)=>{ dataSecurity[c] = this._security.servicioEncriptado(user[c]) })
          if (usuario_econtrado['id']) {
            dataSecurity['uid'] = this._security.servicioEncriptado(usuario_econtrado['id'])
          }
          localStorage.setItem('email',this._security.servicioEncriptado(email))
          localStorage.setItem('password',this._security.servicioEncriptado(newpass))
          localStorage.setItem('dataSecurity',JSON.stringify(dataSecurity))
          this.estalogeado()
          
        }else{
          // console.log('no existe data de usuario');
          this._publicos.swalToast('no existe data de usuario',0)
        }
        
      }else{
        // console.log('sin logeo');
        this.logout()
        this.preguntar_acceso()
      }
    })
  }
  logout(){
    signOut(auth).then(() => {
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


  leerToken(){
    if (localStorage.getItem('dataSecurity')) {
      const { sesion, accessToken, status } = this._security.usuarioRol()
      if(sesion && accessToken) window.location.href = '/inicio'
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
  estalogeado(){
    if (localStorage.getItem('dataSecurity')) {
      const { sesion, accessToken, status } = this._security.usuarioRol()
      if(sesion && accessToken && status){
        window.location.href = '/inicio'
      }else{
        this._publicos.swalToast('Su usuario esta deshabilitado', 0)
        this.logout()
      }
    }
  }
  preguntar_acceso(){
    if (localStorage.getItem('email') && localStorage.getItem('password') ) {
      const email = this._security.servicioDecrypt(localStorage.getItem('email'))
      const password = this._security.servicioDecrypt(localStorage.getItem('password'))
      const {status } = this._security.usuarioRol()
      if (email && password && status) {
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
            this.formularioLogin.reset({
              email,
              password
            })
            this.Login()
          }
        })
      }
    }
  }
  
  
}
