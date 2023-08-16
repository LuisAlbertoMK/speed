import { Injectable } from '@angular/core';



import { child, get, getDatabase, onValue, ref, set, update,push } from "firebase/database"
const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({
  providedIn: 'root'
})
export class MetasSucursalService {

  constructor() { }

  consulta_registro_meta_mes(data): Promise<any> {
    return new Promise((resolve, reject) => {
      const {ruta} = data
      const starCountRef = ref(db, ruta);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          resolve({});
        }
      });
    });
  }
}
