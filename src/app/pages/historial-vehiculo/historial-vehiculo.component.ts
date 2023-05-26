import { Component, OnInit, ViewChild } from '@angular/core';
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';
//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosService } from '../../services/servicios.service';
import { CotizacionService } from '../../services/cotizacion.service';
const db = getDatabase();
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-historial-vehiculo',
  templateUrl: './historial-vehiculo.component.html',
  styleUrls: ['./historial-vehiculo.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistorialVehiculoComponent implements OnInit {
  ROL:string='';SUCURSAL:string =''; idVehiculo:string =''; dataVehiculo:any=[]; sinDataVehiculo:boolean= false; dataCliente:any=[]; dataSucursal:any=[];
  clickedRows = new Set<any>();
  dataSource = new MatTableDataSource();
  
  dataSourceCotizaciones = new MatTableDataSource(); 
  @ViewChild('paginatorCotizacion') paginatorCotizaciones: MatPaginator;@ViewChild('tabCotizacion') sortCotizaciones: MatSort; 
  dataSourceRecepciones = new MatTableDataSource(); 
  @ViewChild('paginatorRecepciones') paginatorRecepciones: MatPaginator;@ViewChild('tabRecepciones') sortRecepciones: MatSort; 
  
  columsCotizaciones:  string[] = ['no_cotizacion','placas','servicio','fecha']
  columsCotizacionesExtended:  string[] = [...this.columsCotizaciones,'expand'];

  columsRecepciones:  string[] = ['no_os','placas','servicio','fecha']
  columsRecepcionesExtended:  string[] = [...this.columsRecepciones,'expand'];
  // columsHistorialCotizacion:  string[] = ['servicio','total','fecha', 'hora']; 
  // columsHistorialCotizacionExtended:  string[] = [...this.columsHistorialCotizacion,'expand'];
  expandedElement: any | null; listaSucursales:any=[]; vehiculo:any=[]; cliente:any=[]; sucursales:any =[]
  miniColumnas:number = 100; ambosDatos:any=[]; complementosShow:any=[]; paqueteData:string ='';
  totalCotizado:number = 0; subtotalCotizado:number = 0; dataPaquete:any=[]

  elementospaquete:any=[];infoPaquete:any=[]; 

  campos_vehiculo = [
    {muestra: 'placas', campo:'placas'},{muestra: 'marca', campo:'marca'},{muestra: 'modelo', campo:'modelo'},
    {muestra: 'color', campo:'color'},{muestra: 'año', campo:'anio'},{muestra: 'transmision', campo:'transmision'},
    {muestra: 'engomado', campo:'engomado'},{muestra: 'No. motor', campo:'no_motor'},{muestra: 'vinChasis', campo:'vinChasis'}
  ]
  campos_cliente = [
    {muestra: 'nombre', campo:'fullname'},{muestra: 'correo', campo:'correo'},{muestra: 'correo adicional', campo:'correo_sec'},
    {muestra: 'tel. movil', campo:'telefono_movil'},{muestra: 'tek. fijo', campo:'telefono_fijo'},{muestra: 'tipo', campo:'tipo'},
    {muestra: 'empresa', campo:'empresa'},{muestra: 'Sucursal', campo:'nameSucursal'}
  ]
  campos_desgloce = [
    {nombre:'IVA',valor:'IVA'}, {nombre:'U.B',valor:'UB'}, {nombre:'Refacciones adquisicion',valor:'refacciones1'},
    {nombre:'Refacciones venta',valor:'refacciones2'},{nombre:'total MO',valor:'totalMO'},{nombre:'Costo sobrescrito',valor:'sobrescrito'},
    {nombre:'subtotal',valor:'subtotal'}, {nombre:'total',valor:'total'}
  ]
  info_Degloce = {IVA:0,UB:0,refacciones1:0,refacciones2:0,sobrescrito:0,subtotal:0,total:0,totalMO:0}
  info_Degloce_recepciones = {IVA:0,UB:0,refacciones1:0,refacciones2:0,sobrescrito:0,subtotal:0,total:0,totalMO:0}

  servicios=[
    {valor:1,nombre:'servicio'},
    {valor:2,nombre:'garantia'},
    {valor:3,nombre:'retorno'},
    {valor:4,nombre:'venta'},
    {valor:5,nombre:'preventivo'},
    {valor:6,nombre:'correctivo'},
    {valor:7,nombre:'rescate vial'}
  ]
  constructor(private rutaActiva: ActivatedRoute,private _security:EncriptadoService,private _servicios: ServiciosService,
              private _cotizaciones: CotizacionService
    ) { }

  ngOnInit(): void {
    this.rol()
  }

  rol(){
    // this.ROL =localStorage.getItem('tipoUsuario')
    // this.SUCURSAL =localStorage.getItem('sucursal')
    
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    this.ROL = this._security.servicioDecrypt(variableX['rol'])
    this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])

    this.idVehiculo = this.rutaActiva.snapshot.params['idvehiculo']
    if (this.idVehiculo!=='') {
    }
  }

}
