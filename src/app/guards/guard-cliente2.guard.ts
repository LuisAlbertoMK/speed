import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { EncriptadoService } from '../services/encriptado.service';

@Injectable({
  providedIn: 'root'
})
export class GuardCliente2Guard implements CanActivate {
  constructor( private _security:EncriptadoService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      const rol = this._security.servicioDecrypt(variableX['rol'])
    if (rol === 'cliente') {
      return true
    }else{
      window.location.href = '/inicio'
      // window.location.href = '/loginv1'
      return false
    }
  }
  
}
