import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-estadisticas-cliente',
  templateUrl: './estadisticas-cliente.component.html',
  styleUrls: ['./estadisticas-cliente.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EstadisticasClienteComponent implements OnInit {

  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService,
  private _cotizaciones: CotizacionesService,private _servicios: ServiciosService, private _clientes: ClientesService) { }


  rol_cliente:string = 'cliente'
  camposReporte = [...this._cotizaciones.camposReporte]
  camposReporte_show = [...this._cotizaciones.camposReporte_show]
  camposReporte_show2 = {...this._cotizaciones.camposReporte_show2}

  miniColumnas:number = 100

  campos_estadisticas_show = [
    {valor: 'servicios_gen', show:'Total de servicios', symbol:''},
    {valor: 'ticketPromedioFinal', show:'Ticket promedio servicios', symbol:'$'},
    {valor: 'gasto_gen', show:'Gasto total', symbol:'$'},
  ]
  campos_estadisticas = { ticketPromedioFinal:0 ,servicios_gen:0,gasto_gen:0 }

  clavesVehiculos = []

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['placas','marca','modelo','categoria','anio']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos


  ngOnInit(): void {
    this.rol()
  }
  rol(){
    const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
    const rol = this._security.servicioDecrypt(variableX['rol'])
    const ID_cliente = this._security.servicioDecrypt(variableX['usuario'])
    if (rol === this.rol_cliente && ID_cliente) this.obtenerInformacion_cliente(ID_cliente) 
  }
  async obtenerInformacion_cliente(cliente:string){

    const vehiculos = await this._clientes.consulta_cliente_vehiculos(cliente)
    // console.log(vehiculos);
    const vehiculos_ids:any[] = vehiculos.map(c=> { return c.id })

    const starCountRef_recepciones = ref(db, `recepciones`);
    onValue(starCountRef_recepciones, async (snapshot) => {
      const recepciones = await this._servicios.consulta_recepciones_new();
      
      const recepciones_filter = recepciones.filter((c) => c.cliente.id === cliente);
      let ticketGeneral = 0
      
      const servicios_gen = recepciones_filter.length, info = {};
      vehiculos_ids.forEach((v) => {

        const servicios_totales = recepciones_filter.filter((ser) => ser.vehiculo.id === v);
        const data = vehiculos.find((ve) => ve.id === v);
        const reporteSum = {...this.camposReporte_show2};
        recepciones_filter.forEach((coti) => {
          const { reporte } = coti;
          if (v === coti.vehiculo.id) {
            this.camposReporte.forEach((c) => {
              reporteSum[c] += Number(reporte[c]);
            });
            info[v] = { data, servicios_totales: servicios_totales.length,ticketPromedio:0, reporte: { ...reporteSum } };
            info[v].ticketPromedio = info[v].reporte['total'] / info[v].servicios_totales
          }
        });
      });
      this.clavesVehiculos = this._publicos.crearArreglo2(info)
      this.clavesVehiculos.map(coti=>{
        const  {data} = coti
        coti['searchPlacas'] = data.placas
        coti['searchMarca'] = data.marca
        coti['searchModelo'] = data.modelo
        coti['searchCategoria'] = data.categoria
        coti['searchAnio'] = data.anio
        ticketGeneral += Number(coti.reporte['total'])
      })

      console.log(this.clavesVehiculos);
      

      this.dataSource.data = this.clavesVehiculos
      this.newPagination()

      this.campos_estadisticas = { 
        ticketPromedioFinal: ticketGeneral / servicios_gen, 
        servicios_gen, 
        gasto_gen: ticketGeneral }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
