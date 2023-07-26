import {AfterViewInit,Component,OnDestroy,OnInit,ViewChild,} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SucursalesService } from 'src/app/services/sucursales.service';

import { getDatabase, onValue, ref, set, push, get, child, limitToFirst } from 'firebase/database';
import { CotizacionService } from 'src/app/services/cotizacion.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
export interface User {
  nombre: string;
}

export interface Item { id: string; name: string; }
import { animate, state, style, transition, trigger } from '@angular/animations';

import localeES from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { CamposSystemService } from '../../services/campos-system.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { ExporterService } from '../../services/exporter.service';

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
  
  constructor(
    private _publicos: ServiciosPublicosService, private _security:EncriptadoService, private _campos: CamposSystemService,
    private router: Router, private _sucursales: SucursalesService, private _cotizacion: CotizacionService,
    private _servicios: ServiciosService, private _cotizaciones: CotizacionesService, private _clientes: ClientesService,
    private _vehiculos: VehiculosService, private rutaActiva: ActivatedRoute, private _exporter_excel: ExporterService
  ) {
    // this.itemsCollection = this.afs.collection<Item>('partesAuto');
    // this.items = this.itemsCollection.valueChanges()
   
  }
  
  ROL:string; SUCURSAL:string
  
  paquete: string     =  this._campos.paquete
  refaccion: string   =  this._campos.refaccion
  mo: string          =  this._campos.mo
  miniColumnas:number =  this._campos.miniColumnas

   // tabla
   dataSource = new MatTableDataSource(); //cotizaciones
   cotizaciones = ['index','no_cotizacion','fullname','placas']; //cotizaciones
   columnsToDisplayWithExpand = [...this.cotizaciones, 'opciones', 'expand']; //cotizaciones
   expandedElement: any | null; //cotizaciones
   @ViewChild('cotizacionesPaginator') paginator: MatPaginator //cotizaciones
   @ViewChild('cotizaciones') sort: MatSort //cotizaciones


  camposDesgloce   =  [ ...this._cotizaciones.camposDesgloce ]
  camposCliente    =  [ ...this._clientes.camposCliente_show ]
  camposVehiculo   =  [ ...this._vehiculos.camposVehiculo_ ]
  formasPago       =  [ ...this._cotizaciones.formasPago ]
  sucursales_array =  [ ...this._sucursales.lista_en_duro_sucursales ]

  cotizacionesList=[]
  busqueda: string = null

  indexPosicionamiento:number = null
  cargandoInformacion:boolean = true
  temp_data_clientes = {}
  temp_data_vehiculos = {}
  enrutamiento = {cliente:'', sucursal:'', recepcion:'', tipo:'', anterior:'', vehiculo:''}

  filtro_sucursal:string 
  async ngOnInit() {
    // this.listaSucursales()
    this.rol();
    
  }
  ngAfterViewInit(): void { 
  }
  ngOnDestroy(): void {}
  rol() {
    const { rol, sucursal } = this._security.usuarioRol()

    this.ROL = rol
    this.SUCURSAL = sucursal

    this.filtro_sucursal = sucursal
    this.rutaActiva.queryParams.subscribe((params:any) => {
      this.enrutamiento = params
      // this.cargaDataCliente_new()
      this.accion()
    });
  }
  irPagina(pagina, data){
    // console.log(data);
    const {cliente, sucursal, id: idCotizacion, tipo } = data
    // console.log(this.enrutamiento);
    let queryParams = {}
    if (pagina === 'cotizacionNueva' && !tipo) {
      queryParams = { anterior:'cotizacion',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion'} 
    }else if (pagina === 'cotizacionNueva' && tipo) {
      queryParams = { anterior:'cotizacion', tipo} 
    }else if (pagina === 'ServiciosConfirmar' && !tipo) {
      queryParams = { anterior:'cotizacion',cliente, sucursal, cotizacion: idCotizacion, tipo:'cotizacion'} 
    }else if (pagina === 'ServiciosConfirmar' && tipo) {
      queryParams = { anterior:'cotizacion', tipo}
    }
    // console.log(queryParams);
    
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  async accion(){
    this.cargandoInformacion = true
    console.time('Execution Time');
    
    const busqueda = (this.SUCURSAL === 'Todas') ? 'cotizacionesRealizadas': `cotizacionesRealizadas/${this.SUCURSAL}`
    // console.log(busqueda);
    // const clientes = await this._cotizaciones.consulta_cotizaciones_({ruta: busqueda, sucursal: this.SUCURSAL})
    const cotizaciones = await this._cotizaciones.consulta_cotizaciones_({ruta: busqueda, sucursal: this.SUCURSAL})
    
    this.cotizacionesList = cotizaciones
    // this.newPagination()
    this.filtra_informacion()

    console.timeEnd('Execution Time');

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // localStorage.setItem('busquedaCotizaciones',filterValue.trim().toLowerCase())
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //paginacion de las cotizaciones
  newPagination(arreglo){
    setTimeout(() => {
      arreglo.map((c,index)=>{
        c.index = index
      })
      this.dataSource.data = arreglo
      this.cargandoInformacion = false
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
    }, 300)
  }

 

  filtra_informacion(){
    // console.log(this.filtro_sucursal);
    const resultados = (this.filtro_sucursal === 'Todas') ? this.cotizacionesList : this.cotizacionesList.filter(c=>c.sucursal === this.filtro_sucursal)
    this.newPagination(resultados)
  }
  exportar(){
    if (this.cotizacionesList.length) {
      this._exporter_excel.exportToExcelCotizaciones(this.dataSource.data,'exportacion')
    }else{
      this._publicos.swalToast('ningun dato ...',0, 'top-start')
    }
  }
  
}
