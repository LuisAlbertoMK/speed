import { Component, OnInit } from '@angular/core';
import { getDatabase, onValue, ref } from 'firebase/database';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import Swal from 'sweetalert2';
const db = getDatabase()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  servicios:any = [
    {servicio:'Cambio de Aceite de Motor',icono:'fas fa-oil-can'},
    {servicio:'Cambio de Amortiguadores',icono:'fas fa-car-bump'},
    {servicio:'Reparación de Frenos',icono:'fas fa-car-mechanic'}, 
    {servicio:'Revisión y Reparación del Sistema de Enfriamiento',icono:'fas fa-wind'},
    {servicio:'Venta de Llantas',icono:'fas fa-tire'},
    {servicio:'Verificación Vehicular',icono:'fas fa-cars'}
  ]
  sucursales:any=[]
  color:number=0
  colores:any=['text-primary','text-danger','text-success','text-secondary','text-info']
  sesion:boolean = false
  constructor(private _security:EncriptadoService,) { }

  ngOnInit(): void {
    this.logeado()
    this.listasucursales()
    this.animarTexto()
  }
  listasucursales(){
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
	    this.sucursales= this.crearArreglo2(snapshot.val())
      // console.log(this.sucursales);
    })
  }
  logeado(){

    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))

    this.sesion = Boolean(variableX['sesion'])
    // console.log(this.sesion);
    
    if (!this.sesion) {
      // layout-top-nav
      let body = $(document.body)
      body.removeClass('hold-transition sidebar-mini layout-fixed sidebar-collapse mat-typography layout-navbar-fixed')
      body.addClass('hold-transition layout-top-nav layout-navbar-fixed')
      setTimeout(() => {
          this.logeado()
      }, 1000);
    }else{
      this.mensajeCorrecto('Sesion activa espere ...')
      setTimeout(() => {
        window.location.href = '/inicio'
      }, 1000);
    }
    }

    
  }
  animarTexto(){
    setTimeout(() => {
      // this.color = !this.color
      var min = 0;
      var max = 4;
      
      var x = Math.floor(Math.random()*(max - min)+min)
      this.color = Number(x)
      // console.log(x);
      
      this.animarTexto()
    }, 1000);

  }
  mensajeCorrecto(mensaje:string){
    const Toast = Swal.mixin({
      toast: true,
      position: 'center',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      allowOutsideClick:false,
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
      timer: 2500,
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
