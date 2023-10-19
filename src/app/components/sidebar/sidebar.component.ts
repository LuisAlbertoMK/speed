import { Component, OnInit } from '@angular/core';

import { getDatabase, onValue, ref, set } from "firebase/database"
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';


const db = getDatabase()
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService, private _sucursales: SucursalesService) { }

  sucursales_array =  [...this._sucursales.lista_en_duro_sucursales]

  ocultar:boolean= false
  ROL:string = ''
  SUCURSAL:string=''
  TIPO_USUARIO:string=''
  nombreSucursalMuestra:string =''
  mostrarAdministracion:boolean = false

  Gerente_rol: boolean = false
  SuperSU_rol: boolean = false
  Cliente_rol: boolean = false


  asigancion_roles_gerente = [
    {path:'clientes', show:'Clientes',icono:'user'},
    {path:'cotizacion', show:'Cotizaciones',icono:'folder'},
    {path:'catalogos', show:'Catalogos',icono:'address-book'},
    {path:'reporteGastos', show:'Reporte de gastos',icono:'book'},
    {path:'sucursales', show:'Sucursales',icono:'landmark'},
    {path:'servicios', show:'vehículos en piso',icono:'toolbox'},
    {path:'citas', show:'Citas',icono:'calendar-check'},
    {path:'usuarios', show:'Usuarios y roles',icono:'user'},
    {path:'recordatorios', show:'Recordatorios',icono:'bell'},
    {path:'registraProblemas', show:'Registra problemas',icono:'bug'},
    {path:'eliminarEmpresa', show:'Elimina empresa',icono:'ban'},
    {path:'vehiculos', show:'Vehiculos',icono:'car-alt'},
  ]
  asigancion_roles_cliente = [
    {path:'miPerfil', show:'Mi informacion',icono:'book'},
    // {path:'vehiculos', show:'Mis vehiculos',icono:'cars'},
    {path:'estadisticasCliente', show:'Mis estadisticas',icono:'chart-pie'},
    {path:'cotizacionesCliente', show:'Mis cotizaciones',icono:'book-open'},
    {path:'serviciosCliente', show:'Mis servicios',icono:'toolbox'},
    {path:'sucursales', show:'Lista sucursales',icono:'landmark'},
    {path:'registraProblemas', show:'Registra problemas',icono:'bug'},
    {path:'vehiculos-cliente', show:'Mis vehiculos',icono:'car-side'},
    {path:'citas-cliente', show:'Citas Cliente',icono:'user'},
  ]
  ngOnInit(): void {
    this.rol()
    // this.NombreSucursal()
  }
 
  
  rol(){
    const { rol, sucursal, alias,usuario} = this._security.usuarioRol()
    // console.log(usuario);
    
    this.ROL = rol
    this.SUCURSAL = sucursal;
    this.TIPO_USUARIO = usuario
    
    // this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
    if (this.ROL==='SuperSU') {
      this.mostrarAdministracion = true
    }else{
      this.nombreSucursalMuestra = this.sucursales_array.find(s=>s.id === this.SUCURSAL).sucursal
    }

    if (this.ROL==='SuperSU') {
      // this.mostrarAdministracion = true
      this.SuperSU_rol = true
    }else if(this.ROL === 'Gerente'){
      this.Gerente_rol = true
    }else if(this.ROL === 'cliente'){
      this.Cliente_rol = true
    }
  }
  NombreSucursal(){


    // if (this.SUCURSAL!=='Todas') {
    //   const starCountRef = ref(db, 'sucursales')
    //   onValue(starCountRef, (snapshot) => {
    //     const data = snapshot.val()
    //     let temp = this._publicos.crearArreglo2(data)
    //     temp.forEach(sucursal => {
    //       if (sucursal.id === this.SUCURSAL) {
    //         this.nombreSucursalMuestra = sucursal.sucursal
    //       }
    //     });
    //   })
    // }
  }
  
}
