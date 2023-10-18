import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const urlServer = environment.firebaseConfig.databaseURL
const apiKey = environment.firebaseConfig.apiKey
const usuarios = 'https://identitytoolkit.googleapis.com/v1'

import { child, get, getDatabase, onValue, push, ref, set, update } from "firebase/database"
import { ServiciosPublicosService } from './servicios-publicos.service';
import { map } from 'rxjs';
import { resolve } from 'dns';
import { EncriptadoService } from './encriptado.service';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
const db = getDatabase()
const dbRef = ref(getDatabase());
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
const auth = getAuth();
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  decPassword:string = 'SpeedProSecureCondifidential' 
  constructor(private http: HttpClient, private _publicos: ServiciosPublicosService, private _security: EncriptadoService) { }


  consulta_usuarios_correos(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, 'usuarios');
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const usuarios = this._publicos.crearArreglo2(snapshot.val());
          resolve(usuarios);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_usuario_data(usuario): Promise<object> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `usuarios/${usuario}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(Object(snapshot.val()));
        } else {
          resolve({});
        }
      });
    });
  }

  update_data_usuario(usuario) {
    let token = localStorage.getItem('tokenTemporal')
    const dataReset={
      idToken: token,
      email: usuario.correo,
      password:usuario.password,
      returnSecureToken: true
    }
    return this.http.post(`${usuarios}/accounts:update?key=${apiKey}`,dataReset)

  }


  async nuevoUsuario(data: any){
    const authData={...data,
      img:'https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/usuarios%2Fdefault.jpg?alt=media&token=439b5875-8b06-4f37-b522-a86dc4d7954b',
    }
    const ans = {inserccion:false, mensaje:'No se registro usuario intente de nuevo'}
    const newPostKey = push(child(ref(db), 'posts')).key
    await set(ref(db, `usuarios/${newPostKey}`), authData )
          .then(() => {
            ans.inserccion = true
            ans.mensaje = 'registro de usuario correcto'
          })
          .catch((error) => {
            // The write failed...
            ans.mensaje = ans.mensaje + ' ' + error
          });
    return ans
    // return this.http.post(`${usuarios}/accounts:signUp?key=${apiKey}`,authData)
  }

 

  getDataUser(){
    return this.http.get(`${urlServer}/usuarios.json`)
  }
  restablecerCredenciales(usuario:any){
    let token = localStorage.getItem('tokenTemporal')
    const dataReset={
      idToken: token,
      email: usuario.correo,
      password:usuario.password,
      returnSecureToken: true
    }
    this.http.post(`${usuarios}/accounts:update?key=${apiKey}`,dataReset)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocurrió un error desconocido';
        
        if (error.error && error.error.error && error.error.error.message) {
          errorMessage = error.error.error.message;
        }
        console.log(errorMessage);
        return errorMessage
      })
    )
    .subscribe((response) => {
      // Manejar la respuesta exitosa de la API
      return response
    })
  }
  actualiza_email(correo){
    updateEmail(auth.currentUser, correo).then((ans) => {
      console.log('update', correo);
      console.log('update', ans);
    }).catch((error) => {
      // An error occurred
      console.log(error);
    });
  }
  actualiza_password(password){

    updatePassword(auth.currentUser, password).then((ans) => {
      console.log('update', password);
    }).catch((error) => {
      // An error occurred
      console.log(error);
    });
  }
  restablece_new(donde:string, valor:string, idToken){
    // let idToken = localStorage.getItem('tokenTemporal')
    let  dataReset={
      idToken,
      returnSecureToken: false,
      [donde]: valor
    }    
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,dataReset)
  }




 

}
