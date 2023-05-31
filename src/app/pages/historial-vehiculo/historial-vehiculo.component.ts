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
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
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
  ROL:string='';SUCURSAL:string ='';
  reporte_Cotizaciones={subtotal:0, iva:0, total:0}
  reporte_Recepciones={subtotal:0, iva:0, total:0}
  campos_reportes = ['subtotal','iva','total']
  
  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

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


  // tabla
  dataSourceCotizaciones = new MatTableDataSource(); //elementos
  cotizaciones =  ['index','no_cotizacion','fullname','searchPlacas']; //cotizaciones
  columnsToDisplayWithExpandCotizaciones = [...this.cotizaciones, 'opciones', 'expand']; //elementos
  expandedElementCotizaciones: any | null; //elementos
  @ViewChild('CotizacionesPaginator') paginatorCotizaciones: MatPaginator //elementos
  @ViewChild('Cotizaciones') sortCotizaciones: MatSort //elementos

  // tabla
  dataSourceRecepciones = new MatTableDataSource(); //elementos
  recepciones = ['id','no_os','fullname','searchPlacas','fechaRecibido','fechaEntregado'];//recepciones
  columnsToDisplayWithExpandRecepciones = [...this.recepciones, 'opciones', 'expand']; //elementos
  expandedElementRecepciones: any | null; //elementos
  @ViewChild('RecepcionesPaginator') paginatorRecepciones: MatPaginator //elementos
  @ViewChild('Recepciones') sortRecepciones: MatSort //elementos
  constructor(private rutaActiva: ActivatedRoute,private _security:EncriptadoService,private _servicios: ServiciosService,
              private _cotizaciones: CotizacionesService, private _publicos: ServiciosPublicosService
    ) { }

  ngOnInit(): void {
    this.rol()
  }

  rol(){
    
    this.acciones()
  }
  acciones(){
    const idVehiculo = this.rutaActiva.snapshot.params['idvehiculo']
    console.log(idVehiculo);
    
    this._cotizaciones.consulta_cotizaciones_new().then((cotizaciones)=>{
      const mis_cotizaciones = cotizaciones.filter(c=>c.vehiculo.id === idVehiculo)
      this.reporte_Cotizaciones = this._publicos.reporte_cotizaciones_recepciones(mis_cotizaciones)
      mis_cotizaciones.map((c,index)=>{ c.index = index})
      this.dataSourceCotizaciones.data = mis_cotizaciones
      this.newPagination('cotizaciones')
    })
    this._cotizaciones.consulta_recepciones_new().then((recepciones)=>{
      const mis_recepciones = recepciones.filter(c=>c.vehiculo.id === idVehiculo)
      this.reporte_Recepciones = this._publicos.reporte_cotizaciones_recepciones(mis_recepciones)
    })
  }

  newPagination(tabla){
    setTimeout(() => {
      let dataSource;
      let paginator;
      let sort;
  
      if (tabla === 'cotizaciones') {
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

}
