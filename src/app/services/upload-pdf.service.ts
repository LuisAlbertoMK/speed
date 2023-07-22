import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getStorage,ref, uploadBytes,uploadBytesResumable,getDownloadURL  } from "firebase/storage";

import { environment } from "../../environments/environment";
import { EmailsService } from './emails.service';
const urlServer = environment.firebaseConfig.databaseURL
const storage = getStorage()
@Injectable({
  providedIn: 'root'
})
export class UploadPDFService {
 
  constructor(private http: HttpClient,private _email:EmailsService) { }
  async upload(file:Blob,nombre:string){
    let answer = {ruta:'',error:[],progreso:0}
    const storageRef = ref(storage, 'PDF/cotizacionesRealizadas/'+nombre);
    const uploadTask = uploadBytesResumable(storageRef, file)
    await  uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
        answer.progreso = progress
      },
      (error) => {
        // Handle unsuccessful uploads
        answer.error.push(error)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        answer.ruta = downloadURL
       })
      }
    )
    return answer
  }
  async uploadRecepcion(file:Blob,nombre:string){
    let answer = {ruta:'',error:[],progreso:0}
    const storageRef = ref(storage, 'PDF/recepciones/'+nombre);
    const uploadTask = uploadBytesResumable(storageRef, file)
    await  uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
        answer.progreso = progress
      },
      (error) => {
        // Handle unsuccessful uploads
        answer.error.push(error)
      },
      async() => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
       await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        answer.ruta = downloadURL
       })
      }
    )
    return answer
  }
}
