import { Injectable } from '@angular/core';

import { getStorage,ref, uploadBytes,uploadBytesResumable,getDownloadURL  } from "firebase/storage";
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";




const storage = getStorage()
const metadata = {
  contentType: 'image/png'
}
const urlServer = environment.firebaseConfig.databaseURL
@Injectable({
  providedIn: 'root'
})
export class UploadFirmaService {
  rutaIMG:string = ''
  constructor(private http: HttpClient) { }

   async upload(file:Blob,id:any,nombre:string,tipo:string){
    // console.log(dataRecepcion);
    let answer = {ruta:null,error:[],progreso:null}
    const storageRef = ref(storage, 'firmas/'+tipo+'/'+nombre);
    // Upload file and metadata to the object 'images/mountains.jpg'    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            // console.log(progress);
            
            break;
        }
        answer.progreso = progress
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log(error.code);
            
            break;
          case 'storage/canceled':
            // User canceled the upload
            
            break;
    
          // ...
    
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      ()  => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL);
          answer.ruta = downloadURL
        })
      })
      return answer
  
  }
}
