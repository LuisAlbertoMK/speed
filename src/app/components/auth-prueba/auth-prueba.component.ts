import { Component, OnInit } from '@angular/core';

import { getAuth, signInWithEmailAndPassword, onAuthStateChanged,signOut  } from "firebase/auth";
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';

const auth = getAuth();

@Component({
  selector: 'app-auth-prueba',
  templateUrl: './auth-prueba.component.html',
  styleUrls: ['./auth-prueba.component.css']
})
export class AuthPruebaComponent implements OnInit {
  
  informacionAuth={auth:false,UID:''}

  constructor(private _publicos:ServiciosPublicosService) { }

  ngOnInit(): void {
    
  }
  logear(){
    const email= 'ventas_culhuacan@speed-service.com.mx'
    const password ='Culh12/(1';
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        this.obternerInformacion()
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        
      });
  }

  logout(){
    signOut(auth).then(() => {
      // Sign-out successful.
      this.obternerInformacion()
      this._publicos.mensajeCorrecto('Se cerro la cesion',1)
    }).catch((error) => {
      // An error happened.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
      
    });
  }
  obternerInformacion(){
    onAuthStateChanged(auth, (user:any) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const accessToken = user.accessToken;
        const idToken = user.idToken;
        // if (user) {
          // this._publicos.mensajeCorrecto('Usuario logeado')
          this.informacionAuth.auth = true
          this.informacionAuth.UID = uid
        // }
        // ...
      } else {
        // User is signed out
        // ...
          this.informacionAuth.auth = false
          this.informacionAuth.UID = ''
      }
    });
  }


}
