import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-reporte-gastos',
  templateUrl: './reporte-gastos.component.html',
  styleUrls: ['./reporte-gastos.component.css'],
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
export class ReporteGastosComponent implements OnInit {
  miniColumnas:number = 100
  ROL:string; SUCURSAL:string
  sucursales_arr=[]
  gastosOperacion_arr = []
  gastosDiarios_arr = []
  pagosGastosOP_arr = []
  
  listaConjunta_arr = []
  metodospago = [
    {valor:'1', show:'Efectivo', ocupa:'Efectivo'},
    {valor:'2', show:'Cheque', ocupa:'Cheque'},
    {valor:'3', show:'Tarjeta', ocupa:'Tarjeta'},
    {valor:'4', show:'Transferencia', ocupa:'Transferencia'},
    {valor:'5', show:'Credito', ocupa:'credito'},
    // {valor:4, show:'OpenPay', ocupa:'OpenPay'},
    // {valor:5, show:'Clip / Mercado Pago', ocupa:'Clip'},
    {valor:6, show:'Terminal BBVA', ocupa:'BBVA'},
    {valor:7, show:'Terminal BANAMEX', ocupa:'BANAMEX'}
  ]
  paquete: string = 'paquete'
  refaccion: string = 'refaccion'
  mo: string = 'mo'

  fechas_get = {inicio:new Date(), final: new Date()}

  rangeReporteGastos = new FormGroup({
    start: new FormControl(Date),
    end: new FormControl(Date),
  });

  // tabla
  dataSource = new MatTableDataSource(); //elementos
  elementos = ['id','sucursalShow','metodoShow','status','concepto','referencia','monto','tipo','fecha']; //elementos
  // elementos = ['id','no_os','searchCliente','searchPlacas','fechaRecibido','fechaEntregado']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('elementsPaginator') paginator: MatPaginator //elementos
  @ViewChild('elements') sort: MatSort //elementos


  reporte = {operacion:0, gastos:0, pagos:0, depositos:0,utilidad:0}

  camposReporte = [
    {valor:'depositos', show:'Depositos'},
    {valor:'pagos', show:'Pagos'},
    {valor:'operacion', show:'Operacion'},
    {valor:'gastos', show:'Gastos'},
    {valor:'utilidad', show:'Utilidad'},
  ]

  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.rol()
  }
  rol(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      this.ROL = this._security.servicioDecrypt(variableX['rol'])
      this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
      
      const starCountRef = ref(db, `sucursales`)
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            this.sucursales_arr = this._publicos.crearArreglo2(snapshot.val())
            this.gastosDiarios()
            this.gastosOperacion()
            this.ordenesServicios()
          }
        }, {
          onlyOnce: true
        })
    }
  }

  gastosDiarios(){
    const starCountRef = ref(db, `gastosDiarios`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let nuevosGO = []
        const gastosDiarios= this._publicos.crearArreglo(snapshot.val())
        gastosDiarios.forEach(go=>{
          const clavesDias = Object.keys(go)
          clavesDias.forEach(d=>{
            const nuevosD = this._publicos.crearArreglo2(go[d])
            // const nuevosD = this._publicos.crearArreglo2(go[d] || [])
            nuevosD.forEach(registro=>{
              registro.fechaCompara = this._publicos.construyeFechaString(registro.fecha)
              const {sucursal} = this.sucursales_arr.find(s=>s.id === registro.sucursal)
              registro.sucursalShow = sucursal,
              // registro.tipo = 'diario'
              nuevosGO.push(registro)
            })
          })
        })
        const filtro = (this.SUCURSAL === 'Todas') ? nuevosGO : nuevosGO.filter(g=>g.sucursal === this.SUCURSAL)
        this.gastosDiarios_arr = filtro
        // console.log('gastosDiarios_arr',filtro.length);
        setTimeout(() => {
          this.unirResultados()
        }, 500);
        
      }
    }, {
        onlyOnce: true
      })
  }
  gastosOperacion(){
    const starCountRef = ref(db, `HistorialGastosOperacion`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let gastosOperacion = []
        const gastosOp = this._publicos.crearArreglo2(snapshot.val())
        gastosOp.forEach(go=>{
          const {sucursal} = this.sucursales_arr.find(s=>s.id === go.sucursal)
          go.sucursalShow = sucursal
          go.tipo = 'operacion'
          go.fechaCompara = this._publicos.construyeFechaString(go.fecha)
          gastosOperacion.push(go)
        })
        const filtro = (this.SUCURSAL === 'Todas') ? gastosOperacion : gastosOperacion.filter(g=>g.sucursal === this.SUCURSAL)
        this.gastosOperacion_arr = filtro
        // console.log('gastosOperacion_arr',filtro.length);
        setTimeout(() => {
          this.unirResultados()
        }, 500);
      }
    }, {
        onlyOnce: true
      })
  }
  ordenesServicios(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        let recepciones= this._publicos.crearArreglo2(snapshot.val())
        // HistorialGastos
        // HistorialPagos
        let aquiDocumentos = []
        recepciones.map(os=>{
          
          os.hitorial_gastos = (os.HistorialGastos) ? this._publicos.crearArreglo2(os.HistorialGastos) : []
          os.historial_pagos = (os.HistorialPagos) ? this._publicos.crearArreglo2(os.HistorialPagos) : []

          os.historial_pagos.map(element => {
            element.tipoNuevo = 'pago'
          });
          os.hitorial_gastos.map(element => {
            element.tipoNuevo = 'gasto'
          });
          const nuevosHistoriales = os.hitorial_gastos.concat(os.historial_pagos)
          nuevosHistoriales.forEach(histo => {
            histo.fechaCompara = this._publicos.construyeFechaString(histo.fecha)
            const {sucursal} = this.sucursales_arr.find(s=>s.id === histo.sucursal)
            histo.sucursalShow = sucursal
            aquiDocumentos.push(histo)
          });
        })
        const filtro = (this.SUCURSAL === 'Todas') ? aquiDocumentos : aquiDocumentos.filter(os=>os.sucursal === this.SUCURSAL)
        // console.log(filtro);
        
        this.pagosGastosOP_arr = filtro
        // console.log('pagosGastosOP_arr',filtro.length);
        setTimeout(() => {
          this.unirResultados()
        }, 500);
        
      } else {
        console.log("No data available");
      }
    }, {
        onlyOnce: true
    })
  }
  unirResultados(){
    this.listaConjunta_arr = this.gastosOperacion_arr.concat( this.gastosDiarios_arr ).concat( this.pagosGastosOP_arr )
    this.realizarOperaciones()
  }
  realizarOperaciones(){
    const resultados = this.listaConjunta_arr
      .map((a,index) => {
        const { show } = this.metodospago.find(m => m.valor === String(a.metodo))
        a.metodoShow = show
        return a
      })
      .filter(a => a.fechaCompara >= this.fechas_get.inicio && a.fechaCompara <= this.fechas_get.final)
      const reporte =  {operacion:0, gastos:0, pagos:0, depositos:0,utilidad:0}
      // console.log(resultados);
      resultados.map((f,index)=>{
        f.index = index
        f.referencia = (f.referencia) ? f.referencia : ''
        if (f.tipo === 'deposito') reporte.depositos += f.monto 
        if (f.tipo === 'operacion') reporte.operacion += f.monto;
        (f.tipoNuevo === 'gasto') ? reporte.gastos += f.monto : reporte.pagos += f.monto
      })
      reporte.utilidad = (reporte.pagos + reporte.depositos) -  (reporte.gastos + reporte.operacion)
      this.reporte = reporte
      this.dataSource.data = resultados
      this.newPagination()
  }
  cambiosFechas(){
    const {start, end} = this.rangeReporteGastos.value
    if (start && end) {
      if (start['_d'] && end['_d']) {
        this.fechas_get = {inicio: start['_d'], final: end['_d']}
        // this.obternerfechas()
        this.unirResultados()
      }
    }
  }

  newPagination(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, 500);
  }

}



