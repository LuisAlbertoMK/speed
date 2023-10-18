
import { Injectable } from '@angular/core';

import { getDatabase, onValue, ref} from "firebase/database"

const db = getDatabase();

@Injectable({
  providedIn: 'root'
})
export class AutomaticosService {

  constructor( ) { }

  consulta_ruta(ruta): Promise<any> {
    return new Promise((resolve, reject) => {
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
  
}
