import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { EncriptadoService } from '../services/encriptado.service';

@Injectable({
  providedIn: 'root'
})
export class GuardClienteGuard implements CanActivate {
  constructor(private _auth: AuthService, private router: Router, private _security:EncriptadoService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // const variableX = JSON.parse(localStorage.getItem('dataSecurity'))
      // const rol = this._security.servicioDecrypt(variableX['rol'])
    // if (rol === 'cliente') {
    //   window.location.href = '/inicio'
    //   return false
    // }else{
    //   // window.location.href = '/loginv1'
    //   return true
    // }
    const { rol } = this._security.usuarioRol()
    if(rol && rol ==='cliente') {
      window.location.href = '/inicio'
      return false
    } else{
      return true
    }
  }
  
}
