import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,} from '@angular/core';
import {FormBuilder,  FormControl,  FormGroup,  NgForm,  Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { getDatabase, onValue, ref, set, push, get, child, limitToFirst } from 'firebase/database';
import { CotizacionService } from 'src/app/services/cotizacion.service';

import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { query, orderBy, limit } from 'firebase/firestore';
const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {
  nombre: string;
}

export interface Item { id: string; name: string; }
import { animate, state, style, transition, trigger } from '@angular/animations';

import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { EmailsService } from '../../services/emails.service';
import { ExporterService } from 'src/app/services/exporter.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';

registerLocaleData(localeES, 'es');
@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CotizacionComponent implements AfterViewInit, OnDestroy, OnInit {
  miniColumnas:number = 100
  ROL:string; SUCURSAL:string
  sucursales=[]
  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

   // tabla
   dataSource = new MatTableDataSource(); //cotizaciones
   cotizaciones = ['index','no_cotizacion','searchName','searchPlacas']; //cotizaciones
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; //cotizaciones
   expandedElement: any | null; //cotizaciones
   @ViewChild('cotizacionesPaginator') paginator: MatPaginator //cotizaciones
   @ViewChild('cotizaciones') sort: MatSort //cotizaciones


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
    {valor: 'sucursal', show:'Sucursal'}
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

  cotizacionesList=[]
  busqueda: string = null

  indexPosicionamiento:number = null
  constructor(
    private fb: FormBuilder, private _publicos: ServiciosPublicosService,
    private _formBuilder: FormBuilder, private _security:EncriptadoService,
    private router: Router, private _cotizaciones: CotizacionService,
    private _email:EmailsService, private rutaActiva: ActivatedRoute,  private _exportExcel: ExporterService,
    private _sucursales: SucursalesService,private _clientes:ClientesService,
  ) {
    // this.itemsCollection = this.afs.collection<Item>('partesAuto');
    // this.items = this.itemsCollection.valueChanges()
   
  }

  async ngOnInit() {
    // this.listaSucursales()
    this.rol();
    
  }
  ngAfterViewInit(): void { 
  }
  ngOnDestroy(): void {}
  rol() {
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
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
    
    if(localStorage.getItem('busquedaCotizaciones')){
        this.busqueda = localStorage.getItem('busquedaCotizaciones')
    }
    if(localStorage.getItem('indexSaveLocal')){
        this.indexPosicionamiento = Number(localStorage.getItem('indexSaveLocal'))
    }
  }
  accion(){
    // console.log(this.sucursales);
    //obtener las Realizadas
    const starCountRef = ref(db, `cotizacionesRealizadas`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const cotizaciones = this._publicos.crearArreglo2(snapshot.val())
        cotizaciones.forEach((cotizacion, index)=> {
          cotizacion.formaPago = cotizacion.formaPago || '1';
          cotizacion.index = index
          const formaPago = this.formasPago.find(f => f.id === cotizacion.formaPago);
          if (formaPago) cotizacion.pagoName = formaPago.pago
          cotizacion.searchName = `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellidos}`;
          cotizacion.searchPlacas = `${cotizacion.vehiculo.placas}`;
          
        });
        
        this.cotizacionesList = this.SUCURSAL === 'Todas' 
          ? cotizaciones 
          : cotizaciones.filter(cotizacion => cotizacion.sucursal.id === this.SUCURSAL);
        
        this.newPagination()
      }
    }, {
      onlyOnce: true
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    localStorage.setItem('busquedaCotizaciones',filterValue.trim().toLowerCase())
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //paginacion de las cotizaciones
  newPagination(){
    setTimeout(() => {
      this.dataSource.data = this.cotizacionesList
      if (this.busqueda) {
        this.dataSource.filter = this.busqueda
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }, 500)
  }

  indexSaveLocal(index){
    this.indexPosicionamiento = index
    localStorage.setItem('indexSaveLocal',index)
  }
  
}
