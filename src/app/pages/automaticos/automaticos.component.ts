import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, update } from 'firebase/database';
import { AutomaticosService } from '../../services/automaticos.service';

import { ServiciosPublicosService } from 'src/app/services/servicios-publicos.service';
import { EncriptadoService } from '../../services/encriptado.service';

import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PdfRecepcionService } from '../../services/pdf-recepcion.service';


import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import { ClientesService } from 'src/app/services/clientes.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
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
    private _sucursales: SucursalesService, private _clientes: ClientesService, private _vehiculos: VehiculosService,
    ) {   }
  arr_sucursal = [...this._sucursales.lista_en_duro_sucursales]
  ngOnInit(): void {
    this.rol()
    this.realizaOperacionesClientes()
  }
    rol(){
        const { rol, sucursal, usuario } = this._security.usuarioRol()
    }
    realizaOperacionesClientes(){
      const paquetes =
      {
        "-NE2pvE6CS_1mdeHFL5W": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NE2JJZu_LtUYJXSBola",
              "cantidad": 1,
              "catalogo": true,
              "precio": 120,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE32XkfMPHMcMXOiOio",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE78vEAujLp8QfcIAtl",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            }
          ],
          "id": "-NE2pvE6CS_1mdeHFL5W",
          "marca": "Ford",
          "modelo": "Fiesta",
          "nombre": "SERVICIO MAYOR",
          "precio": 0,
          "status": true
        },
        "-NE430_ohL7xCijFnR3i": {
          "cilindros": "6",
          "elementos": [
            {
              "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
              "cantidad": 1,
              "catalogo": true,
              "costo": 300,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NHgI_n9nJAmuOg4EwcL",
              "cantidad": 1,
              "catalogo": true,
              "costo": 111.5,
              "precio": 111.5,
              "tipo": "refaccion"
            },
            {
              "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
              "cantidad": 1,
              "catalogo": true,
              "precio": 200,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE78vEAujLp8QfcIAtl",
              "cantidad": 1,
              "catalogo": true,
              "precio": 100,
              "tipo": "MO"
            }
          ],
          "marca": "GMC",
          "modelo": "Canyon",
          "nombre": "paquete z",
          "precio": 0,
          "status": true
        },
        "-NEH_O1qK7I5z8sWdOQz": {
          "cilindros": "6",
          "elementos": [
            {
              "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
              "cantidad": 1,
              "catalogo": true,
              "precio": 700,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
              "cantidad": 1,
              "catalogo": true,
              "precio": 500,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NGbPadXFum0ZEpqn70p",
              "cantidad": 1,
              "catalogo": true,
              "precio": 500,
              "tipo": "refaccion"
            }
          ],
          "marca": "BMW",
          "modelo": "iX M60",
          "nombre": "paquete bmw",
          "precio": 0,
          "status": false
        },
        "-NIEsB5V5ql3rxg_xyoV": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
              "cantidad": 1,
              "catalogo": false,
              "nombre": "refaccion1",
              "precio": 350,
              "tipo": "refaccion"
            }
          ],
          "factibilidad": 0,
          "id": "-NIEsB5V5ql3rxg_xyoV",
          "marca": "Volkswagen",
          "modelo": "Vento",
          "nombre": "SERVICIO MAYOR",
          "precio": 0,
          "status": false,
          "subtotal": 0,
          "total": 0
        },
        "-NIJ4C_eDdJgnc-hAlTX": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NIJ4g98MXI7Zs3d3xe6",
              "cantidad": 1,
              "catalogo": true,
              "precio": 600,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NGbPl434B_Pzb_G6vGp",
              "cantidad": 1,
              "catalogo": true,
              "precio": 780,
              "tipo": "refaccion"
            },
            {
              "IDreferencia": "-NIJ5Gl1R47GQ6g5h6nJ",
              "cantidad": 1,
              "catalogo": true,
              "precio": 357,
              "tipo": "refaccion"
            },
            {
              "IDreferencia": "-NIJ59oXarA3-kLIDfEp",
              "cantidad": 1,
              "catalogo": true,
              "precio": 6,
              "tipo": "MO"
            }
          ],
          "marca": "Bentley",
          "modelo": "Continental ",
          "nombre": "paquete jose luis",
          "precio": 0,
          "status": false
        },
        "-NIJ9UAKOX0gN2RGd2Yo": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NIDngpO-v_a3bJoKnD1",
              "cantidad": 1,
              "catalogo": true,
              "precio": 500,
              "tipo": "refaccion"
            }
          ],
          "marca": "Volkswagen",
          "modelo": "Vento",
          "nombre": "paquete desde cotizacion JL",
          "precio": 500,
          "status": false
        },
        "-NIJAtDPAk6bCrt0ZDMW": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
              "cantidad": 1,
              "catalogo": true,
              "precio": 200,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NH0wMjGCbvLeVEGOrMW",
              "cantidad": 1,
              "catalogo": true,
              "precio": 500,
              "tipo": "refaccion"
            },
            {
              "IDreferencia": "-NGbTfKvLWyoLMFNdzkv",
              "cantidad": 1,
              "catalogo": true,
              "precio": 231,
              "tipo": "MO"
            }
          ],
          "marca": "Chevrolet",
          "modelo": "Onix",
          "nombre": "nuevo pJL",
          "precio": 500,
          "status": false
        },
        "-NIYEnEkc9O2ptCQxhS0": {
          "cilindros": "4",
          "marca": "Aston Martín",
          "modelo": "DBX",
          "nombre": "aqui nuevo prueba",
          "precio": 0,
          "status": false
        },
        "-NImvn_yAhfgOwIsDCv4": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "nombre": "prueba55555",
          "status": false,
          "tipo": "paquete"
        },
        "-NIsK5qJwfzE7e3Qn582": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "nuevo paquete prueba",
          "tipo": "paquete"
        },
        "-NIsKs8_cS4oCunA4-KN": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "fghfgh",
          "tipo": "paquete"
        },
        "-NIsL2Y_uIz4HRZbp8_b": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "rfthyh",
          "tipo": "paquete"
        },
        "-NIsLk8cq9bjKOFFq3p7": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Ford",
          "modelo": "F-250",
          "nombre": "sdfsdf",
          "tipo": "paquete"
        },
        "-NIsMGkKh7spjkri21Cz": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "dsfsdfs",
          "tipo": "paquete"
        },
        "-NIsMfwPRtAXh_oPL1ww": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Jeep",
          "modelo": "Wrangler",
          "nombre": "sdfsdf",
          "tipo": "paquete"
        },
        "-NIsRgZ4mMSMpLFyD8V4": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "juanMT",
          "tipo": "paquete"
        },
        "-NIsS3g05yLBRrca5Evw": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "nuevo juan roro",
          "tipo": "paquete"
        },
        "-NIsWJZ7Pa3RrmIe-6K-": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "dgfdfgdfg",
          "tipo": "paquete"
        },
        "-NKGiBb19N8uItp19eru": {
          "cilindros": "6",
          "elementos": [
            {
              "IDreferencia": "-NKGiDgrFR-0_HedE7GP",
              "cantidad": 1,
              "catalogo": true,
              "precio": 500,
              "tipo": "MO"
            }
          ],
          "marca": "Baic",
          "modelo": "BJ20",
          "nombre": "refacciones y cosas",
          "precio": 0,
          "status": false
        },
        "-NLSGsSLRHpzYYmUK-Zx": {
          "cantidad": 1,
          "costo": 3450,
          "enCatalogo": true,
          "factibilidad": 0,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + Verificación",
          "subtotal": 0,
          "tipo": "paquete",
          "total": 0
        },
        "-NLSHT1YY3A3u6dkZ8eY": {
          "cantidad": 1,
          "costo": 350,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "limpieza y ajuste de frenos traseros",
          "tipo": "paquete"
        },
        "-NN2EpFEuj3uGs6Lg9Vy": {
          "cilindros": "4",
          "marca": "Nissan",
          "modelo": "March",
          "nombre": "SERVICIO MENOR",
          "precio": 0,
          "status": false
        },
        "-NN2Jqrc7I0QE7DprZMY": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NE2JJZu_LtUYJXSBola",
              "cantidad": 1,
              "catalogo": true,
              "precio": 120,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE32XkfMPHMcMXOiOio",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFyVgDX1Nrl63Wn5SpB",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            }
          ],
          "id": "-NN2Jqrc7I0QE7DprZMY",
          "marca": "Nissan",
          "modelo": "March",
          "nombre": "SERVICIO MENOR",
          "precio": 0,
          "status": true
        },
        "-NN2WTLa1TohlJPNlp6q": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Nissan",
          "modelo": "NP300",
          "nombre": "SERVICIO PREVENTIVO",
          "tipo": "paquete"
        },
        "-NN7HRd4-m7og8b6obQT": {
          "cilindros": "4",
          "id": "-NN7HRd4-m7og8b6obQT",
          "marca": "Fiat",
          "modelo": "Ducato",
          "nombre": "SERVICIO MAYOR DIESE",
          "precio": 0,
          "status": false
        },
        "-NN7Inuyv2UHJBeshyOf": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NN7J-otRj9wagt1cnrV",
              "cantidad": 1,
              "catalogo": true,
              "precio": 1800,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE32XkfMPHMcMXOiOio",
              "cantidad": 1,
              "catalogo": true,
              "precio": 500,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NN7GZQ-Cb2LtPBlEeGN",
              "cantidad": 1,
              "catalogo": true,
              "precio": 400,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NN7JnY78GstNucFSbJt",
              "cantidad": 1,
              "catalogo": true,
              "precio": 700,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NN7K-xTFdCJwfegFtwO",
              "cantidad": 1,
              "catalogo": true,
              "precio": 400,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NN7KB1JW7sIiNUvu_YO",
              "cantidad": 2,
              "catalogo": true,
              "precio": 600,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NN7KXIJj1WVhcyv3gp9",
              "cantidad": 1,
              "catalogo": true,
              "precio": 400,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFyVgDX1Nrl63Wn5SpB",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            }
          ],
          "marca": "Fiat",
          "modelo": "Ducato",
          "nombre": "SERVICIO MAYOR DIESE",
          "precio": 0,
          "status": true
        },
        "-NN8-FhDspJEbOqF7393": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Nissan",
          "modelo": "NP300",
          "nombre": "Servicio preventivo",
          "tipo": "paquete"
        },
        "-NN8RvgnN8UomX3miYax": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NE2JJZu_LtUYJXSBola",
              "cantidad": 1,
              "catalogo": true,
              "precio": 120,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE32XkfMPHMcMXOiOio",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE78vEAujLp8QfcIAtl",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NN8SzBCToha5F4oc-P2",
              "cantidad": 1,
              "catalogo": true,
              "precio": 400,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NN8TMy3DOqgsu4z1c93",
              "cantidad": 3,
              "catalogo": true,
              "precio": 1370,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            }
          ],
          "marca": "Chevrolet",
          "modelo": "Chevy",
          "nombre": "PAQUETE VERIFICA PRO",
          "precio": 0,
          "status": true
        },
        "-NNDTgCJi5qEt9DLdx1p": {
          "cantidad": 1,
          "costo": 0,
          "enCatalogo": true,
          "marca": "Chevrolet",
          "modelo": "Aveo",
          "nombre": "SERVICIO PREVENTIVO",
          "tipo": "paquete"
        },
        "-NOz1lA9qXH8smYC3cr3": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NE2JJZu_LtUYJXSBola",
              "cantidad": 1,
              "catalogo": true,
              "precio": 120,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE32XkfMPHMcMXOiOio",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFyVgDX1Nrl63Wn5SpB",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            }
          ],
          "marca": "Honda",
          "modelo": "Civic",
          "nombre": "SERVICIO MENOR",
          "precio": 0,
          "status": true
        },
        "-NQAu6rhbPydWSDZIevz": {
          "cilindros": "4",
          "elementos": [
            {
              "IDreferencia": "-NE2JJZu_LtUYJXSBola",
              "cantidad": 1,
              "catalogo": true,
              "precio": 120,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE32XkfMPHMcMXOiOio",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NQAt2o5KlGO7Ut58j3K",
              "cantidad": 1,
              "catalogo": true,
              "precio": 100,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE78vEAujLp8QfcIAtl",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
              "cantidad": 1,
              "catalogo": true,
              "precio": 300,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            },
            {
              "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
              "cantidad": 1,
              "catalogo": true,
              "precio": 150,
              "tipo": "MO"
            }
          ],
          "marca": "SEAT",
          "modelo": "Ibiza",
          "nombre": "AFINACION",
          "precio": 0,
          "status": true
        },
        "-NXpvKAAGvHgD31bk8oQ": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-NXpufTa9W5CBZXq5Vp6",
              "index": 0,
              "marca": "",
              "nombre": "Computadora chasis",
              "precio": 3000,
              "status": true,
              "tipo": "refaccion",
              "total": 3750
            }
          ],
          "enCatalogo": true,
          "marca": "Audi",
          "modelo": "A3",
          "nombre": "COMPUTADORA CHASIS",
          "status": true,
          "tipo": "paquete"
        },
        "-NXq3BcKzlcRXzFp46DT": {
          "cilindros": "8",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-NXpyKfCYJ5fNTd8TO5R",
              "index": 0,
              "marca": "",
              "nombre": "Cambio de cadena distribucion",
              "precio": 2500,
              "status": true,
              "tipo": "mo",
              "total": 2500
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 6400,
              "descripcion": "",
              "id": "-NXpyYexFpD1LjMYuDy4",
              "index": 1,
              "marca": "",
              "nombre": "Kit cadena distribucion",
              "precio": 6500,
              "status": true,
              "tipo": "refaccion",
              "total": 8000
            }
          ],
          "enCatalogo": true,
          "marca": "BMW",
          "modelo": "Serie 7",
          "nombre": "CAMBIO CADENA DISTRIBUCION",
          "status": true,
          "tipo": "paquete"
        },
        "-NXqHYqn1DUxYPSL8HY0": {
          "cilindros": "4",
          "enCatalogo": true,
          "marca": "Honda",
          "modelo": "Civic",
          "nombre": "CAMBIO JUNTAS DE MOTOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NXqIwcwRkg1Szsrbjjz": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-NXqI8eB8kyjlmNKADzk",
              "index": 0,
              "marca": "",
              "nombre": "Mano de obra",
              "precio": 6500,
              "status": true,
              "tipo": "mo",
              "total": 6500
            }
          ],
          "enCatalogo": true,
          "marca": "Honda",
          "modelo": "Civic",
          "nombre": "Cambio juntas de motor",
          "status": true,
          "tipo": "paquete"
        },
        "-NXqKcSDU7B4iYIGdzlV": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-NXqI8eB8kyjlmNKADzk",
              "index": 0,
              "marca": "",
              "nombre": "Mano de obra",
              "precio": 6500,
              "status": true,
              "tipo": "mo",
              "total": 6500
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-NQbJyuAvZOQ6NRf2HCW",
              "index": 1,
              "marca": "",
              "nombre": "SOPORTES DE MOTOR",
              "precio": 7450,
              "status": true,
              "tipo": "refaccion",
              "total": 9312.5
            }
          ],
          "enCatalogo": true,
          "marca": "Honda",
          "modelo": "Civic",
          "nombre": "Cambio juntas de motor",
          "status": true,
          "tipo": "paquete"
        },
        "-N_4oFIgb0RSeHpuHYYz": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 1300,
              "descripcion": "",
              "id": "-N_4mvJyu-chz3GhIrAv",
              "index": 0,
              "marca": "",
              "nombre": "Cambio de aceite y filtro",
              "precio": 900,
              "status": true,
              "tipo": "refaccion",
              "total": 1625
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 600,
              "descripcion": "ninguna",
              "id": "-NE32XkfMPHMcMXOiOio",
              "index": 1,
              "nombre": "REEMPLAZAR FILTRO DE AIRE",
              "precio": 300,
              "status": true,
              "tipo": "mo",
              "total": 600
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 350,
              "descripcion": "ninguna",
              "id": "-NE2OUuZ2lh5DhXHHeBL",
              "index": 2,
              "marca": "Ford",
              "nombre": "REV. Y CORREGIR NIVELES",
              "precio": 300,
              "status": true,
              "tipo": "mo",
              "total": 350
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 600,
              "descripcion": "",
              "id": "-NQBYCB5Eojp02pxdHdl",
              "index": 3,
              "marca": "",
              "nombre": "REVISION PUNTOS DE SEGURIDAD",
              "precio": 550,
              "status": true,
              "tipo": "mo",
              "total": 600
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 120,
              "id": "-NWoPCGvjvv_Ehi8TSwS",
              "index": 4,
              "nombre": "Revision de frenos",
              "precio": 100,
              "status": true,
              "tipo": "mo",
              "total": 120
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 180,
              "descripcion": "N",
              "id": "-NIXsduKTIhhpSrAJKS-",
              "index": 5,
              "marca": "Ford",
              "nombre": "LAVAR MOTOR",
              "precio": 150,
              "status": true,
              "tipo": "mo",
              "total": 180
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 180,
              "descripcion": "N",
              "id": "-NIXsiafAdRrmZsuD-fs",
              "index": 6,
              "marca": "Ford",
              "nombre": "LAVAR CARROCERIA",
              "precio": 150,
              "status": true,
              "tipo": "mo",
              "total": 180
            }
          ],
          "marca": "Fiat",
          "modelo": "Ducato",
          "nombre": "SERVICIO MENOR DIESEL",
          "status": true
        },
        "-N__00FKRVgZyykKEDqv": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyfLEXZJL-r5DhJTK",
              "index": 0,
              "marca": "",
              "nombre": "Amortiguadores delanteros ",
              "precio": 2250,
              "status": true,
              "tipo": "refaccion",
              "total": 5625
            },
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyxwWB9dVKsBehEts",
              "index": 1,
              "marca": "",
              "nombre": "Rotulas delanteras",
              "precio": 450,
              "status": true,
              "tipo": "refaccion",
              "total": 1125
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-N_ZzbdsHOnE8znAxR-8",
              "index": 2,
              "marca": "",
              "nombre": "Mano de obra",
              "precio": 2000,
              "status": true,
              "tipo": "mo",
              "total": 2000
            }
          ],
          "enCatalogo": true,
          "marca": "Audi",
          "modelo": "A3",
          "nombre": "amortiguadores y rotulas focus",
          "status": true,
          "tipo": "paquete"
        },
        "-N__0J_zMCSmIJ9XZJRw": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyfLEXZJL-r5DhJTK",
              "index": 0,
              "marca": "",
              "nombre": "Amortiguadores delanteros ",
              "precio": 2250,
              "status": true,
              "tipo": "refaccion",
              "total": 5625
            },
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyxwWB9dVKsBehEts",
              "index": 1,
              "marca": "",
              "nombre": "Rotulas delanteras",
              "precio": 450,
              "status": true,
              "tipo": "refaccion",
              "total": 1125
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-N_ZzbdsHOnE8znAxR-8",
              "index": 2,
              "marca": "",
              "nombre": "Mano de obra",
              "precio": 2000,
              "status": true,
              "tipo": "mo",
              "total": 2000
            }
          ],
          "enCatalogo": true,
          "marca": "Audi",
          "modelo": "A3",
          "nombre": "Amortiguadores y rotulas focus",
          "status": true,
          "tipo": "paquete"
        },
        "-N__2LhUcG-6w_uR_7V7": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyfLEXZJL-r5DhJTK",
              "index": 0,
              "marca": "",
              "nombre": "Amortiguadores delanteros ",
              "precio": 2250,
              "status": true,
              "tipo": "refaccion",
              "total": 5625
            },
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyxwWB9dVKsBehEts",
              "index": 1,
              "marca": "",
              "nombre": "Rotulas delanteras",
              "precio": 450,
              "status": true,
              "tipo": "refaccion",
              "total": 1125
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-N_ZzbdsHOnE8znAxR-8",
              "index": 2,
              "marca": "",
              "nombre": "Mano de obra",
              "precio": 2000,
              "status": true,
              "tipo": "mo",
              "total": 2000
            }
          ],
          "enCatalogo": true,
          "marca": "Audi",
          "modelo": "A3",
          "nombre": "Amortiguadores y rotulas focus",
          "status": true,
          "tipo": "paquete"
        },
        "-N__2_nEvviDC7wpXxo5": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyfLEXZJL-r5DhJTK",
              "index": 0,
              "marca": "",
              "nombre": "Amortiguadores delanteros ",
              "precio": 2250,
              "status": true,
              "tipo": "refaccion",
              "total": 5625
            },
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyxwWB9dVKsBehEts",
              "index": 1,
              "marca": "",
              "nombre": "Rotulas delanteras",
              "precio": 450,
              "status": true,
              "tipo": "refaccion",
              "total": 1125
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-N_ZzbdsHOnE8znAxR-8",
              "index": 2,
              "marca": "",
              "nombre": "Mano de obra",
              "precio": 2000,
              "status": true,
              "tipo": "mo",
              "total": 2000
            }
          ],
          "enCatalogo": true,
          "marca": "Audi",
          "modelo": "A3",
          "nombre": "Amortiguadores y rotulas focus",
          "status": true,
          "tipo": "paquete"
        },
        "-N__3LgNeXcOU4GdUtpU": {
          "cilindros": "4",
          "elementos": [
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 0,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyfLEXZJL-r5DhJTK",
              "index": 0,
              "marca": "",
              "nombre": "Amortiguadores delanteros ",
              "precio": 2250,
              "status": true,
              "tipo": "refaccion",
              "total": 5625
            },
            {
              "aprobado": true,
              "cantidad": 2,
              "costo": 700,
              "descripcion": "ford focus año 2017 sedan",
              "id": "-N_ZyxwWB9dVKsBehEts",
              "index": 1,
              "marca": "",
              "nombre": "Rotulas delanteras",
              "precio": 450,
              "status": true,
              "tipo": "refaccion",
              "total": 1750
            },
            {
              "aprobado": true,
              "cantidad": 1,
              "costo": 0,
              "descripcion": "",
              "id": "-N_ZzbdsHOnE8znAxR-8",
              "index": 2,
              "marca": "",
              "nombre": "Mano de obra",
              "precio": 2000,
              "status": true,
              "tipo": "mo",
              "total": 2000
            }
          ],
          "enCatalogo": true,
          "marca": "Audi",
          "modelo": "A3",
          "nombre": "Amortiguadores y rotulas focus",
          "status": true,
          "tipo": "paquete"
        },
        "-NaCljOBPbnLrljyOBGW": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + Verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NaCljOYJs8yAuTqAihk": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NaCqc01Fi4-3o97l1Bp": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + Verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NaCqc0Lq63dylHt9G07": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NaCrJFlywMxLD9fVPDZ": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + Verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NaCrJG43lHtx8gTVWNi": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NaCrbQ4ltfb20zWLR9N": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + Verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NaCrbQNHCHkt8nzYurX": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NaHqVwONt2UNZ48pGV0": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + Verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NaHqVwiPT31hFLxMSnj": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NaHrk_ayDQvlDtMnzAU": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + Verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NaHrk_pIW72WFOZEuq-": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NaHs8q_rfoUcm7GaK8o": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NaHs8qkod41yfgVrEpb": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NaICs6mEz_D2MvWldRE": {
          "cilindros": "",
          "elementos": [
            {
              "IDreferencia": "-NE2JJZu_LtUYJXSBola",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 120,
              "index": 0,
              "nombre": "CAMBIO DE ACEITE Y FILTRO",
              "normal": 156,
              "precio": 120,
              "subtotal": 120,
              "tipo": "MO",
              "total": 120
            },
            {
              "IDreferencia": "-NE32XkfMPHMcMXOiOio",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 300,
              "index": 1,
              "nombre": "REEMPLAZAR FILTRO DE AIRE",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 300,
              "index": 2,
              "nombre": "REV. Y CORREGIR NIVELES",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NE78vEAujLp8QfcIAtl",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 300,
              "index": 3,
              "nombre": "LAVAR INYECTORES",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "C",
              "flotilla": 300,
              "index": 4,
              "nombre": "LAVAR CPO DE ACELERACION",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 300,
              "index": 5,
              "nombre": "SCANEO POR COMPUTADORA",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 6,
              "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 7,
              "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 8,
              "nombre": "ROTACION DE LLANTAS",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 9,
              "nombre": "REGIMEN DE CARGA DE BATERIA",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 10,
              "nombre": "LAVAR MOTOR",
              "normal": 390,
              "precio": 150,
              "subtotal": 150,
              "tipo": "MO",
              "total": 150
            },
            {
              "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 11,
              "nombre": "LAVAR CARROCERIA",
              "normal": 390,
              "precio": 150,
              "subtotal": 150,
              "tipo": "MO",
              "total": 150
            }
          ],
          "enCatalogo": true,
          "marca": "Mazda",
          "modelo": "3",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NaICuJaLsvazC_yPHOc": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "Afinación + Verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NaICuJbzV5G29Ks502u": {
          "cilindros": 4,
          "enCatalogo": true,
          "marca": "Alfa Romeo",
          "modelo": "Giulia",
          "nombre": "limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NaICwqwzKJATesUtwcy": {
          "cilindros": "",
          "elementos": [
            {
              "IDreferencia": "-NE2JJZu_LtUYJXSBola",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 120,
              "index": 0,
              "nombre": "CAMBIO DE ACEITE Y FILTRO",
              "normal": 156,
              "precio": 120,
              "subtotal": 120,
              "tipo": "MO",
              "total": 120
            },
            {
              "IDreferencia": "-NE32XkfMPHMcMXOiOio",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 300,
              "index": 1,
              "nombre": "REEMPLAZAR FILTRO DE AIRE",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 300,
              "index": 2,
              "nombre": "REV. Y CORREGIR NIVELES",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NE78vEAujLp8QfcIAtl",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 300,
              "index": 3,
              "nombre": "LAVAR INYECTORES",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "C",
              "flotilla": 300,
              "index": 4,
              "nombre": "LAVAR CPO DE ACELERACION",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "flotilla": 300,
              "index": 5,
              "nombre": "SCANEO POR COMPUTADORA",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 6,
              "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 7,
              "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 8,
              "nombre": "ROTACION DE LLANTAS",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 9,
              "nombre": "REGIMEN DE CARGA DE BATERIA",
              "normal": 390,
              "precio": 300,
              "subtotal": 300,
              "tipo": "MO",
              "total": 300
            },
            {
              "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 10,
              "nombre": "LAVAR MOTOR",
              "normal": 390,
              "precio": 150,
              "subtotal": 150,
              "tipo": "MO",
              "total": 150
            },
            {
              "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "flotilla": 300,
              "index": 11,
              "nombre": "LAVAR CARROCERIA",
              "normal": 390,
              "precio": 150,
              "subtotal": 150,
              "tipo": "MO",
              "total": 150
            }
          ],
          "enCatalogo": true,
          "marca": "Mazda",
          "modelo": "3",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFbM_Ps6yMmtUBM0UB": {
          "cilindros": "6",
          "enCatalogo": true,
          "marca": "Aston Martín",
          "modelo": "DBS",
          "nombre": "Afinación + Verificación",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFbM_Ps6yMmtUBM0UC": {
          "cilindros": "6",
          "enCatalogo": true,
          "marca": "Aston Martín",
          "modelo": "DBS",
          "nombre": "limpieza y ajuste de frenos traseros",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFbXehy1ft8gN1g2CS": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFbvXqFYitq-SlMvEJ": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFd-bJV7mEBHXeY4_J": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFdrVuZO7YRayNRgMd": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFe1JN3ggBYMpPQML5": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFf5IRLoo4Joz5BjHT": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFfLFAsC8pSw5c-ryj": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFjphLT_vU3aMmnXSy": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFkGJntOYs1YYz-wLi": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFkNx-1VlLV7y2doEK": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFl0bMl4TPekstAMwt": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFlUtiopDOVUfRUg-i": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFlfS-OGRrwru8khs_": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFm8nfB2eonpoMdlsE": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFmP7VxLg87jtQpcgF": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFn5vWf7m07cKRiU5a": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFnWSLcgNtpLLoD_ye": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFntLibLSlLqO6gzBD": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFoDWhWzzWuuD6zK8m": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFokqeKBxXVNSMwPlC": {
          "cilindros": "",
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
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "SERVICIO MAYOR",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFpGX2KlVDhVmoxoMv": {
          "cilindros": "",
          "elementos": [
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE2JJZu_LtUYJXSBola",
              "index": 0,
              "nombre": "cambio de aceite y filtro",
              "precio": 120,
              "subtotal": 120,
              "tipo": "mo",
              "total": 120
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE32XkfMPHMcMXOiOio",
              "index": 1,
              "nombre": "reemplazar filtro de aire",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE2OUuZ2lh5DhXHHeBL",
              "index": 2,
              "nombre": "rev. y corregir niveles",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE78vEAujLp8QfcIAtl",
              "index": 3,
              "nombre": "lavar inyectores",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "C",
              "id": "-NFGEgUK6OVe2fEDvCgS",
              "index": 4,
              "nombre": "lavar cpo de aceleracion",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NFUnhpeX47MLHgB4zr6",
              "index": 5,
              "nombre": "scaneo por computadora",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NFyxBy74ehhZxnHrZ8Q",
              "index": 6,
              "nombre": "rev. 25 puntos de seguridad",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NIXsW7Y5RzRrbI_F9dB",
              "index": 7,
              "nombre": "cambio de focos fundidos convencionales",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NFzjXL2niDv6QlUz8hi",
              "index": 8,
              "nombre": "rotacion de llantas",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NIXsMnQWQWQsj2ChYfI",
              "index": 9,
              "nombre": "regimen de carga de bateria",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NIXsduKTIhhpSrAJKS-",
              "index": 10,
              "nombre": "lavar motor",
              "precio": 150,
              "subtotal": 150,
              "tipo": "mo",
              "total": 150
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NIXsiafAdRrmZsuD-fs",
              "index": 11,
              "nombre": "lavar carroceria",
              "precio": 150,
              "subtotal": 150,
              "tipo": "mo",
              "total": 150
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE3nrow7Ol7iyGtRzO3",
              "index": 12,
              "nombre": "reemplazar bujias",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            }
          ],
          "enCatalogo": true,
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "Servicio mayor",
          "status": true,
          "tipo": "paquete"
        },
        "-NbFq-j2Rao502rkx1v_": {
          "cilindros": "",
          "elementos": [
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE2JJZu_LtUYJXSBola",
              "index": 0,
              "nombre": "cambio de aceite y filtro",
              "precio": 120,
              "subtotal": 120,
              "tipo": "mo",
              "total": 120
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE32XkfMPHMcMXOiOio",
              "index": 1,
              "nombre": "reemplazar filtro de aire",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE2OUuZ2lh5DhXHHeBL",
              "index": 2,
              "nombre": "rev. y corregir niveles",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE78vEAujLp8QfcIAtl",
              "index": 3,
              "nombre": "lavar inyectores",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "C",
              "id": "-NFGEgUK6OVe2fEDvCgS",
              "index": 4,
              "nombre": "lavar cpo de aceleracion",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NFUnhpeX47MLHgB4zr6",
              "index": 5,
              "nombre": "scaneo por computadora",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NFyxBy74ehhZxnHrZ8Q",
              "index": 6,
              "nombre": "rev. 25 puntos de seguridad",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NIXsW7Y5RzRrbI_F9dB",
              "index": 7,
              "nombre": "cambio de focos fundidos convencionales",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NFzjXL2niDv6QlUz8hi",
              "index": 8,
              "nombre": "rotacion de llantas",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NIXsMnQWQWQsj2ChYfI",
              "index": 9,
              "nombre": "regimen de carga de bateria",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NIXsduKTIhhpSrAJKS-",
              "index": 10,
              "nombre": "lavar motor",
              "precio": 150,
              "subtotal": 150,
              "tipo": "mo",
              "total": 150
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "N",
              "id": "-NIXsiafAdRrmZsuD-fs",
              "index": 11,
              "nombre": "lavar carroceria",
              "precio": 150,
              "subtotal": 150,
              "tipo": "mo",
              "total": 150
            },
            {
              "cantidad": 1,
              "costo": 0,
              "descripcion": "ninguna",
              "id": "-NE3nrow7Ol7iyGtRzO3",
              "index": 12,
              "nombre": "reemplazar bujias",
              "precio": 300,
              "subtotal": 300,
              "tipo": "mo",
              "total": 300
            }
          ],
          "enCatalogo": true,
          "marca": "Ford",
          "modelo": "Edge",
          "nombre": "Servicio mayor",
          "status": true,
          "tipo": "paquete"
        }
      }

      const nuevos_p = this._publicos.crearArreglo2(paquetes)
      // const nueva = nuevos_p.map(p=>{
      //   const {elementos} = p
      //   // console.log(p);
        
      //   // p.elementos = this.purifica_informacion_interna({elementos: ele})
      //   return p
      // })
      // console.log(nueva);

      const filtrados = nuevos_p.filter((element) => {

        const {elementos}= element

        let lsdgfk:any[]= (elementos) ? elementos : []
        return lsdgfk.length > 0;

      });

      let nuevos_pa= {}
      const purificado = filtrados.filter((element, index)=>{
        const {elementos, id, nombre}= element
        // const ele

        let lsdgfk:any[]= (elementos) ? elementos : []
        const nuevos_elementos = this.purifica_informacion_interna(lsdgfk)
        element.elementos = nuevos_elementos
        element.nombre = String(nombre).toLowerCase()

        if (index > 12) {
          nuevos_pa[id] = element
        }
        return index > 12
      })

      console.log(nuevos_pa);
      

      // console.log(nuevos_p.length);
      // console.log(filtrados);
      console.log(purificado);
      console.log(this._publicos.crearArreglo2(nuevos_pa));
      
      
    }

    mano_refaccion({costo, precio, cantidad}){
      const mul = (costo > 0 ) ? costo : precio
      return cantidad * mul
    }
    total_paquete({elementos}){
      const reporte = {mo:0, refacciones:0}
      const nuevos_elementos = [...elementos] 
  
      if (!nuevos_elementos.length) return {reporte, nuevos_elementos}
  
      nuevos_elementos.map((ele, index)=>{
        ele.index = index
        const {tipo} = ele
        const donde = (tipo === 'refaccion') ? 'refacciones' : 'mo'
        const operacion = this.mano_refaccion(ele)
        reporte[donde] += operacion
        ele.total = operacion
        return ele
      })
      return {reporte, nuevos_elementos}
    }
    purifica_informacion_interna(elementos:any[]){
      const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status','tipo']
      const campos_refaccion = [ ...campos_mo, 'marca']
  
      const nuevos_elementos = elementos.map(e=>{
        const {tipo} = e
        e.nombre = String(e.nombre).toLowerCase()
        switch (tipo) {
          case 'mo':
          case 'MO':
            e.tipo = String(tipo).toLowerCase()
            return this._publicos.nuevaRecuperacionData(e,campos_mo)
          case 'refaccion':
            return this._publicos.nuevaRecuperacionData(e,campos_refaccion)
        }
      })
  
      return nuevos_elementos 
  
    }
   
  
    
}