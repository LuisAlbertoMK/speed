import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(private http: HttpClient) { }
  getEstados(){
    //return this.http.get(`${ urlEstados }/get_estados?token=${tokenEstado}`);
    // return this.http.get(`https://apisgratis.com/cp/entidades/?salida=JSON`);
  }
  getMunicipios(estado:string){
    // return this.http.get(`${ urlEstados }/get_municipio_por_estado/${estado}?token=${tokenEstado}`);
   // ${ urlEstados }/get_municipio_por_estado/${estado}?token=${tokenEstado}
  }
}
