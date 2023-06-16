import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const urlServer = environment.firebaseConfig.databaseURL
const apiKey = environment.firebaseConfig.apiKey
const usuarios = 'https://identitytoolkit.googleapis.com/v1'

import { child, get, getDatabase, onValue, push, ref, set, update } from "firebase/database"
import { ServiciosPublicosService } from './servicios-publicos.service';
import { map } from 'rxjs';

const db = getDatabase()
const dbRef = ref(getDatabase());


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  decPassword:string = 'SpeedProSecureCondifidential' 
  constructor(private http: HttpClient, private _publicos: ServiciosPublicosService) { }


  consulta_usuarios_correos(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const starCountRef = ref(db, 'usuarios');
      onValue(starCountRef, (snapshot) => {
        if (snapshot.exists()) {
          const clientes = this._publicos.crearArreglo2(snapshot.val());
          clientes.map(c=>{
            c.fullname = `${c.nombre} ${c.apellidos}`
            const vehiculos = (c['vehiculos']) ? this._publicos.crearArreglo2(c['vehiculos']) : []
            c.vehiculos = vehiculos
          })
          resolve(clientes);
        } else {
          resolve([]);
        }
      });
    });
  }

  
  async listatecnicos(){
    const ans= {contenido:false, data:[]}
    await get(child(dbRef, `usuarios`)).then(async (snapshot) => {
      if (snapshot.exists()) {        
        const tecnicos =  await this._publicos.crearArreglo2(snapshot.val())
        const filtro = tecnicos.filter(o=>o.rol === 'tecnico')
        let dataShow=[]
        for (let index = 0; index < filtro.length; index++) {
          const element = filtro[index];
          dataShow.push({rol: element.rol, id:element.id,usuario: element.usuario,sucursal:element.sucursal})
        }
        ans.data = dataShow
        ans.contenido = true
      }
    }).catch((error) => {
      console.error(error);
    });
    return ans
  }
  




  async nuevoUsuario(data: any){
    const authData={...data,
      img:'https://firebasestorage.googleapis.com/v0/b/speed-pro-app.appspot.com/o/usuarios%2Fdefault.jpg?alt=media&token=439b5875-8b06-4f37-b522-a86dc4d7954b',
    }
    const ans = {inserccion:false, mensaje:'No se registro usuario intente de nuevo'}
    const newPostKey = push(child(ref(db), 'posts')).key
    await set(ref(db, `usuarios/${newPostKey}`), authData )
          .then(() => {
            ans.inserccion = true
            ans.mensaje = 'registro de usuario correcto'
          })
          .catch((error) => {
            // The write failed...
            ans.mensaje = ans.mensaje + ' ' + error
          });
    return ans
    // return this.http.post(`${usuarios}/accounts:signUp?key=${apiKey}`,authData)
  }
  guardaUsuarioData(sucursal_get:string,dataUsuario:any){
    const temp = {
      correo: dataUsuario.correo,
      password: dataUsuario.password,
      rol: dataUsuario.rol,
      status: dataUsuario.status,
      usuario: dataUsuario.usuario,
      sucursal: dataUsuario.sucursal
    }
    set(ref(db, `usuarios/${sucursal_get}/`), temp )
          .then(() => {
            // Data saved successfully!
          })
          .catch((error) => {
            // The write failed...
          });
    
    // return this.http.post(`${urlServer}/usuarios/${sucursal_get}.json`,temp)
  }
  guardaUsuarioDataSuperUsuarioAdministrador(sucursal_get:string,dataUsuario:any){
    const temp = {
      correo: dataUsuario.correo,
      password: dataUsuario.password,
      rol: dataUsuario.rol,
      status: dataUsuario.status,
      usuario: dataUsuario.usuario,
      sucursal: dataUsuario.sucursal
    }
    // return this.http.post(`${urlServer}/usuarios/${sucursal_get}.json`,temp)
  }
  getUsuarios(){
    return this.http.get(`${urlServer}/usuarios.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getListaUsuario(sucursal:string){
    return this.http.get(`${urlServer}/usuarios/${sucursal}.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  getDataUser(){
    return this.http.get(`${urlServer}/usuarios.json`)
  }
  restablecerCredenciales(usuario:any){
    let token = localStorage.getItem('tokenTemporal')
    const dataReset={
      idToken: token,
      email: usuario.correo,
      password:usuario.password,
      returnSecureToken: true
    }
    return this.http.post(`${usuarios}/accounts:update?key=${apiKey}`,dataReset)
  }
  restablecerPassword(usuario:any){    
    const dataReset={
      requestType: 'PASSWORD_RESET',
      email: usuario.correo,
      password: usuario.password
    }
    return this.http.post(`${usuarios}/accounts:sendOobCode?key=${apiKey}`,dataReset)
  }
  getInfoSuperSU(){
    return this.http.get(`${urlServer}/usuarios/SuperSU.json`)
    .pipe(
       map(this.crearArreglo2)
    )
  }
  actualizaUsuario(IDUsuario:string, dataUsuario:any){
    let sucursal = dataUsuario.sucursal
    const temp={
      ...dataUsuario
    }
    if (sucursal === 'Todas') {
      sucursal = 'SuperSU'
    }
    return this.http.put(`${urlServer}/usuarios/${sucursal}/${IDUsuario}.json`,temp)
  }
  actualizaStatus(data:any,status:boolean){
    const tempData={
      ...data,
      status
    }
    return this.http.put(`${urlServer}/usuarios/SuperSU/${data.id}.json`,tempData)
  }
  actualizaStatusSucursal(data:any,status:boolean){
    const tempData={
      ...data,
      status
    }
    return this.http.put(`${urlServer}/usuarios/${data.sucursal}/${data.id}.json`,tempData)
  }

  crearArreglo2(arrayObj: object) {
    const arrayGet: any[] = [];
    if (arrayObj === null) {
      return [];
    }
    Object.keys(arrayObj).forEach((key) => {
      const arraypush: any = arrayObj[key];
      arraypush.id = key;
      arrayGet.push(arraypush);
    });
    return arrayGet;
  }
  crearArreglo(clientesObj:object){
    const clientes:any[]=[]
    if (clientesObj===null) { return [] }
    Object.keys(clientesObj).forEach(key=>{
      const cliente: any = clientesObj[key]
      clientes.push(cliente )
    })
    return clientes
  }

}
