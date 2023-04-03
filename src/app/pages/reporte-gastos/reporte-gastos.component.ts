import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
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

  
  dataSourceGastosDia = new MatTableDataSource(); //elementos
  columnasGastosDia:string[] = ['sucursal','concepto','metodo','monto','tipo','fecha','opciones']
  @ViewChild('GastosDiaPaginator') paginator: MatPaginator //elementos
  @ViewChild('GastosDia') sort: MatSort //elementos

  ordenamiento : boolean = true

  // SearchDia:string = 'hoy'; SearchSucursal = {id:'Todas',sucu:'Todas'}; 
  SearchDia:string = 'hoy'; SearchSucursal = {id: null,sucu: 'Seleccionar'}; 
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
  fevchas = [
    'hoy',
    'ayer',
    'ult_7Dias',
    'ult_30Dias',
    'ult_mes',
    'este_anio',
    'ult_anio'
  ]
  fechasSeleccionadas = {inicio: '', final:''}
  range_busqueda = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  reporte = {_pagos: 0, _gastos:0, _operacion:0,utlidad:0,_depositos:0}
  campos_Reporte = [
    {valor:'_pagos', show:'Pagos' },
    {valor:'_gastos', show:'Gastos' },
    {valor:'_operacion',show:'Operación'},
    {valor:'_depositos',show:'Depositos'},
    {valor:'utlidad',show:'Utilidad'},
]

  showPago:boolean = false
  showGasto:boolean = false
  muestraForms = {pago:false, gasto:false,deposito:false}
  
  forms = ['pago','gasto','deposito']
  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.rol()
    this.listaSucursales()
    // this.listaGastosDiarios()
    this.lista_gastosOperacion()
    // this.lista_pagosGastos_OS()
  }

  validaCampo(campo: string){
    return this.formGasto.get(campo).invalid && this.formGasto.get(campo).touched
  }
  rol(){
    if (localStorage.getItem('dataSecurity')) {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      this.ROL = this._security.servicioDecrypt(variableX['rol'])
      this.SUCURSAL = this._security.servicioDecrypt(variableX['sucursal'])    
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
    })
  }
  // agregar(data:any){
  //   // this.metodo_select = data
  //   // console.log(data);
    
  //   this.reporteShow = data
  //   let resultados_ = []
  //   this.filtraOcupadosMetodoEspecifico.forEach(m=>{
  //       this.metodospago.find(p=>{
  //         if (p['valor'] === m['metodo'] && data === p['ocupa']) {
  //           resultados_.push(m)
  //         }
  //       })
  //   })
  //   // console.log(resultados_);
  //   this.resultados_ = resultados_
  // }
  // limpiaForm(){
  //   let sucursal 
  //   if (this.SUCURSAL !== 'Todas') {
  //     sucursal = this.SUCURSAL
  //   }
  //   this.formGasto.reset({
  //     id: '',
  //     monto: 0,
  //     tipo: 'nuevo',
  //     metodo: 1,
  //     sucursal,
  //     concepto: '',
  //   })
  //   this.Editar = false
  // }
  // registraGasto(){
  //   if (this.formGasto.valid) {
  //     // this._publicos.mensajeSwal('registro continuar')
  //     const data = this.formGasto.value
  //     let getTime = this._publicos.getFechaHora()
  //     let id 
  //     // console.log(data);
  //     const updates = {};
  //     ///primero verificar si existe id en formulario
  //     const infoSave = {
  //       fecha: getTime.fecha,
  //       hora: getTime.hora,
  //       id,
  //       monto: data['monto'],
  //       sucursal: data['sucursal'],
  //       tipo: data['tipo'],
  //       concepto: data['concepto'],
  //       metodo: Number(data['metodo']),
  //       status:true
  //     }
  //     if (data['id']) {
  //       ///en caso de que desee editar informacion el id cambia para que se edicion de informacion
  //       infoSave['id'] = data['id']
  //       // infoSave['fecha'] = data['fecha']
  //       // infoSave['hora'] = data['hora']
        
  //       const enviaFecha = this._publicos.construyeFechaString(data['fecha'],data['hora'])
        
  //       getTime = this._publicos.getFechaHora(enviaFecha)
  //       // console.log(getTime);
  //       infoSave['fecha'] = getTime.fecha
  //       infoSave['hora'] = getTime.hora
  //       updates[`gastosDiarios/${data['sucursal']}/${getTime.fechaNumeros}/${data['id']}`] = infoSave;
  //       // console.log(updates);
        
  //     }else{
  //       ///en caso de que desee registrar informacion el id cambia para que se nuevo registro de informacion
  //       // if (data['tipo'] === 'nuevo')
  //       id = this._publicos.generaClave()
  //       infoSave['id'] = id
  //       updates[`gastosDiarios/${data['sucursal']}/${getTime.fechaNumeros}/${id}`] = infoSave;
  //     }
  //     // console.log(updates);
  //     update(ref(db), updates).then(()=>{
  //         this._publicos.mensajeSwal('Gasto registrado correctamente!')
  //         this.limpiaForm()
  //         this.Editar = false
  //       })
  //       .catch(()=>{
  //         this._publicos.mensajeSwalError('Error al registrar gasto')
  //       })
  //   }
  // }

  // editarStatus(data: any, status){
  //   //verificar si existe la informacion
  //   if (data['id']) {
  //     // console.log(data);
  //     // convertir fecha en string tipo Date
  //     const fecha = this._publicos.construyeFechaString(data['fecha'],data['hora'])
  //     // traer la fecha en numeros del la variable "fecha"
  //     const getTime = this._publicos.getFechaHora(fecha)
      
  //     const updates = {};
  //     updates[`gastosDiarios/${data['sucursal']}/${getTime.fechaNumeros}/${data['id']}/status`] = status;
  //     // console.log(updates);
  //     // Realizar pregunta si desea eliminar el gasto
  //     let mensaje = `¿Eliminar gasto tipo ${data['tipo']}`
  //     if(status) mensaje = `Activar gasto tipo ${data['tipo']}`
  //     this._publicos.mensaje_pregunta(`${mensaje}`).then(({respuesta})=>{
  //       if (respuesta) {
  //         //en caso de confirmar la respuesta realizar la actualizacion
  //         update(ref(db), updates).then(()=>{
  //           this._publicos.mensajeSwal('Accion correcta!!')
  //         })
  //         //en caso de error informar mediante mensaje
  //         .catch(erro=>{
  //           this._publicos.mensajeSwalError('Error al eliminar gasto')
  //         })
  //       }
  //     })
      
  //     // update(ref(db), updates);
  //   }
  // }
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
  // editarGasto(data:any){
  //   // verificar si existe id en la data para continuar con la edicion de informacion de gasto
  //   if (data['id']) {
  //     this.formGasto.reset({
  //       id: data['id'],
  //       monto: data['monto'],
  //       tipo: data['tipo'],
  //       metodo: data['metodo'],
  //       sucursal: data['sucursal'],
  //       concepto: data['concepto'],
  //       fecha: data['fecha'],
  //       hora: data['hora'],
  //     })
  //     //variable para activar modo edicion
  //     this.Editar = true
  //   }
  // }
  
  //mostrar los detalles de gasto
  detalles(data:any){
    if (data['id']) {
      Swal.fire({
        title: '<strong>Detalles</strong>',
        // icon: 'info',
        html:
          `
          <ul class='list-group'>
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
  //listar los gastos de operacion
  lista_gastosOperacion(){
    const starCountRef = ref(db, `HistorialGastosOperacion`)
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        this.arr_gastosOperacion = this._publicos.crearArreglo2(snapshot.val())
        this.arr_gastosOperacion.map(a=>{
          //obtener la fecha en formato string para compar correctamente fechas
          const fechaCompara_ = this._publicos.construyeFechaString(a['fecha'],a['hora_registro'])
          a['fechaCompara'] = fechaCompara_
        })
        // console.log(this.arr_gastosOperacion);
        this.lista_pagosGastos_OS()
      }else{
        this.arr_gastosOperacion = []
        this.lista_pagosGastos_OS()
      }
    })
  }
  //listar los pagos y gastos de orden se servicio
  lista_pagosGastos_OS(){
    const starCountRef = ref(db, `recepciones`)
    onValue(starCountRef, (snapshot) => {
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
              const infoGasto = {...a,historial:'gasto'}
              os_historial.push(infoGasto)
            })
          }
          if (os['HistorialPagos']) {
            let pago_historial = this._publicos.crearArreglo2(os['HistorialPagos'])
            pago_historial.forEach((a)=>{
              const fechaCompara_ = this._publicos.construyeFechaString(a['fecha'],a['hora_registro'])
              a['fechaCompara'] = fechaCompara_
              const infoGasto = {...a,historial:'pago'}
              os_historial.push(infoGasto)
            })
          }
        })
        // console.log(os_historial);
        this.arr_historialPG_ordenes = os_historial
        this.consulta_gastosDiarios()
      }else{
        this.arr_historialPG_ordenes = []
        this.consulta_gastosDiarios()
      }

    })
  }
  selected(){
    this.valor = 'personalizado'
    // console.log(this.range_busqueda.value);
    const {start, end} = this.range_busqueda.value
    if (start && end) {
      if (start['_d'] && end['_d']) {
        this.realizaOp()
      }
    }
  }
  consulta_gastosDiarios(){
    const starCountRef = ref(db, `gastosDiarios`)
    onValue(starCountRef, (snapshot) => {
      let registrosFInales = []
      if (snapshot.exists()) {
        // console.log(snapshot.val());
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
              const infoGasto = {...a}
              // os_historial.push(infoGasto)
              registrosFInales.push(infoGasto)
            })
          })
        });
        // console.log(registrosFInales);
        this.arr_GastosDiarios = registrosFInales
        this.realizaOp()
      }else{
        this.realizaOp()
      }
    })
  }
  realizaOp(){
    
    const info = this.arr_gastosOperacion.concat( this.arr_historialPG_ordenes ).concat(this.arr_GastosDiarios)
    console.log(info);
    
    
    // console.log(reporte);
    let rangoFechas = {inicio: new Date(), final: new Date()}

    // fechas de consulta o filtrado numero es (dias / meses / anios ) a restar o sumar
    // tipo es si se sumara o restara la variable numero
    // donde es que tipo sera (+,-) dia mes o  anios
    let numero: number =0, tipo ='resta',donde='dia'
    let fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
    switch (this.valor) {
      case 'hoy':
        donde= 'dia'
        numero=0
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        rangoFechas = {inicio: fechas.fecha1, final: fechas.fecha2}
        break;
      case 'ayer':
        numero = 1
        donde = 'dia'
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        rangoFechas = {inicio: fechas.fecha2, final: fechas.fecha2}
        break;
      case 'ult_7Dias':
        numero = 7
        donde = 'dia'
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        rangoFechas = {inicio: fechas.fecha2, final: fechas.fecha1}
        break;
      case 'ult_30Dias':
        numero = 30
        donde = 'dia'
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        rangoFechas = {inicio: fechas.fecha2, final: fechas.fecha1}
        break;
      case 'ult_mes':
        donde = 'mes'
        numero = 1
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        rangoFechas = {inicio: fechas.fecha1, final: fechas.fecha2}
        break;
      case 'este_anio':
        numero = 0
        donde = 'anio'
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        rangoFechas = {inicio: fechas.fecha1, final: fechas.fecha2}
        break;
      case 'ult_anio':
        donde = 'anio'
        numero = 1
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        rangoFechas = {inicio: fechas.fecha1, final: fechas.fecha2}
        break;
      case 'personalizado':
        const {start, end} = this.range_busqueda.value
          if (start && end) {
            if (start['_d'] && end['_d']) {
              rangoFechas = {inicio: start['_d'], final: end['_d']}
            }
          }
        
        break;
    
      default:
        donde= 'dia'
        numero=0
        fechas = this._publicos.getMesFecha(new Date(),tipo,donde,numero)
        rangoFechas = {inicio: fechas.fecha1, final: fechas.fecha2}
        break;
    }
  //filtrar por las fechas
  let resultados = []
  // console.log(info);
  
  info.forEach(a=>{
    if (a['fechaCompara'] >= rangoFechas.inicio && a['fechaCompara' ] <= rangoFechas.final) resultados.push(a)
  })
  //filtrar por sucursal
  let filtro_sucursal = []
  if (this.SUCURSAL !== 'Todas') {
    filtro_sucursal = resultados.filter(r=>r['sucursal'] == this.SUCURSAL)
  }else{
    filtro_sucursal = resultados
  }
  const reporte = {_pagos: 0, _gastos:0, _operacion:0,utlidad:0,_depositos:0}
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
  this.range_busqueda.controls['start'].setValue(new Date(rangoFechas.inicio))
  this.range_busqueda.controls['end'].setValue(new Date(rangoFechas.final))
  //asignacion de valores para reporte
  // console.log((reporte._pagos + reporte._depositos));
  
  reporte.utlidad = (reporte._pagos + reporte._depositos) -  (reporte._gastos + reporte._operacion)
  
  
  this.reporte = reporte

  //mandar informacion a la tabla!
  this.dataSourceGastosDia.data = filtro_sucursal
  this.newPagination('data')
    
  }
  ///paginacion de los resultados
  newPagination(data:string){
    //despues de la asiganacion de la data esperar .5 segundos para realizar paginacion
    setTimeout(() => {
    if (data==='data') {
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



