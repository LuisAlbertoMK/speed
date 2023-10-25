import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';

const urlServer = environment.firebaseConfig.databaseURL

@Injectable({
  providedIn: 'root'
})
export class SucursalesService {

  constructor(private http: HttpClient) { }
  lista_en_duro_sucursales = [
      {
        "id": '-N2gkVg1RtSLxK3rTMYc',
        "correo": "polancocallenuevdar@gmail.com",
        "direccion": "Av. San Esteban No. 18 Col.Fraccionamiento el Parque C.P. 53390 Naucalpan Edo. de México.",
        // "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
        "serie": "1TKDG789",
        "imagen": "../assets/img_sucursales/Polanco.PNG",
        "status": false,
        "sucursal": "Polanco",
        "telefono": "5524877791"
      },
      {
        "id": '-N2gkzuYrS4XDFgYciId',
        "correo": "contacto@speed-service.com.mx",
        "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
        // "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/sucursales%2Ftoreo.jpg?alt=media&token=3598287f-7519-4837-9c79-e0ed1c44c2f0",
        "serie": "5AJJL544",
        "imagen":"../assets/img_sucursales/toreo.jpg",
        "status": true,
        "sucursal": "Toreo",
        "telefono": "5570451111"
      },
      {
        "id": '-N2glF34lV3Gj0bQyEWK',
        "correo": "ventas_culhuacan@speed-service.com.mx",
        "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
        "serie": "8PFRT119",
        "imagen":"../assets/img_sucursales/culhuacan.jpg",
        "status": true,
        "sucursal": "Culhuacán",
        "telefono": "5556951051"
      },
      {
        "id": '-N2glQ18dLQuzwOv3Qe3',
        "correo": "Circuito@speed-service.com.mx",
        "direccion": "Avenida Río Consulado #4102, Col. Nueva Tenochtitlan, CP: 07880, Del. Gustavo A. Madero.",
       "imagen": "../assets/img_sucursales/circuito.jpg",
        "serie": "3HDSK564",
        "status": true,
        "sucursal": "Circuito",
        "telefono": "5587894618"
      },
      {
        "id": '-N2glf8hot49dUJYj5WP',
        "correo": "coapa@speed-service.com.mx",
        "direccion": "Prol. División del Nte. 1815, San Lorenzo la Cebada, Xochimilco, 16035 Ciudad de México, CDMX",
        "imagen": "../assets/img_sucursales/coapa.jpg",
        "serie": "6JKGH923",
        "status": true,
        "sucursal": "Coapa",
        "telefono": "5587894608"
      },
      {
        "id": '-NN8uAwBU_9ZWQTP3FP_',
        "correo": "com.yo9999@gmail.com",
        "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
        "imagen": "./assets/img/default-image.jpg",
        "serie": "5AJJL54434",
        "status": true,
        "sucursal": "lomas",
        "telefono": "5570451111"
      }
    
  ]
  

  guardaSucursal(sucursal:any){
    const temp={
      ...sucursal
    }
    return this.http.post(`${urlServer}/sucursales.json`,temp)
  }
  
  getSucursal(id:string){
    return this.http.get(`${urlServer}/sucursales/${id}.json`)
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
  
}
