import { Component, OnInit } from '@angular/core';
import { child, get, getDatabase, onDisconnect, onValue, push, ref, set, update } from 'firebase/database';
import { AutomaticosService } from '../../services/automaticos.service';

import * as CryptoJS from 'crypto-js';  
import { EncriptadoService } from '../../services/encriptado.service';
import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';


import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";
import { SucursalesService } from 'src/app/services/sucursales.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs

const db = getDatabase()
const dbRef = ref(getDatabase());

@Component({
  selector: 'app-automaticos',
  templateUrl: './automaticos.component.html',
  styleUrls: ['./automaticos.component.css']
})
export class AutomaticosComponent implements OnInit {
  
  constructor(private _automaticos: AutomaticosService, private _encript: EncriptadoService, private _publicos: ServiciosPublicosService,
    private _security:EncriptadoService, public _router: Router, public _location: Location,private _pdfRecepcion: PdfRecepcionService,
    private _sucursales: SucursalesService, private _clientes: ClientesService, private _vehiculos: VehiculosService
    ) { }

  ngOnInit(): void {
    this.rol()
    // this.realizaOperacionesClientes()
  }
  rol(){
    
  }
  realizaOperacionesClientes(){
    const correoElimina = [
    'mkkaos28@gmail.com' ,
    'luis2016oro@gmail.com' ,
    'luis2020zoro@gmail.com' ,
    'luis2020oromk@gmail.com' ,
    'Luis2020oro@gmail.com' ,
    'polikaosmk28@gmail.com' ,
    'prueba@gmail.com' ,
    'polikaosmk3425@gmail.com' ,
    'mkoromini94@gmail.com'
  ]
    const sucursales = {
      "-N2gkVg1RtSLxK3rTMYc": {
        "correo": "polancocallenuevdar@gmail.com",
        "direccion": "Av. San Esteban No. 18 Col.Fraccionamiento el Parque C.P. 53390 Naucalpan Edo. de México.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
        "serie": "1TKDG789",
        "status": false,
        "sucursal": "Polanco",
        "telefono": "5524877791"
      },
      "-N2gkzuYrS4XDFgYciId": {
        "correo": "contacto@speed-service.com.mx",
        "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/sucursales%2FToreo?alt=media&token=e54e6967-db1c-4a77-922d-511dac317ded",
        "serie": "5AJJL544",
        "status": true,
        "sucursal": "Toreo",
        "telefono": "5570451111"
      },
      "-N2glF34lV3Gj0bQyEWK": {
        "correo": "ventas_culhuacan@speed-service.com.mx",
        "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
        "serie": "8PFRT119",
        "status": true,
        "sucursal": "Culhuacán",
        "telefono": "5556951051"
      },
      "-N2glQ18dLQuzwOv3Qe3": {
        "correo": "Circuito@speed-service.com.mx",
        "direccion": "Avenida Río Consulado #4102, Col. Nueva Tenochtitlan, CP: 07880, Del. Gustavo A. Madero.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
        "serie": "3HDSK564",
        "status": true,
        "sucursal": "Circuito",
        "telefono": "5587894618"
      },
      "-N2glf8hot49dUJYj5WP": {
        "correo": "coapa@speed-service.com.mx",
        "direccion": "Prol. División del Nte. 1815, San Lorenzo la Cebada, Xochimilco, 16035 Ciudad de México, CDMX",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
        "serie": "6JKGH923",
        "status": true,
        "sucursal": "Coapa",
        "telefono": "5587894608"
      },
      "-NN8uAwBU_9ZWQTP3FP_": {
        "correo": "com.yo9999@gmail.com",
        "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
        "imagen": "./assets/img/default-image.jpg",
        "serie": "5AJJL54434",
        "status": true,
        "sucursal": "lomas",
        "telefono": "5570451111"
      }
    }
    const  clientes = {}
    console.log(this._publicos.crearArreglo2(clientes).length);
    
    const claves = Object.keys(clientes)
    let nuevas =  {}

    //TODO aqui la lo que se realizara
    const ca = this._clientes.camposCliente
    const ca_v = this._vehiculos.camposVehiculosave
    claves.forEach(clav=>{
      
    })

    
    //TODO aqui la lo que se realizara

    console.log(nuevas);
    console.log(this._publicos.crearArreglo2(nuevas).length);
    
    
  }
}