import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import { PdfRecepcionService } from 'src/app/services/pdf-recepcion.service';
import SignaturePad from 'signature_pad';
@Component({
  selector: 'app-entrega-orden',
  templateUrl: './entrega-orden.component.html',
  styleUrls: ['./entrega-orden.component.css']
})
export class EntregaOrdenComponent implements OnInit,AfterViewInit {

  data = 
  {
    "infoSucursal":
    {
      "correo": "ventas_culhuacan@speed-service.com.mx",
      "direccion": "Avenida Tlahuac # 4160 Col. Santa María Tomatlan, C.P. 09870 México DF.",
      "imagen": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/trabajo%20envio%20dionicio.PNG?alt=media&token=608cf798-c28e-4a01-8ea6-987bea99baeb",
      "serie": "8PFRT119",
      "status": true,
      "sucursal": "Culhuacán",
      "telefono": "5556951051"
    },
    "infoCliente":
    {
      "apellidos": "oro",
      "correo": "mkoromini94@gmail.com",
      "correo_sec": "",
      "id": "-NEvGgxapGc_2IQyfCPQ",
      "no_cliente": "JUORCU10220009",
      "nombre": "juan roro",
      "sucursal": "-N2glF34lV3Gj0bQyEWK",
      "telefono_fijo": "",
      "telefono_movil": "3454353453",
      "tipo": "particular",
    },
    "infoVehiculo":{
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
    },
    "infoTecnico":
      {
        "correo": "juan@gmail.com",
        "img": "https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/usuarios%2Fdefault.jpg?alt=media&token=439b5875-8b06-4f37-b522-a86dc4d7954b",
        "password": "Juan12&/",
        "rol": "tecnico",
        "status": "true",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "usuario": "juna garcia nico"
    },
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
    "cliente": "-NEvGgxapGc_2IQyfCPQ",
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
    "diasSucursal": 58,
    "fechaPromesa": "23/12/2022",
    "fecha_entregado": "15/3/2023",
    "fecha_recibido": "16/1/2023",
    "hora_entregado": "11:9:20",
    "hora_recibido": "17:16:53",
    "iva": false,
    "margen": 25,
    "no_cotizacion": "CU1122GE00001",
    "no_os": "CU1222GE00001",
    "notifico": true,
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
            "descripcion": "ninguna",
            "nombre": "FRENOSSSS",
            "precio": 200,
            "subtotal": 200,
            "tipo": "MO"
          }
        ],
        "enCatalogo": true,
        "id": "-NE2pvE6CS_1mdeHFL5W",
        "marca": "Ford",
        "modelo": "F-350",
        "nombre": "x",
        "precio": 200,
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
            "descripcion": "ninguna",
            "nombre": "nueva",
            "precio": 100,
            "subtotal": 100,
            "tipo": "MO"
          },
          {
            "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
            "cantidad": 1,
            "catalogo": true,
            "descripcion": "ninguna",
            "marca": "BMW",
            "nombre": "prueba 2000 mo",
            "precio": 700,
            "subtotal": 875,
            "tipo": "refaccion"
          },
          {
            "IDreferencia": "-NE2JJZu_LtUYJXSBola",
            "cantidad": 1,
            "catalogo": true,
            "descripcion": "ninguna",
            "nombre": "nueva",
            "precio": 120,
            "subtotal": 120,
            "tipo": "MO"
          },
          {
            "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
            "cantidad": 1,
            "catalogo": true,
            "descripcion": "ninguna",
            "marca": "BMW",
            "nombre": "prueba 2000 mo",
            "precio": 700,
            "subtotal": 700,
            "tipo": "MO"
          },
          {
            "IDreferencia": "-NE78vEAujLp8QfcIAtl",
            "cantidad": 1,
            "catalogo": true,
            "descripcion": "ninguna",
            "nombre": "prueba 500",
            "precio": 800,
            "subtotal": 800,
            "tipo": "MO"
          }
        ],
        "enCatalogo": true,
        "id": "-NE430_ohL7xCijFnR3i",
        "marca": "GMC",
        "modelo": "Canyon",
        "nombre": "paquete z",
        "precio": 2595,
        "showStatus": "No aprobado",
        "status": "noAprobado",
        "tipo": "paquete"
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
            "total": 910
          }
        ],
        "enCatalogo": true,
        "id": "-NEH_O1qK7I5z8sWdOQz",
        "marca": "BMW",
        "modelo": "iX M60",
        "nombre": "paquete bmw",
        "precio": 1450,
        "showStatus": "No aprobado",
        "status": "noAprobado",
        "terminado": true,
        "tipo": "paquete"
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
        "precio": 375,
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
        "precio": 375,
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
            "total": 650
          }
        ],
        "enCatalogo": true,
        "id": "-NG386DKUmKAlxvapTIK",
        "marca": "Jeep",
        "modelo": "Wrangler",
        "nombre": "nuevo",
        "precio": 1437.5,
        "showStatus": "No aprobado",
        "status": "noAprobado",
        "terminado": true,
        "tipo": "paquete"
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
            "descripcion": "ninguna",
            "flotilla": 500,
            "marca": "ninguna",
            "nombre": "Mandk",
            "normal": 650,
            "precio": 500,
            "subtotal": 500,
            "tipo": "MO",
            "total": 650
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
            "total": 299
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
            "total": 104
          }
        ],
        "enCatalogo": true,
        "id": "-NG38XM-ZEqoNxvurYl0",
        "marca": "Jeep",
        "modelo": "Wrangler",
        "nombre": "personalizado 1",
        "precio": 1185,
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
            "total": 910
          }
        ],
        "enCatalogo": true,
        "id": "-NG38nZre8RkONgpHMEY",
        "marca": "Jeep",
        "modelo": "Wrangler",
        "nombre": "personalizado 2",
        "precio": 1500,
        "showStatus": "No aprobado",
        "status": "noAprobado",
        "terminado": true,
        "tipo": "paquete"
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
            "descripcion": "ninguna",
            "flotilla": 350,
            "marca": "ninguna",
            "nombre": "600",
            "normal": 455,
            "precio": 350,
            "subtotal": 350,
            "tipo": "MO",
            "total": 455
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
            "total": 104
          }
        ],
        "enCatalogo": true,
        "id": "-NG3sNo5jlk1a0qoBMjL",
        "marca": "Chevrolet",
        "modelo": "Equinox",
        "nombre": "paquetePruebaWEB",
        "precio": 1555,
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
        "nombre": "600",
        "precio": 1000,
        "showStatus": "Aprobado",
        "status": "aprobado",
        "terminado": true,
        "tipo": "MO"
      },
      {
        "aprobado": true,
        "cantidad": 1,
        "costo": 0,
        "descripcion": "ninguna",
        "enCatalogo": true,
        "id": "-NI8Qx6S-SUBqjhU_z2k",
        "marca": "-NFyYn5eKO2EuaZhukGs",
        "nombre": "BALATAS CERÁMICA",
        "precio": 150,
        "showStatus": "Aprobado",
        "status": "aprobado",
        "terminado": true,
        "tipo": "refaccion"
      },
      {
        "aprobado": false,
        "cantidad": 1,
        "costo": 0,
        "enCatalogo": true,
        "id": "-NFGEgUK6OVe2fEDvCgS",
        "marca": "Aston Martín",
        "nombre": "LAVAR CPO DE ACELERACION",
        "precio": 300,
        "showStatus": "No aprobado",
        "status": "noAprobado",
        "terminado": true,
        "tipo": "MO"
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
            "descripcion": "ninguna",
            "nombre": "FRENOSSSS",
            "precio": 200,
            "subtotal": 200,
            "tipo": "MO"
          }
        ],
        "enCatalogo": true,
        "id": "-NE2pvE6CS_1mdeHFL5W",
        "marca": "Ford",
        "modelo": "F-350",
        "nombre": "x",
        "precio": 200,
        "status": true,
        "tipo": "paquete"
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
            "descripcion": "ninguna",
            "nombre": "nueva",
            "precio": 100,
            "subtotal": 100,
            "tipo": "MO"
          },
          {
            "IDreferencia": "-NI8Qx6S-SUBqjhU_z2k",
            "cantidad": 1,
            "catalogo": true,
            "descripcion": "ninguna",
            "marca": "BMW",
            "nombre": "prueba 2000 mo",
            "precio": 700,
            "subtotal": 875,
            "tipo": "refaccion"
          },
          {
            "IDreferencia": "-NE2JJZu_LtUYJXSBola",
            "cantidad": 1,
            "catalogo": true,
            "descripcion": "ninguna",
            "nombre": "nueva",
            "precio": 120,
            "subtotal": 120,
            "tipo": "MO"
          },
          {
            "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
            "cantidad": 1,
            "catalogo": true,
            "descripcion": "ninguna",
            "marca": "BMW",
            "nombre": "prueba 2000 mo",
            "precio": 700,
            "subtotal": 700,
            "tipo": "MO"
          },
          {
            "IDreferencia": "-NE78vEAujLp8QfcIAtl",
            "cantidad": 1,
            "catalogo": true,
            "descripcion": "ninguna",
            "nombre": "prueba 500",
            "precio": 800,
            "subtotal": 800,
            "tipo": "MO"
          }
        ],
        "enCatalogo": true,
        "id": "-NE430_ohL7xCijFnR3i",
        "marca": "GMC",
        "modelo": "Canyon",
        "nombre": "paquete z",
        "precio": 2595,
        "status": true,
        "tipo": "paquete"
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
            "total": 910
          }
        ],
        "enCatalogo": true,
        "id": "-NEH_O1qK7I5z8sWdOQz",
        "marca": "BMW",
        "modelo": "iX M60",
        "nombre": "paquete bmw",
        "precio": 1450,
        "status": true,
        "tipo": "paquete"
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
        "precio": 375,
        "status": true,
        "tipo": "paquete"
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
        "precio": 375,
        "status": true,
        "tipo": "paquete"
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
            "total": 650
          }
        ],
        "enCatalogo": true,
        "id": "-NG386DKUmKAlxvapTIK",
        "marca": "Jeep",
        "modelo": "Wrangler",
        "nombre": "nuevo",
        "precio": 1437.5,
        "status": true,
        "tipo": "paquete"
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
            "descripcion": "ninguna",
            "flotilla": 500,
            "marca": "ninguna",
            "nombre": "Mandk",
            "normal": 650,
            "precio": 500,
            "subtotal": 500,
            "tipo": "MO",
            "total": 650
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
            "total": 299
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
            "total": 104
          }
        ],
        "enCatalogo": true,
        "id": "-NG38XM-ZEqoNxvurYl0",
        "marca": "Jeep",
        "modelo": "Wrangler",
        "nombre": "personalizado 1",
        "precio": 1185,
        "status": true,
        "tipo": "paquete"
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
            "total": 910
          }
        ],
        "enCatalogo": true,
        "id": "-NG38nZre8RkONgpHMEY",
        "marca": "Jeep",
        "modelo": "Wrangler",
        "nombre": "personalizado 2",
        "precio": 1500,
        "status": true,
        "tipo": "paquete"
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
            "descripcion": "ninguna",
            "flotilla": 350,
            "marca": "ninguna",
            "nombre": "600",
            "normal": 455,
            "precio": 350,
            "subtotal": 350,
            "tipo": "MO",
            "total": 455
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
            "total": 104
          }
        ],
        "enCatalogo": true,
        "id": "-NG3sNo5jlk1a0qoBMjL",
        "marca": "Chevrolet",
        "modelo": "Equinox",
        "nombre": "paquetePruebaWEB",
        "precio": 1555,
        "status": true,
        "tipo": "paquete"
      },
      {
        "aprobada": false,
        "aprobado": true,
        "cantidad": 2,
        "costo": 500,
        "descripcion": "ninguna",
        "enCatalogo": true,
        "id": "-NG3I_ejiuh3KiL9EdAp",
        "nombre": "600",
        "precio": 1000,
        "tipo": "MO"
      },
      {
        "aprobada": false,
        "aprobado": true,
        "cantidad": 1,
        "costo": 0,
        "descripcion": "ninguna",
        "enCatalogo": true,
        "id": "-NI8Qx6S-SUBqjhU_z2k",
        "marca": "-NFyYn5eKO2EuaZhukGs",
        "nombre": "BALATAS CERÁMICA",
        "precio": 150,
        "tipo": "refaccion"
      },
      {
        "aprobada": false,
        "aprobado": true,
        "cantidad": 1,
        "costo": 0,
        "enCatalogo": true,
        "id": "-NFGEgUK6OVe2fEDvCgS",
        "marca": "Aston Martín",
        "nombre": "LAVAR CPO DE ACELERACION",
        "precio": 300,
        "tipo": "MO"
      }
    ],
    "status": "entregado",
    "sucursal": "-N2glF34lV3Gj0bQyEWK",
    "tecnico": "-NL1hTSnVq0ImKF7kCT7",
    "vehiculo": "-NG3sHVtOK8ofWWIt_eM",
    "observaciones":"Observaciones desde los comentarios / observacines agregados al momento de la recepcion",
    "dataFacturacion":{
      "rfc":"GGhshfdgs3453",
      "factura":"infoSYS"
    }
  }
  metodospago = [
    {metodo:1, show:'Efectivo'},
    {metodo:2, show:'Cheque'},
    {metodo:3, show:'Tarjeta'},
    {metodo:4, show:'OpenPay'},
    {metodo:5, show:'Clip / mercadoPago'},
    {metodo:6, show:'Terminal BBVA'},
    {metodo:7, show:'Terminal BANAMEX'}
  ]
  FormComplementos: FormGroup


  DataFacturacion:any
  existe_data_facturacion: boolean = true
  @ViewChild('firmaDigital',{static:true}) signatureElement:any; SignaturePad:any;
  constructor(private _pdf: PdfRecepcionService, private fb: FormBuilder) { }

  ngOnInit(): void {  
    // console.log(this.data);
    this.crearFormComplemento()
  }
  ngAfterViewInit() {
    this.SignaturePad = new SignaturePad(this.signatureElement.nativeElement)
  }
  crearFormComplemento(){
    this.FormComplementos = this.fb.group({
      formaPago:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      kilometraje:['',[Validators.required,Validators.min(1),Validators.pattern("^[+]?([0-9]+([.][0-9]*)?|[.][0-9]{1,2})")]],
      facturaRemision:['remision', Validators.required],

    })
  }
  validaCampo(campo: string){
    return this.FormComplementos.get(campo).invalid && this.FormComplementos.get(campo).touched
  }
  validarTipo(){
    const valoresForm = this.FormComplementos.value
    if (valoresForm.facturaRemision === 'factura') {
      if (!this.data['dataFacturacion']) {
        this.existe_data_facturacion = false
      }else{
        this.existe_data_facturacion = true
        this.generaPdfRemision()
      }
    }else{
        this.existe_data_facturacion = true
        this.generaPdfRemision()
    }
    

  }
  generaPdfRemision(){
    const valoresForm = this.FormComplementos.value
    if (this.FormComplementos.valid) {
      const {metodo, show} = this.metodospago.find(f=>f['metodo']  === Number(valoresForm.formaPago))
      let agrega = {
        kilometraje: valoresForm.kilometraje,
        facturaRemision: valoresForm.facturaRemision,
        formaPago: show,
      }
      const ifoPdf = {...agrega, ...this.data}
      console.log(ifoPdf);

      
      
      // this._pdf.crearPdfRemision(ifoPdf).then((pdf_ans)=>{
      //   const pdfDocGenerator = pdfMake.createPdf(pdf_ans);
      //   pdfMake.createPdf(pdf_ans).open();
      // })
    }else{

    }
    
  }


}
