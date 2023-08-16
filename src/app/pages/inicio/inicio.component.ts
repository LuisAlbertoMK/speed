import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  miniColumnas:number = 100
  ROL:string = ''
  constructor(private router:Router, private _security:EncriptadoService,) { }
  mostrarAdministracion: boolean = false
  userToken:string
  mensaje_actualizacion:boolean = true

  asigancion_roles_gerente = [
    {path:'administracion', show:'Administracion',icono:'book'},
    {path:'automaticos', show:'AUTOMATICOS',icono:'ban'},
    {path:'catalogos', show:'Catalogos',icono:'address-book'},
    {path:'citas', show:'Citas',icono:'calendar-check'},
    {path:'clientes', show:'Clientes',icono:'user'},
    {path:'cotizacion', show:'Cotizaciones',icono:'folder'},
    {path:'corte', show:'Corte de ingresos',icono:'folder'},
    {path:'eliminarEmpresa', show:'Elimina empresa',icono:'ban'},
    {path:'facturacion', show:'Facturación',icono:'file-contract'},
    {path:'recordatorios', show:'Recordatorios',icono:'alarm-exclamation'},
    {path:'registraProblemas', show:'Registra problemas',icono:'debug'},
    {path:'reporteGastos', show:'Reporte de gastos',icono:'book'},
    {path:'servicios', show:'vehículos en piso',icono:'car-building'},
    {path:'sucursales', show:'Sucursales',icono:'landmark'},
    {path:'usuarios', show:'Usuarios y roles',icono:'user'},
  ]
  asigancion_roles_cliente = [
    {path:'miPerfil', show:'Mi informacion',icono:'book'},
    // {path:'vehiculos', show:'Mis vehiculos',icono:'cars'},
    {path:'estadisticasCliente', show:'Mis estadisticas',icono:'chart-pie'},
    {path:'cotizacionesCliente', show:'Historial cotizaciones',icono:'book-user'},
    {path:'serviciosCliente', show:'Historial servicios',icono:'car-garage'},
    {path:'sucursales', show:'Lista sucursales',icono:'landmark'},
    {path:'registraProblemas', show:'Registra problemas',icono:'debug'},
    {path:'comentarios', show:'Comentarios',icono:'comments'},
    // {path:'citasCliente', show:'Mis citas',icono:'debug'}
  ]
  Gerente_rol: boolean = false
  SuperSU_rol: boolean = false
  Cliente_rol: boolean = false
  ngOnInit(): void {
    this.leerToken()
    this.estaAutenticado()
    this.rol()
    // this.brow()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    
    if (this.ROL==='SuperSU') {
      this.mostrarAdministracion = true
      this.SuperSU_rol = true
    }else if(this.ROL === 'Gerente'){
      this.Gerente_rol = true
    }else if(this.ROL === 'cliente'){
      this.Cliente_rol = true
    }

    }
  leerToken(){
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token')
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
  brow(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    // console.log(M[0])

    if (M[0]==='Firefox') {
      setTimeout(() => {
        let timerInterval
        Swal.fire({
          title: 'Auto close alert!',
          html: 'Se recomienda el uso de chrome se cerrara esta alerta en <b></b> milisegundos.',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = String(Swal.getTimerLeft())
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
          }
        })
        
      }, 1000);
     
    }
}
  
}
