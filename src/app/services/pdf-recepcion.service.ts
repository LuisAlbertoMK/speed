import { Injectable } from '@angular/core';
import { ServiciosPublicosService } from './servicios-publicos.service';


import  pdfMake  from "pdfmake/build/pdfmake";
import  pdfFonts  from "pdfmake/build/vfs_fonts.js";

pdfMake.vfs = pdfFonts.pdfMake.vfs
@Injectable({
  providedIn: 'root'
})
export class PdfRecepcionService {
  
  infoPDF = {
    "checkList": [
        {
            "id": "antena",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "antena"
        },
        {
            "id": "birlo_seguridad",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "birlo seguridad"
        },
        {
            "id": "bocinas",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "bocinas"
        },
        {
            "id": "botones_interiores",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "botones interiores"
        },
        {
            "id": "boxina_claxon",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "boxina claxon"
        },
        {
            "id": "calefaccion",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "calefaccion"
        },
        {
            "id": "cenicero",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "cenicero"
        },
        {
            "id": "cristales",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "cristales"
        },
        {
            "id": "encendedor",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "encendedor"
        },
        {
            "id": "espejo_retorvisor",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "espejo retorvisor"
        },
        {
            "id": "espejos_laterales",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "espejos laterales"
        },
        {
            "id": "estuche_herramientas",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "estuche herramientas"
        },
        {
            "id": "extintor",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "extintor"
        },
        {
            "id": "gato",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "gato"
        },
        {
            "id": "golpes_y_carroceria",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "golpes y carroceria"
        },
        {
            "id": "instrumentos_tablero",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "instrumentos tablero"
        },
        {
            "id": "interiores",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "interiores"
        },
        {
            "id": "limpiadores",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "limpiadores"
        },
        {
            "id": "llanta_refaccion",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "llanta refaccion"
        },
        {
            "id": "llave_cruz",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "llave cruz"
        },
        {
            "id": "llega_en_grua",
            "opciones": [
                "si",
                "no"
            ],
            "status": "si",
            "mostrar": "llega en grua"
        },
        {
            "id": "luces",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "luces"
        },
        {
            "id": "maneral_gato",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "maneral gato"
        },
        {
            "id": "manijas_interiores",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "manijas interiores"
        },
        {
            "id": "molduras_completas",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "molduras completas"
        },
        {
            "id": "nivel_gasolina",
            "opciones": [
                "vacio",
                "1/4",
                "1/2",
                "3/4",
                "lleno"
            ],
            "status": "vacio",
            "mostrar": "nivel gasolina"
        },
        {
            "id": "radio",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "radio"
        },
        {
            "id": "tapetes",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "tapetes"
        },
        {
            "id": "tapon_combustible",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "tapon combustible"
        },
        {
            "id": "tapones_llantas",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "tapones llantas"
        },
        {
            "id": "tapones_motor",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "tapones motor"
        },
        {
            "id": "tarjeta_de_circulacion",
            "opciones": [
                "si",
                "no"
            ],
            "status": "si",
            "mostrar": "tarjeta de circulacion"
        },
        {
            "id": "testigos_en_tablero",
            "opciones": [
                "si",
                "no"
            ],
            "status": "si",
            "mostrar": "testigos en tablero"
        },
        {
            "id": "triangulos_seguridad",
            "opciones": [
                "si",
                "no",
                "dañado"
            ],
            "status": "si",
            "mostrar": "triangulos seguridad"
        }
    ],
    "cliente": {
        "apellidos": "oro",
        "correo": "mkoromini94@gmail.com",
        "correo_sec": "",
        "fullname": "juan roro oro",
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
            "id": "Capo",
            "checado": true,
            "index": 0
        },
        {
            "id": "Paragolpes_frontal",
            "checado": true,
            "index": 1
        },
        {
            "id": "Paragolpes_posterior",
            "checado": true,
            "index": 2
        },
        {
            "id": "Techo",
            "checado": true,
            "index": 3
        },
        {
            "id": "espejo_derecho",
            "checado": false,
            "index": 4
        },
        {
            "id": "espejo_izquierdo",
            "checado": false,
            "index": 5
        },
        {
            "id": "faros_frontales",
            "checado": false,
            "index": 6
        },
        {
            "id": "faros_posteriores",
            "checado": false,
            "index": 7
        },
        {
            "id": "parabrisas_posterior",
            "checado": false,
            "index": 8
        },
        {
            "id": "paragolpes_frontal",
            "checado": false,
            "index": 9
        },
        {
            "id": "paragolpes_posterior",
            "checado": true,
            "index": 10
        },
        {
            "id": "puerta_lateral_derecha_1",
            "checado": false,
            "index": 11
        },
        {
            "id": "puerta_lateral_derecha_2",
            "checado": false,
            "index": 12
        },
        {
            "id": "puerta_lateral_izquierda_1",
            "checado": false,
            "index": 13
        },
        {
            "id": "puerta_lateral_izquierda_2",
            "checado": false,
            "index": 14
        },
        {
            "id": "puerta_posterior",
            "checado": false,
            "index": 15
        },
        {
            "id": "tirador_lateral_derecha_1",
            "checado": false,
            "index": 16
        },
        {
            "id": "tirador_lateral_derecha_2",
            "checado": false,
            "index": 17
        },
        {
            "id": "tirador_lateral_izquierda_1",
            "checado": true,
            "index": 18
        },
        {
            "id": "tirador_lateral_izquierda_2",
            "checado": false,
            "index": 19
        },
        {
            "id": "tirador_posterior",
            "checado": false,
            "index": 20
        }
    ],
    "observaciones":'Fugiat ea aute labore pariatur aute nulla irure occaecat aliqua dolor ullamco qui ad.',
    "elementos": [
        {
            "UB": "100.00",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "nombre": "FRENOSSSS",
                    "precio": 200,
                    "tipo": "MO",
                    "costo": 0
                }
            ],
            "enCatalogo": true,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 200,
            "desgloce": {
                "mo": 200,
                "refacciones1": 0,
                "refacciones2": 0,
                "UB": 100,
                "flotilla": 200,
                "normal": 250,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 200
        },
        {
            "UB": "73.02",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "nombre": "nueva",
                    "precio": 100,
                    "tipo": "MO",
                    "costo": 0
                },
                {
                    "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "marca": "BMW",
                    "nombre": "prueba 2000 mo",
                    "precio": 700,
                    "tipo": "refaccion"
                },
                {
                    "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "nombre": "nueva",
                    "precio": 120,
                    "tipo": "MO",
                    "costo": 0
                },
                {
                    "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "marca": "BMW",
                    "nombre": "prueba 2000 mo",
                    "precio": 700,
                    "tipo": "MO",
                    "costo": 0
                },
                {
                    "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "nombre": "prueba 500",
                    "precio": 800,
                    "tipo": "MO",
                    "costo": 0
                }
            ],
            "enCatalogo": true,
            "id": "-NE430_ohL7xCijFnR3i",
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 2595,
            "desgloce": {
                "mo": 1720,
                "refacciones1": 700,
                "refacciones2": 875,
                "UB": 73.02504816955684,
                "flotilla": 2595,
                "normal": 3243.75,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 2595
        },
        {
            "UB": "58.62",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NEH_QLEjBw7m2y3OBGJ",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "XD",
                    "flotilla": 750,
                    "marca": "BMW",
                    "nombre": "exprimi",
                    "normal": 975,
                    "precio": 600,
                    "subtotal": 750,
                    "tipo": "refaccion",
                    "total": 975
                },
                {
                    "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 700,
                    "marca": "BMW",
                    "nombre": "prueba 2000 mo",
                    "normal": 910,
                    "precio": 700,
                    "subtotal": 700,
                    "tipo": "MO",
                    "total": 910,
                    "costo": 0
                }
            ],
            "enCatalogo": true,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 1450,
            "desgloce": {
                "mo": 700,
                "refacciones1": 600,
                "refacciones2": 750,
                "UB": 58.62068965517241,
                "flotilla": 1450,
                "normal": 1812.5,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 1450
        },
        {
            "UB": "20.00",
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 375,
                    "marca": "Audi",
                    "nombre": "BALATAS",
                    "normal": 487.5,
                    "precio": 300,
                    "subtotal": 375,
                    "tipo": "refaccion",
                    "total": 487.5
                }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 375,
            "desgloce": {
                "mo": 0,
                "refacciones1": 300,
                "refacciones2": 375,
                "UB": 20,
                "flotilla": 375,
                "normal": 468.75,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 375
        },
        {
            "UB": "20.00",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 375,
                    "marca": "Audi",
                    "nombre": "BALATAS",
                    "normal": 487.5,
                    "precio": 300,
                    "subtotal": 375,
                    "tipo": "refaccion",
                    "total": 487.5
                }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 375,
            "desgloce": {
                "mo": 0,
                "refacciones1": 300,
                "refacciones2": 375,
                "UB": 20,
                "flotilla": 375,
                "normal": 468.75,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 375
        },
        {
            "UB": "47.82",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 375,
                    "marca": "Audi",
                    "nombre": "BALATAS",
                    "normal": 487.5,
                    "precio": 300,
                    "subtotal": 375,
                    "tipo": "refaccion",
                    "total": 487.5
                },
                {
                    "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 562.5,
                    "marca": "GMC",
                    "nombre": "XD",
                    "normal": 731.25,
                    "precio": 450,
                    "subtotal": 562.5,
                    "tipo": "refaccion",
                    "total": 731.25
                },
                {
                    "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 500,
                    "marca": "ninguna",
                    "nombre": "Mandk",
                    "normal": 650,
                    "precio": 500,
                    "subtotal": 500,
                    "tipo": "MO",
                    "total": 650,
                    "costo": 0
                }
            ],
            "enCatalogo": true,
            "id": "-NG386DKUmKAlxvapTIK",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 1437.5,
            "desgloce": {
                "mo": 500,
                "refacciones1": 750,
                "refacciones2": 937.5,
                "UB": 47.82608695652174,
                "flotilla": 1437.5,
                "normal": 1796.875,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 1437.5
        },
        {
            "UB": "74.68",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 500,
                    "marca": "ninguna",
                    "nombre": "Mandk",
                    "normal": 650,
                    "precio": 500,
                    "subtotal": 500,
                    "tipo": "MO",
                    "total": 650,
                    "costo": 0
                },
                {
                    "IDreferencia": "-NFUnd1JQ-3Se-7QyIvc",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 375,
                    "marca": "Audi",
                    "nombre": "BALATAS",
                    "normal": 487.5,
                    "precio": 300,
                    "subtotal": 375,
                    "tipo": "refaccion",
                    "total": 487.5
                },
                {
                    "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 230,
                    "marca": "ninguna",
                    "nombre": "new mo",
                    "normal": 299,
                    "precio": 230,
                    "subtotal": 230,
                    "tipo": "MO",
                    "total": 299,
                    "costo": 0
                },
                {
                    "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 80,
                    "marca": "Aston Martín",
                    "nombre": "mano de obra cara",
                    "normal": 104,
                    "precio": 80,
                    "subtotal": 80,
                    "tipo": "MO",
                    "total": 104,
                    "costo": 0
                }
            ],
            "enCatalogo": true,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 1185,
            "desgloce": {
                "mo": 810,
                "refacciones1": 300,
                "refacciones2": 375,
                "UB": 74.68354430379746,
                "flotilla": 1185,
                "normal": 1481.25,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 1185
        },
        {
            "UB": "57.33",
            "cantidad": 1,
            "cilindros": "6",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NFof935I4yJ0ulZ945p",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 250,
                    "marca": "ninguna",
                    "nombre": "refa refa",
                    "normal": 325,
                    "precio": 200,
                    "subtotal": 250,
                    "tipo": "refaccion",
                    "total": 325
                },
                {
                    "IDreferencia": "-NFof935I4yJ0ulZ945p",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 250,
                    "marca": "ninguna",
                    "nombre": "refa refa",
                    "normal": 325,
                    "precio": 200,
                    "subtotal": 250,
                    "tipo": "refaccion",
                    "total": 325
                },
                {
                    "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 300,
                    "marca": "-NFiyBdjmZFfdpSoyWNU",
                    "nombre": "nueva refac 45",
                    "normal": 390,
                    "precio": 240,
                    "subtotal": 300,
                    "tipo": "refaccion",
                    "total": 390
                },
                {
                    "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 700,
                    "marca": "BMW",
                    "nombre": "prueba 2000 mo",
                    "normal": 910,
                    "precio": 700,
                    "subtotal": 700,
                    "tipo": "MO",
                    "total": 910,
                    "costo": 0
                }
            ],
            "enCatalogo": true,
            "id": "-NG38nZre8RkONgpHMEY",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 1500,
            "desgloce": {
                "mo": 700,
                "refacciones1": 640,
                "refacciones2": 800,
                "UB": 57.333333333333336,
                "flotilla": 1500,
                "normal": 1875,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 1500
        },
        {
            "UB": "42.12",
            "cantidad": 1,
            "cilindros": "4",
            "costo": 0,
            "elementos": [
                {
                    "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 350,
                    "marca": "ninguna",
                    "nombre": "600",
                    "normal": 455,
                    "precio": 350,
                    "subtotal": 350,
                    "tipo": "MO",
                    "total": 455,
                    "costo": 0
                },
                {
                    "IDreferencia": "-NG3IXnZpd88mlXrpK4C",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 500,
                    "marca": "-NFyYn5eKO2EuaZhukGs",
                    "nombre": "BALATAS CERÁMICA",
                    "normal": 650,
                    "precio": 400,
                    "subtotal": 500,
                    "tipo": "refaccion",
                    "total": 650
                },
                {
                    "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 625,
                    "marca": "BMW",
                    "nombre": "SEGURO BALASTASSSS",
                    "normal": 812.5,
                    "precio": 500,
                    "subtotal": 625,
                    "tipo": "refaccion",
                    "total": 812.5
                },
                {
                    "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                    "cantidad": 1,
                    "catalogo": true,
                    "descripcion": "ninguna",
                    "flotilla": 80,
                    "marca": "Aston Martín",
                    "nombre": "mano de obra cara",
                    "normal": 104,
                    "precio": 80,
                    "subtotal": 80,
                    "tipo": "MO",
                    "total": 104,
                    "costo": 0
                }
            ],
            "enCatalogo": true,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "status": "aprobado",
            "tipo": "paquete",
            "flotilla": 1555,
            "desgloce": {
                "mo": 430,
                "refacciones1": 900,
                "refacciones2": 1125,
                "UB": 42.12218649517685,
                "flotilla": 1555,
                "normal": 1943.75,
                "precio": 0
            },
            "aprobado": true,
            "showStatus": "Aprobado",
            "subtotal": 1555
        },
        {
            "aprobada": false,
            "cantidad": 2,
            "costo": 500,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "nombre": "600",
            "precio": 100,
            "tipo": "MO",
            "flotilla": 500,
            "aprobado": true,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000
        },
        {
            "aprobada": false,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NI8Qx6S-SUBqjhU_z2k",
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "tipo": "refaccion",
            "flotilla": 150,
            "aprobado": true,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150
        },
        {
            "aprobada": false,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "tipo": "MO",
            "flotilla": 300,
            "aprobado": true,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300
        }
    ],
    "sucursal": {
        "correo": "ventas_culhuacan@speed-service.com.mx",
        "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
        "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
        "serie": "8PFRT119",
        "status": true,
        "sucursal": "Culhuacán",
        "telefono": "5556951051",
        "id": "-N2glF34lV3Gj0bQyEWK"
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
  constructor(public _publicos:ServiciosPublicosService) { }
  async obtenerImege(data:any){
    async function bases(URL:any) {
      const dataaa = {url: '', logo:''}
      await getBase64ImageFromURL(URL).then((val:any)=>{
        dataaa.url = val
      })
      return dataaa
    }
    function getBase64ImageFromURL(url:string) {
      return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = error => {
          reject(error);
        };
        img.src = url;
      });
    }
    // console.log(data);
    
    const nuevasdocumentDefinitionimages = {}
    nuevasdocumentDefinitionimages['logo'] = `${(await bases('../../assets/logoSpeedPro/Logo-Speedpro.png')).url}`
    nuevasdocumentDefinitionimages['combustiblevacio'] = `${(await bases('../../assets/combustible/c_vacio.png')).url}`
    nuevasdocumentDefinitionimages['combustible14'] = `${(await bases('../../assets/combustible/c_14.png')).url}`
    nuevasdocumentDefinitionimages['combustible12'] = `${(await bases('../../assets/combustible/c_12.png')).url}`
    nuevasdocumentDefinitionimages['combustible34'] = `${(await bases('../../assets/combustible/c_34.png')).url}`
    nuevasdocumentDefinitionimages['combustibleFull'] = `${(await bases('../../assets/combustible/c_full.png')).url}`
    nuevasdocumentDefinitionimages['capo'] = `${(await bases('../../assets/imagenes_detalles/capo.jpg')).url}`
    nuevasdocumentDefinitionimages['espejo_derecho'] = `${(await bases('../../assets/imagenes_detalles/espejo_derecho.jpg')).url}`
    nuevasdocumentDefinitionimages['espejo_izquierdo'] = `${(await bases('../../assets/imagenes_detalles/espejo_izquierdo.jpg')).url}`
    nuevasdocumentDefinitionimages['faros_frontales'] = `${(await bases('../../assets/imagenes_detalles/faros_frontales.jpg')).url}`
    nuevasdocumentDefinitionimages['faros_posteriores'] = `${(await bases('../../assets/imagenes_detalles/faros_posteriores.jpg')).url}`
    nuevasdocumentDefinitionimages['frontal'] = `${(await bases('../../assets/imagenes_detalles/frontal.jpg')).url}`
    nuevasdocumentDefinitionimages['lateralDerecho'] = `${(await bases('../../assets/imagenes_detalles/lateralDerecho.jpg')).url}`
    nuevasdocumentDefinitionimages['parabrisas'] = `${(await bases('../../assets/imagenes_detalles/parabrisas.jpg')).url}`
    nuevasdocumentDefinitionimages['parabrisas_posterior'] = `${(await bases('../../assets/imagenes_detalles/parabrisas_posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['paragolpes_frontal'] = `${(await bases('../../assets/imagenes_detalles/paragolpes_frontal.jpg')).url}`
    nuevasdocumentDefinitionimages['paragolpes_posterior'] = `${(await bases('../../assets/imagenes_detalles/paragolpes_posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['posterior'] = `${(await bases('../../assets/imagenes_detalles/posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_lateral_izquierda_1'] = `${(await bases('../../assets/imagenes_detalles/tirador_lateral_izquierda_1.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_lateral_izquierda_2'] = `${(await bases('../../assets/imagenes_detalles/tirador_lateral_izquierda_2.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_lateral_derecha_1'] = `${(await bases('../../assets/imagenes_detalles/tirador_lateral_derecha_1.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_lateral_derecha_2'] = `${(await bases('../../assets/imagenes_detalles/tirador_lateral_derecha_2.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_lateral_izquierda_1'] = `${(await bases('../../assets/imagenes_detalles/puerta_lateral_izquierda_1.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_lateral_izquierda_2'] = `${(await bases('../../assets/imagenes_detalles/puerta_lateral_izquierda_2.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_lateral_derecha_1'] = `${(await bases('../../assets/imagenes_detalles/puerta_lateral_derecha_1.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_lateral_derecha_2'] = `${(await bases('../../assets/imagenes_detalles/puerta_lateral_derecha_2.jpg')).url}`
    nuevasdocumentDefinitionimages['puerta_posterior'] = `${(await bases('../../assets/imagenes_detalles/puerta_posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['tirador_posterior'] = `${(await bases('../../assets/imagenes_detalles/tirador_posterior.jpg')).url}`
    nuevasdocumentDefinitionimages['techo'] = `${(await bases('../../assets/imagenes_detalles/techo.jpg')).url}`
    nuevasdocumentDefinitionimages['firmaCliente'] = `${data['firmaCliente']}`

    
    let person_ =[]
    
    if (data['personalizados'].length) {
      // console.log('anexar al pdf las imagenes de personalizados');
      person_ = data['personalizados']
    }

    person_.forEach((p)=>{
      const nombre = p['nombre'].split('.')
      nuevasdocumentDefinitionimages[nombre[0].toLowerCase()] = `${p['url']}`
    })
    const checados = data['detalles'].filter(d=>d['checado'])
    data['conjuntos'] = checados.concat(person_)
    return this.pdf(data,nuevasdocumentDefinitionimages)
  }
  async pdf(data:any, bibliotecaVirtual:any){

    const colorTextoPDF: string = '#1215F4';
    const dat = data
    if (!dat['cliente']['empresa']) {
      dat['cliente']['empresa'] =''
    }else{
      dat['cliente']['empresa']
    }


    function Combustble(){
      let {status} = dat['checkList'].find(c=>c['id'] === 'nivel_gasolina')
      let fullpath = ''
      switch (status) {
        case 'vacio':
          // imagen = 'c_vacio.png'
          // fullpath = `${ruta}/${imagen}`
          fullpath = 'combustiblevacio'
          break;
          case '1/4':
            // imagen = 'c_14.png'
            // fullpath = `${ruta}/${imagen}`
            fullpath = 'combustible14'
            break;
          case '1/2':
            // imagen = 'c_12.png'
            // fullpath = `${ruta}/${imagen}`
            fullpath = 'combustible12'
            break;
          case '3/4':
            // imagen = 'c_34.png'
            // fullpath = `${ruta}/${imagen}`
            fullpath = 'combustible34'
            break;
          case 'lleno':
            // imagen = 'c_full.png'
            // fullpath = `${ruta}/${imagen}`
            fullpath = 'combustibleFull'
            break;
        default:
          break;
      }
      return fullpath
    }

    function construirCheck (){
      let data = []
      if (dat['checkList']) data = dat['checkList']
      let body = [];
      // console.log(data);
      let i = 0, mul = 0
      let multiplos = [4,8,12,16,20,24,28,32,36]
      let aqui = []
      data.forEach((e)=>{
        i++
        
        aqui.push({ text: `${transform(e['mostrar'])}: ${e['status'].toUpperCase()}`,alignment: 'left', style:'info3' })
        // console.log(aqui);
        
        if (i == multiplos[mul]) {
          mul++
          body.push(aqui)
          aqui = []          
        }
      })
      
      return body


    }
    // console.log();
    const da = construirCheck()

    function transform(value: string, ...args: unknown[]): unknown {
      const cadena = String(value).toLowerCase()
      let arr =[...cadena]
      arr[0] = arr[0].toUpperCase()
      return arr.join('');
    }

    function redondeado2(value: number,simbolo?:string): string {
      // let nuevoValue = ``
      let symbol= '';
      (!simbolo) ? symbol = '$ ': symbol=simbolo
      if (value) {
        const val = value//12345.48
        const negativo = String(val).includes('-')
        const deciameles = String(val).includes('.')
        let  simbolo = '-', SOloNumeros = ``, deciamales=``
        let nuevoValor = ``, contador =0
        let nu_c = []
    
        if (negativo) {
          const soloNum = String(val).split('-')
          const soloNum2 = soloNum[1].split('.')
          SOloNumeros = soloNum2[0]
          contador = String(soloNum2[0]).length
          nu_c = SOloNumeros.split('')
        }else{
          simbolo = ''
          const solonum = String(val).split('.')
          SOloNumeros = solonum[0]
          contador = solonum[0].length
          nu_c = SOloNumeros.split('')
        }
        if (contador === 4) { nu_c[0]=nu_c[0] + ',' }
          if (contador === 5) { nu_c[1]=nu_c[1] + ',' }
          if (contador === 6) { nu_c[2]=nu_c[2] + ',' }
          if (contador === 7) { nu_c[0]=nu_c[0] + ','; nu_c[3]=nu_c[3] + ',' }
          if (contador === 8) { nu_c[1]=nu_c[1] + ','; nu_c[4]=nu_c[4] + ',' }
          if (contador === 9) { nu_c[2]=nu_c[2] + ','; nu_c[5]=nu_c[5] + ',' }
          if (contador === 10) { nu_c[0]=nu_c[0] + ','; nu_c[3]=nu_c[3] + ','; nu_c[6]=nu_c[6] + ',' }
          if (contador === 11) { nu_c[1]=nu_c[1] + ','; nu_c[4]=nu_c[4] + ','; nu_c[7]=nu_c[7] + ',' }
          if (contador === 12) { nu_c[2]=nu_c[2] + ','; nu_c[5]=nu_c[5] + ','; nu_c[8]=nu_c[8] + ',' }
          if (contador === 13) { nu_c[0]=nu_c[0] + ','; nu_c[3]=nu_c[3] + ','; nu_c[6]=nu_c[6] + ',' ; nu_c[9]=nu_c[9] + ',' }
          nuevoValor = `${symbol}${simbolo} ${nu_c.join('')}`
        if (deciameles) {
          const deciamal = String(val).split('.')
          let split_Decimales:string = deciamal[1].slice(0,2)
          if (split_Decimales.length<2) {
            split_Decimales = split_Decimales + '0'
          }
          nuevoValor = `${nuevoValor}.${split_Decimales}`
        }else{
          nuevoValor = `${nuevoValor}.00`
        }
        return nuevoValor
        }else{
            return `${symbol} 0.00`
        }
  
    }

    function table(elements, columns, witdhsDef, showHeaders, headers, layoutDef) {
      return {
          table: {
              headerRows: 1,
              widths: witdhsDef,
              body: buildTableBody(elements, columns, showHeaders, headers)
          },
          layout: layoutDef
      };
    }
    let totalRecepcion = 0

    function buildTableBody(elements, columns, showHeaders, headers) {
      var body = [];
      if(showHeaders) body.push(headers); 
      let filtrados = elements.filter(f=>f['aprobado'])
      // console.log(filtrados);
      // console.log(elements);
      
      filtrados.forEach(function (row) {
        totalRecepcion+= row['flotilla']
          var dataRow = [];
          var i = 0;
          // console.log(row['nombre']);
          columns.forEach(function(column) {
            if (column==='flotilla') {
              // console.log(redondeado2(row[column]));
              dataRow.push({text: `${redondeado2(row[column])}`,alignment: headers[i].alignmentChild,style:'content' });
              i++;
            }else{
              dataRow.push({text: `${transform(row[column])}`,style:'content' });
              i++;
            }
          })
          // console.log(row);
          // columns.forEach(function(column) {
          //   dataRow.push({text: `${column['nombre']}`,style:'content' });
          // })
          // dataRow.push({text: `${row['nombre']}`,style:'content' });
          body.push(dataRow);
      })
      return body;
    }
    let documentDefinition = {
      footer: function(currentPage, pageCount) {
        return [
          {
            columns: [
              {
                width: '80%',
                text: ` `,
              },
              {
                width: '20%',
                text: `página ${currentPage.toString()}  de  ${pageCount}`,
              }
            ]
          }
        ]
      },
      header: function(currentPage, pageCount, pageSize) {

        return [
          {
            columns: [
              {
                width: '100%',
                text: ` `,
              }
            ]
          }
        ]
      },
      content: [],
      styles: {
        header: { fontSize: 14,bold: true,align: 'center'},
        info: { fontSize: 9,bold: true,align: 'center',color: colorTextoPDF},
        info2: { fontSize: 9,bold: true,align: 'center',color: 'black'},
        info3: { fontSize: 8,bold: false,align: 'center',color: 'black'},
        title: { fontSize: 9,bold: true,align: 'center'},
        sucursal: { fontSize: 10,bold: true,align: 'center'},
        operadora: { fontSize: 14,bold: true,align: 'center'},
        medium: { fontSize: 14,bold: true,color:colorTextoPDF },
        otro: { fontSize: 12,bold: true,color: 'black' },
        content:{fontSize:8,color: 'black'},
        normal:{fontSize:10,color: 'red'},
        normal2:{fontSize:9,color: 'red'},
        importeLetras:{fontSize:10,bold: true},
        detallesPaquetes:{fontSize:9,color: 'black'},
        terminos:{ fontSize:8},
        terminos2:{ fontSize:7},
        anotherStyle: { italics: true, align: 'center'},
        vencimiento: { italics: true, align: 'right', color: 'red', fontSize: 8}
      },
      images:{}
    }
    const info = [{
      layout: 'noBorders',
      table: {
        headerRows: 0,
        widths: [ '25%','50%','25%' ],
        body: [
          [ 
            
            {
              image: `logo`,
              height: 50,
              width: 140,
              aling: 'center',
              valing: 'center'
            },
            { 
              text: `${dat['sucursal'].direccion}`,bold: true, alignment: 'center', style:'otro'
            },
            { 
              // text: 'fecha: 21/03/2023',bold: true, alignment: 'center', style:'info'
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ 50, '*' ],
        
                body: [
                  [ 
                    {text: 'Fecha:',bold: true, alignment: 'left', style:'info'},
                    {text: `${dat['fecha']}`,bold: true, alignment: 'left', style:'info'},
                  ],
                  [ 
                    {text: 'No. Orden:',bold: true, alignment: 'left', style:'info'},
                    {text: `${dat['no_os']}`,bold: true, alignment: 'left', style:'info'},
                  ],
                ]
              }
            },
        ],
        ]
      }
    },
    {
      layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '35%','*' ],

        body: [
          [ 
            
            {
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '100%' ],
        
                body: [
                  [ 
                    {
                      image: `${Combustble()}`,
                      height: 40,
                      width: 90,
                      aling: 'center',
                      valing: 'center',
                      alignment: 'center'
                    }
                   ],
                  [ {text: `Nivel de gasolina`,bold: true, alignment: 'center', style:'info2'} ]
                ]
              }
            },
            {
              layout: 'lightHorizontalLines', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '100%' ],
        
                body: [
                  [ {text: `Observaciones`,bold: true, alignment: 'left', style:'info2'} ],
                  [ {text: `${dat['observaciones']}`,bold: true, alignment: 'left', style:'info2'} ]
                ]
              }
            }
           ],
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      
      layout: 'noBorders',
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '*',  '*' ],

        body: [
          [ { text: `Datos de cliente`,alignment: 'center', style:'normal2' },   { text: `Datos de vehículo`,alignment: 'center', style:'normal2' } ],
          [ 
            {
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ 50, '*'],
        
                body: [
                  [ 
                    { text: `Nombre:`,alignment: 'left', style:'info' },
                    { text: `${dat['cliente'].fullname}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                  [ 
                    { text: `Tel:`,alignment: 'left', style:'info' },
                    { text: `${dat['cliente'].telefono_movil}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                  [ 
                    { text: `Email:`,alignment: 'left', style:'info' },
                    { text: `${dat['cliente'].correo}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ]
                ]
              }
            },    
            {
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ 50, '*',50,'*'],
        
                body: [
                  [ 
                    { text: `Placas:`,alignment: 'left', style:'info' },
                    { text: `${dat['vehiculo'].placas.toUpperCase()}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' },
                    { text: `KMs:`,alignment: 'left', style:'info' },
                    { text: `123434234`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                  [ 
                    { text: `Marca:`,alignment: 'left', style:'info' },
                    { text: `${dat['vehiculo'].marca}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' },
                    { text: `Modelo:`,alignment: 'left', style:'info' },
                    { text: `${dat['vehiculo'].modelo}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                  [ 
                    { text: `Empresa:`,alignment: 'left', style:'info' },
                    { text: `${dat['cliente']['empresaShow']}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' },
                    { text: `Año:`,alignment: 'left', style:'info' },
                    { text: `${dat['vehiculo'].anio}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' } 
                  ],
                ]
              }
            }
          ],
          // [ { text: `Tel: ${dat['cliente'].telefono_movil}`, style:'info2' },  { text: `Tel: ${dat['vehiculo'].modelo}`, style:'info2' } ],
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      layout: 'noBorders',
      // layout: 'lightHorizontalLines', // optional
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '25%','25%','25%','25%'],

        body: [
          [{ text: `${da[0][1].text}`,fillColor: '#8AD3AD', color:'#1C5121',alignment: 'left', style:'info' },da[0][1],da[0][2],da[0][3]],
          [da[1][0],da[1][1],da[1][2],da[1][3]],
          [da[2][0],da[2][1],da[2][2],da[2][3]],
          [da[3][0],da[3][1],da[3][2],da[3][3]],
          [da[4][0],da[4][1],da[4][2],da[4][3]],
          [da[5][0],da[5][1],da[5][2],da[5][3]],
          [da[6][0],da[6][1],da[6][2],da[6][3]],
          [da[7][0],da[7][1],da[7][2],da[7][3]],
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },
    {
      layout: 'noBorders',
      table: {
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
        headerRows: 1,
        widths: [ '60%', '*'],

        body: [
          [ { text: `Servicios solicitados`,alignment: 'left', style:'info2' }, { text: `Autorización`,alignment: 'center', style:'info2' }],
          [ 
            table(
              dat['elementos'],
              ['tipo', 'nombre','flotilla'],
              ['15%', '65%', '20%'],
              true,
              [ {text:'Tipo', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'center'},
                {text:'Nombre', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'left'},
                {text:' ', fillColor: '#FF6969', color:'white', style:'content', alignment: 'center', alignmentChild: 'right'}
              ],
              '')
            , 
            {
              layout: 'noBorders',
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '*' ],
        
                body: [
                  [  { text: `Estoy de acuerdo con las condiciones de venta y Autorizo por la presente hacer el trabajo de reparación con el material necesario y concedo a la empresa permiso para la operación la unidad para efectos de inspección y prueba.`,alignment: 'justify', style:'info3' },  ],
                  [ { text: ` `,alignment: 'center', style:'info3' }],
                  [ { text: `Nombre y Firma.`,alignment: 'center', style:'info3' }],
                  [ { text: ` `,alignment: 'center', style:'info3' }],
                  [ {
                    image: `firmaCliente`,
                    height: 50,
                    width: 150,
                    aling: 'center',
                    valing: 'center'
                  },],
                  [ { text: ` `,alignment: 'center', style:'info3' }],
                  [ { text: `Recibió`,alignment: 'center', style:'info3' }],
                  [ { text: ` `,alignment: 'center', style:'info3' }],
                  [ { text: `____________________________`,alignment: 'center', style:'info3' }],
                  [ { text: `Los precios aquí cotizados son en M.N más I.V.A`,alignment: 'center', style:'info3' }],
                ]
              }
            }                
          ],
          [
            {
              layout: 'noBorders', // optional
              table: {
                // headers are automatically repeated if the table spans over multiple pages
                // you can declare how many rows should be treated as headers
                headerRows: 1,
                widths: [ '100%'],
        
                body: [
                  [ { text: `Total presupuesto: ${redondeado2(totalRecepcion)}`,alignment: 'right', style:'info2' } ],                      
                ]
              }
            }, 
            ///espacio necesario para la columna dos 
            ''
          ]
        ]
      }
    },
    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },

    { columns: [ { width: '100%', text: { text: `Cantidad con letra`,alignment: 'center', style:'info2' }, } ], columnGap: 10 },

    { columns: [ { width: '100%', text: { text: `${this.letrasNumeros(totalRecepcion)}`,alignment: 'center', style:'info2' }, } ], columnGap: 10 },

    { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },

    { text: `Si su ticket o factura no coinciden con este presupuesto ó el presupuesto no coincide con nuestra lista de precios favor de reportarlo al siguiente correo: quejas@speed-service.com.mx y recibira un descuento.`,alignment: 'justify', style:'terminos2' },
    
    {text: `${' '}`,alignment: 'justify', style:'terminos2' },

    { text: `${'Condiciones de venta'.toUpperCase()}`,alignment: 'justify', style:'terminos2' },
    { text: `A) Despues de 15 días de terminado el trabajo la empresa cobrara una pensión por resguardo de $150.00 pesos por dia mas I.V.A`,alignment: 'justify', style:'terminos2' },
    { text: `B) Es necesario liquidar el 100% del servicio para pdoer entregar la unidad`,alignment: 'justify', style:'terminos2' },
    { text: `C) en caso de requerir un servicio adicional el cliente será notificado antes de realizar dicho servicio`,alignment: 'justify', style:'terminos2' },
    { text: `D) la empresa no se hace responsable por artículos de valor no reportados al momento de recibir el vehículo`,alignment: 'justify', style:'terminos2' },
    // { text: `E) Cualquier diagnóstico y cotización que no sea autorizada tendra un costo minimo de $ 499.00 pesos'`,alignment: 'justify', style:'terminos' },
    ]
    let limites_ = []

    let donde = dat['conjuntos']

    documentDefinition.images = await Object({...bibliotecaVirtual})
    let i_ =0
    if (donde.length) {
     
      info.push({ columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },)
      info.push({ text: `${'Detalles en vehiculos'}`,alignment: 'center', style:'otro' })

      donde.forEach((c, index)=>{
        // console.log(c['id']);
        if (i_ >= 4 ) {
          limites_.push(index - 1)
          i_=0
        }
        // console.log(i_, `\n`);
        i_++
    })
    if (donde.length<4) {
      limites_.push(donde.length -1)
    }
    if (donde.length>4) {
      limites_.push(donde.length -1)
    }

    
    let todasLasImagenes =[]
    
    limites_.sort()
    
    limites_.forEach((a,index) => {
      let muestra = []
      if (index ===0) {
        for (let index_ = 0; index_ <= a; index_++) {
          // console.log(checados[index_]);
          let cual =''
          if (donde[index_].id) {
            cual = `${donde[index_].id.toLowerCase()}`
          }else{
            const nombre = donde[index_].nombre.split('.')
            cual = `${nombre[0].toLowerCase()}`
          }
          // console.log(cual);
          muestra.push(Object(
            {
              image: `${cual}`,
              height: 70,
              width: 120,
              aling: 'center',
              valing: 'center',
              alignment: 'center'
            }
          ))
        }
      }else{        
        for (let index_ = limites_[index -1 ]+1; index_ <=a; index_++) {
          // console.log(checados[index_]);
          let cual =''
          if (donde[index_].id) {
            cual = `${donde[index_].id.toLowerCase()}`
          }else{
            const nombre = donde[index_].nombre.split('.')
            cual = `${nombre[0].toLowerCase()}`
          }
          // console.log(cual);
          muestra.push(Object(
            {
              image: `${cual}`,
              height: 70,
              width: 120,
              aling: 'center',
              valing: 'center',
              alignment: 'center'
            }
          ))
        }
        
      }
      todasLasImagenes.push(muestra)
      // console.log(muestra);
      
    });
    
   
    todasLasImagenes.sort(function(a, b){return b.length - a.length})
    
    // console.log(todasLasImagenes);
    todasLasImagenes.map(c=>{
      if (c.length<4) {
        for (let index = c.length; index < 4; index++) {
          c.push(Object({text: `  `,bold: true, alignment: 'center', style:'info2'}))
        }
      }
    })
    info.push(Object(
      {
        layout: 'noBorders',
        table: {
          headerRows: 1,
          widths: [ '25%', '25%', '25%', '25%' ],
          body: todasLasImagenes
        }
      }
    ))
    }

    documentDefinition.content = [...info]
    

    return documentDefinition

  }
  letrasNumeros(num: number, ...args: unknown[]): unknown {
    let unidad, decena, centenas, cientos
    if (!num) {
     return `0 PESOS M.N`
    }else{
     
 
     function Unidades(num){
 
         switch(num)
         {
             case 1: return 'UN';
             case 2: return 'DOS';
             case 3: return 'TRES';
             case 4: return 'CUATRO';
             case 5: return 'CINCO';
             case 6: return 'SEIS';
             case 7: return 'SIETE';
             case 8: return 'OCHO';
             case 9: return 'NUEVE';
         }
     
         return '';
       }//Unidades()
       function Decenas(num){
   
         decena = Math.floor(num/10);
         unidad = num - (decena * 10);
     
         switch(decena)
         {
             case 1:
                 switch(unidad)
                 {
                     case 0: return 'DIEZ'
                     case 1: return 'ONCE'
                     case 2: return 'DOCE'
                     case 3: return 'TRECE'
                     case 4: return 'CATORCE'
                     case 5: return 'QUINCE'
                     default: return 'DIECI' + Unidades(unidad);
                 }
             case 2:
                 switch(unidad)
                 {
                     case 0: return 'VEINTE';
                     default: return 'VEINTI ' + Unidades(unidad);
                 }
             case 3: return DecenasY('TREINTA', unidad);
             case 4: return DecenasY('CUARENTA', unidad);
             case 5: return DecenasY('CINCUENTA', unidad);
             case 6: return DecenasY('SESENTA', unidad);
             case 7: return DecenasY('SETENTA', unidad);
             case 8: return DecenasY('OCHENTA', unidad);
             case 9: return DecenasY('NOVENTA', unidad);
             case 0: return Unidades(unidad);
         }
     }//Unidades()
     function DecenasY(strSin, numUnidades) {
       if (numUnidades > 0)
       return strSin + ' Y ' + Unidades(numUnidades)
   
       return strSin;
     }//DecenasY()
     function Centenas(num) {
       centenas = Math.floor(num / 100);
       let decenas = num - (centenas * 100);
   
       switch(centenas)
       {
           case 1:
               if (decenas > 0)
                   return 'CIENTO ' + Decenas(decenas);
               return 'CIEN';
           case 2: return 'DOSCIENTOS ' + Decenas(decenas);
           case 3: return 'TRESCIENTOS ' + Decenas(decenas);
           case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
           case 5: return 'QUINIENTOS ' + Decenas(decenas);
           case 6: return 'SEISCIENTOS ' + Decenas(decenas);
           case 7: return 'SETECIENTOS ' + Decenas(decenas);
           case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
           case 9: return 'NOVECIENTOS ' + Decenas(decenas);
       }
   
       return Decenas(decenas);
     }//Centenas()
     function Seccion(num, divisor, strSingular, strPlural) {
       cientos = Math.floor(num / divisor)
       let resto = num - (cientos * divisor)
   
       let letras = '';
   
       if (cientos > 0)
           if (cientos > 1)
               letras = Centenas(cientos) + ' ' + strPlural;
           else
               letras = strSingular;
   
       if (resto > 0)
           letras += ' ';
   
       return letras;
     }//Seccion()
     function Miles(num) {
       let divisor = 1000;
       let cientos = Math.floor(num / divisor)
       let resto = num - (cientos * divisor)
   
       let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
       let strCentenas = Centenas(resto);
   
       if(strMiles == '')
           return strCentenas;
   
       return strMiles + ' ' + strCentenas;
     }//Miles()
     function Millones(num) {
       let divisor = 1000000;
       let cientos = Math.floor(num / divisor)
       let resto = num - (cientos * divisor)
   
       let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE')
       let strMiles = Miles(resto);
   
       if(strMillones == '')
           return strMiles;
   
       return strMillones + ' ' + strMiles;
       }//Millones()
       function NumeroALetras(num) {
         var data = {
             numero: num,
             enteros: Math.floor(num),
             centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
             letrasCentavos: '',
             letrasMonedaPlural: 'PESOS M.N',//“PESOS”, 'Dólares', 'Bolívares', 'etcs'
             letrasMonedaSingular: 'PESO M.N', //“PESO”, 'Dólar', 'Bolivar', 'etc'
     
             letrasMonedaCentavoPlural: 'CENTAVOS',
             letrasMonedaCentavoSingular: 'CENTAVO'
         };
     
         if (data.centavos > 0) {
             data.letrasCentavos = 'CON ' + (function (){
                 if (data.centavos == 1)
                     return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                 else
                     return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
                 })();
         };
     
         if(data.enteros == 0)
             return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
         if (data.enteros == 1)
             return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
         else
             return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
       }//NumeroALetras()
       return NumeroALetras(num)
    }
     
   }
   
}
