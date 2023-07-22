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
  lista_en_duro_sucursales = [
      {
        id: '-N2gkVg1RtSLxK3rTMYc',
        "correo": "polancocallenuevdar@gmail.com",
        "direccion": "Av. San Esteban No. 18 Col.Fraccionamiento el Parque C.P. 53390 Naucalpan Edo. de México.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
        "serie": "1TKDG789",
        "status": false,
        "sucursal": "Polanco",
        "telefono": "5524877791"
      },
      {
        id: '-N2gkzuYrS4XDFgYciId',
        "correo": "contacto@speed-service.com.mx",
        "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Ftoreo.jpg?alt=media&token=3598287f-7519-4837-9c79-e0ed1c44c2f0",
        "serie": "5AJJL544",
        "status": true,
        "sucursal": "Toreo",
        "telefono": "5570451111"
      },
      {
        id: '-N2glF34lV3Gj0bQyEWK',
        "correo": "ventas_culhuacan@speed-service.com.mx",
        "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Fculhuacan.jpg?alt=media&token=8dc4dd01-7144-4860-9d26-b66dc9f95976",
        "serie": "8PFRT119",
        "status": true,
        "sucursal": "Culhuacán",
        "telefono": "5556951051"
      },
      {
        id: '-N2glQ18dLQuzwOv3Qe3',
        "correo": "Circuito@speed-service.com.mx",
        "direccion": "Avenida Río Consulado #4102, Col. Nueva Tenochtitlan, CP: 07880, Del. Gustavo A. Madero.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Fmolina.jpg?alt=media&token=6e844e0a-8a59-4463-842c-f3eb5682d50d",
        "serie": "3HDSK564",
        "status": true,
        "sucursal": "Circuito",
        "telefono": "5587894618"
      },
      {
        id: '-N2glf8hot49dUJYj5WP',
        "correo": "coapa@speed-service.com.mx",
        "direccion": "Prol. División del Nte. 1815, San Lorenzo la Cebada, Xochimilco, 16035 Ciudad de México, CDMX",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Fcoapa.jpg?alt=media&token=7ef3f47a-120d-4455-83e3-8cdf12f91c5a",
        "serie": "6JKGH923",
        "status": true,
        "sucursal": "Coapa",
        "telefono": "5587894608"
      },
      {
        id: '-NN8uAwBU_9ZWQTP3FP_',
        "correo": "com.yo9999@gmail.com",
        "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
        "imagen": "./assets/img/default-image.jpg",
        "serie": "5AJJL54434",
        "status": true,
        "sucursal": "lomas",
        "telefono": "5570451111"
      }
    
  ]
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
