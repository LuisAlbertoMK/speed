import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import * as CryptoJS from 'crypto-js';  
import Swal from 'sweetalert2';
import { getDatabase, onValue, ref, set } from "firebase/database"
import { EncriptadoService } from './services/encriptado.service';
const db = getDatabase()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,OnInit {
  constructor(private rutaActiva: ActivatedRoute, private router: Router, private _auth: AuthService,private _security:EncriptadoService, ) { }
  userToken:string = ''
  muestra:boolean = false
  sesion:boolean= false
  decPassword:string = 'SpeedProSecureCondifidential' 
  SUCURSAL:string =''
  nombreSucursalMuestra:string =''
  ngOnInit(): void {
    this.leerToken()
    this.sesionActive()
    this.nombreSucursal()
  }
  ngAfterViewInit() {
   
  }
  nombreSucursal(){

    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    // this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])


    // this.SUCURSAL =localStorage.getItem('sucursal')
    if (this.SUCURSAL!=='Todas') {
      const starCountRef = ref(db, 'sucursales')
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val()
        let temp = this.crearArreglo2(data)
        temp.forEach(sucursal => {
          if (sucursal.id === this.SUCURSAL) {
            this.nombreSucursalMuestra = sucursal.sucursal
          }
        });
      })
    }
    }else{

    }
    
  }
  leerToken(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'));
      (variableX['accessToken'])? this.userToken = variableX['accessToken']: this.userToken = '';
    }else{
      this.userToken = ''
    }
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
      return false
    }
  }
  sesionActive(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'));
      this.sesion = true
    }else{
      this.sesion = false
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

  
}
