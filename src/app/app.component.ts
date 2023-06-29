import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth.service';


import { getDatabase, onValue, ref, set } from "firebase/database"
import { EncriptadoService } from './services/encriptado.service';
import { SucursalesService } from './services/sucursales.service';
const db = getDatabase()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,OnInit {
  constructor(private rutaActiva: ActivatedRoute, private _sucursales: SucursalesService,
    private router: Router, private _auth: AuthService,private _security:EncriptadoService, ) { }
  
  sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]
  
  userToken:string = ''
  muestra:boolean = false
  sesion:boolean= false
  
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
    const { rol, sucursal, usuario } = this._security.usuarioRol()
    if(sucursal){
      this.SUCURSAL = sucursal
      if (this.SUCURSAL!=='Todas') {
        this.nombreSucursalMuestra = this.sucursales_array.find(s=>s.id === this.SUCURSAL).sucursal
        // const starCountRef = ref(db, 'sucursales')
        // onValue(starCountRef, (snapshot) => {
        //   const data = snapshot.val()
        //   let temp = this.crearArreglo2(data)
        //   temp.forEach(sucursal => {
        //     if (sucursal.id === this.SUCURSAL) {
        //       this.nombreSucursalMuestra = sucursal.sucursal
        //     }
        //   });
        // })
      }
    }
    
  }
  leerToken(){
    const { rol, sucursal, usuario, accessToken} = this._security.usuarioRol()
    // if (localStorage.getItem('dataSecurity')) {
    //   const variableX = JSON.parse(localStorage.getItem('dataSecurity'));
    //   (variableX['accessToken'])? this.userToken = variableX['accessToken']: this.userToken = '';
    // }else{
    //   this.userToken = ''
    // }
    this.userToken = (localStorage.getItem('dataSecurity')) ? accessToken : ''
    return this.userToken
  }
  estaAutenticado():boolean{
    // if (this.userToken.length < 2) {
    //   return false
    // }
    const expira = Number(localStorage.getItem('expira'))
    const expiraDate = new Date()
    expiraDate.setTime(expira)

    if (expiraDate > new Date() || this.userToken.length > 2) {
      return true
    }else{
      return false
    }
  }
  sesionActive(){
    // if (localStorage.getItem('dataSecurity')) {
    //   const variableX = JSON.parse(localStorage.getItem('dataSecurity'));
    //   this.sesion = true
    // }else{
    //   this.sesion = false
    // }
    this.sesion = (localStorage.getItem('dataSecurity')) ? true : false
  }

  
}
