import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { FileItem } from 'src/app/models/FileItem.model';
//import * as firebase from 'firebase'
const urlServer = environment.firebaseConfig.databaseURL
@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  
  constructor( private http: HttpClient) { }
  private CARPETA_IMAGENES = 'recepciones/fotografiasDetalles';
  guardarImagen(IDsucursal:string,sucursaldata:any,imagenes:FileItem[]){
    const storage = getStorage()
    
      imagenes[0].estaSubiendo=true
      if ( imagenes[0].progreso >= 100 ) {
        return
      }
      const storageRef = ref(storage, 'sucursales/'+sucursaldata.sucursal);
      const uploadTask = uploadBytesResumable(storageRef, imagenes[0].archivo)
      uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        imagenes[0].progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if ( imagenes[0].progreso === 100) {
          imagenes[0].estaSubiendo = false
        }
        //console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            //console.log('Upload is paused');
            break;
          case 'running':
            //console.log('Upload is running')
            break;
        }
      },
      (error) => {
        console.log('Error al subir',error)
        return error
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          imagenes[0].estaSubiendo=false;
          const temp={
            ...sucursaldata
          }
          temp.imagen= downloadURL
          this.http.put(`${urlServer}/sucursales/${IDsucursal}.json`,temp).subscribe()
         
        })
      }
    )
    
    
    
    //this.db.collection(`/${this.CARPETA_IMAGEN_SUCURSAL}`)
    //.add(imagen)
    
  }
  guardarFotografias(imagenes:FileItem[],ruta:string){    
    const storage = getStorage()
    for ( const item of imagenes ) {
      item.estaSubiendo=true
      if ( item.progreso >= 100 ) {
        return
      }
      // (storage, 'firmas/'+tipo+'/'+nombre);
      const spl = ruta.split('/')      
      const storageRef = ref(storage, `${ this.CARPETA_IMAGENES }/ ${spl[0]}/${ item.nombreArchivo }`)
      const uploadTask = uploadBytesResumable(storageRef, item.archivo)
      uploadTask.on('state_changed',
      (snapshot) => {
        item.progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => console.log('Error al subir',error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          item.estaSubiendo=false;
          item.url = downloadURL
        })
      })
    }
  }
  // upload(file:Blob,id:any,nombre:string,tipo:string){
  async detallesPersonalizados(file:Blob,ruta:string){
    let answer = {ruta:null,error:[],progreso:null}
    const storage = getStorage()
    // for ( const item of imagenes ) {

      const storageRef = ref(storage, `${ruta}/detallesPersonalidos`);
      const uploadTask = uploadBytesResumable(storageRef, file)
      uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        answer.progreso = progress
      },
      (error) => console.log('Error al subir',error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          answer.ruta = downloadURL
        })
      })
    // }
    return answer
  }
  
}
