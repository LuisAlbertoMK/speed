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
import { SucursalesService } from 'src/app/services/sucursales.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UpdateUserComponent } from 'src/app/components/update-user/update-user.component';
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
 

  constructor(
    private _security:EncriptadoService, private rutaActiva: ActivatedRoute, private _publicos: ServiciosPublicosService,
    private router: Router, private _sucursales: SucursalesService, private _campos: CamposSystemService, private _bottomSheet: MatBottomSheet) { }

    miniColumnas:number = this._campos.miniColumnas
    sucursales_array = [ ...this._sucursales.lista_en_duro_sucursales]
    ROL:string; SUCURSAL:string
    // sucursales=[]
  
     // tabla
     dataSource = new MatTableDataSource(); //elementos
     elementos = ['nombre','sucursalShow','correo','rol']; //elementos
     columnsToDisplayWithExpand = [...this.elementos, 'opciones','expand']; //elementos
     expandedElement: any | null; //elementos
     @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
     @ViewChild('elements') sort: MatSort //elementos
  
  
     usuarioS:{}
  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const { rol, sucursal } = this._security.usuarioRol()
    this.ROL = rol
    this.SUCURSAL = sucursal
    this.accion()
  }
  accion(){
    const starCountRef = ref(db, `usuarios`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const usuarios = this._publicos.crearArreglo2(snapshot.val())
        const nuevos = usuarios.map(a=>{
          if(a.sucursal !=='Todas'){
            a.sucursalShow = this.sucursales_array.find(b=>b.id == a.sucursal).sucursal
          }else{
            a.sucursalShow = a.sucursal
          }
          return {
            id: a.id,
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
        setTimeout(() => {
          this.dataSource.data = nuevos
          this.newPagination()
        }, 1000);
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
  obtenerinfo(data){
    const bottomSheetRef = this._bottomSheet.open(UpdateUserComponent,{ data });
    // bottomSheetRef.afterDismissed().subscribe(() => {
    //   console.log('Bottom sheet has been dismissed.');
    // });
    
    // bottomSheetRef.dismiss();
  }
}

