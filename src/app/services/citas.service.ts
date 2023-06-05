import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

import { environment } from "../../environments/environment"
import { ServiciosPublicosService } from './servicios-publicos.service';
const urlServer = environment.firebaseConfig.databaseURL
@Injectable({
  providedIn: 'root'
})
export class CitasService {

  constructor(private http: HttpClient, private _publicos: ServiciosPublicosService) { }

  consulta_citas_new(sucursal, fecha): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas/${sucursal}/${fecha}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          // const citas = snapshot.val()
          const citas = this._publicos.crearArreglo2(snapshot.val())
          resolve(this._publicos.ordenarData(citas,'horario',true));
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_cita_existe_new(sucursal, fecha): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas/${sucursal}/${fecha}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const citas = this._publicos.crearArreglo2(snapshot.val())
          resolve(citas);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_cita_existestentes_new(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `Citas`);
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
  consulta_horarios_sucursal_new(sucursal): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `horarios/${sucursal}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const horarios = snapshot.val()
          resolve(horarios);
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
