import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

import { environment } from "../../environments/environment"
const urlServer = environment.firebaseConfig.databaseURL
@Injectable({
  providedIn: 'root'
})
export class CitasService {

  constructor(private http: HttpClient) { }

  consulta_citas_new(sucursal, fecha): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `citas/${sucursal}/${fecha}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const citas = snapshot.val()
          resolve(citas);
        } else {
          resolve([]);
        }
      });
    });
  }
  citasDia(sucursal:string, fecha:string){
    return this.http.get(`${urlServer}/citas/${sucursal}/${fecha}.json`)
    .pipe(  
       map(this.crearArreglo2)
    )
  }
    verificaCitasDia(fecha_registro:string,sucursal:string){
    return this.http.get(`${urlServer}/citas/${sucursal}/${fecha_registro}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  guardarCita(fecha_registro:string,dataCita:any, fecha:string){
    const temp = {
      ...dataCita
    }
    temp.fecha = fecha
    return this.http.post(`${urlServer}/citas/${dataCita.sucursal}/${fecha_registro}.json`,temp)
  }
  getHorarios(sucursal:string, diaSemana:string){
    return this.http.get(`${urlServer}/horarios/${sucursal}/${diaSemana}.json`)
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
