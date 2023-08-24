import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, AfterContentChecked} from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { CotizacionesService } from 'src/app/services/cotizaciones.service';
import { ServiciosService } from 'src/app/services/servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

import {MatTableDataSource, MatTableModule} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { CamposSystemService } from 'src/app/services/campos-system.service';

import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { FormControl, FormGroup } from '@angular/forms';

import { ViewEncapsulation, LOCALE_ID } from '@angular/core';
import { VehiculosService } from 'src/app/services/vehiculos.service';

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
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class EstadisticasClienteComponent implements OnInit{
  
  constructor(private _security:EncriptadoService, private _publicos: ServiciosPublicosService,
  private _campos: CamposSystemService, private _vehiculos: VehiculosService,
  private _cotizaciones: CotizacionesService,private _servicios: ServiciosService, private _clientes: ClientesService,
  private router: Router) { registerLocaleData(localeEs) }
  

  rol_cliente:string = 'cliente'
  camposReporte        = [  ...this._cotizaciones.camposReporte  ]
  camposReporte_show   = [  ...this._cotizaciones.camposReporte_show  ]
  camposReporte_show2  = {  ...this._cotizaciones.camposReporte_show2  }
  formasPago       =  [ ...this._cotizaciones.formasPago ]

  miniColumnas:number  = this._campos.miniColumnas

  campos_estadisticas_show = [
    {valor: 'servicios_gen', show:'Total de servicios', symbol:''},
    {valor: 'ticketPromedioFinal', show:'Ticket promedio servicios', symbol:'$'},
    {valor: 'gasto_gen', show:'Gasto total', symbol:'$'},
  ]
  campos_estadisticas = { ticketPromedioFinal:0 ,servicios_totales:0,ticketGeneral:0 }

  clavesVehiculos = []
  calves_vehiculos_new = []
  vehiculos_new = []

  dataSource = new MatTableDataSource(); //elementos
  elementos = ['placas','marca','modelo','categoria','anio']; //elementos
  columnsToDisplayWithExpand = [...this.elementos, 'opciones', 'expand']; //elementos
  expandedElement: any | null; //elementos
  @ViewChild('cotizacionesPaginator') paginator: MatPaginator //elementos
  @ViewChild('cotizaciones') sort: MatSort //elementos

  @ViewChild('guet') divElement: ElementRef;

  recepciones_generales = []
  ///variables para las estadisticas
  infoSelect = {value: 0, name:'--------',contador: 0,arreglo:[]}
  view: [number, number] = [600, 400];
  width = 600;
  height = 400;
  legend_general: boolean = false;
  showText_general: boolean = false;
  legend: boolean = true;
  animations: boolean = true;    
  legendPosition= LegendPosition.Below;
  legendTitle_general = ''
  single_generales = [ ]
  clonado = []
  single_auto = []
  colorScheme:Color = {
    group: ScaleType.Ordinal, 
    selectable: true, 
    name: 'Customer Usage', 
    domain: ['#7aa3fc', '#f6a562', '#6fd5a4', '#97ea80']
  };
  gaugeUnits: string = '';
  gaugeTextValue: string = 'nuevo';
   // margin
   margin: boolean = false;
   marginTop: number = 40;
   marginRight: number = 10;
   marginBottom: number = 40;
   marginLeft: number = 10;
   showAxis:boolean = true
   
    //grafica comparativa
    single = []
    view_comparativa: [number, number] = [400, 400];
    clonado_busqueda = []
    infoSelect_busqueda = {value: 0, name:'--------',contador: 0,arreglo:[]}
    // options
      gradient: boolean = true;
      showLegend: boolean = true;
      showLabels: boolean = true;
      isDoughnut: boolean = false;
      // legendPosition: string = 'below';
    
      // colorScheme = {
      //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
      // };
      muestra_busqueda:string

  seleciona = [
    'Monto total invertido',
    'Monto mas grande en una orden',
    'Ticket promedio servicios',
    'Monto mas pequeño en en servicios',
  ]
  
  range_busqueda = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  fechas_busqueda = {inicio: this._publicos.resetearHoras(new Date()), final: this._publicos.resetearHoras(new Date())}

  SUCURSAL:string

  ngOnInit(): void {
    this.rol()
  }
  OnAfterContentChecked() {
    console.log("Sent from Ng After View Init");
    
  }
  rol(){
  
    const { rol, sucursal, uid } = this._security.usuarioRol()
    this.SUCURSAL = sucursal
    if (rol === this.rol_cliente && uid) this.obtenerInformacion_cliente(uid) 
  }
  async obtenerInformacion_cliente(id:string){

    


    const sucursal = this.SUCURSAL
    const cliente = id
    const data_cliente  = await this._clientes.consulta_cliente_new({sucursal, cliente})
    const vehiculos_arr = await this._vehiculos.consulta_vehiculos({sucursal, cliente})

    const ruta_recepciones    =  `recepciones/${sucursal}/${cliente}`

    // const starCountRef = ref(db, `recepciones/${sucursal}/${cliente}`)
    // onValue(starCountRef, (snapshot) => {
    //   if (snapshot.exists()) {
    //     let vehiculos= this._publicos.crearArreglo2(snapshot.val())
    //   } else {
    //     console.log("No data available");
    //   }
    // })
    const todas_recepciones  = await this._servicios.conslta_recepciones_cliente({ruta: ruta_recepciones})


    const filtro_recepciones = todas_recepciones.map(cot=>{
      cot.data_cliente = this._clientes.formatea_info_cliente_2(data_cliente)
      // cot.data_sucursal = this.sucursales_arr.find(s=>s.id === sucursal)
      const data_vehiculo = vehiculos_arr.find(v=>v.id === cot.vehiculo)
      cot.data_vehiculo = data_vehiculo
      const {placas}= data_vehiculo
      cot.placas = placas || '------'
      const {reporte, elementos} = this.calcularTotales(cot);
      console.log(reporte);
      
      cot.reporte = reporte
      cot.elementos = elementos
      return cot
    })

    this.recepciones_generales = filtro_recepciones

    // console.log(this.recepciones_generales);
    

    const info = {};

    const arra_vehiculo = vehiculos_arr.map(v=>v.id)

    arra_vehiculo.forEach(vehiculo=>{
      console.log(vehiculo);
      
      let ticketPromedio = 0, servicios_totales =0, mo=0, refacciones=0, ticketGeneral=0
      const totales = filtro_recepciones.filter(f=>f.vehiculo === vehiculo)
      // console.log(totales);
    
      // reporte.servicios_totales =  totales.length
      if (totales.length) {
        totales.forEach((cotiza)=>{
          const {reporte: reporteCotiza} = cotiza
          
  
          let total = reporteCotiza.refacciones + reporteCotiza.mo
          ticketPromedio = total / totales.length
          ticketGeneral += total + reporteCotiza.iva
          
          mo += reporteCotiza.mo
          refacciones += reporteCotiza.refacciones
        })
      }
      
      servicios_totales = totales.length
      const  data_vehiculo = vehiculos_arr.find(v=>v.id === vehiculo)
      info[vehiculo] = {
        data_vehiculo,
        placas: data_vehiculo.placas,
        servicios_totales, ticketPromedio
      }
      const 
      { 
        
        maximo,no_maximo, contadorMaximo,arreglo_maximo, 
        minimo, no_minimo,contadorMinimo,arreglo_minimo

      } = this._publicos.obtenerValorMaximoMinimo(totales)
      
      // let validacion_divicion = ticketGeneral / servicios_totales

      let nuevo_t = 0
      if (ticketGeneral > 0 &&  servicios_totales > 0) {
        nuevo_t = ticketGeneral / servicios_totales
      }

      this.campos_estadisticas = { 
        ticketPromedioFinal: nuevo_t, 
        servicios_totales, 
        ticketGeneral }
      this.clonado = [
          {
            name: "Monto total invertido",
            value: ticketGeneral,
            contador: 0,
            arreglo:[]
          },
          {
            name: "Monto mas grande en una orden",
            value: maximo,
            no_os: no_maximo,
            contador: contadorMaximo,
            arreglo: arreglo_maximo
          },
          {
            name: "Ticket promedio servicios",
            value: nuevo_t,
            contador: 0,
            arreglo:[]
          },
          {
            name: "Monto mas pequeño en en servicios",
            value: minimo,
            no_os: no_minimo,
            contador: contadorMinimo,
            arreglo: arreglo_minimo
          },
        ]
      
        this.single_generales = [ ...this.clonado]

        setTimeout(()=>{ this.applyDimensions() },800)
      
    })


  this.single = this._publicos.crearArreglo2(info).map(es=>{ 
    return {
      name: String(es.placas).toUpperCase(),
      value: es.ticketPromedio
    }
  })
  
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

  irPagina(pagina,vehiculo){
    const  { usuario } = this._security.usuarioRol() 
    let queryParams = {}
    if (pagina === 'historialCliente-vehiculo') {
      queryParams = { anterior:'estadisticasCliente', cliente: usuario,vehiculo } 
    }
    this.router.navigate([`/${pagina}`], { queryParams });
  }

  //funciones para las graficas de auto y general
  onSelect_general(event) {
    if (event) {
      const busqueda = (typeof event === 'object') ? event.name : event
      this.infoSelect  = this.clonado.find(c=>c.name === busqueda)
      
      const findIndex = (array, predicate) => {
        for (let i = 0; i < array.length; i++) {
          if (predicate(array[i])) {
            return i;
          }
        }
        return -1;
      };
      const index = findIndex(this.clonado, item => item.name === busqueda);
      
      let color = '#fe0000'

      this.gaugeTextValue = this._publicos.transform(this.infoSelect.value)
      
      let colores_originales = ['#7aa3fc', '#f6a562', '#6fd5a4', '#97ea80']
      colores_originales[index] = color
      this.colorScheme.domain = [...colores_originales]
    }else{
      this.infoSelect = {value: 0, name:'--------',contador: 0,arreglo:[]}
    }
  }
  applyDimensions() {
    const width = this.divElement.nativeElement.offsetWidth;
    const height = this.divElement.nativeElement.offsetHeight;
    // console.log('Ancho:', width, 'px');
    // console.log('Alto:', height, 'px');
    
    this.showAxis = (width < 500) ? false:  true

    this.height = (width < 530) ? 400 : 400
    this.width = width -20

    this.view = [this.width, this.height];
  }
  onActivate_general(event): void {
    const {  value  } = JSON.parse(JSON.stringify(event))
    const {  value: nuevoValue, name  } = value
    this.gaugeTextValue = this._publicos.transform(nuevoValue)
  }

  onDeactivate(data): void {
    this.gaugeTextValue = this._publicos.transform(0)
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    // this.colorScheme.domain[0] = '#5ca04a'
  }
  valueFormatting(value: number): string {
    const isNegative = value < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(value)
      .toFixed(2)
      .split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');

    const formattedValue = `$ ${
      isNegative ? '-' : ''
    } ${formattedIntegerPart}.${decimalPart}`;
    // console.log(formattedValue);
    
    return formattedValue;
  }
  axisTickFormatting(value):string{
    const enteros = value.split(',');
    const numero_1 = enteros[0].replace('.', '');
    const nuevoNumero = !enteros[1] ? numero_1 : `${numero_1}.${enteros[1]}`;

    const isNegative = nuevoNumero < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(nuevoNumero).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');
  
    const formattedValue = ` $ ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;
      
    return formattedValue;
  }
  tooltipText(velue_get){
    // console.log(velue_get);
    const {data} = velue_get
    const {value, name} = data

    const isNegative = value < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(value).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');
  
    const formattedValue = ` $ ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;

    return  `${ name } <br> ${ formattedValue }`
  }
  
  onSelect_busqueda(event){
    // console.log(event);
    
    if (event) {
      const busqueda = (typeof event === 'object') ? event.name : event
      this.infoSelect_busqueda  = this.clonado_busqueda.find(c=>c.name === busqueda)
      // console.log('aqui');
      const encontrado = this.seleciona.find(c=>c === busqueda)
      // console.log(encontrado);
      // this.colorScheme = {
      //   group: ScaleType.Ordinal, 
      //   selectable: true, 
      //   name: 'Customer Usage', 
      //   domain: ['#FF8623', '#FF8623', '#6fd5a4', '#FF8623']
      // };
      this.muestra_busqueda = encontrado
      this.cambiosFechas()
      
    }else{
      this.infoSelect_busqueda = {value: 0, name:'--------',contador: 0,arreglo:[]}
    }
    // console.log(this.infoSelect_busqueda);
    
  }
  cambiosFechas(){

    const {start, end} = this.range_busqueda.value
    if (start && end && (start['_d'] && end['_d'] ) && this.muestra_busqueda) {
      
      // console.log('si es fecha');
      // console.log(this.muestra_busqueda);
      
      const fechaAsigan = {inicio: this._publicos.resetearHoras(start['_d']), final: this._publicos.resetearHoras(end['_d'])}
      this.fechas_busqueda = fechaAsigan
      // console.log(this.fechas_busqueda);
      // console.log(this.recepciones_generales);
      const filtro_entregado = 
      // this.recepciones_generales.filter(
      //   r=>r.status === 'entregado' && (fechaAsigan.inicio >= r.fechaEntregado && fechaAsigan.final <= r.fechaEntregado)
      // )
       this.recepciones_generales.filter(r => {
        const fechaEntregado = new Date(r.fechaEntregado);
        return r.status === 'entregado' && fechaEntregado >= fechaAsigan.inicio && fechaEntregado <= fechaAsigan.final;
      });
      //TODO CONTINUAR CON LA MUESTRA DE INFORMACION EN ESTADISTICAS DE CLIENTE
      // console.log(filtro_entregado);
      let pertenecientes = {}
      const clonar = []
      this.calves_vehiculos_new.forEach(c=>{
        const recepciones       = filtro_entregado.filter(re=>re.vehiculo.id === c)
        const max_min           = this._publicos.obtenerValorMaximoMinimo(recepciones)
        const data_vehiculo     = this.vehiculos_new.find(v=>v.id === c)
        const {ticketGeneral, ticketPromedio}= this._publicos.obtener_ticketPromedioFinal(recepciones)

        let ocupado, contador=0, arreglo = [], servicios = recepciones.length
        switch (this.muestra_busqueda) {
          case 'Monto total invertido':
            ocupado = ticketGeneral
            break;
          case 'Monto mas grande en una orden':
            ocupado = max_min.maximo
            arreglo = max_min.arreglo_maximo
            contador = max_min.contadorMaximo
            break;
          case 'Ticket promedio servicios':
            ocupado = ticketPromedio
            break;
          case 'Monto mas pequeño en en servicios':
            ocupado = max_min.minimo
            arreglo = max_min.arreglo_minimo
            contador = max_min.contadorMinimo
            break;
        
          default:
            
            break;
        }
        const objeto =  {data_max_min: max_min, vehiculo: data_vehiculo}    
        pertenecientes[c] = Object(objeto)
        
        clonar.push(Object({name: ' '+String(data_vehiculo.placas).toUpperCase(), value: ocupado, contador, arreglo, servicios_totales: servicios}))
      })
      this.clonado_busqueda = [...clonar]
      this.single = [...clonar]
      // console.log(pertenecientes);
      // console.log(this.single);
      
      
    }else{
      // console.log('no es fecha');
      
    }
  }

  calcularTotales(data) {
    const {margen: new_margen, formaPago, elementos: servicios_, iva:_iva, descuento:descuento_} = data
    const reporte = {mo:0, refacciones:0, refacciones_v:0, subtotal:0, iva:0, descuento:0, total:0, meses:0, ub:0}
    const elementos =  [...servicios_]
    const margen = 1 + (new_margen / 100)
    elementos.map(ele=>{
      const {cantidad, costo, tipo} = ele
      if (tipo === 'paquete') {
        const report = this.total_paquete(ele)
        const {mo, refacciones} = report
        if (ele.aprobado) {
          reporte.mo += mo
          reporte.refacciones += refacciones
          reporte.refacciones_v += refacciones * margen
        }
        ele.precio = mo + (refacciones * margen)
        ele.total = (mo + (refacciones * margen)) * cantidad
        if (costo > 0 ) ele.total = costo * cantidad 
      }else if (tipo === 'mo' || tipo === 'refaccion') {

        const operacion = this.mano_refaccion(ele)

        if (ele.aprobado) reporte[tipo] += operacion

        ele.subtotal = operacion;
        ele.total = operacion;
        if (tipo === 'refaccion') {
          // reporte.refacciones += operacion;
          reporte.refacciones_v += operacion * margen;
          ele.total = operacion * margen;
        }

        
        // if (ele.aprobado) {
        //   reporte.mo += operacion
        // }
        // ele.subtotal = operacion
        // ele.total = operacion
      }
      // else if (ele.tipo === 'refaccion') {
      //   const operacion = this.mano_refaccion(ele)
      //   if (ele.aprobado) {
      //     reporte.refacciones += operacion
      //     reporte.refacciones_v += operacion * margen
      //   }
      //   ele.subtotal = operacion
      //   ele.total = operacion * margen
      // }
      return ele
    })
    let descuento = parseFloat(descuento_) || 0
    const enCaso_meses = this.formasPago.find(f=>f.id === String(formaPago))
    const {mo, refacciones_v, refacciones} = reporte

    let nuevo_total = mo + refacciones_v

    let total_iva = _iva ? nuevo_total * 1.16 : nuevo_total;

    let iva =  _iva ? nuevo_total * .16 : 0;

    let total_meses = (enCaso_meses.id === '1') ? 0 : total_iva * (1 + (enCaso_meses.interes / 100))
    let newTotal = (enCaso_meses.id === '1') ?  total_iva -= descuento : total_iva
    let descuentoshow = (enCaso_meses.id === '1') ? descuento : 0

    reporte.descuento = descuentoshow
    reporte.iva = iva
    reporte.subtotal = nuevo_total
    reporte.total = newTotal
    reporte.meses = total_meses
    // console.log(reporte);
    // (reporteGeneral.subtotal - cstoCOmpra) *100/reporteGeneral.subtotal
    reporte.ub = (nuevo_total - refacciones) * (100 / nuevo_total)
    return {reporte, elementos}
    
  }
  mano_refaccion(ele){
    const {costo, precio, cantidad} = ele
    const mul = (costo > 0 ) ? costo : precio
    return cantidad * mul
  }
  total_paquete(data){
    const {elementos} = data
    const reporte = {mo:0, refacciones:0}
    elementos.forEach(ele=>{
      if (ele.tipo === 'mo') {
        const operacion = this.mano_refaccion(ele)
        reporte.mo += operacion
      }else if (ele.tipo === 'refaccion') {
        const operacion = this.mano_refaccion(ele)
        reporte.refacciones += operacion
      }
    })
    return reporte
  }

}
