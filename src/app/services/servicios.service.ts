import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from "../../environments/environment";

const urlServer = environment.firebaseConfig.databaseURL

import { child, get, getDatabase, onValue, ref, set,update  } from "firebase/database"
import { ServiciosPublicosService } from './servicios-publicos.service';
import { ClientesService } from './clientes.service';
import { VehiculosService } from './vehiculos.service';
import { SucursalesService } from './sucursales.service';
const db = getDatabase()
const dbRef = ref(getDatabase());
@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private http: HttpClient, private _publicos: ServiciosPublicosService, private _clientes: ClientesService, 
    private _vehiculos: VehiculosService, private _sucursales: SucursalesService) { }

  async no_OS(infoSucursal: string,rol:string ){
    let no_OS = '', numero = 0, secuencia=''; let ceros = ''
    let mes = ''; let sucursal= '', nuevoRol:string ='', cuantas:number = 0

    const date: Date = new Date()
    const anio = String(date.getFullYear())
    let muestra = anio.slice(anio.length-2,anio.length)
    if((date.getMonth() +1)<10) { mes = `0${(date.getMonth() +1)}` }else{ mes=`${(date.getMonth() +1)}` }

    await get(child(dbRef, `recepciones`)).then((snapshot) => {
      if (snapshot.exists()) {
        const contador = this._publicos.crearArreglo2(snapshot.val())
        cuantas = contador.length
      } 
    }).catch((error) => {
      console.error(error);
    });
    const inicio = String(cuantas).length
    const final = 5
    for (let index = inicio; index < final ; index++) {
      ceros = `${ceros}0`
    }
    secuencia = `${ceros}${cuantas + 1}`
    const nombreSucursal:string = infoSucursal      
    sucursal = nombreSucursal.slice(0,2).toUpperCase() 
    const rolString:string = rol      
    nuevoRol = rolString.slice(0,2).toUpperCase()
    no_OS = `${sucursal}${mes}${muestra}${nuevoRol}${secuencia}` 
    return no_OS
  }

  async getRecepcionUnica(ID:string){
    let answer ={informacion:false,data:{infoCliente:[],infoVehiculo:[]},error:''}
    await get(child(dbRef, `recepciones/${ID}`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        const info = snapshot.val()
        let nueva ={...info}
        await this._clientes.infoCliente(info.cliente).then(({informacion,info})=>{
          const tempData = {...info,fullname:`${info['nombre']} ${info['apellidos']}`}
          nueva.infoCliente = tempData          
        })
        await this._vehiculos.infoVehiculo(info.vehiculo).then(({contenido, vehiculo})=>{
          nueva.infoVehiculo = vehiculo
        })
        answer['data'] = nueva
        answer.informacion = true
      }
    }).catch((error) => {
      console.error(error);
      answer.error = error
    });
    return answer
  }
  async getRecepcionesnew(){
    let answer = {valido: false, data:[]}
    await get(child(dbRef, `recepciones`)).then(snapshot => {
      if (snapshot.exists()) {     
        answer.data = this._publicos.crearArreglo2(snapshot.val()) 
        answer.valido = true
      } 
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  realizarPagos(data){
    let answer = {total : data['desgloce'].total ,subtotal: data['desgloce'].subtotal,pagado:0, debe:0, gastos:0, utilidad_iva:0, utilidad:0, real_gastos_mo:0, real_gastos_refaccion:0,real_pagos_mo:0, real_pagos_refaccion:0, total_real_refacciones:0,total_real_mo:0,total_ul:0}
    
    let total_gastos = 0, pagado = 0
    let HistorialGastos = [], HistorialPagos = []
    if (data['HistorialGastos2']) HistorialGastos =  data['HistorialGastos2']
    // data['HistorialGastos'] ?  : HistorialGastos = []

    data['gastos_'].forEach(g=>{
      if (g['status']) {
        total_gastos += g['monto']
        if(g['gasto_tipo'] === 'refaccion'){
          answer.real_gastos_refaccion += g['monto']
        }else{
          answer.real_gastos_mo += g['monto']
        }
      }
    })

      // for (let index = 0; index < HistorialGastos.length; index++) {
      //   const element = HistorialGastos[index];
      //   if (element['status']) {
      //     total_gastos += element['monto']
      //     if(element['gasto_tipo'] === 'refaccion'){
      //       answer.real_gastos_refaccion += element['monto']
      //     }else{
      //       answer.real_gastos_mo += element['monto']
      //     }
      //   }
        
      // }
      
    
    if(data['HistorialGastos2'] ) HistorialPagos =  data['HistorialGastos2']
    data['pagos_'].forEach(p=>{
      if (p['status']) {
        answer.pagado += p['monto']
      }
    })
      // for (let index = 0; index < HistorialPagos.length; index++) {
      //   const element = HistorialPagos[index];
      //   if (element['status']) {
      //     pagado += element['monto']
      //     // if(element['gasto_tipo'] === 'refaccion'){
      //     //   answer.real_pagos_refaccion += element['monto']
      //     // }else{
      //     //   answer.real_pagos_mo += element['monto']
      //     // }
      //   }
      // }
      answer.total_real_refacciones =   answer.real_pagos_refaccion - answer.real_gastos_refaccion
      answer.total_real_mo =   answer.real_pagos_mo - answer.real_gastos_mo
      answer.debe = answer.total - pagado
      answer.pagado = pagado
      answer.gastos = total_gastos
      answer.utilidad = answer.subtotal - answer.gastos
      answer.utilidad_iva = answer.total - answer.gastos
      // answer.total_ul = (answer.real_gastos_refaccion + answer.real_gastos_mo )
    return answer 
  }
  
  async actualizahistorialPagos(padre,data){
    let answer = {registroOK:false}
    await set(ref(db, `recepciones/${padre}/HistorialPagos`), data )
        .then(async () => {
          // Data saved successfully!
          answer.registroOK = true
        })
        .catch((error) => {
          // The write failed...
          answer.registroOK = false
        });
    return answer
  }
  async actualizahistorialGastos(padre,data){
    let answer = {registroOK:false}
    await set(ref(db, `recepciones/${padre}/HistorialGastos`), data )
        .then(async () => {
          // Data saved successfully!
          answer.registroOK = true
        })
        .catch((error) => {
          // The write failed...
          answer.registroOK = false
        });
    return answer
  }
  diasSucursal(f1:any,f2:any){
    
    var aFecha1 = f1.split('/');
     var aFecha2 = f2.split('/');
     var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
     var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
     var dif = fFecha2 - fFecha1;
     var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
     return dias;
  }
  async realizarOperaciones(array:any[],margen:number, iva:boolean){
    // console.log(array);
    const dataCotizacion = array
    const dataReturn = {totalMO:0,sobrescrito:0,refacciones1:0,refacciones2:0, subtotal:0, IVA:0,total:0,UB:0}
    let mo=0, refacciones1 =0,refacciones2=0,totalImportante=0
    for (let index = 0; index < dataCotizacion.length; index++) {
          
      const element = dataCotizacion[index];

      if (element.aprobado) {
        const cantidad = element.cantidad
        if (element.tipo === 'paquete') {
          const Subelementos = element.elementos
   
          if (element.costo>0) {
            totalImportante = totalImportante + (cantidad * element.costo)
          }else{
            const infoPaquete = this._publicos.costodePaquete(Subelementos,margen)
            mo = mo + infoPaquete.mo
            refacciones1 = refacciones1 + infoPaquete.refacciones1
            refacciones2 = refacciones2 + infoPaquete.refacciones2
            dataCotizacion[index].precio = infoPaquete.flotilla
          }
          
        }else if (element.tipo === 'MO') {
          if (element.costo>0) {
            const operacion = cantidad * element.costo
            totalImportante = totalImportante + operacion
            dataCotizacion[index].precio = operacion
          }else{
            const operacion = element.precio * cantidad
            mo = mo + operacion
            dataCotizacion[index].precio = operacion
          }          
        }else if (element.tipo === 'refaccion') {
          if (element.costo>0) {            
            const operacion = cantidad * element.costo
            totalImportante = totalImportante + operacion
            dataCotizacion[index].precio = operacion
          }else{
            const operacion = element.precio * cantidad
            refacciones1 = refacciones1 + operacion
            // refacciones2 = refacciones2 + (operacion * (margen / 100) + 1)
            dataCotizacion[index].precio = operacion
          }              
        }  
      }
      // console.log('aqui');
      
    }
    // console.log(mo);
    

    const opera = refacciones1 * (1 + (margen/100)) + mo +totalImportante
    // console.log(opera);

    
    
    dataReturn['totalMO'] = mo
    dataReturn['sobrescrito'] = totalImportante
    dataReturn['refacciones1'] = refacciones1
    dataReturn['refacciones2'] = refacciones1 * (1 + (margen/100))
    const UB = ((opera - refacciones1)*100) / opera
    dataReturn.UB = Number(this._publicos.redondeado(UB))
    if (iva) {
      const nuevo = opera * 1.16
      const ivaNuevo  = opera * .16
      dataReturn['subtotal'] =  opera
      dataReturn['IVA'] =  ivaNuevo
      dataReturn['total'] =  nuevo
    }else{  
      dataReturn['total'] =  opera
    }
    return dataReturn
  }

  getRecepciones(cliente:string,vehiculo:string){
    return this.http.get(`${urlServer}/recepcion/${cliente}/${vehiculo}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getRecepcion(cliente:string,vehiculo:string,recepcion:string){
    return this.http.get(`${urlServer}/recepcion/${cliente}/${vehiculo}/${recepcion}.json`)
  }
  getStatusRecepcion(cliente:string,vehiculo:string, recepcion:string,recepcionStatus:string){
    return this.http.get(`${urlServer}/recepcionStatus/${cliente}/${vehiculo}/${recepcion}/${recepcionStatus}.json`)
  }
  actualizaStatus(sucursal:string,cliente:string,vehiculo:string, recepcion:string,dataRecepcion:any){
    const temp = {
      ...dataRecepcion
    }
    return this.http.put(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${vehiculo}/${recepcion}.json`,temp)
  }
  getRecepcionSucursalUnica(sucursal:string,cliente:string){
    return this.http.get(`${urlServer}/recepcion/${sucursal}/${cliente}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getRecepcionesSucursalUnica(sucursal:string,cliente:string, vehiculo:string){
    return this.http.get(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${vehiculo}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }



  private crearArreglo(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
    const arraypush: any = arrayObj[key]
    //arraypush.id=key
    arrayGet.push(arraypush)
    })
    return arrayGet
  }
  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
    const arraypush: any = arrayObj[key]
    arraypush.id=key
    arrayGet.push(arraypush)
    })
    return arrayGet
  }
}
