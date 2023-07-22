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
  
}
