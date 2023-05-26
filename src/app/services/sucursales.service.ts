import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
const urlServer = environment.firebaseConfig.databaseURL
import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { ServiciosPublicosService } from './servicios-publicos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  constructor(private http: HttpClient, private _publicos: ServiciosPublicosService) { }

  consultaSucursales_new(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, 'sucursales');
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const sucursales = this._publicos.crearArreglo2(snapshot.val());
          resolve(sucursales);
        } else {
          resolve([]);
        }
      }, {
        onlyOnce: true
      });
    });
  }
  
  async inforSucursal(sucursal:string){
    let sucursales = [], info =[]
    await get(child(dbRef, `sucursales`)).then((snapshot) => {
      if (snapshot.exists()) {
        sucursales = this.crearArreglo(snapshot.val())
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    // console.log(sucursales);
    
    for (let index = 0; index < sucursales.length; index++) {
      const element = sucursales[index];
      if (element.id === sucursal) {
        info = element
      }
    }
    return info
  }
  async consultaSucursales(){
    let answer = {contenido: false, data:[]}
    await get(child(dbRef, `sucursales`)).then((snapshot) => {
      if (snapshot.exists()) {
        answer.data = this._publicos.crearArreglo2(snapshot.val())
        answer.contenido = true
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }

  async inforSucursalUnica(id:string){
    let data = [], info =[]    
    
    await get(child(dbRef, `sucursales/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val()
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return data
  }

  guardaSucursal(sucursal:any){
    const temp={
      ...sucursal
    }
    return this.http.post(`${urlServer}/sucursales.json`,temp)
  }
  listaSucursales(){
    return this.http.get(`${urlServer}/sucursales.json`)
    .pipe(
       map(this.crearArreglo)
    )
  }
  getSucursal(id:string){
    return this.http.get(`${urlServer}/sucursales/${id}.json`)
  }
  getSucursalnew(id:string){
    return this.http.get(`${urlServer}/sucursales/${id}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  eliminarSucursal(id:string){
    return this.http.delete(`${urlServer}/sucursales/${id}.json`)
  }

  actualizaDataSucursal(ID:string,forma:any){
    const temp={
      ...forma
    }
    return this.http.put(`${urlServer}/sucursales/${ID}.json`,temp)
  }
  private crearArreglo2(arrayObj:object){
    const arrayGet:any[]=[]
    if (arrayObj===null) { return [] }
    Object.keys(arrayObj).forEach(key=>{
    const arraypush: any = arrayObj[key]

    arrayGet.push(arraypush)
    })
    return arrayGet
  }
  private crearArreglo(arrayObj:object){
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
