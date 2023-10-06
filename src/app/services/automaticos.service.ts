import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { child, get, getDatabase, onChildAdded, onChildChanged, onValue, ref, set } from "firebase/database"
import { initializeApp } from 'firebase/app';
import { ServiciosPublicosService } from './servicios-publicos.service';
import { EncriptadoService } from './encriptado.service';
// const app = initializeApp(environment.firebaseConfig);
const db = getDatabase();
const dbRef = ref(getDatabase());
// const urlServer = environment.urlServer

@Injectable({
  providedIn: 'root'
})
export class AutomaticosService {

  constructor( private _security:EncriptadoService) { }

  consulta_ruta(ruta): Promise<any> {
    return new Promise((resolve, reject) => {
      // const {ruta} = data
      const starCountRef = ref(db, `${ruta}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val())
        } else {
          resolve({});
        }
      }, {
        onlyOnce: true
      })
    });
  }
  // async vigila_hijo(arreglo:any[]){
      
  //   let nombre  = 'clientes'

  //   const commentsRef = ref(db, `${nombre}` );

  //   const variable_busqueda = await this.revisar_cache(`${nombre}`)      

  //   const variable_busqueda_arr = this.crearArreglo2(variable_busqueda)

  //   const nueva_data_clientes = JSON.parse(JSON.stringify(variable_busqueda));

  //   if (variable_busqueda) {
  //     onChildAdded(commentsRef, (data) => {
  //       // console.log('nuevos');
  //       const key = data.key
  //       const valor = data.val()

  //       if (!nueva_data_clientes[key]) {
  //           nueva_data_clientes[key] = valor
  //           this._security.guarda_informacion({nombre, data: nueva_data_clientes })
  //       }else{
  //         nueva_data_clientes[key] = valor
  //         this._security.guarda_informacion({nombre, data: nueva_data_clientes })
  //       }          
  //     });
  //   }
  //   variable_busqueda_arr.forEach(cliente=>{
  //     const {id:id_nombre} = cliente
  //     const commentsRef_childs = ref(db, `${nombre}/${id_nombre}` );
  //     onChildChanged(commentsRef_childs, (data) => {
  //       const key_child = data.key
  //       const valor = data.val()
  //       if (nueva_data_clientes[id_nombre]) {
  //         nueva_data_clientes[id_nombre][key_child] = valor
  //         // console.log(nueva_data_clientes[id_nombre]);
  //         this._security.guarda_informacion({nombre, data: nueva_data_clientes })
  //       }
  //     });
  //   })
  // }
  // crearArreglo2(arrayObj: Record<string, any> | null): any[] {
  //   if (!arrayObj) return []; 
  //   return Object.entries(arrayObj).map(([key, value]) => ({ ...value, id: key }));
  // }
  
}
