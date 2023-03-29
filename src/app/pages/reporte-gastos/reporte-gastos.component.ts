import { Component, OnInit, ViewChild } from '@angular/core';
import { EncriptadoService } from 'src/app/services/encriptado.service';
import { ServiciosPublicosService } from '../../services/servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


//paginacion
import {MatPaginator, MatPaginatorIntl,PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
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
    {valor:1, show:'Efectivo'},
    {valor:2, show:'Cheque'},
    {valor:3, show:'Tarjeta'},
    {valor:4, show:'OpenPay'},
    {valor:5, show:'Clip / Mercado Pago'},
    {valor:6, show:'Terminal BBVA'},
    {valor:7, show:'Terminal BANAMEX'}
  ]
  metodo_select = {metodo:1, show:'Efectivo'}
  tipo_gasto:string = 'nuevo'
  
  
  gastos: string[] = ['nuevo', 'inicial'];
  ROL:string; SUCURSAL:string
  sucursales =[]
  sucursalSelect:string

  formGasto: FormGroup;

  historialGastosDia = []
  Editar:boolean = false

  
  dataSourceGastosDia = new MatTableDataSource(); //elementos
  columnasGastosDia:string[] = ['concepto','metodo','monto','tipo','opciones']
  @ViewChild('GastosDiaPaginator') paginator: MatPaginator //elementos
  @ViewChild('GastosDia') sort: MatSort //elementos

  ordenamiento : boolean = true

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
    this.metodo_select = data
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
  }
  registraGasto(){
    if (this.formGasto.valid) {
      // this._publicos.mensajeSwal('registro continuar')
      const data = this.formGasto.value
      const getTime = this._publicos.getFechaHora()
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
        metodo: Number(data['metodo'])
      }
      if (data['id']) {
        ///en caso de que desee editar informacion el id cambia para que se edicion de informacion
        infoSave['id'] = data['id']
        updates[`gastosDiarios/${data['sucursal']}/${getTime.fechaNumeros}/${data['id']}`] = infoSave;
      }else{
        ///en caso de que desee registrar informacion el id cambia para que se nuevo registro de informacion
        if (data['tipo'] === 'nuevo') id = this._publicos.generaClave()
        else id = 'inicial'
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
          })
          this.dataSourceGastosDia.data = resultadosFinales
          ///mandar traer la paginacion de resultados
          this.newPagination('GastosDia')
        }
      })
    }else{
      const starCountRef = ref(db, `gastosDiarios/${this.SUCURSAL}/${getTime.fechaNumeros}`)
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          // convertir informacion en arreglo para su asignacion en la tabla
          let arreglo= this._publicos.crearArreglo2(snapshot.val())
          arreglo.map(r=>{
            this.metodospago.forEach(m=>{
              if (r['metodo'] === m['valor']) {
                r['metodoShow'] = m['show']
              }
            })
          })
          this.dataSourceGastosDia.data = arreglo
          ///mandar traer la paginacion de resultados
          this.newPagination('GastosDia')
        }
      })
    }
    
  }
  ordenarElementos(campo:string){
    let info =  []
    info = [...this.dataSourceGastosDia.data]
    
    // console.log(this.ordenamiento);
    

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

  editarGasto(data:any){
    // console.log(data);
    if (data['id']) {
      this.formGasto.reset({
        id: data['id'],
        monto: data['monto'],
        tipo: data['tipo'],
        metodo: data['metodo'],
        sucursal: data['sucursal'],
        concepto: data['concepto'],
      })
      this.Editar = true
    }
  }

  ///paginacion de los resultados
  newPagination(data:string){
    setTimeout(() => {
    if (data==='GastosDia') {
      this.dataSourceGastosDia.paginator = this.paginator;
      this.dataSourceGastosDia.sort = this.sort
    }
    }, 500)
  }

}
