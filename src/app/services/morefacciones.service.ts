import { Injectable } from '@angular/core';

import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
import { ServiciosPublicosService } from './servicios-publicos.service';
const db = getDatabase()
const dbRef = ref(getDatabase());


@Injectable({
  providedIn: 'root'
})
export class MorefaccionesService {

  constructor(
    private _publicos: ServiciosPublicosService
  ) { }
  
  
  contadormorefacciones(): Promise<any> {
      return new Promise((resolve, reject) => {
        // const {ruta} = data
        const starCountRef = ref(db, 'moRefacciones');
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            resolve(this._publicos.crearArreglo2(snapshot.val()).length + 1);
          } else {
            resolve(0);
          }
        });
      });
    }
  

}
