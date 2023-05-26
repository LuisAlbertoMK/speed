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
    private _sucursales: SucursalesService
    ) { }

  ngOnInit(): void {
    this.rol()
    // this.realizaOperacionesClientes()
  }
  rol(){
    
  }
  realizaOperacionesClientes(){
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
    const clientes = {
      "-NDYEOxIEpNUoPvmJ3Ar": {
        "apellidos": "nuevo a",
        "correo": "mkkaos28@gmail.com",
        "correo_sec": "",
        "id": "-NDYEOxIEpNUoPvmJ3Ar",
        "no_cliente": "TOORTO10220004",
        "nombre": "Tomasa",
        "status": true,
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5523232222",
        "tipo": "particular",
        "vehiculos": {
          "-NFJxN8zPCr2PWOROnVU": {
            "anio": "2021",
            "categoria": "SUV lujo",
            "cilindros": "8",
            "cliente": "-NDYEOxIEpNUoPvmJ3Ar",
            "color": "Rojo intenso",
            "engomado": "Rojo",
            "id": "-NFJxN8zPCr2PWOROnVU",
            "marca": "Buick",
            "marcaMotor": "",
            "modelo": "Envision",
            "no_motor": "",
            "placas": "kkk5658",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NM_xNTgeIF22Rj7Y-_s": {
            "anio": "2011",
            "categoria": "Coupé lujo",
            "cilindros": "4",
            "cliente": "-NDYEOxIEpNUoPvmJ3Ar",
            "color": "Blanco",
            "engomado": "Rojo",
            "id": "-NM_xNTgeIF22Rj7Y-_s",
            "marca": "Bentley",
            "marcaMotor": "hemi ",
            "modelo": "Continental ",
            "no_motor": "fhkjw26566",
            "placas": "1234ABC",
            "transmision": "Estandar",
            "vinChasis": "rfer"
          },
          "-NU--AffZE3X0boxL5dW": {
            "anio": "2018",
            "categoria": "SUV lujo",
            "cilindros": "6",
            "cliente": "-NDYEOxIEpNUoPvmJ3Ar",
            "color": "Marrón profundo",
            "engomado": "verde",
            "id": "-NU--AffZE3X0boxL5dW",
            "marca": "Acura",
            "modelo": "Acura MDX",
            "placas": "789DRFT"
          },
          "-NU2NzTO5pyjGW3m9cBg": {
            "anio": "2016",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NDYEOxIEpNUoPvmJ3Ar",
            "color": "Azul medio y rojo cenizo",
            "engomado": "amarillo",
            "id": "-NU2NzTO5pyjGW3m9cBg",
            "marca": "Alfa Romeo",
            "modelo": "Giulietta",
            "placas": "kkk5655"
          },
          "-NU2O5ZErcxvMyER-LbU": {
            "anio": "2013",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NDYEOxIEpNUoPvmJ3Ar",
            "color": "Azul claro",
            "engomado": "amarillo",
            "id": "-NU2O5ZErcxvMyER-LbU",
            "marca": "Alfa Romeo",
            "modelo": "Mito",
            "placas": "lfg5645",
            "transmision": "Estandar"
          },
          "-NU2OLFP8CVKNo3MX29J": {
            "anio": "2019",
            "categoria": "Coupé lujo",
            "cilindros": "4",
            "cliente": "-NDYEOxIEpNUoPvmJ3Ar",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NU2OLFP8CVKNo3MX29J",
            "marca": "Alfa Romeo",
            "modelo": "Stelvio",
            "placas": "ggttt77"
          },
          "-NU2OdJM7HCkEuH5yaMY": {
            "anio": "2022",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NDYEOxIEpNUoPvmJ3Ar",
            "color": "Rojo intenso",
            "engomado": "amarillo",
            "id": "-NU2OdJM7HCkEuH5yaMY",
            "marca": "Aston Martín",
            "modelo": "DBX",
            "placas": "665dfgd"
          },
          "-NWKDaXHZq8WZbQ0qP04": {
            "anio": "2021",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NDYEOxIEpNUoPvmJ3Ar",
            "color": "Azul medio y rojo cenizo",
            "engomado": "rojo",
            "id": "-NWKDaXHZq8WZbQ0qP04",
            "marca": "Aston Martín",
            "marcaMotor": "",
            "modelo": "DBX",
            "no_motor": "",
            "placas": "kkk4444",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NE31rH-xDj6Jv5hM7Jp": {
        "apellidos": "reyes reyes",
        "correo": "desarrollospeed03@gmail.com",
        "correo_sec": "nuevo1@gmail.com",
        "id": "",
        "no_cliente": "TORETO10220006",
        "nombre": "Tomasag",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "7555555555",
        "tipo": "particular"
      },
      "-NE75_8dBR-W6wtGcfIH": {
        "apellidos": "Garcia suarez",
        "correo": "luis2016oro@gmail.com",
        "id": "-NE75_8dBR-W6wtGcfIH",
        "no_cliente": "MEGATO10220006",
        "nombre": "mercedes",
        "status": true,
        "sucursal": "-N2glf8hot49dUJYj5WP",
        "telefono_movil": "5523232222",
        "tipo": "particular",
        "vehiculos": {
          "-NE79a-u2gsf9_arjvoo": {
            "anio": "2020",
            "categoria": "Coupé",
            "cilindros": "6",
            "cliente": "-NE75_8dBR-W6wtGcfIH",
            "color": "Naranja",
            "engomado": "Verde",
            "id": "-NE79a-u2gsf9_arjvoo",
            "marca": "Ferrari",
            "marcaMotor": "",
            "modelo": "F8 ",
            "no_motor": "",
            "placas": "KYT2121",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NEBkMZqYbcHR5192YG9": {
            "anio": "2019",
            "categoria": "Coupé",
            "cilindros": "6",
            "cliente": "-NE75_8dBR-W6wtGcfIH",
            "color": "Marrón profundo",
            "engomado": "Verde",
            "id": "-NEBkMZqYbcHR5192YG9",
            "marca": "GMC",
            "marcaMotor": "",
            "modelo": "Canyon",
            "no_motor": "",
            "placas": "KYT2122",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NEq3zGb1-vX1DcknuYA": {
        "apellidos": "oro",
        "correo": "luis2020zoro@gmail.com",
        "id": "-NEq3zGb1-vX1DcknuYA",
        "no_cliente": "LUORCO10220008",
        "nombre": "luuis",
        "sucursal": "-N2glf8hot49dUJYj5WP",
        "telefono_movil": "7248154545",
        "tipo": "particular",
        "vehiculos": {
          "-NEq47D0vpeMCjsdl5o6": {
            "anio": "2014",
            "categoria": "Camioneta de lujo",
            "cilindros": "6",
            "cliente": "-NEq3zGb1-vX1DcknuYA",
            "color": "Violeta profundo",
            "engomado": "Amarillo",
            "id": "-NEq47D0vpeMCjsdl5o6",
            "marca": "Alfa Romeo",
            "marcaMotor": "",
            "modelo": "Giulietta",
            "no_motor": "",
            "placas": "HFG4565",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NEvGgxapGc_2IQyfCPQ": {
        "apellidos": "oro",
        "correo": "mkoromini94@gmail.com",
        "correo_sec": "",
        "dataFacturacion": {
          "unica": {
            "razon": "Nueva empresa",
            "rfc": "OOLL940915MF5"
          }
        },
        "id": "-NEvGgxapGc_2IQyfCPQ",
        "no_cliente": "JUORCU10220009",
        "nombre": "juan rorod",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "3454353453",
        "tipo": "particular",
        "vehiculos": {
          "-NEvGy6_-VqzuNUGPfcs": {
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
          },
          "-NG3sHVtOK8ofWWIt_eM": {
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
          "-NIrdf_SvLYNlrBWRBFQ": {
            "anio": "2017",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NEvGgxapGc_2IQyfCPQ",
            "color": "Rojo intenso",
            "engomado": "azul",
            "id": "-NIrdf_SvLYNlrBWRBFQ",
            "marca": "Alfa Romeo",
            "marcaMotor": "",
            "modelo": "Giulia",
            "no_motor": "",
            "placas": "MGT9999",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NKKmjYiwZsLszCdAb3r": {
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
          },
          "-NUwqOJcOhmgaYHL-Ja7": {
            "anio": "2019",
            "categoria": "Coupé lujo",
            "cilindros": "4",
            "cliente": "-NEvGgxapGc_2IQyfCPQ",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NUwqOJcOhmgaYHL-Ja7",
            "marca": "Alfa Romeo",
            "modelo": "Stelvio",
            "placas": "jj67676"
          }
        }
      },
      "-NEvKXhoNvvx0TcHnDkZ": {
        "apellidos": "moctezuma",
        "correo": "ventas_admin@gmintegraciones.com",
        "id": "-NEvKXhoNvvx0TcHnDkZ",
        "no_cliente": "LAMOTO10220010",
        "nombre": "laura ",
        "status": true,
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "4564564645",
        "tipo": "particular",
        "vehiculos": {
          "-NEvKbMFVN9-fmmc6e1F": {
            "anio": "2017",
            "categoria": "Camioneta de lujo",
            "cilindros": "6",
            "cliente": "-NEvKXhoNvvx0TcHnDkZ",
            "color": "Blanco",
            "engomado": "Rosa",
            "id": "-NEvKbMFVN9-fmmc6e1F",
            "marca": "Acura",
            "marcaMotor": "",
            "modelo": "Acura MDX",
            "no_motor": "",
            "placas": "LAU5678",
            "status": true,
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NEvOREdSxX4vBkd9asE": {
        "apellidos": "Vargas",
        "correo": "isa.vargas@speed-service.com.mx",
        "empresa": "Speed",
        "id": "-NEvOREdSxX4vBkd9asE",
        "no_cliente": "ISVATO10220011",
        "nombre": "Isabel",
        "status": true,
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "8745674567",
        "tipo": "flotilla",
        "vehiculos": {
          "-NEvOVgTCJm2JwL0pd6-": {
            "anio": "2017",
            "categoria": "Coupé de lujo",
            "cilindros": "6",
            "cliente": "-NEvOREdSxX4vBkd9asE",
            "color": "Violeta profundo",
            "engomado": "Amarillo",
            "id": "-NEvOVgTCJm2JwL0pd6-",
            "marca": "BMW",
            "marcaMotor": "",
            "modelo": "Serie 7",
            "no_motor": "",
            "placas": "ISA4565",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NFJsw0wrS0evs5u0cdp": {
        "apellidos": "perez garcia",
        "correo": "luis2020oromk@gmail.com",
        "id": "-NFJsw0wrS0evs5u0cdp",
        "no_cliente": "JUPECI10220014",
        "nombre": "juanb",
        "status": true,
        "sucursal": "-N2glQ18dLQuzwOv3Qe3",
        "telefono_fijo": "8745674567",
        "telefono_movil": "8745674567",
        "tipo": "particular",
        "vehiculos": {
          "-NFJt-pdJz0uvecCssi5": {
            "anio": "2015",
            "categoria": "Sedán",
            "cilindros": "6",
            "cliente": "-NFJsw0wrS0evs5u0cdp",
            "color": "Naranja",
            "engomado": "Rojo",
            "id": "-NFJt-pdJz0uvecCssi5",
            "marca": "GMC",
            "marcaMotor": "",
            "modelo": "Envoy",
            "no_motor": "",
            "placas": "MJ34534",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NFVB-LASl4wBCkOcmmu": {
        "apellidos": "Prueba28 Oct",
        "correo": "gabriel_guadarrama@hotmail.com",
        "correo_sec": "",
        "id": "-NFVB-LASl4wBCkOcmmu",
        "no_cliente": "GAPRPO10220017",
        "nombre": "Gabriel ",
        "status": true,
        "sucursal": "-N2gkVg1RtSLxK3rTMYc",
        "telefono_movil": "5555555555",
        "tipo": "particular",
        "vehiculos": {
          "-NFVDsVZbEpOgJWCsRme": {
            "anio": "2019",
            "categoria": "Sedán de lujo",
            "cilindros": "6",
            "cliente": "-NFVB-LASl4wBCkOcmmu",
            "color": "Azul oscuro",
            "engomado": "Rojo",
            "id": "-NFVDsVZbEpOgJWCsRme",
            "marca": "BMW",
            "marcaMotor": "",
            "modelo": "X3",
            "no_motor": "",
            "placas": "pdl6944",
            "status": true,
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NFp1szdczrEHN9dLSrn": {
        "apellidos": "chavez rios",
        "correo": "inmobiliarias@arrendify.com",
        "id": "-NFp1szdczrEHN9dLSrn",
        "no_cliente": "MICHCU11220017",
        "nombre": "miriam",
        "status": true,
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "7555555555",
        "tipo": "particular",
        "vehiculos": {
          "-NFp2TuVQFCNzQ4R4Kkq": {
            "anio": "2022",
            "categoria": "Sedán de lujo",
            "cilindros": "6",
            "cliente": "-NFp1szdczrEHN9dLSrn",
            "color": "Rojo intenso",
            "engomado": "Amarillo",
            "id": "-NFp2TuVQFCNzQ4R4Kkq",
            "marca": "Bentley",
            "marcaMotor": "",
            "modelo": "Continental ",
            "no_motor": "",
            "placas": "tvg656",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NUx9P_TP90KVIpYzy9w": {
            "anio": "2013",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NFp1szdczrEHN9dLSrn",
            "color": "Rojo intenso",
            "engomado": "rosa",
            "id": "-NUx9P_TP90KVIpYzy9w",
            "marca": "Alfa Romeo",
            "modelo": "Mito",
            "placas": "JJg6767"
          }
        }
      },
      "-NFpNAD1H6u7Ak-4cDX-": {
        "apellidos": "pruebva",
        "correo": "Luis2020oro@gmail.com",
        "id": "-NFpNAD1H6u7Ak-4cDX-",
        "no_cliente": "PRPRCU11220017",
        "nombre": "prueba 45",
        "status": true,
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "3445345345",
        "tipo": "particular",
        "vehiculos": {
          "-NGTbKqBZRF0OLVuPMJY": {
            "anio": "1991",
            "categoria": "PickUp",
            "cilindros": "6",
            "cliente": "-NFpNAD1H6u7Ak-4cDX-",
            "color": "Bitono",
            "engomado": "Rosa",
            "id": "-NGTbKqBZRF0OLVuPMJY",
            "marca": "Ford",
            "marcaMotor": "",
            "modelo": "F-150",
            "no_motor": "",
            "placas": "568ghjd",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NG2LstV0NhaJkHH6ro-": {
        "apellidos": "GUADA",
        "correo": "genaro_guadarrama@outlook.com",
        "empresa": "-NN2jwMbzzh7vi173YNE",
        "id": "-NG2LstV0NhaJkHH6ro-",
        "no_cliente": "GEGUCU11220013",
        "nombre": "GENARO GUADAAAAA",
        "status": true,
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5512254265",
        "tipo": "flotilla",
        "vehiculos": {
          "-NG2MESh7vZpmKP_Rpso": {
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
        }
      },
      "-NG2OFF3PawaJ32u9cXt": {
        "apellidos": "Duagarrama",
        "correo": "tecnogerzon@hotmail.com",
        "correo_sec": "",
        "id": "",
        "no_cliente": "EGDUCU11220005",
        "nombre": "Egnaro",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5512254265",
        "tipo": "particular",
        "vehiculos": {
          "-NG2OP73hd6_qRDJSqAS": {
            "anio": "2022",
            "categoria": "Sedán de lujo",
            "cilindros": "8",
            "cliente": "-NG2OFF3PawaJ32u9cXt",
            "color": "Azul medio y rojo cenizo",
            "engomado": "Amarillo",
            "id": "-NG2OP73hd6_qRDJSqAS",
            "marca": "Baic",
            "marcaMotor": "",
            "modelo": "X65",
            "no_motor": "",
            "placas": "133zjb5",
            "status": true,
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NG3I1mPDTSJ35T5ZlJ7": {
        "apellidos": "GUDADADA",
        "correo": "genaro.guadarrama93@gmail.com",
        "id": "-NG3I1mPDTSJ35T5ZlJ7",
        "no_cliente": "DEGUCU11220015",
        "nombre": "DEGNARO",
        "status": true,
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5512254265",
        "tipo": "particular",
        "vehiculos": {
          "-NG3IDtiFkbDRu-oUOn4": {
            "anio": "2022",
            "categoria": "Coupé de lujo",
            "cilindros": "8",
            "cliente": "-NG3I1mPDTSJ35T5ZlJ7",
            "color": "Amarillo - Verde brillante",
            "engomado": "Verde",
            "id": "-NG3IDtiFkbDRu-oUOn4",
            "marca": "BMW",
            "marcaMotor": "",
            "modelo": "Serie 4",
            "no_motor": "",
            "placas": "132ZJB",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NGTTTw5ZDgkt3aJcB6n": {
        "apellidos": "guadarrama",
        "correo": "ventas@gmintegraciones.com",
        "id": "-NGTTTw5ZDgkt3aJcB6n",
        "no_cliente": "GAGUCU11220016",
        "nombre": "gabriel ",
        "status": true,
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "4853753874",
        "tipo": "particular",
        "vehiculos": {
          "-NGTUJ_to7k_oN62KtD-": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "6",
            "cliente": "-NGTTTw5ZDgkt3aJcB6n",
            "color": "Negro",
            "engomado": "Rojo",
            "id": "-NGTUJ_to7k_oN62KtD-",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "Versa",
            "no_motor": "",
            "placas": "693pdl",
            "status": true,
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NGYk_XaDBioh9WJPb8b": {
        "apellidos": "oro",
        "correo": "polikaosmk28@gmail.com",
        "id": "-NGYk_XaDBioh9WJPb8b",
        "no_cliente": "LUORCU11220016",
        "nombre": "luis oro",
        "status": true,
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "8745674567",
        "tipo": "particular",
        "vehiculos": {
          "-NKKqTU8K04aU9lZq7Dg": {
            "anio": "1999",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NGYk_XaDBioh9WJPb8b",
            "color": "Azul claro",
            "engomado": "rojo",
            "id": "-NKKqTU8K04aU9lZq7Dg",
            "marca": "Audi",
            "marcaMotor": "",
            "modelo": "A4",
            "no_motor": "",
            "placas": "MKR7374",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NI3JfKMPyqUkZ6GBi9D": {
        "apellidos": "PAREJA GONZALEZ",
        "correo": "jlparejag@gmail.com",
        "id": "-NI3JfKMPyqUkZ6GBi9D",
        "no_cliente": "JOPATO11220017",
        "nombre": "JOSE LUIS ",
        "status": true,
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5534240382",
        "tipo": "particular",
        "vehiculos": {
          "-NI3K7pxev17xnVPeqbc": {
            "anio": "2020",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NI3JfKMPyqUkZ6GBi9D",
            "color": "Azul oscuro",
            "engomado": "Rojo",
            "id": "-NI3K7pxev17xnVPeqbc",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Onix",
            "no_motor": "",
            "placas": "XAX123",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NIY40rUdr2sPleeTYWj": {
            "anio": "2010",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NI3JfKMPyqUkZ6GBi9D",
            "color": "Azul claro",
            "engomado": "Rojo",
            "id": "-NIY40rUdr2sPleeTYWj",
            "marca": "Ford",
            "marcaMotor": "",
            "modelo": "Fiesta",
            "no_motor": "",
            "placas": "pru123",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NJG5zYcExk6uVbWTRA1": {
            "anio": "2016",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NI3JfKMPyqUkZ6GBi9D",
            "color": "Gris",
            "engomado": "azul",
            "id": "-NJG5zYcExk6uVbWTRA1",
            "marca": "Chevrolet",
            "marcaMotor": "1.4 L",
            "modelo": "Spark",
            "no_motor": "",
            "placas": "NWF4260",
            "transmision": "Estandar",
            "vinChasis": "KL8CM6CA6GC553228"
          }
        }
      },
      "-NI8J3w_wd0HDj3-gYoA": {
        "apellidos": " RAMIREZ ZUÑIGA",
        "correo": "jrz30@gmail.com",
        "correo_sec": "",
        "id": "",
        "no_cliente": "JO RTO11220006",
        "nombre": "JORGE",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5535149521",
        "tipo": "particular",
        "vehiculos": {
          "-NI8Nvm1_NQDe0oNk0_t": {
            "anio": "2007",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NI8J3w_wd0HDj3-gYoA",
            "color": "Plata",
            "engomado": "Amarillo",
            "id": "-NI8Nvm1_NQDe0oNk0_t",
            "marca": "Ford",
            "marcaMotor": "",
            "modelo": "Fiesta",
            "no_motor": "",
            "placas": "NUV3705",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": "78243507"
          }
        }
      },
      "-NIEnZDqROJh4YzpfeX2": {
        "apellidos": "HERNANDEZ",
        "correo": "pendiente@correo.com",
        "id": "-NIEnZDqROJh4YzpfeX2",
        "no_cliente": "KIHETO12220019",
        "nombre": "KIKIN",
        "status": true,
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5532055933",
        "tipo": "particular",
        "vehiculos": {
          "-NIEnu_AnID7QDYdOXME": {
            "anio": "2016",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NIEnZDqROJh4YzpfeX2",
            "color": "Otros",
            "engomado": "Rojo",
            "id": "-NIEnu_AnID7QDYdOXME",
            "marca": "Volkswagen",
            "marcaMotor": "1.6 L",
            "modelo": "Vento",
            "no_motor": "",
            "placas": "SIN123",
            "status": true,
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NIIn12s3jMt8UYcX-se": {
        "apellidos": "prueba",
        "correo": "prueba@gmail.com",
        "no_cliente": "PRPRCU12220020",
        "nombre": "prueba",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "4534553453",
        "tipo": "particular"
      },
      "-NIrGdXj5MSZQFwL08XF": {
        "apellidos": "geronimo gil",
        "correo": "lulu@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NIrGdXj5MSZQFwL08XF",
        "no_cliente": "GegeCu09220021",
        "nombre": "Genaro m",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "7867864756",
        "tipo": "particular"
      },
      "-NJD-27P-Ip0uccz77h1": {
        "apellidos": "TOACHE",
        "correo": "sin@correo.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NJD-27P-Ip0uccz77h1",
        "no_cliente": "FETOTo09220022",
        "nombre": "FERNANDA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5564018184",
        "tipo": "particular"
      },
      "-NJGOM0kuATAqPGHQhTp": {
        "apellidos": "CRUZ",
        "correo": "andromeda_3d@hotmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NJGOM0kuATAqPGHQhTp",
        "no_cliente": "MACRTo09220023",
        "nombre": "MARIA ELENA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5513181724",
        "tipo": "particular",
        "vehiculos": {
          "-NJGOd9V6BKc0gEV9p6j": {
            "anio": "2019",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NJGOM0kuATAqPGHQhTp",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NJGOd9V6BKc0gEV9p6j",
            "marca": "Ford",
            "marcaMotor": "1.6 L",
            "modelo": "Figo",
            "no_motor": "",
            "placas": "NUN7052",
            "transmision": "Automatica",
            "vinChasis": "MAJHPAPA7KA195018"
          }
        }
      },
      "-NJLECSlFg3htMWnVJCk": {
        "apellidos": "SIN",
        "correo": "SIN@CORREO.COM",
        "correo_sec": "",
        "empresa": "",
        "id": "-NJLECSlFg3htMWnVJCk",
        "no_cliente": "OCSITo09220024",
        "nombre": "OCTAVIO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5530433921",
        "tipo": "particular",
        "vehiculos": {
          "-NJLIehh7hu2_jcJxKQA": {
            "anio": "2019",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NJLECSlFg3htMWnVJCk",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NJLIehh7hu2_jcJxKQA",
            "marca": "Toyota ",
            "marcaMotor": "2.7l",
            "modelo": "HIace",
            "no_motor": "",
            "placas": "sinpla1",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NJLIzdo-Rbsux1dd8Gb": {
            "anio": "2019",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NJLECSlFg3htMWnVJCk",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NJLIzdo-Rbsux1dd8Gb",
            "marca": "Toyota ",
            "marcaMotor": "2.7l",
            "modelo": "HIace",
            "no_motor": "",
            "placas": "sinpla1",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NJLLN484p3b-aPyspIr": {
            "anio": "2019",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NJLECSlFg3htMWnVJCk",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NJLLN484p3b-aPyspIr",
            "marca": "Toyota ",
            "marcaMotor": "2.7l",
            "modelo": "HIace",
            "no_motor": "",
            "placas": "sinpla1",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NJQOaVswPrU7ny27I5u": {
        "apellidos": "ACUÑA",
        "correo": "edgar.gaitan@infinitunmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NJQOaVswPrU7ny27I5u",
        "no_cliente": "EDACTo09220025",
        "nombre": "EDGAR",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5522714769",
        "tipo": "particular",
        "vehiculos": {
          "-NJQOthxQfqsqfHg0A7m": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NJQOaVswPrU7ny27I5u",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NJQOthxQfqsqfHg0A7m",
            "marca": "KIA",
            "marcaMotor": "2.4 ",
            "modelo": "Optima",
            "no_motor": "",
            "placas": "sinpla2",
            "transmision": "Automatica",
            "vinChasis": ""
          },
          "-NJQOyLZKUQBH9tcgZf5": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NJQOaVswPrU7ny27I5u",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NJQOyLZKUQBH9tcgZf5",
            "marca": "KIA",
            "marcaMotor": "2.4 L",
            "modelo": "Optima",
            "no_motor": "",
            "placas": "sinpla2",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NJW7znp2728xa0fSp1_": {
        "apellidos": "ORTIZ",
        "correo": "ricardomorz20@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NJW7znp2728xa0fSp1_",
        "no_cliente": "RIORTo09220026",
        "nombre": "RICARDO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5539346106",
        "tipo": "particular",
        "vehiculos": {
          "-NJW8IhPYZP9Qe9_E1Lw": {
            "anio": "2015",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NJW7znp2728xa0fSp1_",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NJW8IhPYZP9Qe9_E1Lw",
            "marca": "SEAT",
            "marcaMotor": "2.0 L",
            "modelo": "Ibiza",
            "no_motor": "",
            "placas": "nxr1063",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NJW8TXMtLdQF4EYUc8o": {
            "anio": "2015",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NJW7znp2728xa0fSp1_",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NJW8TXMtLdQF4EYUc8o",
            "marca": "SEAT",
            "marcaMotor": "2.0 L",
            "modelo": "Ibiza",
            "no_motor": "",
            "placas": "nxr1063",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NK-DDkbEZy70IfwWWDu": {
        "apellidos": "SA ",
        "correo": "lupita.loquita@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NK-DDkbEZy70IfwWWDu",
        "no_cliente": "TESACu09220027",
        "nombre": "TEC",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "1234077897",
        "tipo": "particular",
        "vehiculos": {
          "-NK-Dv4TMT-3_e5Q1QTj": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-Dv4TMT-3_e5Q1QTj",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NK-DwZaxbQRBHcjvi6u": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-DwZaxbQRBHcjvi6u",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NK-DzfJ6V8-jD_sneql": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-DzfJ6V8-jD_sneql",
            "marca": "Chevrolet",
            "marcaMotor": "12",
            "modelo": "Tornado ",
            "no_motor": "12",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "12"
          },
          "-NK-E1EQ90gT6T9ErES2": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-E1EQ90gT6T9ErES2",
            "marca": "Chevrolet",
            "marcaMotor": "12",
            "modelo": "Tornado ",
            "no_motor": "12",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "12"
          },
          "-NK-E65AGhCZ0g_OkOsG": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-E65AGhCZ0g_OkOsG",
            "marca": "Chevrolet",
            "marcaMotor": "12",
            "modelo": "Tornado ",
            "no_motor": "12",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "12"
          },
          "-NK-E8_5Zp1A_MYD5qvM": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-E8_5Zp1A_MYD5qvM",
            "marca": "Chevrolet",
            "marcaMotor": "12",
            "modelo": "Tornado ",
            "no_motor": "12",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "12"
          },
          "-NK-EBYIFX-X4evf_1c_": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-EBYIFX-X4evf_1c_",
            "marca": "Chevrolet",
            "marcaMotor": "123456789",
            "modelo": "Tornado ",
            "no_motor": "123456789",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "123456789"
          },
          "-NK-ECAKTV13YchOsaqi": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-ECAKTV13YchOsaqi",
            "marca": "Chevrolet",
            "marcaMotor": "123456789",
            "modelo": "Tornado ",
            "no_motor": "123456789",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "123456789"
          },
          "-NK-EC_q6WWRC4Z4P__X": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-EC_q6WWRC4Z4P__X",
            "marca": "Chevrolet",
            "marcaMotor": "123456789",
            "modelo": "Tornado ",
            "no_motor": "123456789",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "123456789"
          },
          "-NK-EDCTETm5GPw4QTu6": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-EDCTETm5GPw4QTu6",
            "marca": "Chevrolet",
            "marcaMotor": "123456789",
            "modelo": "Tornado ",
            "no_motor": "123456789",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "123456789"
          },
          "-NK-EFXuiJ7NMqkzxxYf": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-EFXuiJ7NMqkzxxYf",
            "marca": "Chevrolet",
            "marcaMotor": "123456789",
            "modelo": "Tornado ",
            "no_motor": "123456789",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "123456789"
          },
          "-NK-EHG_NtAxfAxyGlBG": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-EHG_NtAxfAxyGlBG",
            "marca": "Chevrolet",
            "marcaMotor": "123456789",
            "modelo": "Tornado ",
            "no_motor": "123456789",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "123456789"
          },
          "-NK-EIP3PuWTnFHJorNb": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-EIP3PuWTnFHJorNb",
            "marca": "Chevrolet",
            "marcaMotor": "123456789",
            "modelo": "Tornado ",
            "no_motor": "123456789",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "123456789"
          },
          "-NK-F2vLeh8152oSfaNn": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NK-DDkbEZy70IfwWWDu",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NK-F2vLeh8152oSfaNn",
            "marca": "Chevrolet",
            "marcaMotor": "123456789",
            "modelo": "Tornado ",
            "no_motor": "123456789",
            "placas": "Y65BDJ",
            "transmision": "Estandar",
            "vinChasis": "123456789"
          }
        }
      },
      "-NKGdwfggl-iKF3VAJO4": {
        "apellidos": "Han",
        "correo": "s.speedsales@gmail.com",
        "correo_sec": "",
        "id": "",
        "no_cliente": "CIHACU12220028",
        "nombre": "Cirline ",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5512254265",
        "tipo": "particular",
        "vehiculos": {
          "-NKGf4hKuUeKpMO8WHNy": {
            "anio": "2022",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NKGdwfggl-iKF3VAJO4",
            "color": "Blanco",
            "engomado": "Azul",
            "id": "-NKGf4hKuUeKpMO8WHNy",
            "marca": "Aston Martín",
            "marcaMotor": "",
            "modelo": "DBS",
            "no_motor": "",
            "placas": "RDC920C",
            "status": true,
            "transmision": "Automatica",
            "vinChasis": ""
          },
          "-NKGg-_iI1-OskGP7y9S": {
            "anio": "2010",
            "categoria": "Coupé lujo",
            "cilindros": "4",
            "cliente": "-NKGdwfggl-iKF3VAJO4",
            "color": "Blanco",
            "engomado": "Azul",
            "id": "-NKGg-_iI1-OskGP7y9S",
            "marca": "Bentley",
            "marcaMotor": "",
            "modelo": "Continental ",
            "no_motor": "",
            "placas": "RDC930C",
            "status": true,
            "transmision": "Automatica",
            "vinChasis": ""
          },
          "-NKGkidPwbpjCZXH6g8f": {
            "anio": "2020",
            "categoria": "Coupé lujo",
            "cilindros": "6",
            "cliente": "-NKGdwfggl-iKF3VAJO4",
            "color": "Azul claro",
            "engomado": "azul",
            "id": "-NKGkidPwbpjCZXH6g8f",
            "marca": "Alfa Romeo",
            "marcaMotor": "",
            "modelo": "Stelvio",
            "no_motor": "",
            "placas": "RDC930D",
            "transmision": "Automatica",
            "vinChasis": ""
          },
          "-NKUiIMAG-JAFgb5x2LV": {
            "anio": "2022",
            "categoria": "Sedán lujo",
            "cilindros": "8",
            "cliente": "-NKGdwfggl-iKF3VAJO4",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NKUiIMAG-JAFgb5x2LV",
            "marca": "BMW",
            "marcaMotor": "",
            "modelo": "i4 M50",
            "no_motor": "",
            "placas": "RDC940C",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NKJj9aGGxoDVpZhbBmN": {
        "apellidos": "SULAIMAN",
        "correo": "JPS12@GMAIL.COM",
        "correo_sec": "",
        "empresa": "",
        "id": "-NKJj9aGGxoDVpZhbBmN",
        "no_cliente": "JESUTo09220029",
        "nombre": "JEAN PAUL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5529550023",
        "tipo": "particular",
        "vehiculos": {
          "-NKJjZQjxgcWlKz753Pt": {
            "anio": "2014",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NKJj9aGGxoDVpZhbBmN",
            "color": "Negro",
            "engomado": "rosa",
            "id": "-NKJjZQjxgcWlKz753Pt",
            "marca": "Nissan",
            "marcaMotor": "2.5L",
            "modelo": "Altima",
            "no_motor": "",
            "placas": "NTU5298",
            "transmision": "Automatica",
            "vinChasis": ""
          },
          "-NKJjdHC2X9Gz_jGrs2P": {
            "anio": "2014",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NKJj9aGGxoDVpZhbBmN",
            "color": "Negro",
            "engomado": "rosa",
            "id": "-NKJjdHC2X9Gz_jGrs2P",
            "marca": "Nissan",
            "marcaMotor": "2.5L",
            "modelo": "Altima",
            "no_motor": "",
            "placas": "NTU5298",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NKKrkgIOOftSC8-cNW8": {
        "apellidos": "nuevo clientet",
        "correo": "polikaosmk3425@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NKKrkgIOOftSC8-cNW8",
        "no_cliente": "clnuCu09220030",
        "nombre": "cliente visual",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "7844545454",
        "tipo": "particular",
        "vehiculos": {
          "-NKKruBqToqijKCeKPd9": {
            "anio": "2022",
            "categoria": "Sedán lujo",
            "cilindros": "8",
            "cliente": "-NKKrkgIOOftSC8-cNW8",
            "color": "Amarillo oro",
            "engomado": "verde",
            "id": "-NKKruBqToqijKCeKPd9",
            "marca": "Bentley",
            "marcaMotor": "",
            "modelo": "Flying Spur",
            "no_motor": "",
            "placas": "LKr231",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NKUKToT-odu35eKCucG": {
        "apellidos": "ROMERO",
        "correo": "peendiente@correo.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NKUKToT-odu35eKCucG",
        "no_cliente": "ARROTo09220031",
        "nombre": "ARIADNE",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5535102059",
        "tipo": "particular",
        "vehiculos": {
          "-NKUKkuLt5amolDg_ND_": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NKUKToT-odu35eKCucG",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NKUKkuLt5amolDg_ND_",
            "marca": "Chevrolet",
            "marcaMotor": "1.2 L",
            "modelo": "Spark",
            "no_motor": "",
            "placas": "p32arg",
            "transmision": "Estandar",
            "vinChasis": "HT049839"
          }
        }
      },
      "-NKUp1xLKMOKSSJJXTn2": {
        "apellidos": "señor",
        "correo": "Atencion_clientes@speed-service.com.mx",
        "correo_sec": "",
        "empresa": "Iphone",
        "id": "-NKUp1xLKMOKSSJJXTn2",
        "no_cliente": "deseCu09220032",
        "nombre": "de prueba",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5512254265",
        "tipo": "flotilla",
        "vehiculos": {
          "-NKUp8-dFMmFS4Hx_GBT": {
            "anio": "2020",
            "categoria": "Sedán lujo",
            "cilindros": "8",
            "cliente": "-NKUp1xLKMOKSSJJXTn2",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NKUp8-dFMmFS4Hx_GBT",
            "marca": "Audi",
            "marcaMotor": "",
            "modelo": "A5",
            "no_motor": "",
            "placas": "RDC960C",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NL2-dAoam5XZLitUaaA": {
        "apellidos": "SALGADO",
        "correo": "brenda@florense.com.mx",
        "correo_sec": "",
        "empresa": "",
        "id": "-NL2-dAoam5XZLitUaaA",
        "no_cliente": "BRSATo05230033",
        "nombre": "BRENDA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5519157671",
        "tipo": "particular",
        "vehiculos": {
          "-NL206m5ZiIRl6sT0uam": {
            "anio": "2013",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NL2-dAoam5XZLitUaaA",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NL206m5ZiIRl6sT0uam",
            "marca": "Fiat",
            "marcaMotor": "",
            "modelo": "Ducato",
            "no_motor": "2.2 DIESEL",
            "placas": "SIN00P",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NL2P7b6rR04wT_ziPKs": {
        "apellidos": "ALATRISTE LUNA",
        "correo": "abrahamalatrizte_66@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NL2P7b6rR04wT_ziPKs",
        "no_cliente": "ABALTo05230034",
        "nombre": "ABRAHAM",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5555016305",
        "tipo": "particular",
        "vehiculos": {
          "-NL2PdNVlrl_B6x3oFjL": {
            "anio": "2009",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NL2P7b6rR04wT_ziPKs",
            "color": "Negro",
            "engomado": "verde",
            "id": "-NL2PdNVlrl_B6x3oFjL",
            "marca": "Mercedes Benz",
            "marcaMotor": "",
            "modelo": "Clase C",
            "no_motor": "",
            "placas": "z81adc",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NLNVqIM3HlWwdYY4Vkj": {
        "apellidos": "AGUILAR",
        "correo": "gestor.tesoreria@fhmex.com.mx",
        "empresa": "FARMACEUTICA HISPANOAMERICANA",
        "id": "-NLNVqIM3HlWwdYY4Vkj",
        "no_cliente": "GUAGTo09230035",
        "nombre": "GUILLERMO ",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5523428053",
        "tipo": "flotilla",
        "vehiculos": {
          "-NLNW51bl-wREgPZlPyH": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NLNVqIM3HlWwdYY4Vkj",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NLNW51bl-wREgPZlPyH",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "Versa",
            "no_motor": "1.6 L",
            "placas": "n01avv",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMdb4az2koAb2TxnIUU": {
            "anio": "2009",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NLNVqIM3HlWwdYY4Vkj",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NMdb4az2koAb2TxnIUU",
            "marca": "Toyota ",
            "marcaMotor": "",
            "modelo": "HIace",
            "no_motor": "2.2 L",
            "placas": "nodan32",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NN7GAR_jqKRQcwW_dHU": {
            "anio": "2020",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NLNVqIM3HlWwdYY4Vkj",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NN7GAR_jqKRQcwW_dHU",
            "marca": "Fiat",
            "marcaMotor": "",
            "modelo": "Ducato",
            "no_motor": "2.0 L",
            "placas": "a144ac",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NNqZYuHHPF_eQ59Yrir": {
            "anio": "2019",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NLNVqIM3HlWwdYY4Vkj",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NNqZYuHHPF_eQ59Yrir",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "Versa",
            "no_motor": "1.6L",
            "placas": "sinpl03",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NOQLiMTzsar3nAPDXxS": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NLNVqIM3HlWwdYY4Vkj",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NOQLiMTzsar3nAPDXxS",
            "marca": "Nissan",
            "modelo": "Versa",
            "no_motor": "1.6 L",
            "placas": "A51AUF",
            "transmision": "Estandar"
          },
          "-NQanfzrz331fj2JOh9X": {
            "anio": "2019",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NLNVqIM3HlWwdYY4Vkj",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NQanfzrz331fj2JOh9X",
            "marca": "Volkswagen",
            "modelo": "Polo",
            "no_motor": "1.6L",
            "placas": "simpl11",
            "transmision": "Estandar"
          },
          "-NRF7pnk3HcFqcTUkYnz": {
            "anio": "2009",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NLNVqIM3HlWwdYY4Vkj",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NRF7pnk3HcFqcTUkYnz",
            "marca": "Toyota ",
            "modelo": "HIace",
            "no_motor": "2.4L",
            "placas": "SINPL19",
            "transmision": "Estandar",
            "vinChasis": "90015170"
          }
        }
      },
      "-NLRhhoHEmZzs36LQyO-": {
        "apellidos": "salvador",
        "correo": "ventas_culhuacan@speed-service.com.mx",
        "correo_sec": "",
        "empresa": "",
        "id": "-NLRhhoHEmZzs36LQyO-",
        "no_cliente": "lusaCu10230036",
        "nombre": "lupistrupis",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5522859478",
        "tipo": "particular",
        "vehiculos": {
          "-NLRhx7nvvrQjTtMDudv": {
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
        }
      },
      "-NLS512d_ACSLeFE5r02": {
        "apellidos": "López Perez",
        "correo": "abcde@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NLS512d_ACSLeFE5r02",
        "no_cliente": "PeLóCu10230037",
        "nombre": "Pedro Pablo",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5512345678",
        "tipo": "particular",
        "vehiculos": {
          "-NLS5GEDMnA0gVmS8iob": {
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
        }
      },
      "-NLSGFfH8ide4cUHFj5t": {
        "apellidos": "Monroy",
        "correo": "guadalupesalvadorhdz@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NLSGFfH8ide4cUHFj5t",
        "no_cliente": "JhMoCu10230038",
        "nombre": "Jhovanny",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5626570912",
        "tipo": "particular",
        "vehiculos": {
          "-NLSGpUhhSS0qcMSolt-": {
            "anio": "2019",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NLSGFfH8ide4cUHFj5t",
            "color": "Rojo intenso",
            "engomado": "rojo",
            "id": "-NLSGpUhhSS0qcMSolt-",
            "marca": "Mazda",
            "marcaMotor": "",
            "modelo": "3",
            "no_motor": "",
            "placas": "gh123a",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NLSJqiLdov_8LgUbzmJ": {
        "apellidos": "Cacomixtle",
        "correo": "fabianzku@outlook.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NLSJqiLdov_8LgUbzmJ",
        "no_cliente": "FaCaCu10230039",
        "nombre": "Fabian",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5548795600",
        "tipo": "particular",
        "vehiculos": {
          "-NLSJwWeFEuZSI9jaHnB": {
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
          },
          "-NMVzGMl8BxL96Gnf3r4": {
            "anio": "2016",
            "categoria": "SUV lujo",
            "cilindros": "4",
            "cliente": "-NLSJqiLdov_8LgUbzmJ",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NMVzGMl8BxL96Gnf3r4",
            "marca": "Acura",
            "marcaMotor": "",
            "modelo": "Acura MDX",
            "no_motor": "",
            "placas": "KTT2121",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NLSMGiF8lHzmTWX3sh3": {
        "apellidos": "JONES",
        "correo": "LJONES@OUTLOOK.COM",
        "correo_sec": "",
        "empresa": "",
        "id": "-NLSMGiF8lHzmTWX3sh3",
        "no_cliente": "LUJOCu10230040",
        "nombre": "LUPITA",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5512645201",
        "tipo": "particular",
        "vehiculos": {
          "-NLSMNStNDaojhIKH236": {
            "anio": "2015",
            "categoria": "Carga",
            "cilindros": "10",
            "cliente": "-NLSMGiF8lHzmTWX3sh3",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NLSMNStNDaojhIKH236",
            "marca": "Ford",
            "marcaMotor": "",
            "modelo": "F-450",
            "no_motor": "",
            "placas": "123POL",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NLcE0c8GTpe9BHqzCl9": {
        "apellidos": "Ramirez Ramirez",
        "correo": "Ramirez@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NLcE0c8GTpe9BHqzCl9",
        "no_cliente": "JuRaCu12230041",
        "nombre": "Juanddd",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "7737272828",
        "tipo": "particular",
        "vehiculos": {
          "-NLcHUz59SzQ6-NZhs0f": {
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
        }
      },
      "-NM-9BhwSNia8VZfrU8Q": {
        "apellidos": "HERNANDEZ",
        "correo": "carlos191996h@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NM-9BhwSNia8VZfrU8Q",
        "no_cliente": "CAHEToNaNaN0042",
        "nombre": "CARLOS",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5587408211",
        "tipo": "particular",
        "vehiculos": {
          "-NM-9PxxCSJuTcRSe3Qr": {
            "anio": "2013",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NM-9BhwSNia8VZfrU8Q",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NM-9PxxCSJuTcRSe3Qr",
            "marca": "Volkswagen",
            "marcaMotor": "",
            "modelo": "Saveiro",
            "no_motor": "",
            "placas": "sinpla3",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NM-BO_s7QwkUVnptDJv": {
            "anio": "2013",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NM-9BhwSNia8VZfrU8Q",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NM-BO_s7QwkUVnptDJv",
            "marca": "Volkswagen",
            "marcaMotor": "",
            "modelo": "Saveiro",
            "no_motor": "",
            "placas": "sinpla3",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NM4jIL5OQTi-SIzHEPu": {
        "apellidos": "MONJARAZ",
        "correo": "josevictor1976monjaraz@yahoo.com.mx",
        "correo_sec": "",
        "empresa": "",
        "id": "-NM4jIL5OQTi-SIzHEPu",
        "no_cliente": "JOMOToNaNaN0043",
        "nombre": "JOSE VICTOR",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5528539657",
        "tipo": "particular",
        "vehiculos": {
          "-NM4jWz1w4DJH9jshpl2": {
            "anio": "2016",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NM4jIL5OQTi-SIzHEPu",
            "color": "Azul oscuro",
            "engomado": "rosa",
            "id": "-NM4jWz1w4DJH9jshpl2",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "Sentra",
            "no_motor": "1.6 L",
            "placas": "klf258a",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NMA7CZDha0eLCv5FxtS": {
        "apellidos": "AGUILAR",
        "correo": "gestor.tesoreria@fhmex.com",
        "correo_sec": "",
        "empresa": "FARMACEUTICA HISPANOAMERICANA SA DE CV",
        "id": "-NMA7CZDha0eLCv5FxtS",
        "no_cliente": "GUAGToNaNaN0044",
        "nombre": "GUILLERMO ",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5523642805",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMA7YVvgBUChhWyEHcB": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMA7CZDha0eLCv5FxtS",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NMA7YVvgBUChhWyEHcB",
            "marca": "Nissan",
            "marcaMotor": "1.6L",
            "modelo": "Versa",
            "no_motor": "",
            "placas": "a66auf",
            "transmision": "Estandar",
            "vinChasis": "JK426189"
          }
        }
      },
      "-NMEe2rTeyELxxFkfHAN": {
        "apellidos": "ZALETA ANAYA",
        "correo": "zaleta21@yahoo.com.mx",
        "correo_sec": "",
        "empresa": "",
        "id": "-NMEe2rTeyELxxFkfHAN",
        "no_cliente": "EDZAToNaNaN0045",
        "nombre": "EDWIN",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5540854275",
        "tipo": "particular",
        "vehiculos": {
          "-NMEfwRSt8c1CJfTWXuP": {
            "anio": "2020",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMEe2rTeyELxxFkfHAN",
            "color": "Gris",
            "engomado": "rosa",
            "id": "-NMEfwRSt8c1CJfTWXuP",
            "marca": "Chevrolet",
            "marcaMotor": "1.2 L",
            "modelo": "Beat",
            "no_motor": "",
            "placas": "V28BGN",
            "transmision": "Estandar",
            "vinChasis": "LT061102"
          }
        }
      },
      "-NMFEF5vUnTEVJJCu18x": {
        "apellidos": " LOZANO",
        "correo": "luis.lozano@sodexo.com",
        "correo_sec": "",
        "empresa": "SODEXO MEXICO SA DE CV",
        "id": "-NMFEF5vUnTEVJJCu18x",
        "no_cliente": "LU LToNaNaN0046",
        "nombre": "LUIS ADRIAN",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5587827401",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMFEUzvKyTnn7QYLWNs": {
            "anio": "2015",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NMFEF5vUnTEVJJCu18x",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NMFEUzvKyTnn7QYLWNs",
            "marca": "Ford",
            "marcaMotor": "2.2 DIESEL",
            "modelo": "Transit",
            "no_motor": "",
            "placas": "e13abr",
            "transmision": "Estandar",
            "vinChasis": "fta15690"
          },
          "-NMG1S34xRcyrCzpUJAz": {
            "anio": "2019",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NMFEF5vUnTEVJJCu18x",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NMG1S34xRcyrCzpUJAz",
            "marca": "Ford",
            "marcaMotor": "2.2 DIESEL",
            "modelo": "Transit",
            "no_motor": "",
            "placas": "RAK008A",
            "transmision": "Estandar",
            "vinChasis": "JKA12940"
          }
        }
      },
      "-NMU3XwwkrRxJ59Tuf_8": {
        "apellidos": "NIEVES",
        "correo": "Jose.Nieves@medartis.com",
        "correo_sec": "",
        "empresa": "MEDARTIS S A DE CV",
        "id": "-NMU3XwwkrRxJ59Tuf_8",
        "no_cliente": "JENIToNaNaN0047",
        "nombre": "JESUS",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5533568824",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMU3slGWAHkxBSokpf2": {
            "anio": "2020",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMU3XwwkrRxJ59Tuf_8",
            "color": "Plata",
            "engomado": "amarillo",
            "id": "-NMU3slGWAHkxBSokpf2",
            "marca": "Volkswagen",
            "marcaMotor": "1.6L",
            "modelo": "Vento",
            "no_motor": "",
            "placas": "G06BDF",
            "transmision": "Estandar",
            "vinChasis": "LT013633"
          },
          "-NM_LQzIdfj7Zj5-V6rw": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMU3XwwkrRxJ59Tuf_8",
            "color": "Plata",
            "engomado": "rosa",
            "id": "-NM_LQzIdfj7Zj5-V6rw",
            "marca": "Volkswagen",
            "marcaMotor": "1.6 L",
            "modelo": "Vento",
            "no_motor": "",
            "placas": "U48AVW",
            "transmision": "Estandar",
            "vinChasis": "JT100383"
          }
        }
      },
      "-NMVhbvvR8NX-Ph4aaxv": {
        "apellidos": "BOTELLO",
        "correo": "rocio.botello@risoul.com",
        "correo_sec": "",
        "empresa": "RISOUL Y CIA SA DE CV",
        "id": "-NMVhbvvR8NX-Ph4aaxv",
        "no_cliente": "ROBOToNaNaN0048",
        "nombre": "ROCIO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "8180205005",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMVhm7to72zN3g6UtKi": {
            "anio": "2019",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMVhbvvR8NX-Ph4aaxv",
            "color": "Plata",
            "engomado": "azul",
            "id": "-NMVhm7to72zN3g6UtKi",
            "marca": "Nissan",
            "marcaMotor": "1.8l",
            "modelo": "Versa",
            "no_motor": "",
            "placas": "k60bdr",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NNDAPNVd0zJlFuco9oL": {
            "anio": "2014",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMVhbvvR8NX-Ph4aaxv",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NNDAPNVd0zJlFuco9oL",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "1.6L",
            "placas": "LF72274",
            "transmision": "Estandar",
            "vinChasis": "EB241066"
          },
          "-NNDYqgZKYMw3S_VrHwX": {
            "anio": "2016",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NMVhbvvR8NX-Ph4aaxv",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NNDYqgZKYMw3S_VrHwX",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "NV 2500",
            "no_motor": "2.5L",
            "placas": "lf56367",
            "transmision": "Estandar",
            "vinChasis": "G9015509"
          },
          "-NPNhyWd6r8KcbdHux2f": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMVhbvvR8NX-Ph4aaxv",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NPNhyWd6r8KcbdHux2f",
            "marca": "Nissan",
            "modelo": "Tiida",
            "no_motor": "1.6 L",
            "placas": "NPP6598",
            "transmision": "Estandar",
            "vinChasis": "HK204008"
          },
          "-NR5hnuCn_l9BFQH8qkU": {
            "anio": "2019",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMVhbvvR8NX-Ph4aaxv",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NR5hnuCn_l9BFQH8qkU",
            "marca": "Nissan",
            "modelo": "Versa",
            "no_motor": "1.8 L",
            "placas": "nhw7499",
            "transmision": "Estandar"
          },
          "-NRESZ_Y4WLCgF2xQJKP": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMVhbvvR8NX-Ph4aaxv",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NRESZ_Y4WLCgF2xQJKP",
            "marca": "Nissan",
            "modelo": "Tiida",
            "no_motor": "1.6 L",
            "placas": "Y31ANC",
            "transmision": "Estandar"
          }
        }
      },
      "-NMVmWPPwsDkW64EvmLQ": {
        "apellidos": "Financiación",
        "correo": "genaro.guadarrama@speed-service.com.mx",
        "correo_sec": "",
        "id": "",
        "no_cliente": "FIFICU01230049",
        "nombre": "Finanzas",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5512254265",
        "tipo": "particular",
        "vehiculos": {
          "-NMVmoTpk_8R3NpybQlB": {
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
          },
          "-NMW0zKPJXeqmnboasiP": {
            "anio": "2012",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NMVmWPPwsDkW64EvmLQ",
            "color": "Azul medio y rojo cenizo",
            "engomado": "rojo",
            "id": "-NMW0zKPJXeqmnboasiP",
            "marca": "Acura",
            "marcaMotor": "",
            "modelo": "Acura ILX",
            "no_motor": "",
            "placas": "HYR4353",
            "transmision": "Automatica",
            "vinChasis": ""
          },
          "-NMW15HqGYQexsEVAbxO": {
            "anio": "2016",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NMVmWPPwsDkW64EvmLQ",
            "color": "Plata",
            "engomado": "rojo",
            "id": "-NMW15HqGYQexsEVAbxO",
            "marca": "Aston Martín",
            "marcaMotor": "",
            "modelo": "DB11",
            "no_motor": "",
            "placas": "dshj454",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMW1SmnY3PLLmkOmdyS": {
            "anio": "2016",
            "categoria": "SUV lujo",
            "cilindros": "4",
            "cliente": "-NMVmWPPwsDkW64EvmLQ",
            "color": "Plata",
            "engomado": "rojo",
            "id": "-NMW1SmnY3PLLmkOmdyS",
            "marca": "Acura",
            "marcaMotor": "",
            "modelo": "Acura MDX",
            "no_motor": "",
            "placas": "MJd3254",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NMZ_KvjfiOlv62X5X93": {
        "apellidos": "DOMINGUEZ",
        "correo": "atencion@abastecedor.com.mx",
        "correo_sec": "",
        "empresa": "ABASTECEDOR CORPORATIVO SA DE CV",
        "id": "-NMZ_KvjfiOlv62X5X93",
        "no_cliente": "CEDOToNaNaN0050",
        "nombre": "CECILIA ",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5585315035",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMZ_cN4j7GLUWThFe7O": {
            "anio": "2017",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NMZ_KvjfiOlv62X5X93",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NMZ_cN4j7GLUWThFe7O",
            "marca": "Fiat",
            "marcaMotor": "2.2 DIESEL",
            "modelo": "Ducato",
            "no_motor": "",
            "placas": "pdx9508",
            "transmision": "Estandar",
            "vinChasis": "hc2c96766"
          }
        }
      },
      "-NMZu-FV2AueR54KJb6e": {
        "apellidos": "Paz",
        "correo": "pazruiz65@hotmail.com",
        "correo_sec": "",
        "id": "",
        "no_cliente": "MAPACU01230022",
        "nombre": "Manue",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5528138238",
        "tipo": "particular"
      },
      "-NMZuV0sctpxLtuqMTFT": {
        "apellidos": "Bautista",
        "correo": "ramiro.bautista@suez.com",
        "correo_sec": "",
        "empresa": "TECSA",
        "id": "",
        "no_cliente": "RABACU01230023",
        "nombre": "Ramiro ",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5541877902",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMZvE8Q_02tuTvAlI_y": {
            "anio": "2014",
            "categoria": "Carga",
            "cilindros": "8",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NMZvE8Q_02tuTvAlI_y",
            "marca": "Ford",
            "marcaMotor": "",
            "modelo": "F-350",
            "no_motor": "",
            "placas": "A497AF",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMdaZxqujv8uw7f0_Sx": {
            "anio": "2019",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NMdaZxqujv8uw7f0_Sx",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "",
            "placas": "Y05BDJ",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMdfzUgPB8ljmVPft5l": {
            "anio": "2014",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NMdfzUgPB8ljmVPft5l",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "",
            "placas": "P20AHY",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMdnx-NUidKJa4IydGe": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NMdnx-NUidKJa4IydGe",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "",
            "placas": "F10ASA",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMdvT0uVlNunkS_A62R": {
            "anio": "2014",
            "categoria": "Carga",
            "cilindros": "8",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NMdvT0uVlNunkS_A62R",
            "marca": "Ford",
            "marcaMotor": "",
            "modelo": "F-350",
            "no_motor": "",
            "placas": "A498AF",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMfF7KWDTFbqfsYfzX-": {
            "anio": "2022",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NMfF7KWDTFbqfsYfzX-",
            "marca": "Peugeot",
            "marcaMotor": "",
            "modelo": "Partner",
            "no_motor": "",
            "placas": "LRT401A",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMjVBQEiqpDlKQAKkQs": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NMjVBQEiqpDlKQAKkQs",
            "marca": "Mitsubishi",
            "marcaMotor": "",
            "modelo": "L200",
            "no_motor": "",
            "placas": "PY0128A",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NNEFkJuL15fJdTd2xLC": {
            "anio": "2019",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NNEFkJuL15fJdTd2xLC",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "",
            "placas": "j30ayr",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NNEQEOY-Tuq0k0jjLPK": {
            "anio": "2018",
            "categoria": "Pick Up",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Naranja",
            "engomado": "rosa",
            "id": "-NNEQEOY-Tuq0k0jjLPK",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "Frontier",
            "no_motor": "",
            "placas": "LRT407A",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NNIpftClcWUkZoqXx7x": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NNIpftClcWUkZoqXx7x",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "",
            "placas": "W32ARR",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NNwTuXprSJOyleeXj_-": {
            "anio": "2017",
            "categoria": "Pick Up",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Rojo intenso",
            "engomado": "rosa",
            "id": "-NNwTuXprSJOyleeXj_-",
            "marca": "Nissan",
            "modelo": "Frontier",
            "placas": "LF57547",
            "transmision": "Estandar"
          },
          "-NOFosl4mW-O3oM4GcFF": {
            "anio": "2020",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NOFosl4mW-O3oM4GcFF",
            "marca": "RAM",
            "modelo": "Promaster Rapid",
            "placas": "lrt400a",
            "transmision": "Estandar"
          },
          "-NOVzj9SHUrkcqLdQ9_C": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NOVzj9SHUrkcqLdQ9_C",
            "marca": "Chevrolet",
            "modelo": "Tornado ",
            "placas": "W04ARR",
            "transmision": "Estandar"
          },
          "-NOpTuWGsZpJgNKl3dZw": {
            "anio": "2014",
            "categoria": "Carga",
            "cilindros": "8",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NOpTuWGsZpJgNKl3dZw",
            "marca": "Ford",
            "modelo": "F-450",
            "placas": "A495AF",
            "transmision": "Estandar"
          },
          "-NP-QeqVvP6Ek1eoLjkh": {
            "anio": "2017",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NP-QeqVvP6Ek1eoLjkh",
            "marca": "Chevrolet",
            "modelo": "Tornado ",
            "placas": "W96ARR",
            "transmision": "Estandar"
          },
          "-NPc6mN4v8YgkHN3PnY7": {
            "anio": "2020",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NPc6mN4v8YgkHN3PnY7",
            "marca": "Peugeot",
            "modelo": "Partner",
            "placas": "A01BCR",
            "transmision": "Estandar"
          },
          "-NPwjOU3mwblZSem07Id": {
            "anio": "2014",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Rojo intenso",
            "engomado": "azul",
            "id": "-NPwjOU3mwblZSem07Id",
            "marca": "Chevrolet",
            "modelo": "Spark",
            "placas": "120zkn",
            "transmision": "Estandar"
          },
          "-NQC2Bud6K1Vk1hL0xv1": {
            "anio": "2020",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NQC2Bud6K1Vk1hL0xv1",
            "marca": "Nissan",
            "modelo": "NP300",
            "placas": "L47BFS",
            "transmision": "Estandar"
          },
          "-NR9pQRcXa-DWe0U87qT": {
            "anio": "2014",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NR9pQRcXa-DWe0U87qT",
            "marca": "Chevrolet",
            "modelo": "Tornado ",
            "placas": "P20AYH",
            "transmision": "Estandar"
          },
          "-NRFihvKa2WvBrOBCgPF": {
            "anio": "2019",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Plata",
            "engomado": "rojo",
            "id": "-NRFihvKa2WvBrOBCgPF",
            "marca": "Volkswagen",
            "modelo": "Saveiro",
            "placas": "lxf743a",
            "transmision": "Estandar"
          },
          "-NRcxO3pqN0GP0e_xkcI": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMZuV0sctpxLtuqMTFT",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NRcxO3pqN0GP0e_xkcI",
            "marca": "Volkswagen",
            "modelo": "Saveiro",
            "placas": "LRT408A",
            "transmision": "Estandar"
          }
        }
      },
      "-NM_Kkgp7-FdPVAY1PW0": {
        "apellidos": "Hernández",
        "correo": "arturohernandez@sggroup.com.mx",
        "correo_sec": "",
        "empresa": "-NN2jwMbzzh7vi173YNH",
        "id": "",
        "no_cliente": "ALZACU01230024",
        "nombre": "Arturo",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5563161692",
        "tipo": "flotilla",
        "vehiculos": {
          "-NM_L2a1uZhSsBtkbgkk": {
            "anio": "2017",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NM_Kkgp7-FdPVAY1PW0",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NM_L2a1uZhSsBtkbgkk",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "Urvan ",
            "no_motor": "",
            "placas": "JNR3564",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMp2rDHgFTg427JkKE2": {
            "anio": "2017",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NM_Kkgp7-FdPVAY1PW0",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NMp2rDHgFTg427JkKE2",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "NP300",
            "no_motor": "",
            "placas": "E31BBF",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NNhD4qsrx7SIIi1BpKr": {
            "anio": "2011",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NM_Kkgp7-FdPVAY1PW0",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NNhD4qsrx7SIIi1BpKr",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Tornado ",
            "no_motor": "",
            "placas": "828xue",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NM_QGVqsdeIN7Heen0m": {
        "apellidos": "MONZE",
        "correo": "monze@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NM_QGVqsdeIN7Heen0m",
        "no_cliente": "MOMOToNaNaN0054",
        "nombre": "MONZE",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5545811409",
        "tipo": "particular",
        "vehiculos": {
          "-NM_QTlBsJM7lmgbikg9": {
            "anio": "2006",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NM_QGVqsdeIN7Heen0m",
            "color": "Plata",
            "engomado": "verde",
            "id": "-NM_QTlBsJM7lmgbikg9",
            "marca": "SEAT",
            "marcaMotor": "1.6l",
            "modelo": "León",
            "no_motor": "",
            "placas": "no321t",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NM_thj7nNakz10a8nnM": {
        "apellidos": "Cacique",
        "correo": "com.yo9999@gmail.com",
        "correo_sec": "carlos.alejandro.cacique@gmail.com",
        "empresa": "-NN8yJB6lU7AoCpA5v51",
        "id": "-NM_thj7nNakz10a8nnM",
        "no_cliente": "GTCACO01230055",
        "nombre": "Carlos",
        "sucursal": "-N2glf8hot49dUJYj5WP",
        "telefono_fijo": "5548695847",
        "telefono_movil": "5568989685",
        "tipo": "flotilla"
      },
      "-NMdug34tnQhu-bOJiKj": {
        "apellidos": "LEON LUNA",
        "correo": "betox-son@hotmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NMdug34tnQhu-bOJiKj",
        "no_cliente": "LULEToNaNaN0056",
        "nombre": "LUIS ALBERTO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5513895202",
        "tipo": "particular",
        "vehiculos": {
          "-NMduvtlXu-0q5Zp52Zh": {
            "anio": "2017",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NMdug34tnQhu-bOJiKj",
            "color": "Negro",
            "engomado": "rojo",
            "id": "-NMduvtlXu-0q5Zp52Zh",
            "marca": "SEAT",
            "marcaMotor": "",
            "modelo": "Ibiza",
            "no_motor": "1.2T",
            "placas": "sinpla4",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NMeExYcAnDjvlpCDWuQ": {
        "apellidos": "ALAN",
        "correo": "alanalan@mail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NMeExYcAnDjvlpCDWuQ",
        "no_cliente": "ALALToNaNaN0057",
        "nombre": "ALAN",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5528808343",
        "tipo": "particular",
        "vehiculos": {
          "-NMeFGf8B77wbV6HdN6T": {
            "anio": "2014",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMeExYcAnDjvlpCDWuQ",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NMeFGf8B77wbV6HdN6T",
            "marca": "Volkswagen",
            "marcaMotor": "",
            "modelo": "Vento",
            "no_motor": "1.6L",
            "placas": "sinpla5",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NMidpyPu8Cb9fVvE9GM": {
        "apellidos": "CALZADILLA",
        "correo": "ricardo.calzadilla@gmintegraciones.com",
        "correo_sec": "",
        "empresa": "G.M. INTEGRACIONES Y SOLUCIONES SA DE CV",
        "id": "-NMidpyPu8Cb9fVvE9GM",
        "no_cliente": "RICAToNaNaN0058",
        "nombre": "RICARDO ",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5570461728",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMie2O5PRwxM35NK4Y6": {
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
        }
      },
      "-NMjffgq9k83cuQmvTKu": {
        "apellidos": "LUGO",
        "correo": "mantenimiento06@hitmexico.com",
        "correo_sec": "",
        "empresa": "HIT MÉXICO",
        "id": "-NMjffgq9k83cuQmvTKu",
        "no_cliente": "JULUCuNaNaN0059",
        "nombre": "JUAN CARLOS",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "8119161871",
        "tipo": "flotilla",
        "vehiculos": {
          "-NN7zxSJMs6sKT5M9H5D": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMjffgq9k83cuQmvTKu",
            "color": "Gris",
            "engomado": "rosa",
            "id": "-NN7zxSJMs6sKT5M9H5D",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "NP300",
            "no_motor": "",
            "placas": "RK24858",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NNDRULWA7xVWwLXvIY3": {
            "anio": "2022",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NMjffgq9k83cuQmvTKu",
            "color": "Otros",
            "engomado": "rosa",
            "id": "-NNDRULWA7xVWwLXvIY3",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Aveo",
            "no_motor": "",
            "placas": "sva637a",
            "transmision": "Automatica",
            "vinChasis": ""
          },
          "-NO1KDQSAkOxr1GLnqK3": {
            "anio": "2018",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NMjffgq9k83cuQmvTKu",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NO1KDQSAkOxr1GLnqK3",
            "marca": "Nissan",
            "modelo": "Urvan ",
            "placas": "PCJ4244",
            "transmision": "Estandar"
          },
          "-NOpOAHXP_0t02VVPH4c": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMjffgq9k83cuQmvTKu",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NOpOAHXP_0t02VVPH4c",
            "marca": "Mitsubishi",
            "modelo": "L200",
            "placas": "PP3410",
            "transmision": "Estandar"
          }
        }
      },
      "-NMo-knIjeoPxVaRNXH7": {
        "apellidos": "Rental",
        "correo": "mantenimiento02@hitmexico.com",
        "correo_sec": "",
        "empresa": "HIT MEXICO",
        "id": "-NMo-knIjeoPxVaRNXH7",
        "no_cliente": "SpReCuNaNaN0060",
        "nombre": "Special",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "8111161037",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMo-ywdAJTgT4UyEtAF": {
            "anio": "2018",
            "categoria": "Pick Up",
            "cilindros": "4",
            "cliente": "-NMo-knIjeoPxVaRNXH7",
            "color": "Rojo intenso",
            "engomado": "rojo",
            "id": "-NMo-ywdAJTgT4UyEtAF",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "Frontier",
            "no_motor": "",
            "placas": "PER3124",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NN2WQGkZsVEac_7ze40": {
            "anio": "2020",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMo-knIjeoPxVaRNXH7",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NN2WQGkZsVEac_7ze40",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "NP300",
            "no_motor": "",
            "placas": "PT3806A",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NOuqhTu0IFT6Bn7Dn8i": {
            "anio": "2021",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NMo-knIjeoPxVaRNXH7",
            "color": "Plata",
            "engomado": "rojo",
            "id": "-NOuqhTu0IFT6Bn7Dn8i",
            "marca": "Nissan",
            "modelo": "X-trail",
            "placas": "pbp1853",
            "transmision": "Automatica"
          },
          "-NP3VxdW7vf7RXYQ277D": {
            "anio": "2018",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMo-knIjeoPxVaRNXH7",
            "color": "Negro",
            "engomado": "rosa",
            "id": "-NP3VxdW7vf7RXYQ277D",
            "marca": "Nissan",
            "modelo": "NP300",
            "placas": "PJ3947A",
            "transmision": "Estandar"
          },
          "-NPO-W3_VBUj1VAUIT7W": {
            "anio": "2010",
            "categoria": "Camioneta",
            "cilindros": "6",
            "cliente": "-NMo-knIjeoPxVaRNXH7",
            "color": "Rojo intenso",
            "engomado": "azul",
            "id": "-NPO-W3_VBUj1VAUIT7W",
            "marca": "Chevrolet",
            "modelo": "Colorado",
            "placas": "259WUU",
            "transmision": "Automatica"
          }
        }
      },
      "-NMt1kbR4iK-Gkg4b0qF": {
        "apellidos": "ROMERO",
        "correo": "luis.romero@ascendum.mx",
        "correo_sec": "",
        "empresa": "ASCEDUM MAQUINARIA MEXICO S DE CV",
        "id": "-NMt1kbR4iK-Gkg4b0qF",
        "no_cliente": "LUROToNaNaN0061",
        "nombre": "LUIS ALBERTO ",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5519989223",
        "tipo": "flotilla",
        "vehiculos": {
          "-NMt64aCyJYOXgYkyfIq": {
            "anio": "2017",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NMt1kbR4iK-Gkg4b0qF",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NMt64aCyJYOXgYkyfIq",
            "marca": "Ford",
            "marcaMotor": "2.5L",
            "modelo": "Ranger",
            "no_motor": "",
            "placas": "SINPLA6",
            "transmision": "Estandar",
            "vinChasis": ""
          },
          "-NMtJ82upzN35ay-WogM": {
            "anio": "2021",
            "categoria": "Pick Up",
            "cilindros": "4",
            "cliente": "-NMt1kbR4iK-Gkg4b0qF",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NMtJ82upzN35ay-WogM",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "Frontier",
            "no_motor": "2.5L",
            "placas": "SINPLA7",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NMtLwj60Wtky18SClna": {
        "apellidos": "MALDONADO",
        "correo": "ecmsa100@msm.com",
        "correo_sec": "",
        "empresa": "EQUIPOS Y CLIMAS DE MEXICO SA DE CV",
        "id": "-NMtLwj60Wtky18SClna",
        "no_cliente": "MAMAToNaNaN0062",
        "nombre": "MARITZA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5543296529",
        "tipo": "flotilla"
      },
      "-NN2B7t8ainyEAPA_yta": {
        "apellidos": "BRENDING",
        "correo": "brending2624@gmail.com",
        "correo_sec": "",
        "empresa": "",
        "id": "-NN2B7t8ainyEAPA_yta",
        "no_cliente": "BRBRToNaNaN0063",
        "nombre": "BRENDING",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5534082624",
        "tipo": "particular",
        "vehiculos": {
          "-NN2BokqPMufKByF4ly6": {
            "anio": "2014",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NN2B7t8ainyEAPA_yta",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NN2BokqPMufKByF4ly6",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "March",
            "no_motor": "1.6l",
            "placas": "sinpla8",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NN2b8V1RrfMfscvdeZA": {
        "apellidos": "oro",
        "correo": "polikaosmk28s@gmail.com",
        "correo_sec": "santos@gmail.com",
        "empresa": "",
        "id": "-NN2b8V1RrfMfscvdeZA",
        "no_cliente": "luorCuNaNaN0064",
        "nombre": "luis oro",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "8745674567",
        "tipo": "particular"
      },
      "-NN2bCdLEDkcZWJTthqK": {
        "apellidos": "prueba",
        "correo": "polikaosmk28dd@gmail.com",
        "id": "-NN2bCdLEDkcZWJTthqK",
        "no_cliente": "prprToNaNaN0065",
        "nombre": "prueba",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "8745674567",
        "tipo": "particular"
      },
      "-NN2bJusAlZ4o44_m6d8": {
        "apellidos": "fdgdfgdfg",
        "correo": "polikaosmkff28@gmail.com",
        "id": "-NN2bJusAlZ4o44_m6d8",
        "no_cliente": "dffdCuNaNaN0066",
        "nombre": "dfdfgdfg",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "8745674567",
        "tipo": "particular"
      },
      "-NN8LHsaFg-EFQ-inzEy": {
        "apellidos": "ALVAREZ",
        "correo": "leonardo.alvarez@inah.gob.mx",
        "correo_sec": "",
        "empresa": "-NN7xfVE1zKojEYliQuQ",
        "id": "-NN8LHsaFg-EFQ-inzEy",
        "no_cliente": "LEALTO01230034",
        "nombre": "LEONARDO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5555536266",
        "tipo": "flotilla",
        "vehiculos": {
          "-NN8LWrP5E-CHPBHHX3F": {
            "anio": "2009",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NN8LHsaFg-EFQ-inzEy",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NN8LWrP5E-CHPBHHX3F",
            "marca": "Nissan",
            "marcaMotor": "",
            "modelo": "NP300",
            "no_motor": "1.8L",
            "placas": "625wdn",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NN8UHDOo-rcxHoak7zo": {
        "apellidos": "MENDOZA",
        "correo": "morado_pista@hotmail.com",
        "correo_sec": "",
        "id": "-NN8UHDOo-rcxHoak7zo",
        "no_cliente": "JOMETO01230035",
        "nombre": "JOHANA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5526816584",
        "tipo": "particular",
        "vehiculos": {
          "-NN8UnwzvhYzZVkLO_7s": {
            "anio": "2011",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NN8UHDOo-rcxHoak7zo",
            "color": "Azul oscuro",
            "engomado": "amarillo",
            "id": "-NN8UnwzvhYzZVkLO_7s",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Chevy",
            "no_motor": "1.6 L",
            "placas": "775XVE",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NN8Xp5eh6s0dXZg4o7L": {
        "apellidos": "INDUSTRIALES",
        "correo": "ercha_15@hotmail.com",
        "correo_sec": "",
        "empresa": "-NN8XPnus6-wuKyt5_JW",
        "id": "-NN8Xp5eh6s0dXZg4o7L",
        "no_cliente": "CAINTO01230036",
        "nombre": "CARBONES",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5532302530",
        "tipo": "flotilla",
        "vehiculos": {
          "-NN8YJD2aTW-IKTuckLl": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NN8Xp5eh6s0dXZg4o7L",
            "color": "Negro",
            "engomado": "amarillo",
            "id": "-NN8YJD2aTW-IKTuckLl",
            "marca": "KIA",
            "marcaMotor": "",
            "modelo": "Rio",
            "no_motor": "1.6L",
            "placas": "rmr246a",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NN8_QarszCpF7XdwKsp": {
        "apellidos": "JUAN",
        "correo": "jose_juan123@gmail.com",
        "correo_sec": "",
        "id": "-NN8_QarszCpF7XdwKsp",
        "no_cliente": "JOJUTO01230037",
        "nombre": "JOSE ",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5545782599",
        "tipo": "particular",
        "vehiculos": {
          "-NN8aU4dwTRnIJmsVZz9": {
            "anio": "2020",
            "categoria": "Coupé lujo",
            "cilindros": "6",
            "cliente": "-NN8_QarszCpF7XdwKsp",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NN8aU4dwTRnIJmsVZz9",
            "marca": "BMW",
            "marcaMotor": "",
            "modelo": "Serie 3",
            "no_motor": "3.0L",
            "placas": "sinpla9",
            "transmision": "Automatica",
            "vinChasis": "WBATS710XL9C26514"
          }
        }
      },
      "-NN8z7sNVXsZUwed6nVZ": {
        "apellidos": "Cacique",
        "correo": "com.yo9999@gmail.com",
        "correo_sec": "carlos.alejandro.cacique@gmail.com",
        "id": "",
        "no_cliente": "GTCACO01230004",
        "nombre": "gtntthnhnrr",
        "sucursal": "-N2glf8hot49dUJYj5WP",
        "telefono_fijo": "5548695847",
        "telefono_movil": "5568989685",
        "tipo": "particular"
      },
      "-NN8zq1K2QnBp7RIwtq2": {
        "apellidos": "montez lara",
        "correo": "daniellaraz@gmail.com",
        "correo_sec": "",
        "id": "",
        "no_cliente": "DAMOCO01230005",
        "nombre": "daniel",
        "sucursal": "-N2glf8hot49dUJYj5WP",
        "telefono_fijo": "",
        "telefono_movil": "5569658965",
        "tipo": "particular",
        "vehiculos": {
          "-NN9-8J4Jlhwv-uAd9WR": {
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
          },
          "-NN95swAeudK8ygth3M0": {
            "anio": "2022",
            "categoria": "SUV lujo",
            "cilindros": "8",
            "cliente": "-NN8zq1K2QnBp7RIwtq2",
            "color": "Blanco",
            "engomado": "Rosa",
            "id": "-NN95swAeudK8ygth3M0",
            "marca": "Cadillac",
            "marcaMotor": "hemi ",
            "modelo": "Escalade",
            "no_motor": "fhkjw26566",
            "placas": "pah2148",
            "status": true,
            "transmision": "Automatica",
            "vinChasis": "rfer"
          }
        }
      },
      "-NNHb780Eae4Sd1LSSQY": {
        "apellidos": "GALLEGOS",
        "correo": "sergio.gallegos.g@hotmail.com",
        "correo_sec": "",
        "id": "-NNHb780Eae4Sd1LSSQY",
        "no_cliente": "SEGATO02230038",
        "nombre": "SERGIO ",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5534970236",
        "tipo": "particular",
        "vehiculos": {
          "-NNHbWqSwab4pzWKauVD": {
            "anio": "2011",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNHb780Eae4Sd1LSSQY",
            "color": "Negro",
            "engomado": "verde",
            "id": "-NNHbWqSwab4pzWKauVD",
            "marca": "Renault",
            "marcaMotor": "",
            "modelo": "Fluence",
            "no_motor": "2.0L",
            "placas": "sinpl1",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NNHvZZjgy4J-eXO977O": {
        "apellidos": "MITRE",
        "correo": "mitre_leopoldo68@yahoo.com.mx",
        "correo_sec": "",
        "id": "-NNHvZZjgy4J-eXO977O",
        "no_cliente": "LEMITO02230039",
        "nombre": "LEOPOLDO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5540122930",
        "tipo": "particular",
        "vehiculos": {
          "-NNHwECVMRnHhOYm0_i7": {
            "anio": "2019",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NNHvZZjgy4J-eXO977O",
            "color": "Plata",
            "engomado": "verde",
            "id": "-NNHwECVMRnHhOYm0_i7",
            "marca": "Mercedes Benz",
            "marcaMotor": "",
            "modelo": "Clase C",
            "no_motor": "1.5 L",
            "placas": "sinpl2",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NNI_E-2mO3LJLWe0zT6": {
        "apellidos": "HERNANDEZ",
        "correo": "uro.theology@gmail.com",
        "correo_sec": "",
        "id": "-NNI_E-2mO3LJLWe0zT6",
        "no_cliente": "MAHETO02230040",
        "nombre": "MANUEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5578101140",
        "tipo": "particular",
        "vehiculos": {
          "-NNI_XhORV4k395h2SIT": {
            "anio": "2016",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNI_E-2mO3LJLWe0zT6",
            "color": "Gris",
            "engomado": "amarillo",
            "id": "-NNI_XhORV4k395h2SIT",
            "marca": "Volkswagen",
            "marcaMotor": "",
            "modelo": "Jetta",
            "no_motor": "",
            "placas": "M05AGF",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NNIeMuKNt93bflb9_1c": {
        "apellidos": "ALFARO",
        "correo": "danielalfaro@hotmail.com",
        "correo_sec": "",
        "id": "-NNIeMuKNt93bflb9_1c",
        "no_cliente": "DAALTO02230041",
        "nombre": "DANIEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5567023853",
        "tipo": "particular",
        "vehiculos": {
          "-NNImx9J5On17Nsca9Uq": {
            "anio": "2016",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNIeMuKNt93bflb9_1c",
            "color": "Negro",
            "engomado": "rojo",
            "id": "-NNImx9J5On17Nsca9Uq",
            "marca": "Ford",
            "marcaMotor": "",
            "modelo": "Fiesta",
            "no_motor": "1.6L",
            "placas": "sinpl3",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NNJ44KxXwX5ybn8Smlm": {
        "apellidos": "GALEANA",
        "correo": "miriam.galeana@medartis.com",
        "correo_sec": "",
        "empresa": "-NNJ3aboGRSBT-cfXCuR",
        "id": "-NNJ44KxXwX5ybn8Smlm",
        "no_cliente": "MIGATO02230042",
        "nombre": "MIRIAM",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5515266245",
        "tipo": "flotilla",
        "vehiculos": {
          "-NNJ4dAA7U0e2FaehEmu": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNJ44KxXwX5ybn8Smlm",
            "color": "Gris",
            "engomado": "verde",
            "id": "-NNJ4dAA7U0e2FaehEmu",
            "marca": "Renault",
            "marcaMotor": "",
            "modelo": "Logan",
            "no_motor": "1.6 L",
            "placas": "L31AWH",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NNJDCuLY56cJhP8XI2F": {
        "apellidos": "juan xd",
        "correo": "juan3235@gmail.com",
        "correo_sec": "",
        "id": "-NNJDCuLY56cJhP8XI2F",
        "no_cliente": "JUJUCU02230029",
        "nombre": "juan prueba 97",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5523232222",
        "tipo": "particular",
        "vehiculos": {
          "-NNJDJH9WES8LInQavme": {
            "anio": "2022",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NNJDCuLY56cJhP8XI2F",
            "color": "Azul medio y rojo cenizo",
            "engomado": "rosa",
            "id": "-NNJDJH9WES8LInQavme",
            "marca": "Aston Martín",
            "marcaMotor": "",
            "modelo": "DBX",
            "no_motor": "",
            "placas": "hfgh897",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NNO9jLDS6a0yX44kaDN": {
        "apellidos": "Silva",
        "correo": "csilvac95@yahoo.com",
        "correo_sec": "",
        "id": "-NNO9jLDS6a0yX44kaDN",
        "no_cliente": "CASICU02230030",
        "nombre": "Carlos",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "5568213888",
        "telefono_movil": "5521151722",
        "tipo": "particular",
        "vehiculos": {
          "-NNO9sNAim_hgmaCmskQ": {
            "anio": "2012",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNO9jLDS6a0yX44kaDN",
            "color": "Gris",
            "engomado": "rojo",
            "id": "-NNO9sNAim_hgmaCmskQ",
            "marca": "Ford",
            "marcaMotor": "",
            "modelo": "Focus",
            "no_motor": "",
            "placas": "274-XYY",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NNhpZ0V-gw-ycrQoEqn": {
        "apellidos": "JASSO",
        "correo": "JASSO5595@GMAIL.COM",
        "correo_sec": "",
        "id": "-NNhpZ0V-gw-ycrQoEqn",
        "no_cliente": "JAJATO02230043",
        "nombre": "JASSO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5521455951",
        "tipo": "particular",
        "vehiculos": {
          "-NNhpoNUlYkUU5H36nHF": {
            "anio": "2012",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NNhpZ0V-gw-ycrQoEqn",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NNhpoNUlYkUU5H36nHF",
            "marca": "SEAT",
            "marcaMotor": "",
            "modelo": "Altea",
            "no_motor": "1.8L",
            "placas": "SINPL4",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NNhrsTiYRg_Xk_D96LR": {
        "apellidos": "ISA",
        "correo": "isa98@hotmail.com",
        "correo_sec": "",
        "id": "-NNhrsTiYRg_Xk_D96LR",
        "no_cliente": "ISISTO02230044",
        "nombre": "ISA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5530106798",
        "tipo": "particular",
        "vehiculos": {
          "-NNhsAHq-xofVCS0gsu7": {
            "anio": "2007",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNhrsTiYRg_Xk_D96LR",
            "color": "Rojo intenso",
            "engomado": "azul",
            "id": "-NNhsAHq-xofVCS0gsu7",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Chevy",
            "no_motor": "1.6 L",
            "placas": "sinpl09",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NNhtqCgOuCU3tOL3Cok": {
        "apellidos": "805461",
        "correo": "805461@hotmail.com",
        "correo_sec": "",
        "id": "-NNhtqCgOuCU3tOL3Cok",
        "no_cliente": "8080TO02230045",
        "nombre": "805461",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5511520859",
        "tipo": "particular",
        "vehiculos": {
          "-NNhuEJbtULozIwjRPtO": {
            "anio": "2013",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NNhtqCgOuCU3tOL3Cok",
            "color": "Rojo intenso",
            "engomado": "verde",
            "id": "-NNhuEJbtULozIwjRPtO",
            "marca": "Suzuki",
            "marcaMotor": "",
            "modelo": "Swift",
            "no_motor": "1.6L",
            "placas": "sinpl01",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NNlk5lfbG120tHa6mpr": {
        "apellidos": "ZABALA",
        "correo": "direccion@deliciasmx.com",
        "correo_sec": "",
        "empresa": "-NNlhm0LbvcCinGEVijh",
        "id": "-NNlk5lfbG120tHa6mpr",
        "no_cliente": "GAZATO02230046",
        "nombre": "GASBI",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5569147151",
        "tipo": "flotilla",
        "vehiculos": {
          "-NNlkbD9plcuXcfJJubS": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNlk5lfbG120tHa6mpr",
            "color": "Plata",
            "engomado": "amarillo",
            "id": "-NNlkbD9plcuXcfJJubS",
            "marca": "Toyota ",
            "marcaMotor": "",
            "modelo": "Yaris",
            "no_motor": "1.5L",
            "placas": "PCK4415",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NNlpaGDuy0e1L90IgIs": {
        "apellidos": "ROMERO",
        "correo": "marcoromeromora26@gmail.com",
        "correo_sec": "",
        "id": "-NNlpaGDuy0e1L90IgIs",
        "no_cliente": "MAROCU02230031",
        "nombre": "MARCO ANTONIO",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5620337087",
        "tipo": "particular",
        "vehiculos": {
          "-NNlpl6bDiBgxQq4Fp83": {
            "anio": "2003",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNlpaGDuy0e1L90IgIs",
            "color": "Amarillo sol",
            "engomado": "rojo",
            "id": "-NNlpl6bDiBgxQq4Fp83",
            "marca": "Volkswagen",
            "marcaMotor": "",
            "modelo": "Beetle",
            "no_motor": "",
            "placas": "NGK5383",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NNmDaHVuNvtBCxZyU3l": {
        "apellidos": "Cruz Santana",
        "correo": "jalbertohut@gmail.com",
        "correo_sec": "",
        "id": "-NNmDaHVuNvtBCxZyU3l",
        "no_cliente": "JOCRCU02230032",
        "nombre": "Jose Alberto ",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_fijo": "",
        "telefono_movil": "5588041699",
        "tipo": "particular",
        "vehiculos": {
          "-NNmDoFDkYuwZiC1_PVV": {
            "anio": "2015",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNmDaHVuNvtBCxZyU3l",
            "color": "Negro",
            "engomado": "amarillo",
            "id": "-NNmDoFDkYuwZiC1_PVV",
            "marca": "Chevrolet",
            "marcaMotor": "",
            "modelo": "Cruze",
            "no_motor": "",
            "placas": "u36amu",
            "transmision": "Automatica",
            "vinChasis": ""
          }
        }
      },
      "-NNmE4BLF-iyON17oNCq": {
        "apellidos": "Cisneros",
        "correo": "wendy.cisneros@ti-america.com",
        "correo_sec": "",
        "empresa": "",
        "id": "",
        "no_cliente": "WECICO02230086",
        "nombre": "Wendy",
        "sucursal": "-N2glf8hot49dUJYj5WP",
        "telefono_fijo": "2222732100",
        "telefono_movil": "2225638159",
        "tipo": "flotilla",
        "vehiculos": {
          "-NNmGCgRftkXls5rKurD": {
            "anio": "2015",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNmE4BLF-iyON17oNCq",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NNmGCgRftkXls5rKurD",
            "marca": "Volkswagen",
            "marcaMotor": "",
            "modelo": "Gol",
            "no_motor": "",
            "placas": "J69AYP",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NNmkK1O9ztLeyajc51j": {
        "apellidos": "AVILA",
        "correo": "contacto@speed-service.com.mx",
        "correo_sec": "",
        "id": "-NNmkK1O9ztLeyajc51j",
        "no_cliente": "SIAVTO02230047",
        "nombre": "SIMON",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_fijo": "",
        "telefono_movil": "5543602177",
        "tipo": "particular",
        "vehiculos": {
          "-NNmkTM-iiRAPg3M0M2Y": {
            "anio": "2013",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNmkK1O9ztLeyajc51j",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NNmkTM-iiRAPg3M0M2Y",
            "marca": "Volkswagen",
            "marcaMotor": "",
            "modelo": "Vento",
            "no_motor": "1.6 L",
            "placas": "SINPL02",
            "transmision": "Estandar",
            "vinChasis": ""
          }
        }
      },
      "-NNspFTia9L_UvkASLFL": {
        "apellidos": "UGARTE",
        "correo": "omar_ugartes60@gmail.com",
        "fullname": "OMAR  UGARTE",
        "id": "-NNspFTia9L_UvkASLFL",
        "no_cliente": "OMUGTO02230088",
        "nombre": "OMAR",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5545681703",
        "tipo": "particular",
        "vehiculos": {
          "-NNspUmHomSJwNI4zbbT": {
            "anio": "2019",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNspFTia9L_UvkASLFL",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NNspUmHomSJwNI4zbbT",
            "marca": "Nissan",
            "modelo": "Versa",
            "no_motor": "1.6 L",
            "placas": "sinpl04",
            "transmision": "Estandar"
          }
        }
      },
      "-NNw7-7lu1dfKE3ZgISF": {
        "apellidos": "Orozco",
        "correo": "oskard2@hotmail.com",
        "fullname": "Oscar Orozco",
        "id": "-NNw7-7lu1dfKE3ZgISF",
        "no_cliente": "OSORCU02230089",
        "nombre": "Oscar",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5532479387",
        "tipo": "particular",
        "vehiculos": {
          "-NNw7LEhdYqaGdARUKfx": {
            "anio": "2015",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NNw7-7lu1dfKE3ZgISF",
            "color": "Negro",
            "engomado": "amarillo",
            "id": "-NNw7LEhdYqaGdARUKfx",
            "marca": "Volkswagen",
            "modelo": "Vento",
            "placas": "y75adn",
            "transmision": "Estandar"
          }
        }
      },
      "-NO0-sS-pDMa5bQvR_Y0": {
        "apellidos": "UGARTE",
        "correo": "omar.ugarte@gmail.com",
        "fullname": "OMAR UGARTE",
        "id": "-NO0-sS-pDMa5bQvR_Y0",
        "no_cliente": "OMUGTO02230090",
        "nombre": "OMAR",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5614447595",
        "tipo": "particular",
        "vehiculos": {
          "-NO00M45CnAiOinJHyO5": {
            "anio": "2019",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NO0-sS-pDMa5bQvR_Y0",
            "color": "Café Claro",
            "engomado": "amarillo",
            "id": "-NO00M45CnAiOinJHyO5",
            "marca": "Nissan",
            "modelo": "Versa",
            "no_motor": "1.6 L",
            "placas": "nja5275",
            "transmision": "Estandar"
          }
        }
      },
      "-NOAG88cjUArkd-KBRxb": {
        "apellidos": "SALINAS HERNANDEZ",
        "correo": "cas@systemi.com.mx",
        "empresa": "-NOAFrY1tk6WAOgt3BE9",
        "fullname": "RODRIGO SALINAS HERNANDEZ",
        "id": "-NOAG88cjUArkd-KBRxb",
        "no_cliente": "ROSATO02230091",
        "nombre": "RODRIGO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5554086619",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOAGS46eKwfNFVCNts1": {
            "anio": "2015",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOAG88cjUArkd-KBRxb",
            "color": "Negro",
            "engomado": "amarillo",
            "id": "-NOAGS46eKwfNFVCNts1",
            "marca": "Volkswagen",
            "modelo": "Vento",
            "no_motor": "1.6 L",
            "placas": "a25acx",
            "transmision": "Estandar",
            "vinChasis": "ft092862"
          }
        }
      },
      "-NOGpV-4C-GQNXvDfYud": {
        "apellidos": "Electrix",
        "correo": "capitalhumano@electricx.com.mx",
        "empresa": "-NN2jwMclx-WqXdNjF_w",
        "fullname": "Margarita Electrix",
        "id": "-NOGpV-4C-GQNXvDfYud",
        "no_cliente": "MAELCU02230092",
        "nombre": "Margarita",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5588480887",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOGplQDko4ckBbt6A6Y": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOGpV-4C-GQNXvDfYud",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NOGplQDko4ckBbt6A6Y",
            "marca": "Nissan",
            "modelo": "March",
            "placas": "ntz3685",
            "transmision": "Estandar"
          },
          "-NOH-Wn4PWYqnebWo_Im": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOGpV-4C-GQNXvDfYud",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NOH-Wn4PWYqnebWo_Im",
            "marca": "Nissan",
            "modelo": "March",
            "placas": "NTZ3566",
            "transmision": "Estandar"
          }
        }
      },
      "-NOKT1A_o3p8fZ9TGzct": {
        "apellidos": "ANGIE",
        "correo": "angie64@gmail.com",
        "fullname": "ANGIE ANGIE",
        "id": "-NOKT1A_o3p8fZ9TGzct",
        "no_cliente": "ANANTO02230093",
        "nombre": "ANGIE",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5550683964",
        "tipo": "particular",
        "vehiculos": {
          "-NOKTEBkATjNJVdzMzDI": {
            "anio": "2014",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOKT1A_o3p8fZ9TGzct",
            "color": "Negro",
            "engomado": "azul",
            "id": "-NOKTEBkATjNJVdzMzDI",
            "marca": "Nissan",
            "modelo": "Versa",
            "no_motor": "1.6 L",
            "placas": "sinpla0",
            "transmision": "Estandar"
          }
        }
      },
      "-NOK_-lIuYdZjnfwObya": {
        "apellidos": "VALLEJO REYES",
        "correo": "ana.vallejo@formex.com",
        "empresa": "-NOKZ9_TIGd24I5Eqf5P",
        "fullname": "ANA SILVIA VALLEJO REYES",
        "id": "-NOK_-lIuYdZjnfwObya",
        "no_cliente": "ANVATO02230094",
        "nombre": "ANA SILVIA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5574189408",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOQ3dFScDIZVPwGW8eR": {
            "anio": "2001",
            "categoria": "Carga",
            "cilindros": "8",
            "cliente": "-NOK_-lIuYdZjnfwObya",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NOQ3dFScDIZVPwGW8eR",
            "marca": "Ford",
            "modelo": "F-350",
            "no_motor": "5.4 L",
            "placas": "LE40122",
            "transmision": "Estandar",
            "vinChasis": "1M101095"
          }
        }
      },
      "-NOL-NjyXeEGSwm6ir0s": {
        "apellidos": "COSSIO",
        "correo": "cotizacionestt@speed-service.com.mx",
        "fullname": "GABRIELA  COSSIO",
        "id": "-NOL-NjyXeEGSwm6ir0s",
        "no_cliente": "GACOTO02230095",
        "nombre": "GABRIELA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5215545857",
        "tipo": "particular"
      },
      "-NOLscckxnpg2PrC_pkW": {
        "apellidos": "Pablo",
        "correo": "tesoreria@sanpablo.com.mx",
        "empresa": "-NN2jwMbzzh7vi173YNL",
        "fullname": "San Pablo",
        "id": "-NOLscckxnpg2PrC_pkW",
        "no_cliente": "SAPACU02230096",
        "nombre": "San",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5529370500",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOLslWw78ef3B7RlWNa": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOLscckxnpg2PrC_pkW",
            "color": "Plata",
            "engomado": "amarillo",
            "id": "-NOLslWw78ef3B7RlWNa",
            "marca": "Volkswagen",
            "modelo": "Vento",
            "placas": "J76AKU",
            "transmision": "Automatica"
          }
        }
      },
      "-NOM7Io03_oOmmDTgATJ": {
        "apellidos": "ZARATE",
        "correo": "taniazarate96@gmail.com",
        "fullname": "TANIA  ZARATE",
        "id": "-NOM7Io03_oOmmDTgATJ",
        "no_cliente": "TAZATO02230097",
        "nombre": "TANIA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5531361206",
        "tipo": "particular",
        "vehiculos": {
          "-NOM9kSMLPoZTVJ7YUDk": {
            "anio": "2020",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NOM7Io03_oOmmDTgATJ",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NOM9kSMLPoZTVJ7YUDk",
            "marca": "Peugeot",
            "marcaMotor": "DIESEL",
            "modelo": "Partner",
            "placas": "sinpl05",
            "transmision": "Estandar"
          }
        }
      },
      "-NOMKH4jWHhUoiCubtVf": {
        "apellidos": "MARTINEZ",
        "correo": "DAVIT32@GMAIL.COM",
        "fullname": "DAVID MARTINEZ",
        "id": "-NOMKH4jWHhUoiCubtVf",
        "no_cliente": "DAMACU02230098",
        "nombre": "DAVID",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "555555555",
        "tipo": "particular",
        "vehiculos": {
          "-NOMKiCqKYbIiErBUKD0": {
            "anio": "1999",
            "categoria": "Coupé lujo",
            "cilindros": "4",
            "cliente": "-NOMKH4jWHhUoiCubtVf",
            "color": "Plata",
            "engomado": "amarillo",
            "id": "-NOMKiCqKYbIiErBUKD0",
            "marca": "BMW",
            "modelo": "Serie 3",
            "placas": "DA225A",
            "transmision": "Estandar"
          }
        }
      },
      "-NON-uKUoBL3mmXMfyLr": {
        "apellidos": "MARTINEZ",
        "correo": "almacencuatitlan@fruco.com.mx",
        "empresa": "-NOMyTEKWL5yyZPDYVIN",
        "fullname": "JOSE MANUEL MARTINEZ",
        "id": "-NON-uKUoBL3mmXMfyLr",
        "no_cliente": "JOMATO02230099",
        "nombre": "JOSE MANUEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5556980670",
        "tipo": "flotilla"
      },
      "-NOPP8lc-cXkkugI9vhc": {
        "apellidos": "RODRIGUEZ  VLADIVIESO",
        "correo": "toribioriva@gmail.com",
        "fullname": "MIRIAM RODRIGUEZ  VLADIVIESO",
        "id": "-NOPP8lc-cXkkugI9vhc",
        "no_cliente": "MIROTO02230100",
        "nombre": "MIRIAM",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5951061108",
        "tipo": "particular",
        "vehiculos": {
          "-NOPPgvNaTigLV4Rhb8P": {
            "anio": "2012",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NOPP8lc-cXkkugI9vhc",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NOPPgvNaTigLV4Rhb8P",
            "marca": "Ford",
            "marcaMotor": "2.2 DIESEL",
            "modelo": "Transit",
            "placas": "nkm6635",
            "transmision": "Estandar",
            "vinChasis": "CJA21109"
          }
        }
      },
      "-NOPZRF78IxgehLl5ub5": {
        "apellidos": "CLAUDIA",
        "correo": "clubdeportivo@israelita.com",
        "empresa": "-NOPZBQU3kM6RSrQU--y",
        "fullname": "CLAUDIA CLAUDIA",
        "id": "-NOPZRF78IxgehLl5ub5",
        "no_cliente": "CLCLTO02230101",
        "nombre": "CLAUDIA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5540691283",
        "tipo": "flotilla"
      },
      "-NOQiDcsTX-EPGQjuWMk": {
        "apellidos": "VALLE BOJALIL",
        "correo": "carlosvalle1@hotmail.com",
        "fullname": "CARLOS VALLE BOJALIL",
        "id": "-NOQiDcsTX-EPGQjuWMk",
        "no_cliente": "CAVACU02230102",
        "nombre": "CARLOS",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5511305208",
        "tipo": "particular"
      },
      "-NOR2o6yqHF--LGUUX4c": {
        "apellidos": "MARTINEZ",
        "correo": "compras7@cannon.com.mx",
        "empresa": "-NOR2aZsOfgypsTmt8TY",
        "fullname": "ISEL MARTINEZ",
        "id": "-NOR2o6yqHF--LGUUX4c",
        "no_cliente": "ISMATO02230103",
        "nombre": "ISEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5583452392",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOR32V0zJ3wdlZamRZd": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOR2o6yqHF--LGUUX4c",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NOR32V0zJ3wdlZamRZd",
            "marca": "Chevrolet",
            "modelo": "Spark",
            "no_motor": "1.6 L",
            "placas": "pdj7035",
            "transmision": "Estandar",
            "vinChasis": "HT016782"
          }
        }
      },
      "-NOR4nXPhzXfnr0GT0WD": {
        "apellidos": "MARIA",
        "correo": "mariaimparable@hotmail.com",
        "fullname": "MARIA MARIA",
        "id": "-NOR4nXPhzXfnr0GT0WD",
        "no_cliente": "MAMATO02230104",
        "nombre": "MARIA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5541309726",
        "tipo": "particular",
        "vehiculos": {
          "-NOR5-8v_hlJvjhwKJ8a": {
            "anio": "2015",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOR4nXPhzXfnr0GT0WD",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NOR5-8v_hlJvjhwKJ8a",
            "marca": "Nissan",
            "modelo": "March",
            "no_motor": "1.6 L",
            "placas": "sinpl07",
            "transmision": "Estandar"
          }
        }
      },
      "-NOUxdqS-78L5GWb018g": {
        "apellidos": "CASTRO",
        "correo": "COUCHMAU@GMAIL.COM",
        "fullname": "MAU CASTRO",
        "id": "-NOUxdqS-78L5GWb018g",
        "no_cliente": "MACATO02230105",
        "nombre": "MAU",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5574615324",
        "tipo": "particular",
        "vehiculos": {
          "-NOUyHVOtwkXu1S7ndrh": {
            "anio": "2014",
            "categoria": "Hatchback lujo",
            "cilindros": "4",
            "cliente": "-NOUxdqS-78L5GWb018g",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NOUyHVOtwkXu1S7ndrh",
            "marca": "BMW",
            "modelo": "Serie 1",
            "no_motor": "1.6 L",
            "placas": "SINPL06",
            "transmision": "Estandar"
          }
        }
      },
      "-NOVAzO6qH61PDqK-FZD": {
        "apellidos": "FRANCO",
        "correo": "enriquefrancouvm@gmail.com",
        "fullname": "ENRIQUE  FRANCO",
        "id": "-NOVAzO6qH61PDqK-FZD",
        "no_cliente": "ENFRCU02230106",
        "nombre": "ENRIQUE",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5611541571",
        "tipo": "particular"
      },
      "-NO_UVrGfsXo7G-fT_aw": {
        "apellidos": "Valdez Ortiz",
        "correo": "atencion.personal7@gmail.com",
        "fullname": "Ernesto Valdez Ortiz",
        "id": "-NO_UVrGfsXo7G-fT_aw",
        "no_cliente": "ERVACU02230107",
        "nombre": "Ernesto",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5567070396",
        "tipo": "particular"
      },
      "-NOpkYGEJczvxN2pTntX": {
        "apellidos": "BALTAZAR",
        "correo": "alejandrobaltazar@platinum.com.mx",
        "empresa": "-NOpkMqNv-sjhCeOTn0D",
        "fullname": "ALEJANDRO BALTAZAR",
        "id": "-NOpkYGEJczvxN2pTntX",
        "no_cliente": "ALBATO02230108",
        "nombre": "ALEJANDRO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5537220086",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOpl6JjP7nLb60Da75G": {
            "anio": "2020",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NOpkYGEJczvxN2pTntX",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NOpl6JjP7nLb60Da75G",
            "marca": "Fiat",
            "modelo": "Ducato",
            "no_motor": "2.3 DIESEL",
            "placas": "sinpl08",
            "transmision": "Estandar"
          }
        }
      },
      "-NOv8xtRUKI0nNFNn8bv": {
        "apellidos": "Difumex",
        "correo": "difumexind@gmail.com",
        "empresa": "-NN2jwMclx-WqXdNjF_n",
        "fullname": "Ángeles Difumex",
        "id": "-NOv8xtRUKI0nNFNn8bv",
        "no_cliente": "ÁNDICU02230109",
        "nombre": "Ángeles",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5591944840",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOv9C-u96XdtAEB3Uul": {
            "anio": "2004",
            "categoria": "Carga",
            "cilindros": "8",
            "cliente": "-NOv8xtRUKI0nNFNn8bv",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NOv9C-u96XdtAEB3Uul",
            "marca": "Ford",
            "modelo": "F-350",
            "placas": "6267CK",
            "transmision": "Estandar"
          },
          "-NP3hV4iyWEv7HHviQFH": {
            "anio": "2007",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOv8xtRUKI0nNFNn8bv",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NP3hV4iyWEv7HHviQFH",
            "marca": "Volkswagen",
            "modelo": "Derby",
            "placas": "289uvz",
            "transmision": "Estandar"
          }
        }
      },
      "-NOypGMBcfQoUp9TDDON": {
        "apellidos": "CHAVEZ",
        "correo": "r.chavez@proven.com",
        "empresa": "-NOyoWjr2it3Iihy1NGx",
        "fullname": "RAFAEL  CHAVEZ",
        "id": "-NOypGMBcfQoUp9TDDON",
        "no_cliente": "RACHTO02230110",
        "nombre": "RAFAEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5587933744",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOyq91wBclJPHlqxLzx": {
            "anio": "2020",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOypGMBcfQoUp9TDDON",
            "color": "Rojo intenso",
            "engomado": "amarillo",
            "id": "-NOyq91wBclJPHlqxLzx",
            "marca": "Volkswagen",
            "modelo": "Vento",
            "no_motor": "1.6 L",
            "placas": "z75bfa",
            "transmision": "Estandar"
          }
        }
      },
      "-NOz-Hhs6ycWNl_YENR3": {
        "apellidos": "BARAJAS",
        "correo": "circus@confecciones.com",
        "empresa": "-NOyzwfu1Q72p87CA-Q_",
        "fullname": "GUSTAVO BARAJAS",
        "id": "-NOz-Hhs6ycWNl_YENR3",
        "no_cliente": "GUBATO02230111",
        "nombre": "GUSTAVO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5539901130",
        "tipo": "flotilla",
        "vehiculos": {
          "-NOz0MJLh0L6iJNq_GGq": {
            "anio": "2009",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NOz-Hhs6ycWNl_YENR3",
            "color": "Plata",
            "engomado": "amarillo",
            "id": "-NOz0MJLh0L6iJNq_GGq",
            "marca": "Honda",
            "modelo": "Civic",
            "no_motor": "1.8 L",
            "placas": "186wpt",
            "transmision": "Automatica",
            "vinChasis": "9H955378"
          }
        }
      },
      "-NOzmJNsnW1c_vbi21Fk": {
        "apellidos": "DOMINGUEZ",
        "correo": "cecilia.dominguez@abastecedor.com",
        "empresa": "-NOzlxBGOFJ0A28PZhDu",
        "fullname": "CECILIA  DOMINGUEZ",
        "id": "-NOzmJNsnW1c_vbi21Fk",
        "no_cliente": "CEDOTO02230112",
        "nombre": "CECILIA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5534400905",
        "tipo": "flotilla"
      },
      "-NP-R4ryaUMsFnOlleF2": {
        "apellidos": "Barbosa de Melo",
        "correo": "pr.wagner21@hotmail.com",
        "fullname": "Wagner Barbosa de Melo",
        "id": "-NP-R4ryaUMsFnOlleF2",
        "no_cliente": "WABACO02230113",
        "nombre": "Wagner",
        "sucursal": "-N2glf8hot49dUJYj5WP",
        "telefono_movil": "5548480349",
        "tipo": "particular"
      },
      "-NP2rxjy3eIxWgRqmcOe": {
        "apellidos": "BOONE",
        "correo": "charlyboone@outlook.com",
        "fullname": "CARLOS BOONE",
        "id": "-NP2rxjy3eIxWgRqmcOe",
        "no_cliente": "CABOTO02230114",
        "nombre": "CARLOS",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5518279329",
        "tipo": "particular",
        "vehiculos": {
          "-NP2sA9o7G77n7nxVhKD": {
            "anio": "2019",
            "categoria": "SUV lujo",
            "cilindros": "4",
            "cliente": "-NP2rxjy3eIxWgRqmcOe",
            "color": "Negro",
            "engomado": "azul",
            "id": "-NP2sA9o7G77n7nxVhKD",
            "marca": "GMC",
            "modelo": "Terrain",
            "no_motor": "2.0 L",
            "placas": "sinpl10",
            "transmision": "Automatica"
          },
          "-NP8g9KA0yj7w26cpDlI": {
            "anio": "2012",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NP2rxjy3eIxWgRqmcOe",
            "color": "Plata",
            "engomado": "rojo",
            "id": "-NP8g9KA0yj7w26cpDlI",
            "marca": "Honda",
            "modelo": "Civic",
            "no_motor": "1.6 L",
            "placas": "844xyd",
            "transmision": "Automatica",
            "vinChasis": "ce602164"
          }
        }
      },
      "-NP2uql6hw1p_VygT0jt": {
        "apellidos": "BACA LOPEZ",
        "correo": "alenu@autlook.com",
        "fullname": "ALELI BACA LOPEZ",
        "id": "-NP2uql6hw1p_VygT0jt",
        "no_cliente": "ALBATO02230115",
        "nombre": "ALELI",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "55575626",
        "tipo": "particular",
        "vehiculos": {
          "-NP2vHT7kFjJc8-LHlKc": {
            "anio": "2016",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NP2uql6hw1p_VygT0jt",
            "color": "Amarillo oro",
            "engomado": "rosa",
            "id": "-NP2vHT7kFjJc8-LHlKc",
            "marca": "Chevrolet",
            "modelo": "Trax",
            "no_motor": "1.6 L",
            "placas": "x61ae17",
            "transmision": "Automatica"
          }
        }
      },
      "-NP34QxkpelPMhSmhMZc": {
        "apellidos": "PEREZ",
        "correo": "faviolaperez.18@gmail.com",
        "fullname": "SONIA FABIOLA PEREZ",
        "id": "-NP34QxkpelPMhSmhMZc",
        "no_cliente": "SOPETO02230116",
        "nombre": "SONIA FABIOLA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5517567244",
        "tipo": "particular",
        "vehiculos": {
          "-NP34rjywuorDeX7v_jQ": {
            "anio": "2019",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NP34QxkpelPMhSmhMZc",
            "color": "Otros",
            "engomado": "verde",
            "id": "-NP34rjywuorDeX7v_jQ",
            "marca": "KIA",
            "modelo": "Soul",
            "no_motor": "2.0L",
            "placas": "sinpl11",
            "transmision": "Automatica"
          }
        }
      },
      "-NP35DJByn-5NvyP3efM": {
        "apellidos": "Hernández",
        "correo": "arhernandez@sggroup.com.mx",
        "empresa": "",
        "fullname": "Arturo  Hernández",
        "id": "-NP35DJByn-5NvyP3efM",
        "no_cliente": "ARHECU02230116",
        "nombre": "Arturo",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5563161692",
        "tipo": "particular"
      },
      "-NP8gdMatE2bnCAprfWe": {
        "apellidos": "Perea",
        "correo": "lperea6879@gmail.com",
        "fullname": "Alberto Perea",
        "id": "-NP8gdMatE2bnCAprfWe",
        "no_cliente": "ALPECU02230118",
        "nombre": "Alberto",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5522459349",
        "tipo": "particular",
        "vehiculos": {
          "-NP8hjMZohvR-Lqn88vp": {
            "anio": "2013",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NP8gdMatE2bnCAprfWe",
            "color": "Gris",
            "engomado": "amarillo",
            "id": "-NP8hjMZohvR-Lqn88vp",
            "marca": "Ford",
            "modelo": "Escape",
            "placas": "peh1625",
            "transmision": "Automatica"
          }
        }
      },
      "-NP8hUfyDg2e0tKoVs8s": {
        "apellidos": "CHARLY",
        "correo": "CHARLY62@HOTMAIL.COM",
        "fullname": "CHARLY CHARLY",
        "id": "-NP8hUfyDg2e0tKoVs8s",
        "no_cliente": "CHCHTO02230119",
        "nombre": "CHARLY",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5534112162",
        "tipo": "particular",
        "vehiculos": {
          "-NP8hhQrsEsnZSKdqRzp": {
            "anio": "2015",
            "categoria": "Camioneta",
            "cilindros": "6",
            "cliente": "-NP8hUfyDg2e0tKoVs8s",
            "color": "Plata",
            "engomado": "verde",
            "id": "-NP8hhQrsEsnZSKdqRzp",
            "marca": "Chrysler",
            "modelo": "Town & Country",
            "no_motor": "3.8 L",
            "placas": "SINPL12",
            "transmision": "Automatica"
          }
        }
      },
      "-NP8ig4qmwOCiYrnq4Pm": {
        "apellidos": "RAMIREZ M.",
        "correo": "jjramirezm@gmail.com",
        "fullname": "J. JAIME RAMIREZ M.",
        "id": "-NP8ig4qmwOCiYrnq4Pm",
        "no_cliente": "J.RATO02230120",
        "nombre": "J. JAIME",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5512590580",
        "tipo": "particular",
        "vehiculos": {
          "-NP8jfAvnN8TFiLJl7EC": {
            "anio": "2015",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NP8ig4qmwOCiYrnq4Pm",
            "color": "Negro",
            "engomado": "rojo",
            "id": "-NP8jfAvnN8TFiLJl7EC",
            "marca": "Volkswagen",
            "modelo": "Crossfox",
            "no_motor": "1.6 L",
            "placas": "sinpl13",
            "transmision": "Estandar"
          }
        }
      },
      "-NPNm-FzOi8o4_kNK6Xp": {
        "apellidos": "EDGAR",
        "correo": "edgar_edgar@gmail.com",
        "fullname": "EDGAR EDGAR",
        "id": "-NPNm-FzOi8o4_kNK6Xp",
        "no_cliente": "EDEDTO02230121",
        "nombre": "EDGAR",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5563552757",
        "tipo": "particular",
        "vehiculos": {
          "-NPNmCS7-XKmdCaQ30n3": {
            "anio": "2017",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NPNm-FzOi8o4_kNK6Xp",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NPNmCS7-XKmdCaQ30n3",
            "marca": "Ford",
            "modelo": "Figo",
            "no_motor": "1.6 L",
            "placas": "sinpl14",
            "transmision": "Estandar"
          }
        }
      },
      "-NPO-E8aEFK2DbYrmtnd": {
        "apellidos": "SALGADO",
        "correo": "sacbe99@gmail.com",
        "fullname": "ARTURO SALGADO",
        "id": "-NPO-E8aEFK2DbYrmtnd",
        "no_cliente": "ARSACU02230122",
        "nombre": "ARTURO",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5534510065",
        "tipo": "particular",
        "vehiculos": {
          "-NPOWXBSwBpKuijY0ewR": {
            "anio": "2010",
            "categoria": "Camioneta",
            "cilindros": "6",
            "cliente": "-NPO-E8aEFK2DbYrmtnd",
            "color": "Rojo intenso",
            "engomado": "azul",
            "id": "-NPOWXBSwBpKuijY0ewR",
            "marca": "Chevrolet",
            "modelo": "Colorado",
            "placas": "259-WUU",
            "transmision": "Automatica"
          }
        }
      },
      "-NPU1Ll-xpVK6bLwpJIw": {
        "apellidos": "SANCHEZ",
        "correo": "mibuen_zor@gmail.com",
        "fullname": "FRANCISCO JAVIER SANCHEZ",
        "id": "-NPU1Ll-xpVK6bLwpJIw",
        "no_cliente": "FRSATO03230123",
        "nombre": "FRANCISCO JAVIER",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5516450557",
        "tipo": "particular",
        "vehiculos": {
          "-NPU27PsJS-MdC1eG48z": {
            "anio": "2005",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NPU1Ll-xpVK6bLwpJIw",
            "color": "Gris",
            "engomado": "rosa",
            "id": "-NPU27PsJS-MdC1eG48z",
            "marca": "Honda",
            "modelo": "Accord",
            "no_motor": "2.4L",
            "placas": "567thh",
            "transmision": "Automatica"
          }
        }
      },
      "-NPZCwpGia-hgQ5MfNp_": {
        "apellidos": "SAAVEDRA",
        "correo": "HECTORSAAVEDRA@GMAIL.COM",
        "fullname": "HECTOR SAAVEDRA",
        "id": "-NPZCwpGia-hgQ5MfNp_",
        "no_cliente": "HESATO03230124",
        "nombre": "HECTOR",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5621293323",
        "tipo": "particular",
        "vehiculos": {
          "-NPZEZezqhMXKj2sFzby": {
            "anio": "2022",
            "categoria": "SUV lujo",
            "cilindros": "6",
            "cliente": "-NPZCwpGia-hgQ5MfNp_",
            "color": "Verde oscuro",
            "engomado": "verde",
            "id": "-NPZEZezqhMXKj2sFzby",
            "marca": "Jeep",
            "modelo": "Cherokke",
            "no_motor": "3.6 L",
            "placas": "SUN PL1",
            "transmision": "Automatica"
          }
        }
      },
      "-NPdhgVa3J4YhtY7XswX": {
        "apellidos": "OCAMPO MX",
        "correo": "gestion.compras@ocampo.mx",
        "empresa": "-NPdhPjsoun8NuO_ZJf1",
        "fullname": "JOCE OCIEL ROSAS",
        "id": "-NPdhgVa3J4YhtY7XswX",
        "no_cliente": "JOROCU03230125",
        "nombre": "AGENCIA ADUANAL",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5530196218",
        "tipo": "flotilla",
        "vehiculos": {
          "-NPdi8xTFpaFyLE85UO0": {
            "anio": "2016",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NPdhgVa3J4YhtY7XswX",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NPdi8xTFpaFyLE85UO0",
            "marca": "Mercedes Benz",
            "modelo": "Clase GLA",
            "placas": "U08AEU",
            "transmision": "Automatica"
          },
          "-NPxW7HI9ey1vp_DwkHk": {
            "anio": "2018",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NPdhgVa3J4YhtY7XswX",
            "color": "Otros",
            "engomado": "rosa",
            "id": "-NPxW7HI9ey1vp_DwkHk",
            "marca": "Volkswagen",
            "modelo": "Tiguan",
            "placas": "W38ASD",
            "transmision": "Automatica"
          }
        }
      },
      "-NPxbrDp-KvAfzLHn4lo": {
        "apellidos": "7209",
        "correo": "IPA7209@HOTMAIL.COM",
        "fullname": "IPA 7209",
        "id": "-NPxbrDp-KvAfzLHn4lo",
        "no_cliente": "IP72TO03230126",
        "nombre": "IPA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5520206834",
        "tipo": "particular",
        "vehiculos": {
          "-NPxca3Eb7VGhw6QYwfp": {
            "anio": "2017",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NPxbrDp-KvAfzLHn4lo",
            "color": "Plata",
            "engomado": "verde",
            "id": "-NPxca3Eb7VGhw6QYwfp",
            "marca": "SEAT",
            "modelo": "Ibiza",
            "no_motor": "1.6 L",
            "placas": "SINP011",
            "transmision": "Estandar"
          }
        }
      },
      "-NQ2FuiTdWW4VDaaoMxg": {
        "apellidos": "ROMERO",
        "correo": "urielromerojeep@gmail.com",
        "fullname": "URIEL  ROMERO",
        "id": "-NQ2FuiTdWW4VDaaoMxg",
        "no_cliente": "URROTO03230127",
        "nombre": "URIEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5531755012",
        "tipo": "particular",
        "vehiculos": {
          "-NQ2GjprsXhmv46gqny8": {
            "anio": "2014",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NQ2FuiTdWW4VDaaoMxg",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NQ2GjprsXhmv46gqny8",
            "marca": "Jeep",
            "modelo": "Patriot",
            "no_motor": "2.4L",
            "placas": "lwb601a",
            "transmision": "Automatica",
            "vinChasis": "ED586925"
          }
        }
      },
      "-NQ6_clm9jgINu_gkmj2": {
        "apellidos": "ANGELES",
        "correo": "richard1212angeles@yahoo.com",
        "fullname": "RICARDO ANGELES",
        "id": "-NQ6_clm9jgINu_gkmj2",
        "no_cliente": "RIANTO03230128",
        "nombre": "RICARDO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5621923336",
        "tipo": "particular"
      },
      "-NQAruiYE64gyTyktnSI": {
        "apellidos": "HERNANDEZ",
        "correo": "maximino.hernandez@gmail.com",
        "fullname": "MAXIMINO HERNANDEZ",
        "id": "-NQAruiYE64gyTyktnSI",
        "no_cliente": "MAHETO03230129",
        "nombre": "MAXIMINO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5515921196",
        "tipo": "particular",
        "vehiculos": {
          "-NQAs9jiCiDD1NAYaoPN": {
            "anio": "2015",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NQAruiYE64gyTyktnSI",
            "color": "Plata",
            "engomado": "rojo",
            "id": "-NQAs9jiCiDD1NAYaoPN",
            "marca": "SEAT",
            "modelo": "Ibiza",
            "no_motor": "gasolina",
            "placas": "sinp03",
            "transmision": "Estandar"
          }
        }
      },
      "-NQBAodVkA5Z9_JIFoNh": {
        "apellidos": "BELL",
        "correo": "erick.belle@gmail.com",
        "fullname": "ERICK BELL",
        "id": "-NQBAodVkA5Z9_JIFoNh",
        "no_cliente": "ERBETO03230130",
        "nombre": "ERICK",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5539892687",
        "tipo": "particular",
        "vehiculos": {
          "-NQBAyJ8KAZZYbSKo9jc": {
            "anio": "2017",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NQBAodVkA5Z9_JIFoNh",
            "color": "Negro",
            "engomado": "rojo",
            "id": "-NQBAyJ8KAZZYbSKo9jc",
            "marca": "KIA",
            "modelo": "Sportage",
            "no_motor": "2.4l",
            "placas": "simpl04",
            "transmision": "Automatica"
          }
        }
      },
      "-NQBDRcauOL2tj2n7QpF": {
        "apellidos": "LÓPEZ",
        "correo": "logan26axel@gmail.com",
        "fullname": "FANCISCO HIPOLITO LÓPEZ",
        "id": "-NQBDRcauOL2tj2n7QpF",
        "no_cliente": "FALÓCU03230131",
        "nombre": "FANCISCO HIPOLITO",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5527026080",
        "tipo": "particular"
      },
      "-NQBU6TfyYPeNmP87q2O": {
        "apellidos": "BARRERA",
        "correo": "gabm77@hotmail.com",
        "fullname": "RODRIGO  BARRERA",
        "id": "-NQBU6TfyYPeNmP87q2O",
        "no_cliente": "ROBACO03230132",
        "nombre": "RODRIGO",
        "sucursal": "-N2glf8hot49dUJYj5WP",
        "telefono_movil": "5538810898",
        "tipo": "particular",
        "vehiculos": {
          "-NQBWr3-45ZiLeApZUV3": {
            "anio": "2015",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NQBU6TfyYPeNmP87q2O",
            "color": "Plata",
            "engomado": "rosa",
            "id": "-NQBWr3-45ZiLeApZUV3",
            "marca": "Infiniti",
            "modelo": "Q50",
            "placas": "NWN8428",
            "transmision": "Automatica"
          }
        }
      },
      "-NQCbqyYySvnPBdwjH_e": {
        "apellidos": "GARCIA TAPIA",
        "correo": "oscar.garcia@tvazteca.com",
        "empresa": "-NQCayeafrPC6tn4i28E",
        "fullname": "OSCAR  ALBERTO GARCIA TAPIA",
        "id": "-NQCbqyYySvnPBdwjH_e",
        "no_cliente": "OSGATO03230133",
        "nombre": "OSCAR  ALBERTO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5530294542",
        "tipo": "flotilla",
        "vehiculos": {
          "-NQCcmQ0_d0UPRtedQDh": {
            "anio": "2012",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NQCbqyYySvnPBdwjH_e",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NQCcmQ0_d0UPRtedQDh",
            "marca": "Chevrolet",
            "modelo": "Aveo",
            "no_motor": "1.6L",
            "placas": "pxc272c",
            "transmision": "Estandar"
          }
        }
      },
      "-NQQknx6ZGpBgzOU_5B-": {
        "apellidos": "MONROY",
        "correo": "imael.mosroy@bancodemexico.com",
        "empresa": "-NQQkUW8L8XLsYZ5IuID",
        "fullname": "ISMAEL MONROY",
        "id": "-NQQknx6ZGpBgzOU_5B-",
        "no_cliente": "ISMOTO03230134",
        "nombre": "ISMAEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5564495744",
        "tipo": "flotilla",
        "vehiculos": {
          "-NQQlG5jU-yaoKhWn6IU": {
            "anio": "2013",
            "categoria": "Carga",
            "cilindros": "4",
            "cliente": "-NQQknx6ZGpBgzOU_5B-",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NQQlG5jU-yaoKhWn6IU",
            "marca": "Hyundai",
            "modelo": "H100",
            "no_motor": "2.4L",
            "placas": "704zes",
            "transmision": "Estandar",
            "vinChasis": "eu590163"
          }
        }
      },
      "-NQRZO74-1z2FRZhRNBi": {
        "apellidos": "Moctezuma",
        "correo": "jonathan.moctezuma81@gmail.com",
        "fullname": "Jonathan Moctezuma",
        "id": "-NQRZO74-1z2FRZhRNBi",
        "no_cliente": "JOMOCU03230135",
        "nombre": "Jonathan",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5516505522",
        "tipo": "particular",
        "vehiculos": {
          "-NQRZodn5rCmLQfdzbLd": {
            "anio": "2010",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NQRZO74-1z2FRZhRNBi",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NQRZodn5rCmLQfdzbLd",
            "marca": "Mazda",
            "modelo": "6",
            "placas": "551WXZ",
            "transmision": "Automatica"
          }
        }
      },
      "-NQaGBYAYu_NRJj9efAU": {
        "apellidos": "DIEX",
        "correo": "DIEX.DIEX@GMAIL.COM",
        "fullname": "DIEX DIEX",
        "id": "-NQaGBYAYu_NRJj9efAU",
        "no_cliente": "DIDITO03230136",
        "nombre": "DIEX",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5527096403",
        "tipo": "particular",
        "vehiculos": {
          "-NQaGgbJoByF4AnsrE-C": {
            "anio": "2018",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NQaGBYAYu_NRJj9efAU",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NQaGgbJoByF4AnsrE-C",
            "marca": "Mazda",
            "modelo": "3",
            "no_motor": "2.0L",
            "placas": "SINPL15",
            "transmision": "Automatica"
          }
        }
      },
      "-NQaTvcrnUCpkYE3RU7n": {
        "apellidos": "LAFORCADE",
        "correo": "julise.lafrocade@hormail.com",
        "fullname": "JULISE LAFORCADE",
        "id": "-NQaTvcrnUCpkYE3RU7n",
        "no_cliente": "JULATO03230137",
        "nombre": "JULISE",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5551015363",
        "tipo": "particular",
        "vehiculos": {
          "-NQaUJpIAN_ZZI2-QWYd": {
            "anio": "2016",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NQaTvcrnUCpkYE3RU7n",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NQaUJpIAN_ZZI2-QWYd",
            "marca": "Nissan",
            "modelo": "X-trail",
            "no_motor": "2.5L",
            "placas": "m70akv",
            "transmision": "Automatica"
          }
        }
      },
      "-NQbCWtfliTctI_eJqXC": {
        "apellidos": "Fernandez Irineo",
        "correo": "gonzalo_fdz@yahoo.com",
        "fullname": "Gonzalo Fernandez Irineo",
        "id": "-NQbCWtfliTctI_eJqXC",
        "no_cliente": "GOFECU03230138",
        "nombre": "Gonzalo",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5580556147",
        "tipo": "particular",
        "vehiculos": {
          "-NQbDH81TKnO9ZCLCh-Y": {
            "anio": "2016",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NQbCWtfliTctI_eJqXC",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NQbDH81TKnO9ZCLCh-Y",
            "marca": "Nissan",
            "modelo": "X-trail",
            "placas": "PWE480B",
            "transmision": "Automatica"
          }
        }
      },
      "-NQekjBJN2KYHoYf0-j-": {
        "apellidos": "ROJANO",
        "correo": "arturo.rojano@hotmail.com",
        "fullname": "ARTURO ROJANO",
        "id": "-NQekjBJN2KYHoYf0-j-",
        "no_cliente": "ARROTO03230139",
        "nombre": "ARTURO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5522719580",
        "tipo": "particular",
        "vehiculos": {
          "-NQelUsx7te2uUr6gPsg": {
            "anio": "2017",
            "categoria": "SUV lujo",
            "cilindros": "6",
            "cliente": "-NQekjBJN2KYHoYf0-j-",
            "color": "Negro",
            "engomado": "verde",
            "id": "-NQelUsx7te2uUr6gPsg",
            "marca": "Volvo",
            "modelo": "XC60",
            "no_motor": "GASOLINA",
            "placas": "simpl12",
            "transmision": "Automatica"
          }
        }
      },
      "-NQenFQcNhNUJgjnigXP": {
        "apellidos": "JUAN",
        "correo": "juan.juan@gmail.com",
        "fullname": "JUAN JUAN",
        "id": "-NQenFQcNhNUJgjnigXP",
        "no_cliente": "JUJUTO03230140",
        "nombre": "JUAN",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5539981782",
        "tipo": "particular"
      },
      "-NQeyObJtVBBNTTRWuS4": {
        "apellidos": "KAMBLI",
        "correo": "kabogados@hotmail.com",
        "fullname": "CARLOS  KAMBLI",
        "id": "-NQeyObJtVBBNTTRWuS4",
        "no_cliente": "CAKATO03230141",
        "nombre": "CARLOS",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5534240328",
        "tipo": "particular",
        "vehiculos": {
          "-NQeyfygF3yJEfmkXJ0F": {
            "anio": "2012",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NQeyObJtVBBNTTRWuS4",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NQeyfygF3yJEfmkXJ0F",
            "marca": "Nissan",
            "modelo": "Altima",
            "no_motor": "2.5L",
            "placas": "sinpl17",
            "transmision": "Automatica"
          }
        }
      },
      "-NQfRL5fiA8tQlI1mxbi": {
        "apellidos": "GAMA",
        "correo": "pgama@proyectatex.com",
        "empresa": "-NQfR5QDgWeQVB3lJiGg",
        "fullname": "PATRICIA GAMA",
        "id": "-NQfRL5fiA8tQlI1mxbi",
        "no_cliente": "PAGATO03230142",
        "nombre": "PATRICIA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5561648546",
        "tipo": "flotilla",
        "vehiculos": {
          "-NQfRXuTIX47vUEQTrW6": {
            "anio": "2011",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NQfRL5fiA8tQlI1mxbi",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NQfRXuTIX47vUEQTrW6",
            "marca": "Dodge",
            "modelo": "Attitude",
            "no_motor": "1.4L",
            "placas": "sinpl18",
            "transmision": "Estandar"
          }
        }
      },
      "-NQflfvxKswYdwilIwLR": {
        "apellidos": "ZAMUDIO",
        "correo": "gabriel.zamudio@aoutlook.com",
        "fullname": "GABRIEL ZAMUDIO",
        "id": "-NQflfvxKswYdwilIwLR",
        "no_cliente": "GAZATO03230143",
        "nombre": "GABRIEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5526759779",
        "tipo": "particular",
        "vehiculos": {
          "-NQfm3ns8X51f4nC-lvb": {
            "anio": "2015",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NQflfvxKswYdwilIwLR",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NQfm3ns8X51f4nC-lvb",
            "marca": "Nissan",
            "modelo": "Sentra",
            "no_motor": "1.8L",
            "placas": "ngu4313",
            "transmision": "Automatica"
          }
        }
      },
      "-NQgAgmAXe7P7GVPeHtw": {
        "apellidos": "VARGAS",
        "correo": "isa_vargas05@hotmail.com",
        "fullname": "ISABEL  VARGAS",
        "id": "-NQgAgmAXe7P7GVPeHtw",
        "no_cliente": "ISVACU03230144",
        "nombre": "ISABEL",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5570467464",
        "tipo": "particular",
        "vehiculos": {
          "-NQgB6OV3TgsdvV1NPNL": {
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
        }
      },
      "-NQkFCPhYVbsc2C6KqTt": {
        "apellidos": "Segura",
        "correo": "atención_clientes@speed-service.com.mx",
        "dataFacturacion": {
          "unica": {
            "razon": "Nueva empresa",
            "rfc": "OOLL940915MF5"
          }
        },
        "fullname": "Karla Segura",
        "id": "-NQkFCPhYVbsc2C6KqTt",
        "no_cliente": "KASECU03230145",
        "nombre": "Karla",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5519335566",
        "tipo": "particular",
        "vehiculos": {
          "-NQkFPNn04vOvtW-DDTi": {
            "anio": "2007",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NQkFCPhYVbsc2C6KqTt",
            "color": "Azul oscuro",
            "engomado": "rojo",
            "id": "-NQkFPNn04vOvtW-DDTi",
            "marca": "Volkswagen",
            "modelo": "Beetle",
            "placas": "163UAA",
            "transmision": "Automatica"
          },
          "-NUwQQZFJoWkBn4nhL8g": {
            "anio": "2020",
            "categoria": "Sedán lujo",
            "cilindros": "4",
            "cliente": "-NQkFCPhYVbsc2C6KqTt",
            "color": "Rojo intenso",
            "engomado": "amarillo",
            "id": "-NUwQQZFJoWkBn4nhL8g",
            "marca": "Aston Martín",
            "modelo": "DBS",
            "placas": "fgg5475"
          }
        }
      },
      "-NQkoIsr-k5XvYK9Obbv": {
        "apellidos": "velazquez",
        "fullname": "ramiro velazquez",
        "id": "-NQkoIsr-k5XvYK9Obbv",
        "no_cliente": "RAVECU03230146",
        "nombre": "ramiro",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5523232222",
        "tipo": "particular",
        "vehiculos": {
          "-NQkoND-FdUjEmorlgSi": {
            "anio": "2018",
            "categoria": "Coupé lujo",
            "cilindros": "4",
            "cliente": "-NQkoIsr-k5XvYK9Obbv",
            "color": "Naranja",
            "engomado": "amarillo",
            "id": "-NQkoND-FdUjEmorlgSi",
            "marca": "Alfa Romeo",
            "modelo": "Stelvio",
            "placas": "JUF4656"
          }
        }
      },
      "-NQl5QLyDnhoCziDnGfC": {
        "apellidos": "PAEDES",
        "correo": "almacen@cinecolor.com.mx",
        "empresa": "-NQl5EVPHVq1GZnBYEqs",
        "fullname": "ISRAEL PAEDES",
        "id": "-NQl5QLyDnhoCziDnGfC",
        "no_cliente": "ISPATO03230147",
        "nombre": "ISRAEL",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5561948781",
        "tipo": "flotilla",
        "vehiculos": {
          "-NQl5h4o3_0syzuUoxao": {
            "anio": "2012",
            "categoria": "Van",
            "cilindros": "8",
            "cliente": "-NQl5QLyDnhoCziDnGfC",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NQl5h4o3_0syzuUoxao",
            "marca": "Chevrolet",
            "modelo": "Express ",
            "no_motor": "4.7l",
            "placas": "158yhw",
            "transmision": "Automatica"
          }
        }
      },
      "-NR3vGUDnOgaNnSEa4xE": {
        "apellidos": "CRUZ DELGADO",
        "correo": "sercrudel@hotmail.com",
        "fullname": "SERGIO CRUZ DELGADO",
        "id": "-NR3vGUDnOgaNnSEa4xE",
        "no_cliente": "SECRTO03230148",
        "nombre": "SERGIO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5532729604",
        "tipo": "particular",
        "vehiculos": {
          "-NR3vamfYu3bx5vErQXc": {
            "anio": "2012",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NR3vGUDnOgaNnSEa4xE",
            "color": "Gris",
            "engomado": "rojo",
            "id": "-NR3vamfYu3bx5vErQXc",
            "marca": "Chevrolet",
            "modelo": "Tornado ",
            "no_motor": "1.8L",
            "placas": "nhf7724",
            "transmision": "Estandar",
            "vinChasis": "cb139937"
          }
        }
      },
      "-NR4lPXzCD6FBYP9r4TR": {
        "apellidos": "GODINEZ",
        "correo": "luisfergo@gmail.com",
        "fullname": "LUIS FERNANDO GODINEZ",
        "id": "-NR4lPXzCD6FBYP9r4TR",
        "no_cliente": "LUGOTO03230149",
        "nombre": "LUIS FERNANDO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5512440598",
        "tipo": "particular"
      },
      "-NR5gCipmzeLlQQok48C": {
        "apellidos": "PAKETTE",
        "correo": "pakette@gmail.com",
        "fullname": "PAKETTE PAKETTE",
        "id": "-NR5gCipmzeLlQQok48C",
        "no_cliente": "PAPATO03230150",
        "nombre": "PAKETTE",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5539485271",
        "tipo": "particular",
        "vehiculos": {
          "-NR5gYhV6_wnMXXq1kla": {
            "anio": "2017",
            "categoria": "Coupé lujo",
            "cilindros": "4",
            "cliente": "-NR5gCipmzeLlQQok48C",
            "color": "Negro",
            "engomado": "amarillo",
            "id": "-NR5gYhV6_wnMXXq1kla",
            "marca": "BMW",
            "modelo": "Serie 3",
            "no_motor": "2.0L",
            "placas": "sinpl16",
            "transmision": "Automatica"
          }
        }
      },
      "-NR9EaYv9qv6vR6Gys8Z": {
        "apellidos": "VIAU GOMEZ",
        "correo": "viaugomoscar@hotmail.com",
        "fullname": "OSCAR VIAU GOMEZ",
        "id": "-NR9EaYv9qv6vR6Gys8Z",
        "no_cliente": "OSVITO03230151",
        "nombre": "OSCAR",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5576413725",
        "tipo": "particular",
        "vehiculos": {
          "-NR9EpZX2ZSJ3J7DrT3_": {
            "anio": "2012",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NR9EaYv9qv6vR6Gys8Z",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NR9EpZX2ZSJ3J7DrT3_",
            "marca": "Ford",
            "modelo": "Fusión",
            "no_motor": "1.6 L",
            "placas": "191ylb",
            "transmision": "Automatica",
            "vinChasis": "cr100482"
          }
        }
      },
      "-NR9es11RSd7_SXx0RmA": {
        "apellidos": "ORTIZ",
        "correo": "mario.ortiz94@gmail.com",
        "fullname": "MARIO ORTIZ",
        "id": "-NR9es11RSd7_SXx0RmA",
        "no_cliente": "MAORTO03230152",
        "nombre": "MARIO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5571124653",
        "tipo": "particular",
        "vehiculos": {
          "-NR9fLlEPTKxCQ9S-HUm": {
            "anio": "2009",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NR9es11RSd7_SXx0RmA",
            "color": "Blanco",
            "engomado": "rosa",
            "id": "-NR9fLlEPTKxCQ9S-HUm",
            "marca": "Chevrolet",
            "modelo": "Chevy",
            "no_motor": "1.6L",
            "placas": "ncz7728",
            "transmision": "Estandar",
            "vinChasis": "9S141487"
          }
        }
      },
      "-NR9vBTtZpwlXX_b00Oo": {
        "apellidos": "SANTIAGO MATA",
        "correo": "polosanti@gmail.com",
        "fullname": "LEOPOLDO SANTIAGO MATA",
        "id": "-NR9vBTtZpwlXX_b00Oo",
        "no_cliente": "LESATO03230153",
        "nombre": "LEOPOLDO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5529514632",
        "tipo": "particular"
      },
      "-NRG3Z_KHvEF0DvWQi4u": {
        "apellidos": "PEÑA",
        "correo": "elena.peña@gmail.com",
        "fullname": "ELENA PEÑA",
        "id": "-NRG3Z_KHvEF0DvWQi4u",
        "no_cliente": "ELPETO03230154",
        "nombre": "ELENA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5529407055",
        "tipo": "particular",
        "vehiculos": {
          "-NRG3viJWSgsdq8yJ9mV": {
            "anio": "2016",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NRG3Z_KHvEF0DvWQi4u",
            "color": "Negro",
            "engomado": "azul",
            "id": "-NRG3viJWSgsdq8yJ9mV",
            "marca": "Chevrolet",
            "modelo": "Trax",
            "no_motor": "1.6L",
            "placas": "sinpl20",
            "transmision": "Automatica"
          }
        }
      },
      "-NRG6o7VZlWg9-CFipIU": {
        "apellidos": "JESUS",
        "correo": "jesus.jesus@gmail.com",
        "fullname": "JESUS JESUS",
        "id": "-NRG6o7VZlWg9-CFipIU",
        "no_cliente": "JEJETO03230155",
        "nombre": "JESUS",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5535668709",
        "tipo": "particular",
        "vehiculos": {
          "-NRG7CDU3nWZzMZFjelH": {
            "anio": "2014",
            "categoria": "Hatchback",
            "cilindros": "4",
            "cliente": "-NRG6o7VZlWg9-CFipIU",
            "color": "Blanco",
            "engomado": "verde",
            "id": "-NRG7CDU3nWZzMZFjelH",
            "marca": "SEAT",
            "modelo": "Ibiza",
            "no_motor": "GASOLINA",
            "placas": "sinpl21",
            "transmision": "Estandar"
          }
        }
      },
      "-NRJlQ9F9kHO92frHG_3": {
        "apellidos": "Ortinez Rojas",
        "correo": "benortinez@hotmail.com",
        "fullname": "Benjamín  Ortinez Rojas",
        "id": "-NRJlQ9F9kHO92frHG_3",
        "no_cliente": "BEORCU03230156",
        "nombre": "Benjamín",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5627149977",
        "tipo": "particular"
      },
      "-NRL0m0-GIS6KQdkPI7p": {
        "apellidos": "SANCHEZ",
        "correo": "gaby.sanchez@gmail.com",
        "fullname": "GABRIELA SANCHEZ",
        "id": "-NRL0m0-GIS6KQdkPI7p",
        "no_cliente": "GASATO03230157",
        "nombre": "GABRIELA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5551045355",
        "tipo": "particular"
      },
      "-NRL2HqpVWvN5Ydmr_vn": {
        "apellidos": "CRUZ",
        "correo": "luis.cruz@hotmail.com",
        "fullname": "LUIS  CRUZ",
        "id": "-NRL2HqpVWvN5Ydmr_vn",
        "no_cliente": "LUCRTO03230158",
        "nombre": "LUIS",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5567020100",
        "tipo": "particular",
        "vehiculos": {
          "-NRL2Q_sULLzPp-3nLie": {
            "anio": "2016",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NRL2HqpVWvN5Ydmr_vn",
            "color": "Plata",
            "engomado": "verde",
            "id": "-NRL2Q_sULLzPp-3nLie",
            "marca": "Chevrolet",
            "modelo": "Aveo",
            "no_motor": "1.6L",
            "placas": "sinpl22",
            "transmision": "Estandar"
          }
        }
      },
      "-NROK0Uz6ln7SRZWkbo6": {
        "apellidos": "Castillo",
        "correo": "ivancastillomadic@gmail.com",
        "fullname": "Ivan  Castillo",
        "id": "-NROK0Uz6ln7SRZWkbo6",
        "no_cliente": "IVCACU03230159",
        "nombre": "Ivan",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5520853535",
        "tipo": "particular",
        "vehiculos": {
          "-NROLMG6htn718oTR-Uz": {
            "anio": "2004",
            "categoria": "Van",
            "cilindros": "6",
            "cliente": "-NROK0Uz6ln7SRZWkbo6",
            "color": "Marrón claro",
            "engomado": "azul",
            "id": "-NROLMG6htn718oTR-Uz",
            "marca": "Ford",
            "modelo": "Freestar",
            "placas": "NJH 60",
            "transmision": "Automatica"
          }
        }
      },
      "-NROeqbb9u6Pus5216Ou": {
        "apellidos": "CARBAJAL",
        "correo": "cp-cc@yahoo.com",
        "fullname": "CARLOS CARBAJAL",
        "id": "-NROeqbb9u6Pus5216Ou",
        "no_cliente": "CACATO03230160",
        "nombre": "CARLOS",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5559914652",
        "tipo": "particular",
        "vehiculos": {
          "-NROf0foWZxFb3M8A0eX": {
            "anio": "2014",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NROeqbb9u6Pus5216Ou",
            "color": "Plata",
            "engomado": "rosa",
            "id": "-NROf0foWZxFb3M8A0eX",
            "marca": "Nissan",
            "modelo": "Tiida",
            "no_motor": "1.6L",
            "placas": "mjz2448",
            "transmision": "Estandar"
          }
        }
      },
      "-NROgFxR38_1hTZyMK40": {
        "apellidos": "SANTIAGO",
        "correo": "santiago.santiago@gmail.com",
        "fullname": "SANTIAGO SANTIAGO",
        "id": "-NROgFxR38_1hTZyMK40",
        "no_cliente": "SASATO03230161",
        "nombre": "SANTIAGO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5541417506",
        "tipo": "particular",
        "vehiculos": {
          "-NROgSd2MJl5PKDaZ4Uc": {
            "anio": "2014",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NROgFxR38_1hTZyMK40",
            "color": "Verde oscuro",
            "engomado": "rojo",
            "id": "-NROgSd2MJl5PKDaZ4Uc",
            "marca": "Jeep",
            "modelo": "Patriot",
            "no_motor": "2.4L",
            "placas": "sinpl23",
            "transmision": "Automatica"
          }
        }
      },
      "-NRYZTij41PWHI-yvb3h": {
        "apellidos": "LOGISTICA",
        "correo": "logistica@nauclapan.com",
        "fullname": "RODRIGO LOGISTICA",
        "id": "-NRYZTij41PWHI-yvb3h",
        "no_cliente": "ROLOTO03230162",
        "nombre": "RODRIGO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "3315996681",
        "tipo": "particular",
        "vehiculos": {
          "-NRYZoqdIJGceIZlUPw6": {
            "anio": "2016",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NRYZTij41PWHI-yvb3h",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NRYZoqdIJGceIZlUPw6",
            "marca": "Nissan",
            "modelo": "NP300",
            "no_motor": "2.5L",
            "placas": "sinpl24",
            "transmision": "Estandar"
          }
        }
      },
      "-NRYbcOQqLPbyzyR4S2U": {
        "apellidos": "FER",
        "correo": "fer@fer.com",
        "fullname": "FER FER",
        "id": "-NRYbcOQqLPbyzyR4S2U",
        "no_cliente": "FEFETO03230163",
        "nombre": "FER",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5546602224",
        "tipo": "particular"
      },
      "-NRZHcUIcb_VrdDmvDcg": {
        "apellidos": "RICO RICO",
        "correo": "gera.rico.r@gmail.com",
        "fullname": "GERARDO RICO RICO",
        "id": "-NRZHcUIcb_VrdDmvDcg",
        "no_cliente": "GERITO03230164",
        "nombre": "GERARDO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5514349905",
        "tipo": "particular",
        "vehiculos": {
          "-NRZHshc1vZKqRrGO8oU": {
            "anio": "2017",
            "categoria": "Van",
            "cilindros": "4",
            "cliente": "-NRZHcUIcb_VrdDmvDcg",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NRZHshc1vZKqRrGO8oU",
            "marca": "Toyota ",
            "modelo": "Avanza",
            "no_motor": "1.6 L",
            "placas": "pcx1934",
            "transmision": "Automatica",
            "vinChasis": "HK016107"
          }
        }
      },
      "-NRZqlMqo0fxVbxXWQPK": {
        "apellidos": "Sin Apellido",
        "fullname": "Sin nombre Sin Apellido",
        "id": "-NRZqlMqo0fxVbxXWQPK",
        "no_cliente": "SISICU03230165",
        "nombre": "Sin nombre",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5512254265",
        "tipo": "particular",
        "vehiculos": {
          "-NRZsPNa17jDWhEOCWKN": {
            "anio": "2019",
            "categoria": "SUV lujo",
            "cilindros": "4",
            "cliente": "-NRZqlMqo0fxVbxXWQPK",
            "color": "Azul oscuro",
            "engomado": "azul",
            "id": "-NRZsPNa17jDWhEOCWKN",
            "marca": "Jaguar",
            "modelo": "I-Pace",
            "placas": "RDC950C"
          },
          "-NRZsasNSvbde3SyfZpi": {
            "anio": "2022",
            "categoria": "SUV",
            "cilindros": "4",
            "cliente": "-NRZqlMqo0fxVbxXWQPK",
            "color": "Azul oscuro",
            "engomado": "azul",
            "id": "-NRZsasNSvbde3SyfZpi",
            "marca": "Jaguar",
            "modelo": "E-Pace",
            "placas": "RDC970C",
            "transmision": "Automatica"
          }
        }
      },
      "-NRZztPUCC9UnUYD_9bM": {
        "apellidos": "FLORES SANCHEZ",
        "correo": "SANHCEZFKARLA@MONOPARK.COM",
        "empresa": "-NRZznm2MP9D9mmcq3He",
        "fullname": "KARLA FLORES SANCHEZ",
        "id": "-NRZztPUCC9UnUYD_9bM",
        "no_cliente": "KAFLTO03230166",
        "nombre": "KARLA",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "56211433",
        "tipo": "flotilla",
        "vehiculos": {
          "-NR_-Y4_d31rWrLVWBks": {
            "anio": "2016",
            "categoria": "PickUp",
            "cilindros": "4",
            "cliente": "-NRZztPUCC9UnUYD_9bM",
            "color": "Blanco",
            "engomado": "azul",
            "id": "-NR_-Y4_d31rWrLVWBks",
            "marca": "Nissan",
            "modelo": "NP300",
            "no_motor": "2.5L",
            "placas": "FL54339",
            "transmision": "Estandar",
            "vinChasis": "GK892027"
          }
        }
      },
      "-NR_qsDNYkz4j3EgWRN0": {
        "apellidos": "GUZMAN",
        "correo": "luis.guzman@gmail.com",
        "fullname": "LUIS GUZMAN",
        "id": "-NR_qsDNYkz4j3EgWRN0",
        "no_cliente": "LUGUTO03230167",
        "nombre": "LUIS",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5513780085",
        "tipo": "particular",
        "vehiculos": {
          "-NR_rGAIFlDE_0VBFmOs": {
            "anio": "2020",
            "categoria": "SUV lujo",
            "cilindros": "6",
            "cliente": "-NR_qsDNYkz4j3EgWRN0",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NR_rGAIFlDE_0VBFmOs",
            "marca": "Audi",
            "modelo": "Q8",
            "no_motor": "3.0 L",
            "placas": "sinpl25",
            "transmision": "Automatica"
          }
        }
      },
      "-NR_sym13O8LuemK6TPq": {
        "apellidos": "VARGAS MARIN",
        "correo": "pab.var.marya@hoo.com",
        "fullname": "PABLO VARGAS MARIN",
        "id": "-NR_sym13O8LuemK6TPq",
        "no_cliente": "PAVATO03230168",
        "nombre": "PABLO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5527488920",
        "tipo": "particular",
        "vehiculos": {
          "-NR_t9M4OZvjqtdLLzBe": {
            "anio": "2012",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NR_sym13O8LuemK6TPq",
            "color": "Plata",
            "engomado": "amarillo",
            "id": "-NR_t9M4OZvjqtdLLzBe",
            "marca": "Chevrolet",
            "modelo": "Cruze",
            "no_motor": "1.8 L",
            "placas": "sinpl26",
            "transmision": "Automatica"
          }
        }
      },
      "-NRc_Wlp5S-Vh-sbtYxa": {
        "apellidos": "AYALA CORTES",
        "correo": "netoayacor62@yahoo.com",
        "fullname": "ERNESTO AYALA CORTES",
        "id": "-NRc_Wlp5S-Vh-sbtYxa",
        "no_cliente": "ERAYTO03230169",
        "nombre": "ERNESTO",
        "sucursal": "-N2gkzuYrS4XDFgYciId",
        "telefono_movil": "5511421843",
        "tipo": "particular",
        "vehiculos": {
          "-NRc_yzlPTPEgk2-rMgp": {
            "anio": "2009",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NRc_Wlp5S-Vh-sbtYxa",
            "color": "Plata",
            "engomado": "azul",
            "id": "-NRc_yzlPTPEgk2-rMgp",
            "marca": "Ford",
            "modelo": "Focus",
            "no_motor": "2.0 L",
            "placas": "430vva",
            "transmision": "Estandar",
            "vinChasis": "91108980"
          }
        }
      },
      "-NRd7Dvn0Pr71k6C7JaN": {
        "apellidos": "JUÁREZ",
        "correo": "bjuarez@reynera.com.mx",
        "fullname": "ANA BERTA JUÁREZ",
        "id": "-NRd7Dvn0Pr71k6C7JaN",
        "no_cliente": "ANJUCU03230170",
        "nombre": "ANA BERTA",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5545257585",
        "tipo": "particular",
        "vehiculos": {
          "-NRd7OGAQXGxIZrXP2zS": {
            "anio": "2018",
            "categoria": "Sedán",
            "cilindros": "4",
            "cliente": "-NRd7Dvn0Pr71k6C7JaN",
            "color": "Otros",
            "engomado": "verde",
            "id": "-NRd7OGAQXGxIZrXP2zS",
            "marca": "Volkswagen",
            "modelo": "Gol",
            "placas": "RXC392A",
            "transmision": "Estandar"
          }
        }
      },
      "-NRtOWLH7WIlA9UIufok": {
        "apellidos": "mendoza sanchez",
        "correo": "prueba565@gmail.com",
        "fullname": "carmen mendoza sanchez",
        "id": "-NRtOWLH7WIlA9UIufok",
        "no_cliente": "CAMECU03230171",
        "nombre": "carmen",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5523232222",
        "tipo": "particular",
        "vehiculos": {
          "-NRtOw3oHxS7sU50KuCi": {
            "anio": "2021",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NRtOWLH7WIlA9UIufok",
            "color": "Amarillo - Verde brillante",
            "engomado": "rosa",
            "id": "-NRtOw3oHxS7sU50KuCi",
            "marca": "Aston Martín",
            "modelo": "DBX",
            "placas": "567fgnh"
          }
        }
      },
      "-NTLZL3K1MpbXlCeZGbI": {
        "apellidos": "mendez sanchez",
        "correo": "prueba12@gmail.com",
        "fullname": "juguito mendez sanchez",
        "id": "-NTLZL3K1MpbXlCeZGbI",
        "no_cliente": "JUMECU04230172",
        "nombre": "juguito",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5523232222",
        "tipo": "particular",
        "vehiculos": {
          "-NTLZPW7y4UxbHaOw4cC": {
            "anio": "2015",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NTLZL3K1MpbXlCeZGbI",
            "color": "Verde oscuro",
            "engomado": "amarillo",
            "id": "-NTLZPW7y4UxbHaOw4cC",
            "marca": "Alfa Romeo",
            "modelo": "Giulietta",
            "placas": "745fgdg"
          }
        }
      },
      "-NToFKk67JOJYN_5eqiK": {
        "apellidos": "con zanahoria",
        "correo": "legal@arrendify.com",
        "empresa": "-NN3FffQjZoDaJ3I0zof",
        "fullname": "jugo de naranja con zanahoria",
        "id": "-NToFKk67JOJYN_5eqiK",
        "no_cliente": "JUCOCU04230173",
        "nombre": "jugo de naranja",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5512254265",
        "tipo": "particular",
        "vehiculos": {
          "-NToGw2dmdtm2DXHJHAc": {
            "anio": "2022",
            "categoria": "Coupé lujo",
            "cilindros": "6",
            "cliente": "-NToFKk67JOJYN_5eqiK",
            "color": "Rojo intenso",
            "engomado": "azul",
            "id": "-NToGw2dmdtm2DXHJHAc",
            "marca": "Bentley",
            "modelo": "Continental ",
            "placas": "RDC100C",
            "transmision": "Automatica"
          }
        }
      },
      "-NToFXAgaYOQNBpFk4yM": {
        "apellidos": "con zanahoria",
        "empresa": "-NN3FffQjZoDaJ3I0zof",
        "fullname": "jugo de naranja con zanahoria",
        "id": "-NToFXAgaYOQNBpFk4yM",
        "no_cliente": "JUCOCU04230173",
        "nombre": "jugo de naranja",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5512254265",
        "tipo": "flotilla"
      },
      "-NToQfYN398yRnoPUEcj": {
        "apellidos": "prueba",
        "fullname": "prueba 245 prueba",
        "id": "-NToQfYN398yRnoPUEcj",
        "no_cliente": "PRPRCU04230175",
        "nombre": "prueba 245",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "3452345353",
        "tipo": "particular"
      },
      "-NTodROh2kdK4mY-UY_n": {
        "apellidos": "sadfsdf",
        "fullname": "prueba111 sadfsdf",
        "id": "-NTodROh2kdK4mY-UY_n",
        "no_cliente": "PRSACU04230176",
        "nombre": "prueba111",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "5523232222",
        "tipo": "particular"
      },
      "-NTzpCUrKrj46B9ScEVW": {
        "apellidos": "oro",
        "fullname": "luis oro oro",
        "id": "-NTzpCUrKrj46B9ScEVW",
        "no_cliente": "LUORCU04230177",
        "nombre": "luis oro",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "8745674567",
        "tipo": "particular"
      },
      "-NTzpVaRdPenWm_HZQqU": {
        "apellidos": "oro45456",
        "fullname": "luis oroKKKK oro45456",
        "id": "-NTzpVaRdPenWm_HZQqU",
        "no_cliente": "LUORCU04230178",
        "nombre": "luis oroKKKK",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "8745674567",
        "tipo": "particular"
      },
      "-NU2qJjR184va8bYN6TP": {
        "apellidos": "inojoaaa",
        "fullname": "maria ines inojoaaa",
        "id": "-NU2qJjR184va8bYN6TP",
        "no_cliente": "MAINCU04230179",
        "nombre": "maria ines",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "8745674567",
        "tipo": "particular",
        "vehiculos": {
          "-NU31G67yyM5KikPai5V": {
            "anio": "2022",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NU2qJjR184va8bYN6TP",
            "color": "Blanco",
            "engomado": "rojo",
            "id": "-NU31G67yyM5KikPai5V",
            "marca": "Aston Martín",
            "modelo": "DBX",
            "placas": "dsf3453"
          },
          "-NU32OfLQZOPciwiLjux": {
            "anio": "2013",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NU2qJjR184va8bYN6TP",
            "color": "Azul medio y rojo cenizo",
            "engomado": "rojo",
            "id": "-NU32OfLQZOPciwiLjux",
            "marca": "Alfa Romeo",
            "modelo": "Mito",
            "placas": "gdfg454"
          }
        }
      },
      "-NVeixMDR2NSwfnXihLw": {
        "apellidos": "nev reg",
        "fullname": "nevo reg nev reg",
        "id": "-NVeixMDR2NSwfnXihLw",
        "no_cliente": "NENECU05230180",
        "nombre": "nevo reg",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "4643645645",
        "tipo": "particular",
        "vehiculos": {
          "-NVejV3nC4t7mkt_x3HR": {
            "anio": "2017",
            "categoria": "Sedán lujo",
            "cilindros": "6",
            "cliente": "-NVeixMDR2NSwfnXihLw",
            "color": "Blanco",
            "engomado": "amarillo",
            "id": "-NVejV3nC4t7mkt_x3HR",
            "marca": "Baic",
            "modelo": "D20",
            "placas": "hty5645",
            "transmision": "Estandar"
          }
        }
      },
      "-NVl4JLyD0X3R92mZrfu": {
        "apellidos": "nev reg",
        "correo": "pedro@gmail.com",
        "empresa": "-NN2jwMdiejBmhmbkH-o",
        "fullname": "TORNILLOS ESTABILIZADORES nev reg",
        "id": "-NVl4JLyD0X3R92mZrfu",
        "no_cliente": "TONECU05230181",
        "nombre": "TORNILLOS ESTABILIZADORES",
        "sucursal": "-N2glF34lV3Gj0bQyEWK",
        "telefono_movil": "4643645645",
        "tipo": "flotilla"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
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
        "diasSucursal": 130,
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
          "iva": 0,
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "index": 1,
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete"
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete"
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
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "terminado": true,
            "tipo": "paquete"
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
            "tipo": "MO"
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
            "tipo": "refaccion"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
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
        "diasSucursal": 158,
        "fechaPromesa": "23/12/2022",
        "fecha_recibido": "20/12/2022",
        "formaPago": 1,
        "hora_entregado": "",
        "hora_recibido": "17:6:44",
        "iva": true,
        "margen": 25,
        "no_os": "CU1222GE00002",
        "reporte": {
          "meses": 0,
          "mo": 5160,
          "refacciones_a": 4040,
          "sobrescrito": 1200,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 200,
          "sobrescrito_refaccion": 0
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
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": "",
            "tipo": "paquete"
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "paquete"
          },
          {
            "UB": "47.82",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "No aprobado",
            "status": "noAprobado",
            "subtotal": "",
            "tipo": "paquete"
          },
          {
            "UB": "74.68",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "",
            "status": true,
            "subtotal": "",
            "tipo": "paquete"
          },
          {
            "UB": "57.33",
            "aprobado": "",
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "",
            "status": true,
            "subtotal": "",
            "tipo": "paquete"
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": "",
            "tipo": "paquete"
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
            "tipo": "MO"
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": "",
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
            "tipo": "refaccion"
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": "",
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
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
        "diasSucursal": 157,
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
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "index": 1,
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
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
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "terminado": true,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete"
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "terminado": true,
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
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
            "tipo": "refaccion"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
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
        "diasSucursal": 157,
        "fechaPromesa": "23/12/2022",
        "fecha_recibido": "21/12/2022",
        "formaPago": 1,
        "hora_recibido": "9:31:41",
        "iva": true,
        "margen": 25,
        "no_os": "CU1222GE00004",
        "reporte": {
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "index": 1,
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
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
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete"
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
            "index": 9,
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
            "index": 10,
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
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
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
        "fechaPromesa": "30/12/2022",
        "fecha_recibido": "27/12/2022",
        "formaPago": 1,
        "hora_recibido": "12:25:50",
        "iva": true,
        "margen": 25,
        "no_os": "CU1222GE00005",
        "reporte": {
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "index": 1,
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
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
            "index": 9,
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
            "index": 10,
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
            "index": 11,
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
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
          "empresa": "",
          "id": "-NLRhhoHEmZzs36LQyO-",
          "no_cliente": "lusaCu10230036",
          "nombre": "lupistrupis",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "5522859478",
          "tipo": "particular",
          "vehiculos": [
            {
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
          ]
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
        "diasSucursal": 136,
        "fechaPromesa": "12/1/2023",
        "fecha_recibido": "10/1/2023",
        "formaPago": 1,
        "hora_recibido": "11:33:48",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE00007",
        "reporte": {
          "meses": 0,
          "mo": 120,
          "refacciones_a": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "tipo": "MO"
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
            "nombre": "CAMBIO DE ACEITE Y FILTRO",
            "precio": 120,
            "status": true,
            "tipo": "MO"
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
          "empresa": "",
          "id": "-NLS512d_ACSLeFE5r02",
          "no_cliente": "PeLóCu10230037",
          "nombre": "Pedro Pablo",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "5512345678",
          "tipo": "particular",
          "vehiculos": [
            {
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
          ]
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
        "diasSucursal": 136,
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
          "iva": 0,
          "meses": 0,
          "mo": 0,
          "refacciones_a": 450,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "tipo": "refaccion"
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
            "marca": "Ford",
            "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
            "precio": 450,
            "status": true,
            "tipo": "refaccion"
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
          "empresa": "",
          "id": "-NLSJqiLdov_8LgUbzmJ",
          "no_cliente": "FaCaCu10230039",
          "nombre": "Fabian",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "5548795600",
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
              "anio": "2016",
              "categoria": "SUV lujo",
              "cilindros": "4",
              "cliente": "-NLSJqiLdov_8LgUbzmJ",
              "color": "Blanco",
              "engomado": "verde",
              "id": "-NMVzGMl8BxL96Gnf3r4",
              "marca": "Acura",
              "marcaMotor": "",
              "modelo": "Acura MDX",
              "no_motor": "",
              "placas": "KTT2121",
              "transmision": "Estandar",
              "vinChasis": ""
            }
          ]
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
        "diasSucursal": 136,
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
          "meses": 0,
          "mo": 3150,
          "refacciones_a": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "tipo": "MO"
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
            "nombre": "CAMBIO DE ACEITE Y FILTRO",
            "precio": 1050,
            "status": true,
            "tipo": "MO"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
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
        "diasSucursal": 135,
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
          "meses": 0,
          "mo": 1350,
          "refacciones_a": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte_interno": {
              "mo": 300,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
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
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
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
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
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
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "tipo": "paquete",
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
                "cantidad": "1",
                "costo": 0,
                "descripcion": "ninguna",
                "enCatalogo": true,
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NIrjPCMIRGHbzy5cbJ_",
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuwvo",
            "precio": 300,
            "refacciones1": 0,
            "refacciones2": 0,
            "tipo": "paquete",
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
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsK5qJwfzE7e3Qn582",
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuevo paquete prueba",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "tipo": "paquete",
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
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsKs8_cS4oCunA4-KN",
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "fghfgh",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "tipo": "paquete",
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
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsRgZ4mMSMpLFyD8V4",
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "juanMT",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "tipo": "paquete",
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
          "empresa": "",
          "id": "-NLcE0c8GTpe9BHqzCl9",
          "no_cliente": "JuRaCu12230041",
          "nombre": "Juan",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_fijo": "",
          "telefono_movil": "7737272828",
          "tipo": "particular",
          "vehiculos": [
            {
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
          ]
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
        "diasSucursal": 134,
        "fechaPromesa": "13/1/2023",
        "fecha_recibido": "12/1/2023",
        "formaPago": 1,
        "hora_recibido": "17:23:34",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE000010",
        "reporte": {
          "meses": 0,
          "mo": 150,
          "refacciones_a": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "tipo": "MO"
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 120,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "normal": 156,
                "precio": 120,
                "precioOriginal": 120,
                "subtotal": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REV. Y CORREGIR NIVELES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR INYECTORES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "C",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR CPO DE ACELERACION",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "SCANEO POR COMPUTADORA",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "ROTACION DE LLANTAS",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR MOTOR",
                "normal": 390,
                "precio": 150,
                "precioOriginal": 300,
                "subtotal": 150,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR CARROCERIA",
                "normal": 390,
                "precio": 150,
                "precioOriginal": 300,
                "subtotal": 150,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 3120,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "Fiesta",
            "nombre": "SERVICIO MAYOR",
            "precio": 3120,
            "refacciones1": 0,
            "refacciones2": 0,
            "status": true,
            "tipo": "paquete",
            "totalMO": 3120
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "N",
            "enCatalogo": true,
            "id": "-NIXsiafAdRrmZsuD-fs",
            "nombre": "LAVAR CARROCERIA",
            "precio": 150,
            "status": true,
            "tipo": "MO"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
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
        "diasSucursal": 130,
        "fechaPromesa": "26/1/2023",
        "fecha_recibido": "16/1/2023",
        "formaPago": 1,
        "hora_recibido": "9:18:17",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE00012",
        "reporte": {
          "meses": 0,
          "mo": 3470,
          "refacciones_a": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
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
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte_interno": {
              "mo": 3120,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "tipo": "paquete",
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
            "tipo": "MO"
          }
        ],
        "servicios_original": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "elementos": [
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 120,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "normal": 156,
                "precio": 120,
                "precioOriginal": 120,
                "subtotal": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REV. Y CORREGIR NIVELES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR INYECTORES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "C",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR CPO DE ACELERACION",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "SCANEO POR COMPUTADORA",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "ROTACION DE LLANTAS",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "normal": 390,
                "precio": 300,
                "precioOriginal": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR MOTOR",
                "normal": 390,
                "precio": 150,
                "precioOriginal": 300,
                "subtotal": 150,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "flotilla": 300,
                "marca": "Ford",
                "modelo": "Fiesta",
                "nombre": "LAVAR CARROCERIA",
                "normal": 390,
                "precio": 150,
                "precioOriginal": 300,
                "subtotal": 150,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 3120,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "Fiesta",
            "nombre": "SERVICIO MAYOR",
            "precio": 3120,
            "refacciones1": 0,
            "refacciones2": 0,
            "status": true,
            "tipo": "paquete",
            "totalMO": 3120
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "descripcion": "ninguna",
            "enCatalogo": true,
            "id": "-NG3I_ejiuh3KiL9EdAp",
            "nombre": "600",
            "precio": 350,
            "status": true,
            "tipo": "MO"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
              "anio": "2012",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NMVmWPPwsDkW64EvmLQ",
              "color": "Azul medio y rojo cenizo",
              "engomado": "rojo",
              "id": "-NMW0zKPJXeqmnboasiP",
              "marca": "Acura",
              "marcaMotor": "",
              "modelo": "Acura ILX",
              "no_motor": "",
              "placas": "HYR4353",
              "transmision": "Automatica",
              "vinChasis": ""
            },
            {
              "anio": "2016",
              "categoria": "Sedán lujo",
              "cilindros": "4",
              "cliente": "-NMVmWPPwsDkW64EvmLQ",
              "color": "Plata",
              "engomado": "rojo",
              "id": "-NMW15HqGYQexsEVAbxO",
              "marca": "Aston Martín",
              "marcaMotor": "",
              "modelo": "DB11",
              "no_motor": "",
              "placas": "dshj454",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
              "anio": "2016",
              "categoria": "SUV lujo",
              "cilindros": "4",
              "cliente": "-NMVmWPPwsDkW64EvmLQ",
              "color": "Plata",
              "engomado": "rojo",
              "id": "-NMW1SmnY3PLLmkOmdyS",
              "marca": "Acura",
              "marcaMotor": "",
              "modelo": "Acura MDX",
              "no_motor": "",
              "placas": "MJd3254",
              "transmision": "Estandar",
              "vinChasis": ""
            }
          ]
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
        "diasSucursal": 115,
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
          "meses": 0,
          "mo": 1000,
          "refacciones_a": 0,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
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
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte_interno": {
              "mo": 300,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
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
            "refacciones1": 0,
            "refacciones2": 0,
            "reporte_interno": {
              "mo": 350,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "terminado": true,
            "tipo": "paquete",
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
                "nombre": "600",
                "precio": 350,
                "subtotal": 350,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 350,
            "id": "-NIsK5qJwfzE7e3Qn582",
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuevo paquete prueba",
            "precio": 350,
            "refacciones1": 0,
            "refacciones2": 0,
            "tipo": "paquete",
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
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NIrjPCMIRGHbzy5cbJ_",
            "marca": "Alfa Romeo",
            "modelo": "Giulia",
            "nombre": "nuwvo",
            "precio": 300,
            "refacciones1": 0,
            "refacciones2": 0,
            "tipo": "paquete",
            "totalMO": 300
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
          "empresa": "G.M. INTEGRACIONES Y SOLUCIONES SA DE CV",
          "id": "-NMidpyPu8Cb9fVvE9GM",
          "no_cliente": "RICAToNaNaN0058",
          "nombre": "RICARDO ",
          "sucursal": "-N2gkzuYrS4XDFgYciId",
          "telefono_fijo": "",
          "telefono_movil": "5570461728",
          "tipo": "flotilla",
          "vehiculos": [
            {
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
          ]
        },
        "diasSucursal": 109,
        "fechaPromesa": "31/1/2023",
        "fecha_recibido": "26/1/2023",
        "formaPago": 1,
        "hora_recibido": "10:3:12",
        "iva": true,
        "margen": 25,
        "no_os": "TO0123GE00014",
        "reporte": {
          "meses": 0,
          "mo": 0,
          "refacciones_a": 0,
          "sobrescrito": 400,
          "sobrescrito_mo": 400,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "tipo": "MO"
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
            "marca": "",
            "nombre": "REV. RUIDO EN SUSPENSION DELANTERA",
            "precio": 400,
            "status": true,
            "tipo": "MO"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
        },
        "diasSucursal": 108,
        "fechaPromesa": "27/1/2023",
        "fecha_recibido": "27/1/2023",
        "formaPago": 1,
        "hora_recibido": "14:14:10",
        "iva": true,
        "margen": 25,
        "no_os": "CU0123GE00015",
        "reporte": {
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 200,
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
                "descripcion": "ninguna",
                "index": 1,
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 2595,
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
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1450,
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 375,
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 375,
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
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1437.5,
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1185,
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
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1555,
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
            "index": 9,
            "nombre": "600",
            "precio": 100,
            "subtotal": 1000,
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
            "index": 10,
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "subtotal": 150,
            "tipo": "refaccion"
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
            "subtotal": 200,
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
            "subtotal": 2595,
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
            "subtotal": 1450,
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
            "subtotal": 375,
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
            "subtotal": 375,
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
            "subtotal": 1437.5,
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
            "subtotal": 1185,
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
            "subtotal": 1500,
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
            "subtotal": 1555,
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
            "precio": 100,
            "subtotal": 1000,
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
            "subtotal": 150,
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
            "subtotal": 300,
            "tipo": "MO"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
              "anio": "2022",
              "categoria": "SUV lujo",
              "cilindros": "8",
              "cliente": "-NN8zq1K2QnBp7RIwtq2",
              "color": "Blanco",
              "engomado": "Rosa",
              "id": "-NN95swAeudK8ygth3M0",
              "marca": "Cadillac",
              "marcaMotor": "hemi ",
              "modelo": "Escalade",
              "no_motor": "fhkjw26566",
              "placas": "pah2148",
              "status": true,
              "transmision": "Automatica",
              "vinChasis": "rfer"
            }
          ]
        },
        "diasSucursal": 104,
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
          "meses": 0,
          "mo": 1206,
          "refacciones_a": 900,
          "sobrescrito": 0,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "86.20",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "elementos": [
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
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
                "descripcion": "multigrado",
                "index": 2,
                "nombre": "aceite de motor",
                "precio": 100,
                "subtotal": 125,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 725,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "index": 0,
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "refacciones1": 100,
            "refacciones2": 125,
            "reporte_interno": {
              "mo": 600,
              "refacciones": 100,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 725,
            "tipo": "paquete",
            "totalMO": 600
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": false,
                "index": 0,
                "nombre": "refaccion1",
                "precio": 350,
                "subtotal": 437.5,
                "tipo": "refaccion"
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
            "refacciones1": 350,
            "refacciones2": 437.5,
            "reporte_interno": {
              "mo": 0,
              "refacciones": 350,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 437.5,
            "tipo": "paquete",
            "totalMO": 0
          },
          {
            "UB": "61.48",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "elementos": [
              {
                "IDreferencia": "-NIJ4g98MXI7Zs3d3xe6",
                "cantidad": 1,
                "catalogo": true,
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
                "descripcion": "prueba",
                "index": 1,
                "nombre": "filtro de aceite",
                "precio": 150,
                "subtotal": 187.5,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NIJ5Gl1R47GQ6g5h6nJ",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna descr",
                "index": 2,
                "nombre": "materiales diversos",
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NIJ59oXarA3-kLIDfEp",
                "cantidad": 1,
                "catalogo": true,
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
            "refacciones1": 450,
            "refacciones2": 562.5,
            "reporte_interno": {
              "mo": 606,
              "refacciones": 450,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "status": true,
            "subtotal": 1168.5,
            "tipo": "paquete",
            "totalMO": 606
          }
        ],
        "servicios_original": [
          {
            "UB": "86.20",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "elementos": [
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "N",
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "subtotal": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NGbPadXFum0ZEpqn70p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "multigrado",
                "nombre": "aceite de motor",
                "precio": 100,
                "subtotal": 125,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 725,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "precio": 100,
            "refacciones1": 100,
            "refacciones2": 125,
            "status": true,
            "subtotal": 725,
            "tipo": "paquete",
            "totalMO": 600
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "elementos": [
              {
                "IDreferencia": "-NG3I_ejiuh3KiL9EdAp",
                "cantidad": 1,
                "catalogo": false,
                "nombre": "refaccion1",
                "precio": 350,
                "subtotal": 437.5,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "factibilidad": 0,
            "flotilla": 437.5,
            "id": "-NIEsB5V5ql3rxg_xyoV",
            "marca": "Volkswagen",
            "modelo": "Vento",
            "nombre": "SERVICIO MAYOR",
            "precio": 350,
            "refacciones1": 350,
            "refacciones2": 437.5,
            "status": true,
            "subtotal": 437.5,
            "tipo": "paquete",
            "total": 0,
            "totalMO": 0
          },
          {
            "UB": "61.48",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "elementos": [
              {
                "IDreferencia": "-NIJ4g98MXI7Zs3d3xe6",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna descripc",
                "nombre": "mano jose luis",
                "precio": 600,
                "subtotal": 600,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NGbPl434B_Pzb_G6vGp",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "prueba",
                "nombre": "filtro de aceite",
                "precio": 150,
                "subtotal": 187.5,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NIJ5Gl1R47GQ6g5h6nJ",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna descr",
                "nombre": "materiales diversos",
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NIJ59oXarA3-kLIDfEp",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "prueba 2",
                "nombre": "mano jose luis 1",
                "precio": 6,
                "subtotal": 6,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 1168.5,
            "id": "-NIJ4C_eDdJgnc-hAlTX",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "paquete jose luis",
            "precio": 450,
            "refacciones1": 450,
            "refacciones2": 562.5,
            "status": true,
            "subtotal": 1168.5,
            "tipo": "paquete",
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
        },
        "diasSucursal": 66,
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
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion"
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
            "tipo": "paquete"
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
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
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
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
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
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
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
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
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
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
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
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
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
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
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
            "tipo": "paquete"
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
            "tipo": "MO"
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
            "tipo": "refaccion"
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
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
                "nombre": "nueva",
                "precio": 100,
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
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
                "costo": 0,
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
                "costo": 0,
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
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 0,
            "tipo": "paquete"
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
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO"
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
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion"
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO"
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
        "tecnico": "-NL1hTSnVq0ImKF7kCT7"
      },
      "-NQgGARQXmplGMfE9hXV": {
        "cliente": {
          "apellidos": "VARGAS",
          "correo": "isa_vargas05@hotmail.com",
          "fullname": "ISABEL  VARGAS",
          "id": "-NQgAgmAXe7P7GVPeHtw",
          "no_cliente": "ISVACU03230144",
          "nombre": "ISABEL",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5570467464",
          "tipo": "particular",
          "vehiculos": [
            {
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
          ]
        },
        "diasSucursal": 60,
        "fechaPromesa": "17/3/2023",
        "fecha_recibido": "16/3/2023",
        "formaPago": 1,
        "hora_recibido": "15:12:52",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00017",
        "reporte": {
          "meses": 0,
          "mo": 0,
          "refacciones_a": 0,
          "sobrescrito": 15650,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 11000,
          "sobrescrito_refaccion": 4650
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
            "tipo": "refaccion"
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
            "tipo": "refaccion"
          }
        ],
        "servicios_original": [
          {
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
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "REV. Y CORREGIR NIVELES",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "LAVAR INYECTORES",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "C",
                "nombre": "LAVAR CPO DE ACELERACION",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "LAVAR MOTOR",
                "precio": 150,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "LAVAR CARROCERIA",
                "precio": 150,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "tipo": "MO"
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
            "precio": 0,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "tipo": "paquete"
          },
          {
            "aprobado": true,
            "cantidad": 1,
            "costo": 7800,
            "enCatalogo": false,
            "flotilla": 7800,
            "flotilla2": "$  7,800.00",
            "id": "-NQgBXpNofrC9fYVkVly",
            "index": 1,
            "nombre": "amortiguadores delanteros",
            "normal": "$  10,140.00",
            "precio": 0,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "tipo": "paquete"
          },
          {
            "aprobado": true,
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
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1850,
            "tipo": "refaccion"
          },
          {
            "aprobado": true,
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
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2800,
            "tipo": "refaccion"
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
        }
      },
      "-NQgHasoi4hOw2wdQ1eB": {
        "cliente": {
          "apellidos": "VARGAS",
          "correo": "isa_vargas05@hotmail.com",
          "fullname": "ISABEL  VARGAS",
          "id": "-NQgAgmAXe7P7GVPeHtw",
          "no_cliente": "ISVACU03230144",
          "nombre": "ISABEL",
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5570467464",
          "tipo": "particular",
          "vehiculos": [
            {
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
          ]
        },
        "diasSucursal": 60,
        "fechaPromesa": "16/3/2023",
        "fecha_recibido": "16/3/2023",
        "formaPago": 1,
        "hora_recibido": "15:19:6",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00018",
        "reporte": {
          "meses": 0,
          "mo": 0,
          "refacciones_a": 0,
          "sobrescrito": 3200,
          "sobrescrito_mo": 0,
          "sobrescrito_paquetes": 3200,
          "sobrescrito_refaccion": 0
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
                "nombre": "CAMBIO DE ACEITE Y FILTRO",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE32XkfMPHMcMXOiOio",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "REEMPLAZAR FILTRO DE AIRE",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE2OUuZ2lh5DhXHHeBL",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "REV. Y CORREGIR NIVELES",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "LAVAR INYECTORES",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFGEgUK6OVe2fEDvCgS",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "C",
                "nombre": "LAVAR CPO DE ACELERACION",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFUnhpeX47MLHgB4zr6",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "SCANEO POR COMPUTADORA",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFyxBy74ehhZxnHrZ8Q",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "REV. 25 PUNTOS DE SEGURIDAD",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsW7Y5RzRrbI_F9dB",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "CAMBIO DE FOCOS FUNDIDOS CONVENCIONALES",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NFzjXL2niDv6QlUz8hi",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "ROTACION DE LLANTAS",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsMnQWQWQsj2ChYfI",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "REGIMEN DE CARGA DE BATERIA",
                "precio": 300,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsduKTIhhpSrAJKS-",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "LAVAR MOTOR",
                "precio": 150,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NIXsiafAdRrmZsuD-fs",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "N",
                "nombre": "LAVAR CARROCERIA",
                "precio": 150,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "REEMPLAZAR BUJIAS",
                "precio": 300,
                "tipo": "MO"
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
            "precio": 0,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "tipo": "paquete"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
        },
        "diasSucursal": 20,
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
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 200,
            "tipo": "paquete"
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 2595,
            "tipo": "paquete"
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1450,
            "tipo": "paquete"
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": "",
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
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete"
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete"
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1437.5,
            "tipo": "paquete"
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1185,
            "tipo": "paquete"
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1500,
            "tipo": "paquete"
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "tipo": "MO"
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": "",
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
            "tipo": "refaccion"
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": "",
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
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "nombre": "nueva",
                "precio": 100,
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
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "costo": 0,
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
                "costo": 0,
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
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO"
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
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion"
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO"
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
        "tecnico": "-NL1hTSnVq0ImKF7kCT7"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
        },
        "diasSucursal": 54,
        "fechaPromesa": "22/3/2023",
        "fecha_recibido": "22/3/2023",
        "formaPago": 1,
        "hora_recibido": "13:30:7",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00020",
        "reporte": {
          "meses": 0,
          "mo": 200,
          "refacciones_a": 150,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
            "tipo": "MO"
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
            "tipo": "refaccion"
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
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO"
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
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion"
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
        }
      },
      "-NRFjRowgFS_D7porrDF": {
        "cliente": {
          "apellidos": "GUADA",
          "correo": "genaro_guadarrama@outlook.com",
          "empresa": "GUIAR",
          "id": "-NG2LstV0NhaJkHH6ro-",
          "no_cliente": "GEGUCU11220013",
          "nombre": "GENARO GUADAAAAA",
          "status": true,
          "sucursal": "-N2glF34lV3Gj0bQyEWK",
          "telefono_movil": "5512254265",
          "tipo": "flotilla",
          "vehiculos": [
            {
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
          ]
        },
        "diasSucursal": 53,
        "fechaPromesa": "24/3/2023",
        "fecha_recibido": "23/3/2023",
        "formaPago": 1,
        "hora_recibido": "17:11:27",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00021",
        "reporte": {
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "tipo": "MO"
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
            "tipo": "refaccion"
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
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "nombre": "nueva",
                "precio": 100,
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
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "costo": 0,
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
                "costo": 0,
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
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO"
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
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion"
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
        },
        "diasSucursal": 52,
        "fechaPromesa": "24/3/2023",
        "fecha_recibido": "24/3/2023",
        "formaPago": 1,
        "hora_recibido": "14:48:53",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00022",
        "reporte": {
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "tipo": "MO"
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
            "tipo": "refaccion"
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
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "nombre": "nueva",
                "precio": 100,
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
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "costo": 0,
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
                "costo": 0,
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
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO"
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
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion"
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
        },
        "diasSucursal": 49,
        "fechaPromesa": "28/3/2023",
        "fecha_recibido": "27/3/2023",
        "formaPago": 1,
        "hora_recibido": "17:28:9",
        "iva": true,
        "margen": 25,
        "no_os": "CU0323GE00023",
        "reporte": {
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "tipo": "MO"
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
            "tipo": "refaccion"
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
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "nombre": "nueva",
                "precio": 100,
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
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "costo": 0,
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
                "costo": 0,
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
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO"
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
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion"
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
        },
        "diasSucursal": 0,
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
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
        },
        "servicio": 1,
        "servicios": [
          {
            "UB": "100.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 200,
            "tipo": "paquete"
          },
          {
            "UB": "73.02",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 2595,
            "tipo": "paquete"
          },
          {
            "UB": "58.62",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1450,
            "tipo": "paquete"
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": "",
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
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete"
          },
          {
            "UB": "20.00",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 375,
            "tipo": "paquete"
          },
          {
            "UB": "47.82",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1437.5,
            "tipo": "paquete"
          },
          {
            "UB": "74.68",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1185,
            "tipo": "paquete"
          },
          {
            "UB": "57.33",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "6",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1500,
            "tipo": "paquete"
          },
          {
            "UB": "42.12",
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "4",
            "costo": "",
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
                "tipo": "refaccion"
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
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Terminado",
            "status": "terminar",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "tipo": "MO"
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": "",
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
            "tipo": "refaccion"
          },
          {
            "UB": "",
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "cilindros": "",
            "costo": "",
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
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "nombre": "nueva",
                "precio": 100,
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
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "costo": 0,
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
                "costo": 0,
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
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO"
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
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion"
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO"
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
        "tecnico": "-NL1hTSnVq0ImKF7kCT7"
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
          "tipo": "particular",
          "vehiculos": [
            {
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
            },
            {
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
            {
              "anio": "2017",
              "categoria": "Sedán lujo",
              "cilindros": "6",
              "cliente": "-NEvGgxapGc_2IQyfCPQ",
              "color": "Rojo intenso",
              "engomado": "azul",
              "id": "-NIrdf_SvLYNlrBWRBFQ",
              "marca": "Alfa Romeo",
              "marcaMotor": "",
              "modelo": "Giulia",
              "no_motor": "",
              "placas": "MGT9999",
              "transmision": "Estandar",
              "vinChasis": ""
            },
            {
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
          ]
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
        "diasSucursal": 34,
        "fechaPromesa": "15/4/2023",
        "fecha_recibido": "11/4/2023",
        "formaPago": 1,
        "hora_recibido": "17:47:45",
        "iva": true,
        "margen": 25,
        "no_os": "CU0423GE00025",
        "reporte": {
          "meses": 0,
          "mo": 5360,
          "refacciones_a": 4640,
          "sobrescrito": 1000,
          "sobrescrito_mo": 1000,
          "sobrescrito_paquetes": 0,
          "sobrescrito_refaccion": 0
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
            "reporte_interno": {
              "mo": 200,
              "refacciones": 0,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "index": 1,
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 1720,
              "refacciones": 700,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "descripcion": "XD",
                "flotilla": 750,
                "index": 0,
                "marca": "BMW",
                "nombre": "exprimi",
                "normal": 975,
                "precio": 600,
                "subtotal": 750,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 600,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "index": 3,
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              }
            ],
            "enCatalogo": true,
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "index": 4,
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "reporte_interno": {
              "mo": 0,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 0,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE3tnQLGfFd7HK7wRJq",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 562.5,
                "index": 1,
                "marca": "GMC",
                "nombre": "XD",
                "normal": 731.25,
                "precio": 450,
                "subtotal": 562.5,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 500,
              "refacciones": 750,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 375,
                "index": 1,
                "marca": "Audi",
                "nombre": "BALATAS",
                "normal": 487.5,
                "precio": 300,
                "subtotal": 375,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 810,
              "refacciones": 300,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 0,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFof935I4yJ0ulZ945p",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 250,
                "index": 1,
                "marca": "ninguna",
                "nombre": "refa refa",
                "normal": 325,
                "precio": 200,
                "subtotal": 250,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFovlw3fDzGbVMa-mg4",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 300,
                "index": 2,
                "marca": "-NFiyBdjmZFfdpSoyWNU",
                "nombre": "nueva refac 45",
                "normal": 390,
                "precio": 240,
                "subtotal": 300,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 700,
              "refacciones": 640,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "descripcion": "ninguna",
                "flotilla": 500,
                "index": 1,
                "marca": "-NFyYn5eKO2EuaZhukGs",
                "nombre": "BALATAS CERÁMICA",
                "normal": 650,
                "precio": 400,
                "subtotal": 500,
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NFUnmWOMfHeLuqvqDni",
                "cantidad": 1,
                "catalogo": true,
                "descripcion": "ninguna",
                "flotilla": 625,
                "index": 2,
                "marca": "BMW",
                "nombre": "SEGURO BALASTASSSS",
                "normal": 812.5,
                "precio": 500,
                "subtotal": 625,
                "tipo": "refaccion"
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
            "reporte_interno": {
              "mo": 430,
              "refacciones": 900,
              "sobrescrito_mo": 0,
              "sobrescrito_refaccion": 0
            },
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "tipo": "MO"
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
            "tipo": "refaccion"
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
                "nombre": "FRENOSSSS",
                "precio": 200,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 200,
            "id": "-NE2pvE6CS_1mdeHFL5W",
            "marca": "Ford",
            "modelo": "F-350",
            "nombre": "x",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 200,
            "tipo": "paquete"
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
                "nombre": "nueva",
                "precio": 100,
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
                "tipo": "refaccion"
              },
              {
                "IDreferencia": "-NE2JJZu_LtUYJXSBola",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "nueva",
                "precio": 120,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE3nrow7Ol7iyGtRzO3",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "marca": "BMW",
                "nombre": "prueba 2000 mo",
                "precio": 700,
                "tipo": "MO"
              },
              {
                "IDreferencia": "-NE78vEAujLp8QfcIAtl",
                "cantidad": 1,
                "catalogo": true,
                "costo": 0,
                "descripcion": "ninguna",
                "nombre": "prueba 500",
                "precio": 800,
                "tipo": "MO"
              }
            ],
            "enCatalogo": true,
            "flotilla": 2595,
            "id": "-NE430_ohL7xCijFnR3i",
            "marca": "GMC",
            "modelo": "Canyon",
            "nombre": "paquete z",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 2595,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1450,
            "id": "-NEH_O1qK7I5z8sWdOQz",
            "marca": "BMW",
            "modelo": "iX M60",
            "nombre": "paquete bmw",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1450,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFng8NXTiO7yySaUCtQ",
            "marca": "BMW",
            "modelo": "Serie 1",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
            "flotilla": 375,
            "id": "-NFyFt2ltBZt-CMx0way",
            "marca": "Bentley",
            "modelo": "Continental ",
            "nombre": "aqui",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 375,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1437.5,
            "id": "-NG386DKUmKAlxvapTIK",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "nuevo",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1437.5,
            "tipo": "paquete"
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
                "costo": 0,
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
                "costo": 0,
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
            "flotilla": 1185,
            "id": "-NG38XM-ZEqoNxvurYl0",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 1",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1185,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1500,
            "id": "-NG38nZre8RkONgpHMEY",
            "marca": "Jeep",
            "modelo": "Wrangler",
            "nombre": "personalizado 2",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1500,
            "tipo": "paquete"
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
                "costo": 0,
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
            "flotilla": 1555,
            "id": "-NG3sNo5jlk1a0qoBMjL",
            "marca": "Chevrolet",
            "modelo": "Equinox",
            "nombre": "paquetePruebaWEB",
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1555,
            "tipo": "paquete"
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
            "nombre": "600",
            "precio": 100,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 1000,
            "tipo": "MO"
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
            "marca": "-NFyYn5eKO2EuaZhukGs",
            "nombre": "BALATAS CERÁMICA",
            "precio": 150,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 150,
            "tipo": "refaccion"
          },
          {
            "aprobada": false,
            "aprobado": true,
            "cantidad": 1,
            "costo": 0,
            "enCatalogo": true,
            "flotilla": 300,
            "id": "-NFGEgUK6OVe2fEDvCgS",
            "marca": "Aston Martín",
            "nombre": "LAVAR CPO DE ACELERACION",
            "precio": 300,
            "showStatus": "Aprobado",
            "status": "aprobado",
            "subtotal": 300,
            "tipo": "MO"
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
        }
      }
    }
    let nuevas = {}
    const camposCliente = [
      'apellidos',
      'correo',
      'correo_sec',
      'id',
      'no_cliente',
      'nombre',
      'status',
      'sucursal',
      'telefono_fijo',
      'telefono_movil',
      'tipo'
    ]
    const nuevasRecep = Object.keys(recepciones).map(r=>{
      if(!recepciones[r].vehiculo){
        console.log(recepciones[r].id);
        recepciones[r].vehiculo = recepciones[r].cliente.vehiculos[0]
      }
      recepciones[r].cliente = this._publicos.nuevaRecuperacionData(recepciones[r].cliente,camposCliente)
      const  {reporte, ocupados}= this._publicos.realizarOperaciones_2(recepciones[r])
      recepciones[r].reporte = reporte
      recepciones[r].servicios = ocupados
      recepciones[r].servicios_original = ocupados
      nuevas[r] = recepciones[r]
      return {[r]: recepciones[r]}
    })

    console.log(nuevasRecep);
    console.log(nuevas);
    

  }
}