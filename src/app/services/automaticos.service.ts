import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { getDatabase, onValue, ref, set } from "firebase/database"
import { initializeApp } from 'firebase/app';
// const app = initializeApp(environment.firebaseConfig);
const db = getDatabase();

// const urlServer = environment.urlServer

@Injectable({
  providedIn: 'root'
})
export class AutomaticosService {

  constructor(private http: HttpClient) { }
  marcas=[
'Acura',
'Alfa Romeo',
'Aston Martín',
'Audi',
'Baic',
'Bentley',
'BMW',
'Buick',
'Cadillac',
'Chevrolet',
'Chrysler',
'Dodge',
'Ferrari',
'Fiat',
'Ford',
'GMC',
'Honda',
'Hyundai',
'Hyundai',
'Infiniti',
'Jac',
'Jaguar',
'Jeep',
'Jeep',
'KIA',
'Mazda',
'Mercedes Benz',
'Mitsubishi',
'Nissan',
'Peugeot',
'SEAT',
'Subaru',
'Suzuki',
'Tesla',
'Volkswagen',
'Volvo'
  ]
 
  
  modelos=['1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000','2001',
  '2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021',
  '2022','2023']
  carroceria=[
    'Sedán',
    'Hatchback',
    'Coupé',
    'SUV',
    'Station Wagon',
    'Crossover',
    'Convertibles',
    'MPV',
    'Pick Up',
  ]
  colores=[
    'Plata',
    'Blanco',
    'Rojo intenso',
    'Azul medio y rojo cenizo',
    'Azul claro',
    'Azul oscuro',
    'Marrón claro',
    'Negro',
    'Gris',
    'Verde oscuro',
    'Amarillo - Verde brillante',
    'Amarillo oro',
    'Amarillo sol',
    'Marrón profundo',
    'Naranja',
    'Violeta profundo',
    'Bitono',
    'Café Claro',
    'Otros'
  ]
  engomados=["Amarillo","Azul","Rojo","Rosa","Verde"]
  anios=[
    "1990",	"1991",	"1992","1993","1994","1995","1996","1997","1998","1999",
    "2000",	"2000",	"2001","2002","2003","2004","2005","2006","2007","2008","2009",
    "2010",	"2010",	"2011","2012","2013","2014","2015","2016","2017","2018","2019",
    "2020",	"2020",	"2021","2022","2023","2024","2025","2026","2027","2028","2029"
  ]
  categoria=["Sedán","Coupé","Crossover","Hatchback","SUV","Station Wagon","MPV","Convertibles","Pick Up"]
  marcas_autos=[ 
    "Acura","RAM","SEAT","Renault","Peugeot","Subaru","Suzuki","Tesla","Toyota","Volkswagen","Volvo","ASTON MARTIN","BAIC","Alfa Romeo","Audi","Bentley","BMW","Cadillac","DODGE","BUICK","Chevrolet","Chrysler","GMC","Ferrari","Ford","Cadillac","Fiat","Honda","Infiniti","Hyundai","JAC","Jaguar","Mercedes Benz","Mitsubishi","Nissan","Mazda","Jeep","KIA"
  ]
  horariosCitas=[
    "08:30",
    "08:40",
    "08:50",
    "09:00",
    "09:10",
    "09:20",
    "09:30",
    "09:40",
    "09:50",
    "10:00",
    "10:10",
    "10:20",
    "10:30",
    "10:40",
    "10:50",
    "11:00",
    "11:10",
    "11:20",
    "11:30",
    "11:40",
    "11:50",
    "12:00",
    "12:10",
    "12:20",
    "12:30",
    "12:40",
    "12:50",
    "13:00",
    "13:10",
    "13:20",
    "13:30",
    "13:40",
    "13:50",
    "14:00",
    "14:10",
    "14:20",
    "14:30",
    "14:40",
    "14:50",
    "15:00",
    "15:10",
    "15:20",
    "15:30",
    "15:40",
    "15:50",
    "16:00",
    "16:10",
    "16:20",
    "16:30",
    "16:40",
    "16:50",
    "17:00",
    "17:10",
    "17:20",
    "17:30",
    "17:40",
    "17:50",
    "18:00",
    "18:10",
    "18:20"
  ]

  estados = [
    'Aguascalientes',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'México',
    'Michoac',
    'Morelos',
    'Nayarit',
    'Nuevo Leon',
    'Baja California',
    'Oaxaca',
    'Puebla',
    'Queretaro',
    'Quintana Roo',
    'San Luis Potosi',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Baja California Sur',
    'Veracruz de Ignacio de la Llave',
    'Yucatan',
    'Zacatecas',
    'Campeche',
    'Coahuila de Zaragoza',
    'Colima',
    'Chiapas',
    'Chihuahua',
    'Ciudad de México',
]

partesVehiculo:string[]=[
  'Capo','Paragolpes_frontal','Paragolpes_posterior','Techo',
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

  registroAutomaticvos(){
    return  this.partesVehiculo.forEach(partes => {
      let foto =''
      console.log('aqui');
      
      set(ref(db, `partesVehiculo/${partes}/foto`),'' )
      
    })
  
  }
  registroMarcasAutos(){
    return this.http.post(`${environment.firebaseConfig.databaseURL}/marcas_autos.json`,this.marcas).subscribe()
    this.marcas.forEach(element => {
      const temp={
        element
      }
      

    })
  }
  registroModelos(){
  
      //return this.http.put(`${urlServer}/modelos.json`,this.modelos).subscribe()
      //return this.http.put(`${urlServer}/colores_autos.json`,this.colores)
      //return this.http.put(`${urlServer}/engomado.json`,this.engomados)
      //return this.http.put(`${urlServer}/anios.json`,this.anios)
      //return this.http.put(`${urlServer}/categorias_autos.json`,this.categoria)
      //return this.http.put(`${urlServer}/marcas_autos.json`,this.marcas_autos)
      
      // return this.http.put(`${urlServer}/estados.json`,this.estados)
      
  }
  registroCarrocerias(){
    this.carroceria.forEach(element => {
      const temp={
        element
      }
      //return this.http.post(`${urlServer}/carrocerias.json`,temp).subscribe()
    }) 
  }
  // registroColores(){
  //   this.colores.forEach(element => {
  //     const temp={
  //       element
  //     }
  //     return this.http.post(`${urlServer}/colores_autos.json`,temp).subscribe()
  //   }) 
  // }
}
