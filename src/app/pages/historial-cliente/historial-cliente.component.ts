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
  camposDesgloce = [
    {valor:'mo', show:'mo'},
    // {valor:'refacciones_a', show:'refacciones a'},
    {valor:'refacciones_v', show:'refacciones'},
    {valor:'sobrescrito_mo', show:'sobrescrito mo'},
    {valor:'sobrescrito_refaccion', show:'sobrescrito refaccion'},
    {valor:'sobrescrito_paquetes', show:'sobrescrito paquete'},
    {valor:'sobrescrito', show:'sobrescrito'},
    {valor:'descuento', show:'descuento'},
    {valor:'subtotal', show:'subtotal'},
    {valor:'iva', show:'iva'},
    {valor:'total', show:'total'},
    {valor:'meses', show:'meses'},
  ]
  estatusServicioUnico = [
    {valor: 'aprobado'   , show: 'Aprobar'},
    {valor: 'Noaprobado'  , show: 'No Aprobado'},
    {valor: 'terminar'   , show: 'Terminado'},
    {valor: 'eliminado'  , show: 'Eliminar'},
    {valor: 'cancelado'  , show: 'Cancelado'}
  ]
  statusOS = [
    {valor: 'espera'   , show: 'Espera'},
    {valor: 'recibido'   , show: 'Recibido'},
    {valor: 'autorizado'  , show: 'Autorizado'},
    {valor: 'terminado'   , show: 'Terminado'},
    {valor: 'entregado'  , show: 'Entregado'},
    {valor: 'cancelado'  , show: 'Cancelado'}
  ]
  tiemoReal: true

  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

   // tabla
   dataSource = new MatTableDataSource(); //elementos
   elementos = ['index','placas','marca','modelo']; //elementos
   columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
   expandedElement: any | null; //elementos
   @ViewChild('VehiculosPaginator') paginator: MatPaginator //elementos
   @ViewChild('Vehiculos') sort: MatSort //elementos

   // tabla
   dataSourceCotizaciones = new MatTableDataSource(); //elementos
   cotizaciones =  ['index','no_cotizacion','searchName','searchPlacas']; //cotizaciones
   columnsToDisplayWithExpandCotizaciones = [...this.cotizaciones, 'opciones', 'expand']; //elementos
   expandedElementCotizaciones: any | null; //elementos
   @ViewChild('CotizacionesPaginator') paginatorCotizaciones: MatPaginator //elementos
   @ViewChild('Cotizaciones') sortCotizaciones: MatSort //elementos

   // tabla
   dataSourceRecepciones = new MatTableDataSource(); //elementos
   recepciones = ['id','no_os','searchName','searchPlacas','fechaRecibido','fechaEntregado'];//recepciones
   columnsToDisplayWithExpandRecepciones = [...this.recepciones, 'opciones', 'expand']; //elementos
   expandedElementRecepciones: any | null; //elementos
   @ViewChild('RecepcionesPaginator') paginatorRecepciones: MatPaginator //elementos
   @ViewChild('Recepciones') sortRecepciones: MatSort //elementos

  ordenamiento_Asc_vehiculos: boolean = true
  campoSelect_vehiculos = 'placas'
  ordenamiento_Asc_cotizaciones: boolean = true
  campoSelect_cotizaciones = 'no_cotizacion'
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
        
        // console.log(vehiculos);
        
        const camposCliente = [...this._publicos.camposCliente()]
        const recuperda = this._publicos.nuevaRecuperacionData(infoCliente,camposCliente)
        // console.log(recuperda);
        this.cliente.cliente = recuperda
        // this.cliente.vehiculos = vehiculos
        // vehiculos.forEach((v,index)=>{ v.index = index})
        this.dataSource.data = vehiculos
        this.ordenamiento('vehiculos','placas')
      } 
    }, {
      onlyOnce: !this.tiemoReal
    })
    const starCountRefCotizaciones = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRefCotizaciones, (snapshot) => {
      if (snapshot.exists()) {
        const cotizaciones = this._publicos.crearArreglo2(snapshot.val())
        const filtro = cotizaciones.filter(c=>c.cliente.id === idCliente)
        filtro.map(cotizacion=>{
          cotizacion.searchName = `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellidos}`;
          cotizacion.searchPlacas = `${cotizacion.vehiculo.placas}`;
          const {reporte, ocupados} = this._publicos.realizarOperaciones_2(cotizacion)
          cotizacion.reporte = reporte
          cotizacion.elementos = ocupados
        })
        console.log(filtro);
        this.dataSourceCotizaciones.data = filtro
        this.ordenamiento('cotizaciones','no_cotizacion')
      }else{

      }
    }, {
        onlyOnce: true
    })
    const starCountRefRecepciones = ref(db, `recepciones`)
    onValue(starCountRefRecepciones, (snapshot) => {
      if (snapshot.exists()) {
        const recepciones = this._publicos.crearArreglo2(snapshot.val())
        const filtro = recepciones.filter(c=>c.cliente.id === idCliente)
        
        
        filtro.map(recepcion=>{
          recepcion.searchName = `${recepcion.cliente.nombre} ${recepcion.cliente.apellidos}`;
          recepcion.searchPlacas = `${recepcion.vehiculo.placas}`;
        })
        this.dataSourceRecepciones.data = filtro
        this.ordenamiento('recepciones','id')
      } else {
        
      }
    }, {
        onlyOnce: true
    })
  }

  //realziar paginacion de los resultados 
  newPagination(tabla){
    setTimeout(() => {
      let dataSource;
      let paginator;
      let sort;
  
      if (tabla === 'vehiculos') {
        dataSource = this.dataSource;
        paginator = this.paginator;
        sort = this.sort;
      } else if (tabla === 'cotizaciones') {
        dataSource = this.dataSourceCotizaciones;
        paginator = this.paginatorCotizaciones;
        sort = this.sortCotizaciones;
      } else if (tabla === 'recepciones') {
        dataSource = this.dataSourceRecepciones;
        paginator = this.paginatorRecepciones;
        sort = this.sortRecepciones;
      }
  
      if (dataSource && paginator && sort) {
        dataSource.paginator = paginator;
        dataSource.sort = sort;
      }
    }, 500);
  }
  ordenamiento(tabla,campo){
    let dataSource;
    let campoSelect;
    let odena_asc 
    
      if (tabla === 'vehiculos') {
        dataSource = this.dataSource;
        campoSelect = this.campoSelect_vehiculos;
        // this.campoSelect_vehiculos = campo
        odena_asc = this.ordenamiento_Asc_vehiculos
      } else if (tabla === 'cotizaciones') {
        dataSource = this.dataSourceCotizaciones;
        campoSelect = this.campoSelect_cotizaciones;
        odena_asc = this.ordenamiento_Asc_cotizaciones
        // this.campoSelect_cotizaciones = campo
      } else if (tabla === 'recepciones') {
        dataSource = this.dataSourceRecepciones;
        // campoSelect = this.campoSelect_vehiculos;
      }
      if (dataSource) {
        const nueva = [...dataSource.data];
        campoSelect = campo;
        const ordenados = this._publicos.ordenarData(nueva, campo, odena_asc);
        ordenados.forEach((v, index) => {
          v.index = index;
        });
        dataSource.data = ordenados;
        this.newPagination(tabla);
      }
  }
}
