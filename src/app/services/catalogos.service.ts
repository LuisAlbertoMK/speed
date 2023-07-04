import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ManoObra } from '../models/ManoObra.model';

import { map } from 'rxjs';
import { Refacciones } from '../models/refacciones.model';
import { Paquete } from '../models/paquete.model';
import { tipoJson } from '../models/tipoJson.model'
import { environment } from "../../environments/environment";
const urlServer = environment.firebaseConfig.databaseURL

import { child, get, getDatabase, onValue, ref, set } from "firebase/database"
import { ServiciosPublicosService } from './servicios-publicos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(private http: HttpClient, private _publicos:ServiciosPublicosService) { }

  consulta_mo_new(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `manos_obra`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const mo = this._publicos.crearArreglo2(snapshot.val())
          mo.map((r,index)=>{ 
            r['tipo'] = 'mo',
            r.index = index 
            r.descripcion = (r.descripcion) ? r.descripcion : ''
          })
          resolve(mo);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_refacciones_new(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `refacciones`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const refacciones = this._publicos.crearArreglo2(snapshot.val())
          refacciones.map((r,index)=>{ 
            r['tipo'] = 'refaccion'
            r.index = index 
            r.descripcion = (r.descripcion) ? r.descripcion : ''
           })
          resolve(refacciones);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_paquetes_new(unidos): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `paquetes`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const paquetes= this._publicos.crearArreglo2(snapshot.val())
            for (const [index, p] of paquetes.entries()) {
              const {elementos, reporte} = this._publicos.reportePaquete(p.elementos, 1.25);
              const elementosActualizados = elementos.map((e) => {
                if (e.catalogo || e.enCatalogo) {
                  const info = unidos.find((u) => u.id === e.IDreferencia) ?? {};
                  const camposNuevos = ['id', 'nombre', 'tipo'];
          
                  camposNuevos.forEach((c) => {
                    e[c] = info[c] ?? '';
                  });
                }
                return e;
              });
          
              paquetes[index] = {
                ...p,
                index,
                elementos: elementosActualizados,
                reporte,
                precio: reporte.total,
                total: reporte.total,
                tipo: 'paquete',
                aprobado: true,
                cantidad: 1,
                costo: 0,
              };
            }
          resolve(paquetes);
        } else {
          resolve([]);
        }
      });
    });
  }

  async listaPaquetes(){
    let paquetes = []
    await get(child(dbRef, `paquetes`)).then((snapshot) => {
      if (snapshot.exists()) {
        paquetes = this._publicos.crearArreglo2(snapshot.val())
      }
    }).catch((error) => {
      console.error(error);
    });
    return paquetes
  }
  async listaRefacciones(){
    let refacciones = []
    await get(child(dbRef, `refacciones`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data  = this._publicos.crearArreglo2(snapshot.val())
        for (let index = 0; index < data.length; index++) {
          data[index].tipo = 'refaccion'
        }
        refacciones = data
      }
    }).catch((error) => {
      console.error(error);
    });
    return refacciones
  }
  async listaMO(){
    let MO = []
    await get(child(dbRef, `manos_obra`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = this._publicos.crearArreglo2(snapshot.val())
        for (let index = 0; index < data.length; index++) {
          data[index].tipo = 'mo'
        }
        MO = data
      }
    }).catch((error) => {
      console.error(error);
    });
    return MO
  }
  async infoElemento(ruta:string){
    let infoElemento = {}
    await get(child(dbRef, `${ruta}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const info = {...snapshot.val()};
        (info.descripcion === 'undefined' || !info.descripcion)? info.descripcion ='' : '';
        infoElemento = info;
      }
    }).catch((error) => {
      console.error(error);
    });
  return infoElemento
  }
  async saveElemento(ruta:string,data:any){
    let answer ={resp:false,mensaje:''}
    //obtenemos respuesta si se guarado correctamente
    await set(ref(db, `${ruta}`), data )
          .then(() => {
            answer.resp = true
            answer.mensaje = 'registro correcto'
          })
          .catch((error) => {
            // The write failed...
            answer.resp = false
            answer.mensaje = error
          });
    return answer
  }

  listaManoObra(){
    return this.http.get(`${urlServer}/manos_obra.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  getManoObraID(id:string){
    return this.http.get(`${urlServer}/manos_obra/${id}.json`)
  }
  guardaManoObra(manoObra: ManoObra){
    const temp={
      ...manoObra
    }
    temp.status = true
    return this.http.post(`${urlServer}/manos_obra.json`,temp)
  }
  actualizaManoObra(id:String,manoObra: ManoObra){
    const temp={
      ...manoObra
    }
    temp.status = true
    return this.http.put(`${urlServer}/manos_obra/${id}.json`,temp)
  }
  eliminaManoObra(dataManoObra:any){
    const temp = {
      ...dataManoObra
    }
    temp.status = false
    return this.http.put(`${urlServer}/manos_obra/${dataManoObra.id}.json`,temp)
  }
  ActivaManoObra(dataManoObra:any){
    const temp = {
      ...dataManoObra
    }
    temp.status = true
    return this.http.put(`${urlServer}/manos_obra/${dataManoObra.id}.json`,temp)
  }
  ///refacciones
  listarRefacciones(){
    return this.http.get(`${urlServer}/refacciones.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  async listadoRefacciones(){
    let refacciones = []
    await get(child(dbRef, `refacciones`)).then((snapshot) => {
      if (snapshot.exists()) {
        refacciones = this._publicos.crearArreglo2(snapshot.val())
      }
    }).catch((error) => {
      console.error(error);
    });
    return refacciones
  }
  async listadoManos_obra(){
    let manos_obra = []
    await get(child(dbRef, `manos_obra`)).then((snapshot) => {
      if (snapshot.exists()) {
        manos_obra = this._publicos.crearArreglo2(snapshot.val())
      }
    }).catch((error) => {
      console.error(error);
    });
    return manos_obra
  }
  guardarRefaccion(refaccion: Refacciones){
    const temp={
      ...refaccion
    }
    temp.status = true
    return this.http.post(`${urlServer}/refacciones.json`,temp)
  }
  getRefaccionID(id:string){
    return this.http.get(`${urlServer}/refacciones/${id}.json`)
  }
  actualizaRefaccion(idRefaccion:string,DataRefaccion: any){
    const temp={
      ...DataRefaccion
    }
    return this.http.put(`${urlServer}/refacciones/${idRefaccion}.json`,temp)
  }
  actualizaStatusRefaccion(status:string, dataRefaccion:any){
    const temp={
      ...dataRefaccion
    }
    temp.status = status
    return this.http.put(`${urlServer}/refacciones/${dataRefaccion.id}.json`,temp)
  }
  //paquetes
  listarPaquetes(){
    return this.http.get(`${urlServer}/paquetes.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  guardarPaquete(paquete: Paquete){
    const temp ={
      ...paquete
    }
    return this.http.post(`${urlServer}/paquetes.json`,temp)
  }
  getPaqueteID(id:string){
    return this.http.get(`${urlServer}/paquetes/${id}.json`)
  }
  actualizaPaquete(id:string, paquete: Paquete){
    const temp ={
      ...paquete,
      total:0
    }

    return this.http.put(`${urlServer}/paquetes/${id}.json`,temp)
  }

  guardarRefaccionOnly(ID:string,refaccionData: any,refaccion: tipoJson){
    const temp ={
      ...refaccion
    }

    temp.subtotal= refaccionData.precioCompra * temp.cantidad
    temp.tipo = 'refacciones'
    return this.http.put(`${urlServer}/paquetesComplementos/${ID}/${refaccion.IDreferencia}.json`,temp)
  }
  registraManoObraPaquete(paquete:string, dataManoObra:any){
    const temp ={
      ...dataManoObra
    }
    temp.tipo = 'Mano obra'
    return this.http.put(`${urlServer}/paquetesComplementos/${paquete}/${dataManoObra.IDreferencia}.json`,temp)
  }
  consultaGetRefaccionUnica(id:string){
    return this.http.get(`${urlServer}/refacciones/${id}.json`)
  }

  listaConjunta(ID:string){
    return this.http.get(`${urlServer}/paquetesComplementos/${ID}.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  getCostoManoObra(mano:string){
    return this.http.get(`${urlServer}/manos_obra/${mano}/precio.json`)
  }
  verificaExisteComplemento(ID:string,refaccionData: tipoJson,refaccion: tipoJson){
    return this.http.get(`${urlServer}/paquetesComplementos/${ID}/${refaccion.IDreferencia}.json`)
  }
  getManoExiste(paquete:string,dataManoObra:any){
    return this.http.get(`${urlServer}/paquetesComplementos/${paquete}/${dataManoObra.mano}.json`)
  }
  actualizarData(ID:string,refaccionData: tipoJson,cantidadTemporal,refaccion: tipoJson){
    const temp ={
      ...refaccion
    }

    temp.tipo = 'refacciones'
    temp.cantidad= temp.cantidad + cantidadTemporal
    temp.subtotal= refaccionData.precioCompra * temp.cantidad
    return this.http.put(`${urlServer}/paquetesComplementos/${ID}/${refaccion.IDreferencia}.json`,temp)
  }
  reemplazarDataRefaccion(ID:string,refaccionData: tipoJson,refaccion: tipoJson){
    const temp ={
      ...refaccion
    }
    temp.subtotal= refaccionData.precioCompra * temp.cantidad
    temp.tipo = 'refacciones'
    return this.http.put(`${urlServer}/paquetesComplementos/${ID}/${refaccion.IDreferencia}.json`,temp)
  }
  obtenerDataRefencia(ID:string, id:string){
    return this.http.get(`${urlServer}/paquetesComplementos/${ID}/${id}.json`)
  }
  eliminaReferencia(ID:string, id:string){
    return this.http.delete(`${urlServer}/paquetesComplementos/${ID}/${id}.json`);
  }
  getDetallesPaquete(ID:string){
    return this.http.get(`${urlServer}/paquetesComplementos/${ID}.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  upTotalPaquete(paquete:string){
    return this.http.get(`${urlServer}/paquetes/${paquete}.json`)
  }
  upnew(paquete:string,datanew:any){
    const temp  = { ...datanew}
    return this.http.put(`${urlServer}/paquetes/${paquete}.json`,temp)
  }






  //crear arreglos
  private crearArreglo(marcasObj:object){
    const marcas:any[]=[]
    if (marcasObj===null) { return [] }
    Object.keys(marcasObj).forEach(key=>{
      const marca: any = marcasObj[key]
      marcas.push(marca)
    })
    return marcas
  }
  private crearArreglo2(marcasObj:object){
    //los que son un campo con ID mas de un campo
    const marcas:any[]=[]
    if (marcasObj===null) { return [] }
    Object.keys(marcasObj).forEach(key=>{
      const marca: any = marcasObj[key]
        marca.id = key
        marcas.push(marca )
    })
    return marcas
  }
}
