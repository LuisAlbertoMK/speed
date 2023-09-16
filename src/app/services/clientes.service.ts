import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { map } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Directorio } from '../models/directorio.model';
import { Facturacion } from '../models/facturacion.model';
import { environment } from "../../environments/environment";
import { Credito } from '../models/credito.model';

import { child, get, getDatabase, onValue, push, ref, set } from "firebase/database";
import { ServiciosPublicosService } from './servicios-publicos.service';
import { info } from 'console';
import { SucursalesService } from './sucursales.service';
import { EmailsService } from './emails.service';
import { VehiculosService } from './vehiculos.service';

const db = getDatabase()
const dbRef = ref(getDatabase());
@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  telefonosInvalidos:any[]=['5555555555','1111111111','0000000000','7777777777','1234567890','0123456789'];
  camposCliente = ['id','no_cliente','nombre','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','sucursal','empresa','usuario']
  camposCliente_show=[
    {valor: 'no_cliente', show:'# Cliente'},
    // {valor: 'fullname', show:'Nombre'},
    {valor: 'nombre', show:'Nombre'},
    {valor: 'apellidos', show:'Apellidos'},
    {valor: 'correo', show:'Correo'},
    {valor: 'correo_sec', show:'Correo adicional'},
    {valor: 'telefono_fijo', show:'Tel. Fijo'},
    {valor: 'telefono_movil', show:'Tel. cel.'},
    {valor: 'tipo', show:'Tipo'},
    {valor: 'empresa', show:'Empresa'},
    {valor: 'sucursalShow', show:'Sucursal'}
  ]
  camposSave= ['no_cliente','nombre','apellidos','correo','correo_sec','telefono_fijo','telefono_movil','tipo','sucursal','empresa','empresaShow','sucursalShow']

  tipos_cliente= ['todos','flotilla','particular']
  sucursales_array = [...this._sucursales.lista_en_duro_sucursales]

  campos_cliente = ['no_cliente','nombre','apellidos','correo','tipo','sucursal','telefono_movil']
  campos_permitidos_Actualizar = ['nombre','apellidos','tipo','telefono_movil']
  campos_opcionales = ['correo_sec','telefono_fijo']
  campos_permitidos_new_register = [...this.campos_cliente,...this.campos_opcionales]
  campos_show_validaciones = [
    {valor: 'no_cliente', show:'# Cliente' },
    {valor: 'telefono_movil', show:'Tel. cel.' },
    {valor: 'telefono_fijo', show:'Tel. Fijo' },
    {valor: 'nombre', show:'Nombre' },
    {valor: 'apellidos', show:'Apellidos' },
    {valor: 'sucursal', show:'Sucursal' },
    {valor: 'tipo', show:'Tipo' },
    {valor: 'correo_sec', show:'Correo adicional' },
    {valor: 'empresa', show:'Empresa' },
    {valor: 'correo', show:'Correo' },
  ]

  constructor(private http: HttpClient, private _publicos:ServiciosPublicosService, private _sucursales: SucursalesService,
    private _vehiculos: VehiculosService,
    private _mail: EmailsService) { }
  url:string= 'https://speed-pro-app-default-rtdb.firebaseio.com'


  //TODO
  consulta_clientes__busqueda(data): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const {ruta} = data
      const starCountRef = ref(db, ruta);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(this._publicos.crearArreglo2(snapshot.val()));
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_Cliente(cliente): Promise<any> {
    return new Promise((resolve, reject) => {
      // const {ruta} = data
      const starCountRef = ref(db, `clientes/${cliente}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val())
        } else {
          resolve({});
        }
      }, {
        onlyOnce: true
      })
    });
  }
  formato_informacion_cliente(data_cliente){
    const {nombre, apellidos} = data_cliente
    const sucursalShow = this.sucursales_array.find(s=>s.id === data_cliente.sucursal).sucursal
    data_cliente.fullname =  `${String(nombre).toLowerCase()} ${String(apellidos).toLowerCase()}`
    data_cliente.sucursalShow =  `${sucursalShow}`
    return data_cliente
  }
  //TODO
  consulta_clientes_new(busqueda, sucursal): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, busqueda);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          let clientes = []
          if (sucursal === 'Todas') {
            snapshot.forEach((childSnapshot) => {
              const childKey = childSnapshot.key;
              const childData = childSnapshot.val();
              // console.log(childKey);
              // console.log(childData);
              const cli = this._publicos.crearArreglo2(childData)
              cli.forEach(c=>{
                clientes.push(this.formatea_info_cliente(c))
              })
            })
          }else{
            const cli = this._publicos.crearArreglo2(snapshot.val());
            cli.forEach(c=>{
              clientes.push(this.formatea_info_cliente(c))
            })
          }
          resolve(clientes);
        } else {
          resolve([]);
        }
      });
    });
  }

  formatea_info_cliente(data_cliente){
    const {nombre, apellidos, sucursal} = data_cliente
    data_cliente.fullname = `${nombre} ${apellidos}`
    data_cliente.data_sucursal = this.sucursales_array.find(s=>s.id === sucursal)
    return data_cliente
  }
  formatea_info_cliente_2(data_cliente){
    const {sucursal, nombre, apellidos } = data_cliente
    data_cliente.sucursalShow = this.sucursales_array.find(s=>s.id === sucursal).sucursal
    data_cliente.fullname = `${String(nombre).toLowerCase()} ${String(apellidos).toLowerCase()}`
  
    return data_cliente
  }
  consulta_cliente_new(data): Promise<object> {
    return new Promise((resolve, reject) => {
      const {sucursal, cliente} = data
      const starCountRef = ref(db, `clientes/${sucursal}/${cliente}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const data_cliente = snapshot.val()
          data_cliente.id = cliente
          resolve(this.formatea_info_cliente_2(data_cliente));
        } else {
          resolve({});
        }
      }, {
        onlyOnce: true
      });
    });
  }
  consulta_usuario_new(usuario): Promise<object> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `usuarios/${usuario}`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          resolve(snapshot.val());
        } else {
          resolve({});
        }
      });
    });
  }
  consulta_cliente_vehiculos(cliente): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `clientes/${cliente}/vehiculos`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const vehiculos = this._publicos.crearArreglo2(snapshot.val())
          resolve(vehiculos);
        } else {
          resolve([]);
        }
      });
    });
  }
  consulta_empresas_new(): Promise<object> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `empresas`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
         resolve(snapshot.val());
        } else {
          resolve({});
        }
      });
    });
  }
  consulta_empresa_new(sucursal, id): Promise<object> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, `empresas/${sucursal}/${id}/empresa`);
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
         resolve(snapshot.val());
        } else {
          resolve({});
        }
      });
    });
  }
  genera_no_cliente(sucursal,nombre, apellidos,nuevoContador): Promise<string> {
    return new Promise((resolve, reject) => {
      const date = new Date();
      let nombreCotizacion 
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const anio = date.getFullYear().toString().slice(-2);
        const secuencia = nuevoContador.toString().padStart(4, '0');
        nombreCotizacion = `${String(nombre).trim().slice(0, 2)}${String(apellidos).trim().slice(0, 2)}${String(sucursal).trim().slice(0, 2)}${mes}${anio}${secuencia}`;
        resolve(String(nombreCotizacion).toUpperCase()) 
    });
  }
  // consultaClientes(){
  // return this.http.get(`${this.url}/clientes.json`)
  //   .pipe(
  //     map(this.crearArreglo2)
  //   )
  // }
  // listadoDirectoriosCliente(id:string){
  //   return this.http.get(`${this.url}/directorios/${id}/directorios.json`)
  //   .pipe(
  //     map(this.crearArreglo2)
  //   )
  // }
  // async listaClientes(){
  //   let answer = {contenido:false, data:[]}
  //   // const sucursales = await this._sucursales.consultaSucursales().then(o=>{return o['data']})
  //   // const vehiculos = await this._vehiculos.lista_vehiculos().then(o=>{ return o['data']})
  //   // console.log(su);
  //   await get(child(dbRef, `clientes`)).then(async (snapshot) => {
  //     if (snapshot.exists()) {
  //       const clientes = this._publicos.crearArreglo2(snapshot.val())
  //       clientes.map(c=>{
  //         // const infoSucursal = sucursales.find(o=>o['id'] === c['sucursal'])
  //         // const vehiculos_cliente = vehiculos.filter(o=>o['cliente'] === c['id'])
  //         // c['infoSucursal'] = infoSucursal
  //         // c['vehiculos'] = vehiculos_cliente
  //         c['fullname'] = `${c['nombre']} ${c['apellidos']}` 
  //         return c
  //       })
  //       answer.data = clientes
  //       answer.contenido =  true
  //     }
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  //   return answer
  // }
  async getEmpresas(){
    let answer = {contenido: false, data: []}
    await get(child(dbRef, `empresas`)).then((snapshot) => {
      if (snapshot.exists()) {
        answer.contenido = true
        answer.data = snapshot.val()
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  async getEmpresasSucursal(sucursal){
    let answer = {contenido: false, data: []}
    await get(child(dbRef, `empresas/${sucursal}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const arreglo = this._publicos.crearArreglo2(snapshot.val())
        arreglo.map(e=>{
          e['empresa'] = String(e['empresa']).toLowerCase()
        })
        // console.log(arreglo);
        answer.contenido = true
        answer.data = arreglo
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  async registraEmpresa(ID:string,data:any){
    let asnwer = {registro:false}
    const dat =  {empresa: data['empresa']}
    await set(ref(db, `empresas/${ID}/${data['id']}`), dat )
          .then(() => {
            // Data saved successfully!
            asnwer.registro = true
          })
          .catch((error) => {
            // The write failed...
          });

    return asnwer
  }
  async infoCliente(id:string){
    let answer = {informacion:false,info:{}}
    await get(child(dbRef, `clientes/${id}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const infos = snapshot.val()
        infos.fullname = `${infos.nombre} ${infos.apellidos}`
        answer.info = infos
        answer.informacion = true
      } else {
        answer.informacion = false
      }
    }).catch((error) => {
      console.error(error);
    });
    return answer
  }
  
  // async countClientes(){
  //   let clientes = 0
  //   await get(child(dbRef, `clientes`)).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       let contador  = this.crearArreglo2(snapshot.val())
  //       clientes = contador.length
  //     } else {
  //       console.log("No data available");
  //     }
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  //   return clientes
  // }
  // async ListaClientes(){
  //   let answer = {existe:false,clientes:[]}
  //   await get(child(dbRef, `clientes`)).then((snapshot) => {
  //     if (snapshot.exists()) {
  //       const clie = this.crearArreglo2(snapshot.val())
        
  //       for (let index = 0; index < clie.length; index++) {
  //         const element = clie[index];
  //         clie[index].fullname = `${element.nombre} ${element.apellidos}`
  //         clie[index].id = `${element.id}`
  //       }
  //       answer['clientes'] = clie
  //       answer.existe = true
  //     } else {
  //       console.log("No data available");
  //     }
  //   }).catch((error) => {
  //     console.error(error);
  //   });
  //   return answer
  // }
  async telefonoValido(telefono:string){
    let bad:boolean = true
    for (let index = 0; index < this.telefonosInvalidos.length; index++) {
      const telefono_ = this.telefonosInvalidos[index];
      if (telefono === telefono_) {
        bad = false
      }
    }
    return bad
  }
  async existeCorreo(correo:string){
    let existe = false, listaCorreos:any=[]
    await get(child(dbRef, `clientes`)).then((snapshot) => {
      if (snapshot.exists()) {
        listaCorreos = this.crearArreglo2(snapshot.val())
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

    for (let index = 0; index < listaCorreos.length; index++) {
      const element = listaCorreos[index];
      if (element.correo === correo) { existe = true}
    }
    // console.log(listaCorreos);
    // console.log(correo);
    return existe
  }

  async generaNombreCliente(infoSucursal:any,infoCliente:any){
    let contadorClientes = 0, no_cliente =''
    await get(child(dbRef, `clientes`)).then((snapshot) => {
      if (snapshot.exists()) {
        const cuantosC = this.crearArreglo2(snapshot.val())
        contadorClientes = cuantosC.length
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
        const timeRequest = this._publicos.getFechaHora()
        const date: Date = new Date(timeRequest.fecha)
        const numeroCliente:number = contadorClientes + 1

        let mes = ''; let secuencia=''; let ceros = ''
        let inicialesNombre = infoCliente['nombre'].slice(0,2)
        let InicialesApellidos = infoCliente['apellidos'].slice(0,2)
        let incialesSucursal = infoSucursal.slice(0,2)
        let anio = String(date.getFullYear())
        let muestra = anio.slice(anio.length-2,anio.length)
        if((date.getMonth() +1)<10) { mes = `0${(date.getMonth() +1)}` }else{ mes=`${(date.getMonth() +1)}` }
        for (let index = String(numeroCliente).length; index < 4 ; index++) {
          ceros = `${ceros}0`
        }
        secuencia = `${ceros}${numeroCliente}`
        let nombreCotizacion = `${inicialesNombre}${InicialesApellidos}${incialesSucursal}${mes}${muestra}${secuencia}`
        no_cliente = nombreCotizacion
        return no_cliente
  }
  async registraCliente(data:any){
    let ans:boolean = false
    
    	await set(ref(db, `clientes/${data.id}`), data )
              .then(async () => {
                // Data saved successfully!

                await this._sucursales.inforSucursalUnica(data['sucursal']).then((info_sucursal)=>{

                  if (info_sucursal['correo']) {
                    const infocorreo = {
                      nombre: `${data['nombre']} ${data['apellidos']}`,
                      correos: [info_sucursal['correo'],data['correo']],
                      no_cliente: data['no_cliente']
                    }
                    this._mail.EmailBienvenida(infocorreo)
                    ans = true
                  }
                })
                
              })
              .catch((error) => {
                // The write failed...
                ans = false

              });
    return ans
  }



  guardarCliente(sucursal:string,cliente: string,dataCliente:any){
    const temp={
      ...dataCliente
    }
    temp.status = true
    return this.http.post(`${this.url}/clientes/${sucursal}/${cliente}.json`,temp)
  }
  guardarDirectorio(idCliente:string,cliente: Cliente){
    const temp={
      ...cliente
    }
    return this.http.post(`${this.url}/directorios/${idCliente}/directorios.json`,temp)

  }
  getClientesSucursal(sucursal:string){
    return this.http.get(`${ this.url }/clientes/${ sucursal }.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  updateStatus(sucursal:string,cliente:string,dataCliente:any,status:boolean){
    const clienteTemp = {
      ...dataCliente
    }
    clienteTemp.status = status
    return this.http.put(`${ this.url }/clientes/${sucursal}/${ cliente }.json`, clienteTemp);
  }
  consultaClienteID(sucursal:string,id:string){
    return this.http.get(`${ this.url }/clientes/${sucursal}/${ id }.json`)
  }
  consultaClienteConID(sucursal:string,id:string){
    return this.http.get(`${ this.url }/clientes/${ sucursal }/${ id }.json`)
  }
  consultaDirectorioID(id:string){
    return this.http.get(`${ this.url }/directorios/${ id }/directorios.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  actualizarCliente( sucursal:string,cliente:string,dataCliente: Cliente ) {
    const clienteTemp = {
      ...dataCliente
    };
    return this.http.put(`${ this.url }/clientes/${sucursal}/${ cliente }.json`, clienteTemp);
  }
  actualizarDirectorio( ID:string,id:string,directorio: Directorio ) {
    const directorioTemp = {
      ...directorio
    };
    return this.http.put(`${ this.url }/directorios/${ ID }/directorios/${id}.json`, directorioTemp);
  }
  directorioUnico(ID:string,id:string){
    return this.http.get(`${ this.url }/directorios/${ ID }/directorios/${id}.json`)
  }
  eliminarDirectorio(ID:string,id:string){
    return this.http.delete(`${ this.url }/directorios/${ ID }/directorios/${id}.json`)
  }
  guardarFacturacion(ID:string, facturacion:Facturacion){
    const temp={
      ...facturacion
    }
    return this.http.post(`${this.url}/facturacion/${ID}.json`,temp)
  }
  actuzalizarFacturacion(idCliente:string, facturacion:Facturacion){
    const temp = {
      ...facturacion
    };
    return this.http.put(`${ this.url }/facturacion/${ idCliente }.json`, temp);
  }
  consultaFacturacion(ID:string){
    return this.http.get(`${ this.url }/facturacion/${ ID }.json`)
    /*.pipe(
      map(this.crearArregloFacturacion)
    )*/
  }

  consultaCredito(ID:string){
    return this.http.get(`${ this.url }/creditos/${ ID }.json`)
  }

  crearCredito(ID:string, credito: Credito){
    const temp={
      ...credito
    }
    return this.http.post(`${this.url}/creditos/${ID}.json`,temp)
  }
  actualizarCredito(ID:string,id:string,credito: Credito){
    const temp={
      ...credito
    }
    return this.http.put(`${this.url}/creditos/${ID}/${id}.json`,temp)
  }
  consultaCreditos(ID){
    return this.http.get(`${ this.url }/creditos/${ ID }.json`)
    .pipe(
      map(this.crearArreglo)
    )
  }


  detallesClientePersonal(sucursal:string,cliente:string){
    return this.http.get(`${ this.url }/clientes/${sucursal}/${ cliente }.json`)
  }
  detallesClienteDirectorio(cliente:string){
    return this.http.get(`${ this.url }/directorios/${ cliente }/directorios.json`)
    .pipe(
      map(this.crearArreglo)
    )
  }
  detallesClienteFacturacion(cliente:string){
    return this.http.get(`${ this.url }/facturacion/${ cliente }.json`)
  }
  detallesClienteCredito(cliente:string){
    return this.http.get(`${ this.url }/creditos/${ cliente }.json`)
  }
  detallesClienteAutomoviles(sucursal:string, cliente:string){
    return this.http.get(`${ this.url }/vehiculos/${ cliente }.json`)
    .pipe(
      map(this.crearArreglo2)
    )
  }
  consultaCorreos(ID:string){
    return this.http.get(`${ this.url }/clientes/${ ID }.json`)
  }


  getEstados(){
    return this.http.get(`${ this.url }/estados.json`)
  }
  getInformacion(){
    return this.http.get(`${ this.url }/estados.json`)
  }

  

  //arreglos
  private crearArreglo(clientesObj:object){
    const clientes:any[]=[]
    if (clientesObj===null) { return [] }
    Object.keys(clientesObj).forEach(key=>{
      const cliente: any = clientesObj[key]
      clientes.push(cliente )
    })
    return clientes
  }
  private crearArreglo2(directorioObj:object){
    const directorios:any[]=[]
    if (directorioObj===null) { return [] }
    Object.keys(directorioObj).forEach(key=>{
      const directorio: any = directorioObj[key]
      directorio.id=key
      directorios.push(directorio )
    })
    return directorios
  }

}
