import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EncriptadoService } from '../services/encriptado.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this._auth.estaAutenticado()) {
      return true
    }else{
      console.log(next);
      window.location.href = '/home'
      return false
    }
    
  }
  
  
}
