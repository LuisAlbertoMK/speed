import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
    {valor:4, show:'OpenPay', ocupa:'OpenPay'},
    {valor:5, show:'Clip / Mercado Pago', ocupa:'Clip'},
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

  SearchDia:string = 'hoy'; SearchSucursal = {id:'Todas',sucu:'Todas'}; 
  ResultadosDiarios = []
  // selected: Date | null;
  reporteFinal = {Efectivo:0,Cheque:0,Tarjeta:0,OpenPay:0,Clip:0,BBVA:0,BANAMEX:0}
  reporteShow = 'General'
  Sobrante = 0

  filtraOcupadosMetodoEspecifico =[]
  resultados_=[]

  constructor(private _security:EncriptadoService,private _publicos: ServiciosPublicosService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.rol()
    this.crearFormGasto()
    this.listaSucursales()
    this.listaGastosDiarios()
  }
  crearFormGasto(){
    let sucursal 
    if (this.SUCURSAL !== 'Todas') {
      sucursal = this.SUCURSAL
    }
    this.formGasto = this.fb.group({
      id:['',[]],
      fecha:['',[]],
      hora:['',[]],
      monto:[0,[Validators.required,Validators.pattern("^[0-9]+$"),Validators.min(1)]],
      tipo:['nuevo',[Validators.required]],
      metodo:['',[Validators.required]],
      sucursal:[sucursal,[Validators.required]],
      concepto:['',[Validators.required]]
    })
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
  agregar(data:any){
    // this.metodo_select = data
    // console.log(data);
    
    this.reporteShow = data
    let resultados_ = []
    this.filtraOcupadosMetodoEspecifico.forEach(m=>{
        this.metodospago.find(p=>{
          if (p['valor'] === m['metodo'] && data === p['ocupa']) {
            resultados_.push(m)
          }
        })
    })
    // console.log(resultados_);
    this.resultados_ = resultados_
  }
  limpiaForm(){
    let sucursal 
    if (this.SUCURSAL !== 'Todas') {
      sucursal = this.SUCURSAL
    }
    this.formGasto.reset({
      id: '',
      monto: 0,
      tipo: 'nuevo',
      metodo: 1,
      sucursal,
      concepto: '',
    })
    this.Editar = false
  }
  registraGasto(){
    if (this.formGasto.valid) {
      // this._publicos.mensajeSwal('registro continuar')
      const data = this.formGasto.value
      let getTime = this._publicos.getFechaHora()
      let id 
      // console.log(data);
      const updates = {};
      ///primero verificar si existe id en formulario
      const infoSave = {
        fecha: getTime.fecha,
        hora: getTime.hora,
        id,
        monto: data['monto'],
        sucursal: data['sucursal'],
        tipo: data['tipo'],
        concepto: data['concepto'],
        metodo: Number(data['metodo']),
        status:true
      }
      if (data['id']) {
        ///en caso de que desee editar informacion el id cambia para que se edicion de informacion
        infoSave['id'] = data['id']
        // infoSave['fecha'] = data['fecha']
        // infoSave['hora'] = data['hora']
        
        const enviaFecha = this._publicos.construyeFechaString(data['fecha'],data['hora'])
        
        getTime = this._publicos.getFechaHora(enviaFecha)
        // console.log(getTime);
        infoSave['fecha'] = getTime.fecha
        infoSave['hora'] = getTime.hora
        updates[`gastosDiarios/${data['sucursal']}/${getTime.fechaNumeros}/${data['id']}`] = infoSave;
        // console.log(updates);
        
      }else{
        ///en caso de que desee registrar informacion el id cambia para que se nuevo registro de informacion
        // if (data['tipo'] === 'nuevo')
        id = this._publicos.generaClave()
        infoSave['id'] = id
        updates[`gastosDiarios/${data['sucursal']}/${getTime.fechaNumeros}/${id}`] = infoSave;
      }
      // console.log(updates);
      update(ref(db), updates).then(()=>{
          this._publicos.mensajeSwal('Gasto registrado correctamente!')
          this.limpiaForm()
          this.Editar = false
        })
        .catch(()=>{
          this._publicos.mensajeSwalError('Error al registrar gasto')
        })
    }
  }

  listaGastosDiarios(){
    const getTime = this._publicos.getFechaHora()
    let sucursal
    if (this.SUCURSAL === 'Todas') {
      
      ///conculta de todos los resultados
      const starCountRef = ref(db, `gastosDiarios`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          let resultadosFinales = []
          let arreglo= snapshot.val()
          // console.log(Object.keys(arreglo));
          const claves = Object.keys(arreglo)
          claves.forEach(c=>{
            // console.log(c, arreglo[c] );
            const clavesDias = Object.keys(arreglo[c])
            clavesDias.forEach(cd => {
              // console.log(c,cd, arreglo[c][cd] );
              const registrosDia = this._publicos.crearArreglo2(arreglo[c][cd])
              // console.log(registrosDia);
              registrosDia.forEach(r=>{
                resultadosFinales.push(r)
              })
            });
          })
          resultadosFinales.map(r=>{
            this.metodospago.forEach(m=>{
              if (r['metodo'] === m['valor']) {
                r['metodoShow'] = m['show']
              }
            })
            const aqui = r['fecha'].split('/')
            r['fecha_compara'] = new Date(aqui[2],aqui[1] - 1,aqui[0],0,0,0,0)
          })
          // asignacion de resultados y mandar traer el metodo para el filtrado de la informacion
          this.ResultadosDiarios = resultadosFinales
          this.filtraPorSucursal()
        }
      })
    }else{
      const starCountRef = ref(db, `gastosDiarios/${this.SUCURSAL}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          // convertir informacion en arreglo para su asignacion en la tabla
          let resultadosFinales = []
          let arreglo= snapshot.val()
          //obtener las claves Y realizar el barido de la informacion 
          const claves = Object.keys(arreglo)
          claves.forEach(c=>{
            const registrosDia = this._publicos.crearArreglo2(arreglo[c])
            // obtener los registros por dia 
            registrosDia.forEach(r=>{
              this.metodospago.forEach(m=>{
                if (r['metodo'] === m['valor']) {
                  r['metodoShow'] = m['show']
                }
              })
              const aqui = r['fecha'].split('/')
              r['fecha_compara'] = new Date(aqui[2],aqui[1] - 1,aqui[0],0,0,0,0)
              resultadosFinales.push(r)
            })
          })
          // asignacion de resultados y mandar traer el metodo para el filtrado de la informacion
          this.ResultadosDiarios = resultadosFinales
          this.filtraPorSucursal()
        }
      })
    }
    
  }
  filtraPorSucursal(fecha?:Date){
    //traer las fechas mediante la funcion publica getFechaHora
    let getTime = this._publicos.getFechaHora()
    // console.log(fecha);
    
    // console.log(getTime);
    
    
    let busqueda , rango:Date
    // revisar que tipo de busqueda es la que se necesita
    switch (this.SearchDia) {
      case 'hoy':
        busqueda = getTime.fechaNumeros
        rango = getTime.fehaHoy
        break;
      case 'ayer':
        busqueda = getTime.fechaNumerosAyer
        rango = getTime.ayer
        break;
      case 'personalizado':
        // busqueda = getTime.fechaNumerosAyer
        if (fecha) {
          getTime = this._publicos.getFechaHora(fecha)
        }
        busqueda = getTime.fechaNumeros
        rango = getTime.fehaHoy
        break;
      default:
        busqueda = getTime.fechaNumeros
        rango = getTime.fehaHoy
        break;
    }
    // console.log(rango);
    
    // asiganar los resultados generales para poder utilizarlos
    let muestra = this.ResultadosDiarios
    let resultadosDia = []
    
    
    //veirificar si se encuentran los resultados dentro del rango de fechas
    muestra.forEach(mues=>{
      if (mues['fecha_compara'] >= rango && mues['fecha_compara'] <= rango) resultadosDia.push(mues)
    })
    let muestra2 = []
    // filtrado para los pertenecientes a la sucursal seleccionada en caso de ser SU
    if (this.SearchSucursal['id'] !== 'Todas') {
      muestra2 = resultadosDia.filter(r=>r['sucursal'] === this.SearchSucursal['id'])
    }else{
      muestra2 = resultadosDia
    }
    // Obtener el nombre de la sucursal a mostrar en SU
    muestra2.map(m=>{
      let {sucursal} = this.sucursales.find(d=>d['id'] ===m['sucursal'])
      m['sucursalShow'] = sucursal
    })
    
    //asignaion de resultados a la tabla para paginacion
    this.dataSourceGastosDia.data = muestra2
    
    this.newPagination('GastosDia')
    // setTimeout(()=>{
      this.generaReporte(muestra2)
    // },1000)
  }

  generaReporte(data:any[]){
    // console.log(data);
    this.filtraOcupadosMetodoEspecifico = data

    const agregados = [
      {valor:1,show:'Efectivo'},
      {valor:2,show:'Cheque'},
      {valor:3,show:'Tarjeta'},
      {valor:4,show:'OpenPay'},
      {valor:5,show:'Clip'},
      {valor:6,show:'BBVA'},
      {valor:7,show:'BANAMEX'}
    ]

    const reporteIncial = {Efectivo:0,Cheque:0,Tarjeta:0,OpenPay:0,Clip:0,BBVA:0,BANAMEX:0}
    const reporteNuevos = {Efectivo:0,Cheque:0,Tarjeta:0,OpenPay:0,Clip:0,BBVA:0,BANAMEX:0}
    const reporteFinal = {Efectivo:0,Cheque:0,Tarjeta:0,OpenPay:0,Clip:0,BBVA:0,BANAMEX:0}
    const clavesFinal = Object.keys(reporteFinal)
    // console.log(clavesFinal);
    

    const inciales2 = data.filter(iniciales=>iniciales['tipo'] === 'inicial')
    const inciales = inciales2.filter(iniciales=>iniciales['status'])
    const nuevos2 = data.filter(iniciales=>iniciales['tipo'] === 'nuevo')
    const nuevos = nuevos2.filter(iniciales=>iniciales['status'])
    const inicialUnico = data.filter(iniciales=>iniciales['tipo'] === 'inicialUnico')
    inciales.forEach((dat)=>{
      agregados.forEach(ag=>{
        if (dat['metodo'] === ag['valor']) {
          reporteIncial[ag['show']] += dat['monto']
        }
      })
    })
    inicialUnico.forEach((dat)=>{
      agregados.forEach(ag=>{
        if (dat['metodo'] === ag['valor']) {
          reporteIncial[ag['show']] += dat['monto']
        }
      })
    })
    nuevos.forEach((dat)=>{
      agregados.forEach(ag=>{
        if (dat['metodo'] === ag['valor']) {
          reporteNuevos[ag['show']] += dat['monto']
        }
      })
    })

    clavesFinal.forEach((cf)=>{
      reporteFinal[cf] = reporteIncial[cf] - reporteNuevos[cf]
    })

    //reaalizar las sumatorias finales

    let Sobrante = 0
    clavesFinal.forEach((cf)=>{
      Sobrante += reporteFinal[cf]
    })

    // console.log(Sobrante);
    
    
    // console.log(reporteIncial);
    // console.log(reporteNuevos);
    // console.log(reporteFinal);
    this.reporteShow = 'General'
    
    this.reporteFinal = reporteFinal
    this.Sobrante = Sobrante
    const updates = {};


    
    let sucursal = this.SUCURSAL
    if (this.SUCURSAL ==='Todas') {
      sucursal = this.SearchSucursal['id']
    }
    if (sucursal !=='Todas') {
      const getTime = this._publicos.getFechaHora()
      // console.log(getTime);
      const id = this._publicos.generaClave()

      const infoSave = {
        fecha: getTime.fechaM,
        hora: getTime.hora,
        id:'inicialUnico',
        monto: Sobrante,
        sucursal: sucursal,
        tipo: 'inicialUnico',
        concepto: `Sobrante de dia ${getTime.fecha}`,
        metodo: 1,
        status:true
      }
      updates[`gastosDiarios/${sucursal}/${getTime.fechaManianaNumeros}/${infoSave['id']}`] = infoSave;
      update(ref(db), updates)
      // console.log(updates);
    }
  }
  editarStatus(data: any, status){
    //verificar si existe la informacion
    if (data['id']) {
      // console.log(data);
      // convertir fecha en string tipo Date
      const fecha = this._publicos.construyeFechaString(data['fecha'],data['hora'])
      // traer la fecha en numeros del la variable "fecha"
      const getTime = this._publicos.getFechaHora(fecha)
      
      const updates = {};
      updates[`gastosDiarios/${data['sucursal']}/${getTime.fechaNumeros}/${data['id']}/status`] = status;
      // console.log(updates);
      // Realizar pregunta si desea eliminar el gasto
      let mensaje = `¿Eliminar gasto tipo ${data['tipo']}`
      if(status) mensaje = `Activar gasto tipo ${data['tipo']}`
      this._publicos.mensaje_pregunta(`${mensaje}`).then(({respuesta})=>{
        if (respuesta) {
          //en caso de confirmar la respuesta realizar la actualizacion
          update(ref(db), updates).then(()=>{
            this._publicos.mensajeSwal('Accion correcta!!')
          })
          //en caso de error informar mediante mensaje
          .catch(erro=>{
            this._publicos.mensajeSwalError('Error al eliminar gasto')
          })
        }
      })
      
      // update(ref(db), updates);
    }
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
  selected(type: string, event: MatDatepickerInputEvent<Date>){
    // console.log(event.value);
    const valor = event.value
    if (valor['_d'] instanceof Date) {
      this.filtraPorSucursal(valor['_d'])
    }
  }
  editarGasto(data:any){
    // verificar si existe id en la data para continuar con la edicion de informacion de gasto
    if (data['id']) {
      this.formGasto.reset({
        id: data['id'],
        monto: data['monto'],
        tipo: data['tipo'],
        metodo: data['metodo'],
        sucursal: data['sucursal'],
        concepto: data['concepto'],
        fecha: data['fecha'],
        hora: data['hora'],
      })
      //variable para activar modo edicion
      this.Editar = true
    }
  }

  ///paginacion de los resultados
  newPagination(data:string){
    //despues de la asiganacion de la data esperar .5 segundos para realizar paginacion
    setTimeout(() => {
    if (data==='GastosDia') {
      this.dataSourceGastosDia.paginator = this.paginator;
      this.dataSourceGastosDia.sort = this.sort
    }
    }, 500)
  }

}
