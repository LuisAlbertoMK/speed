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
    private _vehiculos: VehiculosService
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
   cotizaciones = ['index','no_cotizacion','searchName','searchPlacas']; //cotizaciones
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
    
    this.cargandoInformacion = true
    this.accion()
    if(localStorage.getItem('busquedaCotizaciones')){
        this.busqueda = localStorage.getItem('busquedaCotizaciones')
    }
    if(localStorage.getItem('indexSaveLocal')){
        this.indexPosicionamiento = Number(localStorage.getItem('indexSaveLocal'))
    }
  }
  irPagina(pagina, cliente?, vehiculo?, cotizacion?,tipo?){
    // /:ID/:tipo/:extra
    let queryParams = {}
    if (pagina === 'historial-cliente') {
      queryParams = { anterior:'clientes', cliente  } 
    } else if (pagina === 'cotizacionNueva') {
      queryParams = { anterior:'cotizacion', cliente, tipo: 'cotizacion', vehiculo, cotizacion  } 
    }else if (pagina === 'ServiciosConfirmar' && !tipo) {
      queryParams = { anterior:'cotizacion', cliente, tipo: 'cotizacion', vehiculo, cotizacion  } 
    }else if (pagina === 'ServiciosConfirmar' && tipo) {
      queryParams = { anterior:'cotizacion', cliente, tipo: 'nueva', vehiculo, cotizacion  } 
    }
    this.router.navigate([`/${pagina}`], { queryParams });
  }
  accion(){
    
      console.time('Execution Time');

      const starCountRef = ref(db, `cotizacionesRealizadas`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            // console.log(snapshot.val());
            // const clientes_arr = this._publicos.crearArreglo2()
            const clientes_arr = snapshot.val()
            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childData = childSnapshot.val();
              // console.log(childKey);
              console.log(clientes_arr[childKey]);
              
              const  {cliente, vehiculo}  = clientes_arr[childKey]
              console.log(' vehiculo: ',clientes_arr[childKey].vehiculo);
              
              const starCountRef_cliente = ref(db, `clientes/${cliente}`)
              if (this.temp_data_clientes[cliente]) {
                clientes_arr[childKey].data_cliente = this.temp_data_clientes[cliente]
              }else{
                onValue(starCountRef_cliente, (snapshot_cliente) => {
                  clientes_arr[childKey].data_cliente =  snapshot_cliente.val()
                  this.temp_data_clientes[cliente] = snapshot_cliente.val()
                }, { onlyOnce: true })
              }
              const starCountRef_vehiculos = ref(db, `vehiculos/${vehiculo}`)
              if (this.temp_data_vehiculos[vehiculo]) {
                clientes_arr[childKey].data_vehiculo = this.temp_data_vehiculos[vehiculo]
              }else{
                onValue(starCountRef_vehiculos, (snapshot_vehiculo) => {
                  clientes_arr[childKey].data_vehiculo =  snapshot_vehiculo.val()
                  this.temp_data_vehiculos[vehiculo] = snapshot_vehiculo.val()
                }, { onlyOnce: true })
              }
            });
            console.log(this.temp_data_clientes);
            
            console.log(clientes_arr);
            
          } else {
            console.log("No data available");
          }
        })

        console.timeEnd('Execution Time');
    
    // const starCountRef = ref(db, `cotizacionesRealizadas`)
    // onValue(starCountRef, () => {

      // this._cotizacion.consulta_cotizaciones_new().then((cotizaciones) => {
      //   const info = (this.SUCURSAL !=='Todas') ? cotizaciones.filter(c=>c.sucursal.id === this.SUCURSAL) : cotizaciones
      //   if (!this.cotizacionesList.length) {
      //     this.cotizacionesList = info;
      //   } else {
      //     this.cotizacionesList = this._publicos.actualizarArregloExistente(this.cotizacionesList, info,[...this._cotizaciones.camposCotizaciones]);
      //   }
      //   this.cargandoInformacion = false
      //   this.newPagination()
      // }).catch((error) => {
      //   console.log(error);      
      // });
    // })
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
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort
      
    }, 500)
  }

  indexSaveLocal(index){
    this.indexPosicionamiento = index
    localStorage.setItem('indexSaveLocal',index)
  }
  
}
