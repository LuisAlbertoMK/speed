import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import 'animate.css';

import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ActivatedRoute, Router } from '@angular/router';
const db = getDatabase();
const dbRef = ref(getDatabase());

//paginacion
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class UsuariosComponent implements OnInit {
  miniColumnas:number = 100
  ROL:string; SUCURSAL:string
  sucursales=[]

   // tabla
   dataSource = new MatTableDataSource(); //elementos
   elementos = ['nombre','sucursalShow','correo','rol']; //elementos
   columnsToDisplayWithExpand = [...this.elementos, 'expand']; //elementos
   expandedElement: any | null; //elementos
   @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
   @ViewChild('elements') sort: MatSort //elementos


   usuarioS:{}

  constructor(
    private _security:EncriptadoService, private rutaActiva: ActivatedRoute, private _publicos: ServiciosPublicosService,
    private router: Router) { }

  ngOnInit(): void {
    this.rol()
  }
  rol(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      this.ROL = this._security.servicioDecrypt(variableX['rol'])
      this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
      // Obtenemos una lista de las sucursales 
      const starCountRef = ref(db, `sucursales`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          //cuando se tenga la lista de las sucursales creamos el arreglo de las mismas y asiganamos para su uso posterior
          this.sucursales = this._publicos.crearArreglo2(snapshot.val())
          // llamamos a la siguiente accion cuando se tiene la informacion de las sucursales
          this.accion()
        } 
      }, {
        onlyOnce: true
      })
    }
  }
  accion(){
    const starCountRef = ref(db, `usuarios`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const usuarios = this._publicos.crearArreglo2(snapshot.val())
        const nuevos = usuarios.map(a=>{
          if(a.sucursal !=='Todas'){
            a.sucursalShow = this.sucursales.find(b=>b.id == a.sucursal).sucursal
          }else{
            a.sucursalShow = a.sucursal
          }
          return {
            sucursal: a.sucursal,
            usuario: a.usuario,
            sucursalShow: a.sucursalShow,
            password: a.password,
            correo: a.correo,
            rol: a.rol,
            status: a.status
          }
        })
        // console.log(nuevos);
        this.dataSource.data = nuevos
        this.newPagination()
      }
    }, {
        onlyOnce: true
    })
  }
  confidencial(info){
    let mostrar = (this.ROL === 'SuperSU' || this.ROL === 'Administrador') ? info.password : '********';
    const status = (info.status) ? 'Habilitado': 'Inhabilitado'
    // let mostrar2 = mostrar
    // if (mostrar === '********') {
    //   mostrar2 = (this.SUCURSAL !== 'Todas' && this.ROL === 'Gerente') ? info.password : '*********'
    // }
    if(this.SUCURSAL === info.sucursal && this.ROL === 'Gerente') mostrar = info.password 
    Swal.fire({
      title: '<h2 class="fw-bold text-uppercase">Información confidencial</h2>',
      html:`
      <h2 >${status}</h2>
      <table class="table">
        <tbody>
        <tr>
            <th class="text-start" scope="row">Sucursal</th>
            <td class="text-start">${info.sucursalShow}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Alias</th>
            <td class="text-start">${info.usuario}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">ROL</th>
            <td class="text-start">${info.rol}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Correo (Usuario)</th>
            <td class="text-start">${info.correo}</td>
          </tr>
          <tr>
            <th class="text-start" scope="row">Contraseña</th>
            <td class="text-start">${mostrar}</td>
          </tr>
          
        </tbody>
      </table>
      `,
      imageUrl: info.img,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    })
  }
  newPagination(){
    setTimeout(() => {
    // if (data==='elementos') {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    // }
    }, 500)
  }
 
}

