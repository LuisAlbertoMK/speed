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

const db = getDatabase()
const dbRef = ref(getDatabase());
@Component({
  selector: 'app-reporte-gastos',
  templateUrl: './reporte-gastos.component.html',
  styleUrls: ['./reporte-gastos.component.css']
})
export class ReporteGastosComponent implements OnInit {
  miniColumnas:number = 100
  metodospago = [
    {valor:1, show:'Efectivo', ocupa:'Efectivo'},
    {valor:2, show:'Cheque', ocupa:'Cheque'},
    {valor:3, show:'Tarjeta', ocupa:'Tarjeta'},
    {valor:4, show:'Transferencia', ocupa:'Transferencia'},
    {valor:4, show:'Credito', ocupa:'credito'},
    // {valor:4, show:'OpenPay', ocupa:'OpenPay'},
    // {valor:5, show:'Clip / Mercado Pago', ocupa:'Clip'},
    {valor:6, show:'Terminal BBVA', ocupa:'BBVA'},
    {valor:7, show:'Terminal BANAMEX', ocupa:'BANAMEX'}
  ]
  metodo_select = {metodo:1, show:'Efectivo'}
  tipo_gasto:string = 'nuevo'
  
  
  gastos = [{valor:'nuevo', show:'nuevo gasto'},{valor:'inicial', show:'deposito a caja chica'}];
  ROL:string; SUCURSAL:string
  sucursales =[]
  sucursalSelect:string

  formGasto: FormGroup;

  historialGastosDia = []
  Editar:boolean = false

  
  dataSourceResporteGastos = new MatTableDataSource(); //elementos
  columnasResporteGastos:string[] = ['sucursal','concepto','metodo','monto','tipo','fecha','opciones']
  @ViewChild('ResporteGastosPaginator') ResporteGastospaginator: MatPaginator //elementos
  @ViewChild('ResporteGastos') ResporteGastossort: MatSort //elementos

  dataSourceGastosDia = new MatTableDataSource(); //elementos
  columnasGastosDia:string[] = ['sucursal','no_os','concepto','metodo','monto','tipo','fecha','opciones']
  @ViewChild('GastosDiaPaginator') paginator: MatPaginator //elementos
  @ViewChild('GastosDia') sort: MatSort //elementos

  ordenamiento : boolean = true

  // SearchDia:string = 'hoy'; SearchSucursal = {id:'Todas',sucu:'Todas'}; 
  SearchDia:string = 'hoy'; SearchSucursal = {id: null,sucu: 'Todas'}; 
  ResultadosDiarios = []
  // selected: Date | null;
  reporteFinal = {Efectivo:0,Cheque:0,Tarjeta:0,OpenPay:0,Clip:0,BBVA:0,BANAMEX:0}
  reporteShow = 'General'
  Sobrante = 0

  filtraOcupadosMetodoEspecifico =[]
  resultados_=[]
  fechaUnica:Date

  ///para obtener todos los gastos y pagos de ordenes de servicio / operacion
  arr_gastosOperacion =[]
  arr_historialPG_ordenes = []
  arr_GastosDiarios = []
  /// valor
  valor = 'hoy'
  fevchas = ['hoy','ayer','ult_7Dias','ult_30Dias','ult_mes','este_anio','ult_anio']
  fechasSeleccionadas = {inicio: '', final:''}
  range_busqueda = new FormGroup({
    start: new FormControl(Date),
    end: new FormControl(Date),
  });
  reporte = {_pagos: 0, _gastos:0, _operacion:0,utilidad:0}
  campos_Reporte = [
    {valor:'_pagos', show:'Pagos' },
    {valor:'_gastos', show:'Gastos' },
    {valor:'_operacion',show:'Operación'},
    {valor:'utilidad',show:'Utilidad'},
]

  showPago:boolean = false
  showGasto:boolean = false
  muestraForms = {pago:false, gasto:false,deposito:false}
  
  forms = ['pago','gasto','deposito']

  fechas_get = {inicio:new Date(), final: new Date()}

  reporte_diario = { _gastos:0,_depositos:0,utilidad:0,_operacion:0}
  campos_diario = [
    {valor:'_gastos', show:'Gastos' },
    {valor:'_depositos',show:'Depositos'},
    {valor:'utilidad',show:'Utilidad'},
   ]
   usuario:string
  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.rol()
    this.listaSucursales()
    this.lista_pagosGastos_OS()
    this.revisarCambios()
    
    // this.listaGastosDiarios()
    // this.lista_gastosOperacion()
    
    // this.consulta_gastosDiarios()
  }

  validaCampo(campo: string){
    return this.formGasto.get(campo).invalid && this.formGasto.get(campo).touched
  }
  rol(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      this.ROL = this._security.servicioDecrypt(variableX['rol'])
      this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])
      this.usuario = this._security.servicioDecrypt(variableX['usuario'])  
      if (this.SUCURSAL !=='Todas') {
        // let nu = []
        // this.columnasGastosDia[0] = null
        this.SearchSucursal = {id: this.SUCURSAL,sucu: 'esta'}; 
        this.columnasGastosDia.shift()
      }  
    }
  }
  listaSucursales(){
    const starCountRef = ref(db, `sucursales`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.sucursales= this._publicos.crearArreglo2(snapshot.val())
      }
    },{
        onlyOnce: true
      })
  }
  ordenarElementos(campo:string){
    // declaracion y asiganacion de resultados de la tabla
    let info =  []
    info = [...this.dataSourceGastosDia.data]
    
    // realizar ordenamiento de informacion de forma asc y desc dependiendo de this.ordenamiento que es boolean
    if (this.ordenamiento) {
      info.sort(function (a, b) {
        if (a[campo] > b[campo]) { return 1; }
        if (a[campo] < b[campo]) { return -1; }
        return 0;
      })
    }else{
      info.sort(function (a, b) {
        if (a[campo] < b[campo]) { return 1; }
        if (a[campo] > b[campo]) { return -1; }
        return 0;
      })
    }
    this.dataSourceGastosDia.data = info
    ///mandar traer la paginacion de resultados
    this.newPagination('GastosDia')
  }  
    //mostrar los detalles de gasto
  detalles(data:any){
    if (data['id']) {
      Swal.fire({
        title: '<strong>Detalles</strong>',
        // icon: 'info',
        html:
          `
          <ul class='list-group'>
            <li class='list-group-item'>OS: ${data['no_os']}</li>
            <li class='list-group-item'>Sucursal: ${data['sucursalShow']}</li>
            <li class='list-group-item'>Concepto: ${data['concepto']}</li>
            <li class='list-group-item'>Metodo: ${data['metodo']}</li>
            <li class='list-group-item'>Monto: ${data['monto']}</li>
            <li class='list-group-item'>Tipo: ${data['tipo']}</li>
            <li class='list-group-item'>Fecha: ${data['fecha']} ${data['hora']}</li>
          </ul>
          `,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> OK!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
          '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
      })
    }
  }
  async revisarCambios(){
    const starCountRef = ref(db, 'gastosDiarios')
     await  onValue(starCountRef, (snapshot) => {
      let registrosFInales = []
      if (snapshot.exists()) {
        const data = snapshot.val()
        const claves = Object.keys(snapshot.val())
        claves.forEach(c => {
          // console.log(data[c]);
          const clavesDias = Object.keys(data[c])
          // console.log(clavesDias);
          // clavesDias
          clavesDias.forEach((ck1)=>{
            const arreglo = this._publicos.crearArreglo2(data[c][ck1])
            // console.log(arreglo);
            arreglo.forEach(a=>{
              const fechaCompara_ = this._publicos.construyeFechaString(a['fecha'],a['hora'])
              a['fechaCompara'] = fechaCompara_
              const infoGasto = {...a,claveDia:ck1}
              // os_historial.push(infoGasto)
              registrosFInales.push(infoGasto)
            })
          })
        });
          this.arr_GastosDiarios = registrosFInales
          // this.realizaOtras_op()
          this.obternerfechas()
      }else{
        this.arr_GastosDiarios = registrosFInales
        // this.realizaOtras_op()
        // this.obternerfechas()
      }
      }
      // ,{
      //   onlyOnce: true
      // }
      
      )
    const starCountRef1 = ref(db, `HistorialGastosOperacion`)
    await onValue(starCountRef1, (snapshot) => {
        if (snapshot.exists()) {
          this.arr_gastosOperacion = this._publicos.crearArreglo2(snapshot.val())
          this.arr_gastosOperacion.map(a=>{
            //obtener la fecha en formato string para compar correctamente fechas
            const fechaCompara_ = this._publicos.construyeFechaString(a['fecha'],a['hora_registro'])
            a['fechaCompara'] = fechaCompara_
          })
          // console.log(this.arr_gastosOperacion);
          this.obternerfechas()
        }else{
          this.arr_gastosOperacion = []
          // this.obternerfechas()
        }
      })
      const starCountRef2 = ref(db, `recepciones`)
      await onValue(starCountRef2, (snapshot) => {
        if (snapshot.exists()) {
          let arreglo = this._publicos.crearArreglo2(snapshot.val())
          // console.log(arreglo);
          let os_historial = []
          arreglo.forEach(os=>{
            if (os['HistorialGastos']) {
              let gastos_historial = this._publicos.crearArreglo2(os['HistorialGastos'])
              gastos_historial.forEach((a)=>{
                const fechaCompara_ = this._publicos.construyeFechaString(a['fecha'],a['hora_registro'])
                a['fechaCompara'] = fechaCompara_
                const infoGasto = {...a,historial:'gasto',claveID:os['id'],no_os:os['no_os']}
                os_historial.push(infoGasto)
              })
            }
            if (os['HistorialPagos']) {
              let pago_historial = this._publicos.crearArreglo2(os['HistorialPagos'])
              pago_historial.forEach((a)=>{
                const fechaCompara_ = this._publicos.construyeFechaString(a['fecha'],a['hora_registro'])
                a['fechaCompara'] = fechaCompara_
                const infoGasto = {...a,historial:'pago',claveID:os['id'],no_os:os['no_os']}
                os_historial.push(infoGasto)
              })
            }
          })
          // console.log(os_historial);
          this.arr_historialPG_ordenes = os_historial
          this.obternerfechas()
        }else{
          this.arr_historialPG_ordenes = []
          // this.obternerfechas()     
        }
      })
    
	
  }
  //listar los gastos de operacion

  //listar los pagos y gastos de orden se servicio
  lista_pagosGastos_OS(){
    
  }
  selected(){
    this.valor = 'personalizado'
    // console.log(this.range_busqueda.value);
    const {start, end} = this.range_busqueda.value
    if (start && end) {
      if (start['_d'] && end['_d']) {
        this.fechas_get = {inicio: start['_d'], final: end['_d']}
        this.obternerfechas()
      }
    }
  }
  obternerfechas(){
    let rangoFechas = {inicio: new Date(), final: new Date()}
    
    
    // console.log(start);
    
    
    let numero: number =0, tipo ='resta',donde='dia'
    let fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
    
    switch (this.valor) {
      case 'hoy':
        donde= 'dia'
        numero=0, fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        break;
      case 'ayer':
        numero = 1, donde = 'dia'
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero,'',true)
        break;
      case 'ult_7Dias':
        numero = 7, donde = 'dia'
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        break;
      case 'ult_30Dias':
        numero = 30, donde = 'dia'
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        break;
      case 'ult_mes':
        donde = 'mes', numero = 1
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        break;
      case 'este_anio':
        numero = 0, donde = 'anio'
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        break;
      case 'ult_anio':
        donde = 'anio', numero = 1;
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        break;
      default:
        donde= 'dia', numero=0
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        break;
    }
    rangoFechas = {inicio: fechas.fecha1, final: fechas.fecha2}
    if (this.valor ==='personalizado') {
      const newfeha = new Date(this.fechas_get.inicio)
            const newfeha2 = new Date(this.fechas_get.final)
            newfeha.setHours(0,0,0,0)
            newfeha2.setHours(23,59,59,0)
            rangoFechas.inicio = newfeha
            rangoFechas.final = newfeha2
    }
    //asignacion de las fechas para la busqueda
    this.fechas_get = rangoFechas    

    this.range_busqueda.controls['start'].setValue(new Date(rangoFechas.inicio))
    this.range_busqueda.controls['end'].setValue(new Date(rangoFechas.final))
    this.realizaOp()
    this.realizaOtras_op()
  }
  realizaOp(){
    const info = this.arr_gastosOperacion.concat( this.arr_historialPG_ordenes )
   
    //filtrar por las fechas
    let resultados = []
    
    info.forEach(a=>{
      if (a['fechaCompara'] >= this.fechas_get.inicio && a['fechaCompara' ] <= this.fechas_get.final) resultados.push(a)
    })
    //filtrar por sucursal
  
    // console.log(this.SearchSucursal);
    let sucu
    if (this.SearchSucursal['id']) sucu= this.SearchSucursal.id
    let filtro_sucursal = []
    if (sucu) {
      filtro_sucursal = resultados.filter(r=>r['sucursal'] == sucu)
    }else{
      filtro_sucursal = resultados
    }
    const reporte = {_pagos: 0, _gastos:0, _operacion:0,utilidad:0,_depositos:0}
    //realizar las operaciones de cada uno de los pagos, gastos_orden y gastos_operacion
    filtro_sucursal.map(i=>{
      if (i['tipo'] === 'operacion') reporte._operacion += i['monto']
      if (i['historial'] === 'gasto') reporte._gastos += i['monto']
      if (i['historial'] === 'pago') reporte._pagos += i['monto']
      if (i['tipo'] === 'deposito') reporte._depositos += i['monto']
      const {sucursal} = this.sucursales.find(s=>s['id'] === i['sucursal'])
      i['sucursalShow'] = sucursal
    })
    //asiganar las fechas al control de calendario
   
    //asignacion de valores para reporte
    // console.log((reporte._pagos + reporte._depositos));
    
    reporte.utilidad = (reporte._pagos + reporte._depositos) -  (reporte._gastos + reporte._operacion)
    
    // console.log(reporte);
    
    this.reporte = reporte
  
    //mandar informacion a la tabla!
    this.dataSourceResporteGastos.data = filtro_sucursal
    this.newPagination('data')
  }
  
  realizaOtras_op(){
    const gastos  = this.arr_historialPG_ordenes.filter(r=>r['historial'] === 'gasto')
    const info = this.arr_GastosDiarios.concat(gastos).concat(this.arr_gastosOperacion)
    
    // console.log(info);
    
    
    let rangoFechas = {inicio: this.fechas_get.inicio, final: this.fechas_get.final}
    let resultados = []
    info. forEach((a)=>{
      if (a['fechaCompara'] >= rangoFechas.inicio && a['fechaCompara' ] <= rangoFechas.final) resultados.push(a)
    })
    let sucu
    if (this.SearchSucursal['id']) sucu= this.SearchSucursal.id
    // console.log(sucu);
    
    let filtro_sucursal = []
    if (sucu) {
      filtro_sucursal = resultados.filter(r=>r['sucursal'] == sucu)
    }else{
      filtro_sucursal = resultados
    }

    // console.log(filtro_sucursal);
    

    const reporte = { _gastos:0, utilidad:0,_depositos:0,_operacion:0}
    // console.log(filtro_sucursal);

    filtro_sucursal.map((i)=>{
      if (i['status']) {
        if (i['historial'] === 'gasto') reporte._gastos += i['monto']
        // if (i['historial'] === 'pago') reporte._pagos += i['monto']
        if (i['tipo'] === 'operacion') reporte._operacion += i['monto']
        if (i['tipo'] === 'deposito') reporte._depositos += i['monto']
        if (i['tipo'] === 'ayer') reporte._depositos += i['monto']
      }
      const {sucursal} = this.sucursales.find(s=>s['id'] === i['sucursal'])
      i['sucursalShow'] = sucursal
      const forma_pago =  this.metodospago.find(m=>Number(m['valor']) === Number(i['metodo']))
      i['metodoShow'] = forma_pago.show
    })
    reporte.utilidad = (reporte._depositos) -  (reporte._gastos + reporte._operacion)
    // console.log(reporte);
    this.reporte_diario = reporte
    // console.log(filtro_sucursal);
    // if (reporte.utilidad>0) {
      if(this.valor ==='hoy'){
      if (this.SearchSucursal['id']) {
        const { fecha2 } = this._publicos.getMesFecha(new Date(),'suma','dia',1)
        // console.log(fecha2);
        const {stringNumeros,string_fecha} = this._publicos.convierte_fechaString_personalizada(fecha2)
        // console.log(stringNumeros,string_fecha);
        const updates = {};
        // const id = this._publicos.generaClave()
        const tempData = {
          
              concepto:"Sobrante dia anterior",
              fecha: string_fecha,
              // fechaCompara:fecha2,
              hora:'0:0:0',
              metodo:1,
              monto:Number(reporte.utilidad),
              // rol:this.ROL,
              status:true,
              sucursal:this.SearchSucursal['id'],
              tipo:"ayer",
              // usuario: this.usuario

        }
        updates[`gastosDiarios/${this.SearchSucursal['id']}/${stringNumeros}/ayer`] = tempData;
        
        
        update(ref(db), updates).then(()=>{
          // this._publicos.swalToast('registro exitoso!')
          // console.log(tempData);
        })
        // console.log(updates);
        
      }
    }
      
      
    // }
    
    console.log(filtro_sucursal);
    
    
    this.dataSourceGastosDia.data = filtro_sucursal
    this.newPagination('dias')
    
    
  }

  elimina(data:any){
    if (data['id']) {
      const updates = {}
      // HistorialGastos
      // HistorialPagos
      if (data['tipo'] === 'deposito') {
        updates[`gastosDiarios/${data['sucursal']}/${data['claveDia']}/${data['id']}/status`] = false;
      }else if (data['historial'] === 'gasto') {
        updates[`recepciones/${data['claveID']}/HistorialGastos/${data['id']}/status`] = false;
      }else if (data['historial'] === 'pago') {
        updates[`recepciones/${data['claveID']}/HistorialPagos/${data['id']}/status`] = false;
      }
      this._publicos.mensaje_pregunta('Eliminar registro').then(({respuesta})=>{
        if (respuesta) {
          update(ref(db), updates).then(()=>{
            this._publicos.mensajeSwal('Acción correcta')
          })
        }
      })      
    }
    
  }
  ///paginacion de los resultados
  newPagination(data:string){
    //despues de la asiganacion de la data esperar .5 segundos para realizar paginacion
    setTimeout(() => {
      if (data==='data') {
        this.dataSourceResporteGastos.paginator = this.ResporteGastospaginator;
        this.dataSourceResporteGastos.sort = this.ResporteGastossort
      }
      if (data==='dias') {
        this.dataSourceGastosDia.paginator = this.paginator;
        this.dataSourceGastosDia.sort = this.sort
      }
    }, 500)
  }
  cambia(cual:string){
    // muestraForms
    // nos quedamos en que quwremos ocultar los forlularios segun el valor del mismo
    this.forms.map((fm)=>{
      if (cual === fm ) {
        this.muestraForms[fm] = true
      }else{
        this.muestraForms[fm] = false
      }
    })
  }

}



