import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { child, get, getDatabase, onValue, ref, set, push } from 'firebase/database';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
const db = getDatabase()
const dbRef = ref(getDatabase());


import * as XLSX from 'xlsx';
import { ExporterService } from 'src/app/services/exporter.service';
import { ServiciosService } from '../../services/servicios.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

@Component({
  selector: 'app-historial-cliente',
  templateUrl: './historial-cliente.component.html',
  styleUrls: ['./historial-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistorialClienteComponent implements OnInit {
  miniColumnas:number = 100
  ROL:string; SUCURSAL:string
  sucursales_arr=[]
  //informacion de cliente
  cliente = {cliente:{}, vehiculos:[], cotizaciones:[],servicios:[]}

  camposCliente=[
    {valor: 'no_cliente', show:'# Cliente'},
    {valor: 'nombre', show:'Nombre'},
    {valor: 'apellidos', show:'Apellidos'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'},
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    // {valor: 'sucursal', show:'Sucursal'}
  ]
  camposVehiculo=[
    {valor: 'placas', show:'Placas'},
    {valor: 'marca', show:'marca'},
    {valor: 'modelo', show:'modelo'},
    {valor: 'anio', show:'añio'},
    {valor: 'categoria', show:'categoria'},
    {valor: 'cilindros', show:'cilindros'},
    {valor: 'engomado', show:'engomado'},
    {valor: 'color', show:'color'},
    {valor: 'transmision', show:'transmision'},
    {valor: 'no_motor', show:'No. Motor'},
    {valor: 'vinChasis', show:'vinChasis'},
    {valor: 'marcaMotor', show:'marcaMotor'}
  ]
  formasPago=[
    {id:'1',pago:'contado',interes:0,numero:0},
    {id:'2',pago:'3 meses',interes:4.49,numero:3},
    {id:'3',pago:'6 meses',interes:6.99,numero:6},
    {id:'4',pago:'9 meses',interes:9.90,numero:9},
    {id:'5',pago:'12 meses',interes:11.95,numero:12},
    {id:'6',pago:'18 meses',interes:17.70,numero:18},
    {id:'7',pago:'24 meses',interes:24.,numero:24}
  ]
  tiemoReal: true

   // tabla
   dataSource = new MatTableDataSource(); //elementos
   elementos = ['index','placas','marca','modelo']; //elementos
   columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
   expandedElement: any | null; //elementos
   @ViewChild('VehiculosPaginator') paginator: MatPaginator //elementos
   @ViewChild('Vehiculos') sort: MatSort //elementos



  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private rutaActiva: ActivatedRoute) { }


  async ngOnInit() {
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
          this.sucursales_arr = this._publicos.crearArreglo2(snapshot.val())
          // llamamos a la siguiente accion cuando se tiene la informacion de las sucursales
        } 
      }, {
        onlyOnce: !this.tiemoReal
      })
    }
    this.acciones()
  }
  acciones(){
    const idCliente = this.rutaActiva.snapshot.params['idCliente']
    const starCountRef = ref(db, `clientes/${idCliente}`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const infoCliente = snapshot.val()
        const vehiculos = (infoCliente.vehiculos) ? this._publicos.crearArreglo2(infoCliente.vehiculos) : []
        // console.log(vehiculos);
        // vehiculos.forEach((v,index)=>{ v.index = index})
        console.log(vehiculos);
        
        const camposCliente = [...this._publicos.camposCliente()]
        const recuperda = this._publicos.nuevaRecuperacionData(infoCliente,camposCliente)
        // console.log(recuperda);
        this.cliente.cliente = recuperda
        // this.cliente.vehiculos = vehiculos
        this.dataSource.data = vehiculos
        this.ordenamiento('placas')
      } 
    }, {
      onlyOnce: !this.tiemoReal
    })
  }

  //realziar paginacion de los resultados 
  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }, 500)
  }
  ordenamiento(campo){
    const nueva = [...this.dataSource.data];
    this.dataSource.data = this._publicos.ordenarData(nueva, campo, true);
    this.newPagination();
  }
}
