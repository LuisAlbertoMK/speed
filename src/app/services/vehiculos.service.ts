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

  
  consulta_vehiculo_new(cliente,vehiculo): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `clientes/${cliente}/vehiculos/${vehiculo}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const vehiculo = snapshot.val()
          resolve(vehiculo);
        } else {
          resolve([]);
        }
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

}
