import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from "../../environments/environment";
const urlServer = environment.firebaseConfig.databaseURL
import { ServiciosPublicosService } from './servicios-publicos.service';

import { child, get, getDatabase, onValue, ref, set } from "firebase/database"
import { ClientesService } from './clientes.service';
import { VehiculosService } from './vehiculos.service';
import { SucursalesService } from './sucursales.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {

  constructor(private http: HttpClient,private _publicos: ServiciosPublicosService, private _clientes: ClientesService,
              private _vehiculos: VehiculosService, private _sucursales:SucursalesService) { }



  async generaNombreCotizacion(infoSucursal:string,rol:string){
    let mes = ''; let sucursal= '', nuevoRol:string ='',secuencia=''; let ceros = '', cuantas:number = 0
    let no_cotizacion:string = ''
    // const timeReques = await this._publicos.getFechaHora()
  
    const date: Date = new Date()
  
    const anio = String(date.getFullYear())
    let muestra = anio.slice(anio.length-2,anio.length)
  
    if((date.getMonth() +1)<10) { mes = `0${(date.getMonth() +1)}` }else{ mes=`${(date.getMonth() +1)}` }
    await get(child(dbRef, `cotizacionesRealizadas`)).then((snapshot) => {
      if (snapshot.exists()) {
        let nuev:any[] = this._publicos.crearArreglo2(snapshot.val())
        cuantas = nuev.length
      }
    }).catch((error) => {
      // console.error(error);
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

    no_cotizacion = `${sucursal}${mes}${muestra}${nuevoRol}${secuencia}`
    
    return no_cotizacion
  }

  newCotizacion(sucursal:string,cliente:string,vehiculo:string,dataCot:any){
    const tempData = {
      ...dataCot
    }
    tempData.status = 'incompleta'
    return this.http.post(`${urlServer}/cotizaciones/${sucursal}/${cliente}/${vehiculo}.json`,tempData)
  }

  async cotizacionesFull(){
    let answer = {contenido:false, cotizaciones:[]}
    await get(child(dbRef, `cotizacionesRealizadas`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        let arr_cotizaciones = this.crearArreglo2(snapshot.val())
        // console.log(arr_cotizaciones);
        answer.cotizaciones = arr_cotizaciones
        answer.contenido = true
        // console.log(arr_cotizaciones);
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
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
  async cotizaciones(){
    let ListaCotizaciones = [], existen:boolean = false
    await get(child(dbRef, `cotizacionesRealizadas`)).then((snapshot) => {
      if (snapshot.exists()) {
        ListaCotizaciones = this.crearArreglo2(snapshot.val())
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return ListaCotizaciones
  }

  private crearArreglo2(arrayObj: object) {
    const arrayGet: any[] = [];
    if (arrayObj === null) {
      return [];
    }
    Object.keys(arrayObj).forEach((key) => {
      const arraypush: any = arrayObj[key];
      arraypush.id = key;
      arrayGet.push(arraypush);
    });
    return arrayGet;
  }

}
