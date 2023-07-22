import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, scheduled } from 'rxjs';
import { environment } from 'src/environments/environment';
import { statusRecepcion } from '../models/statusrecepcion.model';
const urlServer = environment.firebaseConfig.databaseURL
@Injectable({
  providedIn: 'root'
})
export class RecepcionService {

  constructor(private http: HttpClient) { }

  camposReporte_estadisticas_arr:object[] = [
    {valor:'TotalGastado', show:'Total gastado'},
    {valor:'ticketGeneral', show:'Ticket general'},
  ]
  camposReporte_estadisticas_object:object = {
    TotalGastado: 0,
    ticketGeneral: 0,
  }
  obtenrData(){
    return this.http.get(`${urlServer}/recepcion.json`)
  }
  listaRecepciones(){
    return this.http.get(`${urlServer}/recepcion.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getRecepcionUnica(id:string){
    return this.http.get(`${urlServer}/recepcion/${id}.json`)
    .pipe(
      map(this.crearArreglo2)
   )
  }
  listaRecepcionesStatus(ID:string,vehiculo:string){
    return this.http.get(`${urlServer}/recepcionStatus/${ID}/${vehiculo}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getPlaca(ID:String,vehiculo:string){
    return this.http.get(`${urlServer}/vehiculos/${ID}/${vehiculo}.json`)
  }
  guardarRecepcion(sucursal:string, cliente:string,dataArticulos:any,data:any,clavenueva:string){    
    const temp ={
      ...data,
      cotizacion: false,
      firmaConsentimiento:false,
      firmaEntrega:false,
      rayarDetalles:false,
      sucursal: sucursal
    }    
    temp.articulos = {
      ...dataArticulos
    }
    if (clavenueva!=='') {
      temp.cotizacion = true
      return this.http.put(`${urlServer}/recepcion/${clavenueva}.json`,temp)
    }else{
      return this.http.post(`${urlServer}/recepcion.json`,temp)
    }
    
  }
  getArticulosRecepcion(cliente:string,vehiculo:string, recepcion:string){
    return this.http.get(`${urlServer}/recepcion/articulos.json`)
  }
  actualizaRecepcion(dateRecepcion:any,recepcion:string,dataArticulos:any){
    const temp ={
      ...dateRecepcion
    }
    const articulos={
      ...dataArticulos
    }
    temp.articulos = articulos
    return this.http.put(`${urlServer}/recepcion/${dateRecepcion.cliente}/${recepcion}.json`,temp)
  }
  ///
  consultaRecepcionClienteVehiculo(cliente:string,vehiculo:string,idrecepcion:string){
    return this.http.get(`${urlServer}/recepcion/${cliente}/${idrecepcion}.json`)
  }
  getStatusRecepcion(sucursal:string, cliente:string,vehiculo:string,recepcion:string){
    return this.http.get(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${vehiculo}/${recepcion}.json`)
  }
  getStatusRecepciones(sucursal:string,cliente:string, data:any){
    return this.http.get(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${data.vehiculo}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  cancelaRecepcion(dataRecepcion:any,dataStatus:any){
    const temp ={
      ...dataStatus
    }
    temp.status = 'Cancelada'
    return this.http.put(`${urlServer}/recepcionStatus/${dataRecepcion.idCliente}/${dataRecepcion.idVehiculo}/${dataRecepcion.id}.json`,temp)
  }
  //estado del vehiculo
  registraEstadoVehiculo(sucursal:string,cliente:string,IDRecepcion:string,data:any,fecha:string,hora:string,clavenueva:string){
    let vehiculo=data.vehiculo
    const temp={
      status:'pendiente',
      fecha_recibido:fecha,
      hora_recibido:hora,
      fecha_entregado:'pendiente',
      hora_entregado:'pendiente'
    }
    if (clavenueva!=='') {
      temp.status = 'cotizacion'
      return this.http.put(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${vehiculo}/${clavenueva}.json`,temp)
    }else{
      return this.http.put(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${vehiculo}/${IDRecepcion}.json`,temp)
    }
    
  }
  getRecepciones(sucursal:string, cliente:string){
    return this.http.get(`${urlServer}/recepcion/${sucursal}/${cliente}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getVehiculoRecepcionStatus(ID:string,vehiculo:string,id:string){
    return this.http.get(`${urlServer}/recepcionStatus/${ID}/${vehiculo}/${id}.json`)
  }
  verificaExisteRegistro(sucursal:string,ID:string){
     return this.http.get(`${urlServer}/recepcion.json`)
  }
  listaVehiculoRecepcionStatus(sucursal:string, cliente:string,data:any){
    return this.http.get(`${urlServer}/recepcionStatus/${sucursal}/${cliente}/${data.vehiculo}.json`)
    .pipe(
       map(this.crearArreglo)
    )
  }
  verificarPlacasStatus(data:any){
    let vehiculo=data.vehiculo
     return this.http.get(`${urlServer}/recepcionStatus/${data.cliente}/${vehiculo}.json`)
     .pipe(
        map(this.crearArreglo2)
     )
  }
  verificarStatus(data:any,ID:string,id:string){
    let vehiculo=data.vehiculo
     return this.http.get(`${urlServer}/recepcionStatus/${ID}/${vehiculo}/${id}.json`)
  }
  consultaStatusVehiculoCiente(cliente:string,vehiculo:string,recepcion:string){
     return this.http.get(`${urlServer}/recepcionStatus/${cliente}/${vehiculo}/${recepcion}.json`)
  }
  

  //arreglos transformar data
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
