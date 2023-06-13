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
    const recepciones = {
      "-NJLWImtmWlFAvUZDPof": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "3/4"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          }
        ],
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": true,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": true,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 147,
        "fechaPromesa": "23/12/2022",
        "fecha_entregado": "15/3/2023",
        "fecha_recibido": "16/1/2023",
        "formaPago": 1,
        "hora_entregado": "11:9:20",
        "hora_recibido": "17:16:53",
        "iva": false,
        "margen": 25,
        "no_os": "CU1222GE00001",
        "reporte": {
          "descuento": 0,
          "iva": 0,
          "meses": 0,
          "mo": 1440,
          "refacciones_a": 1950,
          "refacciones_v": 2437.5,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 4877.5,
          "total": 4877.5,
          "ub": 4.8692977960020505
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 1000,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobado": false,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "terminado": true,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 1000,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobado": false,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "terminado": true,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "entregado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "",
        "vehiculo": {
          "anio": "2015",
          "categoria": "Coupé lujo",
          "cilindros": "8",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Azul oscuro",
          "engomado": "amarillo",
          "id": "-NKKmjYiwZsLszCdAb3r",
          "marca": "BMW",
          "marcaMotor": "",
          "modelo": "Serie 2",
          "no_motor": "",
          "placas": "HTH6646",
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NJlmVtatollLU3RozCg": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "si"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          }
        ],
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 175,
        "fechaPromesa": "23/12/2022",
        "fecha_recibido": "20/12/2022",
        "formaPago": 1,
        "hora_entregado": "",
        "hora_recibido": "17:6:44",
        "iva": true,
        "margen": 25,
        "no_os": "CU1222GE00002",
        "reporte": {
          "descuento": 0,
          "iva": 750.8000000000001,
          "meses": 0,
          "mo": 1430,
          "refacciones_a": 1650,
          "refacciones_v": 2062.5,
          "sobrescrito": 1200,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 200,
          "sobrescrito_refaccion": 0,
          "subtotal": 4692.5,
          "total": 5443.299999999999,
          "ub": 13.905167820990943
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 200,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": "",
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 600,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "47.82",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 450,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 3,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": "",
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 4,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "",
            "status": true,
            "subtotal": "",
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 240,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "",
            "status": true,
            "subtotal": "",
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 400,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 6,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "paquete",
            "total": 1555
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "cilindros": "",
            "costo": 500,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 7,
            "marca": "",
            "modelo": "",
            "nombre": "600",
            "precio": 1000,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "MO",
            "total": 1000
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 8,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "modelo": "",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 9,
            "marca": "Aston Martín",
            "modelo": "",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 200,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": "",
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 600,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "47.82",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 450,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 3,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": "",
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 4,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "",
            "status": true,
            "subtotal": "",
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 240,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "",
            "status": true,
            "subtotal": "",
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 400,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 6,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "paquete",
            "total": 1555
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "cilindros": "",
            "costo": 500,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 7,
            "marca": "",
            "modelo": "",
            "nombre": "600",
            "precio": 1000,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "MO",
            "total": 1000
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 8,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "modelo": "",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": "",
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 9,
            "marca": "Aston Martín",
            "modelo": "",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "terminado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "-NL1hTSnVq0ImKF7kCT7",
        "vehiculo": {
          "anio": "2015",
          "categoria": "Coupé lujo",
          "cilindros": "8",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Azul oscuro",
          "engomado": "amarillo",
          "id": "-NKKmjYiwZsLszCdAb3r",
          "marca": "BMW",
          "marcaMotor": "",
          "modelo": "Serie 2",
          "no_motor": "",
          "placas": "HTH6646",
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NJpDv7tWj61W37YqoMZ": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "si"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          }
        ],
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 174,
        "fechaPromesa": "23/12/2022",
        "fecha_entregado": "5/1/2023",
        "fecha_recibido": "21/12/2022",
        "formaPago": 1,
        "hora_entregado": "13:45:12",
        "hora_recibido": "9:9:43",
        "iva": true,
        "margen": 25,
        "no_os": "CU1222GE00003",
        "reporte": {
          "descuento": 0,
          "iva": 916.4,
          "meses": 0,
          "mo": 2240,
          "refacciones_a": 1990,
          "refacciones_v": 2487.5,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 5727.5,
          "total": 6643.9,
          "ub": 18.9873417721519
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "terminado": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "terminado": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "terminado": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "terminado": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "entregado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "-NL1hTSnVq0ImKF7kCT7",
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NJpIwkl335FM0XEDGjW": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "si"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          }
        ],
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 174,
        "fechaPromesa": "23/12/2022",
        "fecha_recibido": "21/12/2022",
        "formaPago": 1,
        "hora_recibido": "9:31:41",
        "iva": true,
        "margen": 25,
        "no_os": "CU1222GE00004",
        "reporte": {
          "descuento": 0,
          "iva": 1068.4,
          "meses": 0,
          "mo": 2440,
          "refacciones_a": 2590,
          "refacciones_v": 3237.5,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 6677.5,
          "total": 7745.9,
          "ub": 30.512916510670163
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "terminado": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "terminado": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NKJpLLqJ5UBQYXI_svH": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "1/2"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          }
        ],
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 168,
        "fechaPromesa": "30/12/2022",
        "fecha_recibido": "27/12/2022",
        "formaPago": 1,
        "hora_recibido": "12:25:50",
        "iva": true,
        "margen": 25,
        "no_os": "CU1222GE00005",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "-NL1hTSnVq0ImKF7kCT7",
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NLRjhBpGQ8M3tJTpA4I": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "3/4"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          }
        ],
        "cliente": {
          "apellidos": "salvador",
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "correo_sec": "",
          "id": "-NLRhhoHEmZzs36LQyO-",
          "no_cliente": "lusaCu10230036",
          "nombre": "lupistrupis",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "5522859478",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 153,
        "fechaPromesa": "12/1/2023",
        "fecha_recibido": "10/1/2023",
        "formaPago": 1,
        "hora_recibido": "11:33:48",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE00007",
        "reporte": {
          "descuento": 0,
          "iva": 19.2,
          "meses": 0,
          "mo": 120,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 120,
          "total": 139.2,
          "ub": 100
        },
        "servicio": 1,
        "servicios": [
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NE2JJZu_LtUYJXSBola",
            "index": 0,
            "nombre": "CAMBIO DE ACEITE Y FILTRO",
            "precio": 120,
            "status": true,
            "tipo": "MO",
            "total": 120
          }
        ],
        "servicios_original": [
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NE2JJZu_LtUYJXSBola",
            "index": 0,
            "nombre": "CAMBIO DE ACEITE Y FILTRO",
            "precio": 120,
            "status": true,
            "tipo": "MO",
            "total": 120
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2017",
          "categoria": "SUV lujo",
          "cilindros": "6",
          "cliente": "-NLRhhoHEmZzs36LQyO-",
          "color": "Negro",
          "engomado": "rojo",
          "id": "-NLRhx7nvvrQjTtMDudv",
          "marca": "Infiniti",
          "marcaMotor": "",
          "modelo": "QX30",
          "no_motor": "",
          "placas": "abc123",
          "transmision": "Automatica",
          "vinChasis": ""
        }
      },
      "-NLS7TphRB86LSfRilno": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "1/4"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          }
        ],
        "cliente": {
          "apellidos": "López Perez",
          "correo": "abcde@gmail.com",
          "correo_sec": "",
          "id": "-NLS512d_ACSLeFE5r02",
          "no_cliente": "PeLóCu10230037",
          "nombre": "Pedro Pablo",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "5512345678",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 153,
        "fechaPromesa": "12/1/2023",
        "fecha_entregado": "",
        "fecha_recibido": "10/1/2023",
        "formaPago": 1,
        "hora_entregado": "",
        "hora_recibido": "13:33:2",
        "iva": false,
        "margen": 25,
        "no_os": "CU0123GE00008",
        "reporte": {
          "descuento": 0,
          "iva": 0,
          "meses": 0,
          "mo": 0,
          "refacciones_a": 450,
          "refacciones_v": 562.5,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 562.5,
          "total": 562.5,
          "ub": 20
        },
        "servicio": 1,
        "servicios": [
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "",
            "enCatalogo": true,
            "id": "-NIXsW7Y5RzRrbI_F9dB",
            "index": 0,
            "marca": "Ford",
            "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
            "precio": 450,
            "status": true,
            "tipo": "refaccion",
            "total": 562.5
          }
        ],
        "servicios_original": [
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "",
            "enCatalogo": true,
            "id": "-NIXsW7Y5RzRrbI_F9dB",
            "index": 0,
            "marca": "Ford",
            "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
            "precio": 450,
            "status": true,
            "tipo": "refaccion",
            "total": 562.5
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2021",
          "categoria": "Sedán lujo",
          "cilindros": "6",
          "cliente": "-NLS512d_ACSLeFE5r02",
          "color": "Azul claro",
          "engomado": "azul",
          "id": "-NLS5GEDMnA0gVmS8iob",
          "marca": "Alfa Romeo",
          "marcaMotor": "",
          "modelo": "Giulia",
          "no_motor": "",
          "placas": "1540wc",
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NLSLVcG9jyrF_8ZtnYt": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "1/2"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          }
        ],
        "cliente": {
          "apellidos": "Cacomixtle",
          "correo": "fabianzku@outlook.com",
          "correo_sec": "",
          "id": "-NLSJqiLdov_8LgUbzmJ",
          "no_cliente": "FaCaCu10230039",
          "nombre": "Fabian",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "5548795600",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 153,
        "fechaPromesa": "11/1/2023",
        "fecha_entregado": "",
        "fecha_recibido": "10/1/2023",
        "formaPago": 1,
        "hora_entregado": "",
        "hora_recibido": "14:23:23",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE00009",
        "reporte": {
          "descuento": 0,
          "iva": 504,
          "meses": 0,
          "mo": 3150,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 3150,
          "total": 3653.9999999999995,
          "ub": 100
        },
        "servicio": 1,
        "servicios": [
          {
            "aprobado": true,
            "cantidad": 3,
            "costo": 0,
            "descripcion": "CAMBIO DE ACEITE\nCAMBIO DE FILTRO",
            "enCatalogo": true,
            "id": "-NE2JJZu_LtUYJXSBola",
            "index": 0,
            "nombre": "CAMBIO DE ACEITE Y FILTRO",
            "precio": 1050,
            "status": true,
            "tipo": "MO",
            "total": 3150
          }
        ],
        "servicios_original": [
          {
            "aprobado": true,
            "cantidad": 3,
            "costo": 0,
            "descripcion": "CAMBIO DE ACEITE\nCAMBIO DE FILTRO",
            "enCatalogo": true,
            "id": "-NE2JJZu_LtUYJXSBola",
            "index": 0,
            "nombre": "CAMBIO DE ACEITE Y FILTRO",
            "precio": 1050,
            "status": true,
            "tipo": "MO",
            "total": 3150
          }
        ],
        "status": "terminado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "-NL1hTSnVq0ImKF7kCT7",
        "vehiculo": {
          "anio": "2020",
          "categoria": "Sedán",
          "cilindros": "4",
          "cliente": "-NLSJqiLdov_8LgUbzmJ",
          "color": "Blanco",
          "engomado": "amarillo",
          "id": "-NLSJwWeFEuZSI9jaHnB",
          "marca": "Chevrolet",
          "marcaMotor": "",
          "modelo": "Beat",
          "no_motor": "",
          "placas": "1245pol",
          "transmision": "Automatica",
          "vinChasis": ""
        }
      },
      "-NLXvtAAE3nsUyV83H3N": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "1/2"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          }
        ],
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 152,
        "fechaPromesa": "28/1/2023",
        "fecha_entregado": "",
        "fecha_recibido": "11/1/2023",
        "formaPago": 1,
        "hora_entregado": "",
        "hora_recibido": "16:24:47",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE000011",
        "reporte": {
          "descuento": 0,
          "iva": 168,
          "meses": 0,
          "mo": 1050,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 1050,
          "total": 1218,
          "ub": 100
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": false,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": "1",
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              }
            ],
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NIrjPCMIRGHbzy5cbJ_",
            "index": 0,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuwvo",
            "precio": 300,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 300,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 300,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 300,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
            "total": 300,
            "totalMO": 300
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsK5qJwfzE7e3Qn582",
            "index": 1,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuevo paquete prueba",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsKs8_cS4oCunA4-KN",
            "index": 2,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "fghfgh",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsRgZ4mMSMpLFyD8V4",
            "index": 3,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "juanMT",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": false,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": "1",
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              }
            ],
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NIrjPCMIRGHbzy5cbJ_",
            "index": 0,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuwvo",
            "precio": 300,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 300,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 300,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 300,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
            "total": 300,
            "totalMO": 300
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsK5qJwfzE7e3Qn582",
            "index": 1,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuevo paquete prueba",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsKs8_cS4oCunA4-KN",
            "index": 2,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "fghfgh",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsRgZ4mMSMpLFyD8V4",
            "index": 3,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "juanMT",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          }
        ],
        "status": "espera",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2015",
          "categoria": "Camioneta de lujo",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Marrón profundo",
          "engomado": "Rosa",
          "id": "-NG3sHVtOK8ofWWIt_eM",
          "marca": "Chevrolet",
          "marcaMotor": "",
          "modelo": "Equinox",
          "no_motor": "",
          "placas": "dfj7657",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NLcHvqQSAXltoOQvN4O": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "1/2"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          }
        ],
        "cliente": {
          "apellidos": "Ramirez Ramirez ",
          "correo": "Ramirez@gmail.com",
          "correo_sec": "",
          "id": "-NLcE0c8GTpe9BHqzCl9",
          "no_cliente": "JuRaCu12230041",
          "nombre": "Juan",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "7737272828",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 151,
        "fechaPromesa": "13/1/2023",
        "fecha_recibido": "12/1/2023",
        "formaPago": 1,
        "hora_recibido": "17:23:34",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE000010",
        "reporte": {
          "descuento": 0,
          "iva": 24,
          "meses": 0,
          "mo": 150,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 150,
          "total": 174,
          "ub": 100
        },
        "servicio": 1,
        "servicios": [
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "N",
            "enCatalogo": true,
            "id": "-NIXsiafAdRrmZsuD-fs",
            "index": 0,
            "nombre": "LAVAR CARROCERIA",
            "precio": 150,
            "status": true,
            "terminado": false,
            "tipo": "MO",
            "total": 150
          }
        ],
        "servicios_original": [
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "N",
            "enCatalogo": true,
            "id": "-NIXsiafAdRrmZsuD-fs",
            "index": 0,
            "nombre": "LAVAR CARROCERIA",
            "precio": 150,
            "status": true,
            "terminado": false,
            "tipo": "MO",
            "total": 150
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2004",
          "categoria": "Sedán lujo",
          "cilindros": "6",
          "cliente": "-NLcE0c8GTpe9BHqzCl9",
          "color": "Azul oscuro",
          "engomado": "rojo",
          "id": "-NLcHUz59SzQ6-NZhs0f",
          "marca": "BMW",
          "marcaMotor": "",
          "modelo": "Serie 5",
          "no_motor": "",
          "placas": "Jfj7753",
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NLv9DFmLYfPvdFBbyx4": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "1/4"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "si"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          }
        ],
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 147,
        "fechaPromesa": "26/1/2023",
        "fecha_recibido": "16/1/2023",
        "formaPago": 1,
        "hora_recibido": "9:18:17",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE00012",
        "reporte": {
          "descuento": 0,
          "iva": 555.2,
          "meses": 0,
          "mo": 3470,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 3470,
          "total": 4025.2,
          "ub": 100
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 120,
                "index": 0,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "normal": 156,
                "precio": 120,
                "precioOriginal": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 1,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REV. Y CORREGIR NIVELES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 3,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR INYECTORES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "C",
                "flotilla": 300,
                "index": 4,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR CPO DE ACELERACION",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 5,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "SCANEO POR COMPUTADORA",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 6,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 7,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 8,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "ROTACION DE LLANTAS",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 9,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 10,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR MOTOR",
                "normal": 390,
                "precio": 150,
                "precioOriginal": 300,
                "subtotal": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 11,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR CARROCERIA",
                "normal": 390,
                "precio": 150,
                "precioOriginal": 300,
                "subtotal": 150,
                "tipo": "MO",
                "total": 150
              }
            ],
            "enCatalogo": true,
            "flotilla": 3120,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "Fiesta",
            "nombre": "SERVICIO MAYOR",
            "precio": 3120,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 3120,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 3120,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 3120,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 3120,
            "totalMO": 3120
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 1,
            "nombre": "600",
            "precio": 350,
            "status": true,
            "tipo": "MO",
            "total": 350
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 120,
                "index": 0,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "normal": 156,
                "precio": 120,
                "precioOriginal": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 1,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REV. Y CORREGIR NIVELES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 3,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR INYECTORES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "C",
                "flotilla": 300,
                "index": 4,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR CPO DE ACELERACION",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 5,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "SCANEO POR COMPUTADORA",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 6,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 7,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 8,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "ROTACION DE LLANTAS",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 9,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 10,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR MOTOR",
                "normal": 390,
                "precio": 150,
                "precioOriginal": 300,
                "subtotal": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "flotilla": 300,
                "index": 11,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR CARROCERIA",
                "normal": 390,
                "precio": 150,
                "precioOriginal": 300,
                "subtotal": 150,
                "tipo": "MO",
                "total": 150
              }
            ],
            "enCatalogo": true,
            "flotilla": 3120,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "Fiesta",
            "nombre": "SERVICIO MAYOR",
            "precio": 3120,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 3120,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 3120,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 3120,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 3120,
            "totalMO": 3120
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 1,
            "nombre": "600",
            "precio": 350,
            "status": true,
            "tipo": "MO",
            "total": 350
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2015",
          "categoria": "Camioneta de lujo",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Marrón profundo",
          "engomado": "Rosa",
          "id": "-NG3sHVtOK8ofWWIt_eM",
          "marca": "Chevrolet",
          "marcaMotor": "",
          "modelo": "Equinox",
          "no_motor": "",
          "placas": "dfj7657",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NMVoXy552eDpoZLtLmf": {
        "ckeckList": [
          {
            "id": "antena",
            "mostrar": "antena",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "birlo_seguridad",
            "mostrar": "birlo seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "bocinas",
            "mostrar": "bocinas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "botones_interiores",
            "mostrar": "botones interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "boxina_claxon",
            "mostrar": "boxina claxon",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "calefaccion",
            "mostrar": "calefaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "cenicero",
            "mostrar": "cenicero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "cristales",
            "mostrar": "cristales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "encendedor",
            "mostrar": "encendedor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "espejo_retorvisor",
            "mostrar": "espejo retorvisor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "espejos_laterales",
            "mostrar": "espejos laterales",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "estuche_herramientas",
            "mostrar": "estuche herramientas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "extintor",
            "mostrar": "extintor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "gato",
            "mostrar": "gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "golpes_y_carroceria",
            "mostrar": "golpes y carroceria",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "instrumentos_tablero",
            "mostrar": "instrumentos tablero",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "interiores",
            "mostrar": "interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "limpiadores",
            "mostrar": "limpiadores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "llanta_refaccion",
            "mostrar": "llanta refaccion",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "llave_cruz",
            "mostrar": "llave cruz",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "llega_en_grua",
            "mostrar": "llega en grua",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "luces",
            "mostrar": "luces",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "maneral_gato",
            "mostrar": "maneral gato",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "manijas_interiores",
            "mostrar": "manijas interiores",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "molduras_completas",
            "mostrar": "molduras completas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "nivel_gasolina",
            "mostrar": "nivel gasolina",
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "status": "1/4"
          },
          {
            "id": "radio",
            "mostrar": "radio",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "si"
          },
          {
            "id": "tapetes",
            "mostrar": "tapetes",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          },
          {
            "id": "tapon_combustible",
            "mostrar": "tapon combustible",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapones_llantas",
            "mostrar": "tapones llantas",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tapones_motor",
            "mostrar": "tapones motor",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "no"
          },
          {
            "id": "tarjeta_de_circulacion",
            "mostrar": "tarjeta de circulacion",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "testigos_en_tablero",
            "mostrar": "testigos en tablero",
            "opciones": [
              "si",
              "no"
            ],
            "status": "no"
          },
          {
            "id": "triangulos_seguridad",
            "mostrar": "triangulos seguridad",
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "status": "dañado"
          }
        ],
        "cliente": {
          "apellidos": "Financiación",
          "correo": "genaro.guadarrama@speed-service.com.mx",
          "correo_sec": "",
          "id": "-NMVmWPPwsDkW64EvmLQ",
          "no_cliente": "FIFICU01230049",
          "nombre": "Finanzas",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "5512254265",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 132,
        "fechaPromesa": "26/1/2023",
        "fecha_entregado": "",
        "fecha_recibido": "31/1/2023",
        "formaPago": 1,
        "hora_entregado": "",
        "hora_recibido": "16:25:9",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE00013",
        "reporte": {
          "descuento": 0,
          "iva": 160,
          "meses": 0,
          "mo": 1000,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 1000,
          "total": 1160,
          "ub": 100
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsK5qJwfzE7e3Qn582",
            "index": 0,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuevo paquete prueba",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": "1",
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              }
            ],
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NIrjPCMIRGHbzy5cbJ_",
            "index": 1,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuwvo",
            "precio": 300,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 300,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 300,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 300,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
            "total": 300,
            "totalMO": 300
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsRgZ4mMSMpLFyD8V4",
            "index": 2,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "juanMT",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsK5qJwfzE7e3Qn582",
            "index": 0,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuevo paquete prueba",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": "1",
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              }
            ],
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NIrjPCMIRGHbzy5cbJ_",
            "index": 1,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuwvo",
            "precio": 300,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 300,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 300,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 300,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
            "total": 300,
            "totalMO": 300
          },
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "elementos": [
              {
                "cantidad": 1,
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "index": 0,
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsRgZ4mMSMpLFyD8V4",
            "index": 2,
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "juanMT",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte": {
              "mo": 350,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 350,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
            "total": 350,
            "totalMO": 350
          }
        ],
        "status": "terminado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "-NL1hTSnVq0ImKF7kCT7",
        "vehiculo": {
          "anio": "2022",
          "categoria": "Sedán lujo",
          "cilindros": "10",
          "cliente": "-NMVmWPPwsDkW64EvmLQ",
          "color": "Azul medio y rojo cenizo",
          "engomado": "rosa",
          "id": "-NMVmoTpk_8R3NpybQlB",
          "marca": "Alfa Romeo",
          "marcaMotor": "",
          "modelo": "Giulia",
          "no_motor": "",
          "placas": "920RDC8",
          "transmision": "Automatica",
          "vinChasis": ""
        }
      },
      "-NMioOmlm-7dX6y1aI9J": {
        "cliente": {
          "apellidos": "CALZADILLA",
          "correo": "ricardo.calzadilla@gmintegraciones.com",
          "correo_sec": "",
          "id": "-NMidpyPu8Cb9fVvE9GM",
          "no_cliente": "RICAToNaNaN0058",
          "nombre": "RICARDO ",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_fijo": "",
          "telefono_movil": "5570461728",
          "tipo": "flotilla"
        },
        "diasSucursal": 137,
        "fechaPromesa": "31/1/2023",
        "fecha_recibido": "26/1/2023",
        "formaPago": 1,
        "hora_recibido": "10:3:12",
        "iva": true,
        "margen": 25,
        "no_os": "TO0123GE00014",
        "reporte": {
          "descuento": 0,
          "iva": 64,
          "meses": 0,
          "mo": 0,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 400,
          "sobrescrito_mo": 400,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 400,
          "total": 463.99999999999994,
          "ub": 100
        },
        "servicio": 1,
        "servicios": [
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 400,
            "descripcion": "",
            "enCatalogo": true,
            "id": "-NMieQvFUYXlpFFIYC_n",
            "index": 0,
            "marca": "",
            "nombre": "REV. RUIDO EN SUSPENSION DELANTERA",
            "precio": 400,
            "status": true,
            "tipo": "MO",
            "total": 400
          }
        ],
        "servicios_original": [
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 400,
            "descripcion": "",
            "enCatalogo": true,
            "id": "-NMieQvFUYXlpFFIYC_n",
            "index": 0,
            "marca": "",
            "nombre": "REV. RUIDO EN SUSPENSION DELANTERA",
            "precio": 400,
            "status": true,
            "tipo": "MO",
            "total": 400
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "contacto@speed-service.com.mx",
          "direccion": " Calz. San Esteban 36, San Esteban, C.P. 53768 Naucalpan de Juárez.",
          "id": "-N2gkzuYrS4XDFgYciId",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/sucursales%2FToreo?alt=media&token=e54e6967-db1c-4a77-922d-511dac317ded",
          "serie": "5AJJL544",
          "status": true,
          "sucursal": "Toreo",
          "telefono": "5570451111"
        },
        "vehiculo": {
          "anio": "2015",
          "categoria": "Sedán",
          "cilindros": "4",
          "cliente": "-NMidpyPu8Cb9fVvE9GM",
          "color": "Blanco",
          "engomado": "rosa",
          "id": "-NMie2O5PRwxM35NK4Y6",
          "marca": "Chevrolet",
          "marcaMotor": "",
          "modelo": "Aveo",
          "no_motor": "1.6L",
          "placas": "a3027b",
          "transmision": "Estandar",
          "vinChasis": "fl217337"
        }
      },
      "-NMorQj1mrbWcdT3ZCgg": {
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "diasSucursal": 136,
        "fechaPromesa": "27/1/2023",
        "fecha_recibido": "27/1/2023",
        "formaPago": 1,
        "hora_recibido": "14:14:10",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE00015",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": "1",
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 875,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NN90yY-R5V5T-2N6SDN": {
        "cliente": {
          "apellidos": "montez lara",
          "correo": "daniellaraz@gmail.com",
          "correo_sec": "",
          "id": "-NN8zq1K2QnBp7RIwtq2",
          "no_cliente": "DAMOCO01230005",
          "nombre": "daniel",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "telefono_fijo": "",
          "telefono_movil": "5569658965",
          "tipo": "particular"
        },
        "diasSucursal": 132,
        "fechaPromesa": "18/2/2023",
        "fecha_entregado": "",
        "fecha_recibido": "31/1/2023",
        "formaPago": 1,
        "hora_entregado": "",
        "hora_recibido": "17:8:42",
        "iva": true,
        "margen": 25,
        "no_os": "CO0123GE00016",
        "reporte": {
          "descuento": 0,
          "iva": 372.96,
          "meses": 0,
          "mo": 1206,
          "refacciones_a": 900,
          "refacciones_v": 1125,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 2331,
          "total": 2703.96,
          "ub": 61.38996138996139
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "86.20",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 1,
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NGbPadXFum0ZEpqn70p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "multigrado",
                "index": 2,
                "nombre": "aceite de motor",
                "precio": 100,
                "subtotal": 125,
                "tipo": "refaccion",
                "total": 125
              }
            ],
            "enCatalogo": true,
            "flotilla": 725,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 0,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 725,
            "refacciones1": 100,
            "refacciones2": 125,
            "reporte": {
              "mo": 600,
              "refacciones": 100,
              "refacciones_v": 125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 725,
              "ub": 82.75862068965517
            },
            "reporte_interno": {
              "mo": 600,
              "refacciones": 100,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 725,
            "tipo": "paquete",
            "total": 725,
            "totalMO": 600
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": false,
                "costo": 0,
                "index": 0,
                "nombre": "refaccion1",
                "precio": 350,
                "subtotal": 437.5,
                "tipo": "refaccion",
                "total": 437.5
              }
            ],
            "enCatalogo": true,
            "factibilidad": 0,
            "flotilla": 437.5,
            "id": "-NIEsB5V5ql3rxg_xyoV",
            "index": 1,
            "marca": "Volkswagen",
            "modelo": "Vento",
            "nombre": "SERVICIO MAYOR",
            "precio": 437.5,
            "refacciones1": 350,
            "refacciones2": 437.5,
            "reporte": {
              "mo": 0,
              "refacciones": 350,
              "refacciones_v": 437.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 437.5,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 350,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 437.5,
            "tipo": "paquete",
            "total": 437.5,
            "totalMO": 0
          },
          {
            "UB": "61.48",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NIJ4g98MXI7Zs3d3xe6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna descripc",
                "index": 0,
                "nombre": "mano jose luis",
                "precio": 600,
                "subtotal": 600,
                "tipo": "MO",
                "total": 600
              },
              {
                "IDreferencia": "-NGbPl434B_Pzb_G6vGp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "prueba",
                "index": 1,
                "nombre": "filtro de aceite",
                "precio": 150,
                "subtotal": 187.5,
                "tipo": "refaccion",
                "total": 187.5
              },
              {
                "IDreferencia": "-NIJ5Gl1R47GQ6g5h6nJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna descr",
                "index": 2,
                "nombre": "materiales diversos",
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NIJ59oXarA3-kLIDfEp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "prueba 2",
                "index": 3,
                "nombre": "mano jose luis 1",
                "precio": 6,
                "subtotal": 6,
                "tipo": "MO",
                "total": 6
              }
            ],
            "enCatalogo": true,
            "flotilla": 1168.5,
            "id": "-NIJ4C_eDdJgnc-hAlTX",
            "index": 2,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "paquete jose luis",
            "precio": 1168.5,
            "refacciones1": 450,
            "refacciones2": 562.5,
            "reporte": {
              "mo": 606,
              "refacciones": 450,
              "refacciones_v": 562.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1168.5,
              "ub": 51.861360718870344
            },
            "reporte_interno": {
              "mo": 606,
              "refacciones": 450,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1168.5,
            "tipo": "paquete",
            "total": 1168.5,
            "totalMO": 606
          }
        ],
        "servicios_original": [
          {
            "UB": "86.20",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 1,
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NGbPadXFum0ZEpqn70p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "multigrado",
                "index": 2,
                "nombre": "aceite de motor",
                "precio": 100,
                "subtotal": 125,
                "tipo": "refaccion",
                "total": 125
              }
            ],
            "enCatalogo": true,
            "flotilla": 725,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 0,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 725,
            "refacciones1": 100,
            "refacciones2": 125,
            "reporte": {
              "mo": 600,
              "refacciones": 100,
              "refacciones_v": 125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 725,
              "ub": 82.75862068965517
            },
            "reporte_interno": {
              "mo": 600,
              "refacciones": 100,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 725,
            "tipo": "paquete",
            "total": 725,
            "totalMO": 600
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": false,
                "costo": 0,
                "index": 0,
                "nombre": "refaccion1",
                "precio": 350,
                "subtotal": 437.5,
                "tipo": "refaccion",
                "total": 437.5
              }
            ],
            "enCatalogo": true,
            "factibilidad": 0,
            "flotilla": 437.5,
            "id": "-NIEsB5V5ql3rxg_xyoV",
            "index": 1,
            "marca": "Volkswagen",
            "modelo": "Vento",
            "nombre": "SERVICIO MAYOR",
            "precio": 437.5,
            "refacciones1": 350,
            "refacciones2": 437.5,
            "reporte": {
              "mo": 0,
              "refacciones": 350,
              "refacciones_v": 437.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 437.5,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 350,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 437.5,
            "tipo": "paquete",
            "total": 437.5,
            "totalMO": 0
          },
          {
            "UB": "61.48",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NIJ4g98MXI7Zs3d3xe6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna descripc",
                "index": 0,
                "nombre": "mano jose luis",
                "precio": 600,
                "subtotal": 600,
                "tipo": "MO",
                "total": 600
              },
              {
                "IDreferencia": "-NGbPl434B_Pzb_G6vGp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "prueba",
                "index": 1,
                "nombre": "filtro de aceite",
                "precio": 150,
                "subtotal": 187.5,
                "tipo": "refaccion",
                "total": 187.5
              },
              {
                "IDreferencia": "-NIJ5Gl1R47GQ6g5h6nJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna descr",
                "index": 2,
                "nombre": "materiales diversos",
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NIJ59oXarA3-kLIDfEp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "prueba 2",
                "index": 3,
                "nombre": "mano jose luis 1",
                "precio": 6,
                "subtotal": 6,
                "tipo": "MO",
                "total": 6
              }
            ],
            "enCatalogo": true,
            "flotilla": 1168.5,
            "id": "-NIJ4C_eDdJgnc-hAlTX",
            "index": 2,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "paquete jose luis",
            "precio": 1168.5,
            "refacciones1": 450,
            "refacciones2": 562.5,
            "reporte": {
              "mo": 606,
              "refacciones": 450,
              "refacciones_v": 562.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1168.5,
              "ub": 51.861360718870344
            },
            "reporte_interno": {
              "mo": 606,
              "refacciones": 450,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1168.5,
            "tipo": "paquete",
            "total": 1168.5,
            "totalMO": 606
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "coapa@speed-service.com.mx",
          "direccion": "Prol. División del Nte. 1815, San Lorenzo la Cebada, Xochimilco, 16035 Ciudad de México, CDMX",
          "id": "-N2glf8hot49dUJYj5WP",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "6JKGH923",
          "status": true,
          "sucursal": "Coapa",
          "telefono": "5587894608"
        },
        "vehiculo": {
          "anio": "2022",
          "categoria": "SUV lujo",
          "cilindros": "8",
          "cliente": "-NN8zq1K2QnBp7RIwtq2",
          "color": "Negro",
          "engomado": "Rojo",
          "id": "-NN9-8J4Jlhwv-uAd9WR",
          "marca": "Cadillac",
          "marcaMotor": "hemi ",
          "modelo": "Escalade",
          "no_motor": "fhkjw26566",
          "placas": "PAH2144",
          "status": true,
          "transmision": "Automatica",
          "vinChasis": "rfer"
        }
      },
      "-NQCaVHfUPUtvbmH9lbZ": {
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "diasSucursal": 94,
        "fechaPromesa": "17/3/2023",
        "fecha_entregado": "",
        "fecha_recibido": "10/3/2023",
        "formaPago": 1,
        "hora_entregado": "",
        "hora_recibido": "16:17:49",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00016",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  100.00",
              "flotilla": 0,
              "mo": 200,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0,
              "totalPaquete": 200
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  73.02",
              "flotilla": 0,
              "mo": 1720,
              "precio": 700,
              "refacciones1": 700,
              "refacciones2": 875,
              "totalPaquete": 2595
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  58.62",
              "flotilla": 0,
              "mo": 700,
              "precio": 600,
              "refacciones1": 600,
              "refacciones2": 750,
              "totalPaquete": 1450
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": "$  20.00",
              "flotilla": 0,
              "mo": 0,
              "precio": 300,
              "refacciones1": 300,
              "refacciones2": 375,
              "totalPaquete": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  20.00",
              "flotilla": 0,
              "mo": 0,
              "precio": 300,
              "refacciones1": 300,
              "refacciones2": 375,
              "totalPaquete": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  47.82",
              "flotilla": 0,
              "mo": 500,
              "precio": 750,
              "refacciones1": 750,
              "refacciones2": 937.5,
              "totalPaquete": 1437.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  74.68",
              "flotilla": 0,
              "mo": 810,
              "precio": 300,
              "refacciones1": 300,
              "refacciones2": 375,
              "totalPaquete": 1185
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  57.33",
              "flotilla": 0,
              "mo": 700,
              "precio": 640,
              "refacciones1": 640,
              "refacciones2": 800,
              "totalPaquete": 1500
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": "$  42.12",
              "flotilla": 0,
              "mo": 430,
              "precio": 900,
              "refacciones1": 900,
              "refacciones2": 1125,
              "totalPaquete": 1555
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "terminado": true,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "terminado": true,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "terminado": true,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  100.00",
              "flotilla": 0,
              "mo": 200,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0,
              "totalPaquete": 200
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  73.02",
              "flotilla": 0,
              "mo": 1720,
              "precio": 700,
              "refacciones1": 700,
              "refacciones2": 875,
              "totalPaquete": 2595
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  58.62",
              "flotilla": 0,
              "mo": 700,
              "precio": 600,
              "refacciones1": 600,
              "refacciones2": 750,
              "totalPaquete": 1450
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": "$  20.00",
              "flotilla": 0,
              "mo": 0,
              "precio": 300,
              "refacciones1": 300,
              "refacciones2": 375,
              "totalPaquete": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  20.00",
              "flotilla": 0,
              "mo": 0,
              "precio": 300,
              "refacciones1": 300,
              "refacciones2": 375,
              "totalPaquete": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  47.82",
              "flotilla": 0,
              "mo": 500,
              "precio": 750,
              "refacciones1": 750,
              "refacciones2": 937.5,
              "totalPaquete": 1437.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  74.68",
              "flotilla": 0,
              "mo": 810,
              "precio": 300,
              "refacciones1": 300,
              "refacciones2": 375,
              "totalPaquete": 1185
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": "$  57.33",
              "flotilla": 0,
              "mo": 700,
              "precio": 640,
              "refacciones1": 640,
              "refacciones2": 800,
              "totalPaquete": 1500
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": "$  42.12",
              "flotilla": 0,
              "mo": 430,
              "precio": 900,
              "refacciones1": 900,
              "refacciones2": 1125,
              "totalPaquete": 1555
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "terminado": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "terminado": true,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "terminado": true,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "terminado": true,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "terminado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "-NL1hTSnVq0ImKF7kCT7",
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NQgGARQXmplGMfE9hXV": {
        "cliente": {
          "apellidos": "VARGAS",
          "correo": "isa_vargas05@hotmail.com",
          "id": "-NQgAgmAXe7P7GVPeHtw",
          "no_cliente": "ISVACU03230144",
          "nombre": "ISABEL",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5570467464",
          "tipo": "particular"
        },
        "diasSucursal": 88,
        "fechaPromesa": "17/3/2023",
        "fecha_recibido": "16/3/2023",
        "formaPago": 1,
        "hora_recibido": "15:12:52",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00017",
        "reporte": {
          "descuento": 0,
          "iva": 512,
          "meses": 0,
          "mo": 0,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 3200,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 3200,
          "sobrescrito_refaccion": 0,
          "subtotal": 3200,
          "total": 3711.9999999999995,
          "ub": -45.3125
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 3200,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "REV. Y CORREGIR NIVELES",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "nombre": "LAVAR INYECTORES",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "C",
                "index": 4,
                "nombre": "LAVAR CPO DE ACELERACION",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 5,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 6,
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 7,
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 8,
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 9,
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 10,
                "nombre": "LAVAR MOTOR",
                "precio": 150,
                "subtotal": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 11,
                "nombre": "LAVAR CARROCERIA",
                "precio": 150,
                "subtotal": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 12,
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              }
            ],
            "enCatalogo": true,
            "flotilla": 3200,
            "flotilla2": "$  3,200.00",
            "id": "",
            "index": 0,
            "marca": "Ford",
            "modelo": "Fiesta",
            "nombre": "SERVICIO MAYOR",
            "normal": "$  4,160.00",
            "precio": 3420,
            "reporte": {
              "mo": 3420,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 3420,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 3420,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": "",
            "tipo": "paquete",
            "total": 3200
          },
          {
            "UB": "",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "",
            "costo": 7800,
            "desgloce": "",
            "enCatalogo": "",
            "flotilla": 7800,
            "flotilla2": "$  7,800.00",
            "id": "-NQgBXpNofrC9fYVkVly",
            "index": 1,
            "marca": "",
            "modelo": "",
            "nombre": "amortiguadores delanteros",
            "normal": "$  10,140.00",
            "precio": 0,
            "reporte": {
              "mo": 0,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": "",
            "tipo": "paquete",
            "total": 7800
          },
          {
            "aprobado": false,
            "cantidad": 1,
            "costo": 1850,
            "descripcion": "",
            "enCatalogo": true,
            "flotilla": 1850,
            "flotilla2": "$  1,850.00",
            "id": "-NQgBwClFOvNip529MeL",
            "index": 2,
            "marca": "",
            "nombre": "valvula iac",
            "normal": "$  2,405.00",
            "precio": 900,
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": 1850,
            "tipo": "refaccion",
            "total": 2312.5
          },
          {
            "aprobado": false,
            "cantidad": 1,
            "costo": 2800,
            "descripcion": "",
            "enCatalogo": true,
            "flotilla": 2800,
            "flotilla2": "$  2,800.00",
            "id": "-NQgCtXfrQ0HY4_WmA9E",
            "index": 3,
            "marca": "",
            "nombre": "reemplazar caliper",
            "normal": "$  3,640.00",
            "precio": 1300,
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": 2800,
            "tipo": "refaccion",
            "total": 3500
          }
        ],
        "servicios_original": [
          {
            "UB": "",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 3200,
            "desgloce": "",
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "REV. Y CORREGIR NIVELES",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "nombre": "LAVAR INYECTORES",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "C",
                "index": 4,
                "nombre": "LAVAR CPO DE ACELERACION",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 5,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 6,
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 7,
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 8,
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 9,
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 10,
                "nombre": "LAVAR MOTOR",
                "precio": 150,
                "subtotal": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 11,
                "nombre": "LAVAR CARROCERIA",
                "precio": 150,
                "subtotal": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 12,
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO",
                "total": 300
              }
            ],
            "enCatalogo": true,
            "flotilla": 3200,
            "flotilla2": "$  3,200.00",
            "id": "",
            "index": 0,
            "marca": "Ford",
            "modelo": "Fiesta",
            "nombre": "SERVICIO MAYOR",
            "normal": "$  4,160.00",
            "precio": 3420,
            "reporte": {
              "mo": 3420,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 3420,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 3420,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": "",
            "tipo": "paquete",
            "total": 3200
          },
          {
            "UB": "",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "",
            "costo": 7800,
            "desgloce": "",
            "enCatalogo": "",
            "flotilla": 7800,
            "flotilla2": "$  7,800.00",
            "id": "-NQgBXpNofrC9fYVkVly",
            "index": 1,
            "marca": "",
            "modelo": "",
            "nombre": "amortiguadores delanteros",
            "normal": "$  10,140.00",
            "precio": 0,
            "reporte": {
              "mo": 0,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": "",
            "tipo": "paquete",
            "total": 7800
          },
          {
            "aprobado": false,
            "cantidad": 1,
            "costo": 1850,
            "descripcion": "",
            "enCatalogo": true,
            "flotilla": 1850,
            "flotilla2": "$  1,850.00",
            "id": "-NQgBwClFOvNip529MeL",
            "index": 2,
            "marca": "",
            "nombre": "valvula iac",
            "normal": "$  2,405.00",
            "precio": 900,
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": 1850,
            "tipo": "refaccion",
            "total": 2312.5
          },
          {
            "aprobado": false,
            "cantidad": 1,
            "costo": 2800,
            "descripcion": "",
            "enCatalogo": true,
            "flotilla": 2800,
            "flotilla2": "$  2,800.00",
            "id": "-NQgCtXfrQ0HY4_WmA9E",
            "index": 3,
            "marca": "",
            "nombre": "reemplazar caliper",
            "normal": "$  3,640.00",
            "precio": 1300,
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": 2800,
            "tipo": "refaccion",
            "total": 3500
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2015",
          "categoria": "SUV lujo",
          "cilindros": "4",
          "cliente": "-NQgAgmAXe7P7GVPeHtw",
          "color": "Blanco",
          "engomado": "azul",
          "id": "-NQgB6OV3TgsdvV1NPNL",
          "marca": "Ford",
          "modelo": "Edge",
          "placas": "rh710b",
          "transmision": "Automatica"
        }
      },
      "-NQgHasoi4hOw2wdQ1eB": {
        "cliente": {
          "apellidos": "VARGAS",
          "correo": "isa_vargas05@hotmail.com",
          "id": "-NQgAgmAXe7P7GVPeHtw",
          "no_cliente": "ISVACU03230144",
          "nombre": "ISABEL",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5570467464",
          "tipo": "particular"
        },
        "diasSucursal": 88,
        "fechaPromesa": "16/3/2023",
        "fecha_recibido": "16/3/2023",
        "formaPago": 1,
        "hora_recibido": "15:19:6",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00018",
        "reporte": {
          "descuento": 0,
          "iva": 0,
          "meses": 0,
          "mo": 0,
          "refacciones_a": 0,
          "refacciones_v": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 0,
          "total": 0,
          "ub": 0
        },
        "servicio": 1,
        "servicios": [
          {
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 3200,
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "REV. Y CORREGIR NIVELES",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "nombre": "LAVAR INYECTORES",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "C",
                "index": 4,
                "nombre": "LAVAR CPO DE ACELERACION",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 5,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 6,
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 7,
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 8,
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 9,
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 10,
                "nombre": "LAVAR MOTOR",
                "precio": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 11,
                "nombre": "LAVAR CARROCERIA",
                "precio": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 12,
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              }
            ],
            "enCatalogo": true,
            "flotilla": 3200,
            "flotilla2": "$  3,200.00",
            "index": 0,
            "marca": "Ford",
            "modelo": "Fiesta",
            "nombre": "SERVICIO MAYOR",
            "normal": "$  4,160.00",
            "precio": 3420,
            "reporte": {
              "mo": 3420,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 3420,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 3420,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "tipo": "paquete",
            "total": 3200
          }
        ],
        "servicios_original": [
          {
            "aprobado": false,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 3200,
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "REV. Y CORREGIR NIVELES",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "nombre": "LAVAR INYECTORES",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "C",
                "index": 4,
                "nombre": "LAVAR CPO DE ACELERACION",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 5,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 6,
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 7,
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 8,
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 9,
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 10,
                "nombre": "LAVAR MOTOR",
                "precio": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "index": 11,
                "nombre": "LAVAR CARROCERIA",
                "precio": 150,
                "tipo": "MO",
                "total": 150
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 12,
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "tipo": "MO",
                "total": 300
              }
            ],
            "enCatalogo": true,
            "flotilla": 3200,
            "flotilla2": "$  3,200.00",
            "index": 0,
            "marca": "Ford",
            "modelo": "Fiesta",
            "nombre": "SERVICIO MAYOR",
            "normal": "$  4,160.00",
            "precio": 3420,
            "reporte": {
              "mo": 3420,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 3420,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 3420,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "tipo": "paquete",
            "total": 3200
          }
        ],
        "status": "terminado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2015",
          "categoria": "SUV lujo",
          "cilindros": "4",
          "cliente": "-NQgAgmAXe7P7GVPeHtw",
          "color": "Blanco",
          "engomado": "azul",
          "id": "-NQgB6OV3TgsdvV1NPNL",
          "marca": "Ford",
          "modelo": "Edge",
          "placas": "rh710b",
          "transmision": "Automatica"
        }
      },
      "-NR9ms9aRPltYUILjQHZ": {
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "diasSucursal": 82,
        "fechaPromesa": "22/3/2023",
        "fecha_entregado": "11/4/2023",
        "fecha_recibido": "22/3/2023",
        "formaPago": 1,
        "hora_entregado": "13:45:0",
        "hora_recibido": "13:28:42",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00019",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 600,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 450,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 240,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 400,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "cilindros": "",
            "costo": 500,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "marca": "",
            "modelo": "",
            "nombre": "600",
            "precio": 100,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "modelo": "",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "modelo": "",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 600,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 450,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 240,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 400,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "cilindros": "",
            "costo": 500,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "marca": "",
            "modelo": "",
            "nombre": "600",
            "precio": 100,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "modelo": "",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "modelo": "",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "entregado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "-NL1hTSnVq0ImKF7kCT7",
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NR9nBq8fX488PmOJhzT": {
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "diasSucursal": 82,
        "fechaPromesa": "22/3/2023",
        "fecha_recibido": "22/3/2023",
        "formaPago": 1,
        "hora_recibido": "13:30:7",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00020",
        "reporte": {
          "descuento": 0,
          "iva": 222,
          "meses": 0,
          "mo": 200,
          "refacciones_a": 150,
          "refacciones_v": 187.5,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 1387.5,
          "total": 1609.5,
          "ub": 89.1891891891892
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 1,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 2,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 1,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 2,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NRFjRowgFS_D7porrDF": {
        "cliente": {
          "apellidos": "GUADA",
          "correo": "genaro_guadarrama@outlook.com",
          "id": "-NG2LstV0NhaJkHH6ro-",
          "no_cliente": "GEGUCU11220013",
          "nombre": "GENARO GUADAAAAA",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "flotilla"
        },
        "diasSucursal": 81,
        "fechaPromesa": "24/3/2023",
        "fecha_recibido": "23/3/2023",
        "formaPago": 1,
        "hora_recibido": "17:11:27",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00021",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2021",
          "categoria": "Coupé de lujo",
          "cilindros": "6",
          "cliente": "-NG2LstV0NhaJkHH6ro-",
          "color": "Marrón claro",
          "engomado": "Rosa",
          "id": "-NG2MESh7vZpmKP_Rpso",
          "marca": "Jeep",
          "marcaMotor": "",
          "modelo": "Wrangler",
          "no_motor": "",
          "placas": "132zjb8",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NRKNPBws_HeXwyQfzyI": {
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "diasSucursal": 80,
        "fechaPromesa": "24/3/2023",
        "fecha_recibido": "24/3/2023",
        "formaPago": 1,
        "hora_recibido": "14:48:53",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00022",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NR_OcSx3ZrUzV6ot93e": {
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "diasSucursal": 77,
        "fechaPromesa": "28/3/2023",
        "fecha_recibido": "27/3/2023",
        "formaPago": 1,
        "hora_recibido": "17:28:9",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00023",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NSlggyX88mrJljVwLYo": {
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "diasSucursal": 62,
        "fechaPromesa": "12/4/2023",
        "fecha_entregado": "11/4/2023",
        "fecha_recibido": "11/4/2023",
        "formaPago": 1,
        "hora_entregado": "18:0:34",
        "hora_recibido": "13:2:36",
        "iva": true,
        "margen": 25,
        "no_os": "CU0423GE00024",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 600,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 450,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 240,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 400,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "cilindros": "",
            "costo": 500,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "marca": "",
            "modelo": "",
            "nombre": "600",
            "precio": 100,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "modelo": "",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "modelo": "",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "subtotal": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "subtotal": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "subtotal": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "subtotal": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 600,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 450,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 200,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 240,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 400,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "cilindros": "",
            "costo": 500,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "marca": "",
            "modelo": "",
            "nombre": "600",
            "precio": 100,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "descripcion": "ninguna",
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "modelo": "",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": 0,
            "desgloce": "",
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "modelo": "",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "entregado",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "tecnico": "-NL1hTSnVq0ImKF7kCT7",
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NSmhxrQroomQWi8GCp_": {
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan roro",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "checado": false,
            "id": "Capo",
            "index": 0
          },
          {
            "checado": false,
            "id": "Paragolpes_frontal",
            "index": 1
          },
          {
            "checado": false,
            "id": "Paragolpes_posterior",
            "index": 2
          },
          {
            "checado": false,
            "id": "Techo",
            "index": 3
          },
          {
            "checado": false,
            "id": "espejo_derecho",
            "index": 4
          },
          {
            "checado": false,
            "id": "espejo_izquierdo",
            "index": 5
          },
          {
            "checado": false,
            "id": "faros_frontales",
            "index": 6
          },
          {
            "checado": false,
            "id": "faros_posteriores",
            "index": 7
          },
          {
            "checado": false,
            "id": "parabrisas_posterior",
            "index": 8
          },
          {
            "checado": false,
            "id": "paragolpes_frontal",
            "index": 9
          },
          {
            "checado": false,
            "id": "paragolpes_posterior",
            "index": 10
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_1",
            "index": 11
          },
          {
            "checado": false,
            "id": "puerta_lateral_derecha_2",
            "index": 12
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_1",
            "index": 13
          },
          {
            "checado": false,
            "id": "puerta_lateral_izquierda_2",
            "index": 14
          },
          {
            "checado": false,
            "id": "puerta_posterior",
            "index": 15
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_1",
            "index": 16
          },
          {
            "checado": false,
            "id": "tirador_lateral_derecha_2",
            "index": 17
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_1",
            "index": 18
          },
          {
            "checado": false,
            "id": "tirador_lateral_izquierda_2",
            "index": 19
          },
          {
            "checado": false,
            "id": "tirador_posterior",
            "index": 20
          }
        ],
        "diasSucursal": 62,
        "fechaPromesa": "15/4/2023",
        "fecha_recibido": "11/4/2023",
        "formaPago": 1,
        "hora_recibido": "17:47:45",
        "iva": true,
        "margen": 25,
        "no_os": "CU0423GE00025",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 100,
              "flotilla": 200,
              "mo": 200,
              "normal": 250,
              "precio": 0,
              "refacciones1": 0,
              "refacciones2": 0
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 73.02504816955684,
              "flotilla": 2595,
              "mo": 1720,
              "normal": 3243.75,
              "precio": 0,
              "refacciones1": 700,
              "refacciones2": 875
            },
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 58.62068965517241,
              "flotilla": 1450,
              "mo": 700,
              "normal": 1812.5,
              "precio": 0,
              "refacciones1": 600,
              "refacciones2": 750
            },
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 20,
              "flotilla": 375,
              "mo": 0,
              "normal": 468.75,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 47.82608695652174,
              "flotilla": 1437.5,
              "mo": 500,
              "normal": 1796.875,
              "precio": 0,
              "refacciones1": 750,
              "refacciones2": 937.5
            },
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 74.68354430379746,
              "flotilla": 1185,
              "mo": 810,
              "normal": 1481.25,
              "precio": 0,
              "refacciones1": 300,
              "refacciones2": 375
            },
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "desgloce": {
              "UB": 57.333333333333336,
              "flotilla": 1500,
              "mo": 700,
              "normal": 1875,
              "precio": 0,
              "refacciones1": 640,
              "refacciones2": 800
            },
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "desgloce": {
              "UB": 42.12218649517685,
              "flotilla": 1555,
              "mo": 430,
              "normal": 1943.75,
              "precio": 0,
              "refacciones1": 900,
              "refacciones2": 1125
            },
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 500,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "flotilla": 150,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "1989",
          "categoria": "Coupé",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Naranja",
          "engomado": "Amarillo",
          "id": "-NEvGy6_-VqzuNUGPfcs",
          "marca": "Ford",
          "marcaMotor": "",
          "modelo": "F-250",
          "no_motor": "",
          "placas": "rts5456",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      },
      "-NWOVWQ0dsHZjNAz5miG": {
        "checkList": [
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "antena",
            "status": "si",
            "valor": "antena"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "birlo seguridad",
            "status": "si",
            "valor": "birlo_seguridad"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "bocinas",
            "status": "si",
            "valor": "bocinas"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "botones interiores",
            "status": "si",
            "valor": "botones_interiores"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "boxina claxon",
            "status": "si",
            "valor": "boxina_claxon"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "calefaccion",
            "status": "si",
            "valor": "calefaccion"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "cenicero",
            "status": "si",
            "valor": "cenicero"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "cristales",
            "status": "si",
            "valor": "cristales"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "encendedor",
            "status": "si",
            "valor": "encendedor"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "espejo retrovisor",
            "status": "si",
            "valor": "espejo_retorvisor"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "espejos laterales",
            "status": "si",
            "valor": "espejos_laterales"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "estuche herramientas",
            "status": "si",
            "valor": "estuche_herramientas"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "extintor",
            "status": "si",
            "valor": "extintor"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "gato",
            "status": "si",
            "valor": "gato"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "golpes y carroceria",
            "status": "si",
            "valor": "golpes_y_carroceria"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "instrumentos tablero",
            "status": "si",
            "valor": "instrumentos_tablero"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "interiores",
            "status": "si",
            "valor": "interiores"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "limpiadores",
            "status": "si",
            "valor": "limpiadores"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "llanta refaccion",
            "status": "si",
            "valor": "llanta_refaccion"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "llave cruz",
            "status": "si",
            "valor": "llave_cruz"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "Luces",
            "status": "si",
            "valor": "luces"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "maneral gato",
            "status": "si",
            "valor": "maneral_gato"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "manijas interiores",
            "status": "si",
            "valor": "manijas_interiores"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "molduras completas",
            "status": "si",
            "valor": "molduras_completas"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "radio",
            "status": "si",
            "valor": "radio"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "tapetes",
            "status": "si",
            "valor": "tapetes"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "tapon combustible",
            "status": "si",
            "valor": "tapon_combustible"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "tapones llantas",
            "status": "si",
            "valor": "tapones_llantas"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "tapones motor",
            "status": "si",
            "valor": "tapones_motor"
          },
          {
            "opciones": [
              "si",
              "no",
              "dañado"
            ],
            "show": "triangulos seguridad",
            "status": "si",
            "valor": "triangulos_seguridad"
          },
          {
            "opciones": [
              "si",
              "no"
            ],
            "show": "tarjeta de circulacion",
            "status": "si",
            "valor": "tarjeta_de_circulacion"
          },
          {
            "opciones": [
              "si",
              "no"
            ],
            "show": "llega en grua",
            "status": "si",
            "valor": "llega_en_grua"
          },
          {
            "opciones": [
              "si",
              "no"
            ],
            "show": "testigos en tablero",
            "status": "si",
            "valor": "testigos_en_tablero"
          },
          {
            "opciones": [
              "vacio",
              "1/4",
              "1/2",
              "3/4",
              "lleno"
            ],
            "show": "nivel gasolina",
            "status": "1/4",
            "valor": "nivel_gasolina"
          }
        ],
        "cliente": {
          "apellidos": "orol",
          "correo": "mkoromini94@gmail.com",
          "correo_sec": "",
          "empresa": "",
          "empresaShow": "",
          "id": "-NEvGgxapGc_2IQyfCPQ",
          "no_cliente": "JUORCU10220009",
          "nombre": "juan rroro",
          "showSucursal": "Culhuacán",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "3454353453",
          "tipo": "particular"
        },
        "detalles": [
          {
            "show": "capo",
            "status": false,
            "valor": "capo"
          },
          {
            "show": "paragolpes frontal",
            "status": false,
            "valor": "paragolpes_frontal"
          },
          {
            "show": "paragolpes posterior",
            "status": false,
            "valor": "paragolpes_posterior"
          },
          {
            "show": "techo",
            "status": false,
            "valor": "techo"
          },
          {
            "show": "espejo derecho",
            "status": false,
            "valor": "espejo_derecho"
          },
          {
            "show": "espejo izquierdo",
            "status": false,
            "valor": "espejo_izquierdo"
          },
          {
            "show": "faros frontales",
            "status": false,
            "valor": "faros_frontales"
          },
          {
            "show": "faros posteriores",
            "status": false,
            "valor": "faros_posteriores"
          },
          {
            "show": "parabrisas posterior",
            "status": false,
            "valor": "parabrisas_posterior"
          },
          {
            "show": "paragolpes frontal",
            "status": false,
            "valor": "paragolpes_frontal"
          },
          {
            "show": "paragolpes posterior",
            "status": false,
            "valor": "paragolpes_posterior"
          },
          {
            "show": "puerta lateral derecha 1",
            "status": false,
            "valor": "puerta_lateral_derecha_1"
          },
          {
            "show": "puerta lateral derecha 2",
            "status": false,
            "valor": "puerta_lateral_derecha_2"
          },
          {
            "show": "puerta lateral izquierda 1",
            "status": false,
            "valor": "puerta_lateral_izquierda_1"
          },
          {
            "show": "puerta lateral izquierda 2",
            "status": false,
            "valor": "puerta_lateral_izquierda_2"
          },
          {
            "show": "puerta posterior",
            "status": false,
            "valor": "puerta_posterior"
          },
          {
            "show": "tirador lateral derecha 1",
            "status": false,
            "valor": "tirador_lateral_derecha_1"
          },
          {
            "show": "tirador lateral derecha 2",
            "status": false,
            "valor": "tirador_lateral_derecha_2"
          },
          {
            "show": "tirador lateral izquierda 1",
            "status": false,
            "valor": "tirador_lateral_izquierda_1"
          },
          {
            "show": "tirador lateral izquierda 2",
            "status": false,
            "valor": "tirador_lateral_izquierda_2"
          },
          {
            "show": "tirador posterior",
            "status": false,
            "valor": "tirador_posterior"
          }
        ],
        "diasEntrega": 0,
        "diasSucursal": 17,
        "fecha_promesa": "2023-05-26T06:00:00.000Z",
        "fecha_recibido": "26/5/2023",
        "formaPago": 1,
        "hora_recibido": "13:21:18",
        "iva": true,
        "no_os": "CU0523SU00026",
        "notifico": true,
        "pathPDF": "https://firebasestorage.googleapis.com/v0/b/speed-pro-f799a.appspot.com/o/PDF%2Frecepciones%2FCU0523SU00026.pdf?alt=media&token=a8212627-374a-47ec-884d-21ea77c8c0ac",
        "reporte": {
          "descuento": 0,
          "iva": 1945.6000000000001,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "refacciones_v": 5800,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0,
          "subtotal": 12160,
          "total": 14105.599999999999,
          "ub": 61.8421052631579
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO",
                "total": 200
              }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "index": 0,
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "precio": 200,
            "reporte": {
              "mo": 200,
              "refacciones": 0,
              "refacciones_v": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 200,
              "ub": 100
            },
            "status": true,
            "tipo": "paquete",
            "total": 200
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 0,
                "nombre": "nueva",
                "precio": 100,
                "tipo": "MO",
                "total": 100
              },
              {
                "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion",
                "total": 875
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 2,
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO",
                "total": 120
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO",
                "total": 700
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "index": 4,
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO",
                "total": 800
              }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "index": 1,
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "precio": 2595,
            "reporte": {
              "mo": 1720,
              "refacciones": 700,
              "refacciones_v": 875,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 2595,
              "ub": 66.28131021194605
            },
            "status": true,
            "tipo": "paquete",
            "total": 2595
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion",
                "total": 750
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 2,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 1450,
            "reporte": {
              "mo": 700,
              "refacciones": 600,
              "refacciones_v": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1450,
              "ub": 48.275862068965516
            },
            "status": true,
            "tipo": "paquete",
            "total": 1450
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "precio": 375,
            "reporte": {
              "mo": 0,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 375,
              "ub": 0
            },
            "status": true,
            "tipo": "paquete",
            "total": 375
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion",
                "total": 562.5
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 2,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "index": 5,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "precio": 1437.5,
            "reporte": {
              "mo": 500,
              "refacciones": 750,
              "refacciones_v": 937.5,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1437.5,
              "ub": 34.78260869565217
            },
            "status": true,
            "tipo": "paquete",
            "total": 1437.5
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 0,
                "marca": "ninguna",
                "nombre": "Mandk",
                "normal": 650,
                "precio": 500,
                "subtotal": 500,
                "tipo": "MO",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion",
                "total": 375
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 230,
                "index": 2,
                "marca": "ninguna",
                "nombre": "new mo",
                "normal": 299,
                "precio": 230,
                "subtotal": 230,
                "tipo": "MO",
                "total": 230
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "index": 6,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "precio": 1185,
            "reporte": {
              "mo": 810,
              "refacciones": 300,
              "refacciones_v": 375,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1185,
              "ub": 68.35443037974683
            },
            "status": true,
            "tipo": "paquete",
            "total": 1185
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion",
                "total": 250
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion",
                "total": 300
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 700,
                "index": 3,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "normal": 910,
                "precio": 700,
                "subtotal": 700,
                "tipo": "MO",
                "total": 700
              }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "index": 7,
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "precio": 1500,
            "reporte": {
              "mo": 700,
              "refacciones": 640,
              "refacciones_v": 800,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1500,
              "ub": 46.666666666666664
            },
            "status": true,
            "tipo": "paquete",
            "total": 1500
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 350,
                "index": 0,
                "marca": "ninguna",
                "nombre": "600",
                "normal": 455,
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO",
                "total": 350
              },
              {
                "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion",
                "total": 500
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion",
                "total": 625
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "flotilla": 80,
                "index": 3,
                "marca": "Aston Martín",
                "nombre": "mano de obra cara",
                "normal": 104,
                "precio": 80,
                "subtotal": 80,
                "tipo": "MO",
                "total": 80
              }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "index": 8,
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "precio": 1555,
            "reporte": {
              "mo": 430,
              "refacciones": 900,
              "refacciones_v": 1125,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0,
              "total": 1555,
              "ub": 27.652733118971057
            },
            "status": true,
            "tipo": "paquete",
            "total": 1555
          },
          {
            "aprobado": true,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "tipo": "MO",
            "total": 1000
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "tipo": "refaccion",
            "total": 187.5
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "tipo": "MO",
            "total": 300
          }
        ],
        "status": "recibido",
        "sucursal": {
          "correo": "ventas_culhuacan@speed-service.com.mx",
          "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
          "id": "-N2glF34lV3Gj0bQyEWK",
          "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
          "serie": "8PFRT119",
          "status": true,
          "sucursal": "Culhuacán",
          "telefono": "5556951051"
        },
        "vehiculo": {
          "anio": "2015",
          "categoria": "Camioneta de lujo",
          "cilindros": "4",
          "cliente": "-NEvGgxapGc_2IQyfCPQ",
          "color": "Marrón profundo",
          "engomado": "Rosa",
          "id": "-NG3sHVtOK8ofWWIt_eM",
          "marca": "Chevrolet",
          "marcaMotor": "",
          "modelo": "Equinox",
          "no_motor": "",
          "placas": "dfj7657",
          "status": true,
          "transmision": "Estandar",
          "vinChasis": ""
        }
      }
    }
    console.log(this._publicos.crearArreglo2(recepciones).length);
    
    const claves = Object.keys(recepciones)
    let nuevas =  {}

    //TODO aqui la lo que se realizara


    
    //TODO aqui la lo que se realizara

    console.log(nuevas);
    console.log(this._publicos.crearArreglo2(nuevas).length);
    
    
  }
}