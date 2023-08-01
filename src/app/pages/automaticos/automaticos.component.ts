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

import {BD} from './ayuda';

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
    // this.realizaOperacionesClientes()
  }
    rol(){
        const { rol, sucursal, usuario } = this._security.usuarioRol()
    }
    realizaOperacionesClientes(){
   
    const array_placas = []
    
    const campos_recupera = [ 'apellidos','correo','correo_sec','id','no_cliente','nombre','sucursal','telefono_fijo','telefono_movil','tipo' ]
    const campos_vehiculos = ['anio','categoria','cilindros','cliente','color','engomado','id','marca','marcaMotor','modelo','no_motor','placas','status','transmision','vinChasis' ]

    function eliminarElementosRepetidos(arr: any[]): any[] {
      return arr.filter((item, index, self) => {
        return self.indexOf(item) === index;
      });
    }
    function limpiarArreglo(arr: any[]): any[] {
      return arr.filter((element) => element !== undefined && element !== null && element !== "");
    }


    const {clientes, vehiculos, cotizacionesRealizadas, recepciones} = BD



    const arreglo_recepciones = [
      {
          "cliente": "-NMidpyPu8Cb9fVvE9GM",
          "diasSucursal": 179,
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
          "status": "recibido",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "vehiculo": "-NMie2O5PRwxM35NK4Y6",
          "id": "-NMioOmlm-7dX6y1aI9J"
      },
      {
          "cliente": "-NG2LstV0NhaJkHH6ro-",
          "diasSucursal": 123,
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
          "status": "entregado",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NG2MESh7vZpmKP_Rpso",
          "id": "-NRFjRowgFS_D7porrDF"
      },
      {
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
          "cliente": "-NLRhhoHEmZzs36LQyO-",
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
          "diasSucursal": 195,
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
          "status": "recibido",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NLRhx7nvvrQjTtMDudv",
          "id": "-NLRjhBpGQ8M3tJTpA4I"
      },
      {
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
          "cliente": "-NLS512d_ACSLeFE5r02",
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
          "diasSucursal": 195,
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
          "status": "recibido",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NLS5GEDMnA0gVmS8iob",
          "id": "-NLS7TphRB86LSfRilno"
      },
      {
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
          "cliente": "-NLSJqiLdov_8LgUbzmJ",
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
          "diasSucursal": 195,
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
          "status": "terminado",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "tecnico": "-NL1hTSnVq0ImKF7kCT7",
          "vehiculo": "-NLSJwWeFEuZSI9jaHnB",
          "id": "-NLSLVcG9jyrF_8ZtnYt"
      },
      {
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
          "cliente": "-NLcE0c8GTpe9BHqzCl9",
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
          "diasSucursal": 193,
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
          "status": "recibido",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NLcHUz59SzQ6-NZhs0f",
          "id": "-NLcHvqQSAXltoOQvN4O"
      },
      {
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
          "cliente": "-NMVmWPPwsDkW64EvmLQ",
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
          "status": "terminado",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "tecnico": "-NL1hTSnVq0ImKF7kCT7",
          "vehiculo": "-NMVmoTpk_8R3NpybQlB",
          "id": "-NMVoXy552eDpoZLtLmf"
      },
      {
          "cliente": "-NQgAgmAXe7P7GVPeHtw",
          "diasSucursal": 130,
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
                  "id": "-NE2pvE6CS_1mdeHFL5W",
                  "marca": "Ford",
                  "modelo": "Fiesta",
                  "nombre": "SERVICIO MAYOR",
                  "precio": 3420,
                  "showStatus": "Aprobado",
                  "status": "aprobado",
                  "subtotal": "",
                  "tipo": "paquete",
                  "total": 3200
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
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NQgB6OV3TgsdvV1NPNL",
          "id": "-NQgGARQXmplGMfE9hXV"
      },
      {
          "cliente": "-NQgAgmAXe7P7GVPeHtw",
          "diasSucursal": 130,
          "fechaPromesa": "16/3/2023",
          "fecha_recibido": "16/3/2023",
          "formaPago": 1,
          "hora_recibido": "15:19:6",
          "iva": true,
          "margen": 25,
          "no_os": "CU0323GE00018",
          "servicio": 1,
          "servicios": [
              {
                  "aprobado": true,
                  "cantidad": 2,
                  "cilindros": "4",
                  "costo": 3200,
                  "elementos": [
                      {
                          "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                          "cantidad": 1,
                          "catalogo": true,
                          "costo": 0,
                          "descripcion": "ninguna",
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
                          "nombre": "REEMPLAZAR BUJIAS",
                          "precio": 300,
                          "tipo": "MO",
                          "total": 300
                      }
                  ],
                  "enCatalogo": true,
                  "marca": "Ford",
                  "modelo": "Fiesta",
                  "nombre": "SERVICIO MAYOR",
                  "tipo": "paquete",
              }
          ],
          "status": "terminado",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "vehiculo": "-NQgB6OV3TgsdvV1NPNL",
          "id": "-NQgHasoi4hOw2wdQ1eB"
      },
      {
          "cliente": "-NN8zq1K2QnBp7RIwtq2",
          "diasSucursal": 174,
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
          "status": "recibido",
          "sucursal": "-N2glf8hot49dUJYj5WP",
          "vehiculo": "-NN9-8J4Jlhwv-uAd9WR",
          "id": "-NN90yY-R5V5T-2N6SDN"
      }
    ]


    const campos_mo = ['aprobado','cantidad','costo','descripcion','enCatalogo','id','nombre','precio','status"','subtotal','tipo','total']
    const campos_refaccion = [ ...campos_mo, 'marca']
    const campos_paquete = [ 'aprobado', 'cantidad', 'cilindros', 'costo', 'elementos', 'enCatalogo', 'id', 'marca', 'modelo', 'nombre', 'status', 'tipo' ]
    const save__ = ['cliente','diasSucursal','fecha_promesa','fecha_recibido','formaPago','id','iva','margen','no_os','servicio','servicios','status','sucursal','vehiculo' ]

    const updates = {}
    console.log(arreglo_recepciones.length);
    
    Object.entries(arreglo_recepciones).forEach(([key, entri])=>{

        // console.log(key);
        
        let entrie_:any = {...entri}
        const {servicios, margen, fechaPromesa, fecha_recibido, hora_recibido} = entrie_
    
        const fecha_recibido_ = this._publicos.convertirFecha(fecha_recibido)
        const fecha_promesa_ = this._publicos.convertirFecha(fechaPromesa)
        const _fecha_recibido = this._publicos.retorna_fechas_hora({fechaString: fecha_recibido_.toString(), hora_recibida: hora_recibido}).toString
        const _fecha_promesa = this._publicos.retorna_fechas_hora({fechaString: fecha_promesa_.toString(), hora_recibida: hora_recibido}).toString
       
        let n_margen =  (margen >=25)  ? margen : 25
        // const {ocupados, reporte} = this._publicos.realizarOperaciones_2(objetto_prueba)
        // console.log({ocupados, reporte});
        
        const servicios_trabaja = [...servicios] || []
    
        let nuevos_servicios_reemplzar = []
        
        servicios_trabaja.forEach(element => {
            const {tipo} = element
            
            let new_data
            switch (tipo) {
              case 'MO':
              case 'mo':
                new_data = this.operaciones_mo_refaccion({...element, margen: n_margen})
                nuevos_servicios_reemplzar.push(this._publicos.nuevaRecuperacionData(new_data, campos_mo))
              break;
              case 'refaccion':
                new_data = this.operaciones_mo_refaccion({...element, margen: n_margen})
                nuevos_servicios_reemplzar.push(this._publicos.nuevaRecuperacionData(new_data, campos_refaccion))
              break;
              case 'paquete':
                const nueva = this._publicos.nuevaRecuperacionData({...element}, campos_paquete)
                const info_paquete = this.operaciones_paquete({nueva,campos_mo, campos_refaccion, margen: n_margen})
                info_paquete.reporte = this.reporte_paquete(info_paquete)
                nuevos_servicios_reemplzar.push(info_paquete)
              break;
            }
        });

        entrie_.servicios = [...nuevos_servicios_reemplzar]
        entrie_.fecha_recibido = _fecha_recibido
        entrie_.fecha_promesa = _fecha_promesa

        let save_:any = this._publicos.nuevaRecuperacionData(entrie_, save__)
        const nnn = {...save_}
        const {sucursal, cliente, id} = nnn

        save_.reporte = this.reporte_general(save_)

        updates[`recepciones/${sucursal}/${cliente}/${id}`] = save_
        })
       
        // console.log(updates);
        // update(ref(db), updates).then(()=>{
        //     console.log('finalizo');
        //   })
        //   .catch(err=>{
        //     console.log(err);
        //   })

    }
    operaciones_mo_refaccion(data){
    const {cantidad , precio, tipo, costo, margen , nombre} = data
    const new_ = (costo> 0) ? costo : precio
    switch (tipo) {
      case 'MO':
      case 'mo':
        data.total = cantidad * new_
        data.subtotal = cantidad * new_
        break;
        case 'refaccion':
            const can = cantidad * new_
            data.subtotal = can
            data.total = can * (1 + (margen / 100))
        break;
    }
    data.tipo = String(tipo).toLowerCase()
    data.nombre = String(nombre).toLowerCase()
    delete data.margen
    return data
    }
    operaciones_paquete(data){
        const {nueva,campos_mo, campos_refaccion, margen} = data
        let data_ = {...nueva}
        const {nombre, cantidad, elementos, id} = data_
    
        const elementos_ = (elementos) ?  [...elementos] : []
        data_.elementos = elementos_.map(element=>{
            let nuevo_elemento = {...element}
            const {tipo, aprobado} = nuevo_elemento
            if (typeof aprobado !== 'boolean') {
                nuevo_elemento.aprobado = true
            }
            nuevo_elemento.id = nuevo_elemento.IDreferencia
            const nueva_data = this._publicos.nuevaRecuperacionData(nuevo_elemento, (tipo ==='refaccion') ? campos_refaccion :campos_mo)
            nueva_data.margen = margen
            let kkk = this.operaciones_mo_refaccion(nueva_data)
            return kkk
        })
        data_.nombre = String(nombre).toLowerCase()
        return data_
    }
    reporte_paquete(data){
        const {elementos, cantidad} = data
        const elementos_ = [...elementos] || []
        const reporte = {mo:0, refacciones:0, refacciones_v:0, sobrescrito_mo:0, sobrescrito_refacciones:0,precio:0, ub:0}
        elementos_.map(element=>{
            const {tipo, costo, precio, aprobado, total, cantidad } = element
            if (aprobado) {
                let mul
                switch (tipo) {
                    case 'MO':
                    case 'mo':
                        reporte.mo +=  total 
                        if (costo>0 ) {
                            reporte.sobrescrito_mo += total
                        }
                    break;
                    case 'refaccion':
                        reporte.refacciones +=  precio
                        reporte.refacciones_v +=  total
                        if (costo>0 ) { reporte.sobrescrito_refacciones += total }
                    break;
                }
            }
        })
        const {mo, refacciones_v } = reporte
        const operacion = mo + refacciones_v
        reporte.precio = operacion * cantidad
        reporte.ub = 100 - ((refacciones_v * 100) / operacion)
        return reporte
    }
    reporte_general(data){
        const {servicios} = data
        const elementos_ = [...servicios] || []
        const reporte = {mo:0, refacciones:0, refacciones_v:0, sobrescrito_mo:0, sobrescrito_refacciones:0,precio:0, ub:0, paquetes:0, paquetes_sobresrito:0}
        elementos_.map(element=>{
            const {tipo, costo, precio, aprobado, total, cantidad } = element
            if (aprobado) {
                let mul
                switch (tipo) {
                    case 'MO':
                    case 'mo':
                        reporte.mo +=  total 
                        if (costo>0 ) {
                            reporte.sobrescrito_mo += total
                        }
                    break;
                    case 'refaccion':
                        reporte.refacciones +=  precio
                        reporte.refacciones_v +=  total
                        if (costo>0 ) { reporte.sobrescrito_refacciones += total }
                    break;
                    case 'paquete':
                        const { reporte:reporte_interno } = element
                        reporte.paquetes += reporte_interno.precio
                        if (costo>0 ) { reporte.paquetes_sobresrito += reporte_interno.precio }
                        const ca = [
                            'mo',
                            'precio',
                            'refacciones',
                            'refacciones_v',
                            'sobrescrito_mo',
                            'sobrescrito_refacciones',
                        ]
                        
                        ca.forEach(c=>{
                            reporte[c] +=  reporte_interno[c]
                        })
    
                    break;
                }
            }
        })
        const {mo,  refacciones_v, paquetes} = reporte
        const precio__ = mo + refacciones_v + paquetes
        reporte.precio = precio__
        reporte.ub = 100 - ((refacciones_v * 100) / precio__ )
        return reporte
    }
  
    
}