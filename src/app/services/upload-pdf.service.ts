
import { Injectable } from '@angular/core';
import { getStorage,ref,uploadBytesResumable,getDownloadURL  } from "firebase/storage";

const storage = getStorage()
@Injectable({
  providedIn: 'root'
})
export class UploadPDFService {
 
  constructor() { }
  async upload(file:Blob,nombre:string){
    let answer = {ruta:'',error:[],progreso:0}
    const storageRef = ref(storage, 'PDF/cotizaciones/'+nombre);
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
  async upload_pdf_entrega(file:Blob,nombre:string){
    const answer = {ruta:'',error:[],progreso:0}
    const storageRef = ref(storage, 'PDF/recepcionesEntregadas/'+nombre);
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
}
