import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from "../../environments/environment";
import { Vehiculo } from '../models/vehiculos.model';

const urlServer = environment.firebaseConfig.databaseURL
import { child, get, getDatabase, onValue, push, ref, set, update } from "firebase/database";
import { ServiciosPublicosService } from './servicios-publicos.service';


const db = getDatabase()
const dbRef = ref(getDatabase());

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {

  constructor(private http: HttpClient, private _publicos:ServiciosPublicosService) { }

  camposVehiculo = ['id','marca','marcaMotor','modelo','no_motor','placas','status','transmision','vinChasis']
  obligatorios = ['anio','categoria','cilindros','cliente','color','marca','modelo','placas']
  camposVehiculosave =  ['anio','categoria','cilindros','cliente','color','engomado','id','marca','marcaMotor','modelo','no_motor','placas','transmision','vinChasis',
  ]
  camposVehiculo_=[
    {valor: 'placas', show:'Placas'},
    {valor: 'marca', show:'marca'},
    {valor: 'modelo', show:'modelo'},
    {valor: 'anio', show:'añio'},
    {valor: 'categoria', show:'categoria'},
    {valor: 'cilindros', show:'cilindros'},
    {valor: 'engomado', show:'engomado'},
    {valor: 'color', show:'color'},
    {valor: 'transmision', show:'transmision'},
    {valor: 'no_motor', show:'No. Motor'},
    {valor: 'vinChasis', show:'vinChasis'},
    {valor: 'marcaMotor', show:'marcaMotor'}
  ]
  lista_cilindros_arr = ['4','5','6','8','10']

  colores_autos = ['Plata','Blanco','Rojo intenso','Azul medio y rojo cenizo','Azul claro','Azul oscuro','Marrón claro','Negro','Gris','Verde oscuro','Amarillo - Verde brillante','Amarillo oro','Amarillo sol','Marrón profundo','Naranja','Violeta profundo','Bitono','Café Claro','Otro']
  
  anios = ["1990","1991","1992","1993","1994","1995","1996","1997","1998","1999","2000","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2020","2021","2022","2023","2024","2025","2026","2027","2028","2029" ]


  marcas_vehiculos = {
    "Acura": [
        {
            "categoria": "Sedán lujo",
            "modelo": "Acura ILX"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Acura MDX"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Acura NSX"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Acura RDX"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Acura RDX"
        }
    ],
    "Alfa Romeo": [
        {
            "categoria": "Sedán lujo",
            "modelo": "Giulia"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Giulietta"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Stelvio"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Mito"
        }
    ],
    "Aston Martín": [
        {
            "categoria": "Sedán lujo",
            "modelo": "DB11"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "DBS"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "DBX"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Vantage"
        }
    ],
    "Audi": [
        {
            "categoria": "Hatchback lujo",
            "modelo": "A1"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "A3"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "A4"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "A5"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "A6"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "A7"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "A8"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "E-TRON"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Q2"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Q3"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Q5"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Q7"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Q8"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "R8"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "TTS"
        }
    ],
    "BMW": [
        {
            "categoria": "Sedán lujo",
            "modelo": "i4 M50"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "iX M60"
        },
        {
            "categoria": "Hatchback lujo",
            "modelo": "Serie 1"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Serie 2"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Serie 3"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Serie 4"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Serie 5"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Serie 7"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Serie 8"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X1"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X2"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X3"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X4"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X5"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X6"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X7"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Z4 M40i"
        }
    ],
    "Baic": [
        {
            "categoria": "SUV lujo",
            "modelo": "BJ20"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "BJ40"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "D20"
        },
        {
            "categoria": "PickUp",
            "modelo": "Vigus 3"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X25"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X35"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "X65"
        }
    ],
    "Bentley": [
        {
            "categoria": "SUV lujo",
            "modelo": "Bentayga"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Continental "
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Flying Spur"
        }
    ],
    "Buick": [
        {
            "categoria": "SUV lujo",
            "modelo": "Enclave"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Encore"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Envision"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Lacrosse"
        }
    ],
    "Cadillac": [
        {
            "categoria": "Sedán lujo",
            "modelo": "ATS"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "CTS"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Escalade"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "XT4"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "XT5"
        }
    ],
    "Chevrolet": [
        {
            "categoria": "Sedán",
            "modelo": "Astra"
        },
        {
            "categoria": "Sedán",
            "modelo": "Aveo"
        },
        {
            "categoria": "Sedán",
            "modelo": "Beat"
        },
        {
            "categoria": "Sedán",
            "modelo": "Blazer"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Bolt EUV"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Camaro "
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Camaro ZL1"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Captiva"
        },
        {
            "categoria": "Sedán",
            "modelo": "Cavalier"
        },
        {
            "categoria": "Sedán",
            "modelo": "Chevy"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Colorado"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "Corvette Stingray"
        },
        {
            "categoria": "Sedán",
            "modelo": "Cruze"
        },
        {
            "categoria": "SUV",
            "modelo": "Equinox"
        },
        {
            "categoria": "Van",
            "modelo": "Express "
        },
        {
            "categoria": "SUV",
            "modelo": "Groove"
        },
        {
            "categoria": "Sedán",
            "modelo": "Malibú"
        },
        {
            "categoria": "Sedán",
            "modelo": "Meriva"
        },
        {
            "categoria": "Sedán",
            "modelo": "Onix"
        },
        {
            "categoria": "Sedán",
            "modelo": "Optra"
        },
        {
            "categoria": "PickUp",
            "modelo": "S10 "
        },
        {
            "categoria": "PickUp",
            "modelo": "Silverado"
        },
        {
            "categoria": "Sedán",
            "modelo": "Spark"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Suburban"
        },
        {
            "categoria": "SUV",
            "modelo": "Tahoe"
        },
        {
            "categoria": "PickUp",
            "modelo": "Tornado "
        },
        {
            "categoria": "SUV",
            "modelo": "Tracker"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Traverse"
        },
        {
            "categoria": "SUV",
            "modelo": "Trax"
        }
    ],
    "Chrysler": [
        {
            "categoria": "Sedán",
            "modelo": "200c"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "300C"
        },
        {
            "categoria": "Camioneta lujo",
            "modelo": "Aspen"
        },
        {
            "categoria": "Sedán",
            "modelo": "Cirrus"
        },
        {
            "categoria": "Coupé",
            "modelo": "Crossfire"
        },
        {
            "categoria": "SUV",
            "modelo": "Cruiser"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Grand Voyager"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Pacífica"
        },
        {
            "categoria": "Sedán",
            "modelo": "Shadow"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Town & Country"
        }
    ],
    "Dodge": [
        {
            "categoria": "Sedán",
            "modelo": "Attitude"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Caliber"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Challenger"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Charger"
        },
        {
            "categoria": "PickUp",
            "modelo": "RAM D150"
        },
        {
            "categoria": "PickUp",
            "modelo": "RAM D250"
        },
        {
            "categoria": "PickUp",
            "modelo": "RAM Dakota"
        },
        {
            "categoria": "PickUp",
            "modelo": "RAM 1500"
        },
        {
            "categoria": "PickUp",
            "modelo": "RAM 2500"
        },
        {
            "categoria": "Carga",
            "modelo": "RAM 4000"
        },
        {
            "categoria": "PickUp",
            "modelo": "RAM 700"
        },
        {
            "categoria": "Camioneta",
            "modelo": "RAM Charger"
        },
        {
            "categoria": "Van",
            "modelo": "RAM Wagon "
        },
        {
            "categoria": "Sedán",
            "modelo": "Dart"
        },
        {
            "categoria": "SUV",
            "modelo": "Durango"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Grand Caravan"
        },
        {
            "categoria": "Sedán",
            "modelo": "Intrepid"
        },
        {
            "categoria": "SUV",
            "modelo": "Journey"
        },
        {
            "categoria": "Sedán",
            "modelo": "Magnum"
        },
        {
            "categoria": "Sedán",
            "modelo": "Neon"
        },
        {
            "categoria": "SUV",
            "modelo": "Nitro"
        },
        {
            "categoria": "Van",
            "modelo": "RAM Promaster"
        },
        {
            "categoria": "Carga",
            "modelo": "RAM Promaster Rapid"
        },
        {
            "categoria": "Sedán",
            "modelo": "Stratus"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Visión"
        }
    ],
    "Ferrari": [
        {
            "categoria": "Sedán lujo",
            "modelo": "812 GTS"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "296"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "SF90 "
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "F8 "
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "ROMA"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "PORTOFINO M "
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "812"
        }
    ],
    "Fiat": [
        {
            "categoria": "SUV",
            "modelo": "ARGO"
        },
        {
            "categoria": "Van",
            "modelo": "Ducato"
        },
        {
            "categoria": "SUV",
            "modelo": "Mobi"
        },
        {
            "categoria": "SUV",
            "modelo": "Puise"
        },
        {
            "categoria": "SUV",
            "modelo": "L Trekking"
        },
        {
            "categoria": "SUV",
            "modelo": "Palio"
        },
        {
            "categoria": "SUV",
            "modelo": "Panda"
        },
        {
            "categoria": "PickUp",
            "modelo": "Strada"
        }
    ],
    "Ford": [
        {
            "categoria": "Van",
            "modelo": "Aerostar"
        },
        {
            "categoria": "Van",
            "modelo": "Club wagon"
        },
        {
            "categoria": "Sedán",
            "modelo": "Contour"
        },
        {
            "categoria": "Sedán",
            "modelo": "Cougar"
        },
        {
            "categoria": "Van",
            "modelo": "Courier"
        },
        {
            "categoria": "Sedán",
            "modelo": "Crown victoria"
        },
        {
            "categoria": "Van",
            "modelo": "E-150"
        },
        {
            "categoria": "Van",
            "modelo": "Econoline"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Edge"
        },
        {
            "categoria": "SUV",
            "modelo": "Escape"
        },
        {
            "categoria": "Sedán",
            "modelo": "Escort"
        },
        {
            "categoria": "SUV",
            "modelo": "Excursion"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Expedition"
        },
        {
            "categoria": "SUV",
            "modelo": "Explorer"
        },
        {
            "categoria": "PickUp",
            "modelo": "F-100"
        },
        {
            "categoria": "PickUp",
            "modelo": "F-150"
        },
        {
            "categoria": "PickUp",
            "modelo": "F-250"
        },
        {
            "categoria": "Carga",
            "modelo": "F-350"
        },
        {
            "categoria": "Carga",
            "modelo": "F-450"
        },
        {
            "categoria": "Carga",
            "modelo": "F-550"
        },
        {
            "categoria": "Sedán",
            "modelo": "Five Hundred"
        },
        {
            "categoria": "Sedán",
            "modelo": "Fiesta"
        },
        {
            "categoria": "Sedán",
            "modelo": "Figo"
        },
        {
            "categoria": "SUV",
            "modelo": "Flex"
        },
        {
            "categoria": "Sedán",
            "modelo": "Focus"
        },
        {
            "categoria": "Van",
            "modelo": "Freestar"
        },
        {
            "categoria": "Sedán",
            "modelo": "Fusión"
        },
        {
            "categoria": "Sedán",
            "modelo": "Ghia"
        },
        {
            "categoria": "PickUp",
            "modelo": "Maverick"
        },
        {
            "categoria": "Sedán",
            "modelo": "Mondeo"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Mustang"
        },
        {
            "categoria": "PickUp",
            "modelo": "Ranger"
        },
        {
            "categoria": "Sedán",
            "modelo": "Taurus"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Thunderbird"
        },
        {
            "categoria": "Van",
            "modelo": "Transit"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Windstar"
        }
    ],
    "GMC": [
        {
            "categoria": "SUV lujo",
            "modelo": "Acadia"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Jimmy"
        },
        {
            "categoria": "PickUp",
            "modelo": "Sierra"
        },
        {
            "categoria": "PickUp",
            "modelo": "Canyon"
        },
        {
            "categoria": "SUV",
            "modelo": "Envoy"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Hummer"
        },
        {
            "categoria": "Van",
            "modelo": "Safari"
        },
        {
            "categoria": "Van",
            "modelo": "Savana"
        },
        {
            "categoria": "PickUp",
            "modelo": "Sonoma"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Terrain"
        },
        {
            "categoria": "SUV",
            "modelo": "Uplander"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Yukon"
        }
    ],
    "Honda": [
        {
            "categoria": "Sedán",
            "modelo": "Accord"
        },
        {
            "categoria": "Sedán",
            "modelo": "City"
        },
        {
            "categoria": "SUV",
            "modelo": "CR-V"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Element"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Insight"
        },
        {
            "categoria": "PickUp",
            "modelo": "Ridgeline"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "BR-V"
        },
        {
            "categoria": "Sedán",
            "modelo": "Civic"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Fit"
        },
        {
            "categoria": "Van",
            "modelo": "Odyssey"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "S2000"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "HR-V"
        },
        {
            "categoria": "SUV",
            "modelo": "Pilot"
        }
    ],
    "Hyundai": [
        {
            "categoria": "Sedán",
            "modelo": "Accent"
        },
        {
            "categoria": "Sedán",
            "modelo": "Atos"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Creta "
        },
        {
            "categoria": "Sedán",
            "modelo": "Elantra"
        },
        {
            "categoria": "Carga",
            "modelo": "H100"
        },
        {
            "categoria": "Sedán",
            "modelo": "i10"
        },
        {
            "categoria": "SUV",
            "modelo": "Ioniq"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "IX35"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Santa fe"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Sonata"
        },
        {
            "categoria": "Van",
            "modelo": "Starex"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Tucson"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Veloster"
        },
        {
            "categoria": "Sedán",
            "modelo": "Verna"
        }
    ],
    "Infiniti": [
        {
            "categoria": "SUV lujo",
            "modelo": "FX"
        },
        {
            "categoria": "Coupé",
            "modelo": "G37"
        },
        {
            "categoria": "Sedán",
            "modelo": "M"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Q50"
        },
        {
            "categoria": "Coupé",
            "modelo": "Q60"
        },
        {
            "categoria": "Sedán",
            "modelo": "Q70"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "QX30"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "QX50"
        },
        {
            "categoria": "Camioneta Lujo",
            "modelo": "QX56"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "QX60"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "QX70"
        },
        {
            "categoria": "SUV",
            "modelo": "QX80"
        }
    ],
    "Jac": [
        {
            "categoria": "SUV",
            "modelo": "SEI2"
        },
        {
            "categoria": "SUV",
            "modelo": "SEI3"
        },
        {
            "categoria": "Van",
            "modelo": "Sunray"
        },
        {
            "categoria": "PickUp",
            "modelo": "T8"
        }
    ],
    "Jaguar": [
        {
            "categoria": "SUV",
            "modelo": "E-Pace"
        },
        {
            "categoria": "SUV",
            "modelo": "F-Pace"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "F-Type"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "I-Pace"
        },
        {
            "categoria": "Sedán",
            "modelo": "S-Type"
        },
        {
            "categoria": "Sedán",
            "modelo": "X-Type"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "XE"
        },
        {
            "categoria": "Sedán",
            "modelo": "XF"
        },
        {
            "categoria": "Sedán",
            "modelo": "XK"
        }
    ],
    "Jeep": [
        {
            "categoria": "SUV lujo",
            "modelo": "Cherokke"
        },
        {
            "categoria": "Camioneta",
            "modelo": "CJ"
        },
        {
            "categoria": "PickUp",
            "modelo": "Comanche"
        },
        {
            "categoria": "SUV",
            "modelo": "Compass"
        },
        {
            "categoria": "PickUp",
            "modelo": "Gladiator"
        },
        {
            "categoria": "SUV",
            "modelo": "Patriot"
        },
        {
            "categoria": "SUV",
            "modelo": "Renegade"
        },
        {
            "categoria": "SUV",
            "modelo": "Wagoneer"
        },
        {
            "categoria": "SUV",
            "modelo": "Wrangler"
        },
        {
            "categoria": "SUV",
            "modelo": "Liberty"
        },
        {
            "categoria": "SUV",
            "modelo": "Grand Cherokke"
        }
    ],
    "KIA": [
        {
            "categoria": "Sedán",
            "modelo": "Rio"
        },
        {
            "categoria": "Sedán",
            "modelo": "Forte"
        },
        {
            "categoria": "SUV",
            "modelo": "Sportage"
        },
        {
            "categoria": "Sedán",
            "modelo": "Optima"
        },
        {
            "categoria": "SUV",
            "modelo": "Sorento"
        },
        {
            "categoria": "SUV",
            "modelo": "Niro"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Sedona "
        },
        {
            "categoria": "Sedán",
            "modelo": "Soul"
        },
        {
            "categoria": "Sedán",
            "modelo": "Stinger"
        },
        {
            "categoria": "SUV",
            "modelo": "Seltos"
        }
    ],
    "Mazda": [
        {
            "categoria": "Sedán",
            "modelo": "2"
        },
        {
            "categoria": "Hatchback",
            "modelo": "3"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "6"
        },
        {
            "categoria": "SUV",
            "modelo": "CX-3"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "CX-5"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "CX-30"
        },
        {
            "categoria": "SUV",
            "modelo": "CX-7"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "CX-9"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "MX-5"
        }
    ],
    "Mercedes Benz": [
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase A"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Clase B"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase C"
        },
        {
            "categoria": "Sedán",
            "modelo": "Clase CL"
        },
        {
            "categoria": "Coupé",
            "modelo": "Clase CLA"
        },
        {
            "categoria": "Coupé",
            "modelo": "Clase CLS"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase E"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase G"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase GL"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase GLA"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase GLB"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase GLC"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase GLE"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase GLS"
        },
        {
            "categoria": "Camioneta Lujo",
            "modelo": "Clase M"
        },
        {
            "categoria": "Van",
            "modelo": "Clase R"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase S"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase SL"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Clase SLK"
        },
        {
            "categoria": "Van",
            "modelo": "Clase V"
        },
        {
            "categoria": "Coupé lujo",
            "modelo": "GT"
        },
        {
            "categoria": "Van",
            "modelo": "Sprinter"
        },
        {
            "categoria": "Van",
            "modelo": "Viano"
        },
        {
            "categoria": "Van",
            "modelo": "Vito"
        }
    ],
    "Mitsubishi": [
        {
            "categoria": "SUV lujo",
            "modelo": "ASX"
        },
        {
            "categoria": "Sedán",
            "modelo": "Eclipse"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Endeavor"
        },
        {
            "categoria": "Sedán",
            "modelo": "Galant"
        },
        {
            "categoria": "Van",
            "modelo": "Grandis"
        },
        {
            "categoria": "PickUp",
            "modelo": "L200"
        },
        {
            "categoria": "Sedán",
            "modelo": "Lancer"
        },
        {
            "categoria": "Sedán",
            "modelo": "Mirage"
        },
        {
            "categoria": "SUV",
            "modelo": "Montero"
        },
        {
            "categoria": "SUV",
            "modelo": "Outlander"
        }
    ],
    "Nissan": [
        {
            "categoria": "Sedán",
            "modelo": "300zx"
        },
        {
            "categoria": "Coupé",
            "modelo": "350z"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "370z"
        },
        {
            "categoria": "Sedán",
            "modelo": "Almera"
        },
        {
            "categoria": "Sedán",
            "modelo": "Altima"
        },
        {
            "categoria": "Sedán",
            "modelo": "Aprio"
        },
        {
            "categoria": "SUV",
            "modelo": "Armada"
        },
        {
            "categoria": "Carga",
            "modelo": "Cabstar"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Juke"
        },
        {
            "categoria": "SUV",
            "modelo": "Kicks"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Leaf"
        },
        {
            "categoria": "Sedán",
            "modelo": "Lucino"
        },
        {
            "categoria": "Sedán",
            "modelo": "March"
        },
        {
            "categoria": "Sedán",
            "modelo": "Máxima"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Murano"
        },
        {
            "categoria": "Sedán",
            "modelo": "Note"
        },
        {
            "categoria": "PickUp",
            "modelo": "NP300"
        },
        {
            "categoria": "Van",
            "modelo": "NV 2500"
        },
        {
            "categoria": "SUV",
            "modelo": "Pathfinder"
        },
        {
            "categoria": "Sedán",
            "modelo": "Platina"
        },
        {
            "categoria": "Camioneta",
            "modelo": "Quest"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Rogue"
        },
        {
            "categoria": "Sedán",
            "modelo": "Sentra"
        },
        {
            "categoria": "Sedán",
            "modelo": "Tiida"
        },
        {
            "categoria": "PickUp",
            "modelo": "Titán"
        },
        {
            "categoria": "Sedán",
            "modelo": "Tsuru"
        },
        {
            "categoria": "Van",
            "modelo": "Urvan "
        },
        {
            "categoria": "Sedán",
            "modelo": "Versa"
        },
        {
            "categoria": "SUV",
            "modelo": "X-Terra"
        },
        {
            "categoria": "SUV",
            "modelo": "X-trail"
        },
        {
            "categoria": "Pick Up",
            "modelo": "Frontier"
        }
    ],
    "Peugeot": [
        {
            "categoria": "Sedán",
            "modelo": "207"
        },
        {
            "categoria": "Sedán",
            "modelo": "206"
        },
        {
            "categoria": "Sedán",
            "modelo": "208"
        },
        {
            "categoria": "SUV",
            "modelo": "2008"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "3008"
        },
        {
            "categoria": "Sedán",
            "modelo": "301"
        },
        {
            "categoria": "Sedán",
            "modelo": "306"
        },
        {
            "categoria": "Sedán",
            "modelo": "307"
        },
        {
            "categoria": "Coupé",
            "modelo": "308"
        },
        {
            "categoria": "Sedán",
            "modelo": "406"
        },
        {
            "categoria": "Sedán",
            "modelo": "407"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "5008"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "508"
        },
        {
            "categoria": "Sedán",
            "modelo": "607"
        },
        {
            "categoria": "Van",
            "modelo": "Expert"
        },
        {
            "categoria": "PickUp",
            "modelo": "Landtrek"
        },
        {
            "categoria": "Van",
            "modelo": "Manager"
        },
        {
            "categoria": "Van",
            "modelo": "Partner"
        },
        {
            "categoria": "Coupé",
            "modelo": "Rcz"
        },
        {
            "categoria": "Van",
            "modelo": "Rifter"
        }
    ],
    "Pontiac": [
        {
            "categoria": "Compacto Sedán",
            "modelo": "Matiz"
        }
    ],
    "RAM": [
        {
            "categoria": "PickUp",
            "modelo": "Promaster Rapid"
        }
    ],
    "Renault": [
        {
            "categoria": "SUV",
            "modelo": "Captur"
        },
        {
            "categoria": "Sedán",
            "modelo": "Clío"
        },
        {
            "categoria": "SUV",
            "modelo": "Duster"
        },
        {
            "categoria": "Sedán",
            "modelo": "Fluence"
        },
        {
            "categoria": "Van",
            "modelo": "Kangoo"
        },
        {
            "categoria": "SUV",
            "modelo": "Koleos"
        },
        {
            "categoria": "SUV",
            "modelo": "Kwid"
        },
        {
            "categoria": "Sedán",
            "modelo": "Logan"
        },
        {
            "categoria": "Sedán",
            "modelo": "Megane"
        },
        {
            "categoria": "PickUp",
            "modelo": "Oroch"
        },
        {
            "categoria": "Sedán",
            "modelo": "Safrane"
        },
        {
            "categoria": "SUV",
            "modelo": "Sandero"
        },
        {
            "categoria": "SUV",
            "modelo": "Scala"
        },
        {
            "categoria": "Sedán",
            "modelo": "Scénic"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Stepway"
        },
        {
            "categoria": "Van",
            "modelo": "Trafic"
        }
    ],
    "SEAT": [
        {
            "categoria": "Van",
            "modelo": "Alhambra"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Altea"
        },
        {
            "categoria": "SUV",
            "modelo": "Arona"
        },
        {
            "categoria": "SUV",
            "modelo": "Ateca"
        },
        {
            "categoria": "Sedán",
            "modelo": "Cordoba"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Cupra"
        },
        {
            "categoria": "Sedán",
            "modelo": "Exeo"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Freetrack"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Ibiza"
        },
        {
            "categoria": "Sedán",
            "modelo": "León"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Tarraco"
        },
        {
            "categoria": "Sedán",
            "modelo": "Toledo"
        }
    ],
    "Subaru": [
        {
            "categoria": "Sedán",
            "modelo": "Impreza"
        },
        {
            "categoria": "SUV",
            "modelo": "Forester"
        },
        {
            "categoria": "SUV",
            "modelo": "Outback"
        },
        {
            "categoria": "SUV",
            "modelo": "XV"
        },
        {
            "categoria": "Sedán",
            "modelo": "WRX"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "BRZ"
        }
    ],
    "Suzuki": [
        {
            "categoria": "Sedán",
            "modelo": "Aerio"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Baleno"
        },
        {
            "categoria": "Sedán",
            "modelo": "Ciaz"
        },
        {
            "categoria": "Van",
            "modelo": "Ertiga"
        },
        {
            "categoria": "SUV",
            "modelo": "Ignis"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Jimmy"
        },
        {
            "categoria": "Sedán",
            "modelo": "Kizashi"
        },
        {
            "categoria": "Camioneta lujo",
            "modelo": "S-Cross"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Swift"
        },
        {
            "categoria": "Hatchback",
            "modelo": "SX4"
        },
        {
            "categoria": "SUV",
            "modelo": "VItara"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "XL-7"
        }
    ],
    "Tesla": [
        {
            "categoria": "Sedán lujo",
            "modelo": "Model S"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Model 3"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Model X"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Model Y"
        }
    ],
    "Toyota ": [
        {
            "categoria": "SUV",
            "modelo": "4Runner"
        },
        {
            "categoria": "Van",
            "modelo": "Avanza"
        },
        {
            "categoria": "Sedán",
            "modelo": "Camry"
        },
        {
            "categoria": "Sedán",
            "modelo": "Celica"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "CH-R"
        },
        {
            "categoria": "Sedán",
            "modelo": "Corolla"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Fj Cruiser"
        },
        {
            "categoria": "Van",
            "modelo": "HIace"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Highlander"
        },
        {
            "categoria": "PickUp",
            "modelo": "Hilux"
        },
        {
            "categoria": "SUV",
            "modelo": "Matrix"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "MR2"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "Prius"
        },
        {
            "categoria": "SUV",
            "modelo": "Raize"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "RAV4"
        },
        {
            "categoria": "Sedán",
            "modelo": "Scion"
        },
        {
            "categoria": "Camioneta lujo",
            "modelo": "Sequoia"
        },
        {
            "categoria": "SUV",
            "modelo": "Sienna"
        },
        {
            "categoria": "PickUp",
            "modelo": "Tacoma"
        },
        {
            "categoria": "PickUp",
            "modelo": "Tundra"
        },
        {
            "categoria": "Sedán",
            "modelo": "Yaris"
        }
    ],
    "Volkswagen": [
        {
            "categoria": "PickUp",
            "modelo": "Amarok"
        },
        {
            "categoria": "Sedán",
            "modelo": "Beetle"
        },
        {
            "categoria": "Sedán",
            "modelo": "Corsar"
        },
        {
            "categoria": "Van",
            "modelo": "Crafter"
        },
        {
            "categoria": "Van",
            "modelo": "Caddy"
        },
        {
            "categoria": "SUV",
            "modelo": "Crossfox"
        },
        {
            "categoria": "Van",
            "modelo": "Combi"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "Cross Sport"
        },
        {
            "categoria": "SUV",
            "modelo": "Crossgolf"
        },
        {
            "categoria": "Sedán",
            "modelo": "Derby"
        },
        {
            "categoria": "Van",
            "modelo": "Eurovan"
        },
        {
            "categoria": "Sedán",
            "modelo": "Golf"
        },
        {
            "categoria": "Sedán",
            "modelo": "Gol"
        },
        {
            "categoria": "Sedán",
            "modelo": "Jetta"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Lupo"
        },
        {
            "categoria": "Van",
            "modelo": "Multivan"
        },
        {
            "categoria": "SUV",
            "modelo": "Nivus"
        },
        {
            "categoria": "Sedán",
            "modelo": "Passat"
        },
        {
            "categoria": "Sedán",
            "modelo": "Pointer"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Polo"
        },
        {
            "categoria": "Van",
            "modelo": "Routan"
        },
        {
            "categoria": "PickUp",
            "modelo": "Saveiro"
        },
        {
            "categoria": "Van",
            "modelo": "Sharan"
        },
        {
            "categoria": "SUV",
            "modelo": "T-Cross"
        },
        {
            "categoria": "SUV",
            "modelo": "Teramont"
        },
        {
            "categoria": "SUV",
            "modelo": "Touareg"
        },
        {
            "categoria": "SUV",
            "modelo": "Taos"
        },
        {
            "categoria": "SUV",
            "modelo": "Tiguan"
        },
        {
            "categoria": "Van",
            "modelo": "Transporter"
        },
        {
            "categoria": "Hatchback",
            "modelo": "Up"
        },
        {
            "categoria": "Sedán",
            "modelo": "Vento"
        },
        {
            "categoria": "Sedán",
            "modelo": "Virtus"
        }
    ],
    "Volvo": [
        {
            "categoria": "Sedán",
            "modelo": "C30"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "C70"
        },
        {
            "categoria": "Sedán",
            "modelo": "S40"
        },
        {
            "categoria": "Sedán lujo",
            "modelo": "S60"
        },
        {
            "categoria": "Sedán",
            "modelo": "S80"
        },
        {
            "categoria": "Hatchback",
            "modelo": "V40"
        },
        {
            "categoria": "SUV",
            "modelo": "V60"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "XC40"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "XC60"
        },
        {
            "categoria": "SUV lujo",
            "modelo": "XC90"
        }
    ]}

  consulta_vehiculo_new(data): Promise<any[]> {
    return new Promise((resolve, reject) => {
    const {cliente, sucursal, vehiculo} = data
      const starCountRef = ref(db, `vehiculos/${sucursal}/${cliente}/${vehiculo}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const vehiculo = snapshot.val()
          resolve(vehiculo);
        } else {
          resolve([]);
        }
      },{
        onlyOnce: true
      });
    });
  }
  consulta_vehiculos(data): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const {sucursal, cliente} = data
      const starCountRef = ref(db, `vehiculos/${sucursal}/${cliente}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const vehiculo = this._publicos.crearArreglo2(snapshot.val())
          resolve(vehiculo);
        } else {
          resolve([]);
        }
      },{
        onlyOnce: true
      });
    });
  }

  consulta_vehiculo(data): Promise<any> {
    return new Promise((resolve, reject) => {
        const {sucursal, cliente, vehiculo} = data
      const starCountRef = ref(db, `vehiculos/${sucursal}/${cliente}/${vehiculo}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          resolve({});
        }
      },{
        onlyOnce: true
      });
    });
  }



  async existenPlacas(placas:string){
    let listaPlacas = [], existen:boolean = false
    await get(child(dbRef, `vehiculos`)).then((snapshot) => {
      if (snapshot.exists()) {
        listaPlacas = this.crearArreglo2(snapshot.val())
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    for (let index = 0; index < listaPlacas.length; index++) {
      const element = listaPlacas[index];
      if (element.placas === placas) {
        existen = true
      }
    }
    return existen
  }
  async lista_vehiculos(){
    let answer = {contenido: false, data:[]}
    await get(child(dbRef, `vehiculos`)).then((snapshot) => {
      if (snapshot.exists()) {
        const vehiculos = this._publicos.crearArreglo2(snapshot.val())
        answer.data = vehiculos
        answer.contenido = true
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  async vehiculos(cliente:string){
    let answer = {informacion:false,arreglo:[]}
    await get(child(dbRef, `vehiculos`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        let v = this.crearArreglo2(snapshot.val())
        const vehiculos = await v.filter(o=>o.cliente === cliente)
        answer.arreglo = vehiculos;
        (vehiculos.length)? answer.informacion = true: ''
      }
    }).catch((error) => {
      answer.informacion = false
    });
    return answer
  }
  async infoVehiculo(id:string){
    let answer = {contenido:false,vehiculo:{}}
    await get(child(dbRef, `vehiculos/${id}`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        answer.contenido = true
        answer.vehiculo = snapshot.val()
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }



  async engomado(valor:string){
    let engomado:string ='', placas:string = valor
    const engomados =[
      {color:'verde',numeros:[1,2]},
      {color:'rojo',numeros:[3,4]},
      {color:'amarillo',numeros:[5,6]},
      {color:'rosa',numeros:[7,8]},
      {color:'azul',numeros:[9,0]}]

    let arregloNumeros = []

    for (let index = 0; index < placas.length; index++) {
      const element = placas[index];
      (Number(element)>=0)? arregloNumeros.push(element): null;
    }
    const posicion = arregloNumeros.length -1
    const numero:number =  arregloNumeros[posicion];

    for (let index = 0; index < engomados.length; index++) {
      const element = engomados[index];
      (numero == Number(element.numeros[0]) || numero == Number(element.numeros[1]) )? engomado=element.color: null;
    }
    return engomado
  }
  
  async coloresAutos(){
    let arrayColores =[]
    await get(child(dbRef, `colores_autos`)).then((snapshot) => {
      if (snapshot.exists()) {
        arrayColores = snapshot.val()
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return arrayColores
  }
  async consultaMarcasNew(){
    let arregloMarcas = []
    await get(child(dbRef, `marcas_autos`)).then((snapshot) => {
      if (snapshot.exists()) {
        arregloMarcas = this.crearArreglo2(snapshot.val())
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    })
    // console.log(arregloMarcas);
    return arregloMarcas
  }
  async registraVehiculo(infoVhiculo:any){
    let infoReturn = {continuar:false,mensaje:''}
    await set(ref(db, `vehiculos/${infoVhiculo.id}`), infoVhiculo )
    .then(() => {
      // Data saved successfully!
      infoReturn.continuar = true, infoReturn.mensaje ='registro completo'
    })
    .catch((error) => {
      // The write failed...
      infoReturn.continuar = false, infoReturn.mensaje = error

    });
    // console.log(arregloMarcas);
    return infoReturn
  }
  async verificaPlacas(placasGet:string){
    const placas = String(placasGet).toLowerCase()
    let existenPlacas:boolean = false;
    let listaVehiculos = [], arregloPlacas = []

    await get(child(dbRef, `vehiculos`)).then((snapshot) => {
      if (snapshot.exists()) {
        listaVehiculos = this._publicos.crearArreglo2(snapshot.val())
        for (let index = 0; index < listaVehiculos.length; index++) {
          const element = listaVehiculos[index];
          arregloPlacas.push(element.placas)
        }
        
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    for (let index = 0; index < arregloPlacas.length; index++) {
      const element = arregloPlacas[index];
      if (placas === String(element).toLowerCase()) {
        existenPlacas = true
      }
    }
    // console.log(arregloMarcas);
    return existenPlacas
  }
  async partesVehiculo(){
    let partes =[]
    await get(child(dbRef, `partesVehiculo`)).then((snapshot) => {
      if (snapshot.exists()) {
        partes = this._publicos.crearArreglo2(snapshot.val())
      }
    }).catch((error) => {
      console.error(error);
    });
    return partes
  }
  async checklist(){
    let partes =[]
    await get(child(dbRef, `checklist`)).then((snapshot) => {
      if (snapshot.exists()) {
        partes = this.crearArreglo2(snapshot.val())
      }
    }).catch((error) => {
      console.error(error);
    });
    return partes
  }

  registra_Vehiculo(cliente:string,dataVehiculo:any){
    const answer = { registro: false, contador:null}
    set(ref(db, `clientes/${cliente}/vehiculos/${dataVehiculo['id']}`), dataVehiculo )
    .then(async () => {
      // Data saved successfully!
      answer.registro = true
      await this.getConteoPlacas().then(({placas})=>{
        answer.contador = placas
      })
    })
    .catch((error) => {
      // The write failed...
    });
    const updates = {}
    if(dataVehiculo.id) updates[`clientes/${cliente}/vehiculos/${dataVehiculo.id}`] = dataVehiculo ;
    else updates[`clientes/${cliente}/vehiculos/${this._publicos.generaClave()}`] = dataVehiculo ;
    update(ref(db), updates);
    return answer
  }
  nuevoregistro_v(cliente:string,dataVehiculo:any){
    const updates = {}
    if(dataVehiculo.id) updates[`clientes/${dataVehiculo.cliente}/vehiculos/${dataVehiculo.id}`] = dataVehiculo ;
    else updates[`clientes/${dataVehiculo.cliente}/vehiculos/${this._publicos.generaClave()}`] = dataVehiculo ;
    update(ref(db), updates)
    .then(()=>{return true})
    .catch(()=>{return false})
  }
  async registra_vehiculo_new(dataVehiculo) {
    try {
      const updates = {};
      const id = (dataVehiculo.id) ? dataVehiculo.id : this._publicos.generaClave()
        updates[`clientes/${dataVehiculo.cliente}/vehiculos/${id}`] = dataVehiculo;
            
      await update(ref(db), updates);
      return id;
    } catch (error) {
      return false;
    }
  }
  
  async getConteoPlacas(){
    const answer = {placas:0,data:[]}
    await get(child(dbRef, `placas`)).then((snapshot) => {
      if (snapshot.exists()) {
        
        const contador =  this._publicos.crearArreglo(snapshot.val())
        answer.placas = contador.length
        answer.data = snapshot.val()
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  async registraPlacas(contador:number ,placas:string){
    const answer = {registro: false}
    await set(ref(db, `placas/${contador}`), placas )
    .then(() => {
      // Data saved successfully!
      answer.registro = true
    })
    .catch((error) => {
      // The write failed...
    });
    return answer
  }

  async get_marcas(){
    let answer = {contenido:false, data:[]}
    await get(child(dbRef, `marcas_autos`)).then((snapshot) => {
      if (snapshot.exists()) {
        answer.contenido = true
        answer.data = this.crearArreglo2(snapshot.val())
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  async getColores(){
    let answer = {contenido:false, data:[]}
    await get(child(dbRef, `colores_autos`)).then((snapshot) => {
      if (snapshot.exists()) {
        answer.contenido = true
        answer.data = snapshot.val()
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }



  consultaMarcas(){
    return this.http.get(`${urlServer}/marcas_autos.json`)
    .pipe(
      map(this.crearArreglo)
    )
  }

  consultaModelos(){
    return this.http.get(`${urlServer}/modelos.json`)
    .pipe(
      map(this.crearArreglo)
    )
  }
  consultaCategorias(){
    return this.http.get(`${urlServer}/categorias_autos.json`)
    .pipe(
      map(this.crearArreglo)
    )
  }
  consultaColores(){
    return this.http.get(`${urlServer}/colores_autos.json`)
    .pipe(
      map(this.crearArreglo)
    )
  }
  consultaColoresEngomado(){
    return this.http.get(`${urlServer}/engomado.json`)
    .pipe(
      map(this.crearArreglo)
    )
  }
  getAnios(){
    return this.http.get(`${urlServer}/anios.json`)
    .pipe(
      map(this.crearArreglo)
    )
  }

  registroVehiculo(sucursal:string,cliente:string,vehiculo: Vehiculo){
    const temp={
      ...vehiculo
    }
    return this.http.post(`${urlServer}/vehiculos/${sucursal}/${cliente}.json`,temp)
  }
  listaGenaralVehiculos(){
    return this.http.get(`${urlServer}/vehiculos.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  eliminaVehiculoClinte(id:string,vehiculo:any){
    return this.http.delete(`${ urlServer }/vehiculos/${ vehiculo.cliente }/${vehiculo.id}.json`);
  }

  consultaUnicaVehiculo(sucursal:string,cliente:string, vehiculo:string){
    return this.http.get(`${ urlServer }/vehiculos/${sucursal}/${cliente}/${vehiculo}.json`)
  }
  consultaVehiculoUnicaSucursal(sucursal:string, cliente:string, vehiculo:String){
    return this.http.get(`${ urlServer }/vehiculos/${sucursal}/${cliente}/${vehiculo}.json`)
  }
  consultaUnicaVehiculoCliente(cliente:string, vehiculo:string){
    return this.http.get(`${ urlServer }/vehiculos/${cliente}/${vehiculo}.json`)
    // .pipe(
    //    map(this.crearArreglo)
    // )
  }
  consultaUnicaVehiculoGeneral(ID:string){
    return this.http.get(`${ urlServer }/vehiculos/${ID}.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  actualizaDataVehiculo(id:string,vehiculo:Vehiculo){
    const temp={
      ...vehiculo
    }
    return this.http.put(`${urlServer}/vehiculos/${vehiculo.cliente}/${id}.json`,temp)
  }
  consultaVehiculosCliente(sucursal:string,ID:string){
    return this.http.get(`${ urlServer }/vehiculos/${sucursal}/${ID}.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }

  registroVehiculoPlacas(cliente:string,vehiculo:string){
    return this.http.get(`${ urlServer }/vehiculos/${cliente}/${vehiculo}/placas.json`)
  }


  private crearArreglo2(marcasObj:object){
    //los que son un campo con ID mas de un campo
    const marcas:any[]=[]
    if (marcasObj===null) { return [] }
    Object.keys(marcasObj).forEach(key=>{
      const marca: any = marcasObj[key]
        marca.id = key
        marcas.push(marca )
    })
    return marcas
  }
  private crearArregloModificado(marcasObj:object){
    //los que son un campo con ID mas de un campo
    const marcas:any[]=[]
    if (marcasObj===null) { return [] }
    Object.keys(marcasObj).forEach(key=>{
      const marca: any = marcasObj[key]
        marca.id = key
        marcas.push(marca )
    })
    return marcas
  }
  private crearArreglo(marcasObj:object){
    const marcas:any[]=[]
    if (marcasObj===null) { return [] }
    Object.keys(marcasObj).forEach(key=>{
      const marca: any = marcasObj[key]
      marcas.push(marca)
    })
    return marcas
  }


  verificaInfo_vehiculo(data_vehiculo){
    let nueva_data = data_vehiculo
    if (nueva_data.id) {
      const campos= ['cilindros','anio','color','no_motor','marcaMotor','marca','categoria','engomado']
      campos.forEach(campo=>{
        nueva_data[campo] = (nueva_data[campo]) ? nueva_data[campo] : ''
      })
    }
    return nueva_data
  }

}
