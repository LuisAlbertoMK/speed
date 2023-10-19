import { Component, OnInit } from '@angular/core';
import { getDatabase, onValue, ref } from 'firebase/database';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';

const db = getDatabase()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor(
    private _security:EncriptadoService,private _sucursales: SucursalesService,
    private _publicos:ServiciosPublicosService
    ) { }
  
  
  sucursales_array  =  [ ...this._sucursales.lista_en_duro_sucursales ]
  servicios:any = [
    {servicio:'Cambio de Aceite de Motor',icono:'fas fa-oil-can'},
    {servicio:'Cambio de Amortiguadores',icono:'fas fa-car-bump'},
    {servicio:'Reparación de Frenos',icono:'fas fa-car-mechanic'}, 
    {servicio:'Revisión y Reparación del Sistema de Enfriamiento',icono:'fas fa-wind'},
    {servicio:'Venta de Llantas',icono:'fas fa-tire'},
    {servicio:'Verificación Vehicular',icono:'fas fa-cars'}
  ]
  color:number=0
  colores:any=['text-primary','text-danger','text-success','text-secondary','text-info']
  sesion:boolean = false
  ngOnInit(): void {
    this.logeado()
    this.animarTexto()
  }
  
  logeado(){
    if (localStorage.getItem('dataSecurity')) {
      const { sesion } = this._security.usuarioRol()
      this.sesion = (sesion) ? sesion : false
      if(!this.sesion){
        let body = $(document.body)
        body.removeClass('hold-transition sidebar-mini layout-fixed sidebar-collapse mat-typography layout-navbar-fixed')
        body.addClass('hold-transition layout-top-nav layout-navbar-fixed')
        setTimeout(() => {
            this.logeado()
        }, 1500);
      }else{
        this._publicos.swalToast('Sesion activa espere ...', 1)
        setTimeout(() => {
          window.location.href = '/inicio'
        }, 1500);
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
  
  

}
