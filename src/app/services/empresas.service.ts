import { Injectable } from '@angular/core';
import { ServiciosPublicosService } from './servicios-publicos.service';


import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());
          
@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(private _publicos: ServiciosPublicosService) { }


  consulta_sucursales_new(sucursal): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `empresas/${sucursal}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const empresas = this._publicos.crearArreglo2(snapshot.val())
          const empre = empresas.map(emp => ({
            empresa: String(emp['empresa']).toLowerCase(),
            id: emp['id'],
            sucursal: sucursal
          }));
          
          resolve(this._publicos.ordenarData(empre,'empresa',true));
        } else {
          resolve([]);
        }
      });
    });
  }
  async listaempresas(){
    let answer = {contenido:false, data:[]}
    await get(child(dbRef, `empresas`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        
        
        const empresas = Object.keys(snapshot.val())
        const em_ = snapshot.val()
        let empresasFinal = []
        empresas.forEach((em)=>{
          let emp_ = []
          if(em_[em]) emp_ = this._publicos.crearArreglo2(em_[em])
         
          emp_.forEach((f)=>{
            const temp = {
              empresa: f['empresa'],
              id: f['id'],
              sucursal: em
            }
            empresasFinal.push(temp)
          })
        })
        answer.data = empresasFinal
        answer.contenido =  true
      }
    }).catch((error) => {
      console.error(error);
    });
    
    return answer
  }
}
