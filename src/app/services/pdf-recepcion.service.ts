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
            "status": "lleno",
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
    "imagenBase64": "data:image/png;base64,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",
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
  async pdf(data:any){

    // variables necesarias nivel de gasolina, (imagenes, check, etc), observaciones
    // adatos de cliente, servicios a realizar, no_os, fecha 
    const colorTextoPDF: string = '#1215F4';
    
    console.log(this.infoPDF);
    const dat = this.infoPDF
    if (!dat['cliente']['empresa']) {
      dat['cliente']['empresa'] =''
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
    let base = ''
    async function bases() {
      
      let {status} = dat['checkList'].find(c=>c['id'] === 'nivel_gasolina')
      let imagen = '', fullpath = '', base64 = null
      const dataaa = {url: '', logo:''}
      const ruta = '../../assets/combustible'
      switch (status) {
        case 'vacio':
          imagen = 'c_vacio.png'
          fullpath = `${ruta}/${imagen}`
          break;
          case '1/4':
            imagen = 'c_14.png'
            fullpath = `${ruta}/${imagen}`
            break;
          case '1/2':
            imagen = 'c_12.png'
            fullpath = `${ruta}/${imagen}`
            break;
          case '3/4':
            imagen = 'c_34.png'
            fullpath = `${ruta}/${imagen}`
            break;
          case 'lleno':
            imagen = 'c_full.png'
            fullpath = `${ruta}/${imagen}`
            break;
        default:
          break;
      }
      // console.log(fullpath);
      
      await getBase64ImageFromURL(fullpath).then((val:any)=>{
        dataaa.url = val
      })
      // assets/logoSpeedPro/Logo-Speedpro.png
      await getBase64ImageFromURL('../../assets/logoSpeedPro/Logo-Speedpro.png').then((val:any)=>{
        dataaa.logo = val
      })
      return dataaa
      // console.log(base64);
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
    const partesVehiculo=[
      'capo','paragolpes_frontal','paragolpes_posterior','techo',
      'espejo_derecho','espejo_izquierdo',
      'puerta_lateral_derecha_1',
      'puerta_lateral_derecha_2',
      'puerta_lateral_izquierda_1',
      'puerta_lateral_izquierda_2',
      'puerta_posterior',
      'paragolpes_frontal',
      'paragolpes_posterior',
      'tirador_lateral_derecha_1',
      'tirador_lateral_derecha_2',
      'tirador_lateral_izquierda_1',
      'tirador_lateral_izquierda_2',
      'tirador_posterior',
      'parabrisas','parabrisas_posterior',
      'faros_frontales', 'faros_posteriores'
    ]
    function detalles (){
      
      const checados = dat['detalles'].filter(d=>d['checado'])
      const da = {imagenes:[]}
      checados.forEach(async(c)=>{
        if (c['checado']) {
          const fullpath = `../../assets/imagenes_detalles/${c['id'].toLowerCase()}.jpg`
          await getBase64ImageFromURL(fullpath).then((val:any)=>{
            da.imagenes.push({
              image: val,
              height: 70,
              width: 190,
              aling: 'center',
              valing: 'center'
            })
          })
        }
      })
      
      return da
     
    }

    console.log(detalles().imagenes);
    


    
    function tableIMGS(data, columns?) {
      return {
          table: {
              headerRows: 1,
              body: buildTableBodyIMGS(data, columns)
          }
      };
    }
    function buildTableBodyIMGS(data, columns?) {
      var body = [];
      // body.push(columns);
      data.forEach(async function(row) {
          var dataRow = [];
          const newInf = row['id'].toLowerCase()
          const fullpath = `../../assets/imagenes_detalles/${newInf}.jpg`
          await getBase64ImageFromURL(fullpath).then((val:any)=>{
            columns.forEach(function(column) {
                row['imagen'] = {
                  image: val,
                  height: 70,
                  width: 190,
                  aling: 'center',
                  valing: 'center'
                }
                // dataRow ={...row['imagen']}
                // dataRow.push(row['id']);
                dataRow.push(row[column]);
            })
          })
          body.push(dataRow);
      });
  
      return body;
    }
    const sdgfdg = dat['detalles'].filter(d=>d['checado'])
    console.log(tableIMGS(sdgfdg,['imagen']));
    
    
   
    const documentDefinition = {
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
      content: [
        {
          layout: 'noBorders',
          table: {
            headerRows: 0,
            widths: [ '*','35%','*' ],
            body: [
              [ 
                
                {
                  image: `${(await bases()).logo}`,
                  height: 70,
                  width: 190,
                  aling: 'center',
                  valing: 'center'
                },
                { 
                  text: `${dat['sucursal'].direccion}`,bold: true, alignment: 'center', style:'content'
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
                        {text: '21/03/2023',bold: true, alignment: 'left', style:'info'},
                      ],
                      [ 
                        {text: 'No. Orden:',bold: true, alignment: 'left', style:'info'},
                        {text: 'CU2223GE000234',bold: true, alignment: 'left', style:'info'},
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
                          image: `${(await bases()).url}`,
                          height: 50,
                          width: 120,
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
                      [ {text: `${dat['observaciones']} ninguna`,bold: true, alignment: 'left', style:'info2'} ]
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
                        { text: `${dat['cliente']['empresa']}`,fillColor: '#EAE7E6', color:'#111110',alignment: 'left', style:'info2' },
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
              [ { text: `Servicios solicitados`,alignment: 'left', style:'info2' }, { text: `Autorización`,alignment: 'left', style:'info2' }],
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
                      [  { text: `Estoy de acuerdo con las condiciones de venta y Autorizo por la presente hacer el trabajo de reparación con el material necesario y concedo a la empresa permiso para la operación la unidad para efectos de inspección y prueba.`,alignment: 'justify', style:'info2' },  ],
                      [ { text: ` `,alignment: 'center', style:'info2' }],
                      [ { text: `Nombre y Firma.`,alignment: 'center', style:'info2' }],
                      [ { text: ` `,alignment: 'center', style:'info2' }],
                      [ { text: `____________________________`,alignment: 'center', style:'info2' }],
                      [ { text: ` `,alignment: 'center', style:'info2' }],
                      [ { text: `Recibió`,alignment: 'center', style:'info2' }],
                      [ { text: ` `,alignment: 'center', style:'info2' }],
                      [ { text: `____________________________`,alignment: 'center', style:'info2' }],
                      [ { text: `Los precios aquí cotizados son en M.N más I.V.A`,alignment: 'center', style:'info2' }],
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

        { text: `Si su ticket o factura no coinciden con este presupuesto ó el presupuesto no coincide con nuestra lista de precios favor de reportarlo al siguiente correo: quejas@speed-service.com.mx y recibira un descuento.`,alignment: 'justify', style:'info2' },
        
        { columns: [ { width: '100%', text: ` `, } ], columnGap: 10 },

        { text: `${'Condiciones de venta'.toUpperCase()}`,alignment: 'justify', style:'terminos' },
        { text: `A) Despues de 15 días de terminado el trabajo la empresa cobrara una pensión por resguardo de $150.00 pesos por dia mas I.V.A'`,alignment: 'justify', style:'terminos' },
        { text: `B) Es necesario liquidar el 100% del servicio para pdoer entregar la unidad'`,alignment: 'justify', style:'terminos' },
        { text: `C) en caso de requerir un servicio adicional el cliente será notificado antes de realizar dicho servicio'`,alignment: 'justify', style:'terminos' },
        { text: `D) la empresa no se hace responsable por artículos de valor no reportados al momento de recibir el vehículo'`,alignment: 'justify', style:'terminos' },
        { text: `E) Cualquier diagnóstico y cotización que no sea autorizada tendra un costo minimo de $ 499.00 pesos'`,alignment: 'justify', style:'terminos' },
        


        
      ],
      styles: {
        header: { fontSize: 14,bold: true,align: 'center'},
        info: { fontSize: 9,bold: true,align: 'center',color: colorTextoPDF},
        info2: { fontSize: 9,bold: true,align: 'center',color: 'black'},
        info3: { fontSize: 8,bold: false,align: 'center',color: 'black'},
        title: { fontSize: 9,bold: true,align: 'center'},
        sucursal: { fontSize: 10,bold: true,align: 'center'},
        operadora: { fontSize: 14,bold: true,align: 'center'},
        medium: { fontSize: 14,bold: true,color:colorTextoPDF },
        content:{fontSize:8,color: 'black'},
        normal:{fontSize:10,color: 'red'},
        normal2:{fontSize:9,color: 'red'},
        importeLetras:{fontSize:10,bold: true},
        detallesPaquetes:{fontSize:9,color: 'black'},
        terminos:{ fontSize:8},
        anotherStyle: { italics: true, align: 'center'},
        vencimiento: { italics: true, align: 'right', color: 'red', fontSize: 8}
      },
    }

    


    const checados = dat['detalles'].filter(d=>d['checado'])
      
      checados.forEach(async(c)=>{
        const contenido =documentDefinition.content
        if (c['checado']) {
          const fullpath = `../../assets/imagenes_detalles/${c['id'].toLowerCase()}.jpg`
          await getBase64ImageFromURL(fullpath).then((val:any)=>{
            
           
          })
        }
        documentDefinition.content = [...contenido,
          { columns: [ { width: '100%', text: `asdasd `, } ], columnGap: 10 },
      ]
      })
    
    
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
