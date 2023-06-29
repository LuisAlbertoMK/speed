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
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-automaticos',
  templateUrl: './automaticos.component.html',
  styleUrls: ['./automaticos.component.css']
})
export class AutomaticosComponent implements OnInit {
  
  constructor(private _automaticos: AutomaticosService, private _encript: EncriptadoService, private _publicos: ServiciosPublicosService,
    private _security:EncriptadoService, public _router: Router, public _location: Location,private _pdfRecepcion: PdfRecepcionService,
    private _sucursales: SucursalesService, private _clientes: ClientesService, private _vehiculos: VehiculosService,
    ) {   }
    infoSelect = {value: 0, name:''}
   
    view: [number, number] = [700, 400];
    legend: boolean = true;
    animations: boolean = true;    
    legendPosition: string = 'below';
    legendTitle = 'GSF5675'
    single = [
      {
        "name": "mo",
        "value": 7920
      },
      {
        "name": "refacciones",
        "value": 1989.38
      },
      {
        "name": "sobrescrito",
        "value": 300
      },
      {
        "name": "iva",
        "value": 56
      },
    ]
    colorScheme:Color = {
      group: ScaleType.Ordinal, 
      selectable: true, 
      name: 'Customer Usage', 
      domain: ['#3574FA', '#FF8623', '#a8385d', '#5ca04a']
    };
  
  ngOnInit(): void {
    this.rol()
    // this.realizaOperacionesClientes()
  }
  rol(){
    const { rol, sucursal, usuario } = this._security.usuarioRol()
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
    // console.log(this._publicos.crearArreglo2(clientes).length);
    
    // const claves = Object.keys(marcas_autos)
    let nuevas =  {}

    //TODO aqui la lo que se realizara
    
    
    //TODO aqui la lo que se realizara

    // console.log(marcas_autos);
    
    
    
  }
  onSelect(event) {
    console.log(event);
  }
  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
    const {  value  } = JSON.parse(JSON.stringify(data))
    const {  value: nuevoValue, name  } = value
    this.infoSelect.name = name
    this.infoSelect.value = (  !nuevoValue  ) ? this.single.find(c=>c.name === name).value : nuevoValue
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  valueFormatting(value: number): string {
    if (!value || isNaN(value)) {
      return `$ 0.00`;
    }
    const isNegative = value < 0;
    const [integerPart, decimalPart = '00'] = Math.abs(value).toFixed(2).split('.');
    const formattedIntegerPart = integerPart
      .split('')
      .reverse()
      .reduce((result, digit, index) => {
        const isThousands = index % 3 === 0 && index !== 0;
        return `${digit}${isThousands ? ',' : ''}${result}`;
      }, '');
  
    const formattedValue = `$ ${isNegative ? '-' : ''} ${formattedIntegerPart}.${decimalPart}`;
    return formattedValue;
  }
}