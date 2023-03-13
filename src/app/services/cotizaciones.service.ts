import { Injectable } from '@angular/core';
import { ServiciosPublicosService } from './servicios-publicos.service';

import { child, get, getDatabase, onValue, ref, set } from "firebase/database"
import { ClientesService } from './clientes.service';
import { VehiculosService } from './vehiculos.service';
import { SucursalesService } from './sucursales.service';
import { ServiciosService } from './servicios.service';
const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({
  providedIn: 'root'
})
export class CotizacionesService {

  constructor(
    private _publicos: ServiciosPublicosService,private _clientes: ClientesService,private _vehiculos: VehiculosService,
    private _sucursales: SucursalesService, private _servicios:ServiciosService
  ) { }
  async infoCotizaciones(){
    let cotizaciones = []
    const answer = {valores:false,arreglo:[]}
    await get(child(dbRef, `cotizacionesRealizadas`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        const listaCotizaciones:any[] = await this._publicos.crearArreglo2(snapshot.val())
        for (let index = 0; index < listaCotizaciones.length; index++) {
          const element = listaCotizaciones[index];
          
          await this._clientes.infoCliente(element.cliente).then(({informacion,info})=>{
            if (informacion) {
              listaCotizaciones[index].infoCliente = info
            }
          })
          await this._vehiculos.infoVehiculo(element.vehiculo).then(({contenido,vehiculo})=>{
            if (contenido) {
              listaCotizaciones[index].infoVehiculo = vehiculo
            }
            // listaCotizaciones[index].infoVehiculo = infoVehiculo
          })
          await this._sucursales.inforSucursalUnica(element.sucursal).then((infoSucursal:any)=>{
            
            listaCotizaciones[index].infoSucursal = infoSucursal
          })
          listaCotizaciones[index].index = index
          if (!element.elementos) element.elementos = []
          const ele_mentos = element.elementos
          for (let ind_aprobado = 0; ind_aprobado < ele_mentos.length; ind_aprobado++) {
            ele_mentos[ind_aprobado].aprobado = true
          }
          element.elementos = ele_mentos
          
          const datOperaciones = await this.realizarOperaciones(ele_mentos,element.margen,element.iva)
          listaCotizaciones[index].desgloce = datOperaciones
        }
        answer.arreglo = cotizaciones = listaCotizaciones
        
      }
    }).catch((error) => {
      console.error(error);
    });
    (cotizaciones.length)? answer.valores = true : answer.valores = false
    return answer
  }
  async getInfo_cotizacion_unica(id:string){
    let data =[];
    await get(child(dbRef, `cotizacionesRealizadas/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val()
      } 
    }).catch((error) => {
      console.error(error);
    });
    return data
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
        (!element.elementos) ? element.elementos = [] : null
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
}